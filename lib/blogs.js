import { getPublicResult, imageUrl } from "@/lib/api";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      })
    : "";

// API blog -> shape used by the blog components
export const toPost = (b) => ({
  id: b.id,
  slug: b.slug,
  title: b.title,
  subtitle: b.subtitle || "",
  excerpt: b.excerpt || "",
  category: b.category || "",
  tag: b.tag || "",
  tags: b.tags || [],
  date: formatDate(b.published_at),
  publishedAt: b.published_at,
  updatedAt: b.updatedAt,
  readTime: b.read_time ? `${b.read_time} min read` : "",
  image: imageUrl(b.cover_image || b.hero_image),
  imageVariants: b.cover_image ? b.cover_image_variants : b.hero_image_variants,
  heroImage: imageUrl(b.hero_image || b.cover_image),
  heroImageVariants: b.hero_image ? b.hero_image_variants : b.cover_image_variants,
  author: b.author ? { ...b.author, avatar: imageUrl(b.author.avatar) } : null,
  body: b.body || "",
  metaTitle: b.meta_title || "",
  metaDescription: b.meta_description || "",
  related: (b.related || []).map(toPost),
});

export async function getBlogs(revalidate = 60) {
  const res = await getPublicResult("/blogs?limit=50", revalidate);
  return (res.data || []).map(toPost);
}

export async function getBlogCategories() {
  const res = await getPublicResult("/blogs/categories", 300);
  return [
    { id: "all", label: "All Stories" },
    ...(res.data || []).map((c) => ({ id: c.slug, label: c.label })),
  ];
}

// { post, status }: post is null when missing (404) or the API is unreachable (status 0/5xx)
export async function getBlog(slug) {
  const res = await getPublicResult(`/blogs/${encodeURIComponent(slug)}`, 60);
  return { post: res.data ? toPost(res.data) : null, status: res.status };
}
