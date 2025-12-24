// src/components/Navbar.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  LogOut,
  PlayCircle,
  Info,
  Shield,
  LayoutDashboard,
  MoonStar,
  ShoppingBag, // 👈 NUEVO
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/lib/auth-store";
import { useCart } from "@/lib/cart-store"; // 👈 NUEVO

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
  const { totalItems } = useCart(); // 👈 carrito

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
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo / marca */}
        <Link href="/" className="flex items-center gap-2 group">
          {/* Marca inicial redonda */}
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 text-[11px] font-semibold text-emerald-50 shadow-sm ring-2 ring-emerald-100 group-hover:scale-105 transition-transform">
            PF
          </div>

          {/* Texto marca + dedicatoria */}
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-neutral-900 group-hover:text-emerald-700 transition-colors">
              PILATES{" "}
              <span className="text-emerald-600">
                FLOW
              </span>
            </span>
            <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-emerald-50/90 px-2 py-[2px] text-[9px] font-medium text-emerald-800 border border-emerald-100/80">
              <MoonStar className="h-2.5 w-2.5 text-emerald-500" />
              aksaya studio · práctica interior
            </span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-4 text-sm md:flex">
          <Link
            href="/classes"
            className="text-xs md:text-sm text-muted-foreground hover:text-emerald-800"
          >
            Explorar clases
          </Link>

          <Link
            href="/estudio"
            className="text-xs md:text-sm text-muted-foreground hover:text-emerald-800"
          >
            Estudio
          </Link>

          <Link
            href="/aviso"
            className="text-xs md:text-sm text-muted-foreground hover:text-emerald-800"
          >
            Aviso
          </Link>

          {/* 👇 NUEVO: link a productos */}
          <Link
            href="/products"
            className="text-xs md:text-sm text-muted-foreground hover:text-emerald-800"
          >
            Productos
          </Link>

          {/* 👇 NUEVO: botón carrito */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-white px-2.5 py-1 text-xs text-neutral-800 hover:border-emerald-300 hover:text-emerald-800"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Carrito</span>
            {totalItems > 0 && (
              <span className="ml-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-600 px-1 text-[10px] font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {initialized && user ? (
            <>
              <Link
                href="/dashboard/classes"
                className="text-xs md:text-sm text-muted-foreground hover:text-emerald-800"
              >
                Dashboard
              </Link>

              {/* Chip usuario + rol + plan */}
              <Link
                href="/dashboard/profile"
                className="inline-flex items-center gap-2 rounded-full border px-2 py-1 text-xs text-muted-foreground hover:border-emerald-300 hover:text-emerald-700"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-semibold text-emerald-700">
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

        {/* Mobile / Menú hamburguesa */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir menú">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[280px] sm:w-[320px] border-l bg-white/95 px-4 py-4"
            >
              <div className="flex h-full flex-col">
                {/* Header sheet */}
                <SheetHeader className="mb-3 border-b pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 text-[11px] font-semibold text-emerald-50 shadow-sm">
                      PF
                    </div>
                    <div className="flex flex-col leading-tight">
                      <SheetTitle className="text-sm font-semibold tracking-[0.18em] uppercase text-neutral-900">
                        Pilates<span className="text-emerald-600">Flow</span>
                      </SheetTitle>
                      <span className="flex items-center gap-1 text-[10px] text-emerald-700">
                        <MoonStar className="h-3 w-3" />
                        movimiento suave · respiración presente
                      </span>
                    </div>
                  </div>
                </SheetHeader>

                {/* Usuario (si está logueado) */}
                {initialized && user && (
                  <div className="mb-4 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-emerald-50 to-violet-50 p-3 flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 text-[11px] font-semibold text-emerald-50">
                      {getInitials(userEmail)}
                    </span>
                    <div className="flex flex-col leading-tight text-xs">
                      <span className="font-medium text-neutral-900">
                        {shortEmail}
                      </span>
                      {roleLabel && (
                        <span className="text-[11px] text-emerald-800">
                          {roleLabel}
                        </span>
                      )}
                      {planLabel && (
                        <span className="text-[11px] text-sky-700">
                          {planLabel}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Navegación */}
                <nav className="flex-1 space-y-1 text-sm">
                  <Link
                    href="/classes"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-neutral-800 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <span className="flex items-center gap-2">
                      <PlayCircle className="h-4 w-4" />
                      Explorar clases
                    </span>
                  </Link>

                  <Link
                    href="/estudio"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-neutral-800 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <span className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Estudio
                    </span>
                  </Link>

                  <Link
                    href="/aviso"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-neutral-800 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Aviso
                    </span>
                  </Link>

                  {/* NUEVO: Productos */}
                  <Link
                    href="/products"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-neutral-800 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Productos
                    </span>
                  </Link>

                  {/* NUEVO: Carrito con contador */}
                  <Link
                    href="/cart"
                    className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-neutral-800 hover:bg-emerald-50 hover:text-emerald-800"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Carrito
                    </span>
                    {totalItems > 0 && (
                      <span className="inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-emerald-600 px-1 text-[11px] font-semibold text-white">
                        {totalItems}
                      </span>
                    )}
                  </Link>

                  {initialized && user && (
                    <Link
                      href="/dashboard/classes"
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-neutral-800 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                      <span className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </span>
                    </Link>
                  )}
                </nav>

                {/* Footer acciones */}
                <div className="mt-4 border-t pt-4">
                  {initialized && user ? (
                    <Button
                      variant="outline"
                      className="w-full inline-flex items-center justify-center gap-2 text-sm border-emerald-200 hover:border-emerald-300"
                      onClick={() => void signOut()}
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full inline-flex items-center justify-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Link href="/login">Iniciar sesión</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}