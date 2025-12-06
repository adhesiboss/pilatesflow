"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useClassesStore, type ClassItem } from "@/lib/classes-store";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/lib/auth-store";
import { useBookingsStore } from "@/lib/bookings-store";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function ClassDetailDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params as { id: string }).id;

  // store de clases
  const { classes, isLoading, fetchClasses, updateClass, removeClass } =
    useClassesStore();

  // auth / rol
  const { user, profile, initialized, init } = useAuthStore();

  // bookings de esta clase
  const {
    bookings,
    isLoading: isLoadingBookings,
    fetchBookingsForClass,
  } = useBookingsStore();

  const [cls, setCls] = useState<ClassItem | null>(null);
  const [isLoadingClass, setIsLoadingClass] = useState(true);

  // estado del form
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("Básico");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // init auth-store
  useEffect(() => {
    if (!initialized) {
      init();
    }
  }, [initialized, init]);

  // guard: solo admin / instructor
  useEffect(() => {
    if (!initialized) return;

    if (!user || !profile) {
      router.replace("/login");
      return;
    }

    if (profile.role === "alumna") {
      router.replace("/dashboard/alumna");
      return;
    }
  }, [initialized, user, profile, router]);

  // cargar clases en el store (si aún no están)
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // cargar clase concreta (store → fallback supabase) y sincronizar form
  useEffect(() => {
    async function load() {
      setIsLoadingClass(true);

      const fromStore = classes.find((c) => c.id === id);
      if (fromStore) {
        setCls(fromStore);
        setTitle(fromStore.title);
        setLevel(fromStore.level);
        setDescription(fromStore.description ?? "");
        setIsLoadingClass(false);
        return;
      }

      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error cargando clase en dashboard:", error);
        setCls(null);
      } else {
        const loaded = data as ClassItem;
        setCls(loaded);
        setTitle(loaded.title);
        setLevel(loaded.level);
        setDescription(loaded.description ?? "");
      }
      setIsLoadingClass(false);
    }

    if (id) {
      void load();
    }
  }, [classes, id]);

  // cargar reservas de esta clase
  useEffect(() => {
    if (!id) return;
    void fetchBookingsForClass(id);
  }, [id, fetchBookingsForClass]);

  const createdAt = cls?.created_at
    ? new Date(cls.created_at).toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

  const totalBookings = bookings.length;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!cls) return;

    setIsSaving(true);
    await updateClass(cls.id, {
      title,
      level,
      description,
    });
    setIsSaving(false);

    toast.success("Clase actualizada", {
      description: "Los cambios se guardaron correctamente.",
    });
  }

  async function handleDelete() {
    if (!cls) return;
    const ok = confirm(
      "¿Seguro que quieres eliminar esta clase? Esta acción no se puede deshacer."
    );
    if (!ok) return;

    setIsDeleting(true);
    await removeClass(cls.id);
    setIsDeleting(false);

    toast.success("Clase eliminada");
    router.push("/dashboard/classes");
  }

  if (!initialized || isLoadingClass) {
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

  if (!cls && !isLoading) {
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
              <Button onClick={() => router.push("/dashboard/classes")}>
                Volver al listado de clases
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/40 to-white">
      <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="px-0 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/dashboard/classes")}
        >
          ← Volver al dashboard de clases
        </Button>

        {/* Formulario de edición */}
        <Card className="border-emerald-50 shadow-sm">
          <CardHeader className="space-y-1.5">
            <CardTitle className="text-lg md:text-xl">
              Editar clase
            </CardTitle>
            <CardDescription>
              Ajusta el título, nivel y descripción de esta clase. Los cambios
              se verán reflejados en el catálogo y en la agenda de alumnas.
            </CardDescription>
            {createdAt && (
              <p className="text-xs text-muted-foreground">
                Creada el{" "}
                <span className="font-medium">
                  {createdAt}
                </span>
              </p>
            )}
          </CardHeader>

          <CardContent>
            <form className="space-y-5" onSubmit={handleSave}>
              <div className="space-y-1.5">
                <Label htmlFor="title">Título de la clase</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label>Nivel</Label>
                <Select value={level} onValueChange={(value) => setLevel(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Básico">Básico</SelectItem>
                    <SelectItem value="Intermedio">Intermedio</SelectItem>
                    <SelectItem value="Avanzado">Avanzado</SelectItem>
                    <SelectItem value="Todos los niveles">
                      Todos los niveles
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe brevemente el enfoque, intensidad o material necesario para esta clase."
                />
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={handleDelete}
                >
                  {isDeleting ? "Eliminando…" : "Eliminar clase"}
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/classes")}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Guardando…" : "Guardar cambios"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Alumnas inscritas */}
        <Card className="border-emerald-50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base md:text-lg">
              Alumnas inscritas ({totalBookings})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingBookings && (
              <p className="text-sm text-muted-foreground">
                Cargando reservas de esta clase…
              </p>
            )}

            {!isLoadingBookings && totalBookings === 0 && (
              <p className="text-sm text-muted-foreground">
                Aún no hay alumnas inscritas en esta clase.
              </p>
            )}

            {!isLoadingBookings && totalBookings > 0 && (
              <ul className="space-y-2 text-sm">
                {bookings.map((b) => (
                  <li
                    key={b.id}
                    className="flex items-center justify-between rounded-md border border-emerald-50 bg-emerald-50/40 px-3 py-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{b.userEmail}</span>
                      <span className="text-xs text-muted-foreground">
                        Reservó el{" "}
                        {new Date(b.created_at).toLocaleString("es-CL")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}