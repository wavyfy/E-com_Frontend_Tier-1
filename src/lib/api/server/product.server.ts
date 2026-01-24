// src/lib/api/product.server.ts
import { serverFetch } from "./server-fetch";
import type { Product, ProductListResponse } from "@/lib/types/product";

/* ================= USER ================= */

export async function fetchProducts(
  page = 1,
  limit = 20,
): Promise<ProductListResponse> {
  return serverFetch(`/products?page=${page}&limit=${limit}`);
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  return serverFetch(`/products/slug/${slug}`);
}

/* ================= ADMIN ================= */

export async function fetchAdminProducts(
  page = 1,
  limit = 20,
): Promise<ProductListResponse> {
  return serverFetch(`/admin/products?page=${page}&limit=${limit}`);
}

export async function fetchAdminProductById(id: string): Promise<Product> {
  return serverFetch(`/admin/products/${id}`);
}
