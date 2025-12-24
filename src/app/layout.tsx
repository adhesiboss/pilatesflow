import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/lib/cart-store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PilatesFlow · Aksaya Studio",
  description: "Prototipo de estudio digital de Pilates para Aksaya.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`min-h-screen bg-white text-neutral-900 ${inter.className}`}
      >
        <CartProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}