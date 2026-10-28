"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";

import AccountSidebar from "@/components/accoount/AccountSidebar";
import AuthModal from "@/components/accoount/AuthModal";

export default function AccountLayout({ children }) {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("user_session");
    if (session) {
      setUser(JSON.parse(session));
    } else {
      setShowAuthModal(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user_session");
    setUser(null);
    setShowAuthModal(true);
  };

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
          {/* Persistent Left Sidebar */}
          <Col lg={3} md={4} className="account-sidebar-col">
            <AccountSidebar user={user} onLogoutClick={handleLogout} />
          </Col>

          {/* Dynamic Page Content */}
          <Col lg={9} md={8} className="account-main-col">
            <div className="account-content">{children}</div>
          </Col>
        </Row>
      </Container>

      {/* Login Popup */}
      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />
    </section>
  );
}
