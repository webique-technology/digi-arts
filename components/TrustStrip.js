"use client";

import { Container, Row, Col } from "react-bootstrap";
import { FiBox, FiTruck, FiCreditCard, FiShield } from "react-icons/fi";

const TRUST_FEATURES = [
  // {
  //   id: 1,
  //   icon: <FiBox className="trust-strip__icon" />,
  //   boldText: "Free Delivery",
  //   subText: "on Orders Above ₹499",
  // },
  {
    id: 2,
    icon: <FiTruck className="trust-strip__icon" />,
    boldText: "Pan India",
    subText: "Shipping",
  },
  {
    id: 3,
    icon: <FiCreditCard className="trust-strip__icon" />,
    boldText: "Secure",
    subText: "Payments",
  },
  {
    id: 4,
    icon: <FiShield className="trust-strip__icon" />,
    boldText: "Handmade",
    subText: "Products",
  },
];

export default function TrustStrip() {
  return (
    <section className="trust-strip">
      <Container>
        <Row className="trust-strip__row g-md-0 justify-content-center align-items-start">
          {TRUST_FEATURES.map((item) => (
            <Col
              key={item.id}
              xs={4}
              sm={6}
              lg={4}
              className="d-flex justify-content-start justify-content-lg-center"
            >
              <div className="trust-strip__item d-flex flex-column flex-md-row gap-1 align-items-center">
                <div className="trust-strip__icon-badge d-flex align-items-center justify-content-center flex-shrink-0">
                  {item.icon}
                </div>
                <div className="trust-strip__text text-center text-md-start">
                  <span className="trust-strip__text-bold fw-bold text-dark">
                    {item.boldText}
                  </span>{" "}
                  <span className="trust-strip__text-muted">
                    {item.subText}
                  </span>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
