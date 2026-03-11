import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Product } from "../backend";
import { SAMPLE_PRODUCTS } from "../data/sampleProducts";
import { useActor } from "./useActor";

export function useAllProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return SAMPLE_PRODUCTS;
      const result = await actor.getAllProducts();
      return result.length > 0 ? result : SAMPLE_PRODUCTS;
    },
    enabled: !isFetching,
    staleTime: 30000,
  });
}

export function useFeaturedProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      if (!actor) return SAMPLE_PRODUCTS.filter((p) => p.featured);
      const result = await actor.getFeaturedProducts();
      return result.length > 0
        ? result
        : SAMPLE_PRODUCTS.filter((p) => p.featured);
    },
    enabled: !isFetching,
    staleTime: 30000,
  });
}

export function useProduct(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!actor) return SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null;
      const result = await actor.getProduct(id);
      return result ?? SAMPLE_PRODUCTS.find((p) => p.id === id) ?? null;
    },
    enabled: !!id && !isFetching,
  });
}

export function useProductsByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "category", category],
    queryFn: async () => {
      if (!actor) {
        return category === "All"
          ? SAMPLE_PRODUCTS
          : SAMPLE_PRODUCTS.filter((p) => p.category === category);
      }
      if (category === "All") {
        const result = await actor.getAllProducts();
        return result.length > 0 ? result : SAMPLE_PRODUCTS;
      }
      const result = await actor.getProductsByCategory(category);
      return result.length > 0
        ? result
        : SAMPLE_PRODUCTS.filter((p) => p.category === category);
    },
    enabled: !isFetching,
    staleTime: 30000,
  });
}

export function useSearchProducts(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      if (!actor) {
        const q = query.toLowerCase();
        return SAMPLE_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q),
        );
      }
      return actor.searchProducts(query);
    },
    enabled: !!query.trim() && !isFetching,
    staleTime: 10000,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !isFetching,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProduct(product);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProduct(product);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(productId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}
