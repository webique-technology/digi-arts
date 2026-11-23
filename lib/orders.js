"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const STATUS = {
  new: ["Order placed", "processing"],
  confirmed: ["Confirmed", "processing"],
  shipped: ["Shipped", "shipped"],
  delivered: ["Delivered", "delivered"],
  cancelled: ["Cancelled", "cancelled"],
};

// API order -> shape used by the account pages
export function toAccountOrder(o) {
  const created = new Date(o.created_at);
  const [status, statusType] = STATUS[o.status] || [o.status, "processing"];
  return {
    id: o.id,
    number: o.order_number,
    date: created.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    formattedDate: created.toLocaleDateString("en-IN"),
    status,
    statusType,
    total: o.total,
    itemCount: o.items_count,
    deliveryAddress: [o.address, o.city, `${o.state} ${o.pincode}`].filter(Boolean).join(", "),
    items: (o.items || []).map((i, n) => ({
      id: `${o.id}-${n}`,
      name: i.title,
      qty: i.qty,
      price: i.line_total,
      image: i.image_path,
    })),
  };
}

export function useMyOrders() {
  const [state, setState] = useState({ orders: [], total: 0, loading: true, error: "" });

  useEffect(() => {
    apiFetch("/auth/orders?limit=50")
      .then((r) =>
        setState({ orders: (r.data || []).map(toAccountOrder), total: r.meta?.total || 0, loading: false, error: "" }),
      )
      .catch((err) =>
        setState({ orders: [], total: 0, loading: false, error: err.status ? err.message : "Couldn't load your orders." }),
      );
  }, []);

  return state;
}
