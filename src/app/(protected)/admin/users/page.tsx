import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import { fetchAdminUsers } from "@/lib/api/server/user.server";
import Pagination from "@/components/common/Pagination";
import AdminUsersTable from "@/components/admin/users/AdminUsersTable";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(Number(page) || 1, 1);

  let res;

  try {
    res = await fetchAdminUsers(currentPage);
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-lg font-semibold">All Users</h1>

      <AdminUsersTable users={res.items} />

      <Pagination
        currentPage={currentPage}
        basePath="/admin/users"
        hasNextPage={res.items.length === res.limit}
      />
    </main>
  );
}
