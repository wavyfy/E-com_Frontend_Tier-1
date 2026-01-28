"use client";

import { useState } from "react";
import { QuestionAPI } from "@/lib/api/client/question.api";
import type {
  AdminQuestionListResponse,
  QuestionAdmin,
} from "@/lib/types/question";
import AdminQuestionRow from "./AdminQuestionRow";
import AdminTable from "../common/AdminTable";

export default function AdminQuestionsTable({
  initialData,
}: {
  initialData: AdminQuestionListResponse;
}) {
  const [data, setData] = useState(initialData);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");

  async function submitAnswer(q: QuestionAdmin) {
    if (!answerText.trim()) return;

    setLoadingId(q._id);
    try {
      const updated = await QuestionAPI.answer(q._id, answerText);

      setData((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i._id === q._id ? updated : i)),
      }));

      setAnsweringId(null);
      setAnswerText("");
    } finally {
      setLoadingId(null);
    }
  }

  async function toggleHide(q: QuestionAdmin) {
    setLoadingId(q._id);
    try {
      const updated = q.isHidden
        ? await QuestionAPI.unhide(q._id)
        : await QuestionAPI.hide(q._id);

      setData((prev) => ({
        ...prev,
        items: prev.items.map((i) => (i._id === q._id ? updated : i)),
      }));
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteQuestion(id: string) {
    if (!confirm("Delete this question permanently?")) return;

    setLoadingId(id);
    try {
      await QuestionAPI.delete(id);

      setData((prev) => ({
        ...prev,
        items: prev.items.filter((i) => i._id !== id),
        total: prev.total - 1,
      }));
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <AdminTable>
      <thead>
        <tr className="bg-gray-900">
          <th className="p-2 text-left">Question</th>
          <th className="p-2 text-left">Product</th>
          <th className="p-2 text-left">User</th>
          <th className="p-2 text-left">Status</th>
          <th className="p-2 text-left">Created</th>
          <th className="p-2 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.items.map((q) => (
          <AdminQuestionRow
            key={q._id}
            q={q}
            loadingId={loadingId}
            answeringId={answeringId}
            answerText={answerText}
            setAnsweringId={setAnsweringId}
            setAnswerText={setAnswerText}
            onSubmitAnswer={submitAnswer}
            onToggleHide={toggleHide}
            onDelete={deleteQuestion}
          />
        ))}
      </tbody>
    </AdminTable>
  );
}
