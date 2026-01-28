"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  async function handleRegister(email: string, password: string) {
    await register(email, password);
    router.push("/products");
  }

  return (
    <AuthForm
      title="Register"
      submitLabel="Register"
      onSubmit={handleRegister}
    />
  );
}
