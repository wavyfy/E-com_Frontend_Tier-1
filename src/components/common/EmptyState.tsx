import type { EmptyStateProps } from "@/lib/types/common";

export default function EmptyState({
  title = "Nothing here",
  description,
  action,
  className = "p-6 text-center",
}: EmptyStateProps) {
  return (
    <div className={className}>
      <h2 className="font-semibold">{title}</h2>

      {description && (
        <p className="text-sm text-gray-500 mt-2">{description}</p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
