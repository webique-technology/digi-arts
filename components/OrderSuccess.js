'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';

export default function OrderSuccess() {
  const [o, setO] = useState(undefined);
  useEffect(() => { window.scrollTo(0, 0); try { setO(JSON.parse(sessionStorage.getItem('damani_last_order') || 'null')); } catch { setO(null); } }, []);
  if (o === undefined) return null;
  return (
    <div className="success">
      <div className="success__icon" aria-hidden>✓</div>
      <h1>{o ? `Thank you, ${o.name.split(' ')[0]}!` : 'Thank you!'}</h1>
      <p>{o ? 'Your order has been placed.' : 'If you just placed an order, our team will contact you soon.'}</p>
      {o && (
        <div className="success__card">
          <div><span>Order number</span><strong>{o.order_number}</strong></div>
          <div><span>Total to pay on delivery</span><strong>{formatPrice(o.total)}</strong></div>
          <div><span>We will call you on</span><strong>+91 {o.phone}</strong></div>
        </div>
      )}
      <Link href="/products" className="btn">Continue shopping</Link>
    </div>
  );
}
