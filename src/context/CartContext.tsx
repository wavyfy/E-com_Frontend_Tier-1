// src/context/CartContext.tsx
"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Cart } from "@/lib/types/cart";
import { CartAPI } from "@/lib/api/cart.api";
import { useAuth } from "@/context/AuthContext";

type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  addItem: (productId: string, qty?: number) => Promise<void>;
  updateItem: (productId: string, qty: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

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

  // 🔒 Sync cart AFTER auth settles
  useEffect(() => {
    if (!isLoading) {
      refresh();
    }
  }, [isAuthenticated, isLoading]);

  return (
    <CartContext.Provider
      value={{ cart, loading, addItem, updateItem, removeItem, refresh }}
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
