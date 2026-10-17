'use client';
import { useEffect, useRef, useState } from 'react';
import { imageUrl } from '@/lib/api';
import { TEST_IDS } from './testIds';

export default function ProductGallery({ images = [], title }) {
  const [i, setI] = useState(0);
  const strip = useRef(null);
  const selectImage = (index) => setI((index + images.length) % images.length);

  // keep the selected thumbnail visible
  useEffect(() => {
    const el = strip.current?.children[i];
    if (el && strip.current) strip.current.scrollTo({ left: el.offsetLeft - strip.current.offsetLeft - 8, behavior: 'smooth' });
  }, [i]);

  if (!images.length) return <div className="gallery__main skeleton" role="img" aria-label="No image available" />;
  return (
    <div className="gallery" role="group" aria-label={`${title} product images`}>
      <img className="gallery__main" src={imageUrl(images[i].image_path)} alt={`${title} - image ${i + 1}`} />
      {images.length > 1 && (
        <div className="gallery__strip">
          <div className="gallery__thumbs" ref={strip}>
            {images.map((im, idx) => (
              <button key={im.id ?? idx} type="button" className={idx === i ? 'is-active' : ''} onClick={() => selectImage(idx)} aria-label={`Show image ${idx + 1}`} aria-current={idx === i ? 'true' : undefined} data-testid={TEST_IDS.productGalleryThumbnail(idx)}>
                <img src={imageUrl(im.image_path)} alt="" loading="lazy" />
              </button>
            ))}
          </div>
          <button className="gallery__arrow gallery__arrow--previous" type="button" onClick={() => selectImage(i - 1)} aria-label="Previous product image" data-testid={TEST_IDS.productGalleryPrevious}>‹</button>
          <button className="gallery__arrow gallery__arrow--next" type="button" onClick={() => selectImage(i + 1)} aria-label="Next product image" data-testid={TEST_IDS.productGalleryNext}>›</button>
        </div>
      )}
    </div>
  );
}
