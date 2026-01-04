"use client";

import { api } from "@/lib/api/client";
import type { Order } from "@/lib/types/order";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CheckoutPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;
    api<Order>(`/orders/${orderId}`).then(setOrder);
  }, [orderId]);

  if (!order) return <p>Loading...</p>;

  return (
    <main>
      <h1>Order Created</h1>
      <p>Status: {order.status}</p>
      <p>Items: {order.itemsCount}</p>
      <p>Total: ₹{order.totalAmount}</p>
    </main>
  );
}
