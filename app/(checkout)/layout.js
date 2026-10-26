import CartProvider from "@/components/CartProvider";

export const metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

// Standalone checkout: no site header/footer, just the checkout sheet.
export default function CheckoutLayout({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
