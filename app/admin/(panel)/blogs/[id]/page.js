'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { adminFetch } from '@/lib/api';
import { useAdmin } from '@/components/admin/AdminProvider';
import BlogForm from '@/components/admin/BlogForm';

export default function EditBlog() {
  const { id } = useParams();
  const { onError } = useAdmin();
  const [blog, setBlog] = useState(null);
  useEffect(() => { adminFetch(`/admin/blogs/${id}`).then((r) => setBlog(r.data)).catch(onError); }, [id, onError]);
  return blog ? <BlogForm blog={blog} /> : <div className="panel">Loading…</div>;
}
