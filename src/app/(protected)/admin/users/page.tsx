import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/api-error";
import { fetchAdminUsers } from "@/lib/api/server/user.server";
import { Pagination } from "@/components/common/Pagination";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(Number(page) || 1, 1);

  let res;
  let hasNextPage = false;

  try {
    res = await fetchAdminUsers(currentPage);
    hasNextPage = res.items.length > 0;
  } catch (err) {
    if (err instanceof ApiError && err.type === "NOT_FOUND") {
      notFound();
    }
    throw err;
  }

  return (
    <main style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      <h1>All Users</h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: 24,
        }}
      >
        <thead>
          <tr>
            <th align="left">User ID</th>
            <th align="left">Email</th>
            <th align="left">Name</th>
            <th align="left">Joined</th>
            <th align="left">Action</th>
          </tr>
        </thead>

        <tbody>
          {res.items.map((u) => (
            <tr key={u.id} style={{ borderTop: "1px solid #ddd" }}>
              <td
                style={{
                  padding: "8px 0",
                  fontFamily: "monospace",
                }}
              >
                {u.id}
              </td>
              <td>{u.email}</td>
              <td>{u.name ?? "-"}</td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                <Link href={`/admin/users/${u.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        basePath="/admin/users"
        hasNextPage={hasNextPage}
      />
    </main>
  );
}
