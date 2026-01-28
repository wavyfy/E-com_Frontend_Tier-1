import type { Question } from "@/lib/types/question";

export default function ProductQuestionList({
  questions,
}: {
  questions: Question[];
}) {
  if (questions.length === 0) {
    return <p style={{ opacity: 0.7 }}>No questions yet.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {questions.map((q) => (
        <div key={q._id} style={{ border: "1px solid #555", padding: 12 }}>
          <p>
            <strong>Q:</strong> {q.question}
          </p>

          {q.answer ? (
            <p style={{ marginTop: 8 }}>
              <strong>A:</strong> {q.answer}
            </p>
          ) : (
            <p style={{ marginTop: 8, opacity: 0.6 }}>Awaiting answer</p>
          )}
        </div>
      ))}
    </div>
  );
}
