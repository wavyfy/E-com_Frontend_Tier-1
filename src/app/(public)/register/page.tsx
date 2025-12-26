"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const router = useRouter();

  async function handleRegister() {
    await register(email, password);
    router.push("/products");
  }

  return (
    <div>
      <h1>Register</h1>
      <input onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}
