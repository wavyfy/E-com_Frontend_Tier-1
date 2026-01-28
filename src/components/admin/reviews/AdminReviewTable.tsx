"use client";

import { useState } from "react";
import { ReviewAPI } from "@/lib/api/client/review.api";
import type { AdminReviewListResponse, ReviewAdmin } from "@/lib/types/review";
import AdminReviewRow from "./AdminReviewRow";
import AdminTable from "../common/AdminTable";

export default function AdminReviewsTable({
  initialData,
}: {
  initialData: AdminReviewListResponse;
}) {
  const [data, setData] = useState(initialData);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function toggleHide(r: ReviewAdmin) {
    if (loadingId) return;
    setLoadingId(r._id);

    try {
      const updated = r.isHidden
        ? await ReviewAPI.unhide(r._id)
        : await ReviewAPI.hide(r._id);

      setData((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i._id === r._id ? updated : i)),
      }));
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteReview(id: string) {
    if (loadingId) return;
    if (!confirm("Delete this review permanently?")) return;

    setLoadingId(id);
    try {
      await ReviewAPI.delete(id);

      setData((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i._id !== id),
        total: prev.total - 1,
      }));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <AdminTable>
      <thead>
        <tr className="bg-gray-900">
          <th className="p-2 text-left">Rating</th>
          <th className="p-2 text-left">Comment</th>
          <th className="p-2 text-left">Product</th>
          <th className="p-2 text-left">User</th>
          <th className="p-2 text-left">Order</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Created</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.items.map((r) => (
          <AdminReviewRow
            key={r._id}
            review={r}
            loading={loadingId === r._id}
            onToggleHide={() => toggleHide(r)}
            onDelete={() => deleteReview(r._id)}
          />
        ))}
      </tbody>
    </AdminTable>
  );
}
