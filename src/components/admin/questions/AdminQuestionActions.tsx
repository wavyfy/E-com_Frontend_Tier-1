import type { QuestionAdmin } from "@/lib/types/question";

export default function AdminQuestionActions({
  q,
  loading,
  onAnswer,
  onToggleHide,
  onDelete,
}: {
  q: QuestionAdmin;
  loading: boolean;
  onAnswer: () => void;
  onToggleHide: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <button onClick={onAnswer}>{q.answer ? "Edit Answer" : "Answer"}</button>

      <button disabled={loading} onClick={onToggleHide}>
        {q.isHidden ? "Unhide" : "Hide"}
      </button>

      <button disabled={loading} onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
