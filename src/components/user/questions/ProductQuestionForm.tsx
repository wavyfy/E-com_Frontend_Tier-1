interface Props {
  question: string;
  asking: boolean;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export default function ProductQuestionForm({
  question,
  asking,
  onChange,
  onSubmit,
}: Props) {
  return (
    <div style={{ marginTop: 24 }}>
      <h3>Ask a question</h3>

      <textarea
        value={question}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your question here…"
        style={{ width: "100%", minHeight: 80 }}
      />

      <button onClick={onSubmit} disabled={asking || !question.trim()}>
        {asking ? "Posting…" : "Submit question"}
      </button>
    </div>
  );
}
