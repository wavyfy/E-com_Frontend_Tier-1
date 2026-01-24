"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrderAPI } from "@/lib/api/client/order.api";
import { api } from "@/lib/api/client/client";
import type { Order } from "@/lib/types/order";
import { ApiError } from "@/lib/api/api-error";
import { OrderPaymentTimer } from "@/components/orders/OrderPaymentTimer";

export default function OrderPayPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [redirectIn, setRedirectIn] = useState<number | null>(null);

  const redirectStartedRef = useRef(false);
  const redirectCancelledRef = useRef(false);
  const handlingTransitionRef = useRef(false);
  const addressGuardTriggeredRef = useRef(false);

  /* ---------- derived ---------- */
  const MAX_RETRIES = 3;
  const status = order?.status;

  const attemptsUsed = order?.paymentAttempts ?? 0;
  const attemptsLeft = Math.max(0, MAX_RETRIES - attemptsUsed);

  const isCreated = status === "CREATED";
  const isPending = status === "PAYMENT_PENDING";
  const retryExhausted = isCreated && attemptsUsed >= MAX_RETRIES;
  const paymentLocked = paying || isPending;

  const lockedMessage = isPending
    ? "Payment is already open in another tab. Please complete it there."
    : retryExhausted
      ? "Retry limit reached. Redirecting to cart."
      : null;

  /* ---------- initial fetch ---------- */
  useEffect(() => {
    if (!orderId) return;

    OrderAPI.getById(orderId)
      .then((data) => {
        setOrder(data);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [orderId]);

  /* ---------- address guard (FINAL – snapshot-safe) ---------- */
  useEffect(() => {
    if (!loaded || !order) return;

    // allow one render cycle for server-side attach to reflect
    if (!order.shippingAddressSnapshot) {
      if (addressGuardTriggeredRef.current) return;

      addressGuardTriggeredRef.current = true;

      // re-fetch once before redirecting
      OrderAPI.getById(order._id).then((latest) => {
        if (!latest.shippingAddressSnapshot) {
          router.replace(`/orders/${order._id}/address`);
        } else {
          setOrder(latest); // 🔑 snapshot now available → render
        }
      });
    }
  }, [loaded, order, router]);

  /* ---------- poll while PAYMENT_PENDING ---------- */
  useEffect(() => {
    if (!order || !isPending) return;

    const interval = setInterval(async () => {
      const latest = await OrderAPI.getById(order._id);
      setOrder(latest);
    }, 2000);

    return () => clearInterval(interval);
  }, [order, isPending]);

  /* ---------- transition handler ---------- */
  useEffect(() => {
    if (!order) return;

    const last = order.statusHistory.at(-1);
    if (!last || handlingTransitionRef.current) return;

    handlingTransitionRef.current = true;

    if (last.from === "PAYMENT_PENDING" && last.to === "CREATED") {
      setMessage("Payment failed. Please try again.");
      setRedirectIn(null);
      redirectStartedRef.current = false;
    }

    if (retryExhausted && !redirectStartedRef.current) {
      redirectStartedRef.current = true;
      setRedirectIn(5);
    }

    queueMicrotask(() => {
      handlingTransitionRef.current = false;
    });
  }, [order, retryExhausted]);

  /* ---------- redirect countdown ---------- */
  useEffect(() => {
    if (redirectIn === null || redirectIn <= 0) return;

    const interval = setInterval(() => {
      setRedirectIn((prev) => (prev === null ? null : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [redirectIn]);

  /* ---------- redirect ---------- */
  useEffect(() => {
    if (redirectIn === 0 && !redirectCancelledRef.current) {
      router.push("/cart");
    }
  }, [redirectIn, router]);

  /* ---------- initiate payment ---------- */
  async function handlePay() {
    if (!order || paymentLocked || !isCreated) return;

    setPaying(true);
    setMessage(null);

    try {
      const payment = await api<{
        razorpayOrderId: string;
        amount: number;
        currency: string;
        key: string;
      }>(`/payments/${order._id}/initiate`, { method: "POST" });

      const latest = await OrderAPI.getById(order._id);
      setOrder(latest);

      const rzp = new window.Razorpay({
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        order_id: payment.razorpayOrderId,
        handler: () => {
          router.replace(`/orders/${order._id}?justPaid=1`);
          router.refresh();
        },
        modal: {
          ondismiss: async () => {
            try {
              await api(`/payments/${order._id}/abandon`, { method: "POST" });
              const latest = await OrderAPI.getById(order._id);
              setOrder(latest);
              setMessage("Payment window closed. You can retry.");
              if (
                latest.status === "CREATED" &&
                latest.paymentAttempts >= MAX_RETRIES
              ) {
                router.replace("/cart");
              }
            } catch {
              setMessage("Payment window closed. Refreshing status…");
            }
          },
        },
      });

      rzp.open();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "ADDRESS_REQUIRED") {
          router.replace(`/orders/${order._id}/address`);
          return;
        }

        setMessage(err.message || "Unable to start payment.");
      }
    } finally {
      setPaying(false);
    }
  }

  /* ---------- render guards ---------- */
  if (!loaded) return <p className="p-4">Loading…</p>;
  if (!order) return <p className="p-4">Order not found</p>;

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Checkout</h1>

      <p>
        <strong>Status:</strong> {status}
      </p>

      {isPending && (
        <>
          <OrderPaymentTimer paymentInitiatedAt={order.paymentInitiatedAt} />
          <p className="text-sm text-gray-500">
            Payment is already open. Please complete it in the active window.
          </p>
        </>
      )}

      {/* ✅ ADDRESS DISPLAY (correct + stable) */}
      {order.shippingAddressSnapshot && (
        <section className="border rounded p-3 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Delivery Address</h2>
            <button
              onClick={() => router.push(`/orders/${order._id}/address`)}
              className="text-sm text-blue-600 underline"
            >
              Change
            </button>
          </div>

          <div className="text-sm text-gray-700 leading-relaxed">
            <p className="font-medium">{order.shippingAddressSnapshot.name}</p>
            <p>{order.shippingAddressSnapshot.line}</p>
            <p>
              {order.shippingAddressSnapshot.postalCode},{" "}
              {order.shippingAddressSnapshot.city},{" "}
              {order.shippingAddressSnapshot.state}
            </p>
            <p>{order.shippingAddressSnapshot.country}</p>
            <p>{order.shippingAddressSnapshot.phone}</p>
          </div>
        </section>
      )}

      {isCreated && !retryExhausted && (
        <>
          {(message || lockedMessage) && (
            <p className="text-red-600">{lockedMessage ?? message}</p>
          )}
          <p className="text-gray-600">
            {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining
          </p>
        </>
      )}

      {isCreated && (
        <button
          onClick={handlePay}
          disabled={paymentLocked}
          className="px-4 py-2 bg-black text-white rounded disabled:bg-gray-400"
        >
          {paymentLocked ? "Payment in progress…" : "Pay Now"}
        </button>
      )}
    </main>
  );
}
