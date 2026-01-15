import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* =========================
   Layout Components
   ========================= */
import Navigation from "./components/layout/Navigation";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

/* =========================
   Fonts (se mantienen)
   ========================= */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* =========================
   Metadata
   ========================= */
export const metadata: Metadata = {
  title: "MIR Dental Care (Demo)",
  description: "Frontend demo para MIR Dental Care",
};

/* =========================
   Root Layout
   ========================= */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
