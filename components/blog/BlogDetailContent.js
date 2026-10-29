"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import {
  RiTimeLine,
  RiHeartFill,
  RiShareForwardLine,
  RiWhatsappLine,
  RiPinterestLine,
  RiLinksLine,
  RiDoubleQuotesL,
  RiPlantLine,
  RiArrowRightLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiChat1Line,
  RiNotificationBadgeLine,
} from "react-icons/ri";
import BlogCard from "./BlogCard";
import { BLOG_POSTS } from "@/data/blogData";

export default function BlogDetailContent({ post }) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(148);
  const [copied, setCopied] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentsList, setCommentsList] = useState(post.comments || []);

  // 1. Reading progress scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (height > 0) {
        setReadingProgress((winScroll / height) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Like button toggle
  const toggleLike = () => {
    if (!liked) {
      setLikesCount((prev) => prev + 1);
      setLiked(true);
    } else {
      setLikesCount((prev) => prev - 1);
      setLiked(false);
    }
  };

  // 3. Copy Link
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // 4. Submit Comment
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setCommentsList([
      {
        id: `c_${Date.now()}`,
        author: "You",
        date: "Just now",
        text: commentText.trim(),
      },
      ...commentsList,
    ]);
    setCommentText("");
    setShowCommentBox(false);
  };

  return (
    <div className="blog-detail-page">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="blog-detail-breadcrumb">
          <Link href="/" className="blog-detail-breadcrumb__link">
            Home
          </Link>
          <span className="blog-detail-breadcrumb__divider">/</span>
          <Link href="/blog" className="blog-detail-breadcrumb__link">
            Blogs
          </Link>
          <span className="blog-detail-breadcrumb__divider">/</span>
          <span className="blog-detail-breadcrumb__current">
            Large Floral Gift Bag
          </span>
        </nav>
      </Container>

      {/* Hero Visual Section */}
      <section
        className="blog-detail-hero d-flex align-items-end justify-content-center"
        style={{ backgroundImage: `url(${post.heroImage})` }}
      >
        <div className="blog-detail-hero__wrapper">
          <Container className="position-relative z-3">
            <h1 className="blog-detail-header__title">{post.title}</h1>
          </Container>
        </div>
      </section>

      <section>
        <Container>
          {/* Article Header */}
          <div className="blog-detail-header">
            <div className="blog-detail-header__meta-strip">
              <span className="blog-detail-header__category-pill">
                {post.tag || "Festive Gifting & Heritage"}
              </span>
              <span className="blog-detail-header__dot">•</span>
              <span className="blog-detail-header__read-time">
                <RiTimeLine className="blog-detail-header__icon" />{" "}
                {post.readTime}
              </span>
              <span className="blog-detail-header__dot">•</span>
              <span className="blog-detail-header__date">
                Published {post.date}
              </span>
            </div>
          </div>

          {/* Main 2-Column Section */}
          <Row className="blog-detail-layout">
            {/* Left Column: Article Body */}
            <Col lg={9} className="blog-content-col pb-4 pb-md-5">
              <article className="blog-article-body">
                {/* Section 1: Why Handmade Paper */}
                <section id="section-handmade-paper" className="blog-section">
                  <h2 className="blog-section__title">
                    Why Handmade Paper Elevates Gifting
                  </h2>
                  <div className="blog-prose">
                    <p>
                      <span className="blog-drop-cap">T</span>he tactile
                      experience of receiving a token of celebration begins long
                      before the parcel is opened. When a recipient encounters
                      the raw, organic grain of artisanal cotton-rag paper,
                      their fingers register authenticity instantly. Unlike
                      commercial glossy wrapping paper that ends up discarded
                      within seconds, handcrafted 250 GSM tree-free sheets tell
                      the story of patience and generational heritage.
                    </p>
                    <p>
                      Crafted primarily from upcycled textile waste and wild
                      cotton fibers in the historic mills of Sanganer and Bagru,
                      this paper requires zero tree felling. It retains natural
                      flecks of straw, discarded silk threads, and indigenous
                      seeds. Coloured meticulously with turmeric, madder root,
                      pomegranate rind, and indigo, every fold releases an
                      earthy fragrance that pairs seamlessly with festive Diwali
                      or celebratory wedding gift offerings.
                    </p>
                  </div>
                </section>

                {/* Section 2: Origami & Furoshiki Steps */}
                <section id="section-origami-folds" className="blog-section">
                  <h2 className="blog-section__title">
                    Step-by-Step: The Furoshiki and Origami Fold Method
                  </h2>
                  <p className="blog-prose-lead">
                    By eliminating synthetic adhesive tape, you invite the
                    recipient to participate in a mindful unwrapping ritual.
                    Drawing inspiration from Japanese <em>tsutsumi</em> and
                    Indian bridal trunk cloth folds, here is how our studio
                    stylists construct seamless silhouettes:
                  </p>

                  <div className="blog-steps-container">
                    {post.steps?.map((step) => (
                      <div key={step.number} className="blog-step-card">
                        <div className="blog-step-card__number">
                          {step.number}
                        </div>
                        <div className="blog-step-card__info">
                          <h3 className="blog-step-card__title">
                            {step.title}
                          </h3>
                          <p className="blog-step-card__desc">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Section 4: Eco Embellishments */}
                <section id="section-embellishments" className="blog-section">
                  <h2 className="blog-section__title">
                    Eco-Friendly Embellishments: Marigold Strings and Jute Twine
                  </h2>
                  <p className="blog-prose-lead">
                    Plastic ribbons and synthetic adhesive rosettes linger in
                    landfills for centuries. Instead, Indian festive decor
                    offers an opulent treasury of biodegradable embellishments
                    that carry cultural blessings.
                  </p>

                  <Row className="g-3">
                    {post.embellishments?.map((emb, idx) => (
                      <Col sm={6} key={idx}>
                        <div className="blog-embellishment-card">
                          <div className="blog-embellishment-card__icon">
                            {emb.icon === "flower" ? (
                              <RiPlantLine />
                            ) : (
                              <RiNotificationBadgeLine />
                            )}
                          </div>
                          <h4 className="blog-embellishment-card__title">
                            {emb.title}
                          </h4>
                          <p className="blog-embellishment-card__desc">
                            {emb.desc}
                          </p>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </section>
              </article>
            </Col>

            {/* Right Column: Sticky Table of Contents & Interaction */}
            <Col lg={3} className="blog-sidebar-col pb-4 pb-md-5">
              <div className="blog-sticky-sidebar">
                {/* In This Journal TOC */}
                <div className="blog-toc-card">
                  <span className="blog-toc-card__heading">RELATED BLOGS</span>
                  <nav className="blog-toc-card__nav">
                    {BLOG_POSTS.slice(0, 5).map((item, index) => {
                      return (
                        <Link
                          href={item.slug}
                          key={index}
                          className="blog-toc-card__link"
                        >
                          {index + 1}. {item.title}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
