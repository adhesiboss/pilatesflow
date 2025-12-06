import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

export type BookingItem = {
  id: string;
  classId: string;
  userEmail: string;
  created_at: string;
};

type ToggleResult = "reserved" | "cancelled" | "full" | "error";

type BookingsState = {
  bookings: BookingItem[];
  isLoading: boolean;
  error?: string;
  fetchBookingsForUser: (userEmail: string) => Promise<void>;
  fetchBookingsForClass: (classId: string) => Promise<void>;
  toggleBooking: (classId: string, userEmail: string) => Promise<ToggleResult>;
};

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  isLoading: false,
  error: undefined,

  fetchBookingsForUser: async (userEmail: string) => {
    set({ isLoading: true, error: undefined });

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("userEmail", userEmail)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(
        "Error al obtener reservas:",
        error.message,
        error.details,
        error.hint
      );
      set({ error: error.message, isLoading: false });
      return;
    }

    set({
      bookings: (data as BookingItem[]) ?? [],
      isLoading: false,
    });
  },

  fetchBookingsForClass: async (classId: string) => {
    set({ isLoading: true, error: undefined });

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("classId", classId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(
        "Error al obtener reservas de la clase:",
        error.message,
        error.details,
        error.hint
      );
      set({ error: error.message, isLoading: false });
      return;
    }

    set({
      bookings: (data as BookingItem[]) ?? [],
      isLoading: false,
    });
  },

  // 👇 aquí bloqueamos cuando se llena
  toggleBooking: async (classId: string, userEmail: string) => {
    const { bookings } = get();

    // 1. Si ya tiene reserva → cancelamos
    const existing = bookings.find(
      (b) => b.classId === classId && b.userEmail === userEmail
    );

    if (existing) {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", existing.id);

      if (error) {
        console.error(
          "Error al cancelar reserva:",
          error.message,
          error.details,
          error.hint
        );
        return "error";
      }

      set({
        bookings: bookings.filter((b) => b.id !== existing.id),
      });
      return "cancelled";
    }

    // 2. Si NO tiene reserva → revisar capacidad de la clase
    const { data: classData, error: classError } = await supabase
      .from("classes")
      .select("capacity")
      .eq("id", classId)
      .single();

    if (classError) {
      console.error(
        "Error al obtener capacidad de la clase:",
        classError.message,
        classError.details,
        classError.hint
      );
      return "error";
    }

    const capacity = classData?.capacity as number | null;

    if (typeof capacity === "number") {
      const { count, error: countError } = await supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("classId", classId);

      if (countError) {
        console.error(
          "Error al contar reservas de la clase:",
          countError.message,
          countError.details,
          countError.hint
        );
        return "error";
      }

      if (count !== null && count >= capacity) {
        // 👉 ya no hay cupos
        return "full";
      }
    }

    // 3. Crear reserva
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        classId,
        userEmail,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Error al crear reserva:",
        error.message,
        error.details,
        error.hint
      );
      return "error";
    }

    set({
      bookings: [...bookings, data as BookingItem],
    });

    return "reserved";
  },
}));