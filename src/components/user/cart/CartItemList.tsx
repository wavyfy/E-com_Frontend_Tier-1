"use client";

import CartItem from "@/components/user/cart/CartItem";
import type { CartItem as CartItemType } from "@/lib/types/cart";

interface Props {
  items: CartItemType[];
  onIncrease: (productId: string, quantity: number) => void;
  onDecrease: (productId: string, quantity: number) => Promise<void>;
  onRemove: (productId: string) => Promise<void>;
}

export default function CartItemList({
  items,
  onIncrease,
  onDecrease,
  onRemove,
}: Props) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <CartItem
          key={item.productId}
          item={item}
          onIncrease={async () => {
            return onIncrease(item.productId, item.quantity + 1);
          }}
          onDecrease={async () => {
            return onDecrease(item.productId, item.quantity);
          }}
          onRemove={async () => {
            return onRemove(item.productId);
          }}
        />
      ))}
    </div>
  );
}
