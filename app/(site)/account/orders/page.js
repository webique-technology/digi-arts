"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiEyeLine,
} from "react-icons/ri";
import { imageUrl } from "@/lib/api";
import { useMyOrders } from "@/lib/orders";

export default function OrdersPage() {
  const { orders, loading, error } = useMyOrders();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (orders.length) setExpandedOrderId(orders[0].id);
  }, [orders]);

  const toggleOrder = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="account-orders">
      <h1 className="account-page-title">My Orders</h1>

      {loading && <p className="account-orders__empty">Loading your orders…</p>}
      {error && <p className="account-orders__empty">{error}</p>}
      {!loading && !error && !orders.length && (
        <p className="account-orders__empty">
          You haven&apos;t placed any orders yet. <Link href="/products">Start shopping</Link>
        </p>
      )}

      <div className="account-orders-list">
        {orders.map((order) => {
          const isExpanded = expandedOrderId === order.id;

          return (
            <div key={order.id} className="account-order-card">
              <div
                className="account-order-card__header"
                onClick={() => toggleOrder(order.id)}
              >
                <div className="account-order-card__title-meta">
                  <h4 className="account-order-card__id">{order.number}</h4>
                  <span className="account-order-card__date">
                    {order.date}
                  </span>
                </div>

                <div className="account-order-card__header-right">
                  <span
                    className={`account-badge account-badge--${order.statusType}`}
                  >
                    {order.status}
                  </span>
                  <div className="account-order-card__pricing">
                    <span className="account-order-card__amount">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                    <span className="account-order-card__items-count">
                      {order.itemCount} item{order.itemCount > 1 ? "s" : ""}
                    </span>
                  </div>
                  <span className="account-order-card__arrow">
                    {isExpanded ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
                  </span>
                </div>
              </div>

              {/* Dynamic Items & Delivery Details */}
              {isExpanded && (
                <div className="account-order-card__expanded">
                  {order.items?.map((item) => (
                    <div key={item.id} className="account-order-card__item">
                      <div className="account-order-card__item-thumb">
                        {item.image && <img src={imageUrl(item.image)} alt="" />}
                      </div>
                      <div className="account-order-card__item-info">
                        <h5 className="account-order-card__item-name">
                          {item.name}
                        </h5>
                        <p className="account-order-card__item-qty">
                          Qty: {item.qty}
                        </p>
                      </div>
                      <span className="account-order-card__item-price">
                        ₹{item.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}

                  <div className="account-order-card__address-box">
                    <p className="account-order-card__address-label">
                      Delivery Address
                    </p>
                    <p className="account-order-card__address-text">
                      {order.deliveryAddress}
                    </p>
                  </div>

                  <div className="account-order-card__actions">
                    <button
                      type="button"
                      className="account-btn account-btn--outline"
                    >
                      <RiEyeLine /> Track Order
                    </button>
                    <button
                      type="button"
                      className="account-btn account-btn--outline"
                    >
                      Buy Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}