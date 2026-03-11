import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { Menu, ShoppingBag, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useCart } from "../contexts/CartContext";

export default function Header() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-md"
      style={{ background: "oklch(13 0.018 55 / 0.92)" }}
    >
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            data-ocid="nav.link"
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-xl md:text-2xl font-bold tracking-wide gold-shimmer">
              Esscents
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                data-ocid="nav.link"
                className={`text-sm font-medium tracking-wider uppercase transition-colors ${
                  currentPath === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              data-ocid="nav.cart.button"
              className="relative p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-foreground" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            <Link
              to="/admin"
              data-ocid="nav.admin.link"
              className="hidden md:inline-flex"
            >
              <Button
                variant="outline"
                size="sm"
                className="border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 text-xs tracking-wider uppercase"
              >
                Admin
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="md:hidden p-2 rounded-full hover:bg-muted/50 transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              data-ocid="nav.toggle"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/50 overflow-hidden"
            style={{ background: "oklch(13 0.018 55 / 0.98)" }}
          >
            <nav className="container px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  data-ocid="nav.link"
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm font-medium tracking-wider uppercase py-1 transition-colors ${
                    currentPath === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/admin"
                data-ocid="nav.admin.link"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium tracking-wider uppercase py-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                Admin
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
