"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container, Row, Col } from "react-bootstrap";

import AccountSidebar from "@/components/accoount/AccountSidebar";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";// 1. Use the global AuthContext

export default function AccountLayout({ children }) {
  const router = useRouter();
  // 2. Get user and the global logout function from AuthProvider
  const { user, isLoggedIn, logout } = useAuth();

  // middleware.js guards the route; this catches a session that expires while the page is open
  useEffect(() => {
    apiFetch("/auth/session")
      .then((r) => { if (!r.data.user) router.replace("/"); })
      .catch(() => {});
  }, [router, isLoggedIn]);

  return (
    <section className="account-section">
      <Container>
        {/* Breadcrumb */}
        <div className="account-breadcrumb">
          <Link href="/" className="account-breadcrumb__link">
            Home
          </Link>
          <span className="account-breadcrumb__divider">/</span>
          <span className="account-breadcrumb__current">My Account</span>
        </div>

        <Row className="g-4 account-layout">
          {/* Persistent Left Sidebar with global logout */}
          <Col lg={3} md={4} className="account-sidebar-col">
            <AccountSidebar user={user} onLogoutClick={logout} />
          </Col>

          {/* Dynamic Page Content */}
          <Col lg={9} md={8} className="account-main-col">
            <div className="account-content">{children}</div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
