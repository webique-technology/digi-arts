"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  RiDashboardLine,
  RiInboxArchiveLine,
  RiMapPinLine,
  RiSettings4Line,
  RiLogoutBoxRLine,
  RiUser3Line,
} from "react-icons/ri";

export default function AccountSidebar({ user, onLogoutClick }) {
  const pathname = usePathname();

  const navLinks = [
    {
      label: "Dashboard",
      href: "/account",
      icon: RiDashboardLine,
      exact: true,
    },
    { label: "My Orders", href: "/account/orders", icon: RiInboxArchiveLine },
    { label: "Addresses", href: "/account/addresses", icon: RiMapPinLine },
    { label: "Settings", href: "/account/settings", icon: RiSettings4Line },
  ];

  return (
    <aside className="account-sidebar">
      {/* Profile Header */}
      <div className="account-sidebar__profile">
        <div className="account-sidebar__avatar">
          <RiUser3Line />
        </div>
        <div className="account-sidebar__user-meta">
          <h3 className="account-sidebar__user-name">
            {user?.name || "Guest User"}
          </h3>
          <p className="account-sidebar__greeting">Welcome back!</p>
        </div>
      </div>

      {/* Navigation (Wishlist omitted) */}
      <nav className="account-sidebar__nav">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`account-sidebar__link ${isActive ? "is-active" : ""}`}
            >
              <Icon className="account-sidebar__icon" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onLogoutClick}
          className="account-sidebar__link account-sidebar__link--logout"
        >
          <RiLogoutBoxRLine className="account-sidebar__icon" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
