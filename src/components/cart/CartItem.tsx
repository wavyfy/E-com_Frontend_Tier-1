// src/components/cart/CartItem.tsx
"use client";

import { ApiError } from "@/lib/api/api-error";
import type { CartItemProps } from "@/lib/types/cart";

function handleCartItemError(err: unknown) {
  if (err instanceof ApiError) {
    switch (err.code) {
      case "CART_ITEM_OUT_OF_STOCK":
        alert("Product is out of stock");
        return;
      case "CART_ITEM_NOT_FOUND":
        alert("Item not found in cart");
        return;
      default:
        alert(err.message || "Something went wrong");
        return;
    }
  }
  // Fallback (unexpected)
  console.error(err);
  alert("Unexpected error");
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  disabled = false,
}: CartItemProps) {
  const isAtStockLimit = item.quantity >= item.stock;

  const safeIncrease = async () => {
    try {
      await onIncrease();
    } catch (err) {
      handleCartItemError(err);
    }
  };

  const safeDecrease = async () => {
    try {
      await onDecrease();
    } catch (err) {
      handleCartItemError(err);
    }
  };

  const safeRemove = async () => {
    try {
      await onRemove();
    } catch (err) {
      handleCartItemError(err);
    }
  };

  return (
    <div>
      <p>{item.name}</p>
      <p>
        ₹{item.unitPrice} × {item.quantity}
      </p>

      <button onClick={safeDecrease} disabled={disabled}>
        -
      </button>

      <span>{item.quantity}</span>

      <button
        onClick={safeIncrease}
        disabled={disabled || isAtStockLimit}
        title={isAtStockLimit ? "Stock limit reached" : undefined}
      >
        +
      </button>

      <p>Subtotal: ₹{item.subtotal}</p>

      {isAtStockLimit && (
        <p style={{ fontSize: 12 }}>No more stock available</p>
      )}

      <button onClick={safeRemove} disabled={disabled}>
        Remove
      </button>
    </div>
  );
}
