// app/(protected)/orders/[orderId]/OrderDetailsClient.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { OrderAPI } from "@/lib/api/order.api";
import type { Order } from "@/lib/types/order";
import { useCart } from "@/context/CartContext";

const POLL_INTERVAL = 3000;

export default function OrderDetailsClient({
  initialOrder,
}: {
  initialOrder: Order;
}) {
  const { refresh: refreshCart } = useCart();
  const [order, setOrder] = useState<Order>(initialOrder);

  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const refreshedRef = useRef(false);

  const fetchOrder = useCallback(async () => {
    return OrderAPI.getById(order._id);
  }, [order._id]);

  /* ---------- polling ---------- */
  useEffect(() => {
    const shouldPoll =
      order.status === "CREATED" ||
      (order.status === "PAYMENT_PENDING" && order.paymentInitiatedAt);

    if (!shouldPoll) {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
      return;
    }

    if (pollRef.current) return;

    pollRef.current = setInterval(async () => {
      const latest = await fetchOrder();
      setOrder(latest);

      if (latest.status === "PAID" && !refreshedRef.current) {
        refreshedRef.current = true;
        refreshCart();
      }

      if (["PAID", "FULFILLED", "CANCELLED"].includes(latest.status)) {
        clearInterval(pollRef.current!);
        pollRef.current = null;
      }
    }, POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [order, fetchOrder, refreshCart]);

  /* ---------- derive payment outcome ---------- */
  const hadPaymentAttempt = order.statusHistory.some(
    (h) => h.from === "PAYMENT_PENDING",
  );

  const wasFailed = order.statusHistory.some(
    (h) => h.from === "PAYMENT_PENDING" && h.to === "CREATED",
  );

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Order Details</h1>

      <p>
        <strong>Status:</strong> {order.status}
      </p>

      {order.status === "PAYMENT_PENDING" && (
        <p className="text-sm text-gray-600">
          Payment is being processed. Please complete the payment in the popup.
        </p>
      )}

      {order.status === "CREATED" && hadPaymentAttempt && wasFailed && (
        <p className="text-sm text-red-600">
          Payment failed. No amount has been charged.
        </p>
      )}

      {order.status === "CREATED" && hadPaymentAttempt && !wasFailed && (
        <p className="text-sm text-gray-600">
          Payment was cancelled by the user.
        </p>
      )}

      {order.status === "PAID" && (
        <p className="text-green-600 font-medium">✅ Payment successful</p>
      )}
    </main>
  );
}
