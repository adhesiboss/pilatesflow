// src/app/dashboard/profile/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { useAuthStore } from "@/lib/auth-store";
import { useClassesStore, type ClassItem } from "@/lib/classes-store";
import { useProgressStore } from "@/lib/progress-store";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Role = "admin" | "instructor" | "alumna";

function getRoleLabel(role?: Role | null) {
  if (!role) return "";
  if (role === "admin") return "Administradora";
  if (role === "instructor") return "Instructora";
  return "Alumna";
}

function getPlanLabel(plan?: "free" | "activa" | null) {
  if (!plan || plan === "free") return "Plan Free";
  if (plan === "activa") return "Plan Activa";
  return "Plan Free";
}

function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("es-CL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateString?: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// racha actual en días seguidos con al menos una clase completada
function getCurrentStreak(completedAtList: string[]): number {
  if (completedAtList.length === 0) return 0;

  const daysSet = new Set<string>();
  completedAtList.forEach((iso) => {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    daysSet.add(key);
  });

  let streak = 0;
  const cursor = new Date();

  for (let i = 0; i < 365; i += 1) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`;
    if (daysSet.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function formatDuration(totalMinutes: number): string {
  if (totalMinutes <= 0) return "0 min";
  if (totalMinutes < 60) return `${totalMinutes} min`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

// key tipo "2025-03" a partir de un ISO
function getMonthKeyFromIso(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function formatMonthLabel(key: string): string {
  const [yearStr, monthStr] = key.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!year || !month) return key;

  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
  });
}

type CompletedMeta = {
  id: string;
  title: string;
  completed_at: string;
  durationMinutes: number | null;
};

type MonthOption = {
  key: string;
  label: string;
  count: number;
  totalMinutes: number;
};

export default function ProfilePage() {
  const router = useRouter();

  // auth
  const { user, profile, initialized, init } = useAuthStore();

  // clases
  const classes = useClassesStore((state) => state.classes);
  const fetchClasses = useClassesStore((state) => state.fetchClasses);
  const isLoadingClasses = useClassesStore((state) => state.isLoading);

  // progreso
  const {
    items: progressItems,
    isLoading: isLoadingProgress,
    fetchProgressForUser,
  } = useProgressStore();

  const userEmail = user?.email ?? null;
  const role = profile?.role ?? null;

  // mes seleccionado para historial
  const [selectedMonthKey, setSelectedMonthKey] = useState<string | "all">(
    "all"
  );

  // init auth
  useEffect(() => {
    if (!initialized) {
      void init();
    }
  }, [initialized, init]);

  // guard: requiere login
  useEffect(() => {
    if (!initialized) return;

    if (!user || !profile) {
      router.replace("/login");
    }
  }, [initialized, user, profile, router]);

  // cargar clases
  useEffect(() => {
    void fetchClasses();
  }, [fetchClasses]);

  // cargar progreso de la alumna (solo si es alumna)
  useEffect(() => {
    if (!userEmail) return;
    if (role !== "alumna") return;

    void fetchProgressForUser(userEmail);
  }, [userEmail, role, fetchProgressForUser]);

  const {
    completedCount,
    totalMinutes,
    lastPractice,
    currentStreak,
    lastCompletedClasses,
    allCompletedWithMeta,
    monthOptions,
  } = useMemo(() => {
    const emptyResult = {
      completedCount: 0,
      totalMinutes: 0,
      lastPractice: "",
      currentStreak: 0,
      lastCompletedClasses: [] as CompletedMeta[],
      allCompletedWithMeta: [] as CompletedMeta[],
      monthOptions: [] as MonthOption[],
    };

    if (role !== "alumna") return emptyResult;
    if (!progressItems || progressItems.length === 0) return emptyResult;

    // Map de clases por id para lookup rápido
    const classMap = new Map<string, ClassItem>();
    classes.forEach((cls) => {
      classMap.set(cls.id, cls);
    });

    let minutesSum = 0;
    let lastPracticeIso = "";
    const completedAtList: string[] = [];
    const completedWithMeta: CompletedMeta[] = [];

    const monthlyTotals: Record<
      string,
      { totalMinutes: number; count: number }
    > = {};

    progressItems.forEach((item) => {
      const completedIso = item.completed_at as string | null;

      // si viene null, lo ignoramos
      if (!completedIso) return;

      completedAtList.push(completedIso);

      const cls = classMap.get(item.classId);
      const duration =
        cls && typeof cls.duration_minutes === "number"
          ? cls.duration_minutes
          : 30; // fallback 30 min si no hay duración

      minutesSum += duration;

      if (!lastPracticeIso || new Date(completedIso) > new Date(lastPracticeIso)) {
        lastPracticeIso = completedIso;
      }

      completedWithMeta.push({
        id: item.classId,
        title: cls?.title ?? "Clase de Pilates",
        completed_at: completedIso,
        durationMinutes: cls?.duration_minutes ?? null,
      });

      // agrupación mensual
      const monthKey = getMonthKeyFromIso(completedIso);
      if (!monthKey) return;
      if (!monthlyTotals[monthKey]) {
        monthlyTotals[monthKey] = { totalMinutes: 0, count: 0 };
      }
      monthlyTotals[monthKey].totalMinutes += duration;
      monthlyTotals[monthKey].count += 1;
    });

    // ordenar últimas completadas por fecha desc
    completedWithMeta.sort(
      (a, b) =>
        new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
    );

    const streak = getCurrentStreak(completedAtList);

    const monthOptions: MonthOption[] = Object.entries(monthlyTotals)
      .map(([key, meta]) => ({
        key,
        label: formatMonthLabel(key),
        count: meta.count,
        totalMinutes: meta.totalMinutes,
      }))
      // mes más reciente primero
      .sort((a, b) => b.key.localeCompare(a.key));

    return {
      completedCount: completedWithMeta.length,
      totalMinutes: minutesSum,
      lastPractice: lastPracticeIso,
      currentStreak: streak,
      lastCompletedClasses: completedWithMeta.slice(0, 5),
      allCompletedWithMeta: completedWithMeta,
      monthOptions,
    };
  }, [role, progressItems, classes]);

  // historial filtrado por mes seleccionado
  const filteredHistory = useMemo(() => {
    if (selectedMonthKey === "all") return allCompletedWithMeta;
    return allCompletedWithMeta.filter(
      (item) => getMonthKeyFromIso(item.completed_at) === selectedMonthKey
    );
  }, [allCompletedWithMeta, selectedMonthKey]);

  const roleLabel = getRoleLabel(role);
  const planLabel = getPlanLabel(profile?.plan ?? "free");

  if (!initialized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
        Preparando tu perfil…
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const isAlumna = role === "alumna";

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="mx-auto max-w-5xl px-4 py-8 md:py-10 space-y-6">
        {/* Header */}
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-emerald-500 uppercase">
              Mi espacio
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold">
              Perfil y progreso
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-xl">
              Revisa tu plan, tu rol en la plataforma y un resumen de cómo va tu
              práctica de Pilates.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <Badge className="rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] px-3 py-1 font-medium">
              {roleLabel}
            </Badge>
            <Badge className="rounded-full bg-sky-50 text-sky-800 border border-sky-200 text-[11px] px-3 py-1 font-medium">
              {planLabel}
            </Badge>

            {isAlumna && (
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800 border border-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Racha actual:{" "}
                {currentStreak > 0
                  ? `${currentStreak} día${
                      currentStreak === 1 ? "" : "s"
                    } seguidos`
                  : "sin racha activa aún"}
              </span>
            )}
          </div>
        </section>

        {/* Perfil básico */}
        <Card className="border-emerald-50 bg-white/90 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base md:text-lg">
              Datos de tu perfil
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Esta información se usa para personalizar tu experiencia y tu
              práctica.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Nombre
              </p>
              <p className="font-medium">
                {user.user_metadata?.full_name || user.email}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </p>
              <p className="font-medium break-all">{user.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Rol
              </p>
              <p className="font-medium">{roleLabel}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Plan
              </p>
              <p className="font-medium">{planLabel}</p>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de progreso (solo alumna) */}
        {isAlumna && (
          <>
            <motion.section
              className="space-y-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">Resumen de tu práctica</h2>
                {(isLoadingClasses || isLoadingProgress) && (
                  <p className="text-[11px] text-muted-foreground">
                    Actualizando datos…
                  </p>
                )}
              </div>

              {/* Tarjetas métricas con animación */}
              <div className="grid gap-4 md:grid-cols-3">
                {/* Clases completadas */}
                <motion.div
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 250, damping: 20 }}
                >
                  <Card className="border-emerald-50 bg-white/90">
                    <CardContent className="py-4 space-y-1">
                      <p className="text-[11px] text-muted-foreground">
                        Clases completadas
                      </p>
                      <p className="text-2xl font-semibold">{completedCount}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Cada clase cuenta como un paso más en tu práctica.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Tiempo estimado */}
                <motion.div
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 20,
                    delay: 0.02,
                  }}
                >
                  <Card className="border-emerald-50 bg-white/90">
                    <CardContent className="py-4 space-y-1">
                      <p className="text-[11px] text-muted-foreground">
                        Tiempo estimado practicado
                      </p>
                      <p className="text-lg font-semibold">
                        {formatDuration(totalMinutes)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Sumando la duración de las clases que marcaste como
                        completadas.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Última práctica + racha + barrita visual */}
                <motion.div
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 20,
                    delay: 0.04,
                  }}
                >
                  <Card className="border-emerald-50 bg-white/90">
                    <CardContent className="py-4 space-y-3">
                      <div>
                        <p className="text-[11px] text-muted-foreground">
                          Última práctica
                        </p>
                        <p className="text-sm font-semibold">
                          {lastPractice
                            ? formatDateTime(lastPractice)
                            : "Aún no registras prácticas"}
                        </p>
                      </div>

                      <div className="my-1 h-px w-full bg-emerald-50" />

                      <div className="space-y-1">
                        <p className="text-[11px] text-muted-foreground">
                          Racha actual
                        </p>
                        <p className="text-sm font-semibold">
                          {currentStreak > 0
                            ? `${currentStreak} día${
                                currentStreak === 1 ? "" : "s"
                              } seguidos`
                            : "Sin racha activa"}
                        </p>

                        {/* Barrita de constancia */}
                        <div className="mt-1 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>Constancia mensual</span>
                            <span className="font-medium text-emerald-700">
                              {Math.min(currentStreak, 14)}/14 días
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-50">
                            <motion.div
                              className="h-full rounded-full bg-emerald-500"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(
                                  100,
                                  Math.round(
                                    (Math.min(currentStreak, 14) / 14) * 100
                                  )
                                )}%`,
                              }}
                              transition={{ duration: 0.5, delay: 0.1 }}
                            />
                          </div>
                        </div>

                        {currentStreak > 0 && (
                          <p className="text-[11px] text-emerald-700 mt-1">
                            ¡Sigue así! Mantén tu práctica viva un día más 💚
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Últimas clases completadas */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="border-emerald-50 bg-white/90">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      Últimas clases que marcaste como completadas
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Un pequeño historial de tus prácticas más recientes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs">
                    {lastCompletedClasses.length === 0 && (
                      <p className="text-muted-foreground">
                        Aún no has marcado clases como completadas. Cuando lo
                        hagas, verás aquí tu historial reciente.
                      </p>
                    )}

                    {lastCompletedClasses.length > 0 && (
                      <div className="space-y-2">
                        {lastCompletedClasses.map((item) => (
                          <motion.div
                            key={item.id + item.completed_at}
                            className="flex flex-col gap-1 rounded-md border border-emerald-50 bg-white px-3 py-2 md:flex-row md:items-center md:justify-between"
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            whileHover={{ y: -1 }}
                          >
                            <div>
                              <p className="font-medium line-clamp-1">
                                {item.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                Completada el{" "}
                                <span className="font-medium">
                                  {formatDate(item.completed_at)}
                                </span>
                                {item.durationMinutes && (
                                  <>
                                    {" · "}
                                    {item.durationMinutes} min
                                  </>
                                )}
                              </p>
                            </div>
                            <button
                              type="button"
                              className="mt-1 text-[11px] text-emerald-700 underline-offset-2 hover:underline md:mt-0"
                              onClick={() => router.push(`/classes/${item.id}`)}
                            >
                              Volver a ver la clase
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.section>

            {/* Historial mensual */}
            {monthOptions.length > 0 && (
              <section className="space-y-3">
                <Card className="border-emerald-50 bg-white/95">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      Historial mensual de práctica
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Filtra tus clases completadas por mes para ver cómo ha
                      ido tu constancia.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <p className="text-muted-foreground max-w-sm">
                        Elige un mes para ver solo las clases que completaste en
                        ese periodo, o deja “todos” para ver el historial
                        completo.
                      </p>

                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
                        <Select
                          value={selectedMonthKey}
                          onValueChange={(value) =>
                            setSelectedMonthKey(value as string | "all")
                          }
                        >
                          <SelectTrigger className="bg-white w-full md:w-56">
                            <SelectValue placeholder="Elegir mes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              Todos los meses con práctica
                            </SelectItem>
                            {monthOptions.map((m) => (
                              <SelectItem key={m.key} value={m.key}>
                                {m.label} · {m.count} clase
                                {m.count === 1 ? "" : "s"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <span className="inline-flex items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-medium text-emerald-800">
                          {filteredHistory.length} registro
                          {filteredHistory.length === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {filteredHistory.length === 0 && (
                        <p className="text-muted-foreground">
                          No hay clases completadas en el periodo seleccionado.
                          Prueba otro mes o vuelve a &quot;todos&quot;.
                        </p>
                      )}

                      {filteredHistory.length > 0 && (
                        <div className="space-y-2">
                          {filteredHistory.map((item) => (
                            <div
                              key={`${item.id}-${item.completed_at}-history`}
                              className="flex flex-col gap-1 rounded-md border border-emerald-50 bg-white px-3 py-2 md:flex-row md:items-center md:justify-between"
                            >
                              <div>
                                <p className="font-medium line-clamp-1">
                                  {item.title}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  Completada el{" "}
                                  <span className="font-medium">
                                    {formatDate(item.completed_at)}
                                  </span>
                                  {item.durationMinutes && (
                                    <>
                                      {" · "}
                                      {item.durationMinutes} min
                                    </>
                                  )}
                                </p>
                              </div>
                              <button
                                type="button"
                                className="mt-1 text-[11px] text-emerald-700 underline-offset-2 hover:underline md:mt-0"
                                onClick={() => router.push(`/classes/${item.id}`)}
                              >
                                Ver detalle de la clase
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}