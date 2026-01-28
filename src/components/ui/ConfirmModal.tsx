"use client";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-4 rounded space-y-3">
        <h3 className="font-medium">{title}</h3>
        {description && <p className="text-sm">{description}</p>}

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel}>{cancelLabel}</button>
          <button onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
