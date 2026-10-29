import { notFound } from "next/navigation";
import BlogDetailContent from "@/components/blog/BlogDetailContent";
import { BLOG_POSTS, getPostBySlug } from "@/data/blogData";

// 1. Generate Dynamic SEO Meta Tags for Google and Social Platforms
export async function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Story Not Found | Digi Art's",
    };
  }

  const siteUrl = "https://digiarts.in";
  const postUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    title: `${post.title} | Digi Art's Journal`,
    description: post.excerpt || post.subtitle,
    keywords: [
      post.tag,
      "sustainable gifting",
      "handcrafted paper",
      "indian festive decor",
      "diwali packaging",
    ],
    authors: [{ name: post.author?.name || "Digi Art's" }],
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: "Digi Art's",
      type: "article",
      publishedTime: post.date,
      authors: [post.author?.name || "Digi Art's"],
      images: [
        {
          url: post.heroImage || post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.heroImage || post.image],
    },
  };
}

// 2. Pre-generate all blog paths statically at build time
export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogDetailPage({ params }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <BlogDetailContent post={post} />;
}
