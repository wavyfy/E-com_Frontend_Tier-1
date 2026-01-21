"use client";
import type { AddressInput } from "@/lib/types/address";

export default function AddressForm({
  title,
  submitLabel,
  initialValues,
  onSubmit,
}: {
  title: string;
  submitLabel: string;
  initialValues?: Partial<AddressInput>;
  returnTo?: string;
  onSubmit: (data: AddressInput) => Promise<void>;
}) {

  async function action(formData: FormData) {
    await onSubmit({
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      line: formData.get("line") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
    });
  }

  return (
    <form
      action={action}
      className="mx-auto max-w-xl space-y-6 rounded-md border border-white p-6 text-white"
    >
      <h1 className="text-lg font-semibold">{title}</h1>

      <div className="space-y-4">
        {[
          ["name", "Name"],
          ["phone", "Phone"],
          ["line", "Address line"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-300">
              {label}
            </label>
            <input
              name={key}
              defaultValue={initialValues?.[key as keyof AddressInput]}
              required
              className="mt-1 w-full rounded-md border border-white px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-white focus:outline-none"
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          {["postalCode", "city"].map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300">
                {key === "postalCode" ? "Pincode" : "City"}
              </label>
              <input
                name={key}
                defaultValue={initialValues?.[key as keyof AddressInput]}
                required
                className="mt-1 w-full rounded-md border border-white px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {["state", "country"].map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-300">
              {key[0].toUpperCase() + key.slice(1)}
            </label>
            <input
              name={key}
              defaultValue={initialValues?.[key as keyof AddressInput]}
              required
              className="mt-1 w-full rounded-md border border-white px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => history.back()}
          className="rounded-md border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
