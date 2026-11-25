import { imageUrl } from "@/lib/api";

// Keep in sync with server/src/utils/images.js
export const MAX_UPLOAD_MB = 10;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const WIDTHS = { small: 480, medium: 960, large: 1920 };

export const imageFileError = (file) => {
  if (!IMAGE_TYPES.includes(file.type)) return `${file.name}: only JPG, PNG or WebP allowed`;
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) return `${file.name}: larger than ${MAX_UPLOAD_MB} MB`;
  return "";
};

export const srcSet = (variants) =>
  variants
    ? Object.entries(WIDTHS).map(([name, w]) => `${imageUrl(variants[name])} ${w}w`).join(", ")
    : undefined;

// For thumbnails that never need more than the small version
export const smallImage = (path, variants) => imageUrl(variants?.small || path);
