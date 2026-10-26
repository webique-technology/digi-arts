"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import DescriptionList from "./DescriptionList";
import { useCart } from "./CartProvider";
import { TEST_IDS } from "./testIds";
import {
  BULK_PRICE_TIERS,
  finalPrice,
  formatPrice,
  isOnSale,
  quantityLineTotal,
  quantityDiscount,
} from "@/lib/utils";
import { BsInfoCircle, BsChevronDown, BsChevronUp } from "react-icons/bs";
import { HiOutlineBuildingStorefront } from "react-icons/hi2";
import { TbTruckReturn, TbCashBanknote, TbTag } from "react-icons/tb";

const POPULAR_QTY = 30;

export default function ProductBuyBox({ product, preview = false }) {
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const soldOut = Number(product.stock) <= 0;
  const max = Math.max(1, Math.min(Number(product.stock) || 50, 50));
  const low = !soldOut && Number(product.stock) <= 5;
  const unitPrice = Number(finalPrice(product));
  const activeDiscount = quantityDiscount(qty);
  const activeTier =
    [...BULK_PRICE_TIERS].reverse().find((t) => qty >= t.qty) ||
    BULK_PRICE_TIERS[0];
  const exactTier = BULK_PRICE_TIERS.some((t) => t.qty === qty);
  const total = quantityLineTotal(unitPrice, qty);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${product.title} - Price: ${formatPrice(unitPrice)}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="product-buybox-container d-flex flex-column gap-3">
      {/* 1. Title & Price Card */}
      <div className="card border-0 shadow-sm p-3">
        <h1 className="h2 text-secondary fw-normal mb-2">{product.title}</h1>

        <div className="d-flex align-items-baseline gap-2 mb-1">
          <span className="h4 fw-bold text-dark">
            {formatPrice(unitPrice)} 
          </span>
          {isOnSale(product) && (
            <s className="text-muted small">{formatPrice(product.price)}</s>
          )}
          <BsInfoCircle className="text-muted small" />
        </div>

        {soldOut ? (
          <span className="badge bg-danger-subtle text-danger align-self-start mt-1">
            Out of stock
          </span>
        ) : (
          low && (
            <span className="badge bg-warning-subtle text-warning-emphasis align-self-start mt-1">
              Only {product.stock} items left
            </span>
          )
        )}
      </div>

      {/* 2. Select Size Card */}
      <div className="card border-0 shadow-sm p-3">
        <h4 className="h4 fw-bold mb-2">Select Size</h4>
        <div className="d-flex gap-2">
          <span className="badge rounded-pill size-chip border border-primary text-primary bg-white px-3 py-2 fs-6 fw-semibold">
            Free Size
          </span>
        </div>
      </div>

      {/* 3. Product Highlights & Specifications Card */}
      <div className="card border-0 shadow-sm p-3">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 fw-bold mb-0">Product Highlights</h2>
          <button
            type="button"
            onClick={handleCopy}
            className="btn btn-link p-0 text-decoration-none text-uppercase fw-bold copy-btn py-1 px-2"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="text-muted small mb-2">
          <div>Product Weight</div>
          <div className="text-dark fw-medium">{product.weight || "100"} g</div>
        </div>

        <hr className="my-2 opacity-25" />

        <div className="details-accordion">
          <button
            type="button"
            className="w-100 d-flex justify-content-between align-items-center border-0 bg-transparent p-0 py-2 text-dark fw-medium"
            onClick={() => setDetailsOpen(!detailsOpen)}
            aria-expanded={detailsOpen}
          >
            <span>Additional Details</span>
            {detailsOpen ? <BsChevronUp /> : <BsChevronDown />}
          </button>

          {detailsOpen && (
            <div className="details-table mt-2 pt-2 border-top">
              <div className="row py-1 text-muted small">
                <div className="col-6">Net Quantity (N)</div>
                <div className="col-6 text-dark fw-medium">1</div>
              </div>
              <div className="row py-1 text-muted small">
                <div className="col-6">Product Dimensions</div>
                <div className="col-6 text-dark fw-medium">
                  {product.dimensions || "23 x 30 Cms"}
                </div>
              </div>
              <div className="row py-1 text-muted small">
                <div className="col-6">Generic Name</div>
                <div className="col-6 text-dark fw-medium">Home Décor</div>
              </div>
              <div className="row py-1 text-muted small">
                <div className="col-6">Country of Origin</div>
                <div className="col-6 text-dark fw-medium">India</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Description */}
      {product.description && (
        <div className="card border-0 shadow-sm p-3 mt-2">
          <h4 className="h4 fw-bold mb-2">Description</h4>
          <DescriptionList text={product.description} />
        </div>
      )}

      {/* 5. Quantity & Bulk Discounts (if in stock) */}
      {/* {!soldOut && (
        <div className="card border-0 shadow-sm p-3">
          <div className="d-flex align-items-center justify-content-start gap-3 mb-3">
            <label className="h6 fw-bold mb-0" htmlFor="qty">
              Quantity
            </label>
            <div className="input-group qty-stepper-group w-auto">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease quantity"
                data-testid={TEST_IDS.productQuantityDecrease}
              >
                −
              </button>
              <input
                id="qty"
                type="number"
                min="1"
                max={max}
                value={qty}
                className="form-control text-center"
                onChange={(e) =>
                  setQty(
                    Math.min(max, Math.max(1, Number(e.target.value) || 1)),
                  )
                }
                data-testid={TEST_IDS.productQuantity}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setQty(Math.min(max, qty + 1))}
                aria-label="Increase quantity"
                data-testid={TEST_IDS.productQuantityIncrease}
              >
                +
              </button>
            </div>
          </div>

          <fieldset className="buybox__tiers border-top pt-3">
            <legend className="h6 fw-bold mb-2">Stock Up and Save</legend>
            <div className="d-flex flex-row justify-content-center gap-2">
              {BULK_PRICE_TIERS.map((tier) => {
                const selected = exactTier
                  ? qty === tier.qty
                  : activeTier.qty === tier.qty;
                return (
                  <label
                    className={`card p-2 cursor-pointer flex-column align-items-center justify-content-between ${
                      selected ? "border-primary bg-primary-subtle" : ""
                    } ${tier.qty > max ? "opacity-50" : ""}`}
                    key={tier.qty}
                    data-testid={TEST_IDS.productBulkOption(tier.qty)}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <input
                        type="radio"
                        name="bulk-quantity"
                        checked={selected}
                        disabled={tier.qty > max}
                        onChange={() => setQty(tier.qty)}
                        className="form-check-input mt-0"
                      />
                      <div>
                        <div className="fw-semibold small">{tier.label}</div>
                        <small className="text-muted">
                          {tier.discount
                            ? `You save ${tier.discount}%`
                            : tier.note}
                        </small>
                      </div>
                    </div>

                    <div className="text-end">
                      <strong className="d-block small">
                        {formatPrice(quantityLineTotal(unitPrice, tier.qty))}
                      </strong>
                      {tier.discount > 0 && (
                        <s className="text-muted small">
                          {formatPrice(unitPrice * tier.qty)}
                        </s>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            {(qty > 1 || activeDiscount > 0) && (
              <p className="small text-success mt-2 mb-0" aria-live="polite">
                {qty} {qty === 1 ? "set" : "sets"} ·{" "}
                <strong>{formatPrice(total)}</strong>
                {activeDiscount > 0 && <> · you save {activeDiscount}%</>}
              </p>
            )}
          </fieldset>
        </div>
      )} */}

      {/* 6. Action CTA Buttons */}
      <div className="d-flex gap-2 mt-2">
        <AddToCartButton
          product={product}
          qty={qty}
          className="flex-fill btn btn-outline-primary py-2"
          preview={preview}
        />
        {!soldOut && (
          <button
            type="button"
            className="button secondary-btn flex-fill py-2 fw-semibold"
            disabled={preview}
            onClick={() => {
              add(product, qty, { openDrawer: false });
              router.push("/checkout");
            }}
            data-testid={TEST_IDS.productBuyNow}
          >
            » Buy Now
          </button>
        )}
      </div>

      {/* 7. Trust Badges */}
      <div className="card border-0 shadow-sm p-3 trust-badges-card">
        <div className="row text-center g-2">
          <div className="col-4 border-end">
            <div className="trust-icon mx-auto mb-1 rounded-circle d-flex align-items-center justify-content-center">
              <TbTag className="text-success h2 m-0" />
            </div>
            <span className="small d-block text-muted">Lowest Price</span>
          </div>
          <div className="col-4 border-end">
            <div className="trust-icon mx-auto mb-1 rounded-circle d-flex align-items-center justify-content-center">
              <TbCashBanknote className="text-success h2 m-0" />
            </div>
            <span className="small d-block text-muted">Cash on Delivery</span>
          </div>
          <div className="col-4">
            <div className="trust-icon mx-auto mb-1 rounded-circle d-flex align-items-center justify-content-center">
              <TbTruckReturn className="text-success h2 m-0" />
            </div>
            <span className="small d-block text-muted">7-day Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
}
