"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface AuthFormProps {
  title: string;
  submitLabel: string;
  onSubmit: (email: string, password: string) => Promise<void>;
}

export default function AuthForm({
  title,
  submitLabel,
  onSubmit,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (loading) return;

    try {
      setLoading(true);
      await onSubmit(email, password);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </div>

      <Button onClick={handleSubmit} disabled={loading} className="w-full">
        {loading ? "Please wait..." : submitLabel}
      </Button>
    </main>
  );
}
