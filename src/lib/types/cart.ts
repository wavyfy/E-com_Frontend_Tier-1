export type CartItem = {
  productId: string;
  name: string;     // snapshot
  quantity: number;
  unitPrice: number;
  subtotal: number;
  stock: number;    // snapshot
};

export type Cart = {
  items: CartItem[];
  itemsCount: number;
  totalAmount: number;
  currency: string;
};