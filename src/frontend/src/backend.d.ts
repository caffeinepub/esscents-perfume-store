import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: string;
    featured: boolean;
    name: string;
    createdAt: bigint;
    description: string;
    sizes: Array<string>;
    stock: bigint;
    category: string;
    imageId: string;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(product: Product): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserRole(): Promise<UserRole>;
    getFeaturedProducts(): Promise<Array<Product>>;
    getProduct(productId: string): Promise<Product | null>;
    getProductCount(): Promise<bigint>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    isCallerAdmin(): Promise<boolean>;
    searchProducts(queryText: string): Promise<Array<Product>>;
    updateProduct(product: Product): Promise<void>;
}
