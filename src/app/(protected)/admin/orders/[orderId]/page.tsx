import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import {
  fetchAdminOrderById,
  updateAdminOrderStatus,
} from "@/lib/api/server/order.server";
import AdminOrderDetail from "@/components/admin/orders/AdminOrderDetail";
import type { AdminOrderDetail as AdminOrderDetailType } from "@/lib/types/order";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  let order: AdminOrderDetailType;

  try {
    order = await fetchAdminOrderById(orderId);
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  async function updateStatus(formData: FormData) {
    "use server";

    const status = formData.get("status");

    if (status !== "PAID" && status !== "FULFILLED" && status !== "CANCELLED") {
      return;
    }

    await updateAdminOrderStatus(order.id, status);
  }

  return <AdminOrderDetail order={order} updateStatus={updateStatus} />;
}
