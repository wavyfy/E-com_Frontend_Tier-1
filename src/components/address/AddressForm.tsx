"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AddressInput } from "@/lib/types/address";

/* ---------- Pincode lookup (India) ---------- */
async function lookupPincode(postalCode: string): Promise<{
  city: string;
  state: string;
  country: string;
} | null> {
  if (!/^\d{6}$/.test(postalCode)) return null;

  const res = await fetch(`https://api.postalpincode.in/pincode/${postalCode}`);
  const data = await res.json();

  if (data[0]?.Status !== "Success") return null;

  const office = data[0].PostOffice[0];
  return {
    city: office.District,
    state: office.State,
    country: "India",
  };
}

export default function AddressForm({
  title,
  submitLabel,
  initialValues,
  onSubmit,
}: {
  title: string;
  submitLabel: string;
  initialValues?: Partial<AddressInput>;
  onSubmit: (data: AddressInput) => Promise<void>;
}) {
  const router = useRouter();

  /* ---------- controlled fields ---------- */
  const [postalCode, setPostalCode] = useState(initialValues?.postalCode ?? "");
  const [city, setCity] = useState(initialValues?.city ?? "");
  const [state, setState] = useState(initialValues?.state ?? "");
  const [country, setCountry] = useState(initialValues?.country ?? "India");
  const [loadingPin, setLoadingPin] = useState(false);

  /* ---------- auto-fill on pincode ---------- */
  useEffect(() => {
    async function run() {
      if (postalCode.length !== 6) return;

      setLoadingPin(true);
      const result = await lookupPincode(postalCode);
      setLoadingPin(false);

      if (result) {
        setCity(result.city);
        setState(result.state);
        setCountry(result.country);
      }
    }

    run();
  }, [postalCode]);

  async function action(formData: FormData) {
    await onSubmit({
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      line: formData.get("line") as string,
      postalCode,
      city,
      state,
      country,
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
              className="mt-1 w-full rounded-md border border-white px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          {/* PINCODE */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Pincode
            </label>
            <input
              name="postalCode"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-white px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
            />
            {loadingPin && (
              <p className="mt-1 text-xs text-gray-400">
                Detecting city & state…
              </p>
            )}
          </div>

          {/* CITY */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              City
            </label>
            <input
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-white px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* STATE */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              State
            </label>
            <input
              name="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-white px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Country
            </label>
            <input
              name="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-white px-3 py-2 text-sm text-white focus:border-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-md bg-white px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
