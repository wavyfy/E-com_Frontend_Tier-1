import { serverFetch } from "./server-fetch";
import type { PaginatedUsers, AdminUser } from "../types/user";

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
