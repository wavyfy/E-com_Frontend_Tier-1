import type { ReviewAdmin } from "@/lib/types/review";
import AdminReviewActions from "./AdminReviewActions";

export default function AdminReviewRow({
  review: r,
  loading,
  onToggleHide,
  onDelete,
}: {
  review: ReviewAdmin;
  loading: boolean;
  onToggleHide: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-t border-gray-700">
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
        <div className="text-xs opacity-60">ID: {r.userId._id.slice(-6)}</div>
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

      <td className="p-2">{new Date(r.createdAt).toLocaleDateString()}</td>

      <td className="p-2">
        {!r.isDeleted && (
          <AdminReviewActions
            isHidden={r.isHidden}
            loading={loading}
            onToggleHide={onToggleHide}
            onDelete={onDelete}
          />
        )}
      </td>
    </tr>
  );
}
