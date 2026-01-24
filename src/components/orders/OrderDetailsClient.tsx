"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { OrderAPI } from "@/lib/api/client/order.api";
import type { Order } from "@/lib/types/order";
import { useCart } from "@/context/CartContext";

const POLL_INTERVAL = 3000;

function formatDate(date?: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function displayStatus(status: string) {
  switch (status) {
    case "CREATED":
      return "Order placed";
    case "PAYMENT_PENDING":
      return "Payment in progress";
    case "PAID":
      return "Paid";
    case "SHIPPED":
      return "Shipped";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

function formatMoney(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

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

      if (
        ["PAID", "SHIPPED", "DELIVERED", "CANCELLED"].includes(latest.status)
      ) {
        clearInterval(pollRef.current!);
        pollRef.current = null;
      }
    }, POLL_INTERVAL);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = null;
    };
  }, [order, fetchOrder, refreshCart]);

  /* ---------- payment outcome ---------- */
  const hadPaymentAttempt = order.statusHistory.some(
    (h) => h.from === "PAYMENT_PENDING",
  );

  const wasFailed = order.statusHistory.some(
    (h) => h.from === "PAYMENT_PENDING" && h.to === "CREATED",
  );

  const itemsTotal = order.items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-xl font-semibold">Order #{order._id.slice(-6)}</h1>

      {/* ===== ORDER SUMMARY ===== */}
      <section className="border rounded p-4 space-y-1">
        <p>
          <strong>Status:</strong> {displayStatus(order.status)}
        </p>
        <p>
          <strong>Placed on:</strong> {formatDate(order.createdAt)}
        </p>
        <p>
          <strong>Items:</strong> {order.itemsCount}
        </p>
        <p>
          <strong>Total:</strong>{" "}
          {formatMoney(order.totalAmount, order.currency)}
        </p>
      </section>

      {/* ===== PAYMENT STATUS ===== */}
      <section className="border rounded p-4 space-y-1">
        <h2 className="font-medium">Payment</h2>

        {order.status === "PAYMENT_PENDING" && (
          <p className="text-sm text-gray-600">
            Payment is currently being processed.
          </p>
        )}

        {order.status === "CREATED" && hadPaymentAttempt && wasFailed && (
          <p className="text-sm text-red-600">
            Payment failed. No amount has been charged.
          </p>
        )}

        {order.status === "CREATED" && hadPaymentAttempt && !wasFailed && (
          <p className="text-sm text-gray-600">Payment was cancelled by you.</p>
        )}

        {order.status === "PAID" && (
          <p className="text-green-600 font-medium">✅ Payment successful</p>
        )}
      </section>

      {/* ===== ITEMS ===== */}
      <section className="border rounded p-4 space-y-2">
        <h2 className="font-medium">Items</h2>

        <ul className="divide-y">
          {order.items.map((item) => (
            <li key={item.productId} className="py-2 flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>

              <div className="font-medium">
                {formatMoney(item.subtotal, order.currency)}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ===== PRICE BREAKDOWN ===== */}
      <section className="border rounded p-4 space-y-2">
        <h2 className="font-medium">Price details</h2>

        <div className="flex justify-between text-sm">
          <span>Items ({order.itemsCount})</span>
          <span>{formatMoney(itemsTotal, order.currency)}</span>
        </div>

        <div className="flex justify-between font-semibold pt-2 border-t">
          <span>Total amount</span>
          <span>{formatMoney(order.totalAmount, order.currency)}</span>
        </div>
      </section>

      {/* ===== SHIPPING ADDRESS ===== */}
      {order.shippingAddressSnapshot && (
        <section className="border rounded p-4 space-y-1">
          <h2 className="font-medium">Shipping address</h2>

          <p>{order.shippingAddressSnapshot.name}</p>
          <p>{order.shippingAddressSnapshot.phone}</p>
          <p>
            {order.shippingAddressSnapshot.line},{" "}
            {order.shippingAddressSnapshot.city},{" "}
            {order.shippingAddressSnapshot.state}
          </p>
          <p>
            {order.shippingAddressSnapshot.postalCode},{" "}
            {order.shippingAddressSnapshot.country}
          </p>
        </section>
      )}

      {/* ===== ACTIONS ===== */}
      {order.status === "DELIVERED" && (
        <section>
          <button className="underline text-sm">Reorder</button>
        </section>
      )}
    </main>
  );
}
