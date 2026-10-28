"use client";

import { useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiEyeLine,
} from "react-icons/ri";
import { ACCOUNT_DATA } from "@/data/accountData";

export default function OrdersPage() {
  const [orders] = useState(ACCOUNT_DATA.orders);
  // Default first order to open
  const [expandedOrderId, setExpandedOrderId] = useState(orders[0]?.id || null);

  const toggleOrder = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="account-orders">
      <h1 className="account-page-title">My Orders</h1>

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
                  <h4 className="account-order-card__id">{order.id}</h4>
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
                      ₹{order.total}
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
                      <div className="account-order-card__item-thumb" />
                      <div className="account-order-card__item-info">
                        <h5 className="account-order-card__item-name">
                          {item.name}
                        </h5>
                        <p className="account-order-card__item-qty">
                          Qty: {item.qty}
                        </p>
                      </div>
                      <span className="account-order-card__item-price">
                        ₹{item.price}
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