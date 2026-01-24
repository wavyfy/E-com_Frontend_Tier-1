"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserAPI } from "@/lib/api/client/user.api";
import type { User } from "@/lib/types/user";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function ProfilePage({ initialUser }: { initialUser: User }) {
  const router = useRouter();
  type Gender = "male" | "female" | "other";
  const { invalidate } = useAuth();
  const { clear } = useCart();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<{
    fullName: string;
    phone: string;
    gender?: Gender;
    dob: string;
  }>({
    fullName: initialUser.fullName ?? "",
    phone: initialUser.phone ?? "",
    gender: initialUser.gender,
    dob: initialUser.dob ? initialUser.dob.slice(0, 10) : "",
  });

  async function handleSave() {
    setSaving(true);
    try {
      await UserAPI.updateMe({
        fullName: form.fullName || undefined,
        phone: form.phone || undefined,
        gender: form.gender || undefined,
        dob: form.dob || undefined,
      });

      setEditing(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const ok = confirm("This will permanently delete your account. Continue?");
    if (!ok) return;

    await UserAPI.deleteMe();
    invalidate();
    clear();
    router.replace("/register");
    router.refresh();
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4 text-sm">
      <h1 className="text-xl font-semibold">My Profile</h1>

      {!editing ? (
        <>
          <div className="space-y-2">
            <p>
              <strong>Email:</strong> {initialUser.email}
            </p>
            <p>
              <strong>Name:</strong> {initialUser.fullName ?? "—"}
            </p>
            <p>
              <strong>Phone:</strong> {initialUser.phone ?? "—"}
            </p>
            <p>
              <strong>Gender:</strong> {initialUser.gender ?? "—"}
            </p>
            <p>
              <strong>Date of birth:</strong>{" "}
              {initialUser.dob
                ? new Date(initialUser.dob).toLocaleDateString(undefined, {
                    year: "numeric",
                    day: "numeric",
                    month: "long",
                  })
                : "—"}
            </p>
          </div>

          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </>
      ) : (
        <>
          <div className="space-y-3">
            <div>
              <label>Name</label>
              <input
                className="block w-full border p-1"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>

            <div>
              <label>Phone</label>
              <input
                className="block w-full border p-1"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                      value={g}
                      checked={form.gender === g}
                      onChange={() => setForm({ ...form, gender: g })}
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
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="underline"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            <button onClick={() => setEditing(false)} className="underline">
              Cancel
            </button>
          </div>
        </>
      )}

      <hr className="my-6" />

      <button onClick={handleDelete} className="text-red-600">
        Delete account
      </button>
    </div>
  );
}
