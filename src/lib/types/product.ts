export interface Product {
  _id: string;
  name: string;
  price: number;
  slug: string;
  description?: string;
  categoryId?: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}
