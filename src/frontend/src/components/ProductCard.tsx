import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Product } from "../backend";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../data/sampleProducts";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const size = product.sizes[0] ?? "Standard";
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size,
      imageId: product.imageId,
      category: product.category,
    });
    toast.success(`${product.name} added to cart`, {
      description: `Size: ${size}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
    >
      <Link to="/product/$id" params={{ id: product.id }}>
        <div className="card-luxury group relative" data-ocid="product.card">
          {/* Image */}
          <div className="relative overflow-hidden aspect-[4/5] bg-muted">
            <img
              src={
                product.imageId ||
                `https://picsum.photos/seed/${product.id}/400/500`
              }
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

            {/* Category badge */}
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="text-[10px] tracking-widest uppercase font-medium bg-card/80 text-primary border-primary/30 backdrop-blur-sm"
              >
                {product.category}
              </Badge>
            </div>

            {/* Featured badge */}
            {product.featured && (
              <div className="absolute top-3 right-3">
                <span className="text-[10px] tracking-widest uppercase font-medium text-primary">
                  ✦ Featured
                </span>
              </div>
            )}

            {/* Quick add button — appears on hover */}
            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <Button
                onClick={handleQuickAdd}
                className="w-full btn-gold text-xs tracking-widest uppercase h-9"
                data-ocid="product.add_button"
              >
                <ShoppingBag className="w-3.5 h-3.5 mr-2" />
                Quick Add
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-display text-base font-semibold leading-tight mb-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-primary">
                {formatPrice(product.price)}
              </span>
              <div className="flex gap-1">
                {product.sizes.slice(0, 3).map((s) => (
                  <span
                    key={s}
                    className="text-[10px] text-muted-foreground border border-border/60 rounded px-1.5 py-0.5"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
