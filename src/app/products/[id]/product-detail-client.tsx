// src/app/products/[id]/product-detail-client.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/products-mock";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

type Props = {
  product: Product;
};

export default function ProductDetailClient({ product }: Props) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      priceLabel: product.priceLabel,
      type: product.type,
      image: product.image,
      // 👆 no mandamos quantity, el store pone quantity = 1
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/70 via-white to-white">
      <motion.main
        className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 md:py-14"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
      >
        <motion.div variants={fadeUp} className="flex justify-between items-start gap-4">
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

        <motion.section
          className="grid gap-6 md:grid-cols-[3fr,2fr]"
          variants={fadeUp}
        >
          {/* Imagen grande */}
          <Card className="overflow-hidden border-emerald-50 bg-white/90">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          </Card>

          {/* Info */}
          <Card className="border-emerald-100 bg-emerald-50/80">
            <CardContent className="space-y-3 p-4 text-xs md:text-sm text-emerald-900">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-emerald-600">
                  {product.tag}
                </p>
                <h1 className="mt-1 text-lg font-semibold text-neutral-900">
                  {product.name}
                </h1>
              </div>

              <p>{product.description}</p>

              <p className="text-base font-semibold text-neutral-900">
                {product.priceLabel}
              </p>

              <p className="text-[11px] text-emerald-900/80">
                Ejemplo de ficha de producto. En una versión real este botón
                conectaría con un flujo de pago y envío / acceso digital.
              </p>

              <Button
                type="button"
                size="sm"
                className="mt-2 inline-flex items-center gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4" />
                Agregar al carrito
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      </motion.main>
    </div>
  );
}