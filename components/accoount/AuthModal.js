"use client";

import { useState } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import {
  RiCloseLine,
  RiSmartphoneLine,
  RiLockPasswordLine,
} from "react-icons/ri";

export default function AuthModal({ show, onHide, onLoginSuccess }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP
  const [error, setError] = useState("");

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp !== "123456") {
      setError("Invalid OTP! Use demo OTP: 123456");
      return;
    }
    setError("");

    const userData = {
      name: "John Doe",
      email: "john@example.com",
      phone: `+91 ${phone}`,
    };

    localStorage.setItem("user_session", JSON.stringify(userData));
    if (onLoginSuccess) onLoginSuccess(userData);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setPhone("");
    setOtp("");
    setError("");
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="auth-modal">
      <div className="auth-modal__dialog m-0">
        <button
          type="button"
          className="auth-modal__close-btn"
          onClick={handleClose}
          aria-label="Close"
        >
          <RiCloseLine />
        </button>

        <div className="auth-modal__header">
          <h2 className="auth-modal__title">
            {step === 1 ? "Sign In / Register" : "Verify Mobile Number"}
          </h2>
          <p className="auth-modal__subtitle">
            {step === 1
              ? "Enter your 10-digit mobile number to proceed."
              : `Enter the 6-digit OTP sent to +91 ${phone}`}
          </p>
        </div>

        {error && (
          <Alert variant="danger" className="auth-modal__alert">
            {error}
          </Alert>
        )}

        {step === 1 ? (
          <Form onSubmit={handleSendOtp} className="auth-modal__form">
            <Form.Group className="auth-modal__input-group">
              <RiSmartphoneLine className="auth-modal__input-icon" />
              <Form.Control
                type="tel"
                placeholder="Enter 10-digit mobile number"
                value={phone}
                maxLength={10}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                className="auth-modal__input"
                autoFocus
              />
            </Form.Group>

            <Button type="submit" className="auth-modal__submit-btn">
              Get OTP
            </Button>
          </Form>
        ) : (
          <Form onSubmit={handleVerifyOtp} className="auth-modal__form">
            <Form.Group className="auth-modal__input-group">
              <RiLockPasswordLine className="auth-modal__input-icon" />
              <Form.Control
                type="text"
                placeholder="Enter OTP (Use: 123456)"
                value={otp}
                maxLength={6}
                onChange={(e) => setOtp(e.target.value)}
                className="auth-modal__input"
                autoFocus
              />
            </Form.Group>

            <Button type="submit" className="auth-modal__submit-btn">
              Verify & Proceed
            </Button>

            <button
              type="button"
              className="auth-modal__change-btn"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
              }}
            >
              Change Mobile Number
            </button>
          </Form>
        )}
      </div>
    </Modal>
  );
}
