// app/(protected)/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  console.log("🟦 layout cookies:", cookieStore.getAll());

  if (!accessToken) {
    redirect("/login");
  }

  return <>{children}</>;
}
