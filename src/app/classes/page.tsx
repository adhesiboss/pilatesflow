"use client";

import { useEffect, useMemo, useState } from "react";
import { useClassesStore } from "@/lib/classes-store";
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

export default function PublicClassesPage() {
  const classes = useClassesStore((state) => state.classes);
  const isLoading = useClassesStore((state) => state.isLoading);
  const fetchClasses = useClassesStore((state) => state.fetchClasses);

  const router = useRouter();

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("Todos");

  useEffect(() => {
    fetchClasses();
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-emerald-50/40 to-white">
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
            Encuentra la práctica perfecta para tu momento del día: clases
            suaves, intermedias o desafiantes, todas diseñadas para ayudarte a
            moverte con conciencia.
          </p>
        </section>

        {/* Filtros */}
        <section className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <Input
              placeholder="Buscar por nombre de clase o enfoque…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white"
            />
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
              búsqueda o cambiar el nivel.
            </p>
          )}

          {!isLoading && filteredClasses.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredClasses.map((cls) => (
                <Card
                  key={cls.id}
                  className="border-emerald-50 hover:border-emerald-200 hover:shadow-sm transition cursor-pointer flex flex-col"
                  onClick={() => router.push(`/dashboard/classes/${cls.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base line-clamp-2">
                        {cls.title}
                      </CardTitle>
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium text-emerald-700 border-emerald-200 bg-emerald-50">
                        {cls.level}
                      </span>
                    </div>
                    <CardDescription className="text-xs line-clamp-3 mt-1">
                      {cls.description || "Clase de Pilates sin descripción."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard/classes/${cls.id}`);
                      }}
                    >
                      Ver detalles de la clase
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}