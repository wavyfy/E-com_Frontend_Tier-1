import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "240px 1fr",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          borderRight: "1px solid #e5e5e5",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <h2 style={{ marginBottom: 8 }}>Admin</h2>

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/payments">Payments</Link>
          <Link href="/admin/users">Users</Link>
          <Link href="/admin/products">Products</Link>
        </nav>
      </aside>

      {/* Main content */}
      <section style={{ padding: 24 }}>{children}</section>
    </div>
  );
}
