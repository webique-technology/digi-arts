"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useCart } from "./CartProvider";
import { imageUrl } from "@/lib/api";
import { rupee, shippingFor, onlyDigits, quantityLineTotal } from "@/lib/utils";
import {
  FaQuestionCircle,
  FaGift,
  FaShieldAlt,
  FaLeaf,
  FaBoxOpen,
  FaUsers,
  FaLock,
} from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";
import Logo from "./Logo";

const STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Other",
];

const SAVED = "Digi Art’s Store_customer";

const EMPTY_FORM = {
  email: "",
  newsAndOffers: true,
  country: "India",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "Maharashtra",
  pincode: "",
  phone: "",
  saveInfo: false,
  paymentMethod: "razorpay", // 'razorpay' | 'phonepe' | 'cod'
  billingAddress: "same", // 'same' | 'different'
};

export default function CheckoutFlow() {
  const router = useRouter();
  const { items, ready, subtotal, clear, hasPreviewItems } = useCart();

  const [f, setF] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);

  // Coupon state
  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);

  // Restore saved contact & address details
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(SAVED) || "null");
      if (s) {
        setF((cur) => ({
          ...cur,
          ...s,
        }));
      }
    } catch {}
  }, []);

  const handleChange = (k) => (e) => {
    const val =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setF((prev) => ({ ...prev, [k]: val }));
    if (errors[k]) {
      setErrors((err) => ({ ...err, [k]: undefined }));
    }
  };

  const applyCode = useCallback(async (c, sub, silent = false) => {
    setCouponBusy(true);
    if (!silent) setCouponMsg("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: c, subtotal: sub }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || j.success === false) {
        throw new Error(
          j.data?.coupon || j.message || "Could not apply this coupon",
        );
      }
      setCoupon(j.data);
      setCouponMsg("");
    } catch (err) {
      // Mock coupon fallback for testing UI
      if (c.toUpperCase() === "DIWALI10") {
        setCoupon({
          code: "DIWALI10",
          discount: Math.round(sub * 0.1),
          label: "10% off festive discount",
        });
        setCouponMsg("");
      } else {
        setCoupon(null);
        setCouponMsg(err.message || "Invalid coupon code");
      }
    } finally {
      setCouponBusy(false);
    }
  }, []);

  const discount = coupon ? Math.min(coupon.discount, subtotal) : 0;
  const isAddressFilled =
    f.address.trim().length > 3 && f.city.trim() && /^\d{6}$/.test(f.pincode);
  const ship = isAddressFilled ? shippingFor(subtotal) : 0;
  const total = Math.max(
    0,
    Math.round((subtotal - discount + ship) * 100) / 100,
  );

  const validateForm = () => {
    const errs = {};
    if (!f.email || !/^\S+@\S+\.\S+$/.test(f.email))
      errs.email = "Enter a valid email address";
    if (!f.firstName.trim()) errs.firstName = "Enter your first name";
    if (!f.lastName.trim()) errs.lastName = "Enter your last name";
    if (!f.address.trim() || f.address.trim().length < 5)
      errs.address = "Enter complete address";
    if (!f.city.trim()) errs.city = "Enter city";
    if (!/^\d{6}$/.test(f.pincode))
      errs.pincode = "Enter a valid 6-digit PIN code";
    if (!/^[6-9]\d{9}$/.test(onlyDigits(f.phone).slice(-10))) {
      errs.phone = "Enter a valid 10-digit phone number";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: "smooth" });
      return;
    }

    setBusy(true);

    try {
      const payload = {
        ...f,
        customer_name: `${f.firstName} ${f.lastName}`.trim(),
        phone: onlyDigits(f.phone).slice(-10),
        coupon_code: coupon?.code || "",
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
        total,
      };

      if (f.saveInfo) {
        localStorage.setItem(SAVED, JSON.stringify(f));
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      // Demo fallback in case backend is offline
      if (!res.ok && !json.success) {
        sessionStorage.setItem(
          "Digi Art’s Store_last_order",
          JSON.stringify({
            id: `ORD-${Date.now().toString().slice(-6)}`,
            name: `${f.firstName} ${f.lastName}`,
            total,
            items,
          }),
        );
      } else {
        sessionStorage.setItem(
          "Digi Art’s Store_last_order",
          JSON.stringify(json.data),
        );
      }

      clear();
      router.push("/order-success");
    } catch (err) {
      setFormError(err.message || "Failed to process order. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!ready) {
    return (
      <div className="d-flex align-items-center justify-content-center py-5">
        <div className="spinner-border text-success" role="status" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <Container className="py-5 text-center">
        <div className="p-5 border rounded-3 bg-white shadow-sm max-w-md mx-auto">
          <h2 className="fw-bold mb-3">Your cart is empty</h2>
          <p className="text-muted mb-4">
            Add products to your cart before proceeding to checkout.
          </p>
          <Link href="/products" className="btn btn-dark px-4 py-2">
            Continue Shopping
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div className="checkout-page bg-white min-vh-100 pb-4 pb-lg-5 position-relative">
      <header className="border-bottom shadow-sm sticky-top bg-white top-0 z-3">
        <nav className=" w-100">
          <Container className="d-flex align-items-center justify-content-center ">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: "150px" }}
            >
              <Logo className={"w-100"} />
            </div>
          </Container>
        </nav>
      </header>
      <Container fluid="lg" className="mt-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Row className="g-4 justify-content-center">
              {/* ================= LEFT COLUMN: Form Flow ================= */}
              <Col md={7} xl={7} className="pe-lg-5 border-end-lg">
                <Form onSubmit={handleSubmitOrder} noValidate>
                  {formError && (
                    <div className="alert alert-danger py-2 mb-4" role="alert">
                      {formError}
                    </div>
                  )}

                  {/* 1. Contact Section */}
                  <div className="checkout-section mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h2 className="h5 fw-bold mb-0">Contact</h2>
                      <Link
                        href="/login"
                        className="text-success text-decoration-none small fw-semibold"
                      >
                        Sign in
                      </Link>
                    </div>

                    <div className="position-relative">
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        value={f.email}
                        onChange={handleChange("email")}
                        isInvalid={!!errors.email}
                        className="checkout-input"
                      />
                      <FaQuestionCircle
                        className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                        style={{ cursor: "pointer" }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </div>

                    <Form.Check
                      type="checkbox"
                      id="news-offers"
                      label="Email me with news and offers"
                      checked={f.newsAndOffers}
                      onChange={handleChange("newsAndOffers")}
                      className="mt-2 small text-muted custom-checkout-checkbox"
                    />
                  </div>

                  {/* 2. Delivery Address */}
                  <div className="checkout-section mb-4">
                    <h2 className="h5 fw-bold mb-3">Delivery</h2>

                    <div className="mb-3">
                      <Form.Label className="small text-muted mb-1">
                        Country/Region
                      </Form.Label>
                      <Form.Select
                        value={f.country}
                        onChange={handleChange("country")}
                        className="checkout-input"
                      >
                        <option value="India">India</option>
                      </Form.Select>
                    </div>

                    <Row className="g-2 mb-2">
                      <Col sm={6}>
                        <Form.Control
                          type="text"
                          placeholder="First name"
                          value={f.firstName}
                          onChange={handleChange("firstName")}
                          isInvalid={!!errors.firstName}
                          className="checkout-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Col>
                      <Col sm={6}>
                        <Form.Control
                          type="text"
                          placeholder="Last name"
                          value={f.lastName}
                          onChange={handleChange("lastName")}
                          isInvalid={!!errors.lastName}
                          className="checkout-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>

                    <div className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Address"
                        value={f.address}
                        onChange={handleChange("address")}
                        isInvalid={!!errors.address}
                        className="checkout-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.address}
                      </Form.Control.Feedback>
                    </div>

                    <Row className="g-2 mb-2">
                      <Col sm={4}>
                        <Form.Control
                          type="text"
                          placeholder="City"
                          value={f.city}
                          onChange={handleChange("city")}
                          isInvalid={!!errors.city}
                          className="checkout-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.city}
                        </Form.Control.Feedback>
                      </Col>
                      <Col sm={4}>
                        <Form.Select
                          value={f.state}
                          onChange={handleChange("state")}
                          className="checkout-input"
                        >
                          {STATES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col sm={4}>
                        <Form.Control
                          type="text"
                          placeholder="PIN code"
                          maxLength={6}
                          value={f.pincode}
                          onChange={handleChange("pincode")}
                          isInvalid={!!errors.pincode}
                          className="checkout-input"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.pincode}
                        </Form.Control.Feedback>
                      </Col>
                    </Row>

                    <div className="position-relative mb-2">
                      <Form.Control
                        type="tel"
                        placeholder="Phone"
                        maxLength={10}
                        value={f.phone}
                        onChange={handleChange("phone")}
                        isInvalid={!!errors.phone}
                        className="checkout-input"
                      />
                      <FaQuestionCircle
                        className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                        style={{ cursor: "pointer" }}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </div>

                    <Form.Check
                      type="checkbox"
                      id="save-info"
                      label="Save this information for next time"
                      checked={f.saveInfo}
                      onChange={handleChange("saveInfo")}
                      className="mt-2 small text-muted custom-checkout-checkbox"
                    />
                  </div>

                  {/* 3. Shipping method box */}
                  <div className="checkout-section mb-4">
                    <h2 className="h6 fw-bold mb-2">Shipping method</h2>
                    <div className="p-3 bg-light rounded text-center text-muted small border">
                      {isAddressFilled
                        ? "Standard Delivery (3-5 Business Days) — Free Shipping"
                        : "Enter your shipping address to view available shipping methods."}
                    </div>
                  </div>

                  {/* 4. Payment Gateway Options */}
                  <div className="checkout-section mb-4">
                    <h2 className="h5 fw-bold mb-1">Payment</h2>
                    <p className="text-muted small mb-3">
                      All transactions are secure and encrypted.
                    </p>

                    <div className="payment-options border rounded-3 overflow-hidden">
                      {/* Option 1: Razorpay */}
                      <div
                        className={`payment-option-header p-3 border-bottom d-flex align-items-center justify-content-between cursor-pointer ${
                          f.paymentMethod === "razorpay"
                            ? "bg-light-green border-success border-2"
                            : "bg-white"
                        }`}
                        onClick={() =>
                          setF((prev) => ({
                            ...prev,
                            paymentMethod: "razorpay",
                          }))
                        }
                      >
                        <Form.Check
                          type="radio"
                          id="pay-razorpay"
                          name="paymentMethod"
                          label={
                            <span className="fw-semibold small ms-1 text-dark">
                              Razorpay Secure (UPI, Card, Int'l Card, Apple Pay)
                            </span>
                          }
                          checked={f.paymentMethod === "razorpay"}
                          onChange={() => {}}
                          className="m-0"
                        />
                        <div className="d-flex align-items-center gap-1">
                          <span className="badge bg-light text-dark border px-1">
                            UPI
                          </span>
                          <SiVisa className="text-primary fs-5" />
                          <SiMastercard className="text-danger fs-5" />
                          <span className="badge bg-light text-secondary border px-1">
                            +17
                          </span>
                        </div>
                      </div>

                      {f.paymentMethod === "razorpay" && (
                        <div className="p-3 bg-light text-center small text-muted border-bottom">
                          You'll be redirected to Razorpay Secure (UPI, Card,
                          Int'l Card, Apple Pay) to complete your purchase.
                        </div>
                      )}

                      {/* Option 2: PhonePe */}
                      <div
                        className={`payment-option-header p-3 border-bottom d-flex align-items-center justify-content-between cursor-pointer ${
                          f.paymentMethod === "phonepe"
                            ? "bg-light-green border-success border-2"
                            : "bg-white"
                        }`}
                        onClick={() =>
                          setF((prev) => ({
                            ...prev,
                            paymentMethod: "phonepe",
                          }))
                        }
                      >
                        <Form.Check
                          type="radio"
                          id="pay-phonepe"
                          name="paymentMethod"
                          label={
                            <span className="fw-semibold small ms-1 text-dark">
                              PhonePe PG (UPI, Cards, EMI & NetBanking)
                            </span>
                          }
                          checked={f.paymentMethod === "phonepe"}
                          onChange={() => {}}
                          className="m-0"
                        />
                        <div className="d-flex align-items-center gap-1">
                          <span className="badge bg-light text-dark border px-1">
                            UPI
                          </span>
                          <SiVisa className="text-primary fs-5" />
                          <SiMastercard className="text-danger fs-5" />
                          <span className="badge bg-light text-secondary border px-1">
                            +2
                          </span>
                        </div>
                      </div>

                      {f.paymentMethod === "phonepe" && (
                        <div className="p-3 bg-light text-center small text-muted border-bottom">
                          You'll be redirected to PhonePe PG to complete your
                          payment securely.
                        </div>
                      )}

                      {/* Option 3: Cash On Delivery */}
                      <div
                        className={`payment-option-header p-3 d-flex align-items-center justify-content-between cursor-pointer ${
                          f.paymentMethod === "cod"
                            ? "bg-light-green border-success border-2"
                            : "bg-white"
                        }`}
                        onClick={() =>
                          setF((prev) => ({ ...prev, paymentMethod: "cod" }))
                        }
                      >
                        <Form.Check
                          type="radio"
                          id="pay-cod"
                          name="paymentMethod"
                          label={
                            <span className="fw-semibold small ms-1 text-dark">
                              Cash on Delivery (COD)
                            </span>
                          }
                          checked={f.paymentMethod === "cod"}
                          onChange={() => {}}
                          className="m-0"
                        />
                        <span className="badge bg-light text-dark border px-2 py-1">
                          Pay on delivery
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 5. Billing Address */}
                  <div className="checkout-section mb-4">
                    <h2 className="h6 fw-bold mb-2">Billing address</h2>
                    <div className="border rounded-3 overflow-hidden">
                      <div
                        className={`p-3 border-bottom d-flex align-items-center cursor-pointer ${
                          f.billingAddress === "same"
                            ? "bg-light-green border-success border-2"
                            : "bg-white"
                        }`}
                        onClick={() =>
                          setF((prev) => ({ ...prev, billingAddress: "same" }))
                        }
                      >
                        <Form.Check
                          type="radio"
                          id="bill-same"
                          name="billingAddress"
                          label={
                            <span className="fw-semibold small ms-1">
                              Same as shipping address
                            </span>
                          }
                          checked={f.billingAddress === "same"}
                          onChange={() => {}}
                          className="m-0"
                        />
                      </div>
                      <div
                        className={`p-3 d-flex align-items-center cursor-pointer ${
                          f.billingAddress === "different"
                            ? "bg-light-green border-success border-2"
                            : "bg-white"
                        }`}
                        onClick={() =>
                          setF((prev) => ({
                            ...prev,
                            billingAddress: "different",
                          }))
                        }
                      >
                        <Form.Check
                          type="radio"
                          id="bill-different"
                          name="billingAddress"
                          label={
                            <span className="fw-semibold small ms-1">
                              Use a different billing address
                            </span>
                          }
                          checked={f.billingAddress === "different"}
                          onChange={() => {}}
                          className="m-0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={busy}
                    className="btn btn-success w-100 py-3 fw-bold fs-6 shadow-sm rounded-2 text-uppercase letter-spacing-1"
                    style={{
                      backgroundColor: "#0e7041",
                      borderColor: "#0e7041",
                    }}
                  >
                    {busy ? "Processing Order…" : "Pay now"}
                  </button>
                </Form>
              </Col>

              {/* ================= RIGHT COLUMN: Order Summary & Trust ================= */}
              <Col md={5} xl={5} className="ps-lg-4">
                <div
                  className="checkout-summary-sticky sticky-top"
                  style={{ top: "30px" }}
                >
                  {/* Items List */}
                  <div className="checkout-items mb-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex align-items-center justify-content-between py-2 border-bottom"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <div className="position-relative product-img-wrapper border rounded-2 p-1 bg-white">
                            <img
                              src={imageUrl(
                                item.primary_image ||
                                  item.image ||
                                  "/demo-products/placeholder.webp",
                              )}
                              alt={item.title}
                              className="rounded object-fit-cover"
                              style={{ width: "64px", height: "64px" }}
                            />
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                              {item.qty}
                            </span>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-semibold text-dark small">
                              {item.title}
                            </h6>
                            <small
                              className="text-muted d-block"
                              style={{ fontSize: "0.75rem" }}
                            >
                              Gift Message: No
                            </small>
                          </div>
                        </div>
                        <strong className="text-dark small">
                          {rupee(quantityLineTotal(item.price, item.qty))}
                        </strong>
                      </div>
                    ))}
                  </div>

                  {/* Coupon Form Input */}
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (code.trim()) applyCode(code.trim(), subtotal);
                    }}
                    className="d-flex gap-2 mb-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Discount code or gift card"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="checkout-input"
                    />
                    <button
                      type="submit"
                      disabled={couponBusy || !code.trim()}
                      className="btn btn-light border px-4 fw-semibold text-muted"
                    >
                      {couponBusy ? "…" : "Apply"}
                    </button>
                  </Form>

                  {couponMsg && (
                    <div className="text-danger small mb-2">{couponMsg}</div>
                  )}

                  {/* Login Rewards Box */}
                  <div className="p-3 border rounded-3 bg-white d-flex align-items-center justify-content-between mb-3 shadow-sm">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="p-2 rounded-2 text-white d-flex align-items-center justify-content-center"
                        style={{ backgroundColor: "#0e7041" }}
                      >
                        <FaGift />
                      </div>
                      <span className="small text-dark fw-medium">
                        Login to view and apply rewards
                      </span>
                    </div>
                    <Link
                      href="/login"
                      className="btn btn-sm btn-success px-3 fw-semibold rounded-2"
                      style={{
                        backgroundColor: "#0e7041",
                        borderColor: "#0e7041",
                      }}
                    >
                      Login
                    </Link>
                  </div>

                  {/* Active Offer Banner */}
                  <div
                    className="p-3 border rounded-3 mb-3"
                    style={{
                      backgroundColor: "#fdf8ec",
                      borderColor: "#f7e3b5",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="fw-bold small text-dark d-flex align-items-center gap-1">
                        🏷 DIWALI10
                      </span>
                      <button
                        type="button"
                        onClick={() => applyCode("DIWALI10", subtotal)}
                        className="btn btn-sm btn-light border px-3 fw-bold small text-dark"
                      >
                        Apply
                      </button>
                    </div>
                    <p
                      className="small text-muted mb-1"
                      style={{ fontSize: "0.8rem" }}
                    >
                      Get 10% off on order above ₹999.
                    </p>
                    {subtotal < 999 && (
                      <small
                        className="text-warning-emphasis fw-semibold"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Add {rupee(999 - subtotal)} more to unlock this offer
                      </small>
                    )}
                  </div>

                  {/* Totals Table */}
                  <div className="py-2 border-bottom mb-3">
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>Subtotal</span>
                      <span className="text-dark fw-semibold">
                        {rupee(subtotal)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="d-flex justify-content-between small text-success mb-2">
                        <span>Discount ({coupon?.code})</span>
                        <span>−{rupee(discount)}</span>
                      </div>
                    )}

                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>Shipping</span>
                      <span>
                        {isAddressFilled
                          ? ship === 0
                            ? "Free"
                            : rupee(ship)
                          : "Enter shipping address"}
                      </span>
                    </div>
                  </div>

                  {/* Grand Total */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <span className="fs-5 fw-bold text-dark">Total</span>
                    <div>
                      <span className="small text-muted me-1">INR</span>
                      <span className="fs-4 fw-bold text-dark">
                        {rupee(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
