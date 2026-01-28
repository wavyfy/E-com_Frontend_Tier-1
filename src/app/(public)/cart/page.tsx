"use client";

import { useCart } from "@/context/CartContext";
import { OrderAPI } from "@/lib/api/client/order.api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApiError } from "@/lib/api/api-error";

import CartItemList from "@/components/user/cart/CartItemList";
import CartSummary from "@/components/user/cart/CartSummary";
import LoadingState from "@/components/common/LoadingState";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function CartPage() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const router = useRouter();
  const [checkingOut, setCheckingOut] = useState(false);

  if (loading) {
    return <LoadingState message="Loading cart..." />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Looks like you haven’t added anything yet."
        action={
          <Link href="/products">
            <Button>Browse products</Button>
          </Link>
        }
      />
    );
  }

  async function handleCheckout() {
    if (checkingOut) return;

    try {
      setCheckingOut(true);
      const order = await OrderAPI.checkout();

      if (order.shippingAddressSnapshot) {
        router.push(`/account/orders/${order._id}/pay`);
      } else {
        router.push(`/account/orders/${order._id}/address`);
      }
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

      <CartItemList
        items={cart.items}
        onIncrease={(id, qty) => updateItem(id, qty)}
        onDecrease={async (id, qty) => {
          if (qty === 1) {
            await removeItem(id);
          } else {
            await updateItem(id, qty - 1);
          }
        }}
        onRemove={(id) => removeItem(id)}
      />

      <CartSummary
        itemsCount={cart.itemsCount}
        totalAmount={cart.totalAmount}
        checkingOut={checkingOut}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
