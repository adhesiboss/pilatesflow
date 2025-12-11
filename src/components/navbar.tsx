"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Menu, LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/lib/auth-store";

type Role = "admin" | "instructor" | "alumna";
type Plan = "free" | "activa";

function getInitials(email: string | null): string {
  if (!email) return "?";
  const [namePart] = email.split("@");
  if (!namePart) return "?";
  return namePart.slice(0, 2).toUpperCase();
}

function getRoleLabel(role: Role | undefined) {
  if (!role) return "";
  if (role === "admin") return "Administrador/a";
  if (role === "instructor") return "Instructor/a";
  return "Alumna";
}

function getPlanLabel(plan: Plan | null | undefined) {
  if (!plan || plan === "free") return "Plan Free";
  if (plan === "activa") return "Plan Activa";
  return `Plan ${plan}`;
}

export default function Navbar() {
  const { user, profile, signOut, init, initialized } = useAuthStore();

  // Nos aseguramos de que el store se inicialice también en rutas públicas
  useEffect(() => {
    void init();
  }, [init]);

  const userEmail = user?.email ?? null;
  const shortEmail =
    userEmail && userEmail.length > 24
      ? `${userEmail.slice(0, 21)}…`
      : userEmail;

  const roleLabel = getRoleLabel(profile?.role as Role | undefined);
  const plan = (profile?.plan ?? "free") as Plan;
  const planLabel = getPlanLabel(plan);

  return (
    <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-emerald-500">
            Pilates
          </span>
          <span className="text-sm font-medium">Flow</span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-3 text-sm md:flex">
          <Link
            href="/classes"
            className="text-xs md:text-sm text-muted-foreground hover:text-foreground"
          >
            Explorar clases
          </Link>

          {initialized && user ? (
            <>
              {/* 🔁 AQUÍ CAMBIAMOS: ahora va a /dashboard (router decide por rol) */}
              <Link
                href="/dashboard"
                className="text-xs md:text-sm text-muted-foreground hover:text-foreground"
              >
                Dashboard
              </Link>

              {/* Chip usuario + rol + plan */}
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs text-muted-foreground hover:border-emerald-300 hover:text-emerald-700"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-700">
                  {getInitials(userEmail)}
                </span>
                <div className="flex flex-col leading-tight">
                  <span className="hidden sm:inline">{shortEmail}</span>
                  {roleLabel && (
                    <span className="text-[10px] font-semibold text-emerald-700">
                      {roleLabel}
                    </span>
                  )}
                  {planLabel && (
                    <span className="text-[10px] text-sky-700">
                      {planLabel}
                    </span>
                  )}
                </div>
              </Link>

              <Button
                variant="outline"
                size="icon"
                aria-label="Cerrar sesión"
                onClick={() => void signOut()}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="text-xs">
              <Link href="/login">Iniciar sesión</Link>
            </Button>
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir menú">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="mb-4">
                <SheetTitle>PilatesFlow</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-3 text-sm">
                <Link
                  href="/classes"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Explorar clases
                </Link>

                {initialized && user ? (
                  <>
                    {/* 🔁 AQUÍ TAMBIÉN CAMBIAMOS A /dashboard */}
                    <Link
                      href="/dashboard"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Dashboard
                    </Link>

                    {/* Chip usuario + rol + plan (mobile) */}
                    <Link
                      href="/dashboard/profile"
                      className="inline-flex items-center gap-3 rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:border-emerald-300 hover:text-emerald-700"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-700">
                        {getInitials(userEmail)}
                      </span>
                      <div className="flex flex-col leading-tight">
                        <span>{shortEmail}</span>
                        {roleLabel && (
                          <span className="text-[11px] font-semibold text-emerald-700">
                            {roleLabel}
                          </span>
                        )}
                        {planLabel && (
                          <span className="text-[11px] text-sky-700">
                            {planLabel}
                          </span>
                        )}
                      </div>
                    </Link>

                    <Button
                      variant="outline"
                      className="mt-2 inline-flex items-center gap-2"
                      onClick={() => void signOut()}
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </Button>
                  </>
                ) : (
                  <Button asChild className="mt-2">
                    <Link href="/login">Iniciar sesión</Link>
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}