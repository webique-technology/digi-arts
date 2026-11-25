import ResponsiveImage from './ResponsiveImage';

/** Real image when src exists, otherwise a coloured placeholder block. */
export default function Visual({ src, variants, sizes, alt = '', tone, className = '', priority = false }) {
  if (src) return <ResponsiveImage className={className} src={src} variants={variants} sizes={sizes} alt={alt} loading={priority ? 'eager' : 'lazy'} />;
  return <div className={`${className} visual-ph`} style={{ background: tone || '#e9e6e1' }} role={alt ? 'img' : undefined} aria-label={alt || undefined} />;
}
