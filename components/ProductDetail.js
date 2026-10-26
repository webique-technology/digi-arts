"use client";

import { useState } from "react";

const DEMO_PRODUCT = {
  id: "DA-1001",
  name: "Premium Decorative Gift Box",
  category: "Gift Packaging",
  sku: "DIGI-GB-1001",
  price: 249,
  mrp: 349,
  unit: "Piece",
  minOrder: 1,
  stock: 24,
  rating: 4.5,
  reviewCount: 18,
  shortDescription:
    "Beautifully designed decorative gift box for festivals, gifting and special occasions.",
  description:
    "Add a creative touch to your celebrations with this decorative gift box. Suitable for festive gifting, return gifts, sweets and special occasions.",
  images: ["/images/insta-2.jpg", "/images/insta-3.jpg", "/images/insta-4.jpg"],
  specifications: [
    ["Material", "Decorative paper / board"],
    ["Colour", "As shown in images"],
    ["Usage", "Gifting and packaging"],
    ["Unit", "1 piece"],
    ["Package contents", "1 decorative gift box"],
  ],
};

export default function ProductDetail({ product = DEMO_PRODUCT }) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(product.minOrder || 1);
  const [activeTab, setActiveTab] = useState("description");
  const [added, setAdded] = useState(false);

  const discount =
    product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

  const total = product.price * quantity;
  const inStock = product.stock > 0;
  const minOrder = product.minOrder || 1;
  const images = product.images?.length
    ? product.images
    : ["/images/products/gift-box-1.webp"];

  const handleAddToCart = () => {
    if (!inStock) return;

    // Demo action: cart integration can be added later.
    const cartItem = { ...product, quantity };

    console.log("Add to cart:", cartItem);
    setAdded(true);
  };

  const handleBuyNow = () => {
    if (!inStock) return;

    // Demo action: connect the checkout flow when it is ready.
    const checkoutItem = { ...product, quantity };

    console.log("Buy now:", checkoutItem);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello DIGI ART'S, I am interested in ${product.name} (SKU: ${product.sku}).`,
  );

  return (
    <main className="da-product">
      <div className="da-product__breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <a href="/products">Products</a>
        <span>/</span>
        <span>{product.category}</span>
      </div>

      <section className="da-product__layout">
        <div className="da-product__gallery">
          <div className="da-product__thumbs">
            {images.map((image, index) => (
              <button
                type="button"
                key={image}
                className={`da-product__thumb ${
                  activeImage === index ? "is-active" : ""
                }`}
                onClick={() => setActiveImage(index)}
                aria-label={`View product image ${index + 1}`}
                aria-pressed={activeImage === index}
              >
                <img src={image} alt={`${product.name} view ${index + 1}`} />
              </button>
            ))}
          </div>

          <div className="da-product__main-image">
            {discount > 0 && (
              <span className="da-product__sale-badge">{discount}% OFF</span>
            )}

            <img
              src={images[activeImage] || images[0]}
              alt={product.name}
              onError={(event) => {
                event.currentTarget.style.opacity = "0";
              }}
            />
          </div>
        </div>

        <div className="da-product__info">
          <div className="da-product__category">{product.category}</div>

          <h1>{product.name}</h1>

          <div className="da-product__meta">
            <span>SKU: {product.sku}</span>
            <span className={inStock ? "is-stock" : "is-out"}>
              <i />
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="da-product__rating">
            <span
              className="da-product__stars"
              aria-label={`${product.rating} out of 5 stars`}
            >
              ★★★★★
            </span>
            <strong>{product.rating}</strong>
            <span>({product.reviewCount} reviews)</span>
          </div>

          <p className="da-product__short-desc">{product.shortDescription}</p>

          <div className="da-product__price">
            <strong>₹{product.price.toLocaleString("en-IN")}</strong>

            {product.mrp > product.price && (
              <>
                <del>₹{product.mrp.toLocaleString("en-IN")}</del>
                <span>Save {discount}%</span>
              </>
            )}
          </div>

          <p className="da-product__tax-note">
            Inclusive of applicable taxes, where applicable.
          </p>

          <div className="da-product__unit">
            <span>Unit</span>
            <strong>{product.unit}</strong>
          </div>

          <div className="da-product__quantity">
            <span>Quantity</span>

            <div className="da-product__stepper">
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => Math.max(minOrder, current - 1))
                }
                disabled={quantity <= minOrder}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span aria-live="polite">{quantity}</span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => Math.min(product.stock, current + 1))
                }
                disabled={!inStock || quantity >= product.stock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <small>
              {inStock ? `${product.stock} available` : "Currently unavailable"}
            </small>
          </div>

          <div className="da-product__total">
            <span>Total price</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>

          <div className="da-product__actions">
            <button
              type="button"
              className="da-product__add"
              onClick={handleAddToCart}
              disabled={!inStock}
            >
              {added ? "Added to Cart ✓" : "Add to Cart"}
            </button>

            <button
              type="button"
              className="da-product__buy"
              onClick={handleBuyNow}
              disabled={!inStock}
            >
              Buy Now
            </button>
          </div>

          <a
            className="da-product__whatsapp"
            href={`https://wa.me/?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
          >
            Enquire about this product on WhatsApp ↗
          </a>

          <div className="da-product__trust">
            <div>
              <span className="da-product__trust-icon">↗</span>
              <span>Carefully packed</span>
            </div>
            <div>
              <span className="da-product__trust-icon">✓</span>
              <span>Order assistance</span>
            </div>
            <div>
              <span className="da-product__trust-icon">₹</span>
              <span>Flexible payment options</span>
            </div>
          </div>
        </div>
      </section>

      <section className="da-product__details">
        <div
          className="da-product__tabs"
          role="tablist"
          aria-label="Product details"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "description"}
            className={activeTab === "description" ? "is-active" : ""}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "specifications"}
            className={activeTab === "specifications" ? "is-active" : ""}
            onClick={() => setActiveTab("specifications")}
          >
            Specifications
          </button>
        </div>

        {activeTab === "description" ? (
          <div className="da-product__detail-content">
            <h2>About this product</h2>
            <p>{product.description}</p>
          </div>
        ) : (
          <div className="da-product__specifications">
            {(product.specifications || []).map(([label, value]) => (
              <div key={label} className="da-product__spec-row">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
