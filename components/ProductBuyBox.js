"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaLock } from "react-icons/fa";

import { useCart } from "./CartProvider";
import AddToCartButton from "./AddToCartButton";

export default function ProductBuyBox({
  product,
  price,
  inStock = true,
  preview = false,
}) {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("free"); // 1. Added missing state
  const router = useRouter();
  const { add } = useCart();

  const isSoldOut =
    !inStock || (product?.stock != null && Number(product.stock) <= 0);

  const handleBuyNow = () => {
    if (isSoldOut || preview) return;
    add({ ...product, selectedSize: size }, quantity, {
      preview,
      openDrawer: false,
    });
    router.push("/checkout");
  };

  return (
    <div className="card border rounded-3 p-3 shadow-sm bg-white buybox-sticky">
      <div className="fs-3 fw-bold text-dark mb-1">
        ₹{Number(price).toLocaleString("en-IN")}
      </div>

      <div className="small text-muted mb-2">
        <span className="text-success fw-bold">FREE delivery</span> by{" "}
        <strong>Thursday</strong> on orders over ₹999.
      </div>

      {!isSoldOut ? (
        <span className="text-success fw-bold small d-block mb-3">
          ● In Stock
        </span>
      ) : (
        <span className="text-danger fw-bold small d-block mb-3">
          ● Currently Out of Stock
        </span>
      )}

      {/* Quantity Select */}
      <div className="mb-3">
        <label
          className="form-label small text-muted mb-1"
          htmlFor="buybox-quantity"
        >
          Quantity:
        </label>
        <select
          id="buybox-quantity"
          className="form-select form-select-sm"
          value={quantity}
          disabled={isSoldOut}
          onChange={(e) => setQuantity(Number(e.target.value))}
        >
          <option value={1}>1 piece</option>
          <option value={2}>2 pieces</option>
          <option value={5}>5 pieces (Bulk)</option>
          <option value={10}>10 pieces</option>
        </select>
      </div>

      {/* Size Select */}
      <div className="mb-3">
        <label
          className="form-label small text-muted mb-1"
          htmlFor="buybox-size"
        >
          Size:
        </label>
        <select
          id="buybox-size"
          className="form-select form-select-sm"
          value={size}
          disabled={isSoldOut}
          onChange={(e) => setSize(e.target.value)}
        >
          <option value="free">Free</option>
          <option value="standard">Standard</option>
          <option value="medium">Medium</option>
        </select>
      </div>

      {/* Buttons: AddToCartButton + Buy Now */}
      <div className="row g-2 mb-3">
        <div className="col-12 col-sm-6">
          <AddToCartButton
            product={{ ...product, selectedSize: size }}
            qty={quantity}
            icon={false}
            preview={preview}
            className="w-100 py-2 shadow-sm secondary-btn"
          />
        </div>

        <div className="col-12 col-sm-6">
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isSoldOut}
            className="button primary-btn fw-bold py-2 shadow-sm w-100"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
