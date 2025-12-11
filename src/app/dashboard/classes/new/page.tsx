"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useClassesStore } from "@/lib/classes-store";
import { useAuthStore } from "@/lib/auth-store";

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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { toast } from "sonner";

const PILATES_DISCIPLINES = [
  "Mat",
  "Reformer",
  "Suelo",
  "Aparatos",
  "Embarazo",
  "Postparto",
  "Estiramiento",
  "Fuerza y centro",
];

export default function NewClassPage() {
  const addClass = useClassesStore((state) => state.addClass);
  const router = useRouter();

  const { user, profile } = useAuthStore();
  const instructorEmail = user?.email ?? null;
  const isAdmin = profile?.role === "admin";

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("Básico");
  const [description, setDescription] = useState("");

  const [startAt, setStartAt] = useState<string>(""); // datetime-local
  const [durationMinutes, setDurationMinutes] = useState<string>("60");
  const [capacity, setCapacity] = useState<string>("10");

  const [discipline, setDiscipline] = useState<string>(""); // 👈 NUEVO
  const [videoUrl, setVideoUrl] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    const parsedDuration =
      durationMinutes.trim() === "" ? null : Number(durationMinutes);
    const parsedCapacity =
      capacity.trim() === "" ? null : Number(capacity);

    const startAtIso = startAt ? new Date(startAt).toISOString() : null;

    const created = await addClass({
      title,
      level,
      description,
      instructorEmail,
      start_at: startAtIso,
      duration_minutes: Number.isNaN(parsedDuration) ? null : parsedDuration,
      capacity: Number.isNaN(parsedCapacity) ? null : parsedCapacity,
      video_url: videoUrl.trim() || null,
      discipline: discipline || null, // 👈 NUEVO
    });

    setIsSaving(false);

    if (created) {
      toast.success("Clase creada", {
        description: "Tu clase de Pilates se guardó correctamente.",
      });
      router.push("/dashboard/classes");
    } else {
      toast.error("Error al crear la clase", {
        description: "Revisa la consola para más detalles.",
      });
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <Card className="border-emerald-50 shadow-sm">
        <CardHeader>
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-500 uppercase">
            Nueva clase
          </p>
          <CardTitle className="mt-1 text-2xl">
            Diseña una sesión de Pilates
          </CardTitle>
          <CardDescription>
            Define el nivel, disciplina, horario, cupos y descripción de la
            clase que tus alumnas verán en la plataforma.
          </CardDescription>

          {instructorEmail && (
            <p className="mt-2 text-xs text-muted-foreground">
              Esta clase quedará asignada a{" "}
              <span className="font-medium text-emerald-700">
                {instructorEmail}
              </span>{" "}
              como instructor/a.
              {isAdmin && (
                <> (más adelante podrás cambiar el instructor desde la edición)</>
              )}
            </p>
          )}
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="title">Título de la clase</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Pilates Mat suave para la mañana"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

              {/* Disciplina */}
              <div className="space-y-1.5">
                <Label>Disciplina</Label>
                <Select
                  value={discipline}
                  onValueChange={(value) => setDiscipline(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {PILATES_DISCIPLINES.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="start_at">Fecha y hora</Label>
              <Input
                id="start_at"
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                Si lo dejas vacío, se mostrará como clase sin horario fijo.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Duración */}
              <div className="space-y-1.5">
                <Label htmlFor="duration">Duración (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={0}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </div>

              {/* Cupos */}
              <div className="space-y-1.5">
                <Label htmlFor="capacity">Cupos (alumnas)</Label>
                <Input
                  id="capacity"
                  type="number"
                  min={0}
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">
                  Puedes dejarlo vacío para no limitar los cupos.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Por ejemplo: clase enfocada en movilidad suave de columna, respiración y activación de centro."
                rows={4}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="video_url">Link del video (opcional)</Label>
              <Input
                id="video_url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Ej: https://mi-cdn.com/videos/pilates-mat.mp4 o enlace de YouTube"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/classes")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Guardando…" : "Guardar clase"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}