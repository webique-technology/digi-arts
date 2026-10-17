import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartProvider from '@/components/CartProvider';
import CartDrawer from '@/components/CartDrawer';
import JsonLd from '@/components/JsonLd';
import { WhatsappIcon } from '@/components/Icons';
import { SITE } from '@/lib/utils';
import { SITE_INFO } from '@/data/site';

export default function SiteLayout({ children }) {
  return (
    <CartProvider>
      <JsonLd data={{ '@context': 'https://schema.org', '@type': 'Organization', name: 'Damani', url: SITE }} />
      <div className="announcement">{SITE_INFO.announcement}</div>
      <Header />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      {SITE_INFO.whatsapp && <a className="whatsapp" href={SITE_INFO.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"><WhatsappIcon /></a>}
    </CartProvider>
  );
}
