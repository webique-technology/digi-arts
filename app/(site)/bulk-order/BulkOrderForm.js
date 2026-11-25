
'use client';

import { useState } from 'react';

export default function BulkOrderForm({ selectedProduct }) {
  const [form, setForm] = useState({
    name: '',
    businessName: '',
    mobile: '',
    email: '',
    city: '',
    state: '',
    quantity: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedProduct) {
      alert('Please select a product first.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch('/api/bulk-enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          product_id: selectedProduct.id,
          product_name: selectedProduct.title,
          product_slug: selectedProduct.slug,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong.');
      }

      alert('Your bulk enquiry has been submitted successfully!');

      setForm({
        name: '',
        businessName: '',
        mobile: '',
        email: '',
        city: '',
        state: '',
        quantity: '',
        message: '',
      });
    } catch (error) {
      alert(error.message || 'Unable to submit enquiry.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="bulk-order">
      <div className="bulk-order__header">
        <span>WHOLESALE & BULK ORDERS</span>
        <h1>Looking for Bulk Orders?</h1>
        <p>
          Share your requirements with us. Our team will contact you
          with the best available quotation.
        </p>
      </div>

      {selectedProduct ? (
        <div className="bulk-order__product">
          {selectedProduct.image && (
            <img
              src={selectedProduct.image}
              alt={selectedProduct.title}
            />
          )}

          <div>
            <small>SELECTED PRODUCT</small>
            <h3>{selectedProduct.title}</h3>
            {selectedProduct.sku && <p>SKU: {selectedProduct.sku}</p>}
          </div>
        </div>
      ) : (
        <p className="bulk-order__notice">
          Please select a product from the store before submitting
          a bulk enquiry.
        </p>
      )}

      <form className="bulk-order__form" onSubmit={handleSubmit}>
        <h2>Your Details</h2>

        <div className="bulk-order__grid">
          <div className="bulk-order__field">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="bulk-order__field">
            <label>Business / Company Name</label>
            <input
              type="text"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              placeholder="Enter business name"
            />
          </div>

          <div className="bulk-order__field">
            <label>Mobile Number *</label>
            <input
              type="tel"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter mobile number"
              pattern="[0-9]{10}"
              maxLength={10}
              required
            />
          </div>

          <div className="bulk-order__field">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </div>

          <div className="bulk-order__field">
            <label>City *</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Enter city"
              required
            />
          </div>

          <div className="bulk-order__field">
            <label>State *</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="Enter state"
              required
            />
          </div>

          <div className="bulk-order__field">
            <label>Required Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>
        </div>

        <div className="bulk-order__field">
          <label>Additional Requirements</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell us about your requirements..."
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="btn btn--primary"
          disabled={submitting || !selectedProduct}
        >
          {submitting ? 'Submitting...' : 'Submit Bulk Enquiry'}
        </button>
      </form>
    </section>
  );
}
