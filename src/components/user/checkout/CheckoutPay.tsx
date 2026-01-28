"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrderAPI } from "@/lib/api/client/order.api";
import { api } from "@/lib/api/client/client";
import type { Order } from "@/lib/types/order";
import { ApiError } from "@/lib/api/api-error";
import { CheckoutPayTimer } from "@/components/user/checkout/CheckoutPayTimer";
import { useCart } from "@/context/CartContext";

import CheckoutPayStatus from "./CheckoutPayStatus";
import CheckoutPayAddress from "./CheckoutPayAddress";
import CheckoutPayAction from "./CheckoutPayAction";

const MAX_RETRIES = 3;

export default function CheckoutPay() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const { clear } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [paying, setPaying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [redirectIn, setRedirectIn] = useState<number | null>(null);

  const redirectStartedRef = useRef(false);
  const redirectCancelledRef = useRef(false);
  const handlingTransitionRef = useRef(false);
  const addressGuardTriggeredRef = useRef(false);

  const status = order?.status;
  const attemptsUsed = order?.paymentAttempts ?? 0;
  const attemptsLeft = Math.max(0, MAX_RETRIES - attemptsUsed);

  const isCreated = status === "CREATED";
  const isPending = status === "PAYMENT_PENDING";
  const retryExhausted = isCreated && attemptsUsed >= MAX_RETRIES;
  const paymentLocked = paying || isPending;

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

  /* ---------- address guard ---------- */
  useEffect(() => {
    if (!loaded || !order) return;
    if (order.shippingAddressSnapshot) return;

    if (addressGuardTriggeredRef.current) return;
    addressGuardTriggeredRef.current = true;

    OrderAPI.getById(order._id).then((latest) => {
      if (!latest.shippingAddressSnapshot) {
        router.replace(`/account/orders/${order._id}/address`);
      } else {
        setOrder(latest);
      }
    });
  }, [loaded, order, router]);

  /* ---------- poll while pending ---------- */
  useEffect(() => {
    if (!order || !isPending) return;

    const interval = setInterval(async () => {
      const latest = await OrderAPI.getById(order._id);
      setOrder(latest);
    }, 2000);

    return () => clearInterval(interval);
  }, [order, isPending]);

  /* ---------- transition handling ---------- */
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
      setRedirectIn((v) => (v === null ? null : v - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [redirectIn]);

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
          router.replace(`/account/orders/${order._id}?justPaid=1`);
          router.refresh();
          clear();
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
          router.replace(`/account/orders/${order._id}/address`);
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

      <CheckoutPayStatus
        order={order}
        message={message}
        attemptsLeft={attemptsLeft}
      />

      {isPending && (
        <>
          <CheckoutPayTimer paymentInitiatedAt={order.paymentInitiatedAt} />
          <p className="text-sm text-gray-500">
            Payment is already open in another window.
          </p>
        </>
      )}

      <CheckoutPayAddress order={order} />

      <CheckoutPayAction
        isCreated={isCreated}
        locked={paymentLocked}
        onPay={handlePay}
      />
    </main>
  );
}
