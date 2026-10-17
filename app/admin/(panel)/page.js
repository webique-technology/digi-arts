'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/api';
import { useAdmin } from '@/components/admin/AdminProvider';
import { TEST_IDS } from '@/components/testIds';

export default function Dashboard() {
  const { admin, onError } = useAdmin();
  const [s, setS] = useState(null);
  useEffect(() => { adminFetch('/admin/stats').then((r) => setS(r.data)).catch(onError); }, [onError]);

  const Card = ({ title, n, href, tone }) => (
    <Link href={href} className={`statcard ${tone ? `statcard--${tone}` : ''}`}><span>{title}</span><strong>{s ? n : '–'}</strong></Link>
  );
  return (
    <div>
      <div className="panel">
        <h1>Welcome, {admin.name}</h1>
        <p style={{ color: '#666' }}>Here’s what’s happening in your store.</p>
        <div className="statgrid">
          <Card title="New orders" n={s?.orders_new} href="/admin/orders" tone={s?.orders_new ? 'alert' : ''} />
          <Card title="Total orders" n={s?.orders_total} href="/admin/orders" />
          <Card title="Unread messages" n={s?.messages_unread} href="/admin/messages" tone={s?.messages_unread ? 'alert' : ''} />
          <Card title="Products" n={s?.products} href="/admin/products" />
          <Card title="Low stock (≤3)" n={s?.low_stock} href="/admin/products" tone={s?.low_stock ? 'warn' : ''} />
          <Card title="Banners" n={s?.banners} href="/admin/banners" />
        </div>
      </div>
      <div className="panel" style={{ marginTop: 16 }}>
        <h2 style={{ marginBottom: 12 }}>Quick actions</h2>
        <div className="dashboard__actions">
          <Link className="btn btn--sm" href="/admin/products/new" data-testid={TEST_IDS.adminAddProduct}>+ Add product</Link>
          <Link className="btn btn--sm btn--outline" href="/admin/banners/new" data-testid={TEST_IDS.adminAddBanner}>+ Add banner</Link>
          <Link className="btn btn--sm btn--outline" href="/admin/categories">Manage categories</Link>
        </div>
      </div>
    </div>
  );
}
