 'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { name: 'Home Décor', image: '/images/categories/home-decor.webp', href: '/collections/home-decor' },
  { name: 'Paper Gift Boxes', image: '/images/categories/gift-boxes.webp', href: '/collections/paper-gift-boxes' },
  { name: 'Festival Décor', image: '/images/categories/festival-decor.webp', href: '/collections/festival-decor' },
  { name: 'Wall Hangings', image: '/images/categories/wall-hanging.webp', href: '/collections/wall-hanging' },
  { name: 'Table Standees', image: '/images/categories/table-standee.webp', href: '/collections/table-standee' },
  { name: 'Gift Packaging', image: '/images/categories/gift-packaging.webp', href: '/collections/gift-packaging' },
  { name: 'Varkari & Mavale', image: '/images/categories/varkari-mavale.webp', href: '/collections/varkari-mavale' },
];

export default function ShopByCategory() {
  const sliderRef = useRef(null);

  const scrollSlider = (direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const firstItem = slider.querySelector('.category-item');
    const gap = parseFloat(getComputedStyle(slider).columnGap) || 0;
    const amount = firstItem
      ? (firstItem.getBoundingClientRect().width + gap) * 2
      : 300;

    slider.scrollBy({
      left: direction * amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="shop-category">
      <div className="shop-category__container">
        <div className="shop-category__header">
          <div>
            <h2 className="shop-category__title">
              Shop by <span>Category</span>
            </h2>
          </div>

          <div className="shop-category__navigation">
            <button type="button" onClick={() => scrollSlider(-1)} aria-label="Previous categories">
              &#8592;
            </button>
            <button type="button" onClick={() => scrollSlider(1)} aria-label="Next categories">
              &#8594;
            </button>
          </div>
        </div>

        <div className="shop-category__slider" ref={sliderRef}>
          {categories.map((category) => (
            <Link
              href={category.href}
              className="category-item"
              key={category.name}
            >
              <div className="category-item__image-wrap">
                <div className="category-item__image">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 575px) 27vw, (max-width: 991px) 20vw, 150px"
                  />
                </div>
                <span className="category-item__arrow">&#8599;</span>
              </div>

              <p>{category.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}