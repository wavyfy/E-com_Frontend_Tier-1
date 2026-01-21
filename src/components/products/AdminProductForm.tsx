"use client";

import { useState } from "react";
import { ProductAPI } from "@/lib/api/product.api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Props } from "@/lib/types/product";

export function AdminProductForm({ product }: Props) {
  const { role, isLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [saving, setSaving] = useState(false);

  // 🔑 critical fix
  if (isLoading) return <p>Checking permissions…</p>;
  if (role !== "admin") return <p>Unauthorized</p>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      if (product) {
        await ProductAPI.update(product._id, { name, price });
      } else {
        await ProductAPI.create({ name, price });
      }

      router.push("/admin/products");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{product ? "Edit Product" : "Create Product"}</h2>

      <input value={name} onChange={(e) => setName(e.target.value)} required />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        required
      />

      <button disabled={saving}>{saving ? "Saving…" : "Save"}</button>
    </form>
  );
}
