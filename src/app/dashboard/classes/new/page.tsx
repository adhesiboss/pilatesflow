"use client";

import { useState } from "react";
import { useClassesStore } from "@/lib/classes-store";
import { useRouter } from "next/navigation";

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

export default function NewClassPage() {
  const addClass = useClassesStore((state) => state.addClass);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("Básico");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);

    const created = await addClass({ title, level, description });

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
            Define el nivel, enfoque y descripción de la clase que tus alumnas
            verán en la plataforma.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                placeholder="Por ejemplo: clase enfocada en movilidad suave de columna, respiración y activación de centro."
                rows={4}
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