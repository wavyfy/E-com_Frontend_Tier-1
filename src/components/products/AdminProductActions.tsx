"use client";

import { AdminEditButton } from "./AdminEditButton";
import { AdminDeleteButton } from "./AdminDeleteButton";
import { useAuth } from "@/context/AuthContext";

export function AdminProductActions({ productId }: { productId: string }) {
  const { role } = useAuth();

  if (role !== "admin") return null;

  return (
    <>
      <AdminEditButton productId={productId} />
      <AdminDeleteButton productId={productId} />
    </>
  );
}
