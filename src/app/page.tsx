// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AKSAYA_IMAGES } from "@/lib/aksaya-images";

// Tipo para el feed de Instagram
type InstagramMedia = {
  id: string;
  caption?: string;
  media_url: string;
  permalink: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  thumbnail_url?: string;
  username?: string;
};

// Variantes de animación
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Mock de productos para el Home (luego puede salir a un archivo separado / BD)
const HOME_PRODUCTS = [
  {
    id: "mat-ecologico",
    name: "Mat ecológico Aksaya",
    description:
      "Un mat con buen agarre y textura suave, pensado para prácticas suaves y de mediana intensidad.",
    priceLabel: "$39.990 CLP",
    tag: "Producto físico",
    image: AKSAYA_IMAGES.studioHero,
  },
  {
    id: "bloques-corcho",
    name: "Bloques de corcho",
    description:
      "Bloques firmes pero amables, perfectos para acompañar a alumnas en procesos de movilidad y soporte.",
    priceLabel: "$18.990 CLP",
    tag: "Producto físico",
    image: AKSAYA_IMAGES.students,
  },
  {
    id: "programa-30-dias",
    name: "Programa digital · 30 días suave",
    description:
      "Un recorrido de 30 días con secuencias cortas para crear el hábito de volver a la esterilla sin presión.",
    priceLabel: "$24.990 CLP",
    tag: "Programa digital",
    image: AKSAYA_IMAGES.studioHero,
  },
];

export default function HomePage() {
  const currentYear = new Date().getFullYear();

  const [instagramMedia, setInstagramMedia] = useState<InstagramMedia[]>([]);
  const [igError, setIgError] = useState<string | null>(null);
  const [igLoading, setIgLoading] = useState(true);

  useEffect(() => {
    async function loadInstagram() {
      try {
        const res = await fetch("/api/instagram");
        if (!res.ok) throw new Error("Error al cargar Instagram");

        const json = await res.json();
        const data: InstagramMedia[] = json.data || [];
        setInstagramMedia(data);
      } catch (err) {
        console.error(err);
        setIgError("No pudimos cargar el feed de Instagram ahora.");
      } finally {
        setIgLoading(false);
      }
    }

    loadInstagram();
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white">
      {/* Halos / aura de luz */}
      <div className="pointer-events-none absolute inset-x-0 top-[-140px] flex justify-center">
        <div className="h-72 w-[40rem] rounded-full bg-emerald-200/50 blur-3xl opacity-70" />
      </div>
      <div className="pointer-events-none absolute -left-32 bottom-[-80px] hidden h-64 w-64 rounded-full bg-emerald-100/50 blur-3xl md:block" />
      <div className="pointer-events-none absolute -right-24 top-1/3 hidden h-64 w-64 rounded-full bg-emerald-100/40 blur-3xl md:block" />

      <motion.main
        className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 py-10 md:py-16"
        initial="hidden"
        animate="visible"
      >
        {/* HERO */}
        <motion.section
          className="flex flex-col items-center gap-10 md:flex-row md:items-stretch"
          variants={staggerContainer}
        >
          {/* Texto principal */}
          <motion.div
            className="flex-1 space-y-4 md:space-y-5"
            variants={fadeUp}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Pilates • Estudio digital
            </p>
            <h1 className="text-balance text-3xl font-semibold leading-tight text-neutral-900 md:text-4xl">
              Lleva tu estudio de Pilates a la pantalla, sin perder la calidez
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Movimiento suave, respiración presente, práctica con intención.
              PilatesFlow te permite organizar tus clases, compartir sesiones
              guiadas en video y darle a tus alumnas un espacio claro para
              practicar, reservar y seguir su propio progreso, incluso en días
              caóticos.
            </p>

            {/* Sub-logo / dedicación */}
            <motion.div
              className="mt-2 inline-flex flex-col rounded-2xl border border-emerald-100 bg-emerald-50/70 px-3 py-2 text-[11px] leading-tight shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              variants={fadeUp}
            >
              <span className="font-semibold tracking-[0.2em] uppercase text-emerald-700">
                PilatesFlow
              </span>
              <span className="text-[11px] text-emerald-800/90">
                a focused prototype lovingly crafted for{" "}
                <span className="font-medium">@aksaya_studio</span>
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3 pt-3"
              variants={fadeUp}
            >
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
            </motion.div>

            {/* Bullets rápidos */}
            <motion.div
              className="mt-4 grid gap-3 text-xs text-neutral-700 sm:grid-cols-3"
              variants={staggerContainer}
            >
              <motion.div
                className="flex items-center gap-2 transition-transform duration-150 hover:-translate-y-0.5"
                variants={fadeUp}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                </span>
                <span>Agenda clara para tus alumnas</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 transition-transform duration-150 hover:-translate-y-0.5"
                variants={fadeUp}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                  <PlayCircle className="h-3.5 w-3.5 text-emerald-700" />
                </span>
                <span>Clases guiadas en video</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 transition-transform duration-150 hover:-translate-y-0.5"
                variants={fadeUp}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                  <CalendarClock className="h-3.5 w-3.5 text-emerald-700" />
                </span>
                <span>Horarios y niveles organizados</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Bloque visual / foto del estudio */}
          <motion.div
            className="flex-1 w-full md:max-w-md md:ml-auto"
            variants={fadeIn}
          >
            <motion.div
              className="group relative mx-auto w-full max-w-sm md:max-w-full overflow-hidden rounded-3xl border border-emerald-100 bg-white/60 shadow-sm backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{
                y: -4,
                boxShadow: "0 18px 40px rgba(16, 185, 129, 0.18)",
              }}
            >
              <div className="relative aspect-[4/5] w-full md:aspect-[3/4]">
                <Image
                  src={AKSAYA_IMAGES.studioHero}
                  alt="Estudio de Pilates Aksaya durante una sesión suave"
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 480px, (min-width: 768px) 50vw, 100vw"
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-emerald-950/55 via-emerald-900/10 to-transparent" />

                {/* Chip superior */}
                <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-emerald-50/90 px-3 py-1 text-[10px] font-medium text-emerald-800 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Aksaya Studio · práctica guiada
                </div>

                {/* Texto inferior */}
                <div className="absolute inset-x-4 bottom-4 space-y-1 text-emerald-50 drop-shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-100/90">
                    Movimiento · Respiración · Presencia
                  </p>
                  <p className="text-sm font-medium">
                    Un espacio digital para acompañar tu práctica, incluso en
                    los días caóticos.
                  </p>
                  <p className="text-[11px] text-emerald-100/90">
                    Imagen de referencia para el estudio Aksaya · PilatesFlow
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* RITUAL DE PRÁCTICA */}
        <motion.section
          className="space-y-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div
            className="space-y-2 text-center md:text-left"
            variants={fadeUp}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Ritual de práctica
            </p>
            <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
              Un pequeño ritual para entrar en la esterilla
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
              Antes de elegir una clase, puedes seguir estos tres pasos simples
              para llegar más presente: respirar, elegir sin prisa y cerrar con
              gratitud.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Paso 1 */}
            <motion.div variants={fadeUp}>
              <div className="flex flex-col gap-2 rounded-2xl border border-emerald-50 bg-white/90 px-4 py-4 text-xs text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-800">
                  1
                </span>
                <h3 className="text-sm font-semibold text-neutral-900">
                  Detente y respira
                </h3>
                <p className="text-[11px] text-neutral-600">
                  Cierra los ojos unos segundos, siente el peso del cuerpo y
                  toma 3–5 respiraciones lentas. Deja afuera el resto del día.
                </p>
              </div>
            </motion.div>

            {/* Paso 2 */}
            <motion.div variants={fadeUp}>
              <div className="flex flex-col gap-2 rounded-2xl border border-emerald-50 bg-white/90 px-4 py-4 text-xs text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-800">
                  2
                </span>
                <h3 className="text-sm font-semibold text-neutral-900">
                  Elige la clase con intención
                </h3>
                <p className="text-[11px] text-neutral-600">
                  Pregúntate qué necesitas hoy: suavizar, activar o simplemente
                  moverte un poco. Luego elige la clase que más resuene.
                </p>
              </div>
            </motion.div>

            {/* Paso 3 */}
            <motion.div variants={fadeUp}>
              <div className="flex flex-col gap-2 rounded-2xl border border-emerald-50 bg-white/90 px-4 py-4 text-xs text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-800">
                  3
                </span>
                <h3 className="text-sm font-semibold text-neutral-900">
                  Cierra con gratitud
                </h3>
                <p className="text-[11px] text-neutral-600">
                  Al terminar, toma un momento para agradecerle a tu cuerpo.
                  Marca la clase como completada y nota cómo te sientes ahora.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* BLOQUE: Pensado para alumnas */}
        <motion.section
          className="space-y-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div
            className="space-y-2 text-center md:text-left"
            variants={fadeUp}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Para tus alumnas
            </p>
            <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
              Un espacio claro para practicar y no perderse entre links sueltos
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Nueva tarjeta con foto de alumnas */}
            <motion.div variants={fadeUp}>
              <Card className="overflow-hidden border-emerald-50 bg-black text-emerald-50">
                <div className="relative h-40 w-full">
                  <Image
                    src={AKSAYA_IMAGES.students}
                    alt="Alumnas practicando Pilates en Aksaya Studio"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                </div>
                <CardContent className="space-y-1.5 p-4 text-[11px] md:text-xs">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-200">
                    Aksaya Studio · Alumna
                  </p>
                  <p>
                    Una práctica que se siente cercana, cálida y presente.
                    PilatesFlow busca reflejar el mismo espacio seguro que ya
                    viven en tu estudio.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tarjetas originales */}
            <motion.div variants={fadeUp}>
              <Card className="border-emerald-50 bg-white/80 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Agenda visual</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    Las alumnas ven sus próximas clases, cupos y nivel en un
                    mismo lugar. Nada de screenshots de WhatsApp o PDFs
                    perdidos.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="border-emerald-50 bg-white/80 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Clases guiadas en video
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    Integra tus videos para que puedan practicar cuando tengan
                    un rato libre: 20–30 minutos entre el trabajo, la casa y el
                    resto de la vida.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="border-emerald-50 bg-white/80 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Plan y progreso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    Cada alumna sabe cuántas clases tiene activas según su plan
                    y puede ir marcando lo que ya practicó para ver cómo avanza
                    en el mes.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* BLOQUE: Para estudios / instructoras */}
        <motion.section
          className="space-y-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div
            className="space-y-2 text-center md:text-left"
            variants={fadeUp}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Para estudios e instructoras
            </p>
            <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
              Menos administración, más energía para enseñar
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            <motion.div variants={fadeUp}>
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
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="border-emerald-50 bg-white/80 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Planes y acceso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    Define planes como{" "}
                    <span className="font-medium">Free</span> o{" "}
                    <span className="font-medium">Activa</span> y controla
                    cuántas sesiones puede tener reservadas cada alumna.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="border-emerald-50 bg-white/80 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Listo para escalar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    Pensado como plataforma white-label: en el futuro podrás
                    usar tu logo, tus colores y tu propio subdominio para tu
                    estudio.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* CÓMO FUNCIONA */}
        <motion.section
          className="space-y-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="space-y-2 text-center md:text-left"
            variants={fadeUp}
          >
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
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            <motion.div variants={fadeUp}>
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
            </motion.div>

            <motion.div variants={fadeUp}>
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
                    puede reservar los cupos que tenga disponibles según ese
                    plan.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
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
                    pueden volver a ver las sesiones en video cuando lo
                    necesiten.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* DESDE INSTAGRAM */}
        <motion.section
          className="space-y-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div
            className="space-y-2 text-center md:text-left"
            variants={fadeUp}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Desde Instagram
            </p>
            <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
              Lo que está pasando ahora en @aksaya_studio
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
              El feed se actualiza automáticamente con las últimas publicaciones
              del estudio. Así la plataforma y el Instagram respiran lo mismo.
            </p>
          </motion.div>

          {igError && (
            <p className="text-xs text-red-500">{igError}</p>
          )}

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {igLoading && instagramMedia.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Cargando publicaciones de Instagram…
              </p>
            )}

            {!igLoading &&
              instagramMedia.map((item) => {
                const imageSrc =
                  item.media_type === "VIDEO" && item.thumbnail_url
                    ? item.thumbnail_url
                    : item.media_url;

                const shortCaption = item.caption
                  ? item.caption.length > 80
                    ? item.caption.slice(0, 77) + "..."
                    : item.caption
                  : "";

                return (
                  <motion.a
                    key={item.id}
                    href={item.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={fadeUp}
                    className="group block overflow-hidden rounded-2xl border border-emerald-50 bg-white/80 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                  >
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={shortCaption || "Publicación de Instagram"}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />
                      <span className="absolute left-2 top-2 rounded-full bg-emerald-50/90 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                        Instagram
                      </span>
                    </div>
                    {shortCaption && (
                      <div className="px-3 py-2 text-[11px] text-neutral-700 line-clamp-2">
                        {shortCaption}
                      </div>
                    )}
                  </motion.a>
                );
              })}
          </div>

          <div className="pt-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="gap-2 border-emerald-200 text-emerald-900 hover:border-emerald-300"
            >
              <a
                href="https://www.instagram.com/aksaya_studio"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver más en Instagram
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </motion.section>

        {/* PLANES */}
        <motion.section
          className="space-y-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="space-y-2 text-center md:text-left"
            variants={fadeUp}
          >
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
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Plan Free */}
            <motion.div variants={fadeUp}>
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
            </motion.div>

            {/* Plan Activa */}
            <motion.div variants={fadeUp}>
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
            </motion.div>

            {/* Plan Studio / Instructora */}
            <motion.div variants={fadeUp}>
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
            </motion.div>
          </div>
        </motion.section>

        {/* PRODUCTOS PARA ACOMPAÑAR LA PRÁCTICA */}
        <motion.section
          className="space-y-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.div
            className="space-y-2 text-center md:text-left"
            variants={fadeUp}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Productos
            </p>
            <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
              Productos para acompañar tu práctica
            </h2>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
              Además de las clases, cada estudio puede ofrecer productos
              complementarios: mats, bloques o programas digitales pensados para
              sostener la práctica de sus alumnas.
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {HOME_PRODUCTS.map((product) => (
              <motion.div key={product.id} variants={fadeUp}>
                <Card className="overflow-hidden border-emerald-50 bg-white/90 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
                    <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-emerald-50/90 px-2.5 py-1 text-[10px] font-medium text-emerald-800">
                      {product.tag}
                    </div>
                  </div>

                  <CardContent className="space-y-2 p-4 text-xs text-muted-foreground">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-sm font-semibold text-neutral-900">
                        {product.name}
                      </h3>
                      <span className="text-[11px] font-medium text-emerald-700">
                        {product.priceLabel}
                      </span>
                    </div>
                    <p>{product.description}</p>
                    <div className="pt-1.5">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-[11px]"
                      >
                        <Link href="/products">
                          Ver detalle / Próximamente
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQS */}
        <motion.section
          className="space-y-5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="space-y-2 text-center md:text-left"
            variants={fadeUp}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              Preguntas frecuentes
            </p>
            <h2 className="text-lg font-semibold text-neutral-900 md:text-xl">
              Lo que normalmente preguntan antes de probar
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 text-xs md:text-sm text-muted-foreground">
            <motion.div variants={fadeUp}>
              <Card className="border-emerald-50 bg-white/90 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    ¿Esta plataforma ya cobra a las alumnas?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  No. Este es un prototipo funcional pensado para mostrar cómo
                  se vería la experiencia completa. Los pagos se podrían
                  conectar más adelante con Stripe u otra pasarela.
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
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
            </motion.div>

            <motion.div variants={fadeUp}>
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
            </motion.div>

            <motion.div variants={fadeUp}>
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
            </motion.div>
          </div>
        </motion.section>

        {/* CTA FINAL */}
        <motion.section
          className="rounded-3xl border border-emerald-100 bg-emerald-50/80 px-5 py-6 md:px-8 md:py-7 transition duration-150 hover:-translate-y-0.5 hover:shadow-md"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
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
        </motion.section>
      </motion.main>

      {/* FOOTER MINI */}
      <footer className="relative border-t border-emerald-100/60 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-4 text-[11px] text-neutral-500 md:flex-row md:items-center">
          <p>
            © {currentYear} PilatesFlow. Prototype dedicated to{" "}
            <span className="font-medium text-emerald-700">@aksaya_studio</span>
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