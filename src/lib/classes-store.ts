// src/lib/classes-store.ts
"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export interface ClassItem {
  id: string;
  title: string;
  level: string;
  description?: string | null;
  start_at?: string | null;
  duration_minutes?: number | null;
  capacity?: number | null;
  instructorEmail?: string | null;
  video_url?: string | null;
  discipline?: string | null;
  status?: "draft" | "published" | null;   // 👈 NUEVO
  created_at?: string | null;
}

// Tipo para crear una clase nueva desde el formulario
export type NewClassInput = {
  title: string;
  level: string;
  description?: string | null;
  start_at?: string | null;
  duration_minutes?: number | null;
  capacity?: number | null;
  instructorEmail?: string | null;
  video_url?: string | null;
  discipline?: string | null;
  status?: "draft" | "published" | null;   // 👈 NUEVO
};

// Tipo para actualizar una clase existente
export type UpdateClassInput = Partial<NewClassInput>;

interface ClassesState {
  classes: ClassItem[];
  isLoading: boolean;
  error: string | null;
  fetchClasses: () => Promise<void>;
  addClass: (input: NewClassInput) => Promise<ClassItem | null>;
  updateClass: (id: string, input: UpdateClassInput) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
}

export const useClassesStore = create<ClassesState>((set) => ({
  classes: [],
  isLoading: false,
  error: null,

  // Cargar todas las clases
  fetchClasses: async () => {
    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error cargando clases:", error);
      set({ isLoading: false, error: error.message });
      return;
    }

    set({
      classes: (data as ClassItem[]) ?? [],
      isLoading: false,
      error: null,
    });
  },

  // Crear una nueva clase
  addClass: async (input: NewClassInput) => {
    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from("classes")
      .insert({
        title: input.title,
        level: input.level,
        description: input.description ?? null,
        start_at: input.start_at ?? null,
        duration_minutes: input.duration_minutes ?? null,
        capacity: input.capacity ?? null,
        instructorEmail: input.instructorEmail ?? null,
        video_url: input.video_url ?? null,
        discipline: input.discipline ?? null,
        status: input.status ?? "published",        // 👈 NUEVO (default)
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error creando clase:", error);
      set({ isLoading: false, error: error.message });
      return null;
    }

    const created = data as ClassItem;

    set((state) => ({
      classes: [created, ...state.classes],
      isLoading: false,
      error: null,
    }));

    return created;
  },

  // Actualizar una clase existente
  updateClass: async (id: string, input: UpdateClassInput) => {
    set({ isLoading: true, error: null });

    const { error, data } = await supabase
      .from("classes")
      .update({
        title: input.title,
        level: input.level,
        description: input.description,
        start_at: input.start_at,
        duration_minutes: input.duration_minutes,
        capacity: input.capacity,
        instructorEmail: input.instructorEmail,
        video_url: input.video_url,
        discipline: input.discipline,
        status: input.status,                     // 👈 NUEVO
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Error actualizando clase:", error);
      set({ isLoading: false, error: error.message });
      return;
    }

    const updated = data as ClassItem;

    set((state) => ({
      classes: state.classes.map((c) => (c.id === id ? updated : c)),
      isLoading: false,
      error: null,
    }));
  },

  // Eliminar una clase
  removeClass: async (id: string) => {
    set({ isLoading: true, error: null });

    const { error } = await supabase.from("classes").delete().eq("id", id);

    if (error) {
      console.error("Error eliminando clase:", error);
      set({ isLoading: false, error: error.message });
      return;
    }

    set((state) => ({
      classes: state.classes.filter((c) => c.id !== id),
      isLoading: false,
      error: null,
    }));
  },
}));