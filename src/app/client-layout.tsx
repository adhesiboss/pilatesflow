"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner";

// 👇 Navbar solo en cliente (sin SSR) para evitar hydration error de Radix
const Navbar = dynamic(() => import("@/components/navbar"), {
  ssr: false,
});

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
      <Toaster />
    </>
  );
}