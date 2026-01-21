// app/(protected)/orders/[orderId]/page.tsx
import { fetchOrderById } from "@/lib/api/order.server";
import { notFound } from "next/navigation";
import OrderDetailsClient from "@/components/orders/OrderDetailsClient";
import { ApiError } from "@/lib/api/api-error";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  let order;
  try {
    order = await fetchOrderById(orderId);
  } catch (err: unknown) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return <OrderDetailsClient initialOrder={order} />;
}
