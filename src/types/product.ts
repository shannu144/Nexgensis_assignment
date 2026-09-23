export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt?: string;
  updatedAt?: string;
  barcode?: string;
  qrCode?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: ProductDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: ProductMeta;
  images: string[];
  thumbnail: string;
  isLocalAdded?: boolean;
  isLocalEdited?: boolean;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url?: string;
}

export type SortByField = "price" | "rating" | "title" | "id";
export type SortOrder = "asc" | "desc";

export interface ProductFilterParams {
  page: number;
  limit: number;
  search: string;
  category: string;
  sortBy: SortByField;
  order: SortOrder;
}

export interface ProductFormData {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  brand: string;
  rating: number;
  thumbnail: string;
}
