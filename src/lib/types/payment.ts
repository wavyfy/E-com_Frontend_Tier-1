export type AdminPaymentListItem = {
  id: string;
  orderId: string;
  userId: string;

  amount: number;
  currency: string;

  status: "INITIATED" | "SUCCESS" | "FAILED" | "CANCELLED";
  provider: "RAZORPAY";

  attempts: number;

  createdAt: string;
  updatedAt: string;
};

export type PaginatedPayments = {
  page: number;
  limit: number;
  items: AdminPaymentListItem[];
};

export type AdminPaymentDetail = {
  id: string;
  orderId: string;
  userId: string;

  amount: number;
  currency: string;

  status: "INITIATED" | "SUCCESS" | "FAILED" | "CANCELLED";
  provider: "RAZORPAY";

  providerOrderId: string;
  providerPaymentId?: string | null;

  attempts: number;

  statusHistory: {
    from: AdminPaymentDetail["status"];
    to: AdminPaymentDetail["status"];
    changedBy: string;
    changedAt: string;
  }[];

  createdAt: string;
  updatedAt: string;
};

export type PaymentInitiateResponse = {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  key: string;
  attempt: number;
  maxRetries: number;
};
