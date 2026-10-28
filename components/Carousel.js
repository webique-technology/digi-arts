"use client";
import { Children, useEffect, useRef, useState } from "react";
import { TEST_IDS } from "@/components/testIds";

/** Horizontal scroll-snap carousel with dots. */
export default function Carousel({
  children,
  label = "Carousel",
  testIdPrefix = "carousel",
}) {
  const ref = useRef(null);
  const [i, setI] = useState(0);
  const [pages, setPages] = useState(1);
  const slides = Children.toArray(children);

  useEffect(() => {
    const track = ref.current;
    if (!track) return;
    const updatePages = () => {
      const count = Math.max(
        1,
        Math.ceil(track.scrollWidth / Math.max(track.clientWidth, 1)),
      );
      setPages(count);
      setI((current) => Math.min(current, count - 1));
    };
    updatePages();
    window.addEventListener("resize", updatePages);
    return () => window.removeEventListener("resize", updatePages);
  }, [slides.length]);

  const goTo = (index) => {
    const track = ref.current;
    if (!track) return;
    const page = Math.max(0, Math.min(index, pages - 1));
    track.scrollTo({
      left: Math.min(
        page * track.clientWidth,
        track.scrollWidth - track.clientWidth,
      ),
      behavior: "smooth",
    });
    setI(page);
  };

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div
        className="carousel__track"
        ref={ref}
        onScroll={() => {
          const track = ref.current;
          if (!track) return;
          setI(
            Math.min(
              pages - 1,
              Math.round(track.scrollLeft / track.clientWidth),
            ),
          );
        }}
      >
        {slides.map((s, n) => (
          <div className="carousel__slide" key={n}>
            {s}
          </div>
        ))}
      </div>
      <div className="carousel__controls">
        {pages > 1 && (
          <button
            className="carousel__arrow"
            type="button"
            onClick={() => goTo(i - 1)}
            aria-label="Previous item"
            disabled={i === 0}
            data-testid={
              testIdPrefix === "custom-orders"
                ? TEST_IDS.customOrdersPrevious
                : testIdPrefix === "explore-categories"
                  ? TEST_IDS.exploreCategoriesPrevious
                  : `${testIdPrefix}-previous`
            }
          >
            ‹
          </button>
        )}
        <div className="dots">
          {Array.from({ length: pages }, (_, n) => (
            <button
              key={n}
              className={n === i ? "is-active" : ""}
              aria-label={`Go to slide ${n + 1}`}
              aria-current={n === i ? "true" : undefined}
              onClick={() => goTo(n)}
              data-testid={TEST_IDS.carouselDot(testIdPrefix, n)}
            />
          ))}
        </div>
        {pages > 1 && (
          <button
            className="carousel__arrow"
            type="button"
            onClick={() => goTo(i + 1)}
            aria-label="Next item"
            disabled={i === pages - 1}
            data-testid={
              testIdPrefix === "custom-orders"
                ? TEST_IDS.customOrdersNext
                : testIdPrefix === "explore-categories"
                  ? TEST_IDS.exploreCategoriesNext
                  : `${testIdPrefix}-next`
            }
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
