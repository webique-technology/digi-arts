import { BLOG_POSTS, BLOG_CATEGORIES } from "@/data/blogData";
import BlogPageContent from "@/components/blog/BlogPageContent";
// Full Next.js 14 SEO Metadata
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

export default function BlogPage() {
  return <BlogPageContent posts={BLOG_POSTS} categories={BLOG_CATEGORIES} />;
}
