"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

export default function TestSupabasePage() {
  const [message, setMessage] = useState("");

  async function testConnection() {
    const { data, error } = await supabase.from("classes").select("*").limit(1);

    if (error) {
      setMessage("❌ Error: " + error.message);
    } else {
      setMessage("✅ Conexión exitosa. Clases encontradas: " + data.length);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Prueba de conexión Supabase</h1>
      <button
        onClick={testConnection}
        className="px-4 py-2 bg-black text-white rounded-md"
      >
        Probar conexión
      </button>
      <p className="mt-4 text-sm">{message}</p>
    </div>
  );
}