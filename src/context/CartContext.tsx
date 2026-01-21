"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Cart } from "@/lib/types/cart";
import { CartAPI } from "@/lib/api/cart.api";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api/api-error";
import type { CartContextValue } from "@/lib/types/cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const isRefreshing = useRef(false);

  const { isAuthenticated, isLoading } = useAuth();

  const refresh = async () => {
    if (isRefreshing.current) return;

    isRefreshing.current = true;
    setLoading(true);

    try {
      const data = await CartAPI.get();
      setCart(data);
    } catch (err) {
      // ✅ Expected during PAYMENT_PENDING
      if (err instanceof ApiError && err.status === 409) {
        return;
      }
      throw err;
    } finally {
      setLoading(false);
      isRefreshing.current = false;
    }
  };

  const addItem = async (productId: string, qty = 1) => {
    setCart(await CartAPI.addItem(productId, qty));
  };

  const updateItem = async (productId: string, qty: number) => {
    setCart(await CartAPI.updateItem(productId, qty));
  };

  const removeItem = async (productId: string) => {
    setCart(await CartAPI.removeItem(productId));
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      refresh();
    }
  }, [isAuthenticated, isLoading]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        updateItem,
        removeItem,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
