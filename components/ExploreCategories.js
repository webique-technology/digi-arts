"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper core and module styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Visual from "./Visual";
import { EXPLORE } from "@/data/site";

export default function ExploreCategories({
  items = EXPLORE,
  title = "Explore other Categories",
  variant = "",
}) {
  return (
    <section className={`explore ${variant ? `explore--${variant}` : ""}`}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="explore__title mb-0">{title}</h2>

          {/* Custom Navigation Arrows */}
          <div className="explore-nav-btns d-none d-md-flex gap-2">
            <button
              type="button"
              className="explore-prev-btn btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
              aria-label="Previous categories"
              style={{ width: "36px", height: "36px" }}
            >
              ‹
            </button>
            <button
              type="button"
              className="explore-next-btn btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center"
              aria-label="Next categories"
              style={{ width: "36px", height: "36px" }}
            >
              ›
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={1.15} // Mobile: 1.15 cards
          navigation={{
            prevEl: ".explore-prev-btn",
            nextEl: ".explore-next-btn",
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          breakpoints={{
            // Mobile (larger devices)
            480: {
              slidesPerView: 1.5,
              spaceBetween: 16,
            },
            // Small tablets
            576: {
              slidesPerView: 2.2,
              spaceBetween: 16,
            },
            // Tablets
            768: {
              slidesPerView: 3.2,
              spaceBetween: 20,
            },
            // Small Desktops / Laptops
            992: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            // Desktops (Standard & Large): 5 cards
            1200: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
          }}
          className="explore-categories-swiper pb-4"
        >
          {items.map((c) => (
            <SwiperSlide key={c.label} className="h-auto">
              <Link
                href={c.href || "#"}
                className="xcard text-decoration-none d-flex flex-column h-100 rounded-3 overflow-hidden border bg-white shadow-sm transition"
              >
                <div
                  className="xcard__img-wrap position-relative w-100"
                  style={{ aspectRatio: "1/1" }}
                >
                  <Visual
                    className="xcard__img w-100 h-100 object-fit-cover"
                    src={c.image}
                    alt={c.label}
                  />
                </div>
                <div className="p-3 text-center d-flex align-items-center justify-content-center flex-grow-1">
                  <strong className="text-dark small fw-semibold line-clamp-1">
                    {c.label}
                  </strong>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
