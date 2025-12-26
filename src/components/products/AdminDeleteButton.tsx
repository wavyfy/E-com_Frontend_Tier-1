"use client";

import { ProductAPI } from "@/lib/api/product.api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function AdminDeleteButton({ productId }: { productId: string }) {
  const { role } = useAuth();
  const router = useRouter();

  if (role !== "admin") return null;

  async function handleDelete() {
    const ok = confirm("Delete this product?");
    if (!ok) return;

    try {
      await ProductAPI.delete(productId);
      router.refresh();
      router.push("/products");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Not allowed";
      alert(message);
    }
  }

  return (
    <button onClick={handleDelete} style={{ marginLeft: 8, color: "black" }}>
      Delete
    </button>
  );
}
