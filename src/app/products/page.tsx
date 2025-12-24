// src/app/products/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, Filter, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  PRODUCTS,
  type ProductType,
} from "@/lib/products-mock";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function ProductsPage() {
  const [filter, setFilter] = useState<"all" | ProductType>("all");

  const filteredProducts = PRODUCTS.filter((product) =>
    filter === "all" ? true : product.type === filter
  );

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/70 via-white to-white">
      {/* Aura suave */}
      <div className="pointer-events-none absolute inset-x-0 top-[-140px] flex justify-center">
        <div className="h-72 w-[40rem] rounded-full bg-emerald-200/40 blur-3xl opacity-70" />
      </div>

      <motion.main
        className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:py-14"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Header / breadcrumb */}
        <motion.header
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          variants={fadeUp}
        >
          <div className="space-y-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-emerald-800 hover:bg-emerald-50"
            >
              <Link href="/">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Volver al inicio
              </Link>
            </Button>

            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-500">
                Productos
              </p>
              <h1 className="text-xl font-semibold text-neutral-900 md:text-2xl">
                Productos para acompañar tu práctica
              </h1>
              <p className="max-w-2xl text-xs md:text-sm text-muted-foreground">
                Esta sección es un ejemplo de cómo cada instructora o estudio
                podría ofrecer productos físicos y programas digitales que
                sostengan la práctica de sus alumnas, junto con las clases.
              </p>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex flex-col items-start gap-2 md:items-end">
            <div className="inline-flex items-center gap-2 text-[11px] text-neutral-500">
              <Filter className="h-3.5 w-3.5" />
              Filtrar por tipo
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={filter === "all" ? "default" : "outline"}
                className="h-7 px-3 text-[11px]"
                onClick={() => setFilter("all")}
              >
                Todos
              </Button>
              <Button
                type="button"
                size="sm"
                variant={filter === "physical" ? "default" : "outline"}
                className="h-7 px-3 text-[11px]"
                onClick={() => setFilter("physical")}
              >
                Productos físicos
              </Button>
              <Button
                type="button"
                size="sm"
                variant={filter === "digital" ? "default" : "outline"}
                className="h-7 px-3 text-[11px]"
                onClick={() => setFilter("digital")}
              >
                Programas digitales
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Grid productos */}
        <section className="space-y-4">
          {filteredProducts.length === 0 ? (
            <motion.p
              variants={fadeUp}
              className="text-xs text-muted-foreground"
            >
              No hay productos para este filtro todavía. En la versión final,
              cada instructora podría gestionar sus propios productos desde el
              panel de estudio.
            </motion.p>
          ) : (
            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              variants={staggerContainer}
            >
              {filteredProducts.map((product) => (
                <motion.div key={product.id} variants={fadeUp}>
                  <Card className="group overflow-hidden border-emerald-50 bg-white/90 transition duration-150 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
                    {/* Imagen superior */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-200 group-hover:scale-[1.03]"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-emerald-50/90 px-2.5 py-1 text-[10px] font-medium text-emerald-800">
                        {product.tag}
                      </div>
                      {product.instructor && (
                        <div className="absolute left-3 bottom-3 text-[10px] text-emerald-50">
                          {product.instructor}
                        </div>
                      )}
                    </div>

                    {/* Header con título y precio */}
                    <CardHeader className="pb-1 px-4 pt-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <CardTitle className="text-sm font-semibold text-neutral-900">
                          {product.name}
                        </CardTitle>
                        <span className="text-[11px] font-medium text-emerald-700">
                          {product.priceLabel}
                        </span>
                      </div>
                    </CardHeader>

                    {/* Contenido */}
                    <CardContent className="space-y-2.5 px-4 pb-4 pt-1 text-xs text-muted-foreground">
                      <p>{product.description}</p>
                      <div className="flex items-center justify-between pt-1.5">
                        <p className="text-[11px] text-neutral-500">
                          Ejemplo de ficha de producto. En una versión real se
                          conectaría con checkout / e-commerce.
                        </p>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-[11px]"
                          type="button"
                        >
                          <Link href={`/products/${product.id}`}>
                            <ShoppingBag className="mr-1.5 h-3.5 w-3.5" />
                            Ver detalle
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>
      </motion.main>
    </div>
  );
}