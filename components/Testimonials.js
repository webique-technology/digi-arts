"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, A11y } from "swiper/modules";

// Swiper core styles
import "swiper/css";
import "swiper/css/navigation";
import { Container } from "react-bootstrap";

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    initials: "PS",
    location: "Mumbai",
    rating: 5,
    purchased: "LED Candle Set",
    review:
      "Absolutely loved the quality! The LED candles look so real and the packaging was beautiful. Perfect for my Diwali decorations.",
  },
  {
    id: 2,
    name: "Rahul Mehta",
    initials: "RM",
    location: "Delhi",
    rating: 5,
    purchased: "Baby Shower Games Set",
    review:
      "Ordered baby shower games for my sister. Everyone loved them! Great quality cards and fast delivery.",
  },
  {
    id: 3,
    name: "Anjali Patel",
    initials: "AP",
    location: "Bangalore",
    rating: 4,
    purchased: "Brass Lantern",
    review:
      "Beautiful products and amazing customer service. The brass lantern is exactly as shown in the pictures.",
  },
  {
    id: 4,
    name: "Vikram Singh",
    initials: "VS",
    location: "Jaipur",
    rating: 5,
    purchased: "Diwali Gift Hamper",
    review:
      "Best gift hamper I ordered this festive season! Beautiful finishing, premium packaging, and fast delivery.",
  },
  {
    id: 5,
    name: "Sneha Deshmukh",
    initials: "SD",
    location: "Pune",
    rating: 5,
    purchased: "Handcrafted Wall Hanging",
    review:
      "Loved the unique designs and quality. Perfect for decorating and making special family moments memorable.",
  },
];

export default function Testimonials() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="cust-reviews-section">
      <Container className="overflow-hidden">
        <div className="position-relative overflow-hidden">
          {/* Header */}
          <div className="cust-reviews-header text-center mb-5">
            <h2 className="shop-category__title fp-heading">What Our Customers Say</h2>
            <p className="cust-reviews-subtitle text-muted">
              Real reviews from real celebrations
            </p>
          </div>

          {/* Swiper Slider Wrapper with Navigation */}
          <div className="cust-reviews-slider-wrap position-relative">
            <Swiper
              modules={[Navigation, Autoplay, A11y]}
              spaceBetween={24}
              slidesPerView={1}
              loop={true}
              speed={600}
              autoplay={{
                delay: 4500,
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
              breakpoints={{
                576: {
                  slidesPerView: 1.15,
                  spaceBetween: 20,
                },
                992: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
                1200: {
                  slidesPerView: 3, // Gives the peek effect on the right edge
                  spaceBetween: 26,
                },
              }}
              className="cust-reviews-swiper"
            >
              {reviews.map((item) => (
                <SwiperSlide key={item.id} className="cust-review-slide">
                  <article className="cust-review-card h-100">
                    {/* Quote Icon */}
                    <div className="cust-review-quote" aria-hidden="true">
                      <svg
                        width="26"
                        height="22"
                        viewBox="0 0 24 20"
                        fill="none"
                        stroke="#F7B2A3"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 11h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a4 4 0 0 0 4 4h1" />
                        <path d="M15 11h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v10a4 4 0 0 0 4 4h1" />
                      </svg>
                    </div>

                    {/* Star Rating */}
                    <div
                      className="cust-review-stars my-2"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${i < item.rating ? "filled" : "empty"}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="cust-review-text">"{item.review}"</p>

                    {/* Product Tag */}
                    {item.purchased && (
                      <div className="cust-review-purchased">
                        Purchased: {item.purchased}
                      </div>
                    )}

                    {/* Bottom Divider */}
                    <hr className="cust-review-divider" />

                    {/* Author Information */}
                    <div className="cust-review-author d-flex align-items-center">
                      <div className="cust-author-avatar">
                        {item.initials || item.name.charAt(0)}
                      </div>
                      <div className="cust-author-meta ms-3">
                        <h4 className="cust-author-name mb-0">{item.name}</h4>
                        <span className="cust-author-location text-muted small">
                          {item.location}
                        </span>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Floating Navigation Arrows */}
            <button
              ref={prevRef}
              type="button"
              className="cust-swiper-arrow cust-swiper-arrow--prev"
              aria-label="Previous review"
            >
              &#8249;
            </button>
            <button
              ref={nextRef}
              type="button"
              className="cust-swiper-arrow cust-swiper-arrow--next"
              aria-label="Next review"
            >
              &#8250;
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
