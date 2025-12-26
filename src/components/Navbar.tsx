"use client";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav style={{ display: "flex", gap: 12, padding: 12 }}>
      {!isAuthenticated && <a href="/register">Register</a>}
      {!isAuthenticated && <a href="/login">Login</a>}
      {isAuthenticated && <a href="/me">Me</a>}
      {isAuthenticated && <button onClick={logout}>Logout</button>}
    </nav>
  );
}
