// "Rs. 349.00" like the reference site
export const formatPrice = (n) =>
  `Rs. ${(Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const stripHtml = (s = '') => String(s).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
export const truncate = (s = '', n = 160) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
export const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
export const isOnSale = (p) => p.sale_price != null && Number(p.sale_price) < Number(p.price);
export const finalPrice = (p) => (isOnSale(p) ? p.sale_price : p.price);
export const BULK_PRICE_TIERS = [
  { qty: 1, discount: 0, label: '1 Set', note: 'Standard price' },
  { qty: 5, discount: 5, label: '5 Sets', note: 'Save 5%' },
  { qty: 10, discount: 10, label: '10 Sets', note: 'Save 10%' },
  { qty: 30, discount: 20, label: '30 Sets', note: 'Save 20%' },
  { qty: 50, discount: 25, label: '50 Sets', note: 'Save 25%' },
];
export const quantityDiscount = (qty) =>
  BULK_PRICE_TIERS.reduce((active, tier) => (qty >= tier.qty ? tier.discount : active), 0);
export const quantityUnitPrice = (price, qty) =>
  Math.round((Number(price) || 0) * (100 - quantityDiscount(qty)) / 100 * 100) / 100;
export const quantityLineTotal = (price, qty) =>
  Math.round(quantityUnitPrice(price, qty) * qty * 100) / 100;

// Shipping rule (the server is the source of truth, this is only for display)
export const FREE_SHIPPING_ABOVE = 999;
export const SHIPPING_FLAT = 80;
export const shippingFor = (subtotal) => (subtotal >= FREE_SHIPPING_ABOVE || subtotal === 0 ? 0 : SHIPPING_FLAT);
export const onlyDigits = (s = '') => String(s).replace(/\D/g, '');

// "₹1,999" (no decimals when whole) used in the checkout sheet
export const rupee = (n) => {
  const v = Number(n) || 0;
  return `₹${v.toLocaleString('en-IN', { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 })}`;
};
