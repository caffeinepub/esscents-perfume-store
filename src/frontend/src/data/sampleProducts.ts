import type { Product } from "../backend";

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "sample-1",
    name: "Oud Al Malaak",
    category: "Attar",
    description:
      "A transcendent journey through ancient Arabian souks. Rich oud wood aged for decades, interlaced with saffron and dark amber resin. This attar captures the soul of the East — warm, animalic, and utterly unforgettable. A single drop blooms for hours on warm skin.",
    price: BigInt(550000),
    sizes: ["3ml", "6ml", "12ml"],
    imageId: "https://picsum.photos/seed/oud-malaak/400/500",
    stock: BigInt(48),
    featured: true,
    createdAt: BigInt(Date.now() * 1000000),
  },
  {
    id: "sample-2",
    name: "Rose Royale",
    category: "Perfume",
    description:
      "Distilled from ten thousand Taif rose petals at the break of dawn. This ethereal perfume opens with a dewy, green rose heart and dries down to warm white musk and a whisper of sandalwood. Feminine grace with unexpected depth.",
    price: BigInt(420000),
    sizes: ["30ml", "50ml", "100ml"],
    imageId: "https://picsum.photos/seed/rose-royale/400/500",
    stock: BigInt(32),
    featured: true,
    createdAt: BigInt(Date.now() * 1000000),
  },
  {
    id: "sample-3",
    name: "Amber Mystique",
    category: "Perfume",
    description:
      "Golden amber meets smoky incense and warm benzoin in a composition of rare sensuality. The opening is bright bergamot and pink pepper; the heart reveals labdanum and rose absolute; the base is a resinous, honeyed amber that lingers like a memory.",
    price: BigInt(385000),
    sizes: ["50ml", "100ml"],
    imageId: "https://picsum.photos/seed/amber-mystique/400/500",
    stock: BigInt(60),
    featured: true,
    createdAt: BigInt(Date.now() * 1000000),
  },
  {
    id: "sample-4",
    name: "Oud Noir Intense",
    category: "Attar",
    description:
      "The darkest expression of oud — a pure agarwood attar macerated for three years in aged sandalwood oil. No synthetics. No shortcuts. A raw, powerful, profoundly beautiful oil that reveals new facets every hour on the skin.",
    price: BigInt(780000),
    sizes: ["3ml", "6ml"],
    imageId: "https://picsum.photos/seed/oud-noir/400/500",
    stock: BigInt(15),
    featured: false,
    createdAt: BigInt(Date.now() * 1000000),
  },
  {
    id: "sample-5",
    name: "White Musk Reverie",
    category: "Body Mist",
    description:
      "A cloud of the softest white musks, powdery iris, and transparent woods. Light enough to layer, yet tenacious enough to leave a trail. The ultimate signature skin scent for those who believe less is more — unless it's musk.",
    price: BigInt(180000),
    sizes: ["100ml", "200ml"],
    imageId: "https://picsum.photos/seed/white-musk/400/500",
    stock: BigInt(90),
    featured: false,
    createdAt: BigInt(Date.now() * 1000000),
  },
  {
    id: "sample-6",
    name: "Sandalwood Sanctuary",
    category: "Home Fragrance",
    description:
      "Transform your living space into a Mysore palace. This luxury reed diffuser releases smooth Mysore sandalwood, warm vetiver, and a hint of vanilla cream over months, creating an atmosphere of meditative calm and opulent comfort.",
    price: BigInt(220000),
    sizes: ["100ml", "200ml"],
    imageId: "https://picsum.photos/seed/sandalwood-sanctuary/400/500",
    stock: BigInt(45),
    featured: false,
    createdAt: BigInt(Date.now() * 1000000),
  },
];

export const CATEGORIES = [
  "All",
  "Perfume",
  "Attar",
  "Gift Set",
  "Body Mist",
  "Home Fragrance",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function formatPrice(price: bigint): string {
  const amount = Number(price) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
