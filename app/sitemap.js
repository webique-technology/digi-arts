import { getPublic } from "@/lib/api";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  const [res, blogRes] = await Promise.all([
    getPublic("/products?limit=1000", 3600),
    getPublic("/blogs?limit=50", 3600),
  ]);
  const products = (res?.data || []).map((p) => ({
    url: `${SITE}/products/${p.slug}`,
    lastModified: p.updated_at,
  }));
  const blogs = (blogRes?.data || []).map((b) => ({
    url: `${SITE}/blog/${b.slug}`,
    lastModified: b.published_at,
  }));
  return [
    { url: SITE, lastModified: new Date() },
    { url: `${SITE}/products` },
    { url: `${SITE}/blog` },
    ...products,
    ...blogs,
  ];
}
