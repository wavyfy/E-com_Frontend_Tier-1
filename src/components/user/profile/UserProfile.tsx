"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserAPI } from "@/lib/api/client/user.api";
import type { User } from "@/lib/types/user";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

import UserProfileView from "./UserProfileView";
import UserProfileForm from "./UserProfileForm";

type Gender = "male" | "female" | "other";

type ProfileFormState = {
  fullName: string;
  phone: string;
  gender?: Gender;
  dob: string;
};

export default function UserProfile({ initialUser }: { initialUser: User }) {
  const router = useRouter();
  const { invalidate } = useAuth();
  const { clear } = useCart();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ProfileFormState>({
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
        <UserProfileView user={initialUser} onEdit={() => setEditing(true)} />
      ) : (
        <UserProfileForm
          form={form}
          saving={saving}
          onChange={setForm}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      )}

      <hr className="my-6" />

      <button onClick={handleDelete} className="text-red-600">
        Delete account
      </button>
    </div>
  );
}
