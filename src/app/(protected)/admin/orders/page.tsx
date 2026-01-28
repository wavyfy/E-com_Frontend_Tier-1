import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import { fetchAdminOrders } from "@/lib/api/server/order.server";
import AdminOrdersTable from "@/components/admin/orders/AdminOrdersTable";
import type { AdminOrderListItem } from "@/lib/types/order";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  const currentPage = Math.max(Number(page) || 1, 1);
  const limit = 10;

  let items: AdminOrderListItem[] = [];
  let hasNextPage = false;

  try {
    const res = await fetchAdminOrders(currentPage, limit);
    items = res.items;
    hasNextPage = items.length === limit;
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <AdminOrdersTable
      orders={items}
      currentPage={currentPage}
      hasNextPage={hasNextPage}
    />
  );
}
