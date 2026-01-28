"use client";

import { ProductAPI } from "@/lib/api/client/product.api";
import { useRouter } from "next/navigation";

export function AdminDeleteButton({ productId }: { productId: string }) {
  const router = useRouter();

  async function handleDelete() {
    const ok = confirm("Delete this product?");
    if (!ok) return;

    try {
      await ProductAPI.delete(productId);
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Not allowed";
      alert(message);
    }
  }

  return (
    <button onClick={handleDelete} className="ml-2 underline text-sm">
      Delete
    </button>
  );
}
