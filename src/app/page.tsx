"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/60 to-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 md:flex-row md:items-center md:justify-between">
        <section className="space-y-4 md:max-w-xl">
          <p className="text-xs font-semibold tracking-[0.25em] text-emerald-500 uppercase">
            Plataforma para estudios de Pilates
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold">
            Diseña, organiza y comparte tus clases de Pilates.
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            PilatesFlow te ayuda a gestionar el catálogo de clases de tu
            estudio y ofrecer una experiencia clara a tus alumnas: niveles,
            descripciones y sesiones listas para reservar o ver on-demand.
          </p>

          <div className="flex flex-col gap-3 pt-3 sm:flex-row">
            <Button asChild>
              <Link href="/dashboard/classes">Entrar al dashboard</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/classes">Ver clases públicas</Link>
            </Button>
          </div>
        </section>

        <section className="mt-4 md:mt-0 md:max-w-sm">
          <div className="rounded-3xl border border-emerald-100 bg-white/70 p-5 shadow-sm">
            <p className="text-xs font-semibold tracking-[0.25em] text-emerald-500 uppercase mb-2">
              Vista previa
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Crea sesiones como “Pilates Mat Suave”, “Reformer Intermedio” o
              “Movilidad de columna” y organízalas por nivel, duración y foco.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-emerald-50 bg-emerald-50/60 px-3 py-2">
                <span>Pilates Mat – Básico</span>
                <span className="text-[10px] font-medium text-emerald-700">
                  35 min
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border px-3 py-2">
                <span>Reformer – Intermedio</span>
                <span className="text-[10px] font-medium text-slate-500">
                  45 min
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border px-3 py-2">
                <span>Suelo – Movilidad de cadera</span>
                <span className="text-[10px] font-medium text-slate-500">
                  30 min
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}