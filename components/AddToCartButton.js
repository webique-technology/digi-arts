"use client";
import { useCart } from "./CartProvider";
import { BagIcon } from "./Icons";
import { TEST_IDS } from "./testIds";
import { IoCartOutline } from "react-icons/io5";
export default function AddToCartButton({
  product,
  qty = 1,
  icon = true,
  className = "primary-btn",
  preview = false,
}) {
  const { add } = useCart();
  const soldOut = product.stock != null && Number(product.stock) <= 0;
  const disabled = soldOut;
  return (
    <button
      type="button"
      className={`button d-flex align-items-center justify-content-center fw-semibold gap-2 ${className}`}
      disabled={disabled}
      onClick={() => add(product, qty, { preview })}
      aria-label={
        preview ? `Add demo product ${product.title} to cart` : undefined
      }
      data-testid={TEST_IDS.addToCart(product.id ?? product.slug)}
    >
      {icon === true && <IoCartOutline className="h3 m-0" />}
      {soldOut ? "Out of stock" : "Add to cart"}
    </button>
  );
}
