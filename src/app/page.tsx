// src/app/page.tsx
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/60 via-white to-white">
      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 md:py-16">
        {/* HERO */}
        <section className="flex flex-col items-center gap-10 md:flex-row md:items-stretch">
          {/* Texto principal */}
          <div className="flex-1 space-y-4 md:space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Pilates • Estudio digital
            </p>
            <h1 className="text-balance text-3xl font-semibold leading-tight text-neutral-900 md:text-4xl">
              Lleva tu estudio de Pilates a la pantalla, sin perder la calidez
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              PilatesFlow te permite organizar tus clases, compartir sesiones
              guiadas en video y darle a tus alumnas un espacio claro para
              practicar, reservar y seguir su propio progreso. Imagina que
              todas tienen un mismo lugar donde “viven” tus clases, sin links
              desperdigados.
            </p>

            {/* Sub-logo / dedicación */}
            <div className="mt-2 inline-flex flex-col rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-[11px] leading-tight shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-md">
              <span className="font-semibold tracking-[0.2em] uppercase text-emerald-700">
                PilatesFlow
              </span>
              <span className="text-[11px] text-emerald-800/90">
                a focused prototype lovingly crafted for{" "}
                <span className="font-medium">@aksaya_studio</span>
              </span>
              <span className="mt-1 text-[10px] text-emerald-800/70">
                Pensado para estudios boutique que quieren dar una experiencia
                digital cálida y ordenada.
              </span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-3">
              <Button
                asChild
                size="sm"
                className="gap-2 transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Link href="/classes">
                  Ver clases disponibles
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="sm"
                variant="outline"
                className="gap-2 border-emerald-200 text-emerald-900 transition-transform duration-150 hover:-translate-y-0.5 hover:border-emerald-300 active:translate-y-0"
              >
                <Link href="/login">
                  Soy instructora / estudio
                  <Sparkles className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Bullets rápidos */}
            <div className="mt-4 grid gap-3 text-xs text-neutral-700 sm:grid-cols-3">
              <div className="flex items-center gap-2 transition-transform duration-150 hover:-translate-y-0.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                </span>
                <span>Agenda clara para tus alumnas</span>
              </div>
              <div className="flex items-center gap-2 transition-transform duration-150 hover:-translate-y-0.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                  <PlayCircle className="h-3.5 w-3.5 text-emerald-700" />
                </span>
                <span>Clases guiadas en video</span>
              </div>
              <div className="flex items-center gap-2 transition-transform duration-150 hover:-translate-y-0.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                  <CalendarClock className="h-3.5 w-3.5 text-emerald-700" />
                </span>
                <span>Horarios y niveles organizados</span>
              </div>
            </div>
          </div>

          {/* Bloque visual / mockup */}
          <div className="flex-1">
            <div className="group relative mx-auto max-w-md overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
              {/* “Header” del mockup */}
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-emerald-50">
                    PF
                  </span>
                  <div className="leading-tight">
                    <p className="text-xs font-semibold text-neutral-900">
                      Sesión Mat Suave
                    </p>
                    <p className="text-[11px] text-emerald-700">
                      25 min · Nivel básico
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                  Alumna · Plan Free
                </span>
              </div>

              {/* Imagen “video” */}
              <div className="relative aspect-video w-full bg-neutral-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-2 ring-white/40 backdrop-blur transition-transform duration-200 group-hover:scale-110 animate-pulse">
                    <PlayCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>

              {/* Mini lista de clases dentro del mockup */}
              <div className="space-y-2 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-500">
                  Próximas clases
                </p>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-2 py-1.5 transition-colors duration-150 group-hover:bg-emerald-50/90">
                    <div className="flex flex-col">
                      <span className="font-medium text-emerald-900">
                        Reformer intermedio
                      </span>
                      <span className="text-[10px] text-emerald-800/80">
                        Miércoles · 19:00
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-emerald-700">
                      6 / 10 cupos
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-neutral-50">
                    <div className="flex flex-col">
                      <span className="font-medium text-neutral-900">
                        Mat suave embarazo
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        Jueves · On-demand
                      </span>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700">
                      Video
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-neutral-50">
                    <div className="flex flex-col">
                      <span className="font-medium text-neutral-900">
                        Movilidad y respiración
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        Domingo · 20 min
                      </span>
                    </div>
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700">
                      Básico
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BLOQUE: Pensado para alumnas */}
        <section className="space-y-5">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Para tus alumnas
            </p>
            <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
              Un espacio claro para practicar y no perderse entre links sueltos
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
              La idea es que tus alumnas sientan que tienen “su lugar” con tus
              clases: entran, ven qué les toca hoy, marcan lo que ya hicieron y
              continúan su práctica sin fricción.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-emerald-50 bg-white/80 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Agenda visual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>
                  Las alumnas ven sus próximas clases, cupos y nivel en un mismo
                  lugar. Nada de screenshots de WhatsApp o PDFs perdidos.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-50 bg-white/80 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  Clases guiadas en video
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>
                  Integra tus videos para que puedan practicar cuando tengan un
                  rato libre: 20–30 minutos entre el trabajo, la casa y el resto
                  de la vida.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-50 bg-white/80 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Plan y progreso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>
                  Cada alumna sabe cuántas clases tiene activas según su plan y
                  puede ir marcando lo que ya practicó para ver cómo avanza en
                  el mes.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* BLOQUE: Para estudios / instructoras */}
        <section className="space-y-5">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Para estudios e instructoras
            </p>
            <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
              Menos administración, más energía para enseñar
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
              Que la parte administrativa no se coma tu energía. Deja que
              PilatesFlow se encargue de la organización y tú de sostener la
              práctica de tus alumnas.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-emerald-50 bg-white/80 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Organiza tus clases</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>
                  Crea clases con nivel, disciplina, capacidad y horario. Todo
                  queda ordenado y listo para que tus alumnas reserven o
                  practiquen online.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-50 bg-white/80 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Planes y acceso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>
                  Define planes como{" "}
                  <span className="font-medium">Free</span> o{" "}
                  <span className="font-medium">Activa</span> y controla cuántas
                  sesiones puede tener reservadas cada alumna.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-50 bg-white/80 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Listo para escalar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>
                  Pensado como plataforma white-label: en el futuro podrás usar
                  tu logo, tus colores y tu propio subdominio para tu estudio.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CÓMO FUNCIONA */}
        <section className="space-y-5">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Cómo funciona
            </p>
            <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
              De “tengo clases sueltas” a un estudio digital ordenado
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
              El flujo está pensado para que no tengas que aprender una
              herramienta nueva gigante: solo organizar tus clases como ya las
              das hoy, pero en digital.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-emerald-50 bg-white/90 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-800">
                    1
                  </span>
                  Configuras tu estudio
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1.5">
                <p>
                  Creas tus clases con nivel, disciplina, horario y capacidad.
                  Puedes mezclar sesiones presenciales con contenido on-demand.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-50 bg-white/90 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-800">
                    2
                  </span>
                  Tus alumnas se registran
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1.5">
                <p>
                  Cada alumna crea su usuario, elige su plan (Free / Activa) y
                  puede reservar los cupos que tenga disponibles según ese plan.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-50 bg-white/90 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-800">
                    3
                  </span>
                  Practican y siguen su progreso
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1.5">
                <p>
                  Las alumnas ven su agenda, marcan clases como completadas y
                  pueden volver a ver las sesiones en video cuando lo necesiten.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* TESTIMONIOS FICTICIOS */}
        <section className="space-y-5">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Lo que podrías escuchar
            </p>
            <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
              Testimonios que imaginamos para tus alumnas
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-emerald-50 bg-white/90 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardContent className="space-y-2 p-4 text-xs md:text-sm text-muted-foreground">
                <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-600">
                  Alumna · Plan Activa
                </p>
                <p>
                  “Ahora sé exactamente qué clase me toca cada semana y puedo
                  repetir mis favoritas cuando tengo media hora libre. Siento
                  que por fin mi práctica tiene un hilo.”
                </p>
                <p className="text-[11px] text-neutral-500">— Nombre ficticio</p>
              </CardContent>
            </Card>

            <Card className="border-emerald-50 bg-white/90 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardContent className="space-y-2 p-4 text-xs md:text-sm text-muted-foreground">
                <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-600">
                  Instructora
                </p>
                <p>
                  “Antes tenía todo repartido entre notas, WhatsApp y Drive. Con
                  PilatesFlow siento que mi estudio existe en un solo lugar y
                  que las alumnas lo entienden de inmediato.”
                </p>
                <p className="text-[11px] text-neutral-500">— Nombre ficticio</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* PLANES */}
        <section className="space-y-5">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Planes
            </p>
            <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
              Empieza simple y escala cuando lo necesites
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
              Estos planes son una referencia para mostrar cómo se podría
              ofrecer el servicio. No hay cobro real todavía: es un prototipo
              funcional para Aksaya Studio.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Plan Free */}
            <Card className="border-emerald-100 bg-white/90 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-baseline justify-between">
                  <span>Plan Free</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Alumna
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <p className="text-2xl font-semibold text-neutral-900">
                  $0
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}
                    / mes
                  </span>
                </p>
                <ul className="space-y-1">
                  <li>• Hasta 4 clases reservadas al mismo tiempo</li>
                  <li>• Acceso a clases abiertas del estudio</li>
                  <li>• Marcado de clases completadas</li>
                </ul>
              </CardContent>
            </Card>

            {/* Plan Activa */}
            <Card className="border-emerald-200 bg-emerald-50/80 shadow-sm transition duration-150 hover:-translate-y-0.5 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-baseline justify-between">
                  <span>Plan Activa</span>
                  <span className="text-xs font-normal text-emerald-800">
                    Alumna frecuente
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-emerald-900">
                <p className="text-2xl font-semibold text-neutral-900">
                  $XX.XXX
                  <span className="text-xs font-normal text-emerald-800">
                    {" "}
                    / mes
                  </span>
                </p>
                <ul className="space-y-1">
                  <li>• Hasta 12 clases reservadas al mismo tiempo</li>
                  <li>• Acceso completo al catálogo de on-demand</li>
                  <li>• Seguimiento de progreso y racha de práctica</li>
                </ul>
              </CardContent>
            </Card>

            {/* Plan Studio / Instructora */}
            <Card className="border-neutral-200 bg-white/80 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-baseline justify-between">
                  <span>Plan Studio</span>
                  <span className="text-xs font-normal text-neutral-500">
                    Próximamente
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <p className="text-2xl font-semibold text-neutral-900">
                  A definir
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}
                    / mes
                  </span>
                </p>
                <ul className="space-y-1">
                  <li>• Panel para instructoras / estudios</li>
                  <li>• Branding propio (logo, colores)</li>
                  <li>• Gestión de alumnas y planes</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQS */}
        <section className="space-y-5">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Preguntas frecuentes
            </p>
            <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
              Lo que normalmente preguntan antes de probar
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 text-xs md:text-sm text-muted-foreground">
            <Card className="border-emerald-50 bg-white/90 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  ¿Esta plataforma ya cobra a las alumnas?
                </CardTitle>
              </CardHeader>
              <CardContent>
                No. Este es un prototipo funcional pensado para mostrar cómo se
                vería la experiencia completa. Los pagos se podrían conectar más
                adelante con Stripe u otra pasarela.
              </CardContent>
            </Card>

            <Card className="border-emerald-50 bg-white/90 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  ¿Las alumnas necesitan crear usuario?
                </CardTitle>
              </CardHeader>
              <CardContent>
                Sí. Cada alumna tiene su usuario con email y contraseña, para
                que pueda ver sus clases reservadas, marcar completadas y
                revisar su progreso.
              </CardContent>
            </Card>

            <Card className="border-emerald-50 bg-white/90 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  ¿Puedo subir mis propios videos?
                </CardTitle>
              </CardHeader>
              <CardContent>
                Las clases aceptan una URL de video (por ejemplo, un enlace
                privado de YouTube o Vimeo). Eso permite mezclar clases
                presenciales con contenido on-demand.
              </CardContent>
            </Card>

            <Card className="border-emerald-50 bg-white/90 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">
                  ¿Se puede adaptar al branding de mi estudio?
                </CardTitle>
              </CardHeader>
              <CardContent>
                La idea de PilatesFlow es ser una base white-label. Hoy está
                personalizado para Aksaya Studio, pero la arquitectura está
                pensada para soportar otros estudios en el futuro.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="rounded-3xl border border-emerald-100 bg-emerald-50/80 px-5 py-6 md:px-8 md:py-7 transition duration-150 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                Empezar
              </p>
              <h2 className="text-base font-semibold text-neutral-900 md:text-lg">
                ¿Te gustaría probar cómo se vería tu estudio en PilatesFlow?
              </h2>
              <p className="text-xs text-emerald-900/80 md:text-sm">
                Explora las clases como alumna o ingresa para configurar tu
                primer set de sesiones guiadas.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="sm"
                className="gap-2 bg-emerald-600 transition-transform duration-150 hover:-translate-y-0.5 hover:bg-emerald-700 active:translate-y-0"
              >
                <Link href="/classes">
                  Ver clases como alumna
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="gap-2 border-emerald-200 text-emerald-900 transition-transform duration-150 hover:-translate-y-0.5 hover:border-emerald-300 active:translate-y-0"
              >
                <Link href="/login">Entrar como instructora</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER MINI */}
      <footer className="border-t border-emerald-100/60 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-4 text-[11px] text-neutral-500 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} PilatesFlow. Prototype dedicated to{" "}
            <span className="font-medium text-emerald-700">
              @aksaya_studio
            </span>
            .
          </p>
          <p className="text-[10px]">
            Design & development concept · All rights reserved to their
            respective creators and studios.
          </p>
        </div>
      </footer>
    </div>
  );
}