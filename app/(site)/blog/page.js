import BlogPageContent from "@/components/blog/BlogPageContent";
import { getBlogs, getBlogCategories } from "@/lib/blogs";

export const revalidate = 60;

export const metadata = {
  title:
    "Journal & Stories | Digi Art's - Handcrafted Festive Decor & Traditions",
  description:
    "Explore traditional Indian craftsmanship, festive styling ideas, sustainable gifting rituals, and artisan chronicles from our workshops across Jaipur, Kutch, and Bengal.",
  keywords: [
    "handcrafted gift bags",
    "sustainable gifting",
    "diwali decor ideas",
    "indian folk art",
    "plantable seed paper",
    "hand-cast brass urli",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Journal & Stories | Digi Art's",
    description:
      "Chronicles of craft, culture, festive decor guides, and artisanal heritage.",
    url: "/blog",
    siteName: "Digi Art's",
    locale: "en_IN",
    type: "website",
  },
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getBlogs(), getBlogCategories()]);
  return <BlogPageContent posts={posts} categories={categories} />;
}
