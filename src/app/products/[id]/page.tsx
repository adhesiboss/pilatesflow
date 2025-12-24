// src/app/products/[id]/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  Tag,
  Truck,
  DownloadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useCart } from "@/lib/cart-store";
import { PRODUCTS } from "@/lib/products-mock";

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
};

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

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  // Next 15: params es una Promise
  const { id } = React.use(params);

  const product = PRODUCTS.find((p) => p.id === id);
  const { addItem } = useCart();

  if (!product) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-gradient-to-b from-emerald-50/70 via-white to-white">
        <Card className="max-w-md border-emerald-100 bg-white/90">
          <CardContent className="space-y-3 p-5 text-center text-sm text-muted-foreground">
            <p>Este producto no existe o fue removido del prototipo.</p>
            <Button asChild size="sm" className="mt-2">
              <Link href="/products">Volver a productos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isDigital = product.type === "digital";

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      priceLabel: product.priceLabel,
      type: product.type,
      image: product.image,
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/70 via-white to-white">
      {/* aura suave */}
      <div className="pointer-events-none absolute inset-x-0 top-[-140px] flex justify-center">
        <div className="h-72 w-[40rem] rounded-full bg-emerald-200/40 blur-3xl opacity-70" />
      </div>

      <motion.main
        className="relative mx-auto flex max-w-xl flex-col gap-4 px-4 py-8 md:py-9"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Volver */}
        <motion.div variants={fadeUp}>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-emerald-800 hover:bg-emerald-50"
          >
            <Link href="/products">
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Volver a productos
            </Link>
          </Button>
        </motion.div>

        {/* Card principal más compacta */}
        <motion.section variants={fadeUp}>
          <Card className="overflow-hidden rounded-3xl border border-emerald-100 bg-white/95 shadow-sm">
            {/* Imagen arriba siempre */}
            <div className="relative bg-emerald-50">
              <div className="relative aspect-[4/3] w-full max-h-[320px] md:max-h-[340px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 60vw, 100vw"
                />
              </div>
            </div>

            {/* Info debajo */}
            <div className="flex flex-col gap-2.5 px-4 pb-5 pt-3 md:px-5 md:pb-5 md:pt-3">
              <CardHeader className="px-0 pb-1 pt-0">
                <div className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-semibold tracking-[0.18em] text-emerald-700">
                  <Tag className="h-3 w-3" />
                  {isDigital ? "PROGRAMA DIGITAL" : "PRODUCTO FÍSICO"}
                </div>
                <CardTitle className="text-sm md:text-base">
                  {product.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2.5 px-0 text-[11px] md:text-xs text-muted-foreground">
                <p>{product.description}</p>

                <div className="space-y-1">
                  {isDigital ? (
                    <>
                      <p>
                        • Acceso digital, ideal para acompañar tus clases y
                        prácticas en casa.
                      </p>
                      <p>
                        • Podría incluir videos, PDFs y una secuencia guiada de
                        varias semanas.
                      </p>
                      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] text-emerald-800">
                        <DownloadCloud className="h-3 w-3" />
                        Entrega por enlace privado (demo)
                      </div>
                    </>
                  ) : (
                    <>
                      <p>
                        • Producto pensado para sostener tus prácticas
                        presenciales o online.
                      </p>
                      <p>
                        • En una versión real podrías manejar stock, tallas y
                        métodos de envío.
                      </p>
                      <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] text-emerald-800">
                        <Truck className="h-3 w-3" />
                        Envío / retiro a coordinar (demo)
                      </div>
                    </>
                  )}
                </div>

                {/* Precio + CTA */}
                <div className="mt-1.5 flex flex-col gap-2 border-t border-emerald-50 pt-2.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-emerald-600">
                        Precio de referencia
                      </p>
                      <p className="text-base font-semibold text-neutral-900">
                        {product.priceLabel}
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    className="mt-0.5 inline-flex items-center justify-center gap-2 text-[11px]"
                    onClick={handleAddToCart}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    Agregar al carrito (demo)
                  </Button>

                  <p className="text-[9px] text-neutral-500">
                    Este flujo es demostrativo: en producción se conectaría con
                    un checkout y stock por estudio / instructora.
                  </p>
                </div>
              </CardContent>
            </div>
          </Card>
        </motion.section>
      </motion.main>
    </div>
  );
}