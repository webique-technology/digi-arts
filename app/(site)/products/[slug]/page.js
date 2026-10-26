import Link from "next/link";
import { notFound } from "next/navigation";
import { stripHtml, truncate, finalPrice, SITE } from "@/lib/utils";
import ProductGallery from "@/components/ProductGallery";
import ProductBuyBox from "@/components/ProductBuyBox";
import ExploreCategories from "@/components/ExploreCategories";
import { EXPLORE_PRODUCT } from "@/data/site";
import JsonLd from "@/components/JsonLd";
import demoCatalog from "@/data/demoCatalog.json";
import MessagePopup from "@/components/MessagePopup";

export const revalidate = 15;

// Resolves file paths to public/demo-products/
function resolveImagePath(img) {
  if (!img) return "/demo-products/placeholder.webp";

  let rawPath = typeof img === "object" ? img.image_path || img.src : img;
  if (!rawPath || typeof rawPath !== "string")
    return "/demo-products/placeholder.webp";

  if (rawPath.startsWith("http://") || rawPath.startsWith("https://")) {
    return rawPath;
  }

  const fileName = rawPath.split("/").filter(Boolean).pop();
  return `/demo-products/${fileName}`;
}

// Loads product directly from demoCatalog.json
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

  if (!p) {
    return {
      title: "Product not found",
      robots: { index: false },
    };
  }

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

  if (!p) {
    notFound();
  }

  const title = p.title || p.name || "Product";
  const slug = p.slug || String(p.id);
  const inStock = Number(p.stock) > 0;
  const url = `${SITE || ""}/products/${slug}`;

  // Normalize images array to resolve to /demo-products/<filename>
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

  const price =
    typeof finalPrice === "function" ? finalPrice(p) : p.sale_price || p.price;

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

  const crumbs = [
    { name: "Home", url: SITE || "/" },
    { name: "Products", url: `${SITE || ""}/products` },
    { name: title, url },
  ];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };

  return (
    <>
      <JsonLd data={productLd} />
      <JsonLd data={breadcrumbLd} />

      <main className="product-detail-page bg-light py-4">
        <div className="container">
          <MessagePopup
            title="Demo catalog preview"
            text="The store API is offline. Sample products can be added to the preview cart; checkout is disabled."
            duration={5000}
          />

          <article
            className="row g-4 align-items-start"
            data-testid="product-detail"
          >
            {/* Left Column: Gallery */}
            <div className="col-12 col-md-5 col-lg-5 sticky-top">
              <div className="product-media-wrapper">
                <div className="card product-card-container border-0 shadow-sm p-3">
                  <ProductGallery images={productImages} title={title} />
                </div>
              </div>
            </div>

            {/* Right Column: Title, Price, Details, Seller Info */}
            <div className="col-12 col-md-7 col-lg-7">
              <ProductBuyBox
                product={{
                  id: p.id,
                  slug,
                  title,
                  price: p.price,
                  sale_price: p.sale_price,
                  stock: p.stock,
                  images: productImages,
                  primary_image: productImages[0]?.image_path,
                  description: p.description,
                  weight: p.weight || "100",
                  dimensions: p.dimensions || "23 x 30 Cms",
                  color: p.color || "Multi",
                }}
                preview={true}
              />
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
