import { Suspense } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import FilterBar from '@/components/FilterBar';
import Pagination from '@/components/Pagination';
import ExploreCategories from '@/components/ExploreCategories';
import { getPublic, getPublicResult } from '@/lib/api';
import { TEST_IDS } from '@/components/testIds';
import CatalogPreviewNotice from '@/components/CatalogPreviewNotice';
import { DEMO_CATEGORIES, getDemoProducts, isCatalogUnavailable, isDemoCatalogPreviewEnabled } from '@/lib/catalog';

const KEYS = ['category', 'min', 'max', 'sort', 'q', 'in_stock', 'page'];
const titleCase = (s = '') => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export function generateMetadata({ searchParams }) {
  const filtered = ['category', 'min', 'max', 'sort', 'q', 'in_stock'].some((k) => searchParams[k]);
  return {
    title: searchParams.category ? titleCase(searchParams.category) : 'Shop All',
    description: 'Browse the full Digi Art’s Store collection. Filter by category, price and more.',
    alternates: { canonical: '/products' },
    robots: filtered ? { index: false, follow: true } : undefined,
  };
}

export default async function ProductsPage({ searchParams }) {
  const qs = new URLSearchParams();
  KEYS.forEach((k) => { const v = searchParams[k]; if (v && typeof v === 'string') qs.set(k, v); });
  const slug = typeof searchParams.category === 'string' ? searchParams.category : '';
  if (!qs.has('sort')) qs.set('sort', slug ? 'featured' : 'name_asc');
  qs.set('limit', '16');

  const [res, cats] = await Promise.all([
    getPublicResult(`/products?${qs}`, searchParams.retry ? 0 : 15),
    getPublic('/categories', 300),
  ]);
  const preview = isDemoCatalogPreviewEnabled && !Array.isArray(res.data) && isCatalogUnavailable(res);
  const demoPage = preview ? getDemoProducts(searchParams, 16, slug ? 'featured' : 'name_asc') : null;
  const categories = Array.isArray(cats?.data) ? cats.data : preview ? DEMO_CATEGORIES : [];
  const products = Array.isArray(res.data) ? res.data : demoPage?.products || [];
  const loadFailed = !Array.isArray(res.data) && !preview;
  const meta = preview ? demoPage : res?.meta || {};
  const page = Number(meta.page) || Number(searchParams.page) || 1;
  const heading = slug ? categories.find((c) => c.slug === slug)?.name || titleCase(slug) : 'Products';

  return (
    <section className="collection">
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
      <div className="container">
        
        {preview && <CatalogPreviewNotice />}
        <Suspense fallback={null}><FilterBar categories={categories} total={meta.total} /></Suspense>
        {loadFailed ? (
          <div className="empty-state collection__error" role="alert">
            <h2>We couldn’t load the product catalog</h2>
            <p>The catalog API returned an error. Try again, or check that the product service is available.</p>
            <Link className="btn" href={`/products?retry=${Date.now()}`} data-testid={TEST_IDS.collectionLoadRetry}>Try again</Link>
          </div>
        ) : products.length ? (
          <>
            <div className="grid collection__grid">{products.map((p) => <ProductCard key={p.id} p={p} preview={preview} />)}</div>
            <Pagination page={page} pages={Number(meta.pages) || 1} params={searchParams} />
          </>
        ) : (
          <p className="empty">No products match your filters.</p>
        )}
      </div>
      <ExploreCategories />
    </section>
  );
}
