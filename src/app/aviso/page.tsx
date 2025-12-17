// src/app/aviso/page.tsx
import Link from "next/link";

export default function AvisoPage() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/30 to-white">
      <main className="mx-auto max-w-3xl px-4 py-10 md:py-16 space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
            Aviso importante
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900">
            Prototipo en modo demostración
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            PilatesFlow no es todavía una plataforma comercial ni procesa pagos
            reales. Es un entorno de prueba y demostración.
          </p>
        </header>

        <section className="space-y-3 text-sm md:text-base text-neutral-700">
          <p>
            Este sitio forma parte de un{" "}
            <span className="font-medium">prototipo de estudio digital</span>,
            creado con fines de exploración, diseño y desarrollo. La
            funcionalidad de reservas, planes y progreso es simulada con datos
            de prueba.
          </p>
          <p>
            Aunque la interfaz busca representar una experiencia realista para
            alumnas e instructoras,{" "}
            <span className="font-medium">
              no se realizan cobros, contratos ni compromisos comerciales
            </span>{" "}
            a través de esta plataforma.
          </p>
          <p>
            Cualquier referencia a planes, precios o capacidad de clases es
            ilustrativa y puede cambiar o desaparecer sin aviso previo.
          </p>
        </section>

        <section className="space-y-3 text-sm md:text-base text-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-900">
            Uso de la información
          </h2>
          <p>
            Los datos que se cargan en el prototipo (por ejemplo, nombres de
            clases, horarios o correos de prueba) están orientados a simular el
            funcionamiento de la plataforma. No se recomienda usar información
            sensible o confidencial en este entorno.
          </p>
          <p className="text-sm text-muted-foreground">
            Si en el futuro PilatesFlow evoluciona hacia un servicio real, se
            publicarán términos y condiciones formales, así como políticas de
            privacidad claras.
          </p>
        </section>

        <footer className="pt-4 text-sm text-muted-foreground">
          <p className="mb-2">
            © {year} PilatesFlow · Prototipo dedicado a{" "}
            <span className="font-medium text-emerald-700">
              Aksaya Studio
            </span>
            .
          </p>
          <p>
            Puedes volver a la{" "}
            <Link
              href="/"
              className="font-medium text-emerald-700 underline-offset-2 hover:underline"
            >
              página principal
            </Link>{" "}
            o conocer más en la sección{" "}
            <Link
              href="/estudio"
              className="font-medium text-emerald-700 underline-offset-2 hover:underline"
            >
              sobre el estudio
            </Link>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}