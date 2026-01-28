"use client";

import { useState } from "react";
import { ReviewAPI } from "@/lib/api/client/review.api";
import type { AdminReviewListResponse, ReviewAdmin } from "@/lib/types/review";

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
    <table className="w-full border border-gray-700 text-sm">
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
          <tr key={r._id} className="border-t border-gray-700">
            <td className="p-2">{r.rating} ⭐</td>

            <td className="p-2 max-w-[260px] truncate">
              {r.comment ?? <span className="opacity-50">—</span>}
            </td>

            <td className="p-2">
              <a
                href={`/products/${r.productSlug}`}
                target="_blank"
                className="underline"
              >
                {r.productName}
              </a>
            </td>

            <td className="p-2">
              <div>{r.userId.email}</div>
              <div className="text-xs opacity-60">
                ID: {r.userId._id.slice(-6)}
              </div>
            </td>

            <td className="p-2">
              {r.isVerified ? (
                <span className="text-green-400">✔ Verified</span>
              ) : (
                <span className="opacity-50">Unverified</span>
              )}
            </td>

            <td className="p-2">
              {r.isDeleted ? (
                <span className="text-red-400">Deleted</span>
              ) : r.isHidden ? (
                <span className="text-yellow-400">Hidden</span>
              ) : (
                <span className="text-green-400">Visible</span>
              )}
            </td>

            <td className="p-2">
              {new Date(r.createdAt).toLocaleDateString()}
            </td>

            <td className="p-2 flex gap-2">
              {!r.isDeleted && (
                <>
                  <button
                    disabled={loadingId === r._id}
                    onClick={() => toggleHide(r)}
                  >
                    {r.isHidden ? "Unhide" : "Hide"}
                  </button>

                  <button
                    disabled={loadingId === r._id}
                    onClick={() => deleteReview(r._id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
