"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container, Row, Col } from "react-bootstrap";
import { useCart } from "./CartProvider";
import { BagIcon } from "./Icons";
import {
  RiHome5Line,
  RiHome5Fill,
  RiUser3Line,
  RiUser3Fill,
  RiWhatsappFill,
  RiWhatsappLine,
} from "react-icons/ri";

export default function BottomNav() {
  const pathname = usePathname();
  // 1. Get live count and drawer opener from CartProvider
  const { count = 0, setOpen, open } = useCart();

  const isHomeActive = pathname === "/";
  const isAccountActive =
    pathname.startsWith("/account") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/profile");
  const isCartActive = Boolean(open) || pathname === "/cart";
  const isWhatsappActive = pathname === "#whatsapp";

  return (
    <nav
      className="bottom-nav d-block d-md-none"
      aria-label="Mobile Navigation"
    >
      <Container fluid className="px-0">
        <Row className="g-0 align-items-center text-center">
          {/* 1. Home Tab */}
          <Col xs={3}>
            <Link
              href="/"
              className={`bottom-nav__item ${
                isHomeActive ? "bottom-nav__item--active" : ""
              }`}
            >
              <div className="bottom-nav__icon-wrapper">
                {isHomeActive ? (
                  <RiHome5Fill className="bottom-nav__icon" />
                ) : (
                  <RiHome5Line className="bottom-nav__icon" />
                )}
              </div>
              <span className="bottom-nav__label">Home</span>
            </Link>
          </Col>

          {/* 2. Account Tab */}
          <Col xs={3}>
            <Link
              href="/account"
              className={`bottom-nav__item ${
                isAccountActive ? "bottom-nav__item--active" : ""
              }`}
            >
              <div className="bottom-nav__icon-wrapper">
                {isAccountActive ? (
                  <RiUser3Fill className="bottom-nav__icon" />
                ) : (
                  <RiUser3Line className="bottom-nav__icon" />
                )}
              </div>
              <span className="bottom-nav__label">Account</span>
            </Link>
          </Col>

          {/* 3. Cart Button (Live Count & Drawer Trigger) */}
          <Col xs={3}>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={`bottom-nav__item bottom-nav__btn ${
                isCartActive ? "bottom-nav__item--active" : ""
              } ${count > 0 ? "has-items" : ""}`}
              aria-label={`Open cart${count > 0 ? `, ${count} items` : ""}`}
            >
              <div className="bottom-nav__icon-wrapper">
                {/* Same BagIcon as Header */}
                <BagIcon className="bottom-nav__icon" />

                {/* Live count badge that appears when items are added */}
                {count > 0 && (
                  <span className="bottom-nav__badge">{count}</span>
                )}
              </div>
              <span className="bottom-nav__label">Cart</span>
            </button>
          </Col>

          {/* 4. Whatsapp Button */}
          <Col xs={3}>
            <Link
              href="#whatsapp"
              className={`bottom-nav__item ${
                isAccountActive ? "bottom-nav__item--active" : ""
              }`}
            >
              <div className="bottom-nav__icon-wrapper">
                {isAccountActive ? (
                  <RiWhatsappFill className="bottom-nav__icon" />
                ) : (
                  <RiWhatsappLine className="bottom-nav__icon" />
                )}
              </div>
              <span className="bottom-nav__label">Account</span>
            </Link>
          </Col>
        </Row>
      </Container>
    </nav>
  );
}
