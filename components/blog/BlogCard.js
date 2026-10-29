import Link from "next/link";
import { RiArrowRightLine } from "react-icons/ri";

export default function BlogCard({ post }) {
  if (!post) return null;

  return (
    <article className="blog-card">
      <div className="blog-card__media-wrapper">
        <Link href={`/blog/${post.slug}`} className="blog-card__img-link">
          <img
            src={post.image}
            alt={post.title}
            className="blog-card__img"
            loading="lazy"
          />
        </Link>
        {post.tag && <span className="blog-card__tag-badge">{post.tag}</span>}
      </div>

      <div className="blog-card__body">
        <div className="blog-card__meta">
          <span>{post.date}</span>
          <span className="blog-card__meta-separator">·</span>
          <span>{post.readTime}</span>
        </div>

        <Link href={`/blog/${post.slug}`} className="blog-card__title-link">
          <h2 className="blog-card__title" title={post.title}>
            {post.title}
          </h2>
        </Link>

        <p className="blog-card__excerpt">{post.excerpt}</p>
      </div>

      <div className="blog-card__footer">
        {/* <div className="blog-card__author">
          <div className="blog-card__author-avatar">
            {post.author?.initials || "DA"}
          </div>
          <span className="blog-card__author-name">
            {post.author?.name || "DigiArts"}
          </span>
        </div> */}

        <Link href={`/blog/${post.slug}`} className="blog-card__read-link">
          <span>Read Story</span>
          <RiArrowRightLine className="blog-card__read-icon" />
        </Link>
      </div>
    </article>
  );
}
