"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import {
  RiSearchLine,
  RiCheckLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import BlogCard from "./BlogCard";

export default function BlogPageContent({ posts = [], categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;

  // Filter posts by category and search
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tag.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage) || 1;
  const indexOfFirst = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(
    indexOfFirst,
    indexOfFirst + postsPerPage,
  );

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="blog-page py-0">
      {/* Editorial Header */}
      <section className="blog-header">
        <Container className="position-relative z-3 d-flex flex-column align-items-center justify-content-center">
          <div className="blog-header__text">
            <h1 className="blog-header__title">Journal & Stories</h1>
            <p className="blog-header__subtitle">
              Our products are designed to bring creativity, beauty, and a
              traditional touch to every celebration. We focus on unique
              designs, quality materials, attractive printing, and affordable
              decorative solutions.
            </p>
          </div>

          <div className="blog-header__badge">
            <span className="blog-header__badge-dot"></span>
            <span>{posts.length} Stories Published</span>
          </div>
        </Container>
      </section>

      <section className="blog-section py-4 py-md-5">
        <Container>
          {/* 12-Card Grid */}
          <div className="blog-grid-section">
            {currentPosts.length > 0 ? (
              <Row className="g-3 g-md-4">
                {currentPosts.map((post) => (
                  <Col key={post.id} xs={6} sm={6} md={4} lg={3}>
                    <BlogCard post={post} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="blog-empty-state">
                <h3>No articles found</h3>
                <p>
                  Try searching for a different topic or select another
                  category.
                </p>
                <button
                  type="button"
                  className="blog-empty-state__reset-btn"
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPosts > 0 && (
            <div className="blog-pagination mb-0">
              <span className="blog-pagination__count">
                Showing{" "}
                <strong>
                  {indexOfFirst + 1}–
                  {Math.min(indexOfFirst + postsPerPage, totalPosts)}
                </strong>{" "}
                of <strong>{totalPosts}</strong> articles
              </span>

              <div className="blog-pagination__controls">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="blog-pagination__nav-btn"
                >
                  <RiArrowLeftSLine />
                  <span>Previous</span>
                </button>

                <div className="blog-pagination__pages">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`blog-pagination__page-btn ${
                          currentPage === pageNum ? "is-active" : ""
                        }`}
                      >
                        {pageNum}
                      </button>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="blog-pagination__nav-btn"
                >
                  <span>Next</span>
                  <RiArrowRightSLine />
                </button>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
