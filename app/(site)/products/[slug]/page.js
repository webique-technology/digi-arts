import Link from "next/link";
import { notFound } from "next/navigation";
import { stripHtml, truncate, finalPrice, SITE } from "@/lib/utils";
import ProductGallery from "@/components/ProductGallery";
import ProductCard from "@/components/ProductCard";
import ExploreCategories from "@/components/ExploreCategories";
import { EXPLORE_PRODUCT } from "@/data/site";
import JsonLd from "@/components/JsonLd";
import demoCatalog from "@/data/demoCatalog.json";
import MessagePopup from "@/components/MessagePopup";
// import ProductBuyBoxSticky from "@/components/ProductBuyBoxSticky";
import ProductBuyBox from "@/components/ProductBuyBox";

export const revalidate = 15;

function resolveImagePath(img) {
  if (!img) return "/demo-products/placeholder.webp";

  let rawPath = typeof img === "object" ? img.image_path || img.src : img;
  if (!rawPath || typeof rawPath !== "string")
    return "/demo-products/placeholder.webp";

  // Keep full URLs and /videos/ paths exactly as they are!
  if (
    rawPath.startsWith("http://") ||
    rawPath.startsWith("https://") ||
    rawPath.startsWith("/videos/")
  ) {
    return rawPath;
  }

  // Only rewrite product images to demo-products
  const fileName = rawPath.split("/").filter(Boolean).pop();
  return `/demo-products/${fileName}`;
}

function getProductBySlugOrId(slug) {
  const products = Array.isArray(demoCatalog)
    ? demoCatalog
    : demoCatalog.products || [];
  return products.find(
    (item) =>
      item.slug === slug ||
      String(item.id) === String(slug) ||
      (item.title &&
        item.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "") === slug),
  );
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const p = getProductBySlugOrId(resolvedParams.slug);

  if (!p) return { title: "Product not found", robots: { index: false } };

  const title = p.meta_title || p.title || p.name || "Product Details";
  const description =
    p.meta_description ||
    truncate(stripHtml(p.description || "")) ||
    `Buy ${title} at Digi Art’s Store`;

  const rawImage =
    p.primary_image ||
    p.image ||
    (Array.isArray(p.images) && p.images.length > 0
      ? p.images[0].image_path || p.images[0]
      : null);

  const mainImageUrl = resolveImagePath(rawImage);

  return {
    title,
    description,
    alternates: { canonical: `/products/${p.slug || p.id}` },
    openGraph: {
      title,
      description,
      images: [{ url: `${SITE || ""}${mainImageUrl}` }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const p = getProductBySlugOrId(resolvedParams.slug);

  if (!p) notFound();

  const title = p.title || p.name || "Product";
  const slug = p.slug || String(p.id);
  const inStock = Number(p.stock) > 0;
  const url = `${SITE || ""}/products/${slug}`;

  const rawList = p.images?.length
    ? p.images
    : p.primary_image
      ? [{ image_path: p.primary_image }]
      : [{ image_path: p.image }];

  const productImages = rawList.map((item, index) => {
    const rawPath = typeof item === "object" ? item.image_path : item;
    const isVideo =
      (typeof item === "object" &&
        (item.type === "video" || item.media_type === "video")) ||
      /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(rawPath);

    return {
      id: item.id || index + 1,
      image_path: resolveImagePath(rawPath),
      type: isVideo ? "video" : "image",
      is_primary: index === 0,
    };
  });

  const price = Number(p.price) || 449;
  const originalPrice = Number(p.originalPrice || p.mrp || 599);
  const discountPercent =
    originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 25;

  const categoryName =
    typeof p.category === "object" && p.category?.name
      ? p.category.name
      : p.category_name || "Gift Bags";

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    image: productImages.map((i) => `${SITE || ""}${i.image_path}`),
    description: stripHtml(p.description || ""),
    sku: String(p.id),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "INR",
      price: String(price),
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };
  const allProducts = Array.isArray(demoCatalog)
  ? demoCatalog
  : demoCatalog.products || [];

const currentCategorySlug =
  p.category_slug ||
  (typeof p.category === "object"
    ? p.category?.slug
    : "");

const relatedProducts = allProducts
  .filter((item) => {
    const itemSlug = item.slug || String(item.id);

    const itemCategorySlug =
      item.category_slug ||
      (typeof item.category === "object"
        ? item.category?.slug
        : "");

    return (
      itemSlug !== slug &&
      itemCategorySlug === currentCategorySlug
    );
  })
  .slice(0, 4);

  return (
    <>
      <JsonLd data={productLd} />

      <main className="product-detail-page py-3">
        <div className="container px-lg-5">
          <MessagePopup
            title="Demo catalog preview"
            text="The store API is offline. Sample products can be added to the preview cart; checkout is disabled."
            duration={5000}
          />

          {/* Breadcrumbs */}
          <nav
            className="detail-breadcrumb mb-5 py-2 text-muted small"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="text-decoration-none text-muted">
              Home
            </Link>
            <span className="mx-1">/</span>
            <Link href="/products" className="text-decoration-none text-muted">
              Packaging & Wraps
            </Link>
            <span className="mx-1">/</span>
            <Link
              href={`/products?category=${p.category_slug || "gift-bags"}`}
              className="text-decoration-none text-muted"
            >
              {categoryName}
            </Link>
            <span className="mx-1">/</span>
            <span className="text-dark fw-semibold">{title}</span>
          </nav>

          {/* 3-Column Product Showcase */}
          <article className="row g-4 align-items-start">
            {/* 1. Left Gallery (Thumbnails below big image) */}
            <div
              className="col-12 col-md-5 col-xl-4 sticky-md-top z-3"
              style={{ top: "85px" }}
            >
              <ProductGallery
                images={productImages}
                title={title}
                badge="FESTIVE EDITION"
              />
            </div>

            {/* 2. Middle Details Column */}
            <div className="col-12 col-md-7 col-xl-5">
              <h1 className="fw-medium product-title  mt-1 mb-2" style={{ fontSize: "1.40rem" }}>
                {title}
              </h1>
              
              {/* Rating + Social Proof */}
              <div className="d-flex align-items-center gap-2 mb-3 small">
                <span className="text-warning">★★★★☆</span>
                <span className="fw-semibold text-dark">4.8</span>
                <span className="text-muted">| 142 ratings</span>
              </div>

              <hr className="my-2 text-muted opacity-25" />

              {/* Main Price */}
              <div className="my-3">
                <div className="d-flex align-items-baseline gap-2">
                  <span className="text-danger fs-4 fw-bold">
                    -{discountPercent}%
                  </span>
                  <span className="fs-3 fw-bold text-dark">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="small text-muted">
                  M.R.P.: <del>₹{originalPrice.toLocaleString("en-IN")}</del>{" "}
                  <span className="ms-2">Inclusive of all taxes</span>
                </div>
              </div>

              {/* Product Highlights Card */}
              <div className="card border rounded-3 p-3 my-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong className="small text-dark">
                    Product Description
                  </strong>
                </div>
                {p.description && (
                  <p className="small text-muted mb-0">{p.description}</p>
                )}
                <hr className="my-4 text-muted opacity-25" />
              
                <strong className="small text-dark mb-2">Product Features</strong>
                <div className="small text-muted">
                 {p.features && p.features.length > 0 ? (
                    <ul className="features-list mb-0">
                      {p.features.map((feature, index) => (
                        <li key={index} className="mb-1">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <hr className="my-4 text-muted opacity-25" />
                 <strong className="small text-dark mb-2">Product Specifications</strong>
                <div className="small text-muted">
                  {p.specifications && Object.keys(p.specifications).length > 0 ? (
                    <div className="specifications-table">
                      {Object.entries(p.specifications).map(([key, value]) => (
                        <div className="specification-row" key={key}>
                          <span className="specification-label">{key}</span>
                          <span className="specification-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* 3. Right Sticky Buy Box */}
            <div
              className="col-12 col-xl-3 sticky-xl-top z-3"
              style={{ top: "85px" }}
            >
              <ProductBuyBox product={p} price={price} inStock={inStock} />
            </div>
          </article>
        </div>
      </main>

      {relatedProducts.length > 0 && (
  <section className="container px-lg-5 py-5">
    <h2 className="explore__title mb-4">Related Products</h2>
    <div className="row g-3">
      {relatedProducts.map((product) => (
        <div key={product.id} className="col-6 col-md-4 col-lg-3">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  </section>
)}
    </>
  );
}
