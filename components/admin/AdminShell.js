'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  FiBookOpen, FiExternalLink, FiFolder, FiGrid, FiImage, FiLogOut, FiMail, FiMessageSquare,
  FiPackage, FiPercent, FiSettings, FiShoppingBag,
} from 'react-icons/fi';
import { useAdmin } from './AdminProvider';
import ConfirmModal from './ConfirmModal';
import { adminFetch } from '@/lib/api';
import { CloseIcon, MenuIcon } from '@/components/Icons';
import { TEST_IDS } from '@/components/testIds';
import brandIcon from '@/app/admin/icon.png';

const SECTIONS = [
  { items: [{ href: '/admin', label: 'Dashboard', icon: FiGrid, exact: true }] },
  {
    title: 'Sales',
    items: [
      { href: '/admin/orders', label: 'Orders', icon: FiShoppingBag, badge: 'orders_new' },
      { href: '/admin/coupons', label: 'Coupons', icon: FiPercent },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { href: '/admin/products', label: 'Products', icon: FiPackage },
      { href: '/admin/categories', label: 'Categories', icon: FiFolder },
      { href: '/admin/banners', label: 'Banners', icon: FiImage },
      { href: '/admin/blogs', label: 'Blogs', icon: FiBookOpen },
    ],
  },
  {
    title: 'Customers',
    items: [
      { href: '/admin/messages', label: 'Messages', icon: FiMessageSquare, badge: 'messages_unread' },
      { href: '/admin/subscribers', label: 'Subscribers', icon: FiMail },
    ],
  },
];
const SETTINGS = { href: '/admin/settings', label: 'Settings', icon: FiSettings };
const NAV = [...SECTIONS.flatMap((s) => s.items), SETTINGS];

const initials = (name = '') => name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'A';

export default function AdminShell({ children }) {
  const { admin, logout } = useAdmin();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState({});
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const active = (n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href));
  const current = NAV.find(active)?.label || 'Admin';

  useEffect(() => {
    adminFetch('/admin/stats').then((r) => setCounts(r.data || {})).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 991) setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnDesktop);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnDesktop);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  const navLink = (n) => {
    const Icon = n.icon;
    const isActive = active(n);
    const count = n.badge ? counts[n.badge] : 0;
    return (
      <Link key={n.href} href={n.href} className={`shell__link ${isActive ? 'is-active' : ''}`} aria-current={isActive ? 'page' : undefined}
        data-testid={TEST_IDS.adminNavigationItem(n.href)} onClick={() => setOpen(false)}>
        <Icon className="shell__icon" aria-hidden="true" />
        <span className="shell__label">{n.label}</span>
        {count > 0 && <span className="shell__badge" aria-label={`${count} new`}>{count > 99 ? '99+' : count}</span>}
      </Link>
    );
  };

  return (
    <div className="shell">
      {open && <button className="shell__overlay" type="button" onClick={() => setOpen(false)} aria-label="Close admin navigation" data-testid={TEST_IDS.adminMenuBackdrop} />}
      <aside className={`shell__side ${open ? 'is-open' : ''}`}>
        <div className="shell__brand">
          <Image className="shell__mark" src={brandIcon} width={38} height={38} alt="" priority />
          <span className="shell__brand-text">
            <strong>Digi Art’s Store</strong>
            <small>Store administration</small>
          </span>
          <button className="shell__close" type="button" onClick={() => setOpen(false)} aria-label="Close menu" data-testid={TEST_IDS.adminMenuClose}><CloseIcon /></button>
        </div>

        <nav id="admin-navigation" className="shell__nav" aria-label="Admin" data-testid={TEST_IDS.adminNavigation}>
          {SECTIONS.map((s, i) => (
            <div key={s.title || i} className="shell__group">
              {s.title && <p className="shell__group-title">{s.title}</p>}
              {s.items.map(navLink)}
            </div>
          ))}
          <div className="shell__group shell__group--end">
            {navLink(SETTINGS)}
            <Link href="/" target="_blank" rel="noreferrer" className="shell__link shell__site-link">
              <FiExternalLink className="shell__icon" aria-hidden="true" />
              <span className="shell__label">View storefront</span>
            </Link>
          </div>
        </nav>

        <div className="shell__user">
          <span className="shell__avatar" aria-hidden="true">{initials(admin.name)}</span>
          <span className="shell__user-text">
            <strong>{admin.name}</strong>
            {admin.phone && <small className="shell__phone">+91 {admin.phone}</small>}
          </span>
          <button className="shell__logout" type="button" onClick={() => { setOpen(false); setConfirmLogout(true); }} aria-label="Log out" title="Log out" data-testid={TEST_IDS.adminLogout}>
            <FiLogOut aria-hidden="true" />
          </button>
        </div>
      </aside>
      <div className="shell__main">
        <header className="shell__top">
          <button className="shell__menu" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="admin-navigation" aria-label={open ? 'Close navigation' : 'Open navigation'} data-testid={TEST_IDS.adminMenuToggle}>
            <MenuIcon /><span>Menu</span>
          </button>
          <div className="shell__crumb"><span>Store administration</span><strong>{current}</strong></div>
          <Link href="/" target="_blank" rel="noreferrer" className="shell__view-site">View storefront ↗</Link>
        </header>
        {children}
      </div>
      <ConfirmModal
        open={confirmLogout}
        title="Log out?"
        message="You'll be signed out of the admin panel on all devices."
        confirmText="Log out"
        busy={loggingOut}
        onConfirm={() => { setLoggingOut(true); logout(); }}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  );
}
