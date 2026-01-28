"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuth();
  const { cart } = useCart();

  const itemsCount = cart?.itemsCount ?? 0;
  const isAdmin = role === "admin";

  return (
    <nav
      style={{ display: "flex", gap: 12, padding: 12, alignItems: "center" }}
    >
      {/* Left / normal links */}
      <Link href="/products">Products</Link>

      {isAuthenticated && <Link href="/account/addresses">Addresses</Link>}
      {isAuthenticated && <Link href="/account/profile">Me</Link>}
      {isAuthenticated && <Link href="/account/orders">Orders</Link>}
      <Link href="/cart">Cart{itemsCount > 0 ? ` (${itemsCount})` : ""}</Link>

      {/* Spacer */}
      <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
        {isAdmin && <Link href="/admin">Admin Dashboard</Link>}

        {!isAuthenticated && <Link href="/register">Register</Link>}
        {!isAuthenticated && <Link href="/login">Login</Link>}
        {isAuthenticated && <button onClick={logout}>Logout</button>}
      </div>
    </nav>
  );
}
