"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/auth-store";
import { supabase } from "@/lib/supabaseClient";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Plan = "free" | "activa";

function getRoleLabel(role: "admin" | "instructor" | "alumna" | undefined) {
  if (!role) return "";
  if (role === "admin") return "Administrador/a";
  if (role === "instructor") return "Instructor/a";
  return "Alumna";
}

function getPlanLabel(plan: Plan | null | undefined) {
  if (!plan || plan === "free") return "Free";
  if (plan === "activa") return "Activa";
  return plan;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, initialized, loading, init } = useAuthStore();

  // Aseguramos init del auth-store
  useEffect(() => {
    if (!initialized) {
      void init();
    }
  }, [initialized, init]);

  // Guard: requiere sesión
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
        Cargando tu perfil…
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const email = user.email ?? "";
  const role = profile?.role;
  const roleLabel = getRoleLabel(role);
  const plan = (profile?.plan ?? "free") as Plan;
  const planLabel = getPlanLabel(plan);

  async function handleChangePlan(nextPlan: Plan) {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ plan: nextPlan })
        .eq("id", user.id);

      if (error) {
        console.error("Error actualizando plan:", error.message);
        toast.error("No pudimos actualizar tu plan");
        return;
      }

      // Opción simple: avisar que recargue la página
      toast.success("Plan actualizado", {
        description:
          nextPlan === "activa"
            ? "Ahora estás en plan Activa. Tus límites de reservas ya aplican en la agenda. (Recarga si no ves el cambio al tiro)"
            : "Volviste al plan Free. Tus límites de reservas ya aplican en la agenda. (Recarga si no ves el cambio al tiro)",
      });

      // Si quisieras refrescar el store automáticamente:
      // await init();
    } catch (err) {
      console.error(err);
      toast.error("Ocurrió un error al actualizar tu plan");
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-500 uppercase">
          Mi perfil
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-semibold">
          Configuración de la cuenta
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Revisa tu rol dentro del estudio y el plan que tienes activo para
          reservar clases.
        </p>
      </div>

      <Card className="border-emerald-50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">
            Datos de la cuenta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Correo</Label>
            <p className="text-sm font-medium">{email}</p>
          </div>

          {/* Rol */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Rol</Label>
            <p className="inline-flex items-center gap-2 text-sm">
              <span className="font-medium">{roleLabel}</span>
              {role && (
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  {role}
                </span>
              )}
            </p>
          </div>

          {/* Plan */}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Plan</Label>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-sm">
                  <span className="font-medium">{planLabel}</span>
                  <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
                    {plan === "free" ? "Hasta 4 reservas activas" : "Hasta 12 reservas activas"}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Este plan determina cuántas reservas activas puedes tener en tu
                  agenda al mismo tiempo.
                </p>
              </div>

              {/* Controles de simulación de plan */}
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button
                  variant={plan === "free" ? "default" : "outline"}
                  size="sm"
                  onClick={() => void handleChangePlan("free")}
                >
                  Plan Free
                </Button>
                <Button
                  variant={plan === "activa" ? "default" : "outline"}
                  size="sm"
                  onClick={() => void handleChangePlan("activa")}
                >
                  Plan Activa
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-muted-foreground">
            Más adelante acá mismo podemos conectar el flujo real de pago
            (Stripe u otro) para que este cambio de plan sea automático.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}