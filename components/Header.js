"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
// import { NAV } from '@/data/site';
import { useCart } from "./CartProvider";
import {
  SearchIcon,
  UserIcon,
  BagIcon,
  ChevronDown,
  CloseIcon,
  MenuIcon,
} from "./Icons";
import { TEST_IDS } from "./testIds";
import { Col, Row } from "react-bootstrap";

export default function Header() {
  const router = useRouter();
  const { count, setOpen } = useCart();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");

  const NAV = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Products",
      href: "/products",
      children: [
        {
          label: "Ganesh Festival",
          href: "/products?category=ganesh-festival",
          children: [
            { label: "DIY Makhar", href: "/products?category=diy-makhar" },
            { label: "Varkari Set", href: "/products?category=varkari-set" },
            {
              label: "Shivaji Maharaj Set",
              href: "/products?category=shivaji-maharaj-set",
            },
            { label: "Other Set", href: "/products?category=other-set" },
            {
              label: "Ganesh Decoration",
              href: "/products?category=ganesh-decoration",
            },
          ],
        },
        {
          label: "Diwali Festival",
          href: "/products?category=diwali-festival",
          children: [
            {
              label: "Diwali Kandil",
              href: "/products?category=diwali-kandil",
            },
            {
              label: "T-light Decoration",
              href: "/products?category=t-light-decoration",
            },
            {
              label: "Paper Decoration",
              href: "/products?category=paper-decoration",
            },
            {
              label: "Diwali Gift Box",
              href: "/products?category=diwali-gift-box",
            },
            {
              label: "Rangoli Product",
              href: "/products?category=rangoli-product",
            },
            {
              label: "T-light Candles",
              href: "/products?category=t-light-candles",
            },
          ],
        },
        {
          label: "Makar Sankranti",
          href: "/products?category=makar-sankranti",
          children: [
            {
              label: "Kite Hanging Frill",
              href: "/products?category=kite-hanging-frill",
            },
            {
              label: "Kite Wall Set",
              href: "/products?category=kite-wall-set",
            },
          ],
        },
        {
          label: "Packaging Box",
          href: "/products?category=packaging-box",
          children: [
            { label: "Cavity Box", href: "/products?category=cavity-box" },
            { label: "Hamper Box", href: "/products?category=hamper-box" },
            { label: "Bags", href: "/products?category=bags" },
            { label: "Candle Box", href: "/products?category=candle-box" },
            { label: "Premium Box", href: "/products?category=premium-box" },
          ],
        },
        {
          label: "Independence Day",
          href: "/products?category=independence-day",
        },
        {
          label: "Christmas Day",
          href: "/products?category=christmas-day",
        },
        {
          label: "Wax Candle",
          href: "/products?category=wax-candle",
        },
        {
          label: "Valentine Day",
          href: "/products?category=valentine-day",
        },
      ],
    },
    {
      label: "Best Sellers",
      href: "/products?bestseller=1",
    },
    {
      label: "About Us",
      href: "/about",
    },
    {
      label: "Contact",
      href: "/contact",
    },
  ];

  useEffect(() => {
    if (!mobile) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobile(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobile]);

  const submit = (e) => {
    e.preventDefault();
    router.push(
      q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : "/products",
    );
    setSearch(false);
  };

  return (
    <header className="header">
      <div className="container header__inner">
        <button
          className="header__burger"
          aria-label="Open menu"
          aria-expanded={mobile}
          onClick={() => setMobile(true)}
          data-testid={TEST_IDS.headerMobileMenu}
        >
          <MenuIcon />
        </button>
        <Link
          href="/"
          className="header__logo"
          aria-label="Digi Art’s Store home"
        >
          <Logo />
        </Link>

        <ul className="nav" aria-label="Main">
          {NAV.map((n) => (
            <li key={n.label}>
              <Link
                href={n.href}
                data-testid={TEST_IDS.headerNavigation("desktop", n.href)}
              >
                {n.label}
                {n.children && <ChevronDown />}
              </Link>

              {n.children && (
                <div className="nav__sub">
                  <Row className="justify-content-around">
                  {n.children.slice(0, 4).map((c) => (
                    <Col lg={2} key={c.label}>
                      <Link
                        href={c.href}
                        data-testid={TEST_IDS.headerNavigation(
                          "desktop",
                          c.href,
                        )}
                        className="nav-link-main"
                      >
                        {c.label}
                        {c.children && <ChevronDown />}
                      </Link>

                      {c.children && (
                        <ul className="nav__sub--nested p-0">
                          {c.children.map((sub) => (
                            <li key={sub.label}>
                              <Link
                                href={sub.href}
                                data-testid={TEST_IDS.headerNavigation(
                                  "desktop",
                                  sub.href,
                                )}
                                className="fw-normal"
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Col>
                  ))}
                  <Col lg={2}>
                    {n.children.slice(4).map((c) => (
                      <div key={c.label}>
                        <Link
                          href={c.href}
                          data-testid={TEST_IDS.headerNavigation(
                            "desktop",
                            c.href,
                          )}
                          className="nav-link-main"
                        >
                          {c.label}
                          {c.children && <ChevronDown />}
                        </Link>
                      </div>
                    ))}
                  </Col>
                </Row>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="header__icons">
          <button
            aria-label="Search"
            aria-expanded={search}
            onClick={() => setSearch(!search)}
            data-testid={TEST_IDS.headerSearchToggle}
            className=" bg-white"
          >
            <SearchIcon />
          </button>
          <Link
            href="/account"
            aria-label="Admin sign in"
            data-testid={TEST_IDS.headerAdminLogin}
            className=" bg-white d-none d-md-flex"
          >
            <UserIcon />
          </Link>
          <button
            aria-label={`Open cart${count > 0 ? `, ${count} items` : ""}`}
            onClick={() => setOpen(true)}
            data-testid={TEST_IDS.headerCart}
            className=" bg-white d-none d-md-flex"
          >
            <BagIcon />
            {count > 0 && <span className="header__count">{count}</span>}
          </button>
        </div>
      </div>

      {search && (
        <form className="header__search" onSubmit={submit} role="search">
          <div className="container d-flex gap-1">
            <input
              autoFocus
              type="search"
              placeholder="Search products…"
              aria-label="Search products"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-100"
            />
            <button type="submit" className="flex-shrink-0 py-1 px-2" aria-label="Submit search">
              <SearchIcon />
            </button>
          </div>
        </form>
      )}

      <div className={`mnav ${mobile ? "is-open" : ""}`} aria-hidden={!mobile}>
        <button
          className="mnav__backdrop"
          type="button"
          onClick={() => setMobile(false)}
          aria-label="Close menu"
          tabIndex={mobile ? 0 : -1}
        />
        <nav className="mnav__panel" aria-label="Mobile">
          <button
            className="mnav__close"
            type="button"
            aria-label="Close menu"
            onClick={() => setMobile(false)}
            tabIndex={mobile ? 0 : -1}
            data-testid={TEST_IDS.headerMobileMenuClose}
          >
            <CloseIcon />
          </button>
          {NAV.map((n) =>
            n.children ? (
              <details key={n.label}>
                <summary tabIndex={mobile ? 0 : -1}>
                  {n.label}
                  <ChevronDown />
                </summary>
                <ul>
                  {[
                    { label: `All ${n.label}`, href: n.href },
                    ...n.children,
                  ].map((c) => (
                    <li key={c.label}>
                      <Link
                        href={c.href}
                        onClick={() => setMobile(false)}
                        tabIndex={mobile ? 0 : -1}
                        data-testid={TEST_IDS.headerNavigation(
                          "mobile",
                          c.href,
                        )}
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <Link
                key={n.label}
                href={n.href}
                className="mnav__link"
                onClick={() => setMobile(false)}
                tabIndex={mobile ? 0 : -1}
                data-testid={TEST_IDS.headerNavigation("mobile", n.href)}
              >
                {n.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}
