// src/app/cart/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowLeft, Trash2 } from "lucide-react";

import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
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

export default function CartPage() {
  const { items, totalItems, removeItem, clearCart, setQuantity } = useCart();

  // Total en CLP a partir del label ("$39.990 CLP" → 39990)
  const totalClp = items.reduce((acc, item) => {
    const numeric = parseInt(item.priceLabel.replace(/[^\d]/g, ""), 10);
    if (Number.isNaN(numeric)) return acc;
    return acc + numeric * item.quantity;
  }, 0);

  const totalLabel =
    totalClp > 0
      ? new Intl.NumberFormat("es-CL", {
          style: "currency",
          currency: "CLP",
        }).format(totalClp)
      : "$0 CLP";

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-emerald-50/70 via-white to-white">
      {/* Aura */}
      <div className="pointer-events-none absolute inset-x-0 top-[-140px] flex justify-center">
        <div className="h-72 w-[40rem] rounded-full bg-emerald-200/40 blur-3xl opacity-70" />
      </div>

      <motion.main
        className="relative mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:py-14"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        {/* Header */}
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
              <Link href="/products">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Seguir explorando productos
              </Link>
            </Button>

            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-500">
                Carrito
              </p>
              <h1 className="text-xl font-semibold text-neutral-900 md:text-2xl">
                Tus productos seleccionados
              </h1>
              <p className="max-w-2xl text-xs md:text-sm text-muted-foreground">
                Este carrito es un ejemplo: aún no hay checkout real. Sirve para
                mostrar cómo se podrían agrupar productos físicos y digitales
                asociados al estudio.
              </p>
            </div>
          </div>

          {items.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 px-3 text-[11px]"
              onClick={clearCart}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Vaciar carrito
            </Button>
          )}
        </motion.header>

        {/* Contenido */}
        {items.length === 0 ? (
          <motion.div variants={fadeUp}>
            <Card className="border-emerald-50 bg-white/90">
              <CardContent className="flex flex-col gap-3 p-4 text-xs md:text-sm text-muted-foreground">
                <p>No tienes productos en el carrito todavía.</p>
                <div>
                  <Button
                    asChild
                    size="sm"
                    className="h-8 px-3 text-[11px]"
                  >
                    <Link href="/products">
                      Ver productos disponibles
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
            {/* Lista de items */}
            <motion.div
              className="space-y-3"
              variants={staggerContainer}
            >
              {items.map((item) => (
                <motion.div key={item.id} variants={fadeUp}>
                  <Card className="border-emerald-50 bg-white/90">
                    <div className="flex gap-3 p-3">
                      {/* Imagen */}
                      {item.image ? (
                        <div className="relative h-20 w-24 overflow-hidden rounded-xl bg-neutral-100">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-20 w-24 rounded-xl bg-neutral-100" />
                      )}

                      {/* Info */}
                      <div className="flex flex-1 flex-col gap-1 text-xs md:text-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-neutral-900">
                              {item.name}
                            </p>
                            <p className="text-[11px] text-emerald-700">
                              {item.priceLabel}
                            </p>
                            {item.type && (
                              <p className="text-[10px] text-neutral-500">
                                {item.type === "physical"
                                  ? "Producto físico"
                                  : "Programa digital"}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="rounded-md p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Cantidad */}
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-[11px] text-neutral-500">
                            Cantidad:
                          </span>
                          <div className="inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2 py-1">
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.id, item.quantity - 1)
                              }
                              className="px-1 text-xs text-neutral-600 hover:text-neutral-900"
                            >
                              −
                            </button>
                            <span className="min-w-[1.5rem] text-center text-[11px]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setQuantity(item.id, item.quantity + 1)
                              }
                              className="px-1 text-xs text-neutral-600 hover:text-neutral-900"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Resumen */}
            <motion.div variants={fadeUp}>
              <Card className="border-emerald-100 bg-emerald-50/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">
                    Resumen del carrito
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-xs md:text-sm text-emerald-900">
                  <div className="flex items-center justify-between">
                    <span>Productos totales</span>
                    <span className="font-medium">{totalItems}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subtotal estimado</span>
                    <span className="font-semibold">{totalLabel}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-900/80">
                    Los montos son referencia a partir del mock de productos.
                    En una integración real se calcularía el total con precios
                    reales y se conectaría a un checkout (Stripe, Flow, etc.).
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    className="mt-2 h-8 w-full text-[11px]"
                    disabled
                  >
                    Continuar a pago (demo)
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </motion.main>
    </div>
  );
}