import { fetchOrders } from "@/lib/api/server/order.server";
import OrdersList from "@/components/user/orders/OrdersList";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;

  const currentPage = Math.max(Number(page) || 1, 1);
  const limit = 10;

  const res = await fetchOrders(currentPage, limit);

  return (
    <OrdersList
      orders={res.items}
      currentPage={currentPage}
      hasNextPage={res.items.length === limit}
    />
  );
}
