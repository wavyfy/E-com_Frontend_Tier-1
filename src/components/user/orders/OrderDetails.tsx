"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { OrderAPI } from "@/lib/api/client/order.api";
import type { Order } from "@/lib/types/order";
import { useCart } from "@/context/CartContext";

import OrderSummary from "./OrderSummary";
import OrderPaymentStatus from "./OrderPaymentStatus";
import OrderItems from "./OrderItems";
import OrderPriceBreakdown from "./OrderPriceBreakdown";
import OrderShippingAddress from "./OrderShippingAddress";

const POLL_INTERVAL = 3000;

export default function OrderDetails({
  initialOrder,
}: {
  initialOrder: Order;
}) {
  const { refresh: refreshCart } = useCart();
  const [order, setOrder] = useState<Order>(initialOrder);

  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const refreshedRef = useRef(false);

  const fetchOrder = useCallback(
    () => OrderAPI.getById(order._id),
    [order._id],
  );

  /* ---------- polling ---------- */
  useEffect(() => {
    const shouldPoll =
      order.status === "CREATED" ||
      (order.status === "PAYMENT_PENDING" && order.paymentInitiatedAt);

    if (!shouldPoll) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
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

      if (
        ["PAID", "SHIPPED", "DELIVERED", "CANCELLED"].includes(latest.status)
      ) {
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }
      }
    }, POLL_INTERVAL);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [order, fetchOrder, refreshCart]);

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-xl font-semibold">Order #{order._id.slice(-6)}</h1>

      <OrderSummary order={order} />
      <OrderPaymentStatus order={order} />
      <OrderItems order={order} />
      <OrderPriceBreakdown order={order} />
      <OrderShippingAddress order={order} />

      {order.status === "DELIVERED" && (
        <section>
          <button className="underline text-sm">Reorder</button>
        </section>
      )}
    </main>
  );
}
