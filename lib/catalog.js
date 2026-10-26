import demoCatalog from "@/data/demoCatalog.json";

export const DEMO_CATEGORIES = demoCatalog.categories;
export const isDemoCatalogPreviewEnabled =
  process.env.NODE_ENV !== "production";
export const DEMO_PRODUCTS = demoCatalog.products.map((product) => {
  const demoImage = (path) =>
    path ? `/demo-products/${path.split("/").pop()}` : null;
  return {
    ...product,
    primary_image: demoImage(product.primary_image),
    images: product.images.map((image) => ({
      ...image,
      image_path: demoImage(image.image_path),
    })),
  };
});

export const isCatalogUnavailable = (result) =>
  result.status === 0 || result.status >= 500;

const param = (params, key) => {
  const value = params[key];
  return typeof value === "string" ? value : "";
};

const effectivePrice = (product) => Number(product.sale_price ?? product.price);

export function getDemoProducts(params, limit = 16, defaultSort = "name_asc") {
  const category = param(params, "category");
  const query = param(params, "q").trim().toLocaleLowerCase();
  const minValue = param(params, "min");
  const maxValue = param(params, "max");
  const min =
    minValue && Number.isFinite(Number(minValue)) ? Number(minValue) : null;
  const max =
    maxValue && Number.isFinite(Number(maxValue)) ? Number(maxValue) : null;
  const inStock = param(params, "in_stock") === "1";
  const sort = param(params, "sort") || defaultSort;
  const page = Math.max(1, Number.parseInt(param(params, "page"), 10) || 1);

  const filtered = DEMO_PRODUCTS.filter(
    (product) =>
      (!category || product.category_slug === category) &&
      (!query ||
        `${product.title} ${product.description || ""}`
          .toLocaleLowerCase()
          .includes(query)) &&
      (min === null || effectivePrice(product) >= min) &&
      (max === null || effectivePrice(product) <= max) &&
      (!inStock || Number(product.stock) > 0),
  );

  filtered.sort((a, b) => {
    if (sort === "price_asc")
      return (
        effectivePrice(a) - effectivePrice(b) || a.title.localeCompare(b.title)
      );
    if (sort === "price_desc")
      return (
        effectivePrice(b) - effectivePrice(a) || a.title.localeCompare(b.title)
      );
    if (sort === "newest") return b.id - a.id;
    if (sort === "featured")
      return Number(b.is_bestseller) - Number(a.is_bestseller) || b.id - a.id;
    return a.title.localeCompare(b.title);
  });

  const pages = Math.max(1, Math.ceil(filtered.length / limit));
  return {
    products: filtered.slice((page - 1) * limit, page * limit),
    total: filtered.length,
    pages,
    page,
  };
}
