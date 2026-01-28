export type Review = {
  _id: string;
  userId: string;
  productId: string;
  orderId: string;

  rating: number;
  comment?: string;

  isVerified: boolean;
  isHidden: boolean;

  createdAt: string;
  updatedAt: string;
};

export type RatingDistributionItem = {
  _id: number; // rating (1–5)
  count: number;
};

export type ReviewStats = {
  avgRating: number;
  totalReviews: number;
  distribution: RatingDistributionItem[];
};

export type ProductReviewsResponse = {
  items: Review[];
  stats: ReviewStats;
  page: number;
  limit: number;
};

export type ReviewAdmin = {
  _id: string;

  productId: string;
  productName?: string;
  productSlug?: string;

  userId: {
    _id: string;
    email?: string;
  };

  rating: number;
  comment?: string;

  isVerified: boolean;
  isHidden: boolean;
  isDeleted?: boolean;

  createdAt: string;
};

export type AdminReviewListResponse = {
  items: ReviewAdmin[];
  page: number;
  limit: number;
  total: number;
  stats: {
    avgRating: number;
    totalReviews: number;
    distribution: { _id: number; count: number }[];
  };
};
