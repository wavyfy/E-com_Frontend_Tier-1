"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  async function handleLogin(email: string, password: string) {
    try {
      await login(email, password);
      router.push("/products");
    } catch {}
  }

  return <AuthForm title="Login" submitLabel="Login" onSubmit={handleLogin} />;
}
