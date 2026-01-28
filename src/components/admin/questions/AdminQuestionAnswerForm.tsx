export default function AdminQuestionAnswerForm({
  value,
  loading,
  onChange,
  onSave,
  onCancel,
}: {
  value: string;
  loading: boolean;
  onChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mt-2 space-y-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 bg-black border border-gray-600"
        placeholder="Write answer…"
      />
      <div className="flex gap-2">
        <button disabled={loading} onClick={onSave}>
          Save
        </button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
