"use client";

import { useState } from "react";
import { QuestionAPI } from "@/lib/api/client/question.api";
import type { ProductQuestionsResponse } from "@/lib/types/question";
import { useAuth } from "@/context/AuthContext";

import ProductQuestionList from "./ProductQuestionList";
import ProductQuestionForm from "./ProductQuestionForm";

export default function ProductQuestions({
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
      <ProductQuestionList questions={data.items} />

      {/* ===== ASK ===== */}
      {!isAuthenticated && (
        <p style={{ marginTop: 16, opacity: 0.7 }}>Log in to ask a question.</p>
      )}

      {isAuthenticated && (
        <ProductQuestionForm
          question={question}
          asking={asking}
          onChange={setQuestion}
          onSubmit={handleAsk}
        />
      )}
    </section>
  );
}
