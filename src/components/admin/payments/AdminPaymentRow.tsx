import Link from "next/link";
import type { AdminPaymentListItem } from "@/lib/types/payment";

export default function AdminPaymentRow({
  payment,
}: {
  payment: AdminPaymentListItem;
}) {
  return (
    <tr className="border-t">
      <td className="py-2 font-mono">{payment.id}</td>
      <td className="font-mono">{payment.orderId}</td>
      <td className="font-mono">{payment.userId}</td>
      <td>
        {payment.currency} {payment.amount}
      </td>
      <td>{payment.status}</td>
      <td>{payment.attempts}</td>
      <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
      <td>
        <Link
          href={`/admin/payments/${payment.id}`}
          className="text-blue-600 underline"
        >
          View
        </Link>
      </td>
    </tr>
  );
}
