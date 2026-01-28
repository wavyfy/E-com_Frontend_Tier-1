"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OrderAPI } from "@/lib/api/client/order.api";
import type { Address } from "@/lib/types/address";
import type { Order } from "@/lib/types/order";

import OrderSummary from "@/components/user/orders/OrderSummary";
import AddressLimitNotice from "@/components/user/address/AddressLimitNotice";
import CheckoutAddressList from "./CheckoutAddressList";
import CheckoutAddressAction from "./CheckoutAddressAction";

export default function CheckoutAddress({
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

    router.replace(`/account/orders/${orderId}/pay?addressConfirmed=1`);
  }

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-xl font-semibold">Select Delivery Address</h1>

      {order && <OrderSummary order={order} />}

      <CheckoutAddressList
        addresses={addresses}
        selected={selected}
        onSelect={setSelected}
      />

      <CheckoutAddressAction
        submitting={submitting}
        disabled={!selected}
        onConfirm={handleConfirm}
      />

      <AddressLimitNotice
        count={addresses.length}
        addHref={`/account/addresses/new?from=checkout&returnTo=${encodeURIComponent(
          `/account/orders/${orderId}/pay`,
        )}`}
      />
    </main>
  );
}
