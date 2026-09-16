import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--bp-font-inter",
});

export const metadata: Metadata = {
  title: "Basal Pay — Home",
  description:
    "Basal Pay app revamp: Home V1 screen, rebuilt from the Figma design with Next.js and React.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#f2f3f8",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
