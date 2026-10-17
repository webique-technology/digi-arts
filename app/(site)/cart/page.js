import CartView from '@/components/CartView';
export const metadata = { title: 'Your cart', robots: { index: false } };
export default function CartPage() {
  return <section className="section"><div className="container"><h1 className="pagetitle">Your cart</h1><CartView /></div></section>;
}
