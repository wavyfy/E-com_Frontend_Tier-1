export type OrderStatus =
  | "CREATED"
  | "PAYMENT_PENDING"
  | "PAID"
  | "FULFILLED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderStatusHistory = {
  from: OrderStatus;
  to: OrderStatus;
  changedBy: string;
  changedAt: string;
};

export type AdminOrderListItem = {
  id: string;
  userId: string;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentAttempts: number;
  createdAt: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type ShippingAddressSnapshot = {
  name: string;
  phone: string;
  line: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type Order = {
  _id: string;
  userId: string;
  items: OrderItem[];
  itemsCount: number;
  totalAmount: number;
  status: OrderStatus;
  currency: string;

  shippingAddressSnapshot: ShippingAddressSnapshot;

  paymentAttempts: number;
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  paymentInitiatedAt?: string;
  updatedAt: string;
};

export type AdminOrderListResponse = {
  page: number;
  limit: number;
  items: AdminOrderListItem[];
};

export type AdminOrderDetail = {
  id: string;
  userId: string;
  items: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  itemsCount: number;
  totalAmount: number;
  currency: string;
  status: OrderStatus;
  paymentAttempts: number;
  statusHistory: {
    from: OrderStatus;
    to: OrderStatus;
    changedBy: string;
    changedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

export type Props = {
  history: {
    from: string;
    to: string;
    changedBy: string;
    changedAt: string;
  }[];
};
