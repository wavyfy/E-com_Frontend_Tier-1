"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useCart();

  const itemsCount = cart?.itemsCount ?? 0;

  return (
    <nav
      style={{ display: "flex", gap: 12, padding: 12, alignItems: "center" }}
    >
      {/* Left / normal links */}
      <Link href="/products">Products</Link>

      {!isAuthenticated && <Link href="/register">Register</Link>}
      {!isAuthenticated && <Link href="/login">Login</Link>}
     {isAuthenticated && <Link href="/account/addresses">Addresses</Link>}
      {isAuthenticated && <Link href="/me">Me</Link>}
      {isAuthenticated && <Link href="/orders">Orders</Link>}
      <Link href="/cart">Cart{itemsCount > 0 ? ` (${itemsCount})` : ""}</Link>

      {/* Spacer */}
      <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        {/* Admin links (right aligned) */}
          {isAuthenticated && <Link href="/admin">Admin Dashboard</Link>}
         {isAuthenticated && <Link href="/admin/products">Admin Products</Link>}
        {isAuthenticated && <Link href="/admin/users">Admin Users</Link>}
        {isAuthenticated && <Link href="/admin/orders">Admin Orders</Link>}
        {isAuthenticated && <Link href="/admin/payments">Admin Payments</Link>}
        {isAuthenticated && <button onClick={logout}>Logout</button>}
      </div>
    </nav>
  );
}
