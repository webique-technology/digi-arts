"use client";

import { useState, useEffect } from "react";
import { Row, Col, Modal, Form } from "react-bootstrap";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCheckLine,
} from "react-icons/ri";
import { ACCOUNT_DATA } from "@/data/accountData";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(ACCOUNT_DATA.addresses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    tag: "Home",
    name: "",
    line1: "",
    cityState: "",
    phone: "",
  });

  // Load from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem("user_addresses");
    if (saved) {
      try {
        setAddresses(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const saveAddresses = (updated) => {
    setAddresses(updated);
    localStorage.setItem("user_addresses", JSON.stringify(updated));
  };

  const setDefaultAddress = (id) => {
    const updated = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    saveAddresses(updated);
  };

  const deleteAddress = (id) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    saveAddresses(updated);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.line1) return;

    const created = [
      ...addresses,
      {
        id: Date.now(),
        isDefault: addresses.length === 0,
        ...newAddress,
      },
    ];

    saveAddresses(created);
    setShowAddModal(false);
    setNewAddress({
      tag: "Home",
      name: "",
      line1: "",
      cityState: "",
      phone: "",
    });
  };

  return (
    <div className="account-addresses">
      <div className="account-header-action-row">
        <h1 className="account-page-title">Saved Addresses</h1>
        <button
          type="button"
          className="account-btn account-btn--primary"
          onClick={() => setShowAddModal(true)}
        >
          <RiAddLine /> Add New
        </button>
      </div>

      <Row className="account-addresses-grid g-3">
        {addresses.map((addr) => (
          <Col md={6} key={addr.id}>
            <div
              className={`account-address-card ${
                addr.isDefault ? "is-default" : ""
              }`}
            >
              <div className="account-address-card__header">
                <div className="account-address-card__badges">
                  <span className="account-address-card__tag">{addr.tag}</span>
                  {addr.isDefault && (
                    <span className="account-address-card__default-badge">
                      Default
                    </span>
                  )}
                </div>

                <div className="account-address-card__controls">
                  <button
                    type="button"
                    className="account-icon-btn"
                    aria-label="Edit address"
                  >
                    <RiEditLine />
                  </button>
                  <button
                    type="button"
                    className="account-icon-btn"
                    onClick={() => deleteAddress(addr.id)}
                    aria-label="Delete address"
                  >
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>

              <h4 className="account-address-card__recipient">{addr.name}</h4>
              <p className="account-address-card__lines">
                {addr.line1}
                <br />
                {addr.cityState}
              </p>
              <p className="account-address-card__phone">{addr.phone}</p>

              {!addr.isDefault && (
                <button
                  type="button"
                  className="account-address-card__set-default-btn"
                  onClick={() => setDefaultAddress(addr.id)}
                >
                  <RiCheckLine /> Set as Default
                </button>
              )}
            </div>
          </Col>
        ))}
      </Row>

      {/* Add Address Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        centered
        className="account-address-modal"
      >
        <div className="account-address-modal__body">
          <h3 className="account-address-modal__title">Add New Address</h3>
          <Form onSubmit={handleAddAddress}>
            <Form.Group className="mb-3">
              <Form.Label>Tag / Label</Form.Label>
              <Form.Select
                value={newAddress.tag}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, tag: e.target.value })
                }
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                required
                value={newAddress.name}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, name: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Street Address</Form.Label>
              <Form.Control
                type="text"
                required
                value={newAddress.line1}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, line1: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City, State, Pincode</Form.Label>
              <Form.Control
                type="text"
                required
                value={newAddress.cityState}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, cityState: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                required
                value={newAddress.phone}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, phone: e.target.value })
                }
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                className="account-btn account-btn--outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="account-btn account-btn--primary"
              >
                Save Address
              </button>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
}
