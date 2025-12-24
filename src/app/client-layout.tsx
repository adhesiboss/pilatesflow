// src/app/client-layout.tsx
"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner";

// Navbar solo en cliente (sin SSR) para evitar hydration error de Radix
const Navbar = dynamic(() => import("@/components/navbar"), {
  ssr: false,
});

export function ClientLayout({ children }: { children: ReactNode }) {
  // Ocultar el botón de Next.js Dev Tools en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const hideBadge = () => {
      const badgeRoot =
        document.querySelector<HTMLElement>("[data-next-badge-root]");
      const badgeButton =
        document.querySelector<HTMLElement>("[data-nextjs-dev-tools-button]");
      const nextLogo = document.querySelector<HTMLElement>("#next-logo");

      if (badgeRoot) badgeRoot.style.display = "none";
      if (badgeButton) badgeButton.style.display = "none";
      if (nextLogo) nextLogo.style.display = "none";
    };

    hideBadge();

    // Por si Next lo vuelve a insertar, lo escondemos cada cierto tiempo
    const intervalId = window.setInterval(hideBadge, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
      <Toaster />
    </>
  );
}