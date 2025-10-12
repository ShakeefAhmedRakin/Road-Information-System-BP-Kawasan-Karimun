import Providers from "@/components/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../index.css";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sistem-informasi-jalan-bp-kawasan-karimun",
  description: "sistem-informasi-jalan-bp-kawasan-karimun",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interFont.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
