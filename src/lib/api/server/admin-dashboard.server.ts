import { serverFetch } from "./server-fetch";
import type { AdminDashboardResponse } from "@/lib/types/admin-dashboard";

export function fetchAdminDashboard() {
  return serverFetch<AdminDashboardResponse>("/admin/dashboard");
}
