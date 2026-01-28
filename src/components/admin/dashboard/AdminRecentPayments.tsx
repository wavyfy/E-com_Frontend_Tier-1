import Link from "next/link";
import type { AdminDashboardPayment } from "@/lib/types/admin-dashboard";

export default function AdminRecentPayments({
  payments,
}: {
  payments: AdminDashboardPayment[];
}) {
  return (
    <section>
      <h3 className="font-medium mb-2">Recent Payments</h3>
      <ul className="space-y-1 text-sm">
        {payments.map((p) => (
          <li key={p._id}>
            <Link href={`/admin/payments/${p._id}`} className="underline">
              {p._id}
            </Link>{" "}
            — {p.status} — {p.currency} {p.amount}
          </li>
        ))}
      </ul>
    </section>
  );
}
