import type { Metadata } from "next";
import { Hanken_Grotesk, Figtree, Spectral, Unbounded } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-figtree",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-hanken",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-unbounded",
});

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://kingdomcultureacademy.com").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "Kingdom Culture Academy",
  description:
    "A 10-week journey into the Culture of Heaven on Earth — lessons, quizzes, badges, and a certificate of completion.",
  openGraph: {
    title: "Kingdom Culture Academy",
    description: "A 10-week journey into the Culture of Heaven on Earth.",
    url: APP_URL,
    siteName: "Kingdom Culture Academy",
    images: [{ url: "/images/hero.jpg", width: 1200, height: 800, alt: "Kingdom Culture Academy" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kingdom Culture Academy",
    description: "A 10-week journey into the Culture of Heaven on Earth.",
    images: ["/images/hero.jpg"],
  },
};

export const viewport = {
  themeColor: "#123b36",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} ${spectral.variable} ${unbounded.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
