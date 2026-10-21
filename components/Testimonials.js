
"use client";

import { useEffect, useRef } from "react";

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Pune",
    review:
      "Beautiful designs and excellent finishing. The products added a special touch to our celebration!",
  },
  {
    id: 2,
    name: "Rohit Patil",
    location: "Nashik",
    review:
      "Creative products with great attention to detail. Everything looked lovely for our occasion.",
  },
  {
    id: 3,
    name: "Sneha Deshmukh",
    location: "Mumbai",
    review:
      "Loved the unique designs and quality. Perfect for decorating and making special moments memorable.",
  },
  {
    id: 4,
    name: "Amit Kulkarni",
    location: "Pune",
    review:
      "Attractive designs and a lovely collection. Great options for festive decorations and gifting.",
  },
  {
    id: 5,
    name: "Neha Joshi",
    location: "Thane",
    review:
      "Lovely products with beautiful details. Looking forward to shopping again!",
  },
];

export default function Testimonials() {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      const firstCard = slider.querySelector(".da-testimonial");
      if (!firstCard) return;

      const gap = parseFloat(getComputedStyle(slider).columnGap) || 0;
      const step = firstCard.getBoundingClientRect().width + gap;
      const atEnd =
        slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 5;

      slider.scrollTo({
        left: atEnd ? 0 : slider.scrollLeft + step,
        behavior: "smooth",
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const moveSlider = (direction) => {
    const slider = sliderRef.current;
    const card = slider?.querySelector(".da-testimonial");

    if (!slider || !card) return;

    const gap = parseFloat(getComputedStyle(slider).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    if (direction === "next" && slider.scrollLeft >= maxScroll - 5) {
      slider.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction === "prev" && slider.scrollLeft <= 5) {
      slider.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    slider.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    });
  };

  return (
    <section className="da-testimonials">
      <div className="container">
        <div className="da-testimonials__heading">
          <div>
            <span className="da-testimonials__eyebrow">
              CUSTOMER LOVE
            </span>
            <h2>
              Happy customers, <span>happy moments.</span>
            </h2>
            <p>Little words that mean a lot to us.</p>
          </div>

          <div className="da-testimonials__controls">
            <button
              type="button"
              onClick={() => moveSlider("prev")}
              aria-label="Previous reviews"
            >
              &#8592;
            </button>
            <button
              type="button"
              onClick={() => moveSlider("next")}
              aria-label="Next reviews"
            >
              &#8594;
            </button>
          </div>
        </div>

        <div
          className="da-testimonials__slider"
          ref={sliderRef}
          aria-label="Customer testimonials"
        >
          {reviews.map((item) => (
            <article className="da-testimonial" key={item.id}>
              <div className="da-testimonial__top">
                <span className="da-testimonial__quote">“</span>
                <span className="da-testimonial__stars" aria-label="5 out of 5 stars">
                  ★★★★★
                </span>
              </div>

              <p className="da-testimonial__review">
                {item.review}
              </p>

              <div className="da-testimonial__author">
                <div className="da-testimonial__initial">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h3>{item.name}</h3>
                  <span>{item.location}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="da-testimonials__footer">
          <span>MADE WITH CARE. SHARED WITH LOVE.</span>
          <span>← DRAG TO EXPLORE →</span>
        </div>
      </div>
    </section>
  );
}
