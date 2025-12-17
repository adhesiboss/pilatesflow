// src/app/estudio/page.tsx
import Link from "next/link";

export default function EstudioPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/40 to-white">
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-16 space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
            Sobre PilatesFlow
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">
            Un pequeño estudio digital dedicado a Aksaya Studio
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            PilatesFlow nació como un prototipo cuidado para imaginar cómo se
            vería un estudio de Pilates llevado a la pantalla, sin perder la
            calidez de una clase presencial.
          </p>
        </header>

        <section className="space-y-3 text-sm md:text-base text-neutral-700">
          <p>
            La idea es simple: crear un lugar donde las alumnas tengan claridad
            sobre sus clases, puedan repetir sesiones guiadas en video y
            sientan que su práctica tiene un hilo durante el mes.
          </p>
          <p>
            Este prototipo está{" "}
            <span className="font-medium">dedicado a Aksaya Studio</span> y a
            todas las personas que sostienen espacios de movimiento consciente,
            respiración presente y cuidado del cuerpo.
          </p>
          <p>
            No es aún una plataforma comercial ni un producto terminado, sino
            una base viva para explorar: agenda, clases on-demand y seguimiento
            suave del progreso de cada alumna.
          </p>
        </section>

        <section className="space-y-3 text-sm md:text-base text-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-900">
            Qué puedes encontrar aquí
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Un catálogo simple de clases con nivel, enfoque y duración.</li>
            <li>Sesiones con video para practicar en casa o donde estés.</li>
            <li>Un espacio de alumna con resumen de práctica y racha.</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Todo esto es parte de un recorrido de diseño y desarrollo, más que
            un producto final. La intención principal es aprender, explorar y
            abrir la puerta a futuros estudios digitales.
          </p>
        </section>

        <footer className="pt-4 text-sm text-muted-foreground">
          <p>
            Si llegaste hasta aquí curioseando el prototipo, puedes volver a la{" "}
            <Link
              href="/"
              className="font-medium text-emerald-700 underline-offset-2 hover:underline"
            >
              página principal
            </Link>{" "}
            o explorar las{" "}
            <Link
              href="/classes"
              className="font-medium text-emerald-700 underline-offset-2 hover:underline"
            >
              clases disponibles
            </Link>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}