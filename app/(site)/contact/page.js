import ContactForm from '@/components/ContactForm';
import Link from 'next/link';
import { TEST_IDS } from '@/components/testIds';
export const metadata = { title: 'Contact Us', description: 'Get in touch with the Damani team for orders, custom gifting and bulk enquiries.', alternates: { canonical: '/contact' } };

export default function Contact() {
  return (
    <>
      <section className="editorial-head editorial-head--contact"><div className="container">
        <p className="editorial-head__eyebrow">We’re here to help</p><h1>Let’s make it special</h1>
        <p>Questions about an order, a product or a custom idea? Send us a note and tell us how you’d like us to reply.</p>
      </div></section>
      <section className="section"><div className="container contact">
        <div className="contact__info">
          <p className="editorial-kicker">How can we help?</p><h2>Choose a topic to get started</h2>
          <Link className="contact-card" href="/products" data-testid={TEST_IDS.contactTopic('products')}><span className="contact-card__number">01</span><span><strong>Product & order questions</strong><small>Include the product name or your order details in the message.</small></span><span aria-hidden="true">↗</span></Link>
          <Link className="contact-card" href="/pages/bulk-orders" data-testid={TEST_IDS.contactTopic('bulk-orders')}><span className="contact-card__number">02</span><span><strong>Custom & bulk orders</strong><small>Tell us the occasion, quantity and what you have in mind.</small></span><span aria-hidden="true">↗</span></Link>
          <div className="contact__note"><strong>What happens next?</strong><p>Leave your phone number or email so our team has a way to follow up.</p></div>
        </div>
        <ContactForm />
      </div></section>
    </>
  );
}
