import Link from "next/link";
import type { Order } from "@/lib/types/order";
import OrdersListItem from "./OrdersListItem";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/ui/Button";
import Pagination from "@/components/common/Pagination";

export default function OrdersList({
  orders,
  currentPage,
  hasNextPage,
}: {
  orders: Order[];
  currentPage: number;
  hasNextPage: boolean;
}) {
  if (!orders.length) {
    return (
      <EmptyState
        title="No orders yet"
        description="Your orders will appear here once you make a purchase."
        action={
          <Link href="/products">
            <Button>Browse products</Button>
          </Link>
        }
      />
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Your Orders</h1>

      <ul className="divide-y border rounded">
        {orders.map((order) => (
          <OrdersListItem key={order._id} order={order} />
        ))}
      </ul>

      <Pagination
        currentPage={currentPage}
        basePath="/account/orders"
        hasNextPage={hasNextPage}
      />
    </main>
  );
}
