import { Inter, Playfair_Display } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.scss";
import { SITE } from "@/lib/utils";

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const heading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(SITE || "http://localhost:3000"),
  title: {
    default: "Digi Art’s Store | Handcrafted gifting, décor & stationery",
    template: "%s | Digi Art’s Store",
  },
  description:
    "Handcrafted gift bags, boxes, décor and stationery, made with love in Jaipur.",
  openGraph: { siteName: "Digi Art’s Store", type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
