"use client";

import { useState } from "react";
import { QuestionAPI } from "@/lib/api/client/question.api";
import type { Question, ProductQuestionsResponse } from "@/lib/types/question";
import { useAuth } from "@/context/AuthContext";

export default function QuestionSection({
  productId,
  initialData,
}: {
  productId: string;
  initialData: ProductQuestionsResponse;
}) {
  const { isAuthenticated } = useAuth();

  const [data, setData] = useState(initialData);
  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);

  async function handleAsk() {
    if (!question.trim() || asking) return;

    setAsking(true);
    try {
      await QuestionAPI.ask(productId, question.trim());
      setQuestion("");

      const updated = await QuestionAPI.listByProduct(productId);
      setData(updated);
    } finally {
      setAsking(false);
    }
  }

  return (
    <section style={{ marginTop: 32 }}>
      <h2>Questions & Answers</h2>

      {/* ===== LIST ===== */}
      {data.items.length === 0 && (
        <p style={{ opacity: 0.7 }}>No questions yet.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {data.items.map((q: Question) => (
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

      {/* ===== ASK ===== */}
      {!isAuthenticated && (
        <p style={{ marginTop: 16, opacity: 0.7 }}>Log in to ask a question.</p>
      )}

      {isAuthenticated && (
        <div style={{ marginTop: 24 }}>
          <h3>Ask a question</h3>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here…"
            style={{ width: "100%", minHeight: 80 }}
          />

          <button onClick={handleAsk} disabled={asking || !question.trim()}>
            {asking ? "Posting…" : "Submit question"}
          </button>
        </div>
      )}
    </section>
  );
}
