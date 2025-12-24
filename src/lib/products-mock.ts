// src/lib/products-mock.ts
import { AKSAYA_IMAGES } from "@/lib/aksaya-images";

export type ProductType = "physical" | "digital";

export type Product = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  tag: string;
  type: ProductType;
  image: string;
  instructor?: string;
};

// Mock de productos (compartido entre lista y detalle)
export const PRODUCTS: Product[] = [
  {
    id: "mat-ecologico",
    name: "Mat ecológico Aksaya",
    description:
      "Mat con buen agarre y textura suave, pensado para prácticas suaves y de mediana intensidad.",
    priceLabel: "$39.990 CLP",
    tag: "Producto físico",
    type: "physical",
    image: AKSAYA_IMAGES.studioHero,
    instructor: "Aksaya Studio",
  },
  {
    id: "bloques-corcho",
    name: "Bloques de corcho",
    description:
      "Bloques firmes pero amables, ideales para acompañar procesos de movilidad y soporte.",
    priceLabel: "$18.990 CLP",
    tag: "Producto físico",
    type: "physical",
    image: AKSAYA_IMAGES.students,
    instructor: "Aksaya Studio",
  },
  {
    id: "programa-30-dias-suave",
    name: "Programa digital · 30 días suave",
    description:
      "Un recorrido de 30 días con secuencias cortas para crear el hábito de volver a la esterilla sin presión.",
    priceLabel: "$24.990 CLP",
    tag: "Programa digital",
    type: "digital",
    image: AKSAYA_IMAGES.studioHero,
    instructor: "Aksaya Studio",
  },
];