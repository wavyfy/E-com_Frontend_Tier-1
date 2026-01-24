// src/lib/api/product.api.ts
import { api } from "./client";
import { Product } from "@/lib/types/product";

export const ProductAPI = {
  /* ===== USER ===== */

  getBySlug: (slug: string) => api<Product>(`/products/slug/${slug}`),

  /* ===== ADMIN (MUTATIONS ONLY) ===== */

  create: (data: { name: string; price: number }) =>
    api<Product>("/admin/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { name: string; price: number }) =>
    api<Product>(`/admin/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    api<void>(`/admin/products/${id}`, {
      method: "DELETE",
    }),
};
