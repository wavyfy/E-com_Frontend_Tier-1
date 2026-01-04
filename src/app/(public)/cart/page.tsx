// src/app/(public)/cart/page.tsx
"use client";

import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart();

  if (loading) {
    return <p className="p-4">Loading cart...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return <p className="p-4">Your cart is empty</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Your Cart</h1>

      <div className="space-y-2">
        {cart.items.map((item) => (
          <CartItem
            key={item.productId}
            item={item}
            onIncrease={async () =>
              updateItem(item.productId, item.quantity + 1)
            }
            onDecrease={async () => {
              if (item.quantity === 1) {
                await removeItem(item.productId); // remove instead of qty = 0
              } else {
                await updateItem(item.productId, item.quantity - 1);
              }
            }}
            onRemove={async () => removeItem(item.productId)}
          />
        ))}
      </div>

      <div className="mt-6 border-t pt-4 flex justify-between">
        <span className="font-medium">Items: {cart.itemsCount}</span>

        <span className="font-semibold text-lg">
          Total: ₹{cart.totalAmount}
        </span>
      </div>
    </div>
  );
}
