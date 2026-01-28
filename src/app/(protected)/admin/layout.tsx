import Link from "next/link";

// src/lib/config/admin-nav.ts
export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/questions", label: "Questions" },
];


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[240px_1fr] min-h-screen">
      {/* Sidebar */}
      <aside className="border-r p-5 flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Admin</h2>

        <nav className="flex flex-col gap-3 text-md">
          {ADMIN_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <section className="p-6">{children}</section>
    </div>
  );
}
