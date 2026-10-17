import { Assistant, Nunito } from 'next/font/google';
import '@/styles/globals.scss';
import { SITE } from '@/lib/utils';

const body = Assistant({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const heading = Nunito({ subsets: ['latin'], variable: '--font-heading', display: 'swap' });

export const metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'Damani | Handcrafted gifting, décor & stationery', template: '%s | Damani' },
  description: 'Handcrafted gift bags, boxes, décor and stationery, made with love in Jaipur.',
  openGraph: { siteName: 'Damani', type: 'website' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
