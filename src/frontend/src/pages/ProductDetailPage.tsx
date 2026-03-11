import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../data/sampleProducts";
import { useProduct } from "../hooks/useQueries";

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/product/$id" });
  const { data: product, isLoading } = useProduct(id);
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const currentSize = selectedSize ?? product?.sizes[0] ?? "";

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: currentSize,
      imageId: product.imageId,
      category: product.category,
    });
    for (let i = 0; i < quantity - 1; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        size: currentSize,
        imageId: product.imageId,
        category: product.category,
      });
    }
    toast.success("Added to cart", {
      description: `${product.name} — ${currentSize} × ${quantity}`,
    });
  };

  if (isLoading) {
    return (
      <div
        className="pt-28 pb-20 container max-w-6xl mx-auto px-4"
        data-ocid="product.loading_state"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-[4/5] rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-28 pb-20 text-center" data-ocid="product.error_state">
        <p className="font-display text-2xl mb-4">Fragrance not found</p>
        <Link to="/shop" search={{ category: undefined }}>
          <Button variant="outline">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/shop"
            search={{ category: undefined }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="product.back.link"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div
              className="aspect-[4/5] rounded-xl overflow-hidden bg-card border border-border/60"
              style={{ boxShadow: "0 20px 60px oklch(0 0 0 / 0.5)" }}
            >
              <img
                src={
                  product.imageId ||
                  `https://picsum.photos/seed/${product.id}/600/750`
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card/30 via-transparent to-transparent" />
            </div>

            {product.featured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary/90 text-primary-foreground border-0 text-[10px] tracking-widest uppercase">
                  <Star className="w-2.5 h-2.5 mr-1" /> Featured
                </Badge>
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center space-y-6"
          >
            {/* Category */}
            <Badge
              variant="outline"
              className="w-fit text-[10px] tracking-widest uppercase text-primary border-primary/40"
            >
              {product.category}
            </Badge>

            {/* Name */}
            <div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-semibold text-primary">
                {formatPrice(product.price)}
              </p>
            </div>

            <Separator className="bg-border/50" />

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-loose">
              {product.description}
            </p>

            {/* Stock */}
            <p className="text-xs text-muted-foreground">
              {Number(product.stock) > 10
                ? `${product.stock} in stock`
                : Number(product.stock) > 0
                  ? `Only ${product.stock} left`
                  : "Out of stock"}
            </p>

            <Separator className="bg-border/50" />

            {/* Size selector */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                Select Size
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    data-ocid="product.size.toggle"
                    className={`px-4 py-2 text-sm border rounded-md transition-all ${
                      currentSize === size
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/50 transition-colors"
                  data-ocid="product.qty_decrease.button"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center font-medium text-sm">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/50 transition-colors"
                  data-ocid="product.qty_increase.button"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              disabled={Number(product.stock) === 0}
              className="btn-gold w-full py-6 text-sm tracking-widest uppercase rounded-full"
              data-ocid="product.add_button"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              {Number(product.stock) === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>

            <p className="text-[11px] text-muted-foreground text-center">
              Free shipping on orders over ₹2,000 · Secure checkout
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
