export type Question = {
  _id: string;
  productId: string;
  userId: string;

  question: string;
  answer?: string;

  createdAt: string;
  answeredAt?: string;
};

export type ProductQuestionsResponse = {
  items: Question[];
  page: number;
  limit: number;
};

export type QuestionAdmin = {
  _id: string;
  productId: {
    _id: string;
    name: string;
    slug: string;
  };
  userId: {
    _id: string;
    email: string;
  };
  question: string;
  answer?: string;
  answeredAt?: string;
  answeredBy?: {
    _id: string;
    email: string;
    role: "admin" | "user";
  };
  isHidden: boolean;
  createdAt: string;
};

export type AdminQuestionListResponse = {
  page: number;
  limit: number;
  total: number;
  items: QuestionAdmin[];
};
