"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useClassesStore, type ClassItem } from "@/lib/classes-store";
import { supabase } from "@/lib/supabaseClient";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PublicClassDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params as { id: string }).id;

  const classes = useClassesStore((state) => state.classes);
  const [cls, setCls] = useState<ClassItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
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

    if (id) {
      load();
    }
  }, [classes, id]);

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
          <CardHeader className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-2xl md:text-3xl">
                {cls.title}
              </CardTitle>
              <span className="inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium text-emerald-700 border-emerald-200 bg-emerald-50">
                {cls.level}
              </span>
            </div>

            <CardDescription>
              Clase de Pilates guiada, pensada para que puedas moverte con calma
              y consciencia desde donde estés.
            </CardDescription>

            {createdAt && (
              <p className="text-xs text-muted-foreground">
                Publicada el <span className="font-medium">{createdAt}</span>
              </p>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <section className="space-y-1">
              <h2 className="text-sm font-semibold">Descripción de la clase</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {cls.description || "Esta clase aún no tiene una descripción."}
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}