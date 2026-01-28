"use client";

import { useState } from "react";
import { ProductAPI } from "@/lib/api/client/product.api";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types/product";

export default function AdminProductForm({ product }: { product?: Product }) {
  const router = useRouter();

  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [saving, setSaving] = useState(false);

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">
        {product ? "Edit Product" : "Create Product"}
      </h2>

      <div className="space-y-3">
        <input
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded p-2"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
          className="w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="border rounded px-4 py-2 disabled:opacity-50"
      >
        {saving ? "Saving…" : "Save"}
      </button>
    </form>
  );
}
