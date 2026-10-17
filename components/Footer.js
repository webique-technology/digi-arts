
import Link from 'next/link';
import Logo from './Logo';
import {
  FOOTER_QUICK,
  FOOTER_CATS,
  POLICIES,
  SITE_INFO,
} from '@/data/site';
import {
 FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
} from './Icons';

export default function Footer() {
  const hasSocialLinks =
    SITE_INFO.facebook ||
    SITE_INFO.instagram ||
    SITE_INFO.youtube;

  return (
    <footer className="footer">
      <div className="container">
        
<div className="footer__grid">
  {/* Grid 1: Brand */}
  <div className="footer__brand">
    <Link href="/" className="footer__logo" aria-label="Damani home">
      <Logo />
    </Link>

    <p className="footer__description">
      Thoughtful designs and beautiful details
      for every special moment.
    </p>
  </div>

  {/* Grid 2: Quick Links */}
  <nav className="footer__nav" aria-label="Quick links">
    <h2>Quick Links</h2>
    <ul>
      {FOOTER_QUICK.map((l) => (
        <li key={l.label}>
          <Link href={l.href}>{l.label}</Link>
        </li>
      ))}
    </ul>
  </nav>

  {/* Grid 3: Categories */}
  <nav className="footer__nav" aria-label="Categories">
    <h2>Categories</h2>
    <ul>
      {FOOTER_CATS.map((l) => (
        <li key={l.label}>
          <Link href={l.href}>{l.label}</Link>
        </li>
      ))}
    </ul>
  </nav>

  {/* Grid 4: Social */}

<div className="footer__contact footer__nav">
  <h2>Contact Us</h2>

  <div className="footer__contact-list">
    <div className="footer__contact-item">
      <span className="footer__contact-icon">
        <MapPinIcon />
      </span>
      <div>
        <span className="footer__contact-label">Our Address</span>
        <p>YOUR BUSINESS ADDRESS</p>
      </div>
    </div>

    <div className="footer__contact-item">
      <span className="footer__contact-icon">
        <PhoneIcon />
      </span>
      <div>
        <span className="footer__contact-label">Call Us</span>
        <a href="tel:+91XXXXXXXXXX">+91 XXXXXXXXXX</a>
      </div>
    </div>

    <div className="footer__contact-item">
      <span className="footer__contact-icon">
        <MailIcon />
      </span>
      <div>
        <span className="footer__contact-label">Email Us</span>
        <a href="mailto:YOUR_EMAIL@example.com">
          YOUR_EMAIL@example.com
        </a>
      </div>
    </div>
  </div>

  <div className="footer__social">
    <a href="YOUR_FACEBOOK_URL" aria-label="Facebook"
       target="_blank" rel="noopener noreferrer">
      <FacebookIcon />
    </a>
    <a href="YOUR_INSTAGRAM_URL" aria-label="Instagram"
       target="_blank" rel="noopener noreferrer">
      <InstagramIcon />
    </a>
    <a href="YOUR_YOUTUBE_URL" aria-label="YouTube"
       target="_blank" rel="noopener noreferrer">
      <YoutubeIcon />
    </a>
  </div>
</div>

</div>

      </div>

      <div className="footer__bottom">
        <div className="container footer__legal">
          <span>
            © {new Date().getFullYear()} {SITE_INFO.name}.
            {' '}All rights reserved.
          </span>

          <nav className="footer__policies" aria-label="Legal">
            {POLICIES.map((p) => (
              <Link key={p.label} href={p.href}>
                {p.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
