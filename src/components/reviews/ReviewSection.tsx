"use client";

import { useEffect, useState } from "react";
import { ReviewAPI } from "@/lib/api/client/review.api";
import type { Review, ProductReviewsResponse } from "@/lib/types/review";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api/api-error";
import RatingDistribution from "@/components/reviews/RatingDistributionBar";

/* ---------- Star UI ---------- */
function Stars({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange?: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onChange?.(s)}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            background: "none",
            border: "none",
            fontSize: 18,
            opacity: s <= value ? 1 : 0.3,
          }}
        >
          ⭐
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({
  productId,
  initialData,
}: {
  productId: string;
  initialData: ProductReviewsResponse;
}) {
  const { isAuthenticated } = useAuth();

  const [data, setData] = useState<ProductReviewsResponse>(initialData);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [blocked, setBlocked] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /* ---------- fetch my review ---------- */
  useEffect(() => {
    if (!isAuthenticated) return;

    ReviewAPI.getMyReview(productId)
      .then((r) => {
        if (r) {
          setMyReview(r);
          setRating(r.rating);
          setComment(r.comment ?? "");
        }
      })
      .catch((err) => {
        if (err instanceof ApiError && err.code === "REVIEW_NOT_ALLOWED") {
          setBlocked("You can review this product only after delivery.");
        }
      });
  }, [isAuthenticated, productId]);

  async function refresh() {
    const updated = await ReviewAPI.listByProduct(productId);
    setData(updated);
  }

  /* ---------- submit ---------- */
  async function handleSubmit() {
    if (!rating || saving) return;

    setSaving(true);
    setBlocked(null);
    try {
      const review = await ReviewAPI.upsert(productId, {
        rating,
        comment: comment || undefined,
      });

      setMyReview(review);
      setIsEditing(false);
      await refresh();
    } catch (err) {
      if (err instanceof ApiError && err.code === "REVIEW_NOT_ALLOWED") {
        setBlocked("You can review this product only after delivery.");
      }
    } finally {
      setSaving(false);
    }
  }

  /* ---------- delete ---------- */
  async function handleDelete() {
    if (!myReview || saving) return;

    setSaving(true);
    try {
      await ReviewAPI.deleteMyReview(productId);

      setMyReview(null);
      setRating(0);
      setComment("");
      setIsEditing(false);

      await refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      style={{
        marginTop: 32,
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      {/* ===== SUMMARY ===== */}
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

      {/* ===== LIST ===== */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <h2>Customer reviews</h2>

        {data.items.length === 0 && (
          <p style={{ fontSize: 14, opacity: 0.7 }}>No reviews yet.</p>
        )}

        {data.items.map((r) => (
          <div key={r._id} style={{ border: "1px solid #555", padding: 12 }}>
            <Stars value={r.rating} disabled />
            {r.comment && <p>{r.comment}</p>}
            <div className="flex gap-3">
              <p style={{ fontSize: 12, opacity: 0.6 }}>
                {new Date(r.createdAt).toDateString()}
              </p>
              <p style={{ fontSize: 12, opacity: 1, color: "green", fontWeight: "bold" }}>
                {r.isVerified && " 🎖️ Verified purchase"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== USER REVIEW ===== */}
      {!isAuthenticated && (
        <p style={{ fontSize: 14, opacity: 0.8 }}>Log in to write a review.</p>
      )}

      {isAuthenticated && myReview && !isEditing && (
        <div style={{ border: "1px solid #555", padding: 16 }}>
          <h3>Your review</h3>
          <Stars value={myReview.rating} disabled />
          {myReview.comment && <p>{myReview.comment}</p>}

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleDelete} disabled={saving}>
              Delete
            </button>
          </div>
        </div>
      )}

      {isAuthenticated && (!myReview || isEditing) && (
        <div style={{ border: "1px solid #555", padding: 16 }}>
          <h3>{myReview ? "Edit your review" : "Write a review"}</h3>

          {blocked && <p style={{ color: "#ff8a8a" }}>{blocked}</p>}

          <Stars value={rating} onChange={setRating} disabled={!!blocked} />

          <textarea
            placeholder="Optional review"
            value={comment}
            disabled={!!blocked}
            onChange={(e) => setComment(e.target.value)}
            style={{ width: "100%", minHeight: 80 }}
          />

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleSubmit}
              disabled={saving || !rating || !!blocked}
            >
              {myReview ? "Update review" : "Submit review"}
            </button>

            {myReview && (
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
