'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from './Logo';
// import { NAV } from '@/data/site';
import { useCart } from './CartProvider';
import { SearchIcon, UserIcon, BagIcon, ChevronDown, CloseIcon, MenuIcon } from './Icons';
import { TEST_IDS } from './testIds';


export default function Header() {
  const router = useRouter();
  const { count, setOpen } = useCart();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState('');
  const NAV = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Products',
    href: '/products',
    children: [
      { label: 'Small Bags', href: '/products?category=small-bags' },
      { label: 'Gift Boxes', href: '/products?category=gift-boxes' },
      { label: 'Festival Decorations', href: '/products?category=festival-decor' },
      { label: 'Wall Hanging', href: '/products?category=wall-hanging' },
      { label: 'Table Standee', href: '/products?category=table-standee' },
      { label: 'Gift Packaging', href: '/products?category=gift-packaging' },
      { label: 'Varkari & Mavale', href: '/products?category=varkari-mavale' },
    ],
  },
  {
    label: 'Best Sellers',
    href: '/products?bestseller=1',
  },
  {
    label: 'Custom Orders',
    href: '/custom-orders',
  },
  {
    label: 'About Us',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
];
  useEffect(() => {
    if (!mobile) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMobile(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobile]);

  const submit = (e) => {
    e.preventDefault();
    router.push(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : '/products');
    setSearch(false);
  };

  return (
    <header className="header">
      <div className="container header__inner">
        <button className="header__burger" aria-label="Open menu" aria-expanded={mobile} onClick={() => setMobile(true)} data-testid={TEST_IDS.headerMobileMenu}><MenuIcon /></button>
        <Link href="/" className="header__logo" aria-label="Damani home"><Logo /></Link>

        <ul className="nav" aria-label="Main">
          {NAV.map((n) => (
            <li key={n.label}>
              <Link href={n.href} data-testid={TEST_IDS.headerNavigation('desktop', n.href)}>{n.label}{n.children && <ChevronDown />}</Link>
              {n.children && <ul className="nav__sub">{n.children.map((c) => <li key={c.label}><Link href={c.href} data-testid={TEST_IDS.headerNavigation('desktop', c.href)}>{c.label}</Link></li>)}</ul>}
            </li>
          ))}
        </ul>

        <div className="header__icons">
          <button aria-label="Search" aria-expanded={search} onClick={() => setSearch(!search)} data-testid={TEST_IDS.headerSearchToggle}><SearchIcon /></button>
          <Link href="/admin/login" aria-label="Admin sign in" data-testid={TEST_IDS.headerAdminLogin}><UserIcon /></Link>
          <button aria-label={`Open cart${count > 0 ? `, ${count} items` : ''}`} onClick={() => setOpen(true)} data-testid={TEST_IDS.headerCart}><BagIcon />{count > 0 && <span className="header__count">{count}</span>}</button>
        </div>
      </div>

      {search && (
        <form className="header__search" onSubmit={submit} role="search">
          <div className="container"><input autoFocus type="search" placeholder="Search products…" aria-label="Search products" value={q} onChange={(e) => setQ(e.target.value)} />
            <button type="submit" aria-label="Submit search"><SearchIcon /></button></div>
        </form>
      )}

      <div className={`mnav ${mobile ? 'is-open' : ''}`} aria-hidden={!mobile}>
        <button className="mnav__backdrop" type="button" onClick={() => setMobile(false)} aria-label="Close menu" tabIndex={mobile ? 0 : -1} />
        <nav className="mnav__panel" aria-label="Mobile">
          <button className="mnav__close" type="button" aria-label="Close menu" onClick={() => setMobile(false)} tabIndex={mobile ? 0 : -1} data-testid={TEST_IDS.headerMobileMenuClose}><CloseIcon /></button>
          {NAV.map((n) => n.children ? (
            <details key={n.label}><summary tabIndex={mobile ? 0 : -1}>{n.label}<ChevronDown /></summary>
              <ul>{[{ label: `All ${n.label}`, href: n.href }, ...n.children].map((c) => <li key={c.label}><Link href={c.href} onClick={() => setMobile(false)} tabIndex={mobile ? 0 : -1} data-testid={TEST_IDS.headerNavigation('mobile', c.href)}>{c.label}</Link></li>)}</ul></details>
          ) : <Link key={n.label} href={n.href} className="mnav__link" onClick={() => setMobile(false)} tabIndex={mobile ? 0 : -1} data-testid={TEST_IDS.headerNavigation('mobile', n.href)}>{n.label}</Link>)}
        </nav>
      </div>
    </header>
  );
}
