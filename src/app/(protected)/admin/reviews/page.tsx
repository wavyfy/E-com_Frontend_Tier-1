import { fetchAdminReviews } from "@/lib/api/server/review.server";
import AdminReviewsTable from "@/components/admin/reviews/AdminReviewTable";
import RatingDistribution from "@/components/user/reviews/RatingDistributionBar";
import Link from "next/link";
import Pagination from "@/components/common/Pagination";

export default async function AdminReviewsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);

  const data = await fetchAdminReviews({
    page: Number(params.page ?? 1),
    rating: params.rating ? Number(params.rating) : undefined,
    isHidden: params.isHidden === "true" ? true : undefined,
    isVerified: params.isVerified === "true" ? true : undefined,
  });

  return (
    <main className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-xl font-semibold">Reviews moderation</h1>

      {/* ===== FILTERS ===== */}
      <form className="flex gap-3 items-center">
        <select name="rating" defaultValue={params.rating ?? ""}>
          <option value="">All ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ★
            </option>
          ))}
        </select>

        <select name="isVerified" defaultValue={params.isVerified ?? ""}>
          <option value="">All</option>
          <option value="true">Verified</option>
          <option value="false">Unverified</option>
        </select>

        <select name="isHidden" defaultValue={params.isHidden ?? ""}>
          <option value="">Visible + Hidden</option>
          <option value="false">Visible</option>
          <option value="true">Hidden</option>
        </select>

        <button type="submit">Apply</button>

        <Link href="/admin/reviews" className="underline text-sm">
          Reset
        </Link>
      </form>

      {/* ===== DISTRIBUTION ===== */}
      <RatingDistribution
        total={data.stats.totalReviews}
        distribution={data.stats.distribution}
        barColor="#ffd700"
      />

      {/* ===== TABLE ===== */}
      <AdminReviewsTable initialData={data} />
      <Pagination
        currentPage={page}
        basePath="/admin/reviews"
        hasNextPage={data.items.length === data.limit}
      />
    </main>
  );
}
