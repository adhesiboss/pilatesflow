import Link from "next/link";
import { ArrowLeft, HeartHandshake, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EstudioPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/60 via-white to-white">
      <main className="mx-auto max-w-4xl px-4 py-8 md:py-10 space-y-8">
        {/* Volver */}
        <div className="flex items-center justify-between gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 text-xs text-emerald-800"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-500">
            Estudio · Aksaya x PilatesFlow
          </p>
        </div>

        {/* Header principal */}
        <section className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">
            Aksaya Studio &amp; PilatesFlow
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
            Este espacio digital nace como un{" "}
            <span className="font-medium text-emerald-800">
              prototipo dedicado a Aksaya Studio
            </span>
            : un lugar para que la práctica de Pilates se sienta accesible,
            amorosa y posible, incluso en semanas caóticas.
          </p>
        </section>

        {/* Sobre Aksaya & la práctica */}
        <section className="grid gap-4 md:grid-cols-2">
          <Card className="border-emerald-100 bg-white/90">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                  <Sparkles className="h-4 w-4 text-emerald-700" />
                </span>
                Sobre el estudio
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs md:text-sm text-muted-foreground space-y-2">
              <p>
                Aksaya es un espacio que honra el{" "}
                <span className="font-medium text-emerald-800">
                  movimiento consciente, la respiración y la presencia
                </span>
                . No se trata solo de “hacer ejercicios”, sino de volver al
                cuerpo como refugio.
              </p>
              <p>
                Las clases están pensadas para acompañar procesos reales:
                maternidad, cambios de ciclo, momentos de mucho trabajo,
                tránsito emocional… siempre desde la suavidad.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-white/90">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                  <Sparkles className="h-4 w-4 text-emerald-700" />
                </span>
                Por qué existe PilatesFlow
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs md:text-sm text-muted-foreground space-y-2">
              <p>
                PilatesFlow nace como{" "}
                <span className="font-medium text-emerald-800">
                  herramienta para ordenar clases, horarios y prácticas
                  on-demand
                </span>{" "}
                sin perder el alma del estudio.
              </p>
              <p>
                El objetivo es que las alumnas puedan ver con claridad sus
                sesiones, repetir sus favoritas y sentir que su práctica tiene
                un hilo que las sostiene en el tiempo.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Dedicación a Gilsa / tono personal */}
        <section>
          <Card className="border-emerald-100 bg-emerald-50/70">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-emerald-50">
                  <HeartHandshake className="h-4 w-4" />
                </span>
                Una dedicación muy concreta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs md:text-sm text-emerald-900">
              <p>
                Este proyecto está pensado como un{" "}
                <span className="font-semibold">
                  gesto de cariño, admiración y apoyo a la visión de Aksaya y de
                  Gilsa
                </span>
                : sostener a otras personas a través del cuerpo, la respiración
                y la presencia.
              </p>
              <p>
                Todo lo que ves aquí es un{" "}
                <span className="font-medium">
                  laboratorio digital para imaginar cómo podría verse la
                  plataforma si algún día decidimos llevarla a producción
                </span>{" "}
                con pagos, planes reales y más herramientas para el estudio.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Nota de prototipo */}
        <section className="text-[11px] md:text-xs text-muted-foreground">
          <p>
            {currentYear} · PilatesFlow es un prototipo de estudio digital
            dedicado a Aksaya Studio. No reemplaza la experiencia presencial,
            sino que la acompaña y extiende hacia los días en que solo es
            posible practicar desde casa.
          </p>
        </section>
      </main>
    </div>
  );
}