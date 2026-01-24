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

export type ProductListResponse = {
  page: number;
  limit: number;
  items: Product[];
};

export type Props = {
  product?: {
    _id: string;
    name: string;
    price: number;
  };
};
