import { fetchAdminDashboard } from "@/lib/api/server/admin-dashboard.server";

export default async function AdminDashboardPage() {
  const data = await fetchAdminDashboard();

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <h1>Admin Dashboard</h1>

      {/* KPIs */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 30,
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            padding: 30,
          }}
        >
          Total Orders: {data.kpis.totalOrders}
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            padding: 30,
          }}
        >
          Pending Orders: {data.kpis.pendingOrders}
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            padding: 30,
          }}
        >
          Total Revenue: ₹{data.kpis.totalRevenue}
        </div>
        <div
          style={{
            border: "1px solid #ddd",
            padding: 30,
          }}
        >
          Failed Payments: {data.kpis.failedPayments}
        </div>
      </section>

      {/* Recent Orders */}
      <section style={{ marginTop: 32 }}>
        <h3>Recent Orders</h3>
        <ul>
          {data.recentOrders.map((o) => (
            <li key={o._id}>
              {o._id} — {o.status} — ₹{o.totalAmount}
            </li>
          ))}
        </ul>
      </section>

      {/* Recent Payments */}
      <section style={{ marginTop: 32 }}>
        <h3>Recent Payments</h3>
        <ul>
          {data.recentPayments.map((p) => (
            <li key={p._id}>
              {p._id} — {p.status} — ₹{p.amount}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
