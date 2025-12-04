"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAuthStore } from "@/lib/auth-store";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, loading, initialized, init } = useAuthStore();

  // Inicializar auth una vez
  useEffect(() => {
    init();
  }, [init]);

  // Cuando ya sabemos si hay user, si no hay → redirigir a /login
  useEffect(() => {
    if (!initialized || loading) return;

    if (!user) {
      const currentPath = window.location.pathname;
      const redirectParam = encodeURIComponent(currentPath);
      router.replace(`/login?from=${redirectParam}`);
    }
  }, [initialized, loading, user, router]);

  if (!initialized || loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Verificando sesión…
      </div>
    );
  }

  if (!user) {
    // Mientras se hace la redirección
    return null;
  }

  return <>{children}</>;
}