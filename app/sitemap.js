import { getPublic } from '@/lib/api';
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default async function sitemap() {
  const res = await getPublic('/products?limit=1000', 3600);
  const products = (res?.data || []).map((p) => ({ url: `${SITE}/products/${p.slug}`, lastModified: p.updated_at }));
  return [{ url: SITE, lastModified: new Date() }, { url: `${SITE}/products` }, ...products];
}
