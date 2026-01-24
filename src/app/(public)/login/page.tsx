"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  async function handleLogin() {
    try {
      await login(email, password);
      router.push("/products");
    } catch {}
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold">Login</h1>

      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded p-2"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded p-2"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        onClick={handleLogin}
        className="w-full border rounded p-2 font-medium hover:bg-gray-50"
      >
        Login
      </button>
    </main>
  );
}
