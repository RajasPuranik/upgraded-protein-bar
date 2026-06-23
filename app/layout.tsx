import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import "./globals.css";

import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: "FuelBar | 25% Whey Protein Bars",
  description:
    "FuelBar protein bars with 25% complete whey, zero added refined sugar, natural sweeteners, and pan-India delivery.",
  openGraph: {
    title: "FuelBar | Zero Sugar Whey Protein Bars",
    description: "Premium whey protein bars with zero added sugar.",
    url: "https://fuelbar.in", // Replace with real domain
    siteName: "FuelBar",
    images: [
      {
        url: "/og-image.jpg", // Create this image in public/og-image.jpg
        width: 1200,
        height: 630,
        alt: "FuelBar Products"
      }
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FuelBar | Zero Sugar Whey Protein Bars",
    description: "Premium whey protein bars with zero added sugar.",
    images: ["/og-image.jpg"],
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  );
}
