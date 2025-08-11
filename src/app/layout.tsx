import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DendyFood - Food Delivery",
  description: "Modern food delivery service with delicious burgers, hotdogs, and more. Order online for fast delivery to your doorstep.",
  keywords: ["DendyFood", "food delivery", "burger", "hotdog", "delivery service", "Uzbekistan food"],
  openGraph: {
    title: "DendyFood - Food Delivery",
    description: "Order delicious food online with fast delivery",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DendyFood - Food Delivery",
    description: "Order delicious food online with fast delivery",
  },
  icons: {
    icon: "/dendyfood-logo.png",
    apple: "/dendyfood-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
