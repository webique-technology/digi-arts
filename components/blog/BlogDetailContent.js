"use client";

import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { RiTimeLine } from "react-icons/ri";

export default function BlogDetailContent({ post }) {
  const related = post.related || [];

  return (
    <div className="blog-detail-page">
      <Container>
        <nav aria-label="Breadcrumb" className="blog-detail-breadcrumb">
          <Link href="/" className="blog-detail-breadcrumb__link">
            Home
          </Link>
          <span className="blog-detail-breadcrumb__divider">/</span>
          <Link href="/blog" className="blog-detail-breadcrumb__link">
            Blogs
          </Link>
          <span className="blog-detail-breadcrumb__divider">/</span>
          <span className="blog-detail-breadcrumb__current">{post.title}</span>
        </nav>
      </Container>

      <section
        className="blog-detail-hero d-flex align-items-end justify-content-center"
        style={post.heroImage ? { backgroundImage: `url(${post.heroImage})` } : undefined}
      >
        <div className="blog-detail-hero__wrapper">
          <Container className="position-relative z-3">
            <h1 className="blog-detail-header__title">{post.title}</h1>
          </Container>
        </div>
      </section>

      <section>
        <Container>
          <div className="blog-detail-header">
            <div className="blog-detail-header__meta-strip">
              {post.tag && (
                <>
                  <span className="blog-detail-header__category-pill">{post.tag}</span>
                  <span className="blog-detail-header__dot">•</span>
                </>
              )}
              {post.readTime && (
                <>
                  <span className="blog-detail-header__read-time">
                    <RiTimeLine className="blog-detail-header__icon" /> {post.readTime}
                  </span>
                  <span className="blog-detail-header__dot">•</span>
                </>
              )}
              <span className="blog-detail-header__date">Published {post.date}</span>
            </div>
          </div>

          <Row className="blog-detail-layout">
            <Col lg={related.length ? 9 : 12} className="blog-content-col pb-4 pb-md-5">
              {/* body is sanitized by the API before it is stored */}
              <article
                className="blog-prose blog-rich"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />
            </Col>

            {related.length > 0 && (
              <Col lg={3} className="blog-sidebar-col pb-4 pb-md-5">
                <div className="blog-sticky-sidebar">
                  <div className="blog-toc-card">
                    <span className="blog-toc-card__heading">RELATED BLOGS</span>
                    <nav className="blog-toc-card__nav">
                      {related.map((item, index) => (
                        <Link href={`/blog/${item.slug}`} key={item.slug} className="blog-toc-card__link">
                          {index + 1}. {item.title}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </div>
  );
}
