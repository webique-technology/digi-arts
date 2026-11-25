import { imageUrl } from "@/lib/api";
import { srcSet } from "@/lib/images";

/** <img> that lets the browser pick the small/medium/large version; plain src when the image has no versions. */
export default function ResponsiveImage({ src, variants, sizes = "100vw", alt = "", ...props }) {
  return (
    <img
      sizes={variants ? sizes : undefined}
      srcSet={srcSet(variants)}
      src={imageUrl(src)}
      alt={alt}
      {...props}
    />
  );
}
