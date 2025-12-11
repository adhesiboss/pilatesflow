"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, profile, initialized, loading, init } = useAuthStore();

  useEffect(() => {
    if (!initialized) {
      void init();
    }
  }, [initialized, init]);

  useEffect(() => {
    if (!initialized || loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!profile) {
      router.replace("/");
      return;
    }

    if (profile.role === "admin" || profile.role === "instructor") {
      router.replace("/dashboard/classes");
      return;
    }

    if (profile.role === "alumna") {
      router.replace("/dashboard/alumna");
      return;
    }

    router.replace("/");
  }, [initialized, loading, user, profile, router]);

  return (
    <div className="p-6 text-sm text-muted-foreground">
      Redirigiendo a tu panel…
    </div>
  );
}