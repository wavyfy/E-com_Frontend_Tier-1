import { fetchOrderById } from "@/lib/api/server/order.server";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import OrderDetails from "@/components/user/orders/OrderDetails";

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

  return <OrderDetails initialOrder={order} />;
}
