"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Row, Col } from "react-bootstrap";
import {
  RiInboxArchiveLine,
  RiMapPinLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { apiFetch } from "@/lib/api";
import { useMyOrders } from "@/lib/orders";

export default function DashboardPage() {
  const { orders, total: totalOrders, loading } = useMyOrders();
  const [totalAddresses, setTotalAddresses] = useState(null);

  useEffect(() => {
    apiFetch("/auth/addresses")
      .then((r) => setTotalAddresses((r.data || []).length))
      .catch(() => setTotalAddresses(null));
  }, []);
  // Dynamic slice of the 2 most recent orders
  const recentOrders = orders.slice(0, 2);

  return (
    <div className="account-dashboard">
      <h1 className="account-page-title">My Account</h1>

      {/* Summary Metric Cards */}
      <Row className="account-summary-row g-3">
        <Col sm={6}>
          <Link href="/account/orders" className="text-decoration-none">
            <div className="account-summary-card">
              <div className="account-summary-card__icon-wrapper account-summary-card__icon-wrapper--orange">
                <RiInboxArchiveLine />
              </div>
              <div className="account-summary-card__details">
                <h4 className="account-summary-card__label">My Orders</h4>
                <p className="account-summary-card__count">
                  {totalOrders} items
                </p>
              </div>
            </div>
          </Link>
        </Col>

        <Col sm={6}>
          <Link href="/account/addresses" className="text-decoration-none">
            <div className="account-summary-card">
              <div className="account-summary-card__icon-wrapper account-summary-card__icon-wrapper--red">
                <RiMapPinLine />
              </div>
              <div className="account-summary-card__details">
                <h4 className="account-summary-card__label">Addresses</h4>
                <p className="account-summary-card__count">
                  {totalAddresses === null ? "…" : `${totalAddresses} saved`}
                </p>
              </div>
            </div>
          </Link>
        </Col>
      </Row>

      {/* Recent Orders Card */}
      <div className="account-card account-card--recent-orders">
        <div className="account-card__header">
          <h3 className="account-card__heading">Recent Orders</h3>
          <Link href="/account/orders" className="account-card__view-all">
            View All <RiArrowRightLine />
          </Link>
        </div>

        <div className="account-card__order-list">
          {!loading && !recentOrders.length && (
            <p className="account-orders__empty">No orders yet.</p>
          )}
          {recentOrders.map((order) => (
            <div key={order.id} className="account-order-row">
              <div className="account-order-row__info">
                <h5 className="account-order-row__id">{order.number}</h5>
                <p className="account-order-row__meta">
                  {order.itemCount} item{order.itemCount > 1 ? "s" : ""} •{" "}
                  {order.formattedDate}
                </p>
              </div>
              <div className="account-order-row__summary">
                <span className="account-order-row__amount">
                  ₹{order.total.toLocaleString("en-IN")}
                </span>
                <span
                  className={`account-order-row__status account-order-row__status--${order.statusType}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
