import Link from "next/link";
import type { AdminOrderDetail as AdminOrderDetailType } from "@/lib/types/order";

import AdminOrderSummary from "./AdminOrderSummary";
import AdminOrderItemsTable from "./AdminOrderItemsTable";
import AdminOrderActions from "./AdminOrderActions";
import AdminOrderStatusHistory from "./AdminOrderStatusHistory";

export default function AdminOrderDetail({
  order,
  updateStatus,
}: {
  order: AdminOrderDetailType;
  updateStatus: (formData: FormData) => void;
}) {
  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <Link href="/admin/orders" className="underline">
        ← Back to orders
      </Link>

      <h1 className="text-xl font-semibold">Order</h1>

      <AdminOrderSummary order={order} />
      <AdminOrderItemsTable order={order} />

      {order.status === "PAID" && (
        <AdminOrderActions updateStatus={updateStatus} />
      )}

      <AdminOrderStatusHistory order={order} />
    </main>
  );
}
