// src/lib/auth-store.ts
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js";

export type Role = "admin" | "instructor" | "alumna";
export type Plan = "free" | "activa";

export interface Profile {
  role: Role;
  plan?: Plan | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  init: () => Promise<void>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,
  error: null,

  init: async () => {
    if (get().initialized) return;

    set({ loading: true });

    const { data, error: userError } = await supabase.auth.getUser();
    const user = data?.user ?? null;

    if (userError || !user) {
      if (userError) {
        console.warn("⚠️ Error al obtener usuario:", userError.message);
      }
      set({
        user: null,
        profile: null,
        loading: false,
        initialized: true,
        error: null,
      });
      return;
    }

    const { data: profileRow, error: profileError } = await supabase
      .from("profiles")
      .select("role, plan")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.warn("⚠️ Error cargando profile:", profileError.message);
    }

    const profile: Profile | null = profileRow
      ? {
          role: profileRow.role as Role,
          plan: (profileRow.plan ?? "free") as Plan,
        }
      : null;

    set({
      user,
      profile,
      loading: false,
      initialized: true,
      error: null,
    });
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      set({ loading: false, error: error.message });
      return { ok: false, error: error.message };
    }

    const { data } = await supabase.auth.getUser();
    const user = data.user ?? null;

    let profile: Profile | null = null;
    if (user) {
      const { data: profileRow, error: profileError } = await supabase
        .from("profiles")
        .select("role, plan")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.warn(
          "⚠️ Error cargando profile (signIn):",
          profileError.message
        );
      }

      if (profileRow) {
        profile = {
          role: profileRow.role as Role,
          plan: (profileRow.plan ?? "free") as Plan,
        };
      }
    }

    set({
      user,
      profile,
      loading: false,
      error: null,
      initialized: true,
    });

    return { ok: true };
  },

  signUp: async (email, password) => {
    set({ loading: true, error: null });

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      set({ loading: false, error: error.message });
      return { ok: false, error: error.message };
    }

    set({ loading: false, error: null });
    return { ok: true };
  },

  signOut: async () => {
    set({ loading: true });

    const { error } = await supabase.auth.signOut();

    if (error) {
      set({ loading: false, error: error.message });
      return;
    }

    set({
      user: null,
      profile: null,
      loading: false,
      initialized: true,
      error: null,
    });
  },
}));