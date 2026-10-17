import { imageUrl } from '@/lib/api';

/** Real image when src exists, otherwise a coloured placeholder block. */
export default function Visual({ src, alt = '', tone, className = '', priority = false }) {
  if (src) return <img className={className} src={imageUrl(src)} alt={alt} loading={priority ? 'eager' : 'lazy'} />;
  return <div className={`${className} visual-ph`} style={{ background: tone || '#e9e6e1' }} role={alt ? 'img' : undefined} aria-label={alt || undefined} />;
}
