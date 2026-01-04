"use client";

import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import { OrderAPI } from "@/lib/api/order.api";
import type { Order } from "@/lib/api/order.api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { cart, loading, updateItem, removeItem, clearCart } = useCart();
  const router = useRouter();

  const [checkingOut, setCheckingOut] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [checkingPending, setCheckingPending] = useState(false);

  // 🔹 Fetch latest pending order when cart is empty
  useEffect(() => {
    if (!cart || cart.items.length === 0) {
      setCheckingPending(true);
      OrderAPI.getLatestPending()
        .then(setPendingOrder)
        .finally(() => setCheckingPending(false));
    }
  }, [cart]);

  if (loading || checkingPending) {
    return <p className="p-4">Loading...</p>;
  }

  // 🟡 Empty cart but pending order exists
  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-4 space-y-4">
        <p>Your cart is empty.</p>

        {pendingOrder && (
          <button
            onClick={() => router.push(`/checkout/${pendingOrder._id}`)}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Continue Checkout
          </button>
        )}
      </div>
    );
  }

  async function handleCheckout() {
    if (checkingOut) return;

    try {
      setCheckingOut(true);
      const order = await OrderAPI.checkout();
      clearCart();
      router.replace(`/checkout/${order._id}`);
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Your Cart</h1>

      <div className="space-y-2">
        {cart.items.map((item) => (
          <CartItem
            key={item.productId}
            item={item}
            onIncrease={() => updateItem(item.productId, item.quantity + 1)}
            onDecrease={async () => {
              if (item.quantity === 1) {
                await removeItem(item.productId);
              } else {
                await updateItem(item.productId, item.quantity - 1);
              }
            }}
            onRemove={() => removeItem(item.productId)}
          />
        ))}
      </div>

      <div className="mt-6 border-t pt-4 flex justify-between items-center">
        <div>
          <span className="font-medium">Items: {cart.itemsCount}</span>
          <br />
          <span className="font-semibold text-lg">
            Total: ₹{cart.totalAmount}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={checkingOut || cart.items.length === 0}
        >
          {checkingOut ? "Processing..." : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
}
  