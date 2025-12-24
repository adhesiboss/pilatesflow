import Link from "next/link";
import { AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AvisoPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/60 via-white to-white">
      <main className="mx-auto max-w-3xl px-4 py-8 md:py-10 space-y-8">
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
            Aviso · Prototipo PilatesFlow
          </p>
        </div>

        {/* Header */}
        <section className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">
            Aviso importante sobre este sitio
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            PilatesFlow, tal como lo ves hoy, es un{" "}
            <span className="font-medium text-emerald-800">
              prototipo funcional
            </span>{" "}
            pensado para mostrar el flujo de un estudio digital de Pilates
            dedicado a Aksaya Studio.
          </p>
        </section>

        {/* Bloque principal de aviso */}
        <Card className="border-amber-100 bg-amber-50/80">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-amber-900">
              <AlertCircle className="h-4 w-4" />
              Sin cobros reales ni contratos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs md:text-sm text-amber-900/90">
            <p>
              Este sitio no realiza{" "}
              <span className="font-semibold">
                cobros reales, suscripciones ni contratos comerciales
              </span>{" "}
              con las personas que lo utilizan.
            </p>
            <p>
              Cualquier referencia a{" "}
              <span className="font-medium">“planes”, “precios” o “pagos”</span>{" "}
              es solo demostrativa y forma parte del diseño de la experiencia de
              usuario.
            </p>
          </CardContent>
        </Card>

        {/* Otros puntos claros y simples */}
        <Card className="border-emerald-100 bg-white/90">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-700" />
              Información y práctica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs md:text-sm text-muted-foreground">
            <p>
              Las clases, textos y ejemplos de sesiones que aparecen en la
              plataforma tienen un carácter{" "}
              <span className="font-medium">
                ilustrativo y orientado a la práctica personal
              </span>
              .
            </p>
            <p>
              La práctica de Pilates y movimiento consciente debe adaptarse a
              cada cuerpo y condición. Siempre es recomendable{" "}
              <span className="font-medium">
                consultar con profesionales de salud
              </span>{" "}
              cuando existan lesiones, condiciones médicas o dudas específicas.
            </p>
          </CardContent>
        </Card>

        {/* Cierre */}
        <section className="space-y-2 text-[11px] md:text-xs text-muted-foreground">
          <p>
            {currentYear} · PilatesFlow · Prototipo dedicado a Aksaya Studio. La
            versión productiva, en caso de desarrollarse, incorporará términos y
            condiciones completos, políticas de privacidad y contratos de
            servicio adecuados.
          </p>
        </section>
      </main>
    </div>
  );
}