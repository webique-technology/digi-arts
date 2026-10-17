import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PAGES } from '@/data/pages';

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(PAGES).map((slug) => ({ slug }));

export function generateMetadata({ params }) {
  const p = PAGES[params.slug];
  return p ? { title: p.title, alternates: { canonical: `/pages/${params.slug}` } } : {};
}

export default function InfoPage({ params }) {
  const p = PAGES[params.slug];
  if (!p) notFound();
  return (
    <>
      <section className="page-head"><div className="container"><h1>{p.title}</h1></div></section>
      <section className="section"><div className="container prose">
        {p.body?.map((t, i) => <p key={i}>{t}</p>)}
        {p.faqs && <div className="faq">{p.faqs.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>}
        {(params.slug === 'bulk-orders' || params.slug === 'collaborate' || params.slug === 'partner') && <p><Link href="/contact" className="btn">Contact us</Link></p>}
      </div></section>
    </>
  );
}
