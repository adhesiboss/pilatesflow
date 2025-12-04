import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";

import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "PilatesFlow",
  description: "Plataforma de clases de Pilates para estudios e instructoras.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-neutral-900">
        <Navbar />
        <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        <Toaster />
      </body>
    </html>
  );
}