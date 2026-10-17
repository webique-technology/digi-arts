import Link from 'next/link';
import { TEST_IDS } from './testIds';

export default function Pagination({ page = 1, pages = 1, params = {}, basePath = '/products' }) {
  if (pages <= 1) return null;
  const href = (n) => {
    const p = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v && k !== 'page' && typeof v === 'string') p.set(k, v); });
    if (n > 1) p.set('page', String(n));
    const s = p.toString();
    return s ? `${basePath}?${s}` : basePath;
  };
  const nums = [];
  for (let n = 1; n <= pages; n++) if (n === 1 || n === pages || Math.abs(n - page) <= 1) nums.push(n);
  const items = [];
  nums.forEach((n, idx) => { if (idx && n - nums[idx - 1] > 1) items.push('gap' + n); items.push(n); });

  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 && <Link href={href(page - 1)} rel="prev" className="pagination__step">Previous</Link>}
      {items.map((n) => typeof n === 'string'
        ? <span key={n} className="is-gap">…</span>
        : n === page ? <span key={n} className="is-current" aria-current="page">{n}</span>
        : <Link key={n} href={href(n)} data-testid={TEST_IDS.collectionPagination(n)}>{n}</Link>)}
      {page < pages && <Link href={href(page + 1)} rel="next" className="pagination__step">Next</Link>}
    </nav>
  );
}
