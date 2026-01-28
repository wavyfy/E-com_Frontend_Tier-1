type Gender = "male" | "female" | "other";

interface Props {
  form: {
    fullName: string;
    phone: string;
    gender?: Gender;
    dob: string;
  };
  saving: boolean;
  onChange: (next: Props["form"]) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function UserProfileForm({
  form,
  saving,
  onChange,
  onSave,
  onCancel,
}: Props) {
  return (
    <>
      <div className="space-y-3">
        <div>
          <label>Name</label>
          <input
            className="block w-full border p-1"
            value={form.fullName}
            onChange={(e) => onChange({ ...form, fullName: e.target.value })}
          />
        </div>

        <div>
          <label>Phone</label>
          <input
            className="block w-full border p-1"
            value={form.phone}
            onChange={(e) => onChange({ ...form, phone: e.target.value })}
          />
        </div>

        <div>
          <label className="block mb-1">Gender</label>
          <div className="flex gap-4">
            {(["male", "female", "other"] as const).map((g) => (
              <label key={g}>
                <input
                  type="radio"
                  name="gender"
                  checked={form.gender === g}
                  onChange={() => onChange({ ...form, gender: g })}
                />
                {g}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label>Date of birth</label>
          <input
            type="date"
            className="block w-full border p-1"
            value={form.dob}
            onChange={(e) => onChange({ ...form, dob: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button onClick={onSave} disabled={saving} className="underline">
          {saving ? "Saving..." : "Save"}
        </button>

        <button onClick={onCancel} className="underline">
          Cancel
        </button>
      </div>
    </>
  );
}
