export type CartItem = {
  productId: string;
  name: string; // snapshot
  quantity: number;
  unitPrice: number;
  subtotal: number;
  stock: number; // snapshot
};

export type Cart = {
  items: CartItem[];
  itemsCount: number;
  totalAmount: number;
  currency: string;
};

export type AddToCartButtonProps = {
  productId: string;
  quantity?: number; // optional, defaults to 1
};

export type CartItemProps = {
  item: {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    stock: number;
  };
  
  onIncrease: () => Promise<void>;
  onDecrease: () => Promise<void>;
  onRemove: () => Promise<void>;
  disabled?: boolean;
};

export type CartContextValue = {
  cart: Cart | null;
  loading: boolean;
  addItem: (productId: string, qty?: number) => Promise<void>;
  updateItem: (productId: string, qty: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  refresh: () => Promise<void>;
  clear: () => void; 
};
