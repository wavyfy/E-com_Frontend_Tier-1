export default function AdminReviewActions({
  isHidden,
  loading,
  onToggleHide,
  onDelete,
}: {
  isHidden: boolean;
  loading: boolean;
  onToggleHide: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button disabled={loading} onClick={onToggleHide}>
        {isHidden ? "Unhide" : "Hide"}
      </button>

      <button disabled={loading} onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
