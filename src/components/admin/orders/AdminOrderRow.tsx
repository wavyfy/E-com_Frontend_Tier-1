import Link from "next/link";
import type { AdminOrderListItem } from "@/lib/types/order";

export default function AdminOrderRow({
  order,
}: {
  order: AdminOrderListItem;
}) {
  return (
    <tr className="border-t">
      <td className="py-2 font-mono">{order.id}</td>
      <td className="font-mono">{order.userId}</td>
      <td>
        {order.currency} {order.totalAmount}
      </td>
      <td>{order.status}</td>
      <td>{order.paymentAttempts}</td>
      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
      <td>
        <Link
          href={`/admin/orders/${order.id}`}
          className="text-blue-600 underline"
        >
          View
        </Link>
      </td>
    </tr>
  );
}
