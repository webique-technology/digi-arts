"use client";

import { useState } from "react";
import Link from "next/link";

function HeartIcon({ filled = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="12"
        cy="12"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L22 8H6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="20" r="1.4" fill="currentColor" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

function ProductImage({ src, name }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="dummy-product__image-wrap">
      {!failed && src ? (
        <img
          src={src}
          alt={name}
          className="dummy-product__image"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="dummy-product__image-fallback">
          <span>DA</span>
          <small>DIGI ART'S</small>
        </div>
      )}
    </div>
  );
}

export function ProductCard({ product }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [quickView, setQuickView] = useState(false);

  // Guard against missing or malformed data
  if (!product || typeof product !== "object" || Array.isArray(product)) {
    return null;
  }

  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice) || 0;

  const inStock =
    product.stock !== null &&
    product.stock !== undefined &&
    Number(product.stock) > 0;

  const detailHref = `/products/${product.id}`;

  const discount =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    setAdded(true);
  };

  return (
    <>
      <article className="dummy-product">
        <div className="dummy-product__visual">
          <Link
            href={detailHref}
            className="dummy-product__detail-link"
            aria-label={`View ${product.name} details`}
          >
            <ProductImage src={product.image} name={product.name} />
          </Link>

          {product.badge && (
            <span
              className={`dummy-product__badge ${
                product.badge.toLowerCase() === "new"
                  ? "dummy-product__badge--new"
                  : ""
              }`}
            >
              {product.badge}
            </span>
          )}

          {discount > 0 && (
            <span className="dummy-product__discount">-{discount}%</span>
          )}

          <div className="dummy-product__quick-actions">
            <button
              type="button"
              className={`dummy-product__icon-btn ${
                wishlisted ? "is-active" : ""
              }`}
              onClick={() => setWishlisted((value) => !value)}
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              aria-pressed={wishlisted}
            >
              <HeartIcon filled={wishlisted} />
            </button>

            <button
              type="button"
              className="dummy-product__icon-btn"
              onClick={() => setQuickView(true)}
              aria-label={`Quick view ${product.name}`}
            >
              <EyeIcon />
            </button>
          </div>

          {!inStock && (
            <div className="dummy-product__sold-overlay">
              <span>Out of stock</span>
            </div>
          )}
        </div>

        <div className="dummy-product__details">
          <span className="dummy-product__category">{product.category}</span>

          <h3 className="dummy-product__name">
            <Link href={detailHref}>{product.name}</Link>
          </h3>

          <div className="dummy-product__bottom">
            <div className="dummy-product__pricing">
              <span className="dummy-product__price">
                ₹{price.toLocaleString("en-IN")}
              </span>

              {discount > 0 && (
                <del className="dummy-product__original-price">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </del>
              )}
            </div>

            <button
              type="button"
              className={`dummy-product__cart-btn ${added ? "is-added" : ""}`}
              onClick={handleAddToCart}
              disabled={!inStock}
              aria-label={
                !inStock
                  ? "Out of stock"
                  : added
                    ? "Added to demo cart"
                    : "Add to cart"
              }
            >
              {inStock ? (
                added ? (
                  <span className="dummy-product__check">✓</span>
                ) : (
                  <CartIcon />
                )
              ) : (
                <span className="dummy-product__stock-icon">—</span>
              )}
            </button>
          </div>
        </div>
      </article>

      {quickView && (
        <div
          className="dummy-product__modal-backdrop"
          onClick={() => setQuickView(false)}
        >
          <div
            className="dummy-product__modal"
            role="dialog"
            aria-modal="true"
            aria-label="Product quick view"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="dummy-product__modal-close"
              onClick={() => setQuickView(false)}
              aria-label="Close quick view"
            >
              ×
            </button>

            <ProductImage src={product.image} name={product.name} />

            <div className="dummy-product__modal-info">
              <span className="dummy-product__category">
                {product.category}
              </span>

              <h3>{product.name}</h3>

              <div className="dummy-product__pricing">
                <strong className="dummy-product__price">
                  ₹{price.toLocaleString("en-IN")}
                </strong>

                {discount > 0 && (
                  <del className="dummy-product__original-price">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </del>
                )}
              </div>

              <p>
                {product.description ||
                  "Thoughtfully designed for gifting, celebrations and special moments."}
              </p>

              <Link
                href={detailHref}
                className="dummy-product__view-detail"
                onClick={() => setQuickView(false)}
              >
                View Product Details →
              </Link>

              <button
                type="button"
                className="dummy-product__modal-add"
                disabled={!inStock}
                onClick={handleAddToCart}
              >
                {!inStock
                  ? "Out of Stock"
                  : added
                    ? "Added to Demo Cart ✓"
                    : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
