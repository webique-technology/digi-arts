"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Visual from "./Visual";
import Stars from "./Stars";
import AddToCartButton from "./AddToCartButton";
import { formatPrice, isOnSale } from "@/lib/utils";
import { TEST_IDS } from "./testIds";
import { FaHeart, FaRegHeart } from "react-icons/fa";

// Extracts the file name and maps it directly to /demo-products/<filename>
function resolveImagePath(img) {
  if (!img) return "/demo-products/placeholder.webp";

  let rawPath = typeof img === "object" ? img.image_path || img.src : img;
  if (typeof rawPath !== "string") return "/demo-products/placeholder.webp";

  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return rawPath;
  }

  const fileName = rawPath.split("/").filter(Boolean).pop();
  return `/demo-products/${fileName}`;
}

export default function ProductCard({
  p,
  product,
  variant = "collection",
  preview = false,
}) {
  const item = p || product;

  if (!item) return null;

  // Handles primary_image, image, or first non-video item from images array
  const rawImage =
    item.primary_image ||
    item.image ||
    (Array.isArray(item.images) && item.images.length > 0
      ? item.images.find((img) => img.type !== "video")?.image_path ||
        item.images[0].image_path ||
        item.images[0]
      : null);

  const img = resolveImagePath(rawImage);
  const title = item.title || item.name || "Product";
  const slug = item.slug || String(item.id);
  const categoryName = item.category_name || item.category?.name;
  const reviews = Number(item.review_count) || 0;
  const [isFavourite, setIsFavourite] = useState(false);

  // Price calculations
  const originalPrice = Number(item.price) || 0;
  const salePrice =
    item.sale_price !== null && item.sale_price !== undefined
      ? Number(item.sale_price)
      : null;

  const isSale =
    typeof isOnSale === "function"
      ? isOnSale(item)
      : salePrice !== null && salePrice > 0 && salePrice < originalPrice;

  // Calculate discount percentage (e.g. -25%)
  const discountPercent =
    isSale && originalPrice > 0
      ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
      : 0;

  // Bestseller badge check
  const isBestseller = Boolean(item.is_bestseller);

  useEffect(() => {
    try {
      const favourites = JSON.parse(localStorage.getItem("favourites") || "[]");
      setIsFavourite(favourites.some((fav) => (fav.id || fav) === item.id));
    } catch {
      setIsFavourite(false);
    }
  }, [item.id]);

  const handleToggleFavourite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const favourites = JSON.parse(localStorage.getItem("favourites") || "[]");
      const exists = favourites.some((fav) => (fav.id || fav) === item.id);

      let updatedList;
      if (exists) {
        updatedList = favourites.filter((fav) => (fav.id || fav) !== item.id);
        setIsFavourite(false);
      } else {
        updatedList = [
          ...favourites,
          {
            id: item.id,
            title,
            image: img,
            price: item.price,
            slug,
          },
        ];
        setIsFavourite(true);
      }

      localStorage.setItem("favourites", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("favouritesUpdated"));
    } catch (err) {
      console.error("Failed to update favourites:", err);
    }
  };

  const productUrl = `/products/${slug}`;

  return (
    <article
      className={`h-100 pcard pcard--${variant} position-relative`}
      data-testid={
        TEST_IDS?.collectionProduct
          ? TEST_IDS.collectionProduct(item.id)
          : undefined
      }
    >
      {/* Product Image Area */}
      <div className="pcard__visual position-relative">
        <Link
          href={productUrl}
          className="pcard__link d-block"
          aria-label={`View ${title}`}
        >
          <div className="pcard__media">
            <Visual src={img} alt={title} className="pcard__img" />
          </div>
        </Link>

        {/* Top-Left: Bestseller Pill Badge */}
        {isBestseller && (
          <span className="pcard__badge-bestseller">Bestseller</span>
        )}

        {/* Bottom-Right: Discount Badge (-25%) */}
        {isSale && discountPercent > 0 && (
          <span className="pcard__badge-discount">-{discountPercent}%</span>
        )}
      </div>

      {/* Product Info */}
      <div className="pcard__info">
        {/* Category Label */}
        {categoryName && (
          <span className="pcard__category">{categoryName}</span>
        )}

        {/* Product Title (Strict 1 Line) */}
        <Link
          href={productUrl}
          className="pcard__title-link text-decoration-none"
        >
          <h3 className="pcard__title" title={title}>
            {title}
          </h3>
        </Link>

        {/* Rating (if any) */}
        {reviews > 0 && (
          <div className="pcard__rating">
            <Stars value={item.rating} />
            <span>
              {reviews} review{reviews > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Bottom Row: Price on left, Cart Button on right */}
        <div className="pcard__bottom">
          <div className="pcard__price">
            {isSale ? (
              <>
                <span className="pcard__price-sale">
                  {typeof formatPrice === "function"
                    ? formatPrice(salePrice)
                    : `₹${salePrice}`}
                </span>
                <s className="pcard__price-original">
                  {typeof formatPrice === "function"
                    ? formatPrice(originalPrice)
                    : `₹${originalPrice}`}
                </s>
              </>
            ) : (
              <span>
                {typeof formatPrice === "function"
                  ? formatPrice(originalPrice)
                  : `₹${originalPrice}`}
              </span>
            )}
          </div>

          <div className="pcard__action">
            <AddToCartButton
              product={item}
              icon={true}
              preview={preview}
              text={false}
              className="button fourth-btn"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
