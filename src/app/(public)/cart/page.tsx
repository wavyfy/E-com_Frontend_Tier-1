"use client";

import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import { OrderAPI } from "@/lib/api/order.api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api/api-error";

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const router = useRouter();

  const [checkingOut, setCheckingOut] = useState(false);

  if (loading) {
    return <p className="p-4">Loading...</p>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <p>Your cart is empty.</p>
      </div>
    );
  }

  async function handleCheckout() {
    if (checkingOut) return;

    try {
      setCheckingOut(true);

      const order = await OrderAPI.checkout();

      // ✅ Redirect to payment step (NOT confirmation)
      router.push(`/orders/${order._id}/pay`);
    } catch (err) {
      if (err instanceof ApiError && err.type === "AUTH") {
        router.push("/login");
        return;
      }
      throw err;
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-xl font-semibold">Your Cart</h1>

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

      <div className="border-t pt-4 flex justify-between items-center">
        <div>
          <span className="font-medium">Items: {cart.itemsCount}</span>
          <br />
          <span className="font-semibold text-lg">
            Total: ₹{cart.totalAmount}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={checkingOut}
          className="px-4 py-2 bg-black text-white rounded"
        >
          {checkingOut ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}
