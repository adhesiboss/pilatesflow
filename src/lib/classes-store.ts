import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export type ClassItem = {
  id: string;
  title: string;
  level: string;
  description: string;
  created_at: string;
};

type NewClassInput = {
  title: string;
  level: string;
  description: string;
};

type ClassesState = {
  classes: ClassItem[];
  isLoading: boolean;
  error?: string;
  fetchClasses: () => Promise<void>;
  addClass: (data: NewClassInput) => Promise<ClassItem | null>;
  updateClass: (id: string, data: Partial<NewClassInput>) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
};

export const useClassesStore = create<ClassesState>((set) => ({
  classes: [],
  isLoading: false,
  error: undefined,

  fetchClasses: async () => {
    set({ isLoading: true, error: undefined });

    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al obtener clases:", error);
      set({ error: error.message, isLoading: false });
      return;
    }

    set({ classes: (data as ClassItem[]) ?? [], isLoading: false });
  },

  addClass: async (data) => {
    const { data: inserted, error } = await supabase
      .from("classes")
      .insert({
        title: data.title,
        level: data.level,
        description: data.description,
      })
      .select()
      .single();

    if (error) {
      console.error("Error al crear clase en Supabase:", error);
      return null;
    }

    set((state) => ({
      classes: [inserted as ClassItem, ...state.classes],
    }));

    return inserted as ClassItem;
  },

  updateClass: async (id, data) => {
    const { data: updated, error } = await supabase
      .from("classes")
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error al actualizar clase:", error);
      return;
    }

    set((state) => ({
      classes: state.classes.map((cls) =>
        cls.id === id ? (updated as ClassItem) : cls
      ),
    }));
  },

  removeClass: async (id) => {
    const { error } = await supabase.from("classes").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar clase:", error);
      return;
    }

    set((state) => ({
      classes: state.classes.filter((cls) => cls.id !== id),
    }));
  },
}));