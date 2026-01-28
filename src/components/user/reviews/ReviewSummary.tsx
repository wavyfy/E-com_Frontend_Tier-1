import RatingDistribution from "@/components/user/reviews/RatingDistributionBar";
import type { ProductReviewsResponse } from "@/lib/types/review";

export default function ReviewSummary({
  data,
}: {
  data: ProductReviewsResponse;
}) {
  return (
    <div>
      <strong>⭐ {data.stats.avgRating.toFixed(1)} / 5</strong>
      <p style={{ fontSize: 12, opacity: 0.6 }}>
        Based on {data.stats.totalReviews} reviews
      </p>

      <RatingDistribution
        total={data.stats.totalReviews}
        distribution={data.stats.distribution}
      />
    </div>
  );
}
