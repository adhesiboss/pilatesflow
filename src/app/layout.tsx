import "./globals.css";
import type { Metadata } from "next";
import { ClientLayout } from "./client-layout";

export const metadata: Metadata = {
  title: "PilatesFlow",
  description: "Plataforma de clases de Pilates",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-neutral-900">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}