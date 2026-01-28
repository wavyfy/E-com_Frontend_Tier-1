import { fetchAdminDashboard } from "@/lib/api/server/admin-dashboard.server";
import AdminDashboardKPIs from "@/components/admin/dashboard/AdminDashboardKPIs";
import AdminRecentOrders from "@/components/admin/dashboard/AdminRecentOrders";
import AdminRecentPayments from "@/components/admin/dashboard/AdminRecentPayments";

export default async function AdminDashboardPage() {
  const data = await fetchAdminDashboard();

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-10">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>

      <AdminDashboardKPIs kpis={data.kpis} />

      <AdminRecentOrders orders={data.recentOrders} />

      <AdminRecentPayments payments={data.recentPayments} />
    </main>
  );
}
