// src/app/dashboard/alumna/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/auth-store";
import { useClassesStore } from "@/lib/classes-store";
import { useBookingsStore } from "@/lib/bookings-store";
import { supabase } from "@/lib/supabaseClient";

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
import { toast } from "sonner";

function getRoleLabel(role: "admin" | "instructor" | "alumna" | undefined) {
  if (!role) return "";
  if (role === "admin") return "Administrador/a";
  if (role === "instructor") return "Instructor/a";
  return "Alumna";
}

function getPlanLabel(plan: "free" | "activa" | undefined | null) {
  if (!plan || plan === "free") return "Plan Free";
  if (plan === "activa") return "Plan Activa";
  return "Plan Free";
}

function formatClassDateTime(start_at?: string | null): string {
  if (!start_at) return "Sin horario";
  const date = new Date(start_at);
  if (Number.isNaN(date.getTime())) return "Sin horario";

  return date.toLocaleString("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
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

// límites de reservas por plan
const PLAN_LIMITS: Record<string, number> = {
  free: 4,
  activa: 12,
};

// Intenciones suaves del día
const DAILY_INTENTIONS: {
  id: string;
  title: string;
  description: string;
}[] = [
  {
    id: "suavizar-dia",
    title: "Suavizar el día",
    description:
      "Antes de moverte, nota cómo llegas hoy: con sueño, con prisa, con energía. No hace falta cambiar nada, solo reconocerlo. Desde ahí, deja que la respiración vaya desanudando las tensiones.",
  },
  {
    id: "habitar-cuerpo",
    title: "Habitar tu cuerpo",
    description:
      "En cada postura, vuelve a las sensaciones: peso, apoyo, temperatura. Imagina que tu práctica es una forma de volver a casa, a tu propio cuerpo, con amabilidad.",
  },
  {
    id: "espacio-para-ti",
    title: "Un pequeño espacio para ti",
    description:
      "Por estos minutos, no tienes que rendirle cuentas a nadie. Esta clase es un espacio protegido para escucharte, pausar y recargar tu energía desde adentro.",
  },
  {
    id: "respirar-mas-lento",
    title: "Respirar un poco más lento",
    description:
      "Si la mente va rápido, deja que la respiración marque otro ritmo. Inhala por la nariz contando hasta cuatro, exhala un poco más largo. Tu práctica hoy es simplemente acompañar ese pulso.",
  },
];

type SortBy = "dateAsc" | "dateDesc";

export default function AlumnaDashboardPage() {
  const router = useRouter();

  const { user, profile, initialized, init } = useAuthStore();
  const userEmail = user?.email ?? null;

  const classes = useClassesStore((state) => state.classes);
  const isLoadingClasses = useClassesStore((state) => state.isLoading);
  const fetchClasses = useClassesStore((state) => state.fetchClasses);

  const {
    bookings,
    isLoading: isLoadingBookings,
    fetchBookingsForUser,
    toggleBooking,
  } = useBookingsStore();

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("Todos");
  const [sortBy, setSortBy] = useState<SortBy>("dateAsc");

  // conteo de reservas por clase
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>(
    {}
  );

  // init auth
  useEffect(() => {
    if (!initialized) {
      void init();
    }
  }, [initialized, init]);

  // Guard: solo alumna
  useEffect(() => {
    if (!initialized) return;

    if (!user || !profile) {
      router.replace("/login");
      return;
    }

    if (profile.role !== "alumna") {
      router.replace("/dashboard");
      return;
    }
  }, [initialized, user, profile, router]);

  // cargar clases
  useEffect(() => {
    void fetchClasses();
  }, [fetchClasses]);

  // cargar reservas de la alumna
  useEffect(() => {
    if (!userEmail) return;
    void fetchBookingsForUser(userEmail);
  }, [userEmail, fetchBookingsForUser]);

  // cargar conteo de reservas por clase
  useEffect(() => {
    async function loadBookingCounts() {
      if (classes.length === 0) {
        setBookingCounts({});
        return;
      }

      const classIds = classes.map((c) => c.id);

      const { data, error } = await supabase
        .from("bookings")
        .select("classId")
        .in("classId", classIds);

      if (error) {
        console.error(
          "Error al obtener conteo de reservas (alumna):",
          error.message,
          error.details,
          error.hint
        );
        return;
      }

      const counts: Record<string, number> = {};
      (data as { classId: string }[]).forEach((row) => {
        counts[row.classId] = (counts[row.classId] ?? 0) + 1;
      });

      setBookingCounts(counts);
    }

    void loadBookingCounts();
  }, [classes]);

  const roleLabel = getRoleLabel(profile?.role);
  const planLabel = getPlanLabel(profile?.plan ?? "free");

  // Intención del día (determinística por fecha)
  const dailyIntention = useMemo(() => {
    const today = new Date();
    const hash =
      today.getFullYear() * 10000 +
      (today.getMonth() + 1) * 100 +
      today.getDate();
    const idx = Math.abs(hash) % DAILY_INTENTIONS.length;
    return DAILY_INTENTIONS[idx];
  }, []);

  const bookedClassIds = useMemo(
    () => new Set(bookings.map((b) => b.classId)),
    [bookings]
  );

  const bookedClasses = useMemo(() => {
    const list = classes.filter((cls) => bookedClassIds.has(cls.id));

    // ordenar por fecha más próxima
    return list.sort((a, b) => {
      const aTime = a.start_at ? new Date(a.start_at).getTime() : Infinity;
      const bTime = b.start_at ? new Date(b.start_at).getTime() : Infinity;
      return aTime - bTime;
    });
  }, [classes, bookedClassIds]);

  const filteredClasses = useMemo(() => {
    const base = classes.filter((cls) => {
      const matchesLevel =
        levelFilter === "Todos" || cls.level === levelFilter;

      const text = (cls.title + " " + (cls.description ?? "")).toLowerCase();
      const term = search.toLowerCase().trim();

      const matchesSearch = term === "" || text.includes(term);

      return matchesLevel && matchesSearch;
    });

    // ordenar según sortBy
    return [...base].sort((a, b) => {
      const aTime = a.start_at ? new Date(a.start_at).getTime() : Infinity;
      const bTime = b.start_at ? new Date(b.start_at).getTime() : Infinity;

      if (sortBy === "dateAsc") {
        return aTime - bTime;
      }
      return bTime - aTime;
    });
  }, [classes, levelFilter, search, sortBy]);

  // lógica de límite por plan
  const bookingsCount = bookings.length;
  const planKey = (profile?.plan ?? "free").toLowerCase();
  const planMaxBookings = PLAN_LIMITS[planKey] ?? null;
  const hasReachedPlanLimit =
    planMaxBookings !== null && bookingsCount >= planMaxBookings;

  const planUsagePercent =
    planMaxBookings && planMaxBookings > 0
      ? Math.min(100, Math.round((bookingsCount / planMaxBookings) * 100))
      : 0;

  const handleToggleBooking = async (classId: string) => {
    if (!userEmail) {
      toast.error("Debes iniciar sesión para reservar una clase.");
      router.push("/login");
      return;
    }

    const alreadyBooked = bookedClassIds.has(classId);

    // si quiere reservar (no cancelar) y ya llegó al límite de su plan
    if (!alreadyBooked && hasReachedPlanLimit) {
      if (planMaxBookings !== null) {
        toast.error("Has alcanzado el límite de tu plan", {
          description: `Tu plan actual permite ${planMaxBookings} reservas activas. Cancela alguna reserva para agendar una nueva.`,
        });
      } else {
        toast.error("No puedes reservar más clases por ahora.");
      }
      return;
    }

    const result = await toggleBooking(classId, userEmail);

    if (result === "reserved") {
      toast.success("Reserva creada", {
        description: "Guardamos tu cupo en esta clase ✨",
      });
    } else if (result === "cancelled") {
      toast("Reserva cancelada", {
        description: "Liberaste tu cupo para otra alumna.",
      });
    } else if (result === "full") {
      toast.error("Clase sin cupos disponibles", {
        description:
          "Esta sesión ya alcanzó el máximo de alumnas. Elige otra clase u horario.",
      });
    } else {
      toast.error("No se pudo actualizar tu reserva", {
        description: "Inténtalo nuevamente en unos minutos.",
      });
    }
  };

  if (!initialized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Preparando tu agenda…
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-emerald-500 uppercase">
              Mi práctica
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">
              Tus clases de Pilates
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Elige una clase, reserva tu cupo y ve tu práctica crecer con cada
              sesión.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            {roleLabel && (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {roleLabel}
              </div>
            )}

            {/* Badge de plan */}
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-medium text-sky-800">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              {planLabel}
            </div>
          </div>
        </div>

        {/* Intención del día */}
        <Card className="border-emerald-100 bg-white/90">
          <CardContent className="py-4 space-y-2 text-xs md:text-sm text-emerald-900">
            <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-600">
              Intención del día
            </p>
            <p className="text-sm font-semibold text-neutral-900">
              {dailyIntention.title}
            </p>
            <p className="text-xs md:text-sm text-emerald-900/80 max-w-2xl">
              {dailyIntention.description}
            </p>
            <p className="text-[11px] text-emerald-800/80">
              Puedes leer esta frase antes de elegir tu clase y dejar que tu práctica
              sea una pequeña ceremonia para ti.
            </p>
          </CardContent>
        </Card>

        {/* Card de plan con barra de progreso */}
        {planMaxBookings !== null && (
          <Card className="border-emerald-100 bg-emerald-50/70">
            <CardContent className="py-4 space-y-3 text-xs text-emerald-900">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <p>
                  Tu plan actual te permite hasta{" "}
                  <span className="font-semibold">{planMaxBookings}</span>{" "}
                  reservas activas.
                </p>
                <p className="text-[11px] text-emerald-800/80">
                  Reservas usadas:{" "}
                  <span className="font-semibold">
                    {bookingsCount}/{planMaxBookings}
                  </span>
                </p>
              </div>

              {/* Barra de progreso visual */}
              <div className="mt-1 space-y-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${planUsagePercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-emerald-800/70">
                  Estás usando aproximadamente{" "}
                  <span className="font-semibold">
                    {planUsagePercent}% de tu plan
                  </span>
                  .
                  {hasReachedPlanLimit && (
                    <> Cancela alguna reserva para agendar nuevas.</>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mis próximas clases */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">Clases que ya reservaste</h2>
            {!isLoadingBookings && (
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-medium text-emerald-800 border border-emerald-100">
                {bookedClasses.length} clase
                {bookedClasses.length === 1 ? "" : "s"} reservada
                {bookedClasses.length === 1 ? "" : "s"}
              </span>
            )}
          </div>

          {isLoadingBookings && (
            <p className="text-xs text-muted-foreground">
              Cargando tus reservas…
            </p>
          )}

          {!isLoadingBookings && bookedClasses.length === 0 && (
            <Card className="border-dashed border-emerald-100 bg-emerald-50/60">
              <CardContent className="py-4 space-y-2 text-xs text-emerald-900">
                <p className="font-medium">
                  🌱 Aún no tienes clases reservadas.
                </p>
                <p>
                  Cuando reserves una clase, la verás aquí primero, ordenada por
                  la fecha más próxima para que no se te pase ninguna sesión.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-1 border-emerald-200 text-emerald-800 hover:border-emerald-300"
                  onClick={() => {
                    // simple scroll a la sección de clases disponibles
                    const el = document.getElementById("disponibles");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Ver clases disponibles
                </Button>
              </CardContent>
            </Card>
          )}

          {!isLoadingBookings && bookedClasses.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              {bookedClasses.map((cls) => {
                const bookingsCountForClass = bookingCounts[cls.id] ?? 0;
                const capacity =
                  cls.capacity !== undefined && cls.capacity !== null
                    ? cls.capacity
                    : null;
                const isFull =
                  capacity !== null && bookingsCountForClass >= capacity;

                const disciplineLabel = getDisciplineLabel(
                  (cls as { discipline?: string | null }).discipline ?? null
                );

                return (
                  <Card
                    key={cls.id}
                    className="overflow-hidden border-emerald-100 bg-white"
                  >
                    {/* Cabecera visual */}
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-3 text-emerald-50">
                      <p className="text-[10px] uppercase tracking-[0.2em] opacity-80">
                        Clase reservada
                      </p>
                      <h3 className="mt-1 text-sm font-semibold line-clamp-1">
                        {cls.title}
                      </h3>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center rounded-full bg-emerald-100/90 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                            {disciplineLabel}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-emerald-100/90 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                            {cls.level}
                          </span>
                        </div>
                        {isFull && (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
                            Clase llena
                          </span>
                        )}
                      </div>
                    </div>

                    <CardContent className="space-y-2 p-4 text-xs md:text-sm">
                      <p className="text-muted-foreground line-clamp-3">
                        {cls.description || "Clase de Pilates del estudio."}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Próximo horario:{" "}
                        <span className="font-semibold text-emerald-700">
                          {formatClassDateTime(cls.start_at)}
                        </span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Cupos:{" "}
                        <span className="font-semibold text-emerald-700">
                          {capacity !== null
                            ? `${bookingsCountForClass}/${capacity}`
                            : bookingsCountForClass}
                        </span>
                      </p>

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full sm:w-auto text-[11px] text-emerald-700"
                          onClick={() => router.push(`/classes/${cls.id}`)}
                        >
                          Ver clase
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() => void handleToggleBooking(cls.id)}
                        >
                          Cancelar reserva
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Filtros + listado general */}
        <section
          id="disponibles"
          className="space-y-4 pt-4 border-t border-emerald-50"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <Input
                placeholder="Buscar por título o descripción…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white"
              />
            </div>

            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
              <div className="w-full md:w-40">
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

              <div className="w-full md:w-48">
                <Select
                  value={sortBy}
                  onValueChange={(value) => setSortBy(value as SortBy)}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dateAsc">
                      Fecha más próxima primero
                    </SelectItem>
                    <SelectItem value="dateDesc">
                      Fecha más lejana primero
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isLoadingClasses && (
            <p className="text-sm text-muted-foreground">
              Cargando clases disponibles…
            </p>
          )}

          {!isLoadingClasses && filteredClasses.length === 0 && (
            <Card className="border-dashed border-emerald-100 bg:white/80">
              <CardContent className="py-4 space-y-2 text-xs text-neutral-800">
                <p className="font-medium">
                  No encontramos clases con estos filtros.
                </p>
                <p className="text-neutral-600">
                  Prueba cambiar el nivel, la búsqueda o volver a ver todas las
                  clases disponibles.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-1 border-emerald-200 text-emerald-800 hover:border-emerald-300"
                  onClick={() => {
                    setSearch("");
                    setLevelFilter("Todos");
                    setSortBy("dateAsc");
                  }}
                >
                  Limpiar filtros
                </Button>
              </CardContent>
            </Card>
          )}

          {!isLoadingClasses && filteredClasses.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredClasses.map((cls) => {
                const isBooked = bookedClassIds.has(cls.id);

                const bookingsCountForClass = bookingCounts[cls.id] ?? 0;
                const capacity =
                  cls.capacity !== undefined && cls.capacity !== null
                    ? cls.capacity
                    : null;
                const isFull =
                  capacity !== null && bookingsCountForClass >= capacity;

                const isPlanLimited = !isBooked && hasReachedPlanLimit;
                const disabled = (!isBooked && isFull) || isPlanLimited;

                const label = isBooked
                  ? "Cancelar reserva"
                  : isFull
                  ? "Sin cupos"
                  : isPlanLimited && planMaxBookings !== null
                  ? `Límite de plan (${bookingsCount}/${planMaxBookings})`
                  : "Reservar clase";

                const disciplineLabel = getDisciplineLabel(
                  (cls as { discipline?: string | null }).discipline ?? null
                );

                return (
                  <Card
                    key={cls.id}
                    className="overflow-hidden border-emerald-50 bg-white transition hover:shadow-md hover:-translate-y-0.5"
                  >
                    {/* Cabecera visual */}
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-3 text-emerald-50">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.2em] opacity-80">
                            Clase guiada
                          </p>
                          <h3 className="mt-1 text-sm font-semibold line-clamp-1">
                            {cls.title}
                          </h3>
                        </div>

                        {/* Chip si ya está reservada */}
                        {isBooked && (
                          <span className="mt-1 inline-flex items-center rounded-full bg-emerald-900/30 px-2 py-0.5 text-[10px] font-medium text-emerald-50 border border-emerald-100">
                            Reservada
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1">
                          <span className="inline-flex items-center rounded-full bg-emerald-100/90 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                            {disciplineLabel}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-emerald-100/90 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                            {cls.level}
                          </span>
                        </div>
                        {isFull && (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
                            Clase llena
                          </span>
                        )}
                      </div>
                    </div>

                    <CardContent className="space-y-2 p-4 text-xs md:text-sm">
                      <p className="text-muted-foreground line-clamp-3">
                        {cls.description || "Clase de Pilates del estudio."}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Próximo horario:{" "}
                        <span className="font-semibold text-emerald-700">
                          {formatClassDateTime(cls.start_at)}
                        </span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Cupos:{" "}
                        <span className="font-semibold text-emerald-700">
                          {capacity !== null
                            ? `${bookingsCountForClass}/${capacity}`
                            : bookingsCountForClass}
                        </span>
                      </p>

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <Button
                          size="sm"
                          variant={
                            isBooked
                              ? "outline"
                              : disabled
                              ? "outline"
                              : "default"
                          }
                          disabled={disabled}
                          className="w-full sm:w-auto"
                          onClick={() => {
                            if (disabled) return;
                            void handleToggleBooking(cls.id);
                          }}
                        >
                          {label}
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-full sm:w-auto text-[11px] text-emerald-700"
                          onClick={() => router.push(`/classes/${cls.id}`)}
                        >
                          Ver clase
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