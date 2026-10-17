'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminFetch } from '@/lib/api';
import { useAdmin } from '@/components/admin/AdminProvider';
import BannerForm from '@/components/admin/BannerForm';

export default function EditBanner() {
  const { id } = useParams();
  const { onError } = useAdmin();
  const [banner, setBanner] = useState(null);
  useEffect(() => { adminFetch(`/admin/banners/${id}`).then((r) => setBanner(r.data)).catch(onError); }, [id, onError]);
  return banner ? <BannerForm banner={banner} /> : <div className="panel">Loading…</div>;
}
