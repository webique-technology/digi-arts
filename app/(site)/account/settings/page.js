"use client";

import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import {
  RiUser3Line,
  RiMailLine,
  RiPhoneLine,
  RiLockPasswordLine,
} from "react-icons/ri";
import { useAuth } from "@/components/AuthProvider";
import { apiFetch } from "@/lib/api";

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (user) setProfile({ name: user.name || "", email: user.email || "", phone: user.phone || "" });
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const r = await apiFetch("/auth/me", { method: "PUT", body: { name: profile.name, email: profile.email } });
      setUser(r.data.user);
      setStatusMessage("Profile details updated successfully!");
    } catch (err) {
      setStatusMessage(err.message || "Could not update profile");
    }
    setTimeout(() => setStatusMessage(""), 3000);
  };

  return (
    <div className="account-settings">
      <h1 className="account-page-title">Account Settings</h1>

      {statusMessage && (
        <div className="alert alert-success py-2 mb-3">{statusMessage}</div>
      )}

      {/* Profile Form */}
      <div className="account-card account-card--form">
        <h3 className="account-card__title">Profile Information</h3>
        <Form onSubmit={handleSaveProfile} className="account-form">
          <Form.Group className="account-form__group">
            <Form.Label className="account-form__label">Full Name</Form.Label>
            <div className="account-form__input-wrapper">
              <RiUser3Line className="account-form__icon" />
              <Form.Control
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="account-form__control"
              />
            </div>
          </Form.Group>

          <Form.Group className="account-form__group">
            <Form.Label className="account-form__label">
              Email Address
            </Form.Label>
            <div className="account-form__input-wrapper">
              <RiMailLine className="account-form__icon" />
              <Form.Control
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="account-form__control"
              />
            </div>
          </Form.Group>

          <Form.Group className="account-form__group">
            <Form.Label className="account-form__label">
              Phone Number
            </Form.Label>
            <div className="account-form__input-wrapper">
              <RiPhoneLine className="account-form__icon" />
              <Form.Control
                type="tel"
                value={profile.phone}
                readOnly
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                className="account-form__control"
              />
            </div>
          </Form.Group>

          <button type="submit" className="account-btn account-btn--primary">
            Save Changes
          </button>
        </Form>
      </div>

      {/* Danger Zone */}
      <div className="account-card account-card--danger">
        <h3 className="account-card__title account-card__title--danger">
          Danger Zone
        </h3>
        <p className="account-card__danger-desc">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button
          type="button"
          className="account-btn account-btn--danger"
          onClick={() => {
            if (confirm("Are you sure you want to delete your account?")) {
              localStorage.removeItem("user_session");
              window.location.href = "/";
            }
          }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
