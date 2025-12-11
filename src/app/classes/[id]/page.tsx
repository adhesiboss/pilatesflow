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
import { PlayCircle } from "lucide-react";
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

  const durationLabel = cls.duration_minutes
    ? `Duración aproximada: ${cls.duration_minutes} min`
    : "Duración aproximada 45–60 min";

  const hasVideo = !!cls.video_url;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="px-0 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/classes")}
        >
          ← Volver a clases
        </Button>

        <Card className="overflow-hidden border-emerald-50 shadow-sm">
          {/* Cabecera visual alineada con las cards de /classes */}
          <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 py-4 text-emerald-50">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.25em] opacity-80">
                  Clase guiada
                </p>
                <h1 className="text-2xl md:text-3xl font-semibold">
                  {cls.title}
                </h1>
                {createdAt && (
                  <p className="text-xs opacity-90">
                    Publicada el{" "}
                    <span className="font-medium">{createdAt}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-col items-start gap-2 md:items-end">
                <span className="inline-flex items-center rounded-full bg-emerald-100/90 px-3 py-0.5 text-[11px] font-medium text-emerald-800">
                  {cls.level}
                </span>

                {hasVideo && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-900/25 px-3 py-0.5 text-[11px] font-medium text-emerald-50">
                    <PlayCircle className="h-3 w-3" />
                    Video incluido
                  </span>
                )}

                {isAlumna && isCompleted && (
                  <span className="inline-flex items-center rounded-full bg-emerald-100/90 px-3 py-0.5 text-[11px] font-medium text-emerald-800">
                    ✅ Clase completada
                  </span>
                )}
              </div>
            </div>

            {hasVideo && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
                <PlayCircle className="h-16 w-16" />
              </div>
            )}
          </div>

          <CardContent className="grid gap-6 p-5 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
            {/* Columna principal: descripción */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold">
                Descripción de la clase
              </h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {cls.description ||
                  "Esta clase aún no tiene una descripción detallada."}
              </p>

              <div className="mt-4 space-y-1 text-[11px] text-muted-foreground">
                <p>
                  <span className="inline-block h-1 w-1 rounded-full bg-emerald-400 mr-2" />
                  {durationLabel}
                </p>
                {hasVideo && (
                  <p>
                    <span className="inline-block h-1 w-1 rounded-full bg-emerald-400 mr-2" />
                    Clase grabada lista para ver cuando quieras.
                  </p>
                )}
              </div>
            </section>

            {/* Columna lateral: acción / progreso */}
            <section className="space-y-3 rounded-lg border border-emerald-100 bg-emerald-50/50 p-4 text-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                Tu práctica
              </p>
              <p className="text-sm text-muted-foreground">
                Usa esta clase para moverte a tu ritmo. Si eres alumna
                registrada, puedes marcarla como completada para llevar un
                registro de tu progreso.
              </p>

              {isAlumna ? (
                <div className="space-y-2 pt-2">
                  <Button
                    size="sm"
                    variant={isCompleted ? "outline" : "default"}
                    disabled={isLoadingProgress}
                    className="w-full"
                    onClick={() => void handleToggleCompleted()}
                  >
                    {isCompleted
                      ? "Marcar como pendiente"
                      : "Marcar como completada"}
                  </Button>
                  {isCompleted && (
                    <p className="text-[11px] text-muted-foreground">
                      Esta clase ya figura como completada en tu progreso.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => router.push("/login")}
                  >
                    Inicia sesión para guardar tu progreso
                  </Button>
                  <p className="text-[11px] text-muted-foreground">
                    Al crear tu cuenta podrás marcar las clases que completes y
                    ver tu progreso a lo largo del tiempo.
                  </p>
                </div>
              )}
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}