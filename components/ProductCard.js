"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Visual from "./Visual";
import Stars from "./Stars";
import AddToCartButton from "./AddToCartButton";
import { formatPrice, isOnSale } from "@/lib/utils";
import { TEST_IDS } from "./testIds";
import { Col, Row } from "react-bootstrap";
import { FaHeart, FaRegHeart } from "react-icons/fa";

// Extracts the file name and maps it directly to /demo-products/<filename>
function resolveImagePath(img) {
  if (!img) return "/demo-products/placeholder.webp";

  // Handle if image is an object like { image_path: "..." }
  let rawPath = typeof img === "object" ? img.image_path || img.src : img;
  if (typeof rawPath !== "string") return "/demo-products/placeholder.webp";

  // If it's already an external HTTP/HTTPS URL, preserve it
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return rawPath;
  }

  // Extracts just the filename (e.g. "4657f759dca910da335458a3.webp")
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

  // Handles primary_image, image, or the first item from the images array
  const rawImage =
    item.primary_image ||
    item.image ||
    (Array.isArray(item.images) && item.images.length > 0
      ? item.images[0].image_path || item.images[0]
      : null);

  const img = resolveImagePath(rawImage);
  const title = item.title || item.name || "Product";
  const slug = item.slug || String(item.id);
  const reviews = Number(item.review_count) || 0;
  const [isFavourite, setIsFavourite] = useState(false);

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
  const isSale =
    typeof isOnSale === "function"
      ? isOnSale(item)
      : item.sale_price !== null &&
        item.sale_price !== undefined &&
        Number(item.sale_price) < Number(item.price);

  return (
    <article
      className={`h-100 pcard pcard--${variant} position-relative`}
      data-testid={
        TEST_IDS?.collectionProduct
          ? TEST_IDS.collectionProduct(item.id)
          : undefined
      }
    >
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

        <button
          type="button"
          onClick={handleToggleFavourite}
          aria-label={
            isFavourite ? "Remove from favourites" : "Add to favourites"
          }
          className="add-to-favourite-btn position-absolute top-0 end-0 z-3 mt-2 me-2 border-0 rounded-circle bg-white shadow-sm d-flex align-items-center justify-content-center p-2 text-dark"
          style={{ cursor: "pointer", width: "36px", height: "36px" }}
        >
          {isFavourite ? (
            <FaHeart className="fs-5 text-danger" />
          ) : (
            <FaRegHeart className="fs-5 text-dark" />
          )}
        </button>

        {isSale && <span className="pcard__badge">SPECIAL PRICE</span>}
        <span className="pcard__art-label">DIGI ART'S</span>
      </div>

      <div className="pcard__info">
        <Link
          href={productUrl}
          className="pcard__title-link text-decoration-none"
        >
          <h3 className="pcard__title">{title}</h3>
        </Link>

        {reviews > 0 && (
          <div className="pcard__rating">
            <Stars value={item.rating} />
            <span>
              {reviews} review{reviews > 1 ? "s" : ""}
            </span>
          </div>
        )}

        <Row className="align-items-center mt-2">
          <Col sm={12} md={6}>
            <div className="pcard__price gap-0">
              {isSale ? (
                <>
                  <span className="pcard__price-sale">
                    {typeof formatPrice === "function"
                      ? formatPrice(item.sale_price)
                      : `₹${item.sale_price}`}
                  </span>{" "}
                  <s className="text-muted">
                    {typeof formatPrice === "function"
                      ? formatPrice(item.price)
                      : `₹${item.price}`}
                  </s>
                </>
              ) : (
                <span>
                  {typeof formatPrice === "function"
                    ? formatPrice(item.price)
                    : `₹${item.price}`}
                </span>
              )}
            </div>
          </Col>
          <Col sm={12} md={6}>
            <div className="pcard__footer">
              <AddToCartButton
                product={item}
                icon={variant === "best"}
                preview={preview}
              />
            </div>
          </Col>
        </Row>
      </div>
    </article>
  );
}
