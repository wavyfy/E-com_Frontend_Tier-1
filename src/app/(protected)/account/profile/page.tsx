// app/(protected)/profile/page.tsx
import { fetchMe } from "@/lib/api/server/user.server";
import { redirect } from "next/navigation";
import UserProfile from "@/components/user/profile/UserProfile";
import { ApiError } from "@/lib/api/api-error";

export default async function ProfilePage() {
  let user;

  try {
    user = await fetchMe();
  } catch (err: unknown) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login");
    }
    throw err;
  }

  return <UserProfile initialUser={user} />;
}
