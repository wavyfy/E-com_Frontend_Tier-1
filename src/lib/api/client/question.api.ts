import { api } from "./client";
import type {
  Question,
  ProductQuestionsResponse,
  QuestionAdmin,
} from "@/lib/types/question";

export const QuestionAPI = {
  listByProduct(productId: string, page = 1, limit = 10) {
    return api<ProductQuestionsResponse>(
      `/questions/product/${productId}?page=${page}&limit=${limit}`,
    );
  },

  ask(productId: string, question: string) {
    return api<Question>(`/questions/product/${productId}`, {
      method: "POST",
      body: JSON.stringify({ question }),
    });
  },

  answer(questionId: string, answer: string) {
    return api<QuestionAdmin>(`/admin/questions/${questionId}/answer`, {
      method: "POST",
      body: JSON.stringify({ answer }),
    });
  },

  hide(questionId: string) {
    return api<QuestionAdmin>(`/admin/questions/${questionId}/hide`, {
      method: "PATCH",
    });
  },

  unhide(questionId: string) {
    return api<QuestionAdmin>(`/admin/questions/${questionId}/unhide`, {
      method: "PATCH",
    });
  },

  delete(questionId: string) {
    return api<void>(`/admin/questions/${questionId}`, {
      method: "DELETE",
    });
  },
};
