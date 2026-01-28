"use client";

export default function Stars({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange?: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onChange?.(s)}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            background: "none",
            border: "none",
            fontSize: 18,
            opacity: s <= value ? 1 : 0.3,
          }}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}
