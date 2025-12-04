"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard/classes";

  const { user, loading, signIn, signUp, init } = useAuthStore();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // Aseguramos que auth store esté inicializado
  useEffect(() => {
    init();
  }, [init]);

  // Si ya hay user logueado, redirigimos al dashboard
  useEffect(() => {
    if (user) {
      router.replace(from);
    }
  }, [user, router, from]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Ingresa un correo y una contraseña.");
      return;
    }

    if (mode === "login") {
      const { ok, error } = await signIn(email, password);
      if (!ok && error) {
        setLocalError(error);
        return;
      }
      router.replace(from);
    } else {
      const { ok, error } = await signUp(email, password);
      if (!ok && error) {
        setLocalError(error);
        return;
      }
      // En Supabase por defecto se envía email de confirmación.
      // Puedes ajustar esto en la consola de Supabase.
      setLocalError(
        "Cuenta creada. Revisa tu correo para confirmar el registro (según la configuración de Supabase)."
      );
      setMode("login");
    }
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/50 to-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-emerald-50 shadow-sm">
        <CardHeader>
          <p className="text-xs font-semibold tracking-[0.25em] text-emerald-500 uppercase">
            PilatesFlow Studio
          </p>
          <CardTitle className="mt-1 text-2xl">
            {mode === "login" ? "Inicia sesión" : "Crea tu cuenta"}
          </CardTitle>
          <CardDescription>
            Usa tu correo para acceder al dashboard donde gestionas tus clases
            de Pilates.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@estudio.cl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            {localError && (
              <p className="text-xs text-red-600">{localError}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Procesando…"
                : mode === "login"
                ? "Entrar al dashboard"
                : "Crear cuenta"}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            {mode === "login" ? (
              <>
                ¿Aún no tienes cuenta?{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => setMode("signup")}
                >
                  Crear una cuenta
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => setMode("login")}
                >
                  Iniciar sesión
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}