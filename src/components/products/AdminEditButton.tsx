"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function AdminEditButton({ productId }: { productId: string }) {
  const { role } = useAuth();

  if (role !== "admin") return null;

  return (
    <Link href={`/admin/products/edit/${productId}`} style={{ marginLeft: 8 }}>
      Edit
    </Link>
  );
}
