"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import Link from "next/link";
import Visual from "@/components/Visual";
import ProductCard from "@/components/ProductCard";
import Carousel from "@/components/Carousel";
import { HOME, SITE_INFO, instagram } from "@/data/site";
import { TEST_IDS } from "@/components/testIds";
import { SparklesIcon, GiftIcon, QualityIcon } from "@/components/Icons";
import { Container } from "react-bootstrap";
// 1. Import demo products JSON as safe default fallback
import demoProductsData from "@/data/demoCatalog.json";
// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// for Best Seller component
const DEFAULT_PRODUCTS = Array.isArray(demoProductsData)
  ? demoProductsData
  : demoProductsData?.products || demoProductsData?.data || [];

const DEFAULT_BANNER_SLIDES = [
  { id: 1, image: "/images/diwali-digiart.webp", title: "Special Collection" },
  { id: 2, image: "/images/hero-banner-sm-2-digiarte.webp", title: "New Arrivals" },
];
// for Best Seller component //

export function CollectionTiles() {
  return (
    <section className="collections-section section-padding">
      <Container>
        <div className="best-sellers__header title-row-margin">
          <h2 className="shop-category__title fp-heading">
            Discover Our <span>Collections</span>
          </h2>
          <div className="best-sellers__actions">
            <Link href="/shop?bestseller=1" className="best-sellers__view-all">
              View All <span>↗</span>
            </Link>
          </div>
        </div>

        <div className="tiles" aria-label="Shop by collection">
          {HOME.tiles.map((t, index) => (
            <article className={`tile tile--${index + 1}`} key={t.label}>
              <Link
                href={t.href}
                className="tile__image-link"
                aria-label={`Explore ${t.label}`}
              >
                <Visual
                  className="tile__img"
                  src={t.image}
                  alt={t.label}
                  tone={t.tone}
                />
                <div className="tile__overlay" />
                <div className="tile__text">
                  <h3>{t.label}</h3>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function BestSellers({ products = [], banners = [] }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const bannerList = banners?.length > 0 ? banners : DEFAULT_BANNER_SLIDES;
  const sourceProducts = products?.length > 0 ? products : [];
  const bestsellers = sourceProducts.filter((item) =>
    Boolean(item.is_bestseller),
  );
  const productList = bestsellers.length >= 6 ? bestsellers : sourceProducts;
  const displayProducts = productList.slice(0, 6);

  return (
    <section className="best-sellers section-padding">
      <Container>
        <div className="best-sellers__header title-row-margin">
          <div>
            <h2 className="best-sellers__title fp-heading">Best Sellers</h2>
          </div>

          <div className="best-sellers__actions">
            <Link href="/shop?bestseller=1" className="best-sellers__view-all">
              View All <span>↗</span>
            </Link>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="best-sellers__layout">
          {/* Left Column: Big Image Swiper Slider */}
          <div className="best-sellers__banner-col">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              pagination={{ clickable: true }}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              loop={bannerList.length > 1}
              className="best-sellers__banner-swiper"
            >
              {bannerList.map((banner, index) => (
                <SwiperSlide key={banner.id || index}>
                  <div className="best-sellers__banner-card">
                    <img
                      src={banner.image || banner.src || banner}
                      alt={banner.title || `Best seller banner ${index + 1}`}
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              ))}

              {/* Custom Arrow Buttons */}
              <button
                ref={prevRef}
                type="button"
                className="best-sellers__banner-arrow best-sellers__banner-prev"
                aria-label="Previous banner"
              >
                <IoMdArrowBack />
              </button>

              <button
                ref={nextRef}
                type="button"
                className="best-sellers__banner-arrow best-sellers__banner-next"
                aria-label="Next banner"
              >
                <IoMdArrowForward />
              </button>
            </Swiper>
          </div>

          {/* Right Column: 6 Product Cards Grid */}
          <div className="best-sellers__products-grid">
            {displayProducts.length > 0 ? (
              displayProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))
            ) : (
              <div className="best-sellers__empty">No products available</div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function CustomOrders() {
  return (
    <section className="custom-studio">
      <div className="container custom-studio__inner">
        <div className="custom-studio__heading">
          <span className="custom-studio__eyebrow">
            <span className="custom-studio__eyebrow-dot" />
            THE Digi Art’s Store CUSTOM STUDIO
          </span>

          <h2>
            NOT JUST
            <br />
            PAPER.
            <br />
            <em>PERSONALITY.</em>
          </h2>

          <p className="custom-studio__description">
            Some ideas deserve more than ordinary. Explore creative paper
            details made for your celebrations, gifts and special moments.
          </p>

          <Link href="/pages/bulk-orders" className="custom-studio__cta">
            <span>LET'S MAKE IT PERSONAL</span>
            <span className="custom-studio__cta-arrow">↗</span>
          </Link>

          <div className="custom-studio__signature">
            <span>01 —</span>
            <span>YOUR IDEA, OUR CREATIVE TOUCH</span>
          </div>
        </div>

        <div className="custom-studio__art">
          <span className="custom-studio__orbit" aria-hidden="true" />

          <div className="custom-studio__stamp">
            <span>A LITTLE</span>
            <strong>EXTRA</strong>
            <span>MAGIC ✳</span>
          </div>

          <Carousel label="Custom orders" testIdPrefix="custom-orders">
            {HOME.customOrders.map((c, i) => (
              <Link
                key={i}
                href="/pages/bulk-orders"
                className={`custom-studio__photo custom-studio__photo--${i % 4}`}
                aria-label={`Explore custom order ${i + 1}`}
                data-testid={TEST_IDS.customOrderLink(i)}
              >
                <Visual
                  className="custom-studio__img"
                  src={c.image}
                  tone={c.tone}
                  alt={`Custom order ${i + 1}`}
                />

                <span className="custom-studio__photo-number">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <span className="custom-studio__photo-arrow">↗</span>
              </Link>
            ))}
          </Carousel>

          <div className="custom-studio__swatch">
            <span className="custom-studio__swatch-pattern" />
            <span>
              MADE WITH
              <br />
              IMAGINATION
            </span>
          </div>

          <span className="custom-studio__vertical">
            EVERY DETAIL TELLS A STORY
          </span>
        </div>
      </div>
    </section>
  );
}

export function InstagramRow() {
  const videoRefs = useRef([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const videos = videoRefs.current.filter(Boolean);

    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      {
        threshold: [0, 0.6, 1],
      },
    );

    videos.forEach((video) => observer.observe(video));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="instagram-section collection__banner section-padding">
      <div className="container">
        <div className="instagram-section__header title-row-margin">
          <div>
            <h2 className="shop-category__title fp-heading text-start">
              Trending Now on <span>Instagram</span>
            </h2>
          </div>

          <div className="instagram-section__actions">
            {SITE_INFO.instagram && (
              <a
                href={SITE_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-section__follow"
              >
                Follow Instagram <span aria-hidden="true">↗</span>
              </a>
            )}

            <div className="instagram-carousel-controls">
              <button
                type="button"
                aria-label="Previous videos"
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <IoMdArrowBack />
              </button>

              <button
                type="button"
                aria-label="Next videos"
                onClick={() => swiperRef.current?.slideNext()}
              >
                <IoMdArrowForward />
              </button>
            </div>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          loop={true}
          grabCursor={true}
          simulateTouch={true}
          touchEventsTarget="container"
          preventClicks={true}
          preventClicksPropagation={true}
          edgeSwipeDetection={true}
          touchStartPreventDefault={false}
          spaceBetween={16}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
            1280: { slidesPerView: 5, spaceBetween: 24 },
          }}
          className="insta"
        >
          {instagram.map((item, index) => (
            <SwiperSlide key={item.id} className="insta__slide">
              <a
                className="insta__item"
                href={item.url || SITE_INFO.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.alt || "View Instagram video"}
                draggable="false"
                onDragStart={(e) => e.preventDefault()}
                style={{ display: "block", userSelect: "none" }}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  className="insta__media"
                  src={item.video}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  draggable="false"
                  onDragStart={(e) => e.preventDefault()}
                  style={{
                    pointerEvents: "none",
                    userSelect: "none",
                    width: "100%",
                    display: "block",
                  }}
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export function SplitBanner() {
  const s = HOME.split;

  return (
    <section className="split">
      <Visual className="split__img" src={s.image} tone={s.tone} />

      <div className="split__text">
        <h2>{s.title}</h2>
        <p>{s.text}</p>
        <Link className="pill" href={s.href}>
          Shop now
        </Link>
      </div>
    </section>
  );
}

export function CollectionCards() {
  return (
    <section className="section">
      <div className="container container--narrow">
        <div className="ccards">
          {HOME.collections.map((c) => (
            <Link key={c.label} href={c.href} className="ccard">
              <Visual className="ccard__img" src={c.image} tone={c.tone} />
              <span>{c.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Story() {
  const s = HOME.story;

  return (
    <section className="story">
      <div className="container story__inner">
        <div className="story__visual">
          <Visual
            className="story__img"
            src={s.image}
            tone={s.tone}
            alt="Our story"
          />

          <span className="story__image-note">
            THE ART OF BEAUTIFUL DETAILS
          </span>

          <span className="story__image-index">D.</span>
        </div>

        <div className="story__text">
          <span className="story__eyebrow">
            <span className="story__eyebrow-line" />
            {s.eyebrow}
          </span>

          <h2>{s.title}</h2>

          <span className="story__ornament" aria-hidden="true">
            ✳
          </span>

          {s.text.map((t, i) => (
            <p key={i}>{t}</p>
          ))}

          <Link href={s.href} className="story__more">
            <span>Discover Our Story</span>
            <span className="story__more-arrow" aria-hidden="true">
              ↗
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    {
      icon: SparklesIcon,
      number: "01",
      tag: "THOUGHTFULLY DESIGNED",
      title: "Details that make a difference.",
      description:
        "Discover creative designs that bring something special to your space and celebrations.",
    },
    {
      icon: GiftIcon,
      number: "02",
      tag: "MADE FOR GIFTING",
      title: "Make every moment memorable.",
      description:
        "Find thoughtful details for celebrations, gifting and moments worth remembering.",
    },
    {
      icon: QualityIcon,
      number: "03",
      tag: "QUALITY YOU CAN TRUST",
      title: "Beautiful from every angle.",
      description:
        "Explore carefully selected designs that bring beauty to the little things.",
    },
  ];

  return (
    <section className="features">
      <div className="container features__inner">
        <div className="features__intro">
          <span className="features__eyebrow">MORE THAN JUST DETAILS</span>

          <h2>
            The beauty is
            <br />
            in the <em>little things.</em>
          </h2>

          <p>
            Thoughtful details can turn an ordinary moment into something worth
            remembering.
          </p>

          <span className="features__signature">
            THE Digi Art’s Store EXPERIENCE
          </span>

          <span className="features__watermark" aria-hidden="true">
            D
          </span>
        </div>

        <div className="features__list">
          {features.map(({ icon: Icon, number, tag, title, description }) => (
            <article className="features__item" key={number}>
              <div className="features__item-top">
                <span className="features__number">{number}</span>
                <span className="features__tag">{tag}</span>

                <span className="features__icon">
                  <Icon />
                </span>
              </div>

              <h3>{title}</h3>
              <p>{description}</p>
              <span className="features__line" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
