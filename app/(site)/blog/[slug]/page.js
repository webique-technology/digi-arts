import { notFound } from "next/navigation";
import BlogDetailContent from "@/components/blog/BlogDetailContent";
import { getBlog } from "@/lib/blogs";
import { stripHtml, truncate } from "@/lib/utils";

export const revalidate = 60;

async function loadPost(slug) {
  const { post, status } = await getBlog(slug);
  if (post) return post;
  if (status === 404) notFound();
  throw new Error("Blog is temporarily unavailable");
}

export async function generateMetadata({ params }) {
  const { post, status } = await getBlog(params.slug);
  if (!post) {
    return {
      title:
        status === 404
          ? "Story Not Found | Digi Art's"
          : "Journal | Digi Art's",
      robots: { index: false },
    };
  }

  const title = post.metaTitle || `${post.title} | Digi Art's Journal`;
  const description =
    post.metaDescription ||
    post.excerpt ||
    post.subtitle ||
    truncate(stripHtml(post.body));
  const image = post.heroImage || post.image;

  return {
    title,
    description,
    keywords: [post.tag, ...post.tags].filter(Boolean),
    authors: [{ name: post.author?.name || "Digi Art's" }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `/blog/${post.slug}`,
      siteName: "Digi Art's",
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author?.name || "Digi Art's"],
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: post.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const post = await loadPost(params.slug);
  return <BlogDetailContent post={post} />;
}
