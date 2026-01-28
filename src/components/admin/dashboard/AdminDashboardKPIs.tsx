import AdminKpiCard from "./AdminKpiCard";

export default function AdminDashboardKPIs({
  kpis,
}: {
  kpis: {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    failedPayments: number;
  };
}) {
  return (
    <section className="grid grid-cols-4 gap-6">
      <AdminKpiCard label="Total Orders" value={kpis.totalOrders} />
      <AdminKpiCard label="Pending Orders" value={kpis.pendingOrders} />
      <AdminKpiCard label="Total Revenue" value={`₹${kpis.totalRevenue}`} />
      <AdminKpiCard label="Failed Payments" value={kpis.failedPayments} />
    </section>
  );
}
