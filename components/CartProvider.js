'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { finalPrice, quantityLineTotal } from '@/lib/utils';

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);
const KEY = 'damani_cart';
const save = (items) => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {} };
const keyOf = (item) => item.key || `live:${item.id}`;
const matches = (item, target) => typeof target === 'object'
  ? keyOf(item) === keyOf(target)
  : item.id === target && !item.preview;

export default function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || '[]')); } catch {}
    setReady(true);
  }, []);

  // Persist immediately (not in an effect) so "Buy it now" -> /checkout never reads a stale cart.
  const commit = useCallback((fn) => setItems((cur) => { const next = fn(cur); save(next); return next; }), []);

  const add = useCallback((p, qty = 1, { openDrawer = true, preview = false } = {}) => {
    commit((cur) => {
      const stockLimit = p.stock == null ? 50 : Math.min(50, Math.max(0, Number(p.stock) || 0));
      if (stockLimit < 1) return cur;
      const key = `${preview ? 'preview' : 'live'}:${p.id}`;
      const ex = cur.find((i) => keyOf(i) === key);
      if (ex) return cur.map((i) => (keyOf(i) === key ? { ...i, stock: stockLimit, qty: Math.min(stockLimit, i.qty + qty) } : i));
      return [...cur, { key, id: p.id, preview, slug: p.slug, title: p.title, price: Number(finalPrice(p)), stock: stockLimit, image: p.primary_image || p.images?.[0]?.image_path || null, qty: Math.min(stockLimit, qty) }];
    });
    if (openDrawer) setOpen(true);
  }, [commit]);
  const setQty = useCallback((target, q) => commit((cur) => (q <= 0
    ? cur.filter((i) => !matches(i, target))
    : cur.map((i) => (matches(i, target) ? { ...i, qty: Math.min(Math.min(Number(i.stock) || 50, 50), q) } : i)))), [commit]);
  const remove = useCallback((target) => commit((cur) => cur.filter((i) => !matches(i, target))), [commit]);
  const clear = useCallback(() => commit(() => []), [commit]);

  const value = useMemo(() => ({
    items, open, setOpen, add, setQty, remove, clear, ready,
    hasPreviewItems: items.some((item) => item.preview),
    count: items.reduce((n, i) => n + i.qty, 0),
    subtotal: Math.round(items.reduce((n, i) => n + quantityLineTotal(i.price, i.qty), 0) * 100) / 100,
  }), [items, open, add, setQty, remove, clear, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
