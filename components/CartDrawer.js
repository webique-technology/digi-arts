'use client';
import Link from 'next/link';
import { useCallback, useEffect } from 'react';
import { useCart } from './CartProvider';
import { imageUrl } from '@/lib/api';
import { formatPrice, rupee, FREE_SHIPPING_ABOVE, quantityDiscount, quantityLineTotal, quantityUnitPrice } from '@/lib/utils';
import { CloseIcon, TrashIcon, CheckIcon } from './Icons';
import { TEST_IDS } from './testIds';

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, subtotal, count, hasPreviewItems } = useCart();
  const close = useCallback(() => setOpen(false), [setOpen]);
  const toFree = Math.max(0, FREE_SHIPPING_ABOVE - subtotal);
  const done = toFree === 0;
  const progress = Math.min((subtotal / FREE_SHIPPING_ABOVE) * 100, 100);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => { if (event.key === 'Escape') close(); };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', closeOnEscape); };
  }, [open, close]);

  return (
    <div className={`cart ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <button className="cart__backdrop" type="button" onClick={close} aria-label="Close cart" tabIndex={open ? 0 : -1} data-testid={TEST_IDS.cartBackdrop} />
      <aside className="cart__panel" role="dialog" aria-modal={open ? 'true' : undefined} aria-label="Shopping cart">
        <div className="cart__head">
          <h2>Your cart <span>({count})</span></h2>
          <button type="button" onClick={close} aria-label="Close cart" tabIndex={open ? 0 : -1} data-testid={TEST_IDS.cartClose}><CloseIcon width={20} height={20} /></button>
        </div>

        {!items.length ? (
          <div className="cart__empty"><p>Your cart is empty</p><Link href="/products" className="btn" onClick={close}>Continue shopping</Link></div>
        ) : (
          <>
            <div className="cart__mile">
              <p role="status" className={done ? 'is-done' : ''}>{done ? 'You have successfully reached the milestone' : <>Add <strong>{formatPrice(toFree)}</strong> more to get free shipping</>}</p>
              <div className="cart__track" role="progressbar" aria-label="Progress toward free shipping" aria-valuemin="0" aria-valuemax={FREE_SHIPPING_ABOVE} aria-valuenow={Math.min(subtotal, FREE_SHIPPING_ABOVE)}>
                <div className="cart__bar"><span style={{ width: `${progress}%` }} /></div>
                <div className={`cart__goal ${done ? 'is-done' : ''}`}><small>{rupee(FREE_SHIPPING_ABOVE)}</small><span>{done && <CheckIcon />}</span><small>Free shipping</small></div>
              </div>
            </div>

            <ul className="cart__items">
              {items.map((i) => {
                const disc = quantityDiscount(i.qty);
                const testId = i.preview ? i.key : i.id;
                return (
                  <li key={i.key || `live:${i.id}`}>
                    {i.image ? <img src={imageUrl(i.image)} alt="" /> : <div className="visual-ph" />}
                    <div className="cart__body">
                      <div className="cart__row">
                        <Link href={`/products/${i.slug}`} onClick={close}>{i.title}</Link>
                        <strong className="cart__line-total">{rupee(quantityLineTotal(i.price, i.qty))}</strong>
                      </div>
                      {i.preview && <small className="cart__save">Demo preview item</small>}
                      {disc > 0 && <small className="cart__save">{formatPrice(quantityUnitPrice(i.price, i.qty))} each · {disc}% bulk saving</small>}
                      <div className="cart__ctrl">
                        <button type="button" className="cart__trash" onClick={() => remove(i)} aria-label={`Remove ${i.title}`} data-testid={TEST_IDS.cartRemove(testId)}><TrashIcon /></button>
                        <div className="cart__qty">
                          <button type="button" onClick={() => setQty(i, i.qty - 1)} aria-label={`Decrease ${i.title} quantity`} data-testid={TEST_IDS.cartQuantityDecrease(testId)}>−</button>
                          <span aria-live="polite">{i.qty}</span>
                          <button type="button" onClick={() => setQty(i, i.qty + 1)} aria-label={`Increase ${i.title} quantity`} data-testid={TEST_IDS.cartQuantityIncrease(testId)}>+</button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="cart__foot">
              <div className="cart__est"><span>Estimated total</span><strong>{rupee(subtotal)}</strong></div>
              {hasPreviewItems ? (
                <>
                  <p>Preview items can’t be purchased. Remove them to continue to checkout.</p>
                  <button type="button" className="cart__checkout" disabled data-testid={TEST_IDS.cartCheckoutUnavailable}>Checkout unavailable</button>
                </>
              ) : (
                <>
                  <p>Shipping and coupons are applied at checkout.</p>
                  <Link href="/checkout" className="cart__checkout" onClick={close} data-testid={TEST_IDS.cartCheckout}>Checkout</Link>
                </>
              )}
              <Link href="/cart" className="cart__viewlink" onClick={close} data-testid={TEST_IDS.cartView}>View cart</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
