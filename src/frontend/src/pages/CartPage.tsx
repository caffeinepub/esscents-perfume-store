import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { formatPrice } from "../data/sampleProducts";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    totalItems,
  } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const deliveryFee = totalPrice > BigInt(200000) ? BigInt(0) : BigInt(9900);
  const grandTotal = totalPrice + deliveryFee;

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div
        className="pt-28 pb-20 min-h-screen flex items-center justify-center"
        data-ocid="cart.success_state"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold">Order Placed!</h1>
          <p className="text-muted-foreground leading-relaxed">
            Thank you for your order. Your fragrances will be carefully wrapped
            and dispatched within 2–3 business days. A confirmation email will
            follow shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/shop"
              search={{ category: undefined }}
              data-ocid="cart.continue_shopping.button"
            >
              <Button className="btn-gold px-8 rounded-full tracking-wider uppercase text-sm">
                Continue Shopping
              </Button>
            </Link>
            <Link to="/" data-ocid="cart.home.link">
              <Button
                variant="outline"
                className="px-8 rounded-full tracking-wider uppercase text-sm border-border/60"
              >
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs tracking-[0.3em] uppercase text-primary mb-2"
          >
            Your Selections
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl font-bold"
          >
            Shopping Cart
          </motion.h1>
          {totalItems > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
            data-ocid="cart.empty_state"
          >
            <ShoppingBag className="w-16 h-16 text-muted-foreground/40 mx-auto mb-6" />
            <h2 className="font-display text-2xl mb-3">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8">
              Discover our collection of rare fragrances.
            </p>
            <Link
              to="/shop"
              search={{ category: undefined }}
              data-ocid="cart.shop.button"
            >
              <Button className="btn-gold px-10 py-5 rounded-full text-sm tracking-widest uppercase">
                Explore Collection
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item, idx) => (
                  <motion.div
                    key={`${item.productId}-${item.size}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-4 p-4 bg-card border border-border/50 rounded-xl"
                    data-ocid={`cart.item.${idx + 1}`}
                  >
                    {/* Image */}
                    <Link
                      to="/product/$id"
                      params={{ id: item.productId }}
                      className="shrink-0"
                    >
                      <div className="w-20 h-24 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={
                            item.imageId ||
                            `https://picsum.photos/seed/${item.productId}/200/250`
                          }
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display font-semibold text-sm leading-tight">
                            {item.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.category} · {item.size}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.size)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                          data-ocid={`cart.delete_button.${idx + 1}`}
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Qty */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                            className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/50 transition-colors"
                            data-ocid={`cart.qty_decrease.button.${idx + 1}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/50 transition-colors"
                            data-ocid={`cart.qty_increase.button.${idx + 1}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-semibold text-sm text-primary">
                          {formatPrice(item.price * BigInt(item.quantity))}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div
                className="bg-card border border-border/50 rounded-xl p-6 sticky top-24 space-y-4"
                style={{ boxShadow: "0 8px 32px oklch(0 0 0 / 0.3)" }}
              >
                <h2 className="font-display text-lg font-bold">
                  Order Summary
                </h2>
                <Separator className="bg-border/40" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span
                      className={
                        deliveryFee === BigInt(0) ? "text-primary" : ""
                      }
                    >
                      {deliveryFee === BigInt(0)
                        ? "Free"
                        : formatPrice(deliveryFee)}
                    </span>
                  </div>
                  {deliveryFee > BigInt(0) && (
                    <p className="text-[11px] text-muted-foreground">
                      Free delivery on orders over ₹2,000
                    </p>
                  )}
                  <Separator className="bg-border/40" />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="text-primary">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="btn-gold w-full py-5 tracking-widest uppercase text-sm rounded-full mt-2"
                  data-ocid="cart.place_order.primary_button"
                >
                  Place Order
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                <p className="text-[11px] text-muted-foreground text-center">
                  No payment required · Demo checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
