"use client";

import { useState } from "react";
import { QuestionAPI } from "@/lib/api/client/question.api";
import type {
  AdminQuestionListResponse,
  QuestionAdmin,
} from "@/lib/types/question";

export default function AdminQuestionTable({
  initialData,
}: {
  initialData: AdminQuestionListResponse;
}) {
  const [data, setData] = useState(initialData);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState("");
  

  /* ---------- ANSWER / EDIT ---------- */
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

  /* ---------- HIDE / UNHIDE ---------- */
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

  /* ---------- DELETE ---------- */
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
    <table className="w-full border border-gray-700 text-sm">
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
        {data.items.map((q) => {
          const answered = Boolean(q.answer);

          return (
            <tr key={q._id} className="border-t border-gray-700 align-top">
              {/* QUESTION */}
              <td className="p-2 max-w-[420px]">
                <div className="font-medium">{q.question}</div>

                {answered && answeringId !== q._id && (
                  <div className="mt-2 text-sm opacity-80">
                    <strong>Answer:</strong> {q.answer}
                  </div>
                )}

                {answeringId === q._id && (
                  <div className="mt-2 space-y-2">
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      className="w-full p-2 bg-black border border-gray-600"
                      placeholder="Write answer…"
                    />
                    <div className="flex gap-2">
                      <button
                        disabled={loadingId === q._id}
                        onClick={() => submitAnswer(q)}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setAnsweringId(null);
                          setAnswerText("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </td>

              {/* PRODUCT */}
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
                  <span className="opacity-50">—</span>
                )}
              </td>

              {/* USER */}
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

              {/* STATUS */}
              <td className="p-2">
                {q.isHidden ? (
                  <span className="text-yellow-400">Hidden</span>
                ) : answered ? (
                  <span className="text-green-400">Answered</span>
                ) : (
                  <span className="opacity-60">Pending</span>
                )}
              </td>

              {/* CREATED */}
              <td className="p-2">
                {new Date(q.createdAt).toLocaleDateString()}
              </td>

              {/* ACTIONS */}
              <td className="p-2 flex flex-col gap-1">
                <button
                  onClick={() => {
                    setAnsweringId(q._id);
                    setAnswerText(q.answer ?? "");
                  }}
                >
                  {answered ? "Edit Answer" : "Answer"}
                </button>

                <button
                  disabled={loadingId === q._id}
                  onClick={() => toggleHide(q)}
                >
                  {q.isHidden ? "Unhide" : "Hide"}
                </button>

                <button
                  disabled={loadingId === q._id}
                  onClick={() => deleteQuestion(q._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
