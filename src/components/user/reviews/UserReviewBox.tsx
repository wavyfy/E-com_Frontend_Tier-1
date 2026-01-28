import Stars from "./Stars";
import type { Review } from "@/lib/types/review";

interface Props {
  myReview: Review | null;
  rating: number;
  comment: string;
  saving: boolean;
  blocked: string | null;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onDelete: () => void;
  onSubmit: () => void;
  onRatingChange: (v: number) => void;
  onCommentChange: (v: string) => void;
}

export default function UserReviewBox({
  myReview,
  rating,
  comment,
  saving,
  blocked,
  isEditing,
  onEdit,
  onCancel,
  onDelete,
  onSubmit,
  onRatingChange,
  onCommentChange,
}: Props) {
  if (myReview && !isEditing) {
    return (
      <div style={{ border: "1px solid #555", padding: 16 }}>
        <h3>Your review</h3>
        <Stars value={myReview.rating} disabled />
        {myReview.comment && <p>{myReview.comment}</p>}

        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onEdit}>Edit</button>
          <button onClick={onDelete} disabled={saving}>
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #555", padding: 16 }}>
      <h3>{myReview ? "Edit your review" : "Write a review"}</h3>

      {blocked && <p style={{ color: "#ff8a8a" }}>{blocked}</p>}

      <Stars value={rating} onChange={onRatingChange} disabled={!!blocked} />

      <textarea
        placeholder="Optional review"
        value={comment}
        disabled={!!blocked}
        onChange={(e) => onCommentChange(e.target.value)}
        style={{ width: "100%", minHeight: 80 }}
      />

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onSubmit} disabled={saving || !rating || !!blocked}>
          {myReview ? "Update review" : "Submit review"}
        </button>

        {myReview && <button onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}
