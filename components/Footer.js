"use client";

import { useState } from "react";
import Link from "next/link";
import { Container, Row, Col, Form } from "react-bootstrap";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import Logo from "./Logo"; // Or replace with <Image src="/images/logo.png" ... />

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // Newsletter submission logic
    setEmail("");
  };

  return (
    <footer className="da-footer">
      <div className="da-footer__main">
        <Container>
          <Row className="gy-4">
            {/* Column 1: Brand / Logo + Newsletter + Social Icons */}
            <Col xs={12} md={6} lg={5} className="da-footer__col-brand pe-lg-4">
              <div className="da-footer__brand-wrap">
                <Link
                  href="/"
                  className="da-footer__brand-link"
                  aria-label="DigiArts Home"
                >
                  {/* Brand Logo Slot: Use <Logo /> or keep the text */}
                  <span className="da-footer__brand-title">DigiArts</span>
                  {/* If using an image/component logo, uncomment below: */}
                  {/* <Logo className="da-footer__logo-img" /> */}
                </Link>

                <p className="da-footer__tagline">
                  Curating premium festive products and home decor that
                  celebrate Indian traditions with modern elegance.
                </p>
              </div>

              {/* Newsletter Form */}
              <div className="da-footer__newsletter">
                <h4 className="da-footer__newsletter-title">
                  Subscribe to our newsletter
                </h4>
                <Form
                  onSubmit={handleSubscribe}
                  className="da-footer__form d-flex"
                >
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="da-footer__input"
                    aria-label="Enter your email"
                    required
                  />
                  <button type="submit" className="da-footer__subscribe-btn">
                    Subscribe
                  </button>
                </Form>
              </div>

              {/* Social Media Links */}
              <div className="da-footer__socials d-flex gap-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="da-footer__social-btn"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="instagram.com/digi_arts11?xtok=MWY0aHRvbWt5cndzOQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="da-footer__social-btn"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="da-footer__social-btn"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="da-footer__social-btn"
                >
                  <FaYoutube />
                </a>
              </div>
            </Col>

            {/* Column 2: Company */}
            <Col xs={6} sm={4} lg={2} className="da-footer__col-links">
              <h3 className="da-footer__heading">Company</h3>
              <ul className="da-footer__list">
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/our-story">Our Story</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
                <li>
                  <Link href="/blog">Blogs</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
              </ul>
            </Col>

            {/* Column 3: Help */}
            <Col xs={6} sm={4} lg={2} className="da-footer__col-links">
              <h3 className="da-footer__heading">Help</h3>
              <ul className="da-footer__list">
                <li>
                  <Link href="/faqs">FAQs</Link>
                </li>
                <li>
                  <Link href="/shipping-info">Shipping Info</Link>
                </li>
                <li>
                  <Link href="/returns">Returns</Link>
                </li>
                <li>
                  <Link href="/track-order">Track Order</Link>
                </li>
              </ul>
            </Col>

            {/* Column 4: Policies & Contact */}
            <Col
              xs={12}
              sm={4}
              lg={3}
              className="da-footer__col-policies ps-lg-4"
            >
              <h3 className="da-footer__heading">Policies</h3>
              <ul className="da-footer__list mb-3">
                <li>
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms-of-service">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/refund-policy">Refund Policy</Link>
                </li>
              </ul>

              <div className="da-footer__direct-contact d-flex flex-column gap-2 pt-1">
                <a
                  href="mailto:digiartsstore@gmail.com"
                  className="da-footer__contact-item d-flex align-items-center gap-2"
                >
                  <HiOutlineMail className="da-footer__contact-icon" />
                  <span>digiartsstore@gmail.com</span>
                </a>
                <a
                  href="tel:+91982831883"
                  className="da-footer__contact-item d-flex align-items-center gap-2"
                >
                  <HiOutlinePhone className="da-footer__contact-icon" />
                  <span>+91 9828 31883</span>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Sub-Footer Bottom Bar */}
      <div className="da-footer__bottom">
        <Container>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <span className="da-footer__copyright text-center text-md-start">
              © 2026 DigiArts. All rights reserved.
            </span>

            <div className="da-footer__badges d-flex align-items-center justify-content-center flex-wrap gap-2">
              <span>Secure Payments</span>
              <span className="da-footer__dot">•</span>
              <span>100% Authentic Products</span>
              <span className="da-footer__dot">•</span>
              <span>Easy Returns</span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
