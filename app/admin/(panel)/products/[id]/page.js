'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminFetch } from '@/lib/api';
import { useAdmin } from '@/components/admin/AdminProvider';
import ProductForm from '@/components/admin/ProductForm';

export default function EditProduct() {
  const { id } = useParams();
  const { onError } = useAdmin();
  const [product, setProduct] = useState(null);
  useEffect(() => { adminFetch(`/admin/products/${id}`).then((r) => setProduct(r.data)).catch(onError); }, [id, onError]);
  return product ? <ProductForm product={product} /> : <div className="panel">Loading…</div>;
}
