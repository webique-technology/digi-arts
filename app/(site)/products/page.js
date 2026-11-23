import { Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import ExploreCategories from "@/components/ExploreCategories";
import { Col, Row } from "react-bootstrap";
import ProductCard from "@/components/ProductCard";
import MessagePopup from "@/components/MessagePopup";
import { getPublicResult } from "@/lib/api";
import {
  DEMO_CATEGORIES,
  getCategoryTiles,
  getDemoProducts,
  isCatalogUnavailable,
} from "@/lib/catalog";



const titleCase = (s = "") =>
  s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function generateMetadata({ searchParams = {} }) {
  const filtered = ["category", "min", "max", "sort", "q", "in_stock"].some(
    (k) => searchParams[k],
  );
  return {
    title: searchParams.category
      ? titleCase(searchParams.category)
      : "Shop All",
    description:
      "Browse the full Digi Art’s Store collection. Filter by category, price and more.",
    alternates: { canonical: "/products" },
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

export default async function ProductsPage({ searchParams = {} }) {
  const limit = 16;
  const sortBy = searchParams.sort || (searchParams.category ? "featured" : "name_asc");

  const qs = new URLSearchParams({ limit: String(limit) });
  for (const key of ["category", "q", "min", "max", "in_stock", "page"]) {
    if (typeof searchParams[key] === "string" && searchParams[key]) qs.set(key, searchParams[key]);
  }
  if (sortBy !== "featured") qs.set("sort", sortBy);

  const [result, categoriesResult] = await Promise.all([
    getPublicResult(`/products?${qs}`),
    getPublicResult("/categories"),
  ]);
  const offline = isCatalogUnavailable(result);
  const demo = offline ? getDemoProducts(searchParams, limit, sortBy) : null;

  const products = offline ? demo.products : result.data || [];
  const total = offline ? demo.total : result.meta?.total || 0;
  const totalPages = offline ? demo.pages : result.meta?.pages || 1;
  const currentPage = offline ? demo.page : result.meta?.page || 1;
  const categories = categoriesResult.data
    ? categoriesResult.data.filter((c) => c.product_count > 0)
    : DEMO_CATEGORIES;

  const slug =
    typeof searchParams.category === "string" ? searchParams.category : "";

    const bannerImages = {
  "ganesh-festival": "/images/inner-banner/2_result.webp",
  "diwali-festival": "/images/inner-banner/1_result.webp",
  "makar-sankranti": "/images/inner-banner/3_result.webp",
  "packaging-box": "/images/inner-banner/4_result.webp",
  "independence-day": "/images/inner-banner/5_result.webp",
  "christmas-day": "/images/inner-banner/6_result.webp",
  "wax-candle": "/images/inner-banner/8_result.webp",
  "valentine-day": "/images/inner-banner/7_result.webp",
  "wall-hanging": "/images/inner-banner/9_result.webp",
  "table-standee": "/images/inner-banner/8_result.webp",
  "bamboo-products": "/images/inner-banner/10_result.webp",
};

const bannerImage = bannerImages[slug] || "/images/inner-banner/1_result.webp";

  const heading = slug
    ? categories.find((c) => c.slug === slug)?.name || titleCase(slug)
    : "Products";

  return (
    <section className="collection position-relative">
      {offline && (
        <MessagePopup
          title="Demo catalog preview"
          text="The store API is offline. Sample products can be added to the preview cart; checkout is disabled."
          duration={5000}
        />
      )}
     <div className="collection__banner2">
  <img
    src={bannerImage}
    alt={`${heading} banner`}
    className="collection__banner2-img"
  />

  <div className="collection__banner2-content position-relative z-3">
    {/* existing banner content */}
  </div>
</div>

      <div className="container py-4 py-md-5">
        <div className="row g-4">
          <div className="col-12 col-md-4 col-lg-3 flex-shrink-0">
            <Suspense fallback={null}>
              <FilterBar categories={categories} total={total} />
            </Suspense>
          </div>

          <div className="col-12 col-md-8 col-lg-9 flex-grow-1">
            {products.length > 0 ? (
              <>
                <Row className="g-4">
                  {products.map((p) => (
                    <Col xs={6} md={4} key={p.id}>
                      <ProductCard p={p} preview={offline} />
                    </Col>
                  ))}
                </Row>

                <Pagination
                  page={currentPage}
                  pages={totalPages}
                  params={searchParams}
                />
              </>
            ) : (
              <p className="empty">No products match your filters.</p>
            )}
          </div>
        </div>
      </div>
      <ExploreCategories items={(await getCategoryTiles()) || undefined} />
    </section>
  );
}
