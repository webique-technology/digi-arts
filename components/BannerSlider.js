"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { imageUrl } from "@/lib/api";
import { TEST_IDS } from "@/components/testIds";

export default function BannerSlider({ banners }) {
  const [i, setI] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const move = (direction) =>
    setI((current) => (current + direction + banners.length) % banners.length);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (banners.length < 2 || reducedMotion) return;
    const t = setInterval(() => setI((n) => (n + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length, reducedMotion]);

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="Featured banners"
    >
      <div className="hero__stage">
        {banners.map((b, idx) => (
          <div
            key={b.id}
            className={`hero__slide ${idx === i ? "is-active" : ""}`}
            aria-hidden={idx !== i}
          >
            {b.image_desktop ? (
              <picture>
                {b.image_mobile && (
                  <source
                    media="(max-width: 767px)"
                    srcSet={imageUrl(b.image_mobile)}
                  />
                )}
                <img
                  className="hero__bg"
                  src={imageUrl(b.image_desktop)}
                  alt={b.title || ""}
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </picture>
            ) : (
              <div className="hero__ph" />
            )}

            <div className="hero__content">
              <div
                key={b.id}
                className={`hero__slide ${idx === i ? "is-active is-animating" : ""}`}
                aria-hidden={idx !== i}
              >
                {b.image_desktop ? (
                  <picture>
                    {b.image_mobile && (
                      <source
                        media="(max-width: 767px)"
                        srcSet={imageUrl(b.image_mobile)}
                      />
                    )}
                    <img
                      className="hero__bg"
                      src={imageUrl(b.image_desktop)}
                      alt={b.title || ""}
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  </picture>
                ) : (
                  <div className="hero__ph" />
                )}

                <div className="hero__content">
                  <div className="hero__copy">
                    {b.title && <h2 className="hero__heading">{b.title}</h2>}

                    {b.subtitle && (
                      <p className="hero__description">{b.subtitle}</p>
                    )}

                    <Link
                      className="hero__cta"
                      href={b.link_url || "/products"}
                      tabIndex={idx === i ? 0 : -1}
                      data-testid={TEST_IDS.homeHeroShop}
                    >
                      Explore Collection
                      <span className="hero__cta-icon" aria-hidden="true">
                        ↗
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {banners.length > 1 && (
        <>
          <button
            className="hero__arrow hero__arrow--prev"
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous banner"
            data-testid={TEST_IDS.homeHeroPrevious}
          >
            ‹
          </button>
          <button
            className="hero__arrow hero__arrow--next"
            type="button"
            onClick={() => move(1)}
            aria-label="Next banner"
            data-testid={TEST_IDS.homeHeroNext}
          >
            ›
          </button>
        </>
      )}
    </section>
  );
}
