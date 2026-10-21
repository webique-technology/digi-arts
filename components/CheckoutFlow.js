'use client';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from './Logo';
import FormField from './FormField';
import { useCart } from './CartProvider';
import { imageUrl } from '@/lib/api';
import { rupee, formatPrice, shippingFor, onlyDigits, quantityLineTotal, quantityDiscount, quantityUnitPrice } from '@/lib/utils';
import { ArrowLeft, BagIcon, ChevronDown, ChevronUp, TagIcon, TrashIcon, TruckIcon, CheckIcon } from './Icons';

const STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Other'];
const STEPS = ['Contact', 'Address', 'Payment'];
const SAVED = 'Digi Art’s Store_customer';
const EMPTY = { customer_name: '', phone: '', email: '', address: '', city: '', state: 'Rajasthan', pincode: '', notes: '' };
const ADDRESS_KEYS = ['customer_name', 'email', 'address', 'city', 'state', 'pincode'];

// Module-level (never define components inside components, inputs would lose focus)
function Shell({ total, back, children }) {
  return (
    <div className="co">
      <div className="co__card">
        <header className="co__head">
          {back}
          <Link href="/" className="co__logo" aria-label="Digi Art’s Store home"><Logo /></Link>
          <strong className="co__total">{total != null ? rupee(total) : ''}</strong>
        </header>
        {children}
      </div>
    </div>
  );
}

export default function CheckoutFlow() {
  const router = useRouter();
  const { items, ready, subtotal, count, setQty, remove, clear, hasPreviewItems } = useCart();
  const [step, setStep] = useState(1);
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [code, setCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponBusy, setCouponBusy] = useState(false);
  const set = (k) => (e) => { const v = e.target.value; setF((s) => ({ ...s, [k]: v })); setErrors((er) => (er[k] ? { ...er, [k]: undefined } : er)); };

  useEffect(() => { // returning customers get their details back
    try { const s = JSON.parse(localStorage.getItem(SAVED) || 'null'); if (s) setF((cur) => ({ ...cur, ...s, notes: '' })); } catch {}
  }, []);
  useEffect(() => { setSummaryOpen(step === 1); window.scrollTo?.(0, 0); }, [step]);

  const applyCode = useCallback(async (c, sub, silent = false) => {
    setCouponBusy(true); if (!silent) setCouponMsg('');
    try {
      const res = await fetch('/api/coupons/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: c, subtotal: sub }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || j.success === false) throw new Error(j.data?.coupon || j.message || 'Could not apply this coupon');
      setCoupon(j.data); setCouponMsg('');
    } catch (err) { setCoupon(null); setCouponMsg(err.message); } finally { setCouponBusy(false); }
  }, []);
  // cart changed while a coupon is applied -> re-check it (minimum order, cap, etc.)
  useEffect(() => { if (coupon) applyCode(coupon.code, subtotal, true); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [subtotal]);

  const discount = coupon ? Math.min(coupon.discount, subtotal) : 0;
  const ship = shippingFor(subtotal);
  const total = Math.round((subtotal - discount + ship) * 100) / 100;

  if (!ready) return <Shell><div className="skeleton" style={{ height: 380, margin: 20 }} /></Shell>;
  if (!items.length) return (
    <Shell back={<Link href="/products" className="co__back" aria-label="Back to shop"><ArrowLeft /></Link>}>
      <div className="co__empty"><h2>Your cart is empty</h2><p>Add something lovely before checking out.</p><Link href="/products" className="co__cta">Shop now</Link></div>
    </Shell>
  );
  if (hasPreviewItems) return (
    <Shell back={<Link href="/cart" className="co__back" aria-label="Back to cart"><ArrowLeft /></Link>}>
      <div className="co__empty" role="alert">
        <h2>Demo preview items can’t be purchased</h2>
        <p>The store API is offline. Remove demo items from your cart and reconnect the store before placing an order.</p>
        <Link href="/cart" className="co__cta">Return to cart</Link>
      </div>
    </Shell>
  );

  const goAddress = () => {
    const e = {};
    if (!/^[6-9]\d{9}$/.test(onlyDigits(f.phone).slice(-10))) e.phone = 'Enter a valid 10-digit mobile number';
    setErrors(e); if (!Object.keys(e).length) { setFormError(''); setStep(2); }
  };
  const goPayment = () => {
    const e = {};
    if (f.customer_name.trim().length < 2) e.customer_name = 'Enter your full name';
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email';
    if (f.address.trim().length < 5) e.address = 'Enter your full address';
    if (!f.city.trim()) e.city = 'Enter your city';
    if (!/^\d{6}$/.test(f.pincode)) e.pincode = 'Enter a 6-digit pincode';
    setErrors(e);
    if (Object.keys(e).length) { setTimeout(() => document.querySelector('.fielderr')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50); return; }
    setFormError(''); setStep(3);
  };

  async function placeOrder() {
    setFormError(''); setBusy(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, phone: onlyDigits(f.phone).slice(-10), coupon_code: coupon?.code || '', items: items.map((i) => ({ id: i.id, qty: i.qty })) }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === false) {
        if (res.status === 422 && json.data) {
          setErrors(json.data);
          if (json.data.coupon) { setCouponMsg(json.data.coupon); setCoupon(null); setStep(1); }
          else if (json.data.phone) setStep(1);
          else if (ADDRESS_KEYS.some((k) => json.data[k])) setStep(2);
          if (json.data.items) throw new Error(json.data.items);
        }
        throw new Error(json.message || 'Could not place your order. Please try again.');
      }
      try {
        localStorage.setItem(SAVED, JSON.stringify({ customer_name: f.customer_name, phone: onlyDigits(f.phone).slice(-10), email: f.email, address: f.address, city: f.city, state: f.state, pincode: f.pincode }));
        sessionStorage.setItem('Digi Art’s Store_last_order', JSON.stringify({ ...json.data, name: f.customer_name, phone: onlyDigits(f.phone).slice(-10) }));
      } catch {}
      clear();
      router.push('/order-success');
    } catch (err) { setFormError(err.message); } finally { setBusy(false); }
  }

  const back = step > 1
    ? <button type="button" className="co__back" onClick={() => setStep(step - 1)} aria-label="Go back"><ArrowLeft /></button>
    : <Link href="/cart" className="co__back" aria-label="Back to cart"><ArrowLeft /></Link>;

  return (
    <Shell total={total} back={back}>
      <ol className="co__steps" aria-label="Checkout progress">
        {STEPS.map((s, n) => (
          <li key={s} className={step === n + 1 ? 'is-active' : step > n + 1 ? 'is-done' : ''} aria-current={step === n + 1 ? 'step' : undefined}>
            <span>{step > n + 1 ? <CheckIcon width={13} height={13} /> : n + 1}</span>{s}
          </li>
        ))}
      </ol>

      {/* ---------- order summary ---------- */}
      <section className="co__sum" aria-label="Order summary">
        <button type="button" className="co__sumhead" onClick={() => setSummaryOpen(!summaryOpen)} aria-expanded={summaryOpen}>
          <span><BagIcon width={18} height={18} /> Order summary</span>
          <span>{count} item{count === 1 ? '' : 's'} {summaryOpen ? <ChevronUp /> : <ChevronDown width={16} height={16} />}</span>
        </button>
        {summaryOpen && (
          <div className="co__sumbody">
            <ul>
              {items.map((i) => {
                const disc = quantityDiscount(i.qty);
                return (
                  <li key={i.id} className="co__item">
                    {i.image ? <img src={imageUrl(i.image)} alt="" /> : <div className="visual-ph" />}
                    <div className="co__itembody">
                      <div className="co__itemtop"><span>{i.title}</span><strong>{rupee(quantityLineTotal(i.price, i.qty))}</strong></div>
                      {disc > 0 && <small>{formatPrice(quantityUnitPrice(i.price, i.qty))} each · {disc}% bulk saving</small>}
                      {step === 1 ? (
                        <div className="co__itemctl">
                          <button type="button" className="co__trash" onClick={() => remove(i.id)} aria-label={`Remove ${i.title}`}><TrashIcon /></button>
                          <div className="co__qty">
                            <button type="button" onClick={() => setQty(i.id, i.qty - 1)} aria-label={`Decrease ${i.title} quantity`}>−</button>
                            <span>{i.qty}</span>
                            <button type="button" onClick={() => setQty(i.id, i.qty + 1)} aria-label={`Increase ${i.title} quantity`}>+</button>
                          </div>
                        </div>
                      ) : <small>Qty {i.qty}</small>}
                    </div>
                  </li>
                );
              })}
            </ul>
            <dl className="co__totals">
              <div><dt>Subtotal</dt><dd>{rupee(subtotal)}</dd></div>
              {discount > 0 && <div className="co__disc"><dt>Coupon ({coupon.code})</dt><dd>−{rupee(discount)}</dd></div>}
              <div><dt>Shipping</dt><dd>{step === 1 ? <span className="co__muted">Calculated at next step</span> : ship === 0 ? 'Free' : rupee(ship)}</dd></div>
              <div className="co__grand"><dt>Total</dt><dd>{rupee(step === 1 ? subtotal - discount : total)}</dd></div>
            </dl>
          </div>
        )}
      </section>

      {formError && <div className="co__alert" role="alert">{formError} {/(cart|stock|left|available)/i.test(formError) && <Link href="/cart">Review cart</Link>}</div>}

      {/* ---------- step 1: contact + offers ---------- */}
      {step === 1 && (
        <>
          <div className="co__offers">Offers &amp; Rewards</div>
          <div className="co__pad">
            {coupon ? (
              <div className="co__applied"><CheckIcon /><span><strong>{coupon.code}</strong> applied · {coupon.label}</span>
                <button type="button" onClick={() => { setCoupon(null); setCode(''); }}>Remove</button></div>
            ) : (
              <form className="co__coupon" onSubmit={(e) => { e.preventDefault(); if (code.trim()) applyCode(code.trim(), subtotal); }}>
                <TagIcon />
                <input placeholder="Enter coupon code" aria-label="Coupon code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} autoCapitalize="characters" maxLength={30} />
                <button type="submit" disabled={couponBusy || !code.trim()}>{couponBusy ? '…' : 'Apply'}</button>
              </form>
            )}
            {couponMsg && <p className="co__err" role="alert">{couponMsg}</p>}

            <div className={`co__phone ${errors.phone ? 'has-error' : ''}`}>
              <span className="co__flag" aria-hidden="true" />
              <span className="co__cc">+91</span>
              <input type="tel" inputMode="numeric" autoComplete="tel" placeholder="Mobile number" aria-label="Mobile number" value={f.phone} onChange={set('phone')} maxLength={14}
                onKeyDown={(e) => e.key === 'Enter' && goAddress()} />
            </div>
            {errors.phone && <p className="co__err" role="alert">{errors.phone}</p>}
            <button type="button" className="co__cta" onClick={goAddress}>Add address</button>
            <div className="co__dispatch"><TruckIcon /><span>Dispatch within<br />48 hours</span></div>
          </div>
        </>
      )}

      {/* ---------- step 2: address ---------- */}
      {step === 2 && (
        <div className="co__pad">
          <h2 className="co__h">Delivery address</h2>
          <FormField id="customer_name" label="Full name *" autoComplete="name" value={f.customer_name} onChange={set('customer_name')} error={errors.customer_name} />
          <FormField id="address" label="Address *" autoComplete="street-address" value={f.address} onChange={set('address')} error={errors.address} />
          <div className="co__two">
            <FormField id="pincode" label="Pincode *" inputMode="numeric" maxLength={6} autoComplete="postal-code" value={f.pincode} onChange={set('pincode')} error={errors.pincode} />
            <FormField id="city" label="City *" autoComplete="address-level2" value={f.city} onChange={set('city')} error={errors.city} />
          </div>
          <div className="field"><label htmlFor="state">State *</label><select id="state" value={f.state} onChange={set('state')}>{STATES.map((s) => <option key={s}>{s}</option>)}</select></div>
          <FormField id="email" type="email" label="Email (optional, for order updates)" autoComplete="email" value={f.email} onChange={set('email')} error={errors.email} />
          <button type="button" className="co__cta" onClick={goPayment}>Continue to payment</button>
        </div>
      )}

      {/* ---------- step 3: payment ---------- */}
      {step === 3 && (
        <div className="co__pad">
          <div className="co__recap"><div><small>Contact</small><span>+91 {onlyDigits(f.phone).slice(-10)}</span></div><button type="button" onClick={() => setStep(1)}>Change</button></div>
          <div className="co__recap"><div><small>Deliver to</small><span>{f.customer_name}<br />{f.address}, {f.city}, {f.state} {f.pincode}</span></div><button type="button" onClick={() => setStep(2)}>Change</button></div>

          <h2 className="co__h">Payment</h2>
          <label className="co__pay"><input type="radio" checked readOnly /><span><strong>Cash on delivery</strong><small>Pay when your order arrives. We’ll call you to confirm before dispatch.</small></span></label>

          <div className="field" style={{ marginTop: 14 }}><label htmlFor="notes">Order notes (optional)</label>
            <textarea id="notes" rows={2} value={f.notes} onChange={set('notes')} placeholder="Gift message, delivery instructions…" maxLength={500} /></div>

          <button type="button" className="co__cta" onClick={placeOrder} disabled={busy}>{busy ? 'Placing order…' : `Place order · ${rupee(total)}`}</button>
          <div className="co__dispatch"><TruckIcon /><span>Dispatch within<br />48 hours</span></div>
        </div>
      )}
    </Shell>
  );
}
