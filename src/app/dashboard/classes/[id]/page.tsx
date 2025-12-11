"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  useClassesStore,
  type ClassItem,
} from "@/lib/classes-store";

import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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

// helper para mostrar video
function renderVideo(url: string) {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/
  );

  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
      <iframe
        src={embedUrl}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video de la clase"
      />
    );
  }

  return (
    <video controls className="h-full w-full">
      <source src={url} />
      Tu navegador no soporta la reproducción de video.
    </video>
  );
}

export default function EditClassPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params as { id: string }).id;

  const classes = useClassesStore((state) => state.classes);
  const updateClass = useClassesStore((state) => state.updateClass);
  const removeClass = useClassesStore((state) => state.removeClass);

  const [cls, setCls] = useState<ClassItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("Básico");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [discipline, setDiscipline] = useState<string>(""); // 👈 NUEVO

  useEffect(() => {
    async function load() {
      if (!id) return;
      setIsLoading(true);

      const fromStore = classes.find((c) => c.id === id);
      if (fromStore) {
        setCls(fromStore);
        setTitle(fromStore.title);
        setLevel(fromStore.level);
        setDescription(fromStore.description ?? "");
        setVideoUrl(fromStore.video_url ?? "");
        setDiscipline(fromStore.discipline ?? ""); // 👈
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("classes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error al cargar clase en edición:", error);
        toast.error("No pudimos cargar la clase");
        setCls(null);
        setIsLoading(false);
        return;
      }

      const loaded = data as ClassItem;
      setCls(loaded);
      setTitle(loaded.title);
      setLevel(loaded.level);
      setDescription(loaded.description ?? "");
      setVideoUrl(loaded.video_url ?? "");
      setDiscipline(loaded.discipline ?? ""); // 👈
      setIsLoading(false);
    }

    void load();
  }, [id, classes]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!cls) return;

    setIsSaving(true);

    await updateClass(cls.id, {
      title,
      level,
      description,
      video_url: videoUrl.trim() || null,
      discipline: discipline || null, // 👈 NUEVO
    });

    setIsSaving(false);

    toast.success("Clase actualizada", {
      description: "Los cambios se guardaron correctamente.",
    });
  }

  async function handleDelete() {
    if (!cls) return;

    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar esta clase? Esta acción no se puede deshacer."
    );

    if (!confirmed) return;

    setIsDeleting(true);
    await removeClass(cls.id);
    setIsDeleting(false);

    toast("Clase eliminada", {
      description: "La clase se eliminó del catálogo.",
    });

    router.push("/dashboard/classes");
  }

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground">
          Cargando datos de la clase…
        </p>
      </div>
    );
  }

  if (!cls) {
    return (
      <div className="p-6 md:p-10 max-w-3xl mx-auto">
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
              Volver al listado
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const trimmedVideoUrl = videoUrl.trim();

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <Card className="border-emerald-50 shadow-sm">
        <CardHeader>
          <p className="text-xs font-semibold tracking-[0.2em] text-emerald-500 uppercase">
            Editar clase
          </p>
          <CardTitle className="mt-1 text-2xl">{cls.title}</CardTitle>
          <CardDescription>
            Ajusta el contenido de la clase, nivel, disciplina, descripción y
            video asociado.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSave}>
            <div className="space-y-1.5">
              <Label htmlFor="title">Título de la clase</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Pilates Mat Suave para la Mañana"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="level">Nivel</Label>
                <Select value={level} onValueChange={(value) => setLevel(value)}>
                  <SelectTrigger id="level">
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
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el enfoque, la intensidad y los objetivos de esta clase."
                rows={4}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="video_url">Link del video (opcional)</Label>
              <Input
                id="video_url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="URL del video asociado a esta clase (YouTube o .mp4)"
              />
              <p className="text-[11px] text-muted-foreground">
                Puedes pegar un enlace directo a un archivo .mp4 o un link de
                YouTube.
              </p>

              {trimmedVideoUrl && (
                <div className="mt-2 space-y-1">
                  <p className="text-[11px] text-muted-foreground">
                    Previsualización:
                  </p>
                  <div className="aspect-video w-full overflow-hidden rounded-lg border bg-black/5">
                    {renderVideo(trimmedVideoUrl)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/classes")}
              >
                Volver al listado
              </Button>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={handleDelete}
                >
                  {isDeleting ? "Eliminando…" : "Eliminar clase"}
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Guardando…" : "Guardar cambios"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}