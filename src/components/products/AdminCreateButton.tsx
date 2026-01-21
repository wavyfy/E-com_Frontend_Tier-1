"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function AdminCreateButton() {
  const { role } = useAuth();

  if (role !== "admin") return null;

  return (
    <div style={{ marginBottom: 12 }}>
      <Link href="/admin/products/new">Create Product</Link>
    </div>
  );
}
