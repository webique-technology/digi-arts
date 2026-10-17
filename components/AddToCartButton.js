'use client';
import { useCart } from './CartProvider';
import { BagIcon } from './Icons';
import { TEST_IDS } from './testIds';

export default function AddToCartButton({ product, qty = 1, icon = false, className = '', preview = false }) {
  const { add } = useCart();
  const soldOut = product.stock != null && Number(product.stock) <= 0;
  const disabled = soldOut;
  return (
    <button type="button" className={`btn btn-cart ${className}`} disabled={disabled} onClick={() => add(product, qty, { preview })} aria-label={preview ? `Add demo product ${product.title} to cart` : undefined} data-testid={TEST_IDS.addToCart(product.id ?? product.slug)}>
      {icon && !soldOut && <BagIcon width={16} height={16} />}
      {soldOut ? 'Out of stock' : 'Add to cart'}
    </button>
  );
}
