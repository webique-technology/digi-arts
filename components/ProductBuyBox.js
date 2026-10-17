'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import DescriptionList from './DescriptionList';
import { useCart } from './CartProvider';
import { TEST_IDS } from './testIds';
import { BULK_PRICE_TIERS, finalPrice, formatPrice, isOnSale, quantityLineTotal, quantityDiscount } from '@/lib/utils';

const POPULAR_QTY = 30;

export default function ProductBuyBox({ product, preview = false }) {
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const soldOut = Number(product.stock) <= 0;
  const max = Math.max(1, Math.min(Number(product.stock) || 50, 50));
  const low = !soldOut && Number(product.stock) <= 5;
  const unitPrice = Number(finalPrice(product));
  const activeDiscount = quantityDiscount(qty);
  const activeTier = [...BULK_PRICE_TIERS].reverse().find((t) => qty >= t.qty) || BULK_PRICE_TIERS[0];
  const exactTier = BULK_PRICE_TIERS.some((t) => t.qty === qty);
  const total = quantityLineTotal(unitPrice, qty);

  return (
    <div className="buybox">
      {soldOut && <p className="stock stock--out">Out of stock · {formatPrice(unitPrice)}</p>}
      {low && <p className="stock stock--low">Only {product.stock} left</p>}

      <div className="buybox__price">
        <strong>{formatPrice(unitPrice)}</strong>
        {isOnSale(product) && <s>{formatPrice(product.price)}</s>}
        <span>per set</span>
      </div>

      {!soldOut && (
        <div className="buybox__block">
          <label className="buybox__label" htmlFor="qty">Quantity</label>
          <div className="qty">
            <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="Decrease quantity" data-testid={TEST_IDS.productQuantityDecrease}>−</button>
            <input id="qty" type="number" min="1" max={max} value={qty} onChange={(e) => setQty(Math.min(max, Math.max(1, Number(e.target.value) || 1)))} data-testid={TEST_IDS.productQuantity} />
            <button type="button" onClick={() => setQty(Math.min(max, qty + 1))} aria-label="Increase quantity" data-testid={TEST_IDS.productQuantityIncrease}>+</button>
          </div>
        </div>
      )}

      <AddToCartButton product={product} qty={qty} className="buybox__btn" preview={preview} />
      {!soldOut && (
        <button type="button" className="btn btn--dark buybox__btn" disabled={preview} onClick={() => { add(product, qty, { openDrawer: false }); router.push('/checkout'); }} data-testid={TEST_IDS.productBuyNow}>
          {preview ? 'Preview only' : 'Buy it now'}
        </button>
      )}

      {!soldOut && (
        <fieldset className="buybox__tiers">
          <legend>Stock Up and Save</legend>
          {BULK_PRICE_TIERS.map((tier) => {
            const selected = exactTier ? qty === tier.qty : activeTier.qty === tier.qty;
            return (
              <label className={`buybox__tier${selected ? ' is-active' : ''}${tier.qty > max ? ' is-disabled' : ''}`} key={tier.qty} data-testid={TEST_IDS.productBulkOption(tier.qty)}>
                {tier.qty === POPULAR_QTY && <span className="buybox__badge">Most popular</span>}
                <input type="radio" name="bulk-quantity" checked={selected} disabled={tier.qty > max} onChange={() => setQty(tier.qty)} />
                <span className="buybox__radio" aria-hidden="true" />
                <span className="buybox__tier-copy"><strong>{tier.label}</strong><small>{tier.discount ? `You save ${tier.discount}%` : tier.note}</small></span>
                <span className="buybox__tier-price"><strong>{formatPrice(quantityLineTotal(unitPrice, tier.qty))}</strong>{tier.discount > 0 && <s>{formatPrice(unitPrice * tier.qty)}</s>}</span>
              </label>
            );
          })}
          {(qty > 1 || activeDiscount > 0) && (
            <p className="buybox__saving" aria-live="polite">
              {qty} {qty === 1 ? 'set' : 'sets'} · <strong>{formatPrice(total)}</strong>{activeDiscount > 0 && <> · you save {activeDiscount}%</>}
            </p>
          )}
        </fieldset>
      )}

      {product.description && (
        <div className="product__description"><h2>Description</h2><DescriptionList text={product.description} /></div>
      )}
    </div>
  );
}
