"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrderAPI } from "@/lib/api/order.api";
import { api } from "@/lib/api/client";
import type { Order } from "@/lib/api/order.api";
import { ApiError } from "@/lib/api/api-error";
import { OrderPaymentTimer } from "@/components/orders/OrderPaymentTimer";

export default function OrderPayPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [redirectIn, setRedirectIn] = useState<number | null>(null);

  const redirectStartedRef = useRef(false);
  const redirectCancelledRef = useRef(false);

  /* ---------- derived (NO narrowing bugs) ---------- */
  const MAX_RETRIES = 3;
  const status = order?.status;

  const attemptsUsed = order?.paymentAttempts ?? 0;
  const attemptsLeft = Math.max(0, MAX_RETRIES - attemptsUsed);

  const isCreated = status === "CREATED";
  const isPending = status === "PAYMENT_PENDING";

  // lock ONLY after attempt finishes and order returns to CREATED
  const retryExhausted = isCreated && attemptsUsed >= MAX_RETRIES;

  const paymentLocked = paying || isPending;

  /* ---------- reset redirect when unlocked ---------- */
  useEffect(() => {
    if (!retryExhausted) {
      redirectStartedRef.current = false;
      redirectCancelledRef.current = false;
      setRedirectIn(null);
    }
  }, [retryExhausted]);

  /* ---------- initial fetch ---------- */
  useEffect(() => {
    if (!orderId) return;
    OrderAPI.getById(orderId).then(setOrder);
  }, [orderId]);

  /* ---------- poll while PAYMENT_PENDING ---------- */
  useEffect(() => {
    if (!order || !isPending) return;

    const interval = setInterval(async () => {
      const latest = await OrderAPI.getById(order._id);
      setOrder(latest);
    }, 2000);

    return () => clearInterval(interval);
  }, [order, isPending]);

  /* ---------- detect REAL failure (backend-driven) ---------- */
  useEffect(() => {
    if (!order || retryExhausted) return;

    const last = order.statusHistory.at(-1);
    if (last?.from === "PAYMENT_PENDING" && last?.to === "CREATED") {
      setMessage("Payment failed. Please try again.");
    }
  }, [order, retryExhausted]);

  /* ---------- redirect countdown ---------- */
  useEffect(() => {
    if (!retryExhausted || redirectStartedRef.current) return;

    redirectStartedRef.current = true;
    setRedirectIn(5);

    const interval = setInterval(() => {
      setRedirectIn((prev) => (prev === null ? null : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [retryExhausted]);

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
        },

        modal: {
          ondismiss: async () => {
            try {
              await api(`/payments/${order._id}/abandon`, { method: "POST" });
              const latest = await OrderAPI.getById(order._id);
              setOrder(latest);
              setMessage("Payment window closed. You can retry.");
            } catch {
              setMessage("Payment window closed. Refreshing status…");
            }
          },
        },
      });

      rzp.open();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.code === "PAYMENT_IN_PROGRESS") {
          setMessage(
            "Payment is already open in another tab. Please complete it there."
          );
        } else if (err.code === "PAYMENT_RETRY_LIMIT_REACHED") {
          setMessage(
            "You have reached the maximum number of payment attempts."
          );
        } else {
          setMessage(err.message || "Unable to start payment.");
        }
      }
    } finally {
      setPaying(false);
    }
  }

  if (!order) return <p className="p-4">Loading…</p>;

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

      {isCreated && retryExhausted && (
        <>
          <p className="text-red-600">
            You’ve used all payment attempts for this order.
          </p>
          <p className="text-gray-600">Redirecting to cart in {redirectIn}s…</p>
        </>
      )}

      {isCreated && !retryExhausted && (
        <>
          {message && <p className="text-red-600">{message}</p>}
          <p className="text-gray-600">
            {attemptsLeft} attempt{attemptsLeft !== 1 ? "s" : ""} remaining
          </p>
        </>
      )}

      {isCreated &&
        (retryExhausted ? (
          <button
            onClick={() => {
              redirectCancelledRef.current = true;
              router.push("/cart");
            }}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Go to cart now
          </button>
        ) : (
          <button
            onClick={handlePay}
            disabled={paymentLocked}
            className="px-4 py-2 bg-black text-white rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {paymentLocked
              ? "Payment in progress…"
              : paying
              ? "Opening payment…"
              : "Pay Now"}
          </button>
        ))}
    </main>
  );
}
