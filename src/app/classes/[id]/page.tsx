// src/app/classes/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  useClassesStore,
  type ClassItem,
} from "@/lib/classes-store";
import { supabase } from "@/lib/supabaseClient";

import { useAuthStore } from "@/lib/auth-store";
import { useProgressStore } from "@/lib/progress-store";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PublicClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params as { id: string }).id;

  const classes = useClassesStore((state) => state.classes);

  const [cls, setCls] = useState<ClassItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // auth
  const { user, profile, initialized, init } = useAuthStore();
  const userEmail = user?.email ?? null;
  const isAlumna = profile?.role === "alumna";

  // progreso
  const {
    items: progressItems,
    isLoading: isLoadingProgress,
    fetchProgressForUser,
    toggleCompleted,
  } = useProgressStore();

  // init auth
  useEffect(() => {
    if (!initialized) {
      void init();
    }
  }, [initialized, init]);

  // cargar clase (store → Supabase)
  useEffect(() => {
    async function load() {
      if (!id) return;
      setIsLoading(true);

      const fromStore = classes.find((c) => c.id === id);
      if (fromStore) {
        setCls(fromStore);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error cargando clase pública:", error);
        setCls(null);
      } else {
        setCls(data as ClassItem);
      }
      setIsLoading(false);
    }

    void load();
  }, [classes, id]);

  // cargar progreso de la alumna
  useEffect(() => {
    if (!userEmail) return;
    void fetchProgressForUser(userEmail);
  }, [userEmail, fetchProgressForUser]);

  // ¿esta clase está marcada como completada?
  const isCompleted = useMemo(() => {
    if (!id) return false;
    return progressItems.some((p) => p.classId === id);
  }, [progressItems, id]);

  async function handleToggleCompleted() {
    if (!userEmail || !isAlumna) {
      toast.error("Debes iniciar sesión como alumna para guardar tu progreso.");
      router.push("/login");
      return;
    }

    const result = await toggleCompleted(id, userEmail);

    if (result === "completed") {
      toast.success("Clase marcada como completada ✨", {
        description: "Puedes volver cuando quieras para repetirla.",
      });
    } else if (result === "removed") {
      toast("Progreso actualizado", {
        description: "Esta clase vuelve a quedar como pendiente.",
      });
    } else {
      toast.error("No pudimos actualizar tu progreso", {
        description: "Inténtalo nuevamente en unos minutos.",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/40 to-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <p className="text-sm text-muted-foreground">
            Cargando detalles de la clase…
          </p>
        </div>
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/40 to-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <Card>
            <CardHeader>
              <CardTitle>Clase no encontrada</CardTitle>
              <CardDescription>
                Es posible que esta clase haya sido eliminada o que el enlace no
                sea válido.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/classes")}>
                Volver al listado de clases
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const createdAt = cls.created_at
    ? new Date(cls.created_at).toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const disciplineLabel =
    cls.discipline && cls.discipline.trim().length > 0
      ? cls.discipline
      : "Disciplina general";

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="px-0 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/classes")}
        >
          ← Volver a clases
        </Button>

        <Card className="border-emerald-50 shadow-sm">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-2xl md:text-3xl">
                  {cls.title}
                </CardTitle>

                {/* Nivel + disciplina */}
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                    Nivel: {cls.level}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 font-medium text-sky-700">
                    Disciplina: {disciplineLabel}
                  </span>
                </div>

                {createdAt && (
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Publicada el{" "}
                    <span className="font-medium">{createdAt}</span>
                  </p>
                )}
              </div>

              {/* Badge si está completada */}
              {isAlumna && isCompleted && (
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700">
                  ✅ Clase completada
                </span>
              )}
            </div>

            <CardDescription>
              Clase de Pilates guiada, pensada para que puedas moverte con calma
              y consciencia desde donde estés.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <section className="space-y-1">
              <h2 className="text-sm font-semibold">Descripción de la clase</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {cls.description || "Esta clase aún no tiene una descripción."}
              </p>
            </section>

            {/* Botón de progreso solo para alumnas logueadas */}
            {isAlumna && (
              <section className="pt-2">
                <Button
                  size="sm"
                  variant={isCompleted ? "outline" : "default"}
                  disabled={isLoadingProgress}
                  onClick={() => void handleToggleCompleted()}
                >
                  {isCompleted
                    ? "Marcar como pendiente"
                    : "Marcar como completada"}
                </Button>
                {isCompleted && (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Esta clase ya figura como completada en tu progreso.
                  </p>
                )}
              </section>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}