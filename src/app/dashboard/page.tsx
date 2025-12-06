"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, profile, initialized, init } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      init();
    }
  }, [initialized, init]);

  useEffect(() => {
    if (!initialized) return;

    if (!user || !profile) {
      router.replace("/login");
      return;
    }

    if (profile.role === "alumna") {
      router.replace("/dashboard/alumna");
      return;
    }

    if (profile.role === "instructor") {
      // luego podemos mandarlo a /dashboard/instructor
      router.replace("/dashboard/classes");
      return;
    }

    // Admin
    router.replace("/dashboard/classes");
  }, [initialized, user, profile, router]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
      Redirigiendo a tu espacio…
    </div>
  );
}