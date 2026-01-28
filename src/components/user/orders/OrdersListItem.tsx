import Link from "next/link";
import type { Order } from "@/lib/types/order";

function getDisplayStatus(status: string) {
  switch (status) {
    case "CREATED":
    case "PAID":
      return "Order placed";
    case "SHIPPED":
      return "Shipped";
    case "DELIVERED":
      return "Delivered";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status;
  }
}

export default function OrdersListItem({ order }: { order: Order }) {
  const firstItem = order.items?.[0];
  const moreCount =
    order.itemsCount > 1 ? ` + ${order.itemsCount - 1} more` : "";

  return (
    <li>
      <Link
        href={`/account/orders/${order._id}`}
        className="block p-4 space-y-1"
      >
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="font-medium">Order #{order._id.slice(-6)}</p>

            <p className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>

            <p className="text-sm">
              {firstItem?.name}
              {moreCount}
            </p>

            <p className="text-sm text-gray-600">
              Status: {getDisplayStatus(order.status)}
            </p>
          </div>

          <div className="text-right">
            <p className="font-semibold">₹{order.totalAmount}</p>
          </div>
        </div>
      </Link>
    </li>
  );
}
