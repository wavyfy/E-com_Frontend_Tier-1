// src/components/cart/AddToCartButton.tsx
"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { AddToCartButtonProps } from "@/lib/types/cart";

export default function AddToCartButton({
  productId,
  quantity = 1,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      setLoading(true);
      await addItem(productId, quantity);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleAdd} disabled={loading}>
      {loading ? "Adding..." : "Add to cart"}
    </button>
  );
}
