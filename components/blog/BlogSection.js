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

export default function BlogSection({ posts = [], categories = [] }) {
  return (
    <div className="blog-sec-page section-padding">
      {/* Editorial Header */}
      <section className="blog-sec-header title-row-margin">
        <Container className="position-relative z-3 d-flex flex-column align-items-center justify-content-center">
          <div className="blog-sec-header__text">
            <h1 className="blog-sec-header__title">Our Blogs</h1>
            <p className="blog-sec-header__subtitle">
              Our products are designed to bring creativity, beauty, and a
              traditional touch to every celebration. We focus on unique
              designs, quality materials, attractive printing, and affordable
              decorative solutions.
            </p>
          </div>
        </Container>
      </section>

      <section className="blog-section">
        <Container>
          {/* 12-Card Grid */}
          <div className="blog-grid-section">
            {posts.length > 0 ? (
              <Row className="g-3 g-md-4">
                {posts.slice(0, 4).map((post) => (
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
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}
