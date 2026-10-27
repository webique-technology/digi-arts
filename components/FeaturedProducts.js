"use client";

import { useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, A11y } from "swiper/modules";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { DEMO_PRODUCTS } from "@/lib/catalog";

import "swiper/css";
import "swiper/css/navigation";
import ProductCard from "./ProductCard";

export default function FeaturedProducts({
  products = [],
  title = "Deals of the Day",
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // If the API returns an empty list, use DEMO_PRODUCTS as a fallback
  const displayProducts =
    Array.isArray(products) && products.length > 0
      ? products
      : DEMO_PRODUCTS || [];

  const deals = displayProducts.slice(0, 12);

  return (
    <section className="featured-products" aria-label="Featured Products">
      <div className="fp-decoration fp-decoration-one" />
      <div className="fp-decoration fp-decoration-two" />

      <div className="container fp-container">
        <div className="best-sellers__header d-flex justify-content-between align-items-center mb-4">
          <h2 className="shop-category__title fp-heading mb-0">
            {title.includes(" of the ") ? (
              <>
                {title.split(" of the ")[0]} of the <span>Day</span>
              </>
            ) : (
              title
            )}
          </h2>

          <div className="best-sellers__actions d-flex align-items-center gap-3">
            {/* Swiper Custom Navigation Buttons */}
            <div className="fp-navigation d-flex gap-2">
              <button
                ref={prevRef}
                type="button"
                className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: "38px", height: "38px" }}
                aria-label="Previous products"
              >
                <IoMdArrowBack />
              </button>
              <button
                ref={nextRef}
                type="button"
                className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
                style={{ width: "38px", height: "38px" }}
                aria-label="Next products"
              >
                <IoMdArrowForward />
              </button>
            </div>
          </div>
        </div>

        {deals.length > 0 ? (
          <div className="fp-swiper-wrapper position-relative">
            <Swiper
              modules={[Autoplay, Navigation, A11y]}
              loop={true}
              speed={700}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                576: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1200: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
              className="fp-swiper"
            >
              {deals.map((product, idx) => (
                <SwiperSlide key={product.id || idx} className="h-auto">
                  <ProductCard p={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="text-center py-5 text-muted">
            No deals available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}
