// src/lib/api/cart.api.ts
import { api } from "./client";
import type { Cart } from "@/lib/types/cart";

export const CartAPI = {
  get(): Promise<Cart> {
    return api<Cart>("/cart");
  },

  addItem(productId: string, quantity = 1): Promise<Cart> {
    return api<Cart>("/cart/items", {
      method: "POST",
      body: JSON.stringify({ productId, quantity }),
    });
  },

  updateItem(productId: string, quantity: number): Promise<Cart> {
    return api<Cart>(`/cart/items/${productId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
  },

  removeItem(productId: string): Promise<Cart> {
    return api<Cart>(`/cart/items/${productId}`, {
      method: "DELETE",
    });
  },
};
