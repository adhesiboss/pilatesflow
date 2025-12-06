"use client";

import { useAuthStore } from "@/lib/auth-store";

export function RoleBadge() {
  const { profile } = useAuthStore();

  if (!profile) return null;

  const roleLabel =
    profile.role === "admin"
      ? "Administrador/a"
      : profile.role === "instructor"
      ? "Instructor/a"
      : "Alumna";

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      {roleLabel}
    </span>
  );
}