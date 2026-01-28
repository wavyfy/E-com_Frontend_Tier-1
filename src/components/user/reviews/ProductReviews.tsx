"use client";

import { useEffect, useState } from "react";
import { ReviewAPI } from "@/lib/api/client/review.api";
import type { Review, ProductReviewsResponse } from "@/lib/types/review";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api/api-error";

import ReviewSummary from "@/components/user/reviews/ReviewSummary";
import ReviewList from "@/components/user/reviews/ReviewList";
import UserReviewBox from "@/components/user/reviews/UserReviewBox";

export default function ProductReviews({
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
      <ReviewSummary data={data} />

      <div>
        <h2>Customer reviews</h2>
        <ReviewList reviews={data.items} />
      </div>

      {!isAuthenticated && (
        <p style={{ fontSize: 14, opacity: 0.8 }}>Log in to write a review.</p>
      )}

      {isAuthenticated && (
        <UserReviewBox
          myReview={myReview}
          rating={rating}
          comment={comment}
          saving={saving}
          blocked={blocked}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onCancel={() => setIsEditing(false)}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          onRatingChange={setRating}
          onCommentChange={setComment}
        />
      )}
    </section>
  );
}
