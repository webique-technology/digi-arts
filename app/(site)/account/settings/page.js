"use client";

import { useState } from "react";
import { Form } from "react-bootstrap";
import {
  RiUser3Line,
  RiMailLine,
  RiPhoneLine,
  RiLockPasswordLine,
} from "react-icons/ri";
import { ACCOUNT_DATA } from "@/data/accountData";

export default function SettingsPage() {
  const [profile, setProfile] = useState(ACCOUNT_DATA.user);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem("user_session", JSON.stringify(profile));
    setStatusMessage("Profile details updated successfully!");
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

      {/* Password Form */}
      <div className="account-card account-card--form">
        <h3 className="account-card__title">Change Password</h3>
        <Form className="account-form">
          <Form.Group className="account-form__group">
            <Form.Label className="account-form__label">
              Current Password
            </Form.Label>
            <div className="account-form__input-wrapper">
              <RiLockPasswordLine className="account-form__icon" />
              <Form.Control type="password" className="account-form__control" />
            </div>
          </Form.Group>

          <Form.Group className="account-form__group">
            <Form.Label className="account-form__label">
              New Password
            </Form.Label>
            <div className="account-form__input-wrapper">
              <RiLockPasswordLine className="account-form__icon" />
              <Form.Control type="password" className="account-form__control" />
            </div>
          </Form.Group>

          <Form.Group className="account-form__group">
            <Form.Label className="account-form__label">
              Confirm New Password
            </Form.Label>
            <div className="account-form__input-wrapper">
              <RiLockPasswordLine className="account-form__icon" />
              <Form.Control type="password" className="account-form__control" />
            </div>
          </Form.Group>

          <button type="button" className="account-btn account-btn--secondary">
            Update Password
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
