"use client";

import { useEffect, useMemo, useState } from "react";
import { useClassesStore } from "@/lib/classes-store";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { PlayCircle } from "lucide-react";

function getRoleLabel(role: "admin" | "instructor" | "alumna" | undefined) {
  if (!role) return "";
  if (role === "admin") return "Administrador/a";
  if (role === "instructor") return "Instructor/a";
  return "Alumna";
}

export default function ClassesDashboardPage() {
  const classes = useClassesStore((state) => state.classes);
  const isLoading = useClassesStore((state) => state.isLoading);
  const fetchClasses = useClassesStore((state) => state.fetchClasses);

  const router = useRouter();

  const { profile } = useAuthStore();
  const roleLabel = getRoleLabel(profile?.role);

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("Todos");

  useEffect(() => {
    void fetchClasses();
  }, [fetchClasses]);

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

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-500 uppercase">
            Pilates Studio
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold mt-1">
            Mis clases
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra el catálogo de clases de tu estudio: crea, edita y
            organiza tus sesiones.
          </p>
        </div>

        <Button asChild className="mt-2 md:mt-0">
          <span onClick={() => router.push("/dashboard/classes/new")}>
            Nueva clase
          </span>
        </Button>
      </div>

      {/* Aviso de rol actual */}
      {profile && (
        <div className="mb-2 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs text-emerald-800">
          Estás usando el dashboard como{" "}
          <span className="font-semibold">{roleLabel}</span>.
        </div>
      )}

      {/* Filtros */}
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

      {/* Tabla de clases */}
      <Card className="border-emerald-50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">
            Clases creadas
          </CardTitle>
          <CardDescription>
            Haz clic en una fila para editar o revisar el detalle de una clase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Cargando clases del estudio…
            </p>
          )}

          {!isLoading && classes.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <p className="text-sm font-medium">
                Aún no tienes clases creadas.
              </p>
              <p className="text-xs text-muted-foreground max-w-sm">
                Comienza creando tu primera clase, por ejemplo “Pilates Mat
                Básico” o “Reformer Suave para la Mañana”.
              </p>
              <Button
                className="mt-2"
                onClick={() => router.push("/dashboard/classes/new")}
              >
                Crear mi primera clase
              </Button>
            </div>
          )}

          {!isLoading && classes.length > 0 && filteredClasses.length === 0 && (
            <p className="text-sm text-muted-foreground py-6">
              No encontramos clases que coincidan con los filtros actuales.
              Prueba con otro nivel o busca por otra palabra clave.
            </p>
          )}

          {!isLoading && filteredClasses.length > 0 && (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Descripción</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.map((cls) => (
                    <TableRow
                      key={cls.id}
                      className="cursor-pointer hover:bg-emerald-50/40"
                      onClick={() =>
                        router.push(`/dashboard/classes/${cls.id}`)
                      }
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{cls.title}</span>
                          {cls.video_url && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
                              <PlayCircle className="h-3 w-3" />
                              Video
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs md:text-sm">
                        {cls.level}
                      </TableCell>
                      <TableCell className="text-xs md:text-sm text-muted-foreground">
                        {cls.description?.slice(0, 80)}
                        {cls.description && cls.description.length > 80
                          ? "…"
                          : ""}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}