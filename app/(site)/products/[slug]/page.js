import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublic, getPublicResult, imageUrl } from "@/lib/api";
import { stripHtml, truncate, finalPrice, SITE } from "@/lib/utils";
import ProductGallery from "@/components/ProductGallery";
import ProductBuyBox from "@/components/ProductBuyBox";
import ExploreCategories from "@/components/ExploreCategories";
import { EXPLORE_PRODUCT } from "@/data/site";
import JsonLd from "@/components/JsonLd";
import { TEST_IDS } from "@/components/testIds";
import CatalogPreviewNotice from "@/components/CatalogPreviewNotice";
import {
  DEMO_PRODUCTS,
  isCatalogUnavailable,
  isDemoCatalogPreviewEnabled,
} from "@/lib/catalog";
import MessagePopup from "@/components/messagePopup";

export const revalidate = 15;

async function load(slug, fresh = false) {
  const result = await getPublicResult(
    `/products/${encodeURIComponent(slug)}`,
    fresh ? 0 : 15,
  );
  if (
    result.data ||
    !isDemoCatalogPreviewEnabled ||
    !isCatalogUnavailable(result)
  )
    return result;
  const demoProduct = DEMO_PRODUCTS.find((product) => product.slug === slug);
  return demoProduct ? { ...result, data: demoProduct, preview: true } : result;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const result = await load(resolvedParams.slug);
  const p = result.data;
  if (result.status === 404)
    return { title: "Product not found", robots: { index: false } };
  if (!p)
    return {
      title: "Product temporarily unavailable",
      robots: { index: false },
    };
  const title = p.meta_title || p.title;
  const description =
    p.meta_description ||
    truncate(stripHtml(p.description)) ||
    `Buy ${p.title} at Digi Art’s Store`;
  const img = p.images?.[0];
  return {
    title,
    description,
    robots: result.preview ? { index: false, follow: false } : undefined,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      title,
      description,
      images: img ? [{ url: `${SITE}${imageUrl(img.image_path)}` }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProductPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) || {};
  const result = await load(
    resolvedParams.slug,
    Boolean(resolvedSearchParams.retry),
  );
  const p = result.data;

  if (result.status === 404) notFound();

  if (!p) {
    return (
      <section className="py-5">
        <div
          className="container empty-state text-center py-5"
          data-testid={TEST_IDS.productLoadError}
          role="alert"
        >
          <h1 className="h2 mb-3">We couldn’t load this product</h1>
          <p className="text-muted mb-4">
            The store is temporarily unavailable. Please try again, or browse
            all products.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link
              href={`/products/${encodeURIComponent(resolvedParams.slug)}?retry=${Date.now()}`}
              className="btn btn-primary"
            >
              Try again
            </Link>
            <Link href="/products" className="btn btn-outline-secondary">
              Browse products
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const price = finalPrice(p);
  const inStock = Number(p.stock) > 0;
  const url = `${SITE}/products/${p.slug}`;
  const productImages = p.images?.length
    ? p.images
    : p.primary_image
      ? [{ image_path: p.primary_image }]
      : [];

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    image: productImages.map((i) => `${SITE}${imageUrl(i.image_path)}`),
    description: stripHtml(p.description),
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
    { name: "Home", url: SITE },
    { name: "Products", url: `${SITE}/products` },
    { name: p.title, url },
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
          {/* {result.preview && <CatalogPreviewNotice />} */}
          {result.preview && (
            <MessagePopup
              title="Demo catalog preview"
              text="The store API is offline. Sample products can be added to the preview cart; checkout is disabled."
              duration={5000}
            />
          )}
          <article
            className="row g-4 align-items-start"
            data-testid="product-detail"
          >
            {/* Left Column: Gallery & Sticky Media Controls */}
            <div className="col-12 col-md-5 col-lg-5 sticky-top">
              <div className="product-media-wrapper">
                <div className="card product-card-container border-0 shadow-sm p-3">
                  <ProductGallery images={productImages} title={p.title} />
                </div>
              </div>
            </div>

            {/* Right Column: Title, Price, Details, Seller Info */}
            <div className="col-12 col-md-7 col-lg-7">
              <ProductBuyBox
                product={{
                  id: p.id,
                  slug: p.slug,
                  title: p.title,
                  price: p.price,
                  sale_price: p.sale_price,
                  stock: p.stock,
                  images: productImages,
                  primary_image: p.primary_image,
                  description: p.description,
                  weight: p.weight || "100",
                  dimensions: p.dimensions || "23 x 30 Cms",
                  color: p.color || "Multi",
                }}
                preview={Boolean(result.preview)}
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
