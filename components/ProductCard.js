import Link from 'next/link';
import Visual from './Visual';
import Stars from './Stars';
import AddToCartButton from './AddToCartButton';
import { formatPrice, isOnSale } from '@/lib/utils';
import { TEST_IDS } from './testIds';

export default function ProductCard({
  p,
  variant = 'collection',
  preview = false,
}) {
  const img = p.primary_image || p.image;
  const reviews = Number(p.review_count) || 0;

  return (
    <article
      className={`pcard pcard--${variant}`}
      data-testid={TEST_IDS.collectionProduct(p.id)}
    >
      <div className="pcard__visual">
        <Link
          href={`/products/${p.slug}`}
          className="pcard__link"
          aria-label={`View ${p.title}`}
        >
          <div className="pcard__media">
            <Visual
              src={img}
              alt={p.title}
              className="pcard__img"
            />
          </div>
        </Link>

        {isOnSale(p) && (
          <span className="pcard__badge">SPECIAL PRICE</span>
        )}

        <span className="pcard__art-label">DIGI ART'S</span>
      </div>

      <div className="pcard__info">
        <Link
          href={`/products/${p.slug}`}
          className="pcard__title-link"
        >
          <h3 className="pcard__title">{p.title}</h3>
        </Link>

        {reviews > 0 && (
          <div className="pcard__rating">
            <Stars value={p.rating} />
            <span>{reviews} review{reviews > 1 ? 's' : ''}</span>
          </div>
        )}

        <div className="pcard__price">
          {isOnSale(p) ? (
            <>
              <span className="pcard__sale-price">
                {formatPrice(p.sale_price)}
              </span>
              <s>{formatPrice(p.price)}</s>
            </>
          ) : (
            formatPrice(p.price)
          )}
        </div>

        <div className="pcard__footer">
          <span className="pcard__footer-label">
            Made to delight
          </span>

          <AddToCartButton
            product={p}
            icon={variant === 'best'}
            preview={preview}
          />
        </div>
      </div>
    </article>
  );
}