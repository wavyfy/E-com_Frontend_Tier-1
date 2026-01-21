"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderAPI } from "@/lib/api/order.api";
import type { Address } from "@/lib/types/address";

export default function OrderAddressSelect({
  orderId,
  addresses,
}: {
  orderId: string;
  addresses: Address[];
}) {
  const router = useRouter();

  const [selected, setSelected] = useState(
    addresses.find((a) => a.isDefault)?._id ?? addresses[0]._id,
  );
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    if (submitting) return;

    setSubmitting(true);
    await OrderAPI.attachAddress(orderId, selected);
    router.replace(`/orders/${orderId}/pay`);
  }

  return (
    <div className="space-y-4">
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
        disabled={submitting}
        className="w-full rounded-md bg-black py-2 text-white disabled:bg-gray-400"
      >
        {submitting ? "Saving…" : "Use this address"}
      </button>
    </div>
  );
}
