import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../data/sampleProducts";
import { useProductsByCategory, useSearchProducts } from "../hooks/useQueries";

export default function ShopPage() {
  const search = useSearch({ from: "/shop" });
  const navigate = useNavigate();
  const initialCategory = (search as any)?.category ?? "All";
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data: categoryProducts, isLoading: catLoading } =
    useProductsByCategory(activeCategory);
  const { data: searchResults, isLoading: searchLoading } =
    useSearchProducts(debouncedQuery);

  const isSearching = debouncedQuery.trim().length > 0;
  const products = isSearching
    ? (searchResults ?? [])
    : (categoryProducts ?? []);
  const isLoading = isSearching ? searchLoading : catLoading;

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSearchQuery("");
    navigate({
      to: "/shop",
      search: { category: cat !== "All" ? cat : undefined },
    });
  };

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs tracking-[0.3em] uppercase text-primary mb-3"
          >
            The Collection
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-bold mb-4"
          >
            Shop All Fragrances
          </motion.h1>
          <div className="section-divider mx-auto" />
        </div>

        {/* Search + Filter Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search fragrances..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border/60 focus-visible:ring-primary/50"
              data-ocid="shop.search_input"
            />
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <SlidersHorizontal className="w-4 h-4" />
            <span className="text-xs uppercase tracking-wider">Filter</span>
          </div>
        </div>

        {/* Category Tabs */}
        {!isSearching && (
          <Tabs
            value={activeCategory}
            onValueChange={handleCategoryChange}
            className="mb-10"
          >
            <TabsList className="h-auto bg-card border border-border/50 p-1 flex-wrap gap-1">
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  data-ocid="shop.category.tab"
                  className="text-xs tracking-wider uppercase px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        {/* Results count */}
        <div className="mb-6 text-sm text-muted-foreground">
          {isSearching ? (
            <span>
              {isLoading
                ? "Searching..."
                : `${products.length} result${products.length !== 1 ? "s" : ""} for "${debouncedQuery}"`}
            </span>
          ) : (
            <span>
              {isLoading
                ? "Loading..."
                : `${products.length} fragrance${products.length !== 1 ? "s" : ""}`}
            </span>
          )}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-ocid="shop.loading_state"
          >
            {Array.from({ length: 8 }, (_, i) => `sk-${i}`).map((k) => (
              <div key={k} className="space-y-3">
                <Skeleton className="aspect-[4/5] rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24" data-ocid="shop.empty_state">
            <p className="font-display text-2xl text-muted-foreground mb-3">
              No fragrances found
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or exploring a different category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
