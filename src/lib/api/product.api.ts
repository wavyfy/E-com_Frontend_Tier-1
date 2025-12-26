import { api } from "./client";
import { Product } from "@/lib/types/product";

export const ProductAPI = {
   list: (page = 1, limit = 20) =>
    api<{ page: number; limit: number; items: Product[] }>(
      `/products?page=${page}&limit=${limit}`
    ),

  getById: (id: string) =>
    api<Product>(`/products/${id}`),

  getBySlug: (slug: string) =>
    api<Product>(`/products/slug/${slug}`),
  
create: (data: { name: string; price: number }) =>
  api<Product>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  }),


 update: (id: string, data: { name: string; price: number }) =>
    api<Product>(`/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
  api<void>(`/products/${id}`, { method: "DELETE" }),

};
