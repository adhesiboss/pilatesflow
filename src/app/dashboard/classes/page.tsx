// src/app/dashboard/classes/page.tsx
"use client";

import { useEffect, useMemo, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/auth-store";
import {
  useClassesStore,
  type ClassItem,
  type NewClassInput,
} from "@/lib/classes-store";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  CalendarClock,
  Film,
  Filter,
  ListChecks,
  Plus,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

type Role = "admin" | "instructor" | "alumna";

// estado temporal (próxima / pasada / on-demand)
type ClassStatus = "upcoming" | "past" | "ondemand";

// estado de publicación en la BD
type PublishStatus = "draft" | "published";

type SortOrder = "start_asc" | "start_desc" | "created_desc";

function getRoleLabel(role?: Role | null) {
  if (!role) return "";
  if (role === "admin") return "Administradora";
  if (role === "instructor") return "Instructora";
  return "Alumna";
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

function formatClassDateTime(start_at?: string | null): string {
  if (!start_at) return "Sin horario";
  const d = new Date(start_at);
  if (Number.isNaN(d.getTime())) return "Sin horario";
  return d.toLocaleString("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(dateString?: string | null): string {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// status “virtual” según fecha / video
function getClassStatus(cls: ClassItem): ClassStatus {
  if (!cls.start_at && cls.video_url) return "ondemand";
  if (!cls.start_at) return "upcoming";

  const now = new Date();
  const start = new Date(cls.start_at);
  if (Number.isNaN(start.getTime())) return "upcoming";

  return start >= now ? "upcoming" : "past";
}

export default function DashboardClassesPage() {
  const router = useRouter();

  const { user, profile, initialized, init } = useAuthStore();
  const userEmail = user?.email ?? null;

  const {
    classes,
    isLoading,
    error,
    fetchClasses,
    addClass,
    updateClass,
    removeClass,
  } = useClassesStore();

  // Solo admin/instructora
  useEffect(() => {
    if (!initialized) return;
    if (!user || !profile) {
      router.replace("/login");
      return;
    }
    if (profile.role === "alumna") {
      router.replace("/dashboard/alumna");
    }
  }, [initialized, user, profile, router]);

  // init auth
  useEffect(() => {
    if (!initialized) {
      void init();
    }
  }, [initialized, init]);

  // cargar clases
  useEffect(() => {
    void fetchClasses();
  }, [fetchClasses]);

  // ---- resumen superior ----
  const { totalClasses, classesWithVideo, upcomingThisWeek, publishedCount, draftCount } =
    useMemo(() => {
      if (!classes || classes.length === 0) {
        return {
          totalClasses: 0,
          classesWithVideo: 0,
          upcomingThisWeek: 0,
          publishedCount: 0,
          draftCount: 0,
        };
      }

      const now = new Date();
      const weekAhead = new Date();
      weekAhead.setDate(now.getDate() + 7);

      let withVideo = 0;
      let upcomingWeek = 0;
      let published = 0;
      let draft = 0;

      classes.forEach((cls) => {
        if (cls.video_url) withVideo += 1;

        if (cls.start_at) {
          const start = new Date(cls.start_at);
          if (!Number.isNaN(start.getTime())) {
            if (start >= now && start <= weekAhead) {
              upcomingWeek += 1;
            }
          }
        }

        const publishStatus =
          (cls as { status?: PublishStatus | null }).status ?? "published";
        if (publishStatus === "published") published += 1;
        if (publishStatus === "draft") draft += 1;
      });

      return {
        totalClasses: classes.length,
        classesWithVideo: withVideo,
        upcomingThisWeek: upcomingWeek,
        publishedCount: published,
        draftCount: draft,
      };
    }, [classes]);

  // ---- estado de filtros ----
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("Todos");
  const [disciplineFilter, setDisciplineFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<ClassStatus | "all">("all");
  const [publishFilter, setPublishFilter] =
    useState<"all" | PublishStatus>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("start_asc");

  // paginación (solo en el listado)
  const [page, setPage] = useState<number>(1);
  const pageSize = 6;

  // disciplinas disponibles dinámicas
  const availableDisciplines = useMemo(() => {
    const set = new Set<string>();
    classes.forEach((cls) => {
      if (cls.discipline) set.add(cls.discipline);
    });
    return Array.from(set);
  }, [classes]);

  const filteredClasses = useMemo(() => {
    const term = search.toLowerCase().trim();

    const filtered = classes.filter((cls) => {
      const matchesLevel =
        levelFilter === "Todos" || cls.level === levelFilter;

      const matchesDiscipline =
        disciplineFilter === "all" ||
        (cls.discipline && cls.discipline === disciplineFilter);

      const temporalStatus = getClassStatus(cls);
      const matchesStatus =
        statusFilter === "all" || statusFilter === temporalStatus;

      const publishStatus =
        (cls as { status?: PublishStatus | null }).status ?? "published";
      const matchesPublishStatus =
        publishFilter === "all" || publishFilter === publishStatus;

      const searchableText =
        (cls.title ?? "") +
        " " +
        (cls.description ?? "") +
        " " +
        getDisciplineLabel(cls.discipline);
      const matchesSearch =
        term === "" || searchableText.toLowerCase().includes(term);

      return (
        matchesLevel &&
        matchesDiscipline &&
        matchesStatus &&
        matchesPublishStatus &&
        matchesSearch
      );
    });

    // ordenar según sortOrder
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "created_desc") {
        const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
        return bDate - aDate;
      }

      const aStart = a.start_at ? new Date(a.start_at).getTime() : NaN;
      const bStart = b.start_at ? new Date(b.start_at).getTime() : NaN;

      if (Number.isNaN(aStart) && Number.isNaN(bStart)) return 0;
      if (Number.isNaN(aStart)) return 1;
      if (Number.isNaN(bStart)) return -1;

      if (sortOrder === "start_asc") {
        return aStart - bStart;
      }
      // "start_desc"
      return bStart - aStart;
    });

    return sorted;
  }, [
    classes,
    levelFilter,
    disciplineFilter,
    statusFilter,
    publishFilter,
    search,
    sortOrder,
  ]);

  // totals & paginación
  const totalFiltered = filteredClasses.length;
  const totalPages =
    totalFiltered === 0 ? 1 : Math.ceil(totalFiltered / pageSize);
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pagedClasses = filteredClasses.slice(startIndex, endIndex);

  // reset filtros
  function resetFilters() {
    setSearch("");
    setLevelFilter("Todos");
    setDisciplineFilter("all");
    setStatusFilter("all");
    setPublishFilter("all");
    setSortOrder("start_asc");
    setPage(1);
  }

  // ---- estado de formulario (crear/editar) ----
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("Básico");
  const [discipline, setDiscipline] = useState<string>("mat");
  const [durationMinutes, setDurationMinutes] = useState<string>("30");
  const [capacity, setCapacity] = useState<string>("8");
  const [startDate, setStartDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [publishStatus, setPublishStatus] =
    useState<PublishStatus>("published");

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setLevel("Básico");
    setDiscipline("mat");
    setDurationMinutes("30");
    setCapacity("8");
    setStartDate("");
    setStartTime("");
    setVideoUrl("");
    setDescription("");
    setPublishStatus("published");
  }

  function fillFormFromClass(cls: ClassItem) {
    setEditingId(cls.id);
    setTitle(cls.title ?? "");
    setLevel(cls.level ?? "Básico");
    setDiscipline(cls.discipline ?? "mat");
    setDurationMinutes(
      cls.duration_minutes !== null && cls.duration_minutes !== undefined
        ? String(cls.duration_minutes)
        : "30"
    );
    setCapacity(
      cls.capacity !== null && cls.capacity !== undefined
        ? String(cls.capacity)
        : "8"
    );

    if (cls.start_at) {
      const d = new Date(cls.start_at);
      if (!Number.isNaN(d.getTime())) {
        const iso = d.toISOString();
        setStartDate(iso.slice(0, 10));
        setStartTime(iso.slice(11, 16));
      } else {
        setStartDate("");
        setStartTime("");
      }
    } else {
      setStartDate("");
      setStartTime("");
    }

    setVideoUrl(cls.video_url ?? "");
    setDescription(cls.description ?? "");

    const storedStatus =
      (cls as { status?: PublishStatus | null }).status ?? "published";
    setPublishStatus(storedStatus);
    // al editar, te dejo en página 1 para no “perder” la clase
    setPage(1);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userEmail) {
      toast.error("Debes iniciar sesión para crear o editar clases.");
      return;
    }

    if (!title.trim()) {
      toast.error("La clase necesita un título.");
      return;
    }

    const durationNumber = durationMinutes.trim()
      ? Number.parseInt(durationMinutes, 10)
      : null;
    const capacityNumber = capacity.trim()
      ? Number.parseInt(capacity, 10)
      : null;

    if (Number.isNaN(durationNumber as number)) {
      toast.error("Duración inválida. Usa minutos (por ejemplo, 30).");
      return;
    }
    if (Number.isNaN(capacityNumber as number)) {
      toast.error("Capacidad inválida. Usa un número de cupos.");
      return;
    }

    // componer start_at
    let start_at: string | null = null;
    if (startDate && startTime) {
      const localIso = new Date(`${startDate}T${startTime}:00`).toISOString();
      start_at = localIso;
    }

    const basePayload = {
      title: title.trim(),
      level,
      description: description.trim() || null,
      start_at,
      duration_minutes: durationNumber,
      capacity: capacityNumber,
      instructorEmail: userEmail,
      video_url: videoUrl.trim() || null,
      discipline: discipline || null,
      status: publishStatus,
    };

    const payload = basePayload as NewClassInput;

    if (editingId) {
      const result = await updateClass(editingId, payload);
      if (result === undefined) {
        if (error) {
          toast.error("No se pudo actualizar la clase.");
        } else {
          toast.success("Clase actualizada.");
          resetForm();
        }
      } else {
        toast.success("Clase actualizada.");
        resetForm();
      }
    } else {
      const created = await addClass(payload);
      if (!created) {
        toast.error("No se pudo crear la clase.");
        return;
      }
      toast.success("Clase creada.", {
        description: "Ya aparece en tu listado de clases.",
      });
      resetForm();
      setPage(1);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta clase? Esta acción no se puede deshacer."
    );
    if (!confirmed) return;

    await removeClass(id);
    toast("Clase eliminada", {
      description: "Ya no aparecerá en tu catálogo.",
    });

    if (editingId === id) {
      resetForm();
    }
  }

  if (!initialized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Preparando tu panel de clases…
      </div>
    );
  }

  if (!user || !profile || profile.role === "alumna") {
    return null;
  }

  const roleLabel = getRoleLabel(profile.role as Role);
  const hasAnyClasses = classes.length > 0;

  const showingFrom = totalFiltered === 0 ? 0 : startIndex + 1;
  const showingTo =
    totalFiltered === 0 ? 0 : Math.min(endIndex, totalFiltered);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:py-10 md:gap-8">
        {/* HEADER + RESUMEN */}
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Panel de clases
            </p>
            <h1 className="mt-1 text-2xl font-semibold md:text-3xl">
              Gestiona tu estudio de Pilates
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Crea, edita y organiza tus clases guiadas. Así tus alumnas siempre
              saben qué practicar y cuándo.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 text-xs md:items-end">
            <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-800">
              {roleLabel}
            </Badge>
            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5">
                <ListChecks className="h-3 w-3" />
                {totalClasses} clase
                {totalClasses === 1 ? "" : "s"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5">
                <Film className="h-3 w-3" />
                {classesWithVideo} con video
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5">
                <CalendarClock className="h-3 w-3" />
                {upcomingThisWeek} esta semana
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5">
                Publicadas:{" "}
                <span className="font-medium">{publishedCount}</span> · Borrador:{" "}
                <span className="font-medium">{draftCount}</span>
              </span>
            </div>
          </div>
        </section>

        {/* LAYOUT: FORM + LISTADO */}
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
          {/* FORMULARIO */}
          <Card className="border-emerald-100 bg-white/95 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base md:text-lg">
                <span>
                  {editingId ? "Editar clase" : "Crear nueva clase"}
                </span>
                <Badge className="ml-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-medium">
                  {editingId ? "Modo edición" : "Modo creación"}
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Define nivel, disciplina, duración y agrega un video si tienes
                sesiones grabadas.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                className="space-y-3 text-xs md:text-sm"
                onSubmit={(e) => void handleSubmit(e)}
              >
                {/* Título */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-neutral-700">
                    Título de la clase
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Mat suave para comenzar el día"
                    className="bg-white"
                    required
                  />
                </div>

                {/* Nivel + Disciplina */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-neutral-700">
                      Nivel
                    </label>
                    <Select value={level} onValueChange={(v) => setLevel(v)}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecciona nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Básico">Básico</SelectItem>
                        <SelectItem value="Intermedio">Intermedio</SelectItem>
                        <SelectItem value="Avanzado">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-neutral-700">
                      Disciplina / enfoque
                    </label>
                    <Select
                      value={discipline}
                      onValueChange={(v) => setDiscipline(v)}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Selecciona disciplina" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mat">Mat / Suelo</SelectItem>
                        <SelectItem value="reformer">Reformer</SelectItem>
                        <SelectItem value="embarazo">Embarazo</SelectItem>
                        <SelectItem value="postparto">Postparto</SelectItem>
                        <SelectItem value="movilidad">Movilidad</SelectItem>
                        <SelectItem value="recuperacion">
                          Recuperación
                        </SelectItem>
                        <SelectItem value="otra">Otro / Mixto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Duración + Capacidad */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-neutral-700">
                      Duración (min)
                    </label>
                    <Input
                      type="number"
                      min={5}
                      max={180}
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(e.target.value)}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-neutral-700">
                      Capacidad (cupos)
                    </label>
                    <Input
                      type="number"
                      min={1}
                      max={40}
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>

                {/* Fecha + Hora */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-neutral-700">
                      Fecha (opcional)
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-neutral-700">
                      Hora (opcional)
                    </label>
                    <Input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                </div>

                {/* URL de video */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-neutral-700">
                    URL de video (YouTube, Vimeo, etc.)
                  </label>
                  <Input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://..."
                    className="bg-white"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Si agregas un video, la clase aparecerá como on-demand para
                    tus alumnas.
                  </p>
                </div>

                {/* Estado de publicación */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-neutral-700">
                    Estado de publicación
                  </label>
                  <Select
                    value={publishStatus}
                    onValueChange={(v) =>
                      setPublishStatus(v as PublishStatus)
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Publicada</SelectItem>
                      <SelectItem value="draft">Borrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[11px] text-muted-foreground">
                    Puedes dejar una clase en <strong>borrador</strong> mientras
                    pruebas la descripción o el video, y luego marcarla como{" "}
                    <strong>publicada</strong>.
                  </p>
                </div>

                {/* Descripción */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-neutral-700">
                    Descripción
                  </label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Cuenta brevemente de qué se trata esta sesión, a quién está dirigida y qué necesita la alumna (implementos, nivel, etc.)."
                    className="min-h-[80px] bg-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs text-muted-foreground"
                    onClick={() => resetForm()}
                  >
                    Limpiar formulario
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="gap-2"
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4" />
                    {editingId ? "Guardar cambios" : "Crear clase"}
                  </Button>
                </div>

                {error && (
                  <p className="pt-1 text-[11px] text-red-600">
                    {error || "Ocurrió un error al guardar la clase."}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {/* LISTADO / TABLA LIGERA */}
          <Card className="border-emerald-100 bg-white/95 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base md:text-lg">
                    Clases creadas
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    Usa los filtros para encontrar rápido una clase y editarla.
                  </CardDescription>
                </div>
                <Badge className="hidden rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-medium md:inline-flex">
                  <Filter className="mr-1 h-3 w-3" />
                  Filtros activos
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 text-xs md:text-sm">
              {/* filtros listados */}
              <div className="grid gap-2 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_minmax(0,0.9fr)]">
                <Input
                  placeholder="Buscar por título, descripción o disciplina…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="bg-white"
                />

                <Select
                  value={levelFilter}
                  onValueChange={(value) => {
                    setLevelFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos los niveles</SelectItem>
                    <SelectItem value="Básico">Básico</SelectItem>
                    <SelectItem value="Intermedio">Intermedio</SelectItem>
                    <SelectItem value="Avanzado">Avanzado</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={disciplineFilter}
                  onValueChange={(value) => {
                    setDisciplineFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Disciplina" />
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

              {/* filtro por estado temporal + orden */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-[11px]">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={`rounded-full border px-3 py-1 transition-colors ${
                      statusFilter === "all"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-neutral-200 text-neutral-600 hover:border-emerald-200 hover:text-emerald-800"
                    }`}
                    onClick={() => {
                      setStatusFilter("all");
                      setPage(1);
                    }}
                  >
                    Todas
                  </button>
                  <button
                    type="button"
                    className={`rounded-full border px-3 py-1 transition-colors ${
                      statusFilter === "upcoming"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-neutral-200 text-neutral-600 hover:border-emerald-200 hover:text-emerald-800"
                    }`}
                    onClick={() => {
                      setStatusFilter("upcoming");
                      setPage(1);
                    }}
                  >
                    Próximas
                  </button>
                  <button
                    type="button"
                    className={`rounded-full border px-3 py-1 transition-colors ${
                      statusFilter === "ondemand"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-neutral-200 text-neutral-600 hover:border-emerald-200 hover:text-emerald-800"
                    }`}
                    onClick={() => {
                      setStatusFilter("ondemand");
                      setPage(1);
                    }}
                  >
                    On-demand
                  </button>
                  <button
                    type="button"
                    className={`rounded-full border px-3 py-1 transition-colors ${
                      statusFilter === "past"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-neutral-200 text-neutral-600 hover:border-emerald-200 hover:text-emerald-800"
                    }`}
                    onClick={() => {
                      setStatusFilter("past");
                      setPage(1);
                    }}
                  >
                    Pasadas
                  </button>
                </div>

                {/* Ordenar por */}
                <div className="w-full sm:w-48">
                  <Select
                    value={sortOrder}
                    onValueChange={(value) => {
                      setSortOrder(value as SortOrder);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="bg-white h-8">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="start_asc">
                        Más próximas primero
                      </SelectItem>
                      <SelectItem value="start_desc">
                        Más lejanas primero
                      </SelectItem>
                      <SelectItem value="created_desc">
                        Más recientes creadas
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* filtro por estado de publicación */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-neutral-500">Publicación:</span>
                  <button
                    type="button"
                    className={`rounded-full border px-3 py-1 transition-colors ${
                      publishFilter === "all"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-neutral-200 text-neutral-600 hover:border-emerald-200 hover:text-emerald-800"
                    }`}
                    onClick={() => {
                      setPublishFilter("all");
                      setPage(1);
                    }}
                  >
                    Todas
                  </button>
                  <button
                    type="button"
                    className={`rounded-full border px-3 py-1 transition-colors ${
                      publishFilter === "published"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-neutral-200 text-neutral-600 hover:border-emerald-200 hover:text-emerald-800"
                    }`}
                    onClick={() => {
                      setPublishFilter("published");
                      setPage(1);
                    }}
                  >
                    Publicadas
                  </button>
                  <button
                    type="button"
                    className={`rounded-full border px-3 py-1 transition-colors ${
                      publishFilter === "draft"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-neutral-200 text-neutral-600 hover:border-emerald-200 hover:text-emerald-800"
                    }`}
                    onClick={() => {
                      setPublishFilter("draft");
                      setPage(1);
                    }}
                  >
                    Borrador
                  </button>
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[11px] text-emerald-700 underline-offset-2 hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>

              {isLoading && (
                <p className="text-xs text-muted-foreground">
                  Cargando tus clases…
                </p>
              )}

              {/* Empty state: sin ninguna clase creada */}
              {!isLoading && !hasAnyClasses && (
                <div className="mt-2 flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-emerald-100 bg-emerald-50/40 px-4 py-8 text-center text-xs text-emerald-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">
                      Aún no tienes clases creadas
                    </p>
                    <p className="text-[11px] text-emerald-800/80 max-w-sm">
                      Empieza creando tu primera sesión. Puedes definir nivel,
                      disciplina, capacidad y agregar un video si ya tienes
                      contenido grabado.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => {
                      resetForm();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Crear mi primera clase
                  </Button>
                </div>
              )}

              {/* Empty state: hay clases, pero filtros no devuelven nada */}
              {!isLoading && hasAnyClasses && totalFiltered === 0 && (
                <div className="mt-2 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 px-4 py-6 text-center text-xs text-neutral-700">
                  <p className="text-sm font-semibold">
                    No hay clases con estos filtros
                  </p>
                  <p className="text-[11px] max-w-sm text-neutral-600">
                    Prueba cambiando el nivel, disciplina o estado de
                    publicación. También puedes limpiar todos los filtros para
                    ver el listado completo.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1 border-neutral-200"
                    onClick={resetFilters}
                  >
                    Limpiar filtros
                  </Button>
                </div>
              )}

              {/* LISTADO CON PAGINACIÓN */}
              {!isLoading && totalFiltered > 0 && (
                <>
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span>
                      Mostrando{" "}
                      <span className="font-medium">
                        {showingFrom}–{showingTo}
                      </span>{" "}
                      de{" "}
                      <span className="font-medium">
                        {totalFiltered}
                      </span>{" "}
                      clases filtradas
                    </span>
                    {totalPages > 1 && (
                      <span>
                        Página{" "}
                        <span className="font-medium">{currentPage}</span> de{" "}
                        <span className="font-medium">{totalPages}</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {pagedClasses.map((cls) => {
                      const status = getClassStatus(cls);
                      const disciplineLabel = getDisciplineLabel(
                        cls.discipline
                      );
                      const createdAt = formatDateShort(cls.created_at);
                      const hasVideo = !!cls.video_url;
                      const clsPublishStatus =
                        (cls as { status?: PublishStatus | null }).status ??
                        "published";

                      return (
                        <div
                          key={cls.id}
                          className="flex flex-col gap-2 rounded-xl border border-emerald-50 bg-white px-3 py-2.5 text-[11px] shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md md:text-xs md:px-3.5 md:py-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-0.5">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-xs font-semibold text-neutral-900">
                                  {cls.title}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                                  {disciplineLabel}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                                  {cls.level}
                                </span>
                              </div>

                              {cls.description && (
                                <p className="line-clamp-2 text-[11px] text-muted-foreground">
                                  {cls.description}
                                </p>
                              )}
                            </div>

                            {/* status temporal + publicación + video */}
                            <div className="flex flex-col items-end gap-1">
                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  status === "upcoming"
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                                    : status === "ondemand"
                                    ? "bg-sky-50 text-sky-800 border border-sky-100"
                                    : "bg-neutral-50 text-neutral-700 border border-neutral-200"
                                }`}
                              >
                                {status === "upcoming" && "Próxima sesión"}
                                {status === "ondemand" && "On-demand"}
                                {status === "past" && "Clase pasada"}
                              </span>

                              <span
                                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                  clsPublishStatus === "published"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                    : "bg-neutral-100 text-neutral-700 border border-neutral-200"
                                }`}
                              >
                                {clsPublishStatus === "published"
                                  ? "Publicada"
                                  : "Borrador"}
                              </span>

                              {hasVideo && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                                  <Film className="h-3 w-3" />
                                  Video
                                </span>
                              )}
                            </div>
                          </div>

                          {/* meta */}
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                            <div className="flex flex-wrap items-center gap-2">
                              {cls.start_at && (
                                <span className="inline-flex items-center gap-1">
                                  <CalendarClock className="h-3 w-3" />
                                  {formatClassDateTime(cls.start_at)}
                                </span>
                              )}
                              {typeof cls.duration_minutes === "number" && (
                                <span>
                                  Duración:{" "}
                                  <span className="font-medium">
                                    {cls.duration_minutes} min
                                  </span>
                                </span>
                              )}
                              {typeof cls.capacity === "number" && (
                                <span className="inline-flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  Cupos:{" "}
                                  <span className="font-medium">
                                    {cls.capacity}
                                  </span>
                                </span>
                              )}
                            </div>

                            {createdAt && (
                              <span className="text-[10px]">
                                Creada el{" "}
                                <span className="font-medium">{createdAt}</span>
                              </span>
                            )}
                          </div>

                          {/* acciones */}
                          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-neutral-200 text-[11px]"
                              onClick={() => fillFormFromClass(cls)}
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-[11px] text-emerald-700"
                              onClick={() => router.push(`/classes/${cls.id}`)}
                            >
                              Ver como alumna
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-[11px] text-red-600"
                              onClick={() => void handleDelete(cls.id)}
                            >
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Controles de paginación */}
                  {totalPages > 1 && (
                    <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-600">
                      <span>
                        Página{" "}
                        <span className="font-medium">{currentPage}</span> de{" "}
                        <span className="font-medium">{totalPages}</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-neutral-200"
                          disabled={currentPage <= 1}
                          onClick={() =>
                            setPage((prev) => Math.max(1, prev - 1))
                          }
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-neutral-200"
                          disabled={currentPage >= totalPages}
                          onClick={() =>
                            setPage((prev) =>
                              Math.min(totalPages, prev + 1)
                            )
                          }
                        >
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}