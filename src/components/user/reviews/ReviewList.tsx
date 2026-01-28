import Stars from "./Stars";
import type { Review } from "@/lib/types/review";

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return <p style={{ fontSize: 14, opacity: 0.7 }}>No reviews yet.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {reviews.map((r) => (
        <div key={r._id} style={{ border: "1px solid #555", padding: 12 }}>
          <Stars value={r.rating} disabled />
          {r.comment && <p>{r.comment}</p>}

          <div className="flex gap-3">
            <p style={{ fontSize: 12, opacity: 0.6 }}>
              {new Date(r.createdAt).toDateString()}
            </p>
            {r.isVerified && (
              <p
                style={{
                  fontSize: 12,
                  color: "green",
                  fontWeight: "bold",
                }}
              >
                🎖️ Verified purchase
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
