import { Suspense } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";

import FilterBar from "@/components/FilterBar";
import Pagination from "@/components/Pagination";
import ExploreCategories from "@/components/ExploreCategories";
import CatalogPreviewNotice from "@/components/CatalogPreviewNotice";
import demoCatalog from "@/data/demoCatalog.json";
import { Col, Row } from "react-bootstrap";
import ProductCard from "@/components/ProductCard";
import MessagePopup from "@/components/MessagePopup";

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
  // Extract all catalog categories and products from demoCatalog.json
  const rawProducts = Array.isArray(demoCatalog)
    ? demoCatalog
    : demoCatalog.products || [];

  const rawCategories =
    demoCatalog.categories ||
    [
      ...new Set(
        rawProducts.map((p) =>
          typeof p.category === "object" ? p.category.name : p.category,
        ),
      ),
    ]
      .filter(Boolean)
      .map((cat, idx) => ({
        id: idx + 1,
        name: cat,
        slug: cat.toLowerCase().replace(/\s+/g, "-"),
      }));

  const slug =
    typeof searchParams.category === "string" ? searchParams.category : "";
  const query = (searchParams.q || "").toLowerCase().trim();
  const minPrice = parseFloat(searchParams.min) || 0;
  const maxPrice = parseFloat(searchParams.max) || Infinity;
  const inStockOnly =
    searchParams.in_stock === "1" || searchParams.in_stock === "true";
  const sortBy = searchParams.sort || (slug ? "featured" : "name_asc");
  const currentPage = Math.max(1, Number(searchParams.page) || 1);
  const limit = 16;

  // 1. Filter products
  let filtered = rawProducts.filter((product) => {
    const categoryName =
      typeof product.category === "object"
        ? product.category?.name
        : product.category || "";
    const categorySlug =
      typeof product.category === "object" && product.category?.slug
        ? product.category.slug
        : categoryName.toLowerCase().replace(/\s+/g, "-");

    if (slug && categorySlug !== slug) return false;

    if (query) {
      const matchName = product.name?.toLowerCase().includes(query);
      const matchDesc = product.description?.toLowerCase().includes(query);
      if (!matchName && !matchDesc) return false;
    }

    const price = Number(product.price) || 0;
    if (price < minPrice || price > maxPrice) return false;

    if (inStockOnly) {
      const stock = Number(product.stock) || 0;
      if (stock <= 0) return false;
    }

    return true;
  });

  // 2. Sort products
  filtered.sort((a, b) => {
    const priceA = Number(a.price) || 0;
    const priceB = Number(b.price) || 0;
    const nameA = (a.name || "").toLowerCase();
    const nameB = (b.name || "").toLowerCase();

    switch (sortBy) {
      case "price_asc":
        return priceA - priceB;
      case "price_desc":
        return priceB - priceA;
      case "name_desc":
        return nameB.localeCompare(nameA);
      case "name_asc":
      default:
        return nameA.localeCompare(nameB);
    }
  });

  // 3. Paginate products
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (currentPage - 1) * limit;
  const paginatedProducts = filtered.slice(startIndex, startIndex + limit);

  const heading = slug
    ? rawCategories.find((c) => c.slug === slug)?.name || titleCase(slug)
    : "Products";

  return (
    <section className="collection position-relative">
      <MessagePopup
        title="Demo catalog preview"
        text="The store API is offline. Sample products can be added to the preview cart; checkout is disabled."
        duration={5000}
      />
      <div className="collection__banner">
        <h1 className="collection__title">{heading}</h1>
        <nav className="collection__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          {slug ? (
            <>
              <Link href="/products">Products</Link>
              <span>/</span>
              <span aria-current="page">{heading}</span>
            </>
          ) : (
            <span aria-current="page">Products</span>
          )}
        </nav>
      </div>

      <div className="container py-4 py-md-5">
        <div className="row g-4">
          <div className="col-12 col-md-4 col-lg-3 flex-shrink-0">
            <Suspense fallback={null}>
              <FilterBar categories={rawCategories} total={total} />
            </Suspense>
          </div>

          <div className="col-12 col-md-8 col-lg-9 flex-grow-1">
            {paginatedProducts.length > 0 ? (
              <>
                <Row className="g-4">
                  {paginatedProducts.map((p) => (
                    <Col sm={6} lg={4} key={p.id}>
                      <ProductCard p={p} />
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
      <ExploreCategories />
    </section>
  );
}
