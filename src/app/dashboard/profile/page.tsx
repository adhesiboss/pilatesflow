"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getRoleLabel(role: "admin" | "instructor" | "alumna" | undefined) {
  if (!role) return "Sin rol";
  if (role === "admin") return "Administrador/a";
  if (role === "instructor") return "Instructor/a";
  return "Alumna";
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile } = useAuthStore();

  if (!user) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Sesión no encontrada</CardTitle>
            <CardDescription>
              Inicia sesión nuevamente para ver tu perfil.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/login")}>
              Ir a iniciar sesión
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const createdAt =
    user.created_at &&
    new Date(user.created_at).toLocaleString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const roleText = getRoleLabel(profile?.role);

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      <Button
        variant="ghost"
        className="px-0 text-xs text-muted-foreground hover:text-foreground"
        onClick={() => router.push("/dashboard/classes")}
      >
        ← Volver al dashboard
      </Button>

      <Card className="border-emerald-50 shadow-sm">
        <CardHeader>
          <CardTitle>Mi perfil</CardTitle>
          <CardDescription>
            Información básica de tu cuenta en PilatesFlow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              Correo
            </p>
            <p className="mt-1 text-base">{user.email}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              Rol en la plataforma
            </p>
            <p className="mt-1 inline-flex items-center gap-2 text-sm">
              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                {roleText}
              </span>
              {profile?.role && (
                <span className="text-[11px] text-muted-foreground">
                  ({profile.role})
                </span>
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              ID de usuario
            </p>
            <p className="mt-1 break-all text-[12px] text-muted-foreground">
              {user.id}
            </p>
          </div>

          {createdAt && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground">
                Cuenta creada
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}