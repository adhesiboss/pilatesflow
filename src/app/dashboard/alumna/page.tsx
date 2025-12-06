"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/lib/auth-store";
import { useClassesStore } from "@/lib/classes-store";
import { useBookingsStore } from "@/lib/bookings-store";
import { supabase } from "@/lib/supabaseClient";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

  // 👇 nuevo: conteo de reservas por clase
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>(
    {}
  );

  // init auth
  useEffect(() => {
    if (!initialized) {
      init();
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
    fetchClasses();
  }, [fetchClasses]);

  // cargar reservas de la alumna
  useEffect(() => {
    if (!userEmail) return;
    fetchBookingsForUser(userEmail);
  }, [userEmail, fetchBookingsForUser]);

  // cargar conteo de reservas por clase (para TODOS los ids que existen)
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

  const bookedClassIds = useMemo(
    () => new Set(bookings.map((b) => b.classId)),
    [bookings]
  );

  const bookedClasses = useMemo(
    () => classes.filter((cls) => bookedClassIds.has(cls.id)),
    [classes, bookedClassIds]
  );

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) => {
      const matchesLevel =
        levelFilter === "Todos" || cls.level === levelFilter;

      const text = (cls.title + " " + (cls.description ?? "")).toLowerCase();
      const term = search.toLowerCase().trim();

      const matchesSearch = term === "" || text.includes(term);

      return matchesLevel && matchesSearch;
    });
  }, [classes, levelFilter, search]);

  const handleToggleBooking = async (classId: string) => {
    if (!userEmail) {
      toast.error("Debes iniciar sesión para reservar una clase.");
      router.push("/login");
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
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-500 uppercase">
            Mi agenda
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold mt-1">
            Clases disponibles
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Explora el catálogo y reserva tus próximas sesiones de Pilates.
          </p>
        </div>

        {roleLabel && (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {roleLabel}
          </div>
        )}
      </div>

      {/* Mis próximas clases */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Mis próximas clases</h2>

        {isLoadingBookings && (
          <p className="text-xs text-muted-foreground">
            Cargando tus reservas…
          </p>
        )}

        {!isLoadingBookings && bookedClasses.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Aún no tienes clases reservadas. Elige una clase disponible y
            resérvala para sumarla a tu agenda.
          </p>
        )}

        {!isLoadingBookings && bookedClasses.length > 0 && (
          <div className="grid gap-3 md:grid-cols-2">
            {bookedClasses.map((cls) => {
              const bookingsCount = bookingCounts[cls.id] ?? 0;
              const capacity =
                cls.capacity !== undefined && cls.capacity !== null
                  ? cls.capacity
                  : null;
              const isFull =
                capacity !== null && bookingsCount >= capacity;

              return (
                <Card
                  key={cls.id}
                  className="border-emerald-100 bg-emerald-50/40"
                >
                  <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-sm md:text-base">
                        {cls.title}
                      </CardTitle>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatClassDateTime(cls.start_at)}
                      </p>
                    </div>
                    {isFull && (
                      <span className="inline-flex items-center rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
                        Clase llena
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs md:text-sm">
                    <p className="text-muted-foreground">
                      {cls.description || "Clase de Pilates del estudio."}
                    </p>
                    <p>
                      Nivel:{" "}
                      <span className="font-semibold text-emerald-700">
                        {cls.level}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Cupos:{" "}
                      <span className="font-semibold text-emerald-700">
                        {capacity !== null
                          ? `${bookingsCount}/${capacity}`
                          : bookingsCount}
                      </span>
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-1"
                      onClick={() => handleToggleBooking(cls.id)}
                    >
                      Cancelar reserva
                    </Button>
                  </CardContent>
                </Card>
            );
            })}
          </div>
        )}
      </section>

      {/* Filtros + listado general */}
      <section className="space-y-4 pt-4 border-t">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <Input
              placeholder="Buscar por título o descripción…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="w-full md:w-52">
            <Select
              value={levelFilter}
              onValueChange={(value) => setLevelFilter(value)}
            >
              <SelectTrigger>
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
        </div>

        {isLoadingClasses && (
          <p className="text-sm text-muted-foreground">
            Cargando clases disponibles…
          </p>
        )}

        {!isLoadingClasses && filteredClasses.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No hay clases con estos filtros. Prueba cambiar el nivel o limpiar
            la búsqueda.
          </p>
        )}

        {!isLoadingClasses && filteredClasses.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredClasses.map((cls) => {
              const isBooked = bookedClassIds.has(cls.id);

              const bookingsCount = bookingCounts[cls.id] ?? 0;
              const capacity =
                cls.capacity !== undefined && cls.capacity !== null
                  ? cls.capacity
                  : null;
              const isFull =
                capacity !== null && bookingsCount >= capacity;

              const disabled = !isBooked && isFull;
              const label = isBooked
                ? "Cancelar reserva"
                : isFull
                ? "Sin cupos"
                : "Reservar clase";

              return (
                <Card key={cls.id} className="border-emerald-50 shadow-sm">
                  <CardHeader className="pb-2 flex flex-row items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-sm md:text-base">
                        {cls.title}
                      </CardTitle>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatClassDateTime(cls.start_at)}
                      </p>
                    </div>
                    {isFull && (
                      <span className="inline-flex items-center rounded-full border border-red-100 bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700">
                        Clase llena
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs md:text-sm">
                    <p className="text-muted-foreground">
                      {cls.description || "Clase de Pilates del estudio."}
                    </p>
                    <p>
                      Nivel:{" "}
                      <span className="font-semibold text-emerald-700">
                        {cls.level}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Cupos:{" "}
                      <span className="font-semibold text-emerald-700">
                        {capacity !== null
                          ? `${bookingsCount}/${capacity}`
                          : bookingsCount}
                      </span>
                    </p>
                    <Button
                      size="sm"
                      variant={
                        isBooked ? "outline" : disabled ? "outline" : "default"
                      }
                      disabled={disabled}
                      onClick={() => {
                        if (disabled) return;
                        void handleToggleBooking(cls.id);
                      }}
                    >
                      {label}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}