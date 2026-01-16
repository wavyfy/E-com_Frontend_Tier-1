"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { cart } = useCart();

  const itemsCount = cart?.itemsCount ?? 0;

  return (
    <nav style={{ display: "flex", gap: 12, padding: 12 }}>
      <Link href="/products">Products</Link>
      {!isAuthenticated && <Link href="/register">Register</Link>}
      {!isAuthenticated && <Link href="/login">Login</Link>}
      {isAuthenticated && <Link href="/me">Me</Link>}
      {isAuthenticated && <Link href="/orders">Orders</Link>}
      <Link href="/cart">Cart{itemsCount > 0 ? ` (${itemsCount})` : ""}</Link>
      {isAuthenticated && <button onClick={logout}>Logout</button>}
    </nav>
  );
}
