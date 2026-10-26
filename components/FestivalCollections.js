 'use client';

import Link from 'next/link';
import Image from 'next/image';

const festivals = [
  {
    name: 'Diwali Festival',
    image: '/images/offer-3.jpg',
    href: '/collections/diwali-festival',
    className: 'festival-card--diwali',
    label: 'FESTIVE FAVOURITES',
  },
  {
    name: 'Ganesh Festival',
    image: '/images/offer-2.jpg',
    href: '/collections/ganesh-festival',
    className: 'festival-card--ganesh',
    label: 'MADE FOR CELEBRATIONS',
  },
  {
    name: 'Christmas Collection',
    image: '/images/offer-1.jpg',
    href: '/collections/christmas',
    className: 'festival-card--christmas',
    label: 'GIFTING SEASON',
  },
];

export default function FestivalCollections() {
  const featured = festivals[0];
  const secondary = festivals.slice(1);

  return (
    <section className="festival-collections py-5">
      <div className="container">
        <div className="festival-collections__grid">
          <Link
            href={featured.href}
            className={`festival-card festival-card--featured ${featured.className}`}
          >
            <Image
              src={featured.image}
              alt={featured.name}
              fill
              priority={false}
              sizes="(max-width: 767px) 100vw, 58vw"
              className="festival-card__image"
            />

            <div className="festival-card__overlay" />

            <div className="festival-card__content">
            <h3>{featured.name}</h3>
 <span class="hero__cta width-btn" >Explore Collection<span class="hero__cta-icon" aria-hidden="true">↗</span></span>
            </div>
          </Link>

          <div className="festival-collections__side">
            {secondary.map((festival, index) => (
              <Link
                href={festival.href}
                key={festival.name}
                className={`festival-card ${festival.className}`}
              >
                <Image
                  src={festival.image}
                  alt={festival.name}
                  fill
                  sizes="(max-width: 767px) 100vw, 38vw"
                  className="festival-card__image"
                />

                <div className="festival-card__overlay" />

                <div className="festival-card__content">

                  <h3>{festival.name}</h3>

                                <span class="hero__cta width-btn" >Explore Collection<span class="hero__cta-icon" aria-hidden="true">↗</span></span>

                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}