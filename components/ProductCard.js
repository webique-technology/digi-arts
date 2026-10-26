"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Visual from "./Visual";
import Stars from "./Stars";
import AddToCartButton from "./AddToCartButton";
import { formatPrice, isOnSale } from "@/lib/utils";
import { TEST_IDS } from "./testIds";
import { Col, Row } from "react-bootstrap";

import { FaHeart,FaRegHeart  } from "react-icons/fa";

export default function ProductCard({
  p,
  variant = "collection",
  preview = false,
}) {
  const img = p.primary_image || p.image;
  const reviews = Number(p.review_count) || 0;
  const [isFavourite, setIsFavourite] = useState(false);

  // Sync initial favourite status from localStorage on mount
  useEffect(() => {
    try {
      const favourites = JSON.parse(localStorage.getItem("favourites") || "[]");
      setIsFavourite(favourites.some((item) => (item.id || item) === p.id));
    } catch {
      setIsFavourite(false);
    }
  }, [p.id]);

  const handleToggleFavourite = (e) => {
    // Stop click event from bubbling up to the product link
    e.preventDefault();
    e.stopPropagation();

    try {
      const favourites = JSON.parse(localStorage.getItem("favourites") || "[]");
      const exists = favourites.some((item) => (item.id || item) === p.id);

      let updatedList;
      if (exists) {
        updatedList = favourites.filter((item) => (item.id || item) !== p.id);
        setIsFavourite(false);
      } else {
        updatedList = [
          ...favourites,
          {
            id: p.id,
            title: p.title,
            image: img,
            price: p.price,
            slug: p.slug,
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

  return (
    <article
      className={`h-100 pcard pcard--${variant} position-relative`}
      data-testid={TEST_IDS.collectionProduct(p.id)}
    >
      <div className="pcard__visual position-relative">
        {/* Full Image Link */}
        <Link
          href={`/products/${p.slug}`}
          className="pcard__link d-block"
          aria-label={`View ${p.title}`}
        >
          <div className="pcard__media">
            <Visual src={img} alt={p.title} className="pcard__img" />
          </div>
        </Link>

        {/* Favourite Button positioned outside of the <a> tag */}
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

        {isOnSale(p) && <span className="pcard__badge">SPECIAL PRICE</span>}
        <span className="pcard__art-label">DIGI ART'S</span>
      </div>

      <div className="pcard__info">
        {/* Title Link */}
        <Link
          href={`/products/${p.slug}`}
          className="pcard__title-link text-decoration-none"
        >
          <h3 className="pcard__title">{p.title}</h3>
        </Link>

        {reviews > 0 && (
          <div className="pcard__rating">
            <Stars value={p.rating} />
            <span>
              {reviews} review{reviews > 1 ? "s" : ""}
            </span>
          </div>
        )}

        <Row className="align-items-center mt-2">
          <Col sm={12} md={6}>
            <div className="pcard__price gap-0">
              {isOnSale(p) ? (
                <>
                  <span className="pcard__price-sale">
                    {formatPrice(p.sale_price)}
                  </span>{" "}
                  <s className="text-muted">{formatPrice(p.price)}</s>
                </>
              ) : (
                <span>{formatPrice(p.price)}</span>
              )}
            </div>
          </Col>
          <Col sm={12} md={6}>
            <div className="pcard__footer">
              <AddToCartButton
                product={p}
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
