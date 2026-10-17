import OrderSuccess from '@/components/OrderSuccess';
export const metadata = { title: 'Order placed', robots: { index: false } };
export default function OrderSuccessPage() {
  return <section className="section"><div className="container"><OrderSuccess /></div></section>;
}
