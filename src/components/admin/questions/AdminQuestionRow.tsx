import type { QuestionAdmin } from "@/lib/types/question";
import AdminQuestionActions from "./AdminQuestionActions";
import AdminQuestionAnswerForm from "./AdminQuestionAnswerForm";

export default function AdminQuestionRow({
  q,
  loadingId,
  answeringId,
  answerText,
  setAnsweringId,
  setAnswerText,
  onSubmitAnswer,
  onToggleHide,
  onDelete,
}: {
  q: QuestionAdmin;
  loadingId: string | null;
  answeringId: string | null;
  answerText: string;
  setAnsweringId: (id: string | null) => void;
  setAnswerText: (v: string) => void;
  onSubmitAnswer: (q: QuestionAdmin) => void;
  onToggleHide: (q: QuestionAdmin) => void;
  onDelete: (id: string) => void;
}) {
  const answered = Boolean(q.answer);

  return (
    <tr className="border-t border-gray-700 align-top">
      <td className="p-2 max-w-[420px]">
        <div className="font-medium">{q.question}</div>

        {answered && answeringId !== q._id && (
          <div className="mt-2 text-sm opacity-80">
            <strong>Answer:</strong> {q.answer}
          </div>
        )}

        {answeringId === q._id && (
          <AdminQuestionAnswerForm
            value={answerText}
            loading={loadingId === q._id}
            onChange={setAnswerText}
            onSave={() => onSubmitAnswer(q)}
            onCancel={() => {
              setAnsweringId(null);
              setAnswerText("");
            }}
          />
        )}
      </td>

      <td className="p-2">
        {typeof q.productId === "object" ? (
          <a
            href={`/products/${q.productId.slug}`}
            target="_blank"
            className="underline"
          >
            {q.productId.name}
          </a>
        ) : (
          "—"
        )}
      </td>

      <td className="p-2">
        {q.userId ? (
          <>
            <div>{q.userId.email}</div>
            <div className="text-xs opacity-60">
              ID: {q.userId._id.slice(-6)}
            </div>
          </>
        ) : (
          "—"
        )}
      </td>

      <td className="p-2">
        {q.isHidden ? (
          <span className="text-yellow-400">Hidden</span>
        ) : answered ? (
          <span className="text-green-400">Answered</span>
        ) : (
          <span className="opacity-60">Pending</span>
        )}
      </td>

      <td className="p-2">{new Date(q.createdAt).toLocaleDateString()}</td>

      <td className="p-2">
        <AdminQuestionActions
          q={q}
          loading={loadingId === q._id}
          onAnswer={() => {
            setAnsweringId(q._id);
            setAnswerText(q.answer ?? "");
          }}
          onToggleHide={() => onToggleHide(q)}
          onDelete={() => onDelete(q._id)}
        />
      </td>
    </tr>
  );
}
