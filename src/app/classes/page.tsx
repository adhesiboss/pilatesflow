"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useClassesStore } from "@/lib/classes-store";
import { useAuthStore } from "@/lib/auth-store";
import { useProgressStore } from "@/lib/progress-store";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function formatClassDateTime(start_at?: string | null): string {
  if (!start_at) return "Sin horario fijo";
  const date = new Date(start_at);
  if (Number.isNaN(date.getTime())) return "Sin horario fijo";

  return date.toLocaleString("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PublicClassesPage() {
  const classes = useClassesStore((state) => state.classes);
  const isLoading = useClassesStore((state) => state.isLoading);
  const fetchClasses = useClassesStore((state) => state.fetchClasses);

  const router = useRouter();

  // auth / rol / user
  const { user, profile, initialized, init } = useAuthStore();
  const role = profile?.role;
  const userEmail = user?.email ?? null;
  const isAlumna = role === "alumna";

  // progreso
  const {
    items: progressItems,
    isLoading: isLoadingProgress,
    fetchProgressForUser,
  } = useProgressStore();

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("Todos");
  const [onlyWithVideo, setOnlyWithVideo] = useState(false);

  // inicializar auth-store (para saber rol)
  useEffect(() => {
    if (!initialized) {
      void init();
    }
  }, [initialized, init]);

  // cargar clases
  useEffect(() => {
    void fetchClasses();
  }, [fetchClasses]);

  // cargar progreso solo si es alumna logueada
  useEffect(() => {
    if (!initialized) return;
    if (!userEmail) return;
    if (!isAlumna) return;

    void fetchProgressForUser(userEmail);
  }, [initialized, userEmail, isAlumna, fetchProgressForUser]);

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchesLevel =
        levelFilter === "Todos" || cls.level === levelFilter;

      const text = (cls.title + " " + (cls.description ?? "")).toLowerCase();
      const term = search.toLowerCase().trim();
      const matchesSearch = term === "" || text.includes(term);

      const matchesVideo = !onlyWithVideo || !!cls.video_url;

      return matchesLevel && matchesSearch && matchesVideo;
    });
  }, [classes, levelFilter, search, onlyWithVideo]);

  // set de clases completadas (solo si hay progreso)
  const completedClassIds = useMemo(() => {
    if (!progressItems || progressItems.length === 0) return new Set<string>();
    return new Set(progressItems.map((p) => p.classId));
  }, [progressItems]);

  const completedCount = progressItems?.length ?? 0;

  // qué hacer al apretar el botón principal de una card
  function handlePrimaryAction(classId: string) {
    // Alumna → a su agenda, donde reserva de verdad
    if (role === "alumna") {
      router.push("/dashboard/alumna");
      return;
    }

    // Admin / instructor → detalle de esa clase en el dashboard
    if (role === "admin" || role === "instructor") {
      router.push(`/dashboard/classes/${classId}`);
      return;
    }

    // Invitado / sin login → al login
    router.push("/login");
  }

  // texto del botón según rol
  function getPrimaryLabel() {
    if (role === "alumna") return "Reservar desde mi agenda";
    if (role === "admin" || role === "instructor") return "Ver en el dashboard";
    return "Iniciar sesión para reservar";
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 space-y-8">
        {/* Hero / encabezado */}
        <section className="space-y-4 text-center md:text-left md:space-y-3">
          <p className="text-xs font-semibold tracking-[0.25em] text-emerald-500 uppercase">
            Clases de Pilates
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Explora las clases disponibles
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto md:mx-0">
            Sesiones guiadas para practicar desde tu casa o el estudio. Filtra
            por nivel, encuentra tu ritmo y vuelve a repetir tus favoritas
            cuando quieras.
          </p>

          {/* Resumen de progreso solo para alumnas */}
          {isAlumna && !isLoadingProgress && (
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Has completado{" "}
              <span className="font-semibold">{completedCount}</span>{" "}
              {completedCount === 1 ? "clase" : "clases"} de este catálogo.
            </div>
          )}
        </section>

        {/* Filtros */}
        <section className="space-y-3 md:space-y-0 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex flex-col gap-2">
            <Input
              placeholder="Buscar por nombre de clase o enfoque…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white"
            />

            {/* Filtro de solo clases con video */}
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyWithVideo}
                onChange={(e) => setOnlyWithVideo(e.target.checked)}
                className="h-3 w-3 rounded border border-emerald-300 accent-emerald-500"
              />
              <span>Mostrar solo clases que incluyen video grabado</span>
            </label>
          </div>

          <div className="w-full md:w-52">
            <Select
              value={levelFilter}
              onValueChange={(value) => setLevelFilter(value)}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Filtrar por nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos los niveles</SelectItem>
                <SelectItem value="Básico">Básico</SelectItem>
                <SelectItem value="Intermedio">Intermedio</SelectItem>
                <SelectItem value="Avanzado">Avanzado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Contenido */}
        <section className="space-y-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Cargando clases disponibles…
            </p>
          )}

          {!isLoading && filteredClasses.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aún no hay clases disponibles con estos filtros. Prueba limpiar la
              búsqueda, cambiar el nivel o desactivar el filtro de video.
            </p>
          )}

          {!isLoading && filteredClasses.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((cls) => {
                const hasSchedule = !!cls.start_at;
                const isCompleted = completedClassIds.has(cls.id);

                return (
                  <Card
                    key={cls.id}
                    className="flex flex-col overflow-hidden border-emerald-50 bg-white transition hover:shadow-md hover:-translate-y-0.5"
                  >
                    {/* Cabecera visual */}
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-3 text-emerald-50">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] opacity-80">
                            Clase guiada
                          </p>
                          <h3 className="mt-1 text-sm font-semibold line-clamp-2">
                            {cls.title}
                          </h3>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="inline-flex items-center rounded-full bg-emerald-100/90 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                            {cls.level}
                          </span>
                          {cls.video_url && (
                            <span className="inline-flex items-center rounded-full bg-emerald-900/30 px-2 py-0.5 text-[9px] font-medium text-emerald-50 border border-emerald-100">
                              🎥 Video incluido
                            </span>
                          )}
                          {isAlumna && isCompleted && (
                            <span className="inline-flex items-center rounded-full bg-emerald-50/95 px-2 py-0.5 text-[9px] font-medium text-emerald-800 border border-emerald-200">
                              ✅ Completada
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <CardContent className="mt-auto space-y-3 p-4 text-xs md:text-sm">
                      <p className="text-muted-foreground line-clamp-3">
                        {cls.description || "Clase de Pilates sin descripción."}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                        <span>
                          {hasSchedule ? "Próximo horario:" : "Modalidad:"}{" "}
                          <span className="font-semibold text-emerald-700">
                            {hasSchedule
                              ? formatClassDateTime(cls.start_at)
                              : "On-demand / sin horario fijo"}
                          </span>
                        </span>
                      </div>

                      <div className="pt-1 space-y-2">
                        <Button
                          variant="default"
                          size="sm"
                          className="w-full"
                          onClick={() => handlePrimaryAction(cls.id)}
                        >
                          {getPrimaryLabel()}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-xs text-emerald-700"
                          onClick={() => router.push(`/classes/${cls.id}`)}
                        >
                          Ver detalles de la clase
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}