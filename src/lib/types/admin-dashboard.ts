export type AdminDashboardResponse = {
  kpis: {
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    failedPayments: number;
  };
  recentOrders: {
    _id: string;
    userId: string;
    status: string;
    totalAmount: number;
    currency: string;
    createdAt: string;
  }[];
  recentPayments: {
    _id: string;
    orderId: string;
    status: string;
    amount: number;
    currency: string;
    createdAt: string;
  }[];
};

// src/lib/types/admin-dashboard.ts

export type AdminDashboardOrder = {
  _id: string;
  userId: string;
  status: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
};

export type AdminDashboardPayment = {
  _id: string;
  orderId: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
};
