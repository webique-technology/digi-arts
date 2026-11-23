"use client";

import { useCallback, useEffect, useState } from "react";
import { Row, Col, Modal, Form } from "react-bootstrap";
import {
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCheckLine,
} from "react-icons/ri";
import { apiFetch } from "@/lib/api";
import { INDIAN_STATES } from "@/lib/states";

const EMPTY = {
  tag: "Home",
  name: "",
  phone: "",
  line1: "",
  city: "",
  state: "Maharashtra",
  pincode: "",
  is_default: false,
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | address id
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState("");

  const load = useCallback(() => {
    setLoadError("");
    apiFetch("/auth/addresses")
      .then((r) => setAddresses(r.data || []))
      .catch((err) => setLoadError(err.message || "Could not load your addresses"));
  }, []);

  useEffect(() => {
    load();
    // Addresses used to live only in this browser
    try { localStorage.removeItem("user_addresses"); } catch {}
  }, [load]);

  const flash = (text) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 3000);
  };

  const openForm = (addr) => {
    setEditing(addr ? addr.id : "new");
    setForm(addr ? { ...EMPTY, ...addr } : { ...EMPTY, is_default: !addresses?.length });
    setErrors({});
    setFormError("");
  };

  const closeForm = () => {
    if (!busy) setEditing(null);
  };

  const set = (k) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [k]: value }));
    setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setFormError("");
    try {
      const isNew = editing === "new";
      const r = await apiFetch(isNew ? "/auth/addresses" : `/auth/addresses/${editing}`, {
        method: isNew ? "POST" : "PUT",
        body: form,
      });
      setAddresses(r.data);
      setEditing(null);
      flash(isNew ? "Address saved" : "Address updated");
    } catch (err) {
      if (err.status === 422 && err.errors) setErrors(err.errors);
      setFormError(err.message || "Could not save the address");
    } finally {
      setBusy(false);
    }
  };

  const makeDefault = async (id) => {
    try {
      const r = await apiFetch(`/auth/addresses/${id}/default`, { method: "POST" });
      setAddresses(r.data);
    } catch (err) {
      flash(err.message || "Could not update the default address");
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      const r = await apiFetch(`/auth/addresses/${toDelete.id}`, { method: "DELETE" });
      setAddresses(r.data);
      setToDelete(null);
      flash("Address deleted");
    } catch (err) {
      flash(err.message || "Could not delete the address");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="account-addresses">
      <div className="account-header-action-row">
        <h1 className="account-page-title">Saved Addresses</h1>
        <button
          type="button"
          className="account-btn account-btn--primary"
          onClick={() => openForm(null)}
          disabled={!addresses}
        >
          <RiAddLine /> Add New
        </button>
      </div>

      {notice && <div className="alert alert--ok mb-3" role="status">{notice}</div>}

      {loadError ? (
        <div className="alert alert--error" role="alert">
          {loadError}{" "}
          <button type="button" className="account-address-card__set-default-btn" onClick={load}>Try again</button>
        </div>
      ) : addresses === null ? (
        <p className="text-muted">Loading your addresses…</p>
      ) : !addresses.length ? (
        <p className="text-muted">You haven’t saved any addresses yet.</p>
      ) : (
        <Row className="account-addresses-grid g-3">
          {addresses.map((addr) => (
            <Col md={6} key={addr.id}>
              <div className={`account-address-card ${addr.is_default ? "is-default" : ""}`}>
                <div className="account-address-card__header">
                  <div className="account-address-card__badges">
                    <span className="account-address-card__tag">{addr.tag}</span>
                    {addr.is_default && (
                      <span className="account-address-card__default-badge">Default</span>
                    )}
                  </div>

                  <div className="account-address-card__controls">
                    <button
                      type="button"
                      className="account-icon-btn"
                      onClick={() => openForm(addr)}
                      aria-label={`Edit ${addr.tag} address`}
                    >
                      <RiEditLine />
                    </button>
                    <button
                      type="button"
                      className="account-icon-btn"
                      onClick={() => setToDelete(addr)}
                      aria-label={`Delete ${addr.tag} address`}
                    >
                      <RiDeleteBinLine />
                    </button>
                  </div>
                </div>

                <h4 className="account-address-card__recipient">{addr.name}</h4>
                <p className="account-address-card__lines">
                  {addr.line1}
                  <br />
                  {addr.city}, {addr.state} - {addr.pincode}
                </p>
                <p className="account-address-card__phone">+91 {addr.phone}</p>

                {!addr.is_default && (
                  <button
                    type="button"
                    className="account-address-card__set-default-btn"
                    onClick={() => makeDefault(addr.id)}
                  >
                    <RiCheckLine /> Set as Default
                  </button>
                )}
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={editing !== null} onHide={closeForm} centered className="account-address-modal">
        <div className="account-address-modal__body">
          <h3 className="account-address-modal__title">
            {editing === "new" ? "Add New Address" : "Edit Address"}
          </h3>
          {formError && <div className="alert alert--error mb-3" role="alert">{formError}</div>}
          <Form onSubmit={save} noValidate>
            <Row className="g-3">
              <Col sm={6}>
                <Form.Group controlId="addr-tag">
                  <Form.Label>Label</Form.Label>
                  <Form.Select value={form.tag} onChange={set("tag")}>
                    <option value="Home">Home</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group controlId="addr-phone">
                  <Form.Label>Mobile number</Form.Label>
                  <Form.Control type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14}
                    value={form.phone} onChange={set("phone")} isInvalid={!!errors.phone} />
                  <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="addr-name">
                  <Form.Label>Full name</Form.Label>
                  <Form.Control type="text" autoComplete="name" maxLength={80}
                    value={form.name} onChange={set("name")} isInvalid={!!errors.name} />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="addr-line1">
                  <Form.Label>Street address</Form.Label>
                  <Form.Control type="text" autoComplete="street-address" maxLength={200}
                    placeholder="House no., building, street, area"
                    value={form.line1} onChange={set("line1")} isInvalid={!!errors.line1} />
                  <Form.Control.Feedback type="invalid">{errors.line1}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="addr-city">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" autoComplete="address-level2" maxLength={60}
                    value={form.city} onChange={set("city")} isInvalid={!!errors.city} />
                  <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={7}>
                <Form.Group controlId="addr-state">
                  <Form.Label>State</Form.Label>
                  <Form.Select autoComplete="address-level1" value={form.state} onChange={set("state")} isInvalid={!!errors.state}>
                    {INDIAN_STATES.map((st) => <option key={st} value={st}>{st}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs={5}>
                <Form.Group controlId="addr-pincode">
                  <Form.Label>PIN code</Form.Label>
                  <Form.Control type="text" inputMode="numeric" autoComplete="postal-code" maxLength={6}
                    value={form.pincode} onChange={set("pincode")} isInvalid={!!errors.pincode} />
                  <Form.Control.Feedback type="invalid">{errors.pincode}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              {editing === "new" && addresses?.length > 0 && (
                <Col xs={12}>
                  <Form.Check id="addr-default" type="checkbox" label="Make this my default address"
                    checked={form.is_default} onChange={set("is_default")} />
                </Col>
              )}
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="account-btn account-btn--outline" onClick={closeForm} disabled={busy}>
                Cancel
              </button>
              <button type="submit" className="account-btn account-btn--primary" disabled={busy}>
                {busy ? "Saving…" : "Save Address"}
              </button>
            </div>
          </Form>
        </div>
      </Modal>

      <Modal show={!!toDelete} onHide={() => !busy && setToDelete(null)} centered className="account-address-modal">
        <div className="account-address-modal__body">
          <h3 className="account-address-modal__title">Delete address?</h3>
          <p>
            {toDelete?.name}, {toDelete?.line1}, {toDelete?.city} will be removed from your saved addresses.
          </p>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button type="button" className="account-btn account-btn--outline" onClick={() => setToDelete(null)} disabled={busy}>
              Cancel
            </button>
            <button type="button" className="account-btn account-btn--primary" onClick={remove} disabled={busy}>
              {busy ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
