import { ApiError } from "@/lib/api/api-error";

export function handleCartError(err: unknown) {
  if (!(err instanceof ApiError)) {
    console.error(err);
    return;
  }

  switch (err.code) {
    case "CART_ITEM_OUT_OF_STOCK":
      alert("Product is out of stock");
      return;

    case "CART_ITEM_NOT_FOUND":
      alert("Item not found in cart");
      return;

    default:
      alert(err.message || "Something went wrong");
  }
}
