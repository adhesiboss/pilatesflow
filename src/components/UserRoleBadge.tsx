// src/components/UserRoleBadge.tsx
'use client';

import { useAuthStore } from '@/lib/auth-store';

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  instructor: 'Instructor',
  alumna: 'Alumna',
};

export function UserRoleBadge() {
  const profile = useAuthStore((s) => s.profile);

  if (!profile?.role) return null;

  const label = ROLE_LABELS[profile.role] ?? profile.role;

  return (
    <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-neutral-700">
      {label}
    </span>
  );
}