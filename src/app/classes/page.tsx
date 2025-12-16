// src/app/classes/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  useClassesStore,
  type ClassItem,
} from "@/lib/classes-store";
import { useAuthStore } from "@/lib/auth-store";

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
import { CalendarClock, PlayCircle } from "lucide-react";

function formatDateTime(start_at?: string | null): string {
  if (!start_at) return "";
  const date = new Date(start_at);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(created_at?: string | null): string {
  if (!created_at) return "";
  const date = new Date(created_at);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getDisciplineLabel(raw?: string | null) {
  if (!raw) return "Pilates";
  const key = raw.toLowerCase();
  const map: Record<string, string> = {
    mat: "Mat",
    reformer: "Reformer",
    suelo: "Suelo",
    embarazo: "Embarazo",
    postparto: "Postparto",
    recuperacion: "Recuperación",
    movilidad: "Movilidad",
    otra: "Pilates",
  };
  return map[key] ?? raw.charAt(0).toUpperCase() + raw.slice(1);
}

/**
 * Imagen por disciplina.
 * Los archivos deben estar en /public/images/pilates/...
 */
function getCardImageSrc(raw?: string | null): string {
  const key = raw?.toLowerCase() ?? "default";

  switch (key) {
    case "reformer":
      return "/images/pilates/reformer.jpg";
    case "embarazo":
      return "/images/pilates/embarazo.jpg";
    case "postparto":
      return "/images/pilates/postparto.jpg";
    case "movilidad":
      return "/images/pilates/movilidad.jpg";
    case "recuperacion":
      return "/images/pilates/recuperacion.jpg";
    case "mat":
    case "suelo":
      return "/images/pilates/mat.jpg";
    default:
      return "/images/pilates/default.jpg";
  }
}

export default function PublicClassesPage() {
  const router = useRouter();

  const classes = useClassesStore((state) => state.classes);
  const isLoading = useClassesStore((state) => state.isLoading);
  const fetchClasses = useClassesStore((state) => state.fetchClasses);

  // auth / rol
  const { profile, initialized: authInitialized, init } = useAuthStore();
  const role = profile?.role;

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("Todos");
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all");
  const [onlyWithVideo, setOnlyWithVideo] = useState(false);

  // inicializar auth-store (rol)
  useEffect(() => {
    if (!authInitialized) {
      void init();
    }
  }, [authInitialized, init]);

  // cargar clases
  useEffect(() => {
    void fetchClasses();
  }, [fetchClasses]);

  // disciplinas disponibles (para el <Select>)
  const availableDisciplines = useMemo(() => {
    const set = new Set<string>();
    classes.forEach((cls: ClassItem) => {
      if (cls.discipline) {
        set.add(String(cls.discipline));
      }
    });
    return Array.from(set);
  }, [classes]);

  const filteredClasses = useMemo(() => {
    const term = search.toLowerCase().trim();

    return classes.filter((cls: ClassItem) => {
      // 👇 NUEVO: solo mostramos publicadas (draft se ocultan del catálogo)
      const status = cls.status ?? "published";
      if (status !== "published") return false;

      const matchesLevel =
        levelFilter === "Todos" || cls.level === levelFilter;

      const matchesDiscipline =
        disciplineFilter === "all" ||
        (cls.discipline && cls.discipline === disciplineFilter);

      const searchableText =
        (cls.title ?? "") +
        " " +
        (cls.description ?? "") +
        " " +
        getDisciplineLabel(cls.discipline);
      const matchesSearch =
        term === "" || searchableText.toLowerCase().includes(term);

      const matchesVideo = !onlyWithVideo || !!cls.video_url;

      return matchesLevel && matchesDiscipline && matchesSearch && matchesVideo;
    });
  }, [classes, levelFilter, disciplineFilter, search, onlyWithVideo]);

  // CTA principal según rol
  function handlePrimaryAction(classId: string) {
    if (role === "alumna") {
      // la alumna va a su dashboard, donde reserva / ve progreso
      router.push("/dashboard/alumna");
      return;
    }

    if (role === "admin" || role === "instructor") {
      router.push(`/dashboard/classes/${classId}`);
      return;
    }

    router.push("/login");
  }

  function getPrimaryLabel() {
    if (role === "alumna") return "Ver en mi espacio de práctica";
    if (role === "admin" || role === "instructor") return "Ver en el dashboard";
    return "Iniciar sesión para practicar";
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 space-y-8">
        {/* Hero */}
        <section className="space-y-4 text-center md:text-left md:space-y-3">
          <p className="text-xs font-semibold tracking-[0.25em] text-emerald-500 uppercase">
            Clases de Pilates
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Explora las clases disponibles
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto md:mx-0">
            Clases guiadas para practicar desde casa o complementar tus
            sesiones presenciales: Mat, Reformer, embarazo, recuperación y más.
            Elige una sesión, presiona play y practica a tu ritmo.
          </p>
        </section>

        {/* Filtros */}
        <section className="space-y-3 md:space-y-0 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex flex-col gap-2">
            <Input
              placeholder="Buscar por nombre, enfoque o disciplina…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white"
            />

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

          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 w-full md:w-auto">
            <div className="w-full md:w-48">
              <Select
                value={disciplineFilter}
                onValueChange={(value) => setDisciplineFilter(value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Todas las disciplinas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las disciplinas</SelectItem>
                  {availableDisciplines.map((disc) => (
                    <SelectItem key={disc} value={disc}>
                      {getDisciplineLabel(disc)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full md:w-44">
              <Select
                value={levelFilter}
                onValueChange={(value) => setLevelFilter(value)}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Todos los niveles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos los niveles</SelectItem>
                  <SelectItem value="Básico">Básico</SelectItem>
                  <SelectItem value="Intermedio">Intermedio</SelectItem>
                  <SelectItem value="Avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Listado */}
        <section className="space-y-4">
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Cargando clases disponibles…
            </p>
          )}

          {!isLoading && filteredClasses.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Aún no hay clases con estos filtros. Prueba limpiar la búsqueda,
              cambiar el nivel o desactivar el filtro de video.
            </p>
          )}

          {!isLoading && filteredClasses.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground">
                Mostrando {filteredClasses.length} clase
                {filteredClasses.length === 1 ? "" : "s"}.
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredClasses.map((cls: ClassItem) => {
                  const disciplineLabel = getDisciplineLabel(cls.discipline);
                  const hasVideo = !!cls.video_url;

                  const scheduleLabel = cls.start_at
                    ? formatDateTime(cls.start_at)
                    : hasVideo
                    ? "On-demand"
                    : "";

                  const publishedAt = formatDateShort(cls.created_at);
                  const imageSrc = getCardImageSrc(cls.discipline);

                  return (
                    <Card
                      key={cls.id}
                      className="flex h-full flex-col overflow-hidden border-emerald-50 bg-white/95 transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {/* Imagen / header visual */}
                      <div className="relative h-40 w-full overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={`Clase de ${disciplineLabel}`}
                          fill
                          className="object-cover"
                          loading="lazy"
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                        {/* Chips sobre la imagen */}
                        <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center gap-1.5 text-[10px] font-medium">
                          {cls.level && (
                            <span className="inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-emerald-800">
                              {cls.level}
                            </span>
                          )}
                          {disciplineLabel && (
                            <span className="inline-flex items-center rounded-full bg-white/85 px-2 py-0.5 text-emerald-800">
                              {disciplineLabel}
                            </span>
                          )}
                          {scheduleLabel && (
                            <span className="inline-flex items-center rounded-full bg-emerald-900/80 px-2 py-0.5 text-emerald-50">
                              {scheduleLabel}
                            </span>
                          )}
                          {hasVideo && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-2 py-0.5 text-emerald-800">
                              <PlayCircle className="h-3 w-3" />
                              Video guiado
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Contenido */}
                      <CardContent className="mt-auto space-y-3 p-4 text-xs md:text-[13px]">
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold line-clamp-2">
                            {cls.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {cls.description ||
                              "Clase guiada para moverte con calma y consciencia desde donde estés."}
                          </p>
                        </div>

                        {/* Meta inferior */}
                        <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                          {publishedAt && (
                            <span className="inline-flex items-center gap-1">
                              <CalendarClock className="h-3 w-3" />
                              Publicada el{" "}
                              <span className="font-medium text-emerald-700">
                                {publishedAt}
                              </span>
                            </span>
                          )}
                          {hasVideo && (
                            <span className="hidden sm:inline text-right">
                              Ideal para practicar cuando tengas{" "}
                              <span className="font-medium">
                                20–30 minutos libres
                              </span>
                              .
                            </span>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handlePrimaryAction(cls.id)}
                        >
                          {getPrimaryLabel()}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-emerald-700"
                          onClick={() => router.push(`/classes/${cls.id}`)}
                        >
                          Ver detalles de la clase
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}