
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Visual from '@/components/Visual';
import ProductCard from '@/components/DummyProductCard';
import Carousel from '@/components/Carousel';
import { HOME, SITE_INFO, instagram } from '@/data/site';
import { TEST_IDS } from '@/components/testIds';
import {
  SparklesIcon,
  GiftIcon,
  QualityIcon,
} from '@/components/Icons';

const Title = ({ children, sub, bold }) => (
  <div className="stitle">
    <h2 className={bold ? 'is-bold' : ''}>{children}</h2>
    {sub && <p>{sub}</p>}
  </div>
);

export function CollectionTiles() {
  return (
    <section className="container collections-section">
      <div className="best-sellers__header">
        <h2 className="shop-category__title fp-heading">
          Discover Our <span>Collections</span>
        </h2>
        <div className="best-sellers__actions">
            <Link
              href="/shop?bestseller=1"
              className="best-sellers__view-all"
            >
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
                

                <h3 >{t.label}</h3>

               
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}


export function BestSellers({ products = [] }) {
  const sliderRef = useRef(null);

  const scrollProducts = (direction) => {
    sliderRef.current?.scrollBy({
      left: direction * (sliderRef.current.clientWidth * 0.8),
      behavior: 'smooth',
    });
  };

  return (
    <section className="best-sellers">
      <div className="container">
        <div className="best-sellers__header">
          <div>
            <h2 className="shop-category__title fp-heading">
              Best Sellers from <span>DIGI ART'S</span>
            </h2>
          </div>

          <div className="best-sellers__actions">
            <Link
              href="/shop?bestseller=1"
              className="best-sellers__view-all"
            >
              View All <span>↗</span>
            </Link>

            
          </div>
        </div>
        <ProductCard />
        {/* {products.length > 0 ? (
          <div className="best-sellers__slider" ref={sliderRef}>
            {products.map((product) => (
              <div className="best-sellers__slide" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : ( 
          <p className="best-sellers__empty">
            Best sellers will appear here once products are available.
          </p>
        )}*/}
      </div>
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
            Some ideas deserve more than ordinary.
            Explore creative paper details made for your
            celebrations, gifts and special moments.
          </p>

          <Link
            href="/pages/bulk-orders"
            className="custom-studio__cta"
          >
            <span>LET'S MAKE IT PERSONAL</span>
            <span className="custom-studio__cta-arrow">↗</span>
          </Link>

          <div className="custom-studio__signature">
            <span>01 —</span>
            <span>YOUR IDEA, OUR CREATIVE TOUCH</span>
          </div>
        </div>

        <div className="custom-studio__art">
          <span
            className="custom-studio__orbit"
            aria-hidden="true"
          />

          <div className="custom-studio__stamp">
            <span>A LITTLE</span>
            <strong>EXTRA</strong>
            <span>MAGIC ✳</span>
          </div>

          <Carousel
            label="Custom orders"
            testIdPrefix="custom-orders"
          >
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
                  {String(i + 1).padStart(2, '0')}
                </span>

                <span className="custom-studio__photo-arrow">
                  ↗
                </span>
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
  const carouselRef = useRef(null);

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
      }
    );

    videos.forEach((video) => observer.observe(video));

    return () => observer.disconnect();
  }, []);

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstItem = carousel.querySelector('.insta__item');
    if (!firstItem) return;

    const styles = window.getComputedStyle(carousel);
    const gap = parseFloat(styles.columnGap) || 0;
    const scrollAmount = (firstItem.offsetWidth + gap) * 2;

    carousel.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="instagram-section collection__banner">
      <div className="container">
        <div className="instagram-section__header">
          <div>
            <h2 className="shop-category__title fp-heading">
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
                onClick={() => scrollCarousel(-1)}
              >
                &#8592;
              </button>

              <button
                type="button"
                aria-label="Next videos"
                onClick={() => scrollCarousel(1)}
              >
                &#8594;
              </button>
            </div>
          </div>
        </div>

        <div className="insta" ref={carouselRef}>
          {instagram.map((item, index) => (
            <a
              key={item.id}
              className="insta__item"
              href={item.url || SITE_INFO.instagram || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.alt || 'View Instagram video'}
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
              />
            </a>
          ))}
        </div>
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
            <Link
              key={c.label}
              href={c.href}
              className="ccard"
            >
              <Visual
                className="ccard__img"
                src={c.image}
                tone={c.tone}
              />
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


// export function Clients() {
//   if (!HOME.clients.length) return null;

//   return (
//     <section className="clients">
//       <div className="container">
//         <small>Our clients</small>

//         <div className="clients__row">
//           {HOME.clients.map((c) => (
//             <span key={c}>{c}</span>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

export function Features() {
  const features = [
    {
      icon: SparklesIcon,
      number: '01',
      tag: 'THOUGHTFULLY DESIGNED',
      title: 'Details that make a difference.',
      description:
        'Discover creative designs that bring something special to your space and celebrations.',
    },
    {
      icon: GiftIcon,
      number: '02',
      tag: 'MADE FOR GIFTING',
      title: 'Make every moment memorable.',
      description:
        'Find thoughtful details for celebrations, gifting and moments worth remembering.',
    },
    {
      icon: QualityIcon,
      number: '03',
      tag: 'QUALITY YOU CAN TRUST',
      title: 'Beautiful from every angle.',
      description:
        'Explore carefully selected designs that bring beauty to the little things.',
    },
  ];

  return (
    <section className="features">
      <div className="container features__inner">
        <div className="features__intro">
          <span className="features__eyebrow">
            MORE THAN JUST DETAILS
          </span>

          <h2>
            The beauty is
            <br />
            in the <em>little things.</em>
          </h2>

          <p>
            Thoughtful details can turn an ordinary moment into
            something worth remembering.
          </p>

          <span className="features__signature">
            THE Digi Art’s Store EXPERIENCE
          </span>

          <span className="features__watermark" aria-hidden="true">
            D
          </span>
        </div>

        <div className="features__list">
          {features.map(
            ({ icon: Icon, number, tag, title, description }) => (
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
            )
          )}
        </div>
      </div>
    </section>
  );
}
