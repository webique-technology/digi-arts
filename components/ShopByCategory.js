"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, Autoplay } from "swiper/modules";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
// Swiper core styles
import "swiper/css";
import "swiper/css/navigation";

const categories = [
  {
    name: "Ganesh Festival",
    image: "/images/ganesh-festival-digiart.webp",
    href: "/products?category=ganesh-festival",
  },
  {
    name: "Diwali Festival",
    image: "/images/diwali-digiart.webp",
    href: "/products?category=diwali-festival",
  },
  {
    name: "Independence Day",
    image: "/images/independence-day-digiart.webp",
    href: "/products?category=independence-day",
  },
  {
    name: "Makar Sankranti",
    image: "/images/makar-sankranti-digiart.webp",
    href: "/products?category=makar-sankranti",
  },
  {
    name: "Gift Packaging",
    image: "/images/pakaging-box-digiart.webp",
    href: "/products?category=gift-packaging",
  },
  {
    name: "Christmas Festival",
    image: "/images/christmas-banner-digiart.webp",
    href: "/products?category=christmas-festival",
  },
  {
    name: "Holi Festival",
    image: "/images/holi-digiart.webp",
    href: "/products?category=holi-festival",
  },
  {
    name: "Valentine Day",
    image: "/images/valentine-day-digiart.webp",
    href: "/products?category=valentine-day",
  },
  {
    name: "Decorative Wax Candle",
    image: "/images/decorative-wax-candle-digiart.jpg",
    href: "/products?category=decorative-wax-candle",
  },
];

export default function ShopByCategory() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="shop-category section-padding pb-0">
      <div className="container position-relative">
        <div className="shop-category__header title-row-margin d-flex justify-content-between align-items-center">
          <h2 className="shop-category__title mb-0">
            Shop by <span>Category</span>
          </h2>

          {/* Navigation Controls */}
          <div className="shop-category__navigation d-flex gap-2">
            <button
              ref={prevRef}
              type="button"
              className="shop-category__nav-btn"
              aria-label="Previous categories"
            >
              <IoMdArrowBack />
            </button>
            <button
              ref={nextRef}
              type="button"
              className="shop-category__nav-btn"
              aria-label="Next categories"
            >
               <IoMdArrowForward />
            </button>
          </div>
        </div>

        {/* Swiper Container */}
        <Swiper
          modules={[Navigation, A11y]}
          spaceBetween={20}
          slidesPerView={3.5}
          loop={true} // Enables infinite loop
          speed={800} // Transition slide speed in ms
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          autoplay={{
            delay: 3000, // Time between slides (3 seconds)
            disableOnInteraction: false, // Keeps autoplay running after touch/click
            pauseOnMouseEnter: true, // Pauses autoplay when mouse hovers over slider
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          breakpoints={{
            576: {
              slidesPerView: 4.5,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 5.5,
              spaceBetween: 24,
            },
            992: {
              slidesPerView: 5.5,
              spaceBetween: 24,
            },
            1200: {
              slidesPerView: 6,
              spaceBetween: 28,
            },
          }}
          className="shop-category__swiper"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.name} className="shop-category__slide">
              <Link href={category.href} className="category-item">
                <div className="category-item__image-wrap">
                  <div className="category-item__image">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      sizes="(max-width: 575px) 28vw, (max-width: 991px) 22vw, 150px"
                    />
                  </div>
                  <span className="category-item__arrow" aria-hidden="true">
                    &#8599;
                  </span>
                </div>
                <p className="category-item__name">{category.name}</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
