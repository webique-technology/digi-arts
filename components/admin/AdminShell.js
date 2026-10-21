'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAdmin } from './AdminProvider';
import { CloseIcon, MenuIcon } from '@/components/Icons';
import { TEST_IDS } from '@/components/testIds';

const NAV = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/banners', label: 'Banners' },
  { href: '/admin/categories', label: 'Categories' },
  { href: '/admin/coupons', label: 'Coupons' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/settings', label: 'Settings' },
];

export default function AdminShell({ children }) {
  const { admin, logout } = useAdmin();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = (n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href));
  const current = NAV.find(active)?.label || 'Admin';

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

  return (
    <div className="shell">
      {open && <button className="shell__overlay" type="button" onClick={() => setOpen(false)} aria-label="Close admin navigation" data-testid={TEST_IDS.adminMenuBackdrop} />}
      <aside className={`shell__side ${open ? 'is-open' : ''}`}>
        <div className="shell__brand"><span>Digi Art’s Store</span><button className="shell__close" type="button" onClick={() => setOpen(false)} aria-label="Close menu" data-testid={TEST_IDS.adminMenuClose}><CloseIcon /></button></div>
        <p className="shell__caption">Store administration</p>
        <nav id="admin-navigation" className="shell__nav" aria-label="Admin" data-testid={TEST_IDS.adminNavigation}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={active(n) ? 'is-active' : ''} aria-current={active(n) ? 'page' : undefined}
              data-testid={TEST_IDS.adminNavigationItem(n.href)} onClick={() => setOpen(false)}>{n.label}</Link>
          ))}
          <Link href="/" target="_blank" rel="noreferrer" className="shell__site-link">View storefront ↗</Link>
        </nav>
        <div className="shell__user">
          <div><strong>{admin.name}</strong></div><div className="shell__phone">+91 {admin.phone}</div>
          <button className="btn btn--sm btn--outline shell__logout" onClick={logout} data-testid={TEST_IDS.adminLogout}>Logout</button>
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
    </div>
  );
}
