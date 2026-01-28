import Link from "next/link";
import type { AdminPaymentListItem } from "@/lib/types/payment";

export default function AdminUserPayments({
  payments,
}: {
  payments: AdminPaymentListItem[];
}) {
  if (!payments.length) {
    return <p className="opacity-60">No payments</p>;
  }

  return (
    <section>
      <h2 className="font-medium">Payments</h2>
      <ul className="space-y-1 text-sm">
        {payments.map((p) => (
          <li key={p.id}>
            <Link href={`/admin/payments/${p.id}`} className="underline">
              {p.id}
            </Link>{" "}
            — {p.status}
          </li>
        ))}
      </ul>
    </section>
  );
}
