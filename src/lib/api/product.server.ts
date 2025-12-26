// src/lib/api/product.server.ts
import { serverFetch } from "./server-fetch";

export type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  description?: string;
  stock: number;
};

export type ProductListResponse = {
  page: number;
  limit: number;
  items: Product[];
};

export async function fetchProducts(
  page = 1,
  limit = 20
): Promise<ProductListResponse> {
  return serverFetch<ProductListResponse>(
    `/products?page=${page}&limit=${limit}`
  );
}

export async function fetchProductBySlug(
  slug: string
): Promise<Product> {
  return serverFetch<Product>(`/products/slug/${slug}`);
}
