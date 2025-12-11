// src/lib/progress-store.ts
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export type ProgressToggleResult = "completed" | "removed" | "error";

export interface ProgressItem {
  id: string;
  userEmail: string;
  classId: string;
  completed_at: string | null;
}

interface ProgressState {
  items: ProgressItem[];
  isLoading: boolean;
  error: string | null;
  fetchProgressForUser: (userEmail: string) => Promise<void>;
  toggleCompleted: (
    classId: string,
    userEmail: string
  ) => Promise<ProgressToggleResult>;
}

export const useProgressStore = create<ProgressState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  // Cargar progreso de una alumna
  fetchProgressForUser: async (userEmail: string) => {
    if (!userEmail) return;

    set({ isLoading: true, error: null });

    const { data, error } = await supabase
      .from("class_progress")
      // 👇 columnas reales en la BD: useremail, classid, completed_at
      .select("id, useremail, classid, completed_at")
      .eq("useremail", userEmail)
      .order("completed_at", { ascending: false });

    if (error) {
      console.warn(
        "Error al obtener progreso:",
        error.message ?? error,
        error
      );
      set({
        isLoading: false,
        error: error.message ?? "Error al obtener progreso",
      });
      return;
    }

    const mapped: ProgressItem[] = ((data ?? []) as {
      id: string;
      useremail: string;
      classid: string;
      completed_at: string | null;
    }[]).map((row) => ({
      id: row.id,
      userEmail: row.useremail,
      classId: row.classid,
      completed_at: row.completed_at,
    }));

    set({
      items: mapped,
      isLoading: false,
      error: null,
    });
  },

  // Marcar / desmarcar clase como completada
  toggleCompleted: async (
    classId: string,
    userEmail: string
  ): Promise<ProgressToggleResult> => {
    set({ isLoading: true, error: null });

    // 1) ¿Ya existe registro para (userEmail, classId)?
    const { data: existingRows, error: existingError } = await supabase
      .from("class_progress")
      .select("id")
      .eq("useremail", userEmail)
      .eq("classid", classId)
      .limit(1);

    if (existingError) {
      console.warn(
        "Error revisando progreso existente:",
        existingError.message ?? existingError,
        existingError
      );
      set({
        isLoading: false,
        error: existingError.message ?? "Error revisando progreso",
      });
      return "error";
    }

    const alreadyExists =
      Array.isArray(existingRows) && existingRows.length > 0;

    // 2) Si ya estaba → eliminar (marcar como pendiente)
    if (alreadyExists) {
      const idToDelete = existingRows![0].id as string;

      const { error: deleteError } = await supabase
        .from("class_progress")
        .delete()
        .eq("id", idToDelete);

      if (deleteError) {
        console.warn(
          "Error al eliminar progreso:",
          deleteError.message ?? deleteError,
          deleteError
        );
        set({
          isLoading: false,
          error: deleteError.message ?? "Error al eliminar progreso",
        });
        return "error";
      }

      set((state) => ({
        items: state.items.filter((item) => item.id !== idToDelete),
        isLoading: false,
      }));

      return "removed";
    }

    // 3) Si no existía → insertar nuevo (completada)
    const { data: inserted, error: insertError } = await supabase
      .from("class_progress")
      .insert({
        // nombres reales de columna
        useremail: userEmail,
        classid: classId,
        // completed_at tiene default now(), así que podríamos omitirlo
      })
      .select("id, useremail, classid, completed_at")
      .single();

    if (insertError) {
      console.warn(
        "Error al registrar progreso:",
        insertError.message ?? insertError,
        insertError
      );
      set({
        isLoading: false,
        error: insertError.message ?? "Error al registrar progreso",
      });
      return "error";
    }

    if (inserted) {
      const newItem: ProgressItem = {
        id: inserted.id,
        userEmail: inserted.useremail,
        classId: inserted.classid,
        completed_at: inserted.completed_at,
      };

      set((state) => ({
        items: [newItem, ...state.items],
        isLoading: false,
        error: null,
      }));
    } else {
      set({ isLoading: false });
    }

    return "completed";
  },
}));