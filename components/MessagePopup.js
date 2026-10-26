"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";

export default function MessagePopup({
  text = "",
  title = "", // Optional bold prefix like "Demo catalog preview"
  duration = 5000, // Duration in milliseconds (default 5 seconds)
  className = "bg-warning-subtle text-warning-emphasis border border-warning", // Default style matching the banner
}) {
  const [visible, setVisible] = useState(Boolean(text || title));
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!text && !title) return;

    setVisible(true);
    setFading(false);

    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [text, title, duration]);

  const handleClose = () => {
    setFading(true);
    setTimeout(() => {
      setVisible(false);
      setFading(false);
    }, 250);
  };

  if (!visible || (!text && !title)) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`message-popup-wrapper ${fading ? "fade-out" : "fade-in"}`}
    >
      <div
        className={`message-popup-box d-flex align-items-center justify-content-between shadow-sm rounded-3 px-3 py-2 ${className}`}
      >
        <div className="message-popup-content pe-2 small">
          {title && <strong className="me-2">{title}:</strong>}
          <span>{text}</span>
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close notification"
          className="btn-link text-reset p-2 bg-transparent d-flex align-items-center border-0 opacity-75 hover-opacity-100"
        >
          <IoClose className="fs-5" />
        </button>
      </div>
    </div>
  );
}
