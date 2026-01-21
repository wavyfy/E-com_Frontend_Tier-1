"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrderAPI } from "@/lib/api/order.api";
import type { Address } from "@/lib/types/address";
import type { Order } from "@/lib/types/order";
import OrderSummary from "@/components/orders/OrderSummary";

export default function OrderAddressSelect({
  orderId,
  addresses,
}: {
  orderId: string;
  addresses: Address[];
}) {
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /* ---------- fetch order + sync selection ---------- */
  useEffect(() => {
    let mounted = true;

    async function init() {
      const o = await OrderAPI.getById(orderId);
      if (!mounted) return;

      setOrder(o);

      const s = o.shippingAddressSnapshot;

      if (s) {
        const match = addresses.find(
          (a) => a.line === s.line && a.postalCode === s.postalCode,
        );
        if (match) {
          setSelected(match._id);
          return;
        }
      }

      // fallback
      setSelected(addresses.find((a) => a.isDefault)?._id ?? addresses[0]._id);
    }

    init();
    return () => {
      mounted = false;
    };
  }, [orderId, addresses]);

  /* ---------- confirm ---------- */
  async function handleConfirm() {
    if (submitting || !selected) return;

    setSubmitting(true);
    await OrderAPI.attachAddress(orderId, selected);

    router.replace(`/orders/${orderId}/pay?addressConfirmed=1`);
  }

  return (
    <div className="space-y-6">
      {/* ✅ ORDER SUMMARY */}
      {order && <OrderSummary order={order} />}

      {/* ✅ ADDRESS LIST */}
      {addresses.map((a) => (
        <label
          key={a._id}
          className="flex gap-3 rounded-md border p-4 cursor-pointer hover:border-gray-400"
        >
          <input
            type="radio"
            checked={selected === a._id}
            onChange={() => setSelected(a._id)}
          />

          <div className="text-sm">
            <p className="font-medium">
              {a.name}
              {a.isDefault && (
                <span className="ml-2 text-xs text-green-600">Default</span>
              )}
            </p>
            <p className="text-gray-600">
              {a.line}, {a.city}, {a.state}
            </p>
            <p className="text-gray-600">
              {a.postalCode}, {a.country}
            </p>
            <p className="text-gray-600">{a.phone}</p>
          </div>
        </label>
      ))}

      <button
        onClick={handleConfirm}
        disabled={submitting || !selected}
        className="w-full rounded-md bg-black py-2 text-white disabled:bg-gray-400"
      >
        {submitting ? "Saving…" : "Use this address"}
      </button>
    </div>
  );
}
