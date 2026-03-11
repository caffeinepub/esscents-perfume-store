import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Flame, Leaf, Star } from "lucide-react";
import { motion } from "motion/react";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../data/sampleProducts";
import { useFeaturedProducts } from "../hooks/useQueries";

const categoryIcons: Record<string, typeof Star> = {
  Perfume: Star,
  Attar: Flame,
  "Gift Set": Star,
  "Body Mist": Leaf,
  "Home Fragrance": Leaf,
};

const categoryDesc: Record<string, string> = {
  Perfume: "Eau de parfum & cologne",
  Attar: "Pure concentrated oils",
  "Gift Set": "Curated luxury sets",
  "Body Mist": "Light & refreshing sprays",
  "Home Fragrance": "Diffusers & incense",
};

export default function HomePage() {
  const { data: featured, isLoading } = useFeaturedProducts();

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-perfume.dim_1600x900.jpg"
            alt="Luxury perfumes"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(13 0.018 55 / 0.85) 0%, oklch(13 0.018 55 / 0.55) 50%, oklch(13 0.018 55 / 0.75) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 container max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="space-y-6"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-xs tracking-[0.35em] uppercase text-primary font-medium"
            >
              The Art of Fine Fragrance
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight"
            >
              <span className="block text-foreground">Wear</span>
              <span className="block gold-shimmer">Your Story</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed"
            >
              Rare oud, vintage rose, and handcrafted attars — each bottle a
              journey through centuries of aromatic tradition.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/shop"
                search={{ category: undefined }}
                data-ocid="hero.primary_button"
              >
                <Button className="btn-gold px-8 py-6 text-sm tracking-widest uppercase rounded-full">
                  Explore Collection
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link
                to="/shop"
                search={{ category: "Attar" }}
                data-ocid="hero.secondary_button"
              >
                <Button
                  variant="outline"
                  className="px-8 py-6 text-sm tracking-widest uppercase rounded-full border-foreground/30 hover:border-primary hover:text-primary"
                >
                  Shop Attars
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-primary to-transparent" />
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs tracking-[0.3em] uppercase text-primary mb-3"
            >
              Handpicked Selections
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
            >
              Featured Fragrances
            </motion.h2>
            <div className="section-divider mx-auto" />
          </div>

          {isLoading ? (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              data-ocid="products.loading_state"
            >
              {Array.from({ length: 3 }, (_, i) => `sk-${i}`).map((k) => (
                <div key={k} className="space-y-3">
                  <Skeleton className="aspect-[4/5] rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(featured ?? []).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/shop"
              search={{ category: undefined }}
              data-ocid="featured.view_all_button"
            >
              <Button
                variant="outline"
                className="px-10 py-5 text-sm tracking-widest uppercase rounded-full border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              >
                View All Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        className="py-20 px-4 sm:px-6"
        style={{ background: "oklch(15 0.02 55)" }}
      >
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs tracking-[0.3em] uppercase text-primary mb-3"
            >
              Browse By Category
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-3xl sm:text-4xl font-bold"
            >
              Our Collections
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.filter((c) => c !== "All").map((cat, i) => {
              const Icon = categoryIcons[cat] ?? Star;
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to="/shop"
                    search={{ category: cat }}
                    data-ocid="category.link"
                  >
                    <div className="card-luxury p-5 text-center group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-display text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                        {cat}
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        {categoryDesc[cat]}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-4 sm:px-6">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <p className="text-xs tracking-[0.3em] uppercase text-primary">
              Our Story
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              Rooted in <span className="gold-shimmer">Ancient Craft</span>
            </h2>
            <div className="section-divider mx-auto" />
            <p className="text-base sm:text-lg text-muted-foreground leading-loose max-w-2xl mx-auto">
              Esscents was born from a deep reverence for the ancient perfumers
              of Arabia, India, and Persia. We source rare agarwood, pure rose
              absolute, and precious resins from their origins — distilled,
              blended, and bottled with the same unhurried artistry that has
              defined fine fragrance for millennia.
            </p>
            <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-xl mx-auto">
              Every fragrance we create tells a story. Every attar is a living
              link to the traditions of the ancient spice routes. We believe
              scent is the most intimate luxury — and it deserves to be
              extraordinary.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
