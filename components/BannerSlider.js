"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, A11y } from "swiper/modules";
import { imageUrl } from "@/lib/api";
import { TEST_IDS } from "@/components/testIds";
import { MdArrowOutward } from "react-icons/md";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const HERO_FALLBACK = [
  {
    id: "f1",
    title: "Thoughtful gifts, made by hand",
    subtitle: "Make every celebration feel a little more special.",
    link_url: "/products",
    image_desktop: "/images/hero-banner-1-digiarte.webp",
  },
  {
    id: "f2",
    title: "Gifts that make an impression",
    subtitle: "Discover keepsake boxes and beautifully wrapped moments.",
    link_url: "/products?category=gift-sets",
    image_desktop: "/images/hero-banner-2-digiarte.webp",
  },
  {
    id: "f3",
    title: "A little something, made with love",
    subtitle: "Shop handcrafted bags, décor and stationery.",
    link_url: "/products",
    image_desktop: "/images/hero-banner-3-digiarte.webp",
  },
];

export default function BannerSlider({ banners = [] }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  // Safe fallback selection without variable shadowing
  const bannerList =
    Array.isArray(banners) && banners.length > 0 ? banners : HERO_FALLBACK;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return (
    <section
      className="hero-slider"
      aria-roledescription="carousel"
      aria-label="Featured banners"
    >
      <div className="hero__stage position-relative">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, A11y]}
          loop={bannerList.length > 1}
          speed={700}
          autoplay={
            bannerList.length > 1 && !reducedMotion
              ? {
                  delay: 5000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          pagination={
            bannerList.length > 1
              ? {
                  clickable: true,
                  bulletClass: "hero__dot",
                  bulletActiveClass: "is-active",
                }
              : false
          }
          className="hero__swiper"
        >
          {bannerList.map((b, idx) => (
            <SwiperSlide key={b.id || idx} className="hero__slides">
              {/* Full-width background image */}
              {b.image_desktop ? (
                <picture className="hero__picture">
                  {b.image_mobile && (
                    <source
                      media="(max-width: 767px)"
                      srcSet={imageUrl(b.image_mobile)}
                    />
                  )}
                  <img
                    className="hero__bg"
                    src={imageUrl(b.image_desktop)}
                    alt={b.title || "Banner"}
                    loading={idx === 0 ? "eager" : "lazy"}
                  />
                </picture>
              ) : (
                <div className="hero__ph" />
              )}

              {/* Text content bounded by Bootstrap container */}
              <div className="container position-relative h-100 d-flex align-items-center">
                <div className="hero__content">
                  <div className="hero__copy">
                    {b.title && (
                      <h1 className="hero__heading display-3 fw-bold">
                        {b.title}
                      </h1>
                    )}
                    {b.subtitle && (
                      <p className="hero__description lead">{b.subtitle}</p>
                    )}
                    <Link
                      className="hero__cta btn btn-dark px-4 py-2 rounded-pill fw-semibold"
                      href={b.link_url || "/products"}
                      data-testid={TEST_IDS.homeHeroShop}
                    >
                      Explore Collection
                      <span className="hero__cta-icon ms-2" aria-hidden="true">
                       <MdArrowOutward />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {bannerList.length > 1 && (
          <>
            <button
              ref={prevRef}
              className="hero__arrow hero__arrow--prev"
              type="button"
              aria-label="Previous banner"
              data-testid={TEST_IDS.homeHeroPrevious}
            >
              ‹
            </button>
            <button
              ref={nextRef}
              className="hero__arrow hero__arrow--next"
              type="button"
              aria-label="Next banner"
              data-testid={TEST_IDS.homeHeroNext}
            >
              ›
            </button>
          </>
        )}
      </div>
    </section>
  );
}
