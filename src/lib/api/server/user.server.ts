import { serverFetch } from "./server-fetch";
import type { PaginatedUsers, AdminUser } from "@/lib/types/user";
import type { User } from "@/lib/types/user";

/* ================= ADMIN (SERVER ONLY) ================= */

export async function fetchAdminUsers(
  page = 1,
  limit = 10,
): Promise<PaginatedUsers> {
  return serverFetch<PaginatedUsers>(
    `/admin/users?page=${page}&limit=${limit}`,
  );
}

export async function fetchAdminUserById(userId: string): Promise<AdminUser> {
  return serverFetch<AdminUser>(`/admin/users/${userId}`);
}

export async function fetchMe(): Promise<User> {
  return serverFetch<User>("/users/me");
}
