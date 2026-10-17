'use client';
import Link from 'next/link';
import { useCart } from './CartProvider';
import { imageUrl } from '@/lib/api';
import { formatPrice, shippingFor, FREE_SHIPPING_ABOVE, quantityDiscount, quantityLineTotal, quantityUnitPrice } from '@/lib/utils';
import { TEST_IDS } from './testIds';

export default function CartView() {
  const { items, ready, setQty, remove, subtotal, hasPreviewItems } = useCart();
  if (!ready) return <div className="cartpage__loading skeleton" style={{ height: 240 }} />;
  if (!items.length) return (
    <div className="empty-state"><h2>Your cart is empty</h2><p>Looks like you haven’t added anything yet.</p><Link href="/products" className="btn">Continue shopping</Link></div>
  );
  const ship = shippingFor(subtotal);
  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_ABOVE) * 100, 100);
  return (
    <div className="cartpage">
      <div className="cartpage__list">
        <div className="cartpage__head"><span>Product</span><span>Quantity</span><span>Total</span></div>
        {items.map((i) => (
          <div className="cartrow" key={i.key || `live:${i.id}`}>
            <div className="cartrow__prod">
              {i.image ? <img src={imageUrl(i.image)} alt="" /> : <div className="visual-ph" />}
              <div><Link href={`/products/${i.slug}`}>{i.title}</Link>{i.preview && <small className="cart__save">Demo preview item</small>}<div className="cartrow__price">{formatPrice(quantityUnitPrice(i.price, i.qty))}{quantityDiscount(i.qty) > 0 && <> <s>{formatPrice(i.price)}</s><small> · {quantityDiscount(i.qty)}% bulk saving</small></>}</div>
                <button className="cartrow__remove" onClick={() => remove(i)}>Remove</button></div>
            </div>
            <div className="qty qty--sm">
              <button onClick={() => setQty(i, i.qty - 1)} aria-label="Decrease quantity">−</button>
              <span>{i.qty}</span>
              <button onClick={() => setQty(i, i.qty + 1)} aria-label="Increase quantity">+</button>
            </div>
            <div className="cartrow__total">{formatPrice(quantityLineTotal(i.price, i.qty))}</div>
          </div>
        ))}
      </div>
      <aside className="summary" aria-label="Order summary">
        <div className="summary__heading"><h2>Order summary</h2><span>{items.reduce((count, item) => count + item.qty, 0)} items</span></div>
        <div className="summary__shipping">
          <p>{ship === 0 ? 'You’ve unlocked free shipping.' : `You’re ${formatPrice(FREE_SHIPPING_ABOVE - subtotal)} away from free shipping.`}</p>
          <div className="summary__progress" role="progressbar" aria-label="Progress toward free shipping" aria-valuemin="0" aria-valuemax={FREE_SHIPPING_ABOVE} aria-valuenow={Math.min(subtotal, FREE_SHIPPING_ABOVE)}>
            <span style={{ width: `${freeShippingProgress}%` }} />
          </div>
        </div>
        <div className="summary__row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
        <div className="summary__row"><span>Shipping</span><span>{ship === 0 ? 'Free' : formatPrice(ship)}</span></div>
        <div className="summary__row summary__row--total"><span>Estimated total</span><span>{formatPrice(subtotal + ship)}</span></div>
        <p className="summary__hint">{hasPreviewItems ? 'Demo preview items cannot be purchased. Remove them to continue to checkout.' : 'Shipping and taxes are calculated at checkout.'}</p>
        {hasPreviewItems
          ? <button type="button" className="btn summary__checkout" disabled data-testid={TEST_IDS.cartCheckoutUnavailable}>Checkout unavailable</button>
          : <Link href="/checkout" className="btn summary__checkout">Proceed to checkout</Link>}
        <Link href="/products" className="summary__link">Continue shopping</Link>
      </aside>
    </div>
  );
}
