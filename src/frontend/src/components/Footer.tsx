import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-display text-xl font-bold gold-shimmer">
                Esscents
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Purveyors of rare fragrances, fine attars, and perfumed luxuries
              from the heart of ancient aromatic traditions.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-primary">
              Navigate
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/"
                  className="hover:text-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/shop"
                  search={{ category: undefined }}
                  className="hover:text-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  Shop All
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-primary">
              Categories
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                "Perfume",
                "Attar",
                "Body Mist",
                "Gift Set",
                "Home Fragrance",
              ].map((c) => (
                <li key={c}>
                  <Link
                    to="/shop"
                    search={{ category: c }}
                    className="hover:text-foreground transition-colors"
                    data-ocid="footer.link"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year} Esscents. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ♥ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-accent transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
