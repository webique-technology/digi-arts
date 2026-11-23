import { DM_Sans, Source_Serif_4 } from "next/font/google";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-admin-body",
  display: "swap",
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-admin-heading",
  display: "swap",
});

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }) {
  return <div className={`admin-root ${sans.variable} ${serif.variable}`}>{children}</div>;
}
