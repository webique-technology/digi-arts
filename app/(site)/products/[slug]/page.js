import Link from "next/link";
import { notFound } from "next/navigation";
import { stripHtml, truncate, finalPrice, SITE } from "@/lib/utils";
import ProductGallery from "@/components/ProductGallery";
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
  if (rawPath.startsWith("http://") || rawPath.startsWith("https://"))
    return rawPath;
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
    return {
      id: item.id || index + 1,
      image_path: resolveImagePath(rawPath),
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

  return (
    <>
      <JsonLd data={productLd} />

      <main className="product-detail-page bg-white py-3">
        <div className="container px-lg-5">
          <MessagePopup
            title="Demo catalog preview"
            text="The store API is offline. Sample products can be added to the preview cart; checkout is disabled."
            duration={5000}
          />

          {/* Breadcrumbs */}
          <nav
            className="detail-breadcrumb mb-3 text-muted small"
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
              <span className="text-uppercase fw-bold text-danger small letter-spacing-1">
                VISIT THE DIGIARTS STORE
              </span>

              <h1 className="h4 fw-bold text-dark mt-1 mb-1 font-serif">
                {title}
              </h1>
              <p className="text-muted small mb-2">
                Handcrafted Premium Festive & Return Gift Bag with Gold Accents
              </p>

              {/* Rating + Social Proof */}
              <div className="d-flex align-items-center gap-2 mb-3 small">
                <span className="text-warning">★★★★☆</span>
                <span className="fw-semibold text-dark">4.8</span>
                <span className="text-muted">| 142 ratings</span>
                <span className="badge bg-success-subtle text-success border border-success-subtle">
                  50+ bought in past month
                </span>
              </div>

              <hr className="my-2 text-muted opacity-25" />

              {/* Main Price */}
              <div className="my-3">
                <div className="d-flex align-items-baseline gap-2">
                  <span className="text-danger fs-4 fw-bold">
                    -{discountPercent}%
                  </span>
                  <span className="fs-2 fw-bold text-dark">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="small text-muted">
                  M.R.P.: <del>₹{originalPrice.toLocaleString("en-IN")}</del>{" "}
                  <span className="ms-2">Inclusive of all taxes</span>
                </div>
              </div>

              {/* Offers Box */}
              <div className="offers-box border rounded-3 p-3 my-3 bg-light-subtle">
                <div className="fw-bold small text-dark mb-2 d-flex align-items-center gap-1">
                  🏷 Available Offers
                </div>
                <div className="row g-2">
                  <div className="col-6">
                    <div className="offer-card border rounded p-2 bg-white h-100">
                      <strong className="d-block small text-dark">
                        Bank Offer
                      </strong>
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Flat Rs. 50 off on UPI transactions above Rs. 499
                      </span>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="offer-card border rounded p-2 bg-white h-100">
                      <strong className="d-block small text-dark">
                        Bulk Savings
                      </strong>
                      <span
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Buy 5 or more, get additional 10% off automated
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Size Selectors */}
              {/* <div className="my-3">
                <div className="d-flex justify-content-between small mb-2">
                  <span className="fw-bold text-dark">Select Size:</span>
                  <span
                    className="text-danger fw-semibold"
                    style={{ cursor: "pointer" }}
                  >
                    Size Guide
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-danger active text-start py-1 px-3 rounded-2"
                  >
                    <span className="d-block fw-bold small">Free Size</span>
                    <small style={{ fontSize: "0.7rem" }}>
                      Standard 10 × 12 × 4 in
                    </small>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary text-start py-1 px-3 rounded-2"
                  >
                    <span className="d-block fw-bold small">Medium</span>
                    <small style={{ fontSize: "0.7rem" }}>8 × 10 × 3 in</small>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary text-start py-1 px-3 rounded-2"
                    disabled
                  >
                    <span className="d-block fw-bold small">Jumbo</span>
                    <small style={{ fontSize: "0.7rem" }}>Out of stock</small>
                  </button>
                </div>
              </div> */}

              {/* Product Highlights Card */}
              <div className="card border rounded-3 p-3 my-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong className="small text-dark">
                    Product Highlights
                  </strong>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger py-0 px-2"
                    style={{ fontSize: "0.7rem" }}
                  >
                    COPY
                  </button>
                </div>
                <div className="small text-muted mb-2 d-flex justify-content-between">
                  <span>Product Weight</span>
                  <span className="fw-semibold text-dark">
                    {p.weight || "100 g"}
                  </span>
                </div>
                <ul className="small text-muted ps-3 mb-0">
                  <li>
                    Heavyweight 250 GSM handmade paper with festive golden foil
                    stripes.
                  </li>
                  <li>
                    Comfortable braided satin cotton cord handles for safe
                    carrying.
                  </li>
                  <li>Holds up to 2.5 kg weight without base sagging.</li>
                  <li>Comes with matching attached gift message tag.</li>
                </ul>
              </div>

              {/* Description Box */}
              <div className="card border rounded-3 p-3 my-3">
                <strong className="small text-dark mb-2">Description</strong>
                <div className="small text-muted">
                  <div className="row py-1 border-bottom">
                    <div className="col-4 fw-semibold">Material:</div>
                    <div className="col-8">Handmade paper</div>
                  </div>
                  <div className="row py-1 border-bottom">
                    <div className="col-4 fw-semibold">Size:</div>
                    <div className="col-8">
                      {p.dimensions || "10 × 12 × 4 Inches"}
                    </div>
                  </div>
                  <div className="row py-1">
                    <div className="col-4 fw-semibold">Colour:</div>
                    <div className="col-8">
                      {p.color || "Terracotta & Gold Stripe"}
                    </div>
                  </div>
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

      <ExploreCategories
        items={EXPLORE_PRODUCT}
        title="Explore Other Categories"
        variant="large"
      />
    </>
  );
}
