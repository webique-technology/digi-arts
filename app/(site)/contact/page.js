import { Container, Row, Col } from "react-bootstrap";
import ContactForm from "@/components/ContactForm";
import {
  HiOutlineLocationMarker,
  HiOutlineClock,
  HiOutlinePhone,
  HiOutlineMail,
} from "react-icons/hi";
import { FaWhatsapp, FaFacebookF, FaInstagram } from "react-icons/fa";

export const metadata = {
  title: "Contact Us | Digi Art’s Store",
  description:
    "Get in touch with Digi Art’s Store team for orders, custom gifting and bulk enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      {/* Top Section: Map & Store Information */}
      <section className="contact-page__top py-5">
        <Container>
          <Row className="gy-4 align-items-center">
            {/* Left: Google Map Embed */}
            <Col xs={12} lg={6}>
              <div className="contact-map-card shadow-sm rounded-3 overflow-hidden">
                <iframe
                  title="Digi Art Store Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119981.26817294827!2d73.72107937409214!3d19.99110534241031!2m3!1f0!2f0!3f0!3m2!1i1024!2f768!4f13.1!3m3!1m2!1s0x3bddeb635bf7a9f7%3A0xe5417036a461b24e!2sPanchavati%2C%20Nashik%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  width="100%"
                  height="380"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </Col>

            {/* Right: Store Details */}
            <Col xs={12} lg={6} className="ps-lg-5">
              <div className="contact-store-info">
                <p className="contact-store-info__subtitle text-muted mb-2">
                  Please feel free to visit and experience the beauty.
                </p>
                <h1 className="contact-store-info__title fw-bold mb-4">
                  Digi Arts Store
                </h1>

                <div className="contact-store-info__details d-flex flex-column gap-3 mb-4">
                  {/* Address */}
                  <div className="d-flex align-items-start gap-3">
                    <HiOutlineLocationMarker className="contact-store-info__icon text-danger flex-shrink-0 fs-5 mt-1" />
                    <p className="mb-0 text-secondary small lh-base">
                      <strong>Digi Arts Studio & Office:</strong> Panchavati,
                      Near Ramkund, Nashik, Maharashtra 422003
                    </p>
                  </div>

                  {/* Hours */}
                  <div className="d-flex align-items-center gap-3">
                    <HiOutlineClock className="contact-store-info__icon text-danger flex-shrink-0 fs-5" />
                    <p className="mb-0 text-secondary small">
                      Monday to Saturday: 10:30am to 7:30pm, Sunday: 11am to 7pm
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="d-flex align-items-center gap-3">
                    <HiOutlinePhone className="contact-store-info__icon text-danger flex-shrink-0 fs-5" />
                    <a
                      href="tel:+919876543210"
                      className="text-decoration-none text-secondary small"
                    >
                      +91 98765 43210
                    </a>
                  </div>

                  {/* Email */}
                  <div className="d-flex align-items-center gap-3">
                    <HiOutlineMail className="contact-store-info__icon text-danger flex-shrink-0 fs-5" />
                    <a
                      href="mailto:digiartsstore@gmail.com"
                      className="text-decoration-none text-secondary small"
                    >
                      digiartsstore@gmail.com
                    </a>
                  </div>
                </div>

                {/* Social Channels */}
                <div className="contact-store-info__socials">
                  <span className="d-block text-muted small fw-semibold mb-2">
                    Follow us on
                  </span>
                  <div className="d-flex gap-2">
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-btn contact-social-btn--wa"
                      aria-label="WhatsApp"
                    >
                      <FaWhatsapp />
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-btn contact-social-btn--fb"
                      aria-label="Facebook"
                    >
                      <FaFacebookF />
                    </a>
                    <a
                      href="https://instagram.com/digi_arts11"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-btn contact-social-btn--ig"
                      aria-label="Instagram"
                    >
                      <FaInstagram />
                    </a>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Bottom Section: Centered Floating Contact Form */}
      <section className="contact-page__bottom py-5">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={10} lg={8}>
              <ContactForm />
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
}
