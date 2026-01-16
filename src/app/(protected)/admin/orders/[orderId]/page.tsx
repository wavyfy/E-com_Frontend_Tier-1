import { fetchAdminOrderById } from "@/lib/api/order.server";
import OrderSummary from "@/components/orders/OrderSummary";
import OrderItemsTable from "@/components/orders/OrderItemsTable";
import OrderStatusActions from "@/components/orders/OrderStatusActions";
import OrderStatusTimeline from "@/components/orders/OrderStatusTimeline";

export default async function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ orderId: string }>; // 👈 IMPORTANT
}) {
  const { orderId } = await params; // 👈 MUST await

  const order = await fetchAdminOrderById(orderId);

  return (
    <main className="space-y-6 p-6">
      <OrderSummary order={order} />
      <OrderStatusActions order={order} />
      <OrderItemsTable items={order.items} />
      <OrderStatusTimeline history={order.statusHistory} />
    </main>
  );
}
