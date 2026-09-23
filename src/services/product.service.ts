import apiClient from "@/lib/axios";
import { CategoryItem, Product, ProductListResponse } from "@/types/product";

export interface FetchProductsOptions {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  delay?: number;
}

export const productService = {
  /**
   * Fetch paginated products with optional sorting and artificial delay
   */
  async getProducts(options: FetchProductsOptions = {}): Promise<ProductListResponse> {
    const params: Record<string, string | number> = {
      limit: options.limit ?? 10,
      skip: options.skip ?? 0,
    };

    if (options.sortBy && options.sortBy !== "id") {
      params.sortBy = options.sortBy;
      params.order = options.order || "asc";
    }

    if (options.delay) {
      params.delay = options.delay;
    }

    const response = await apiClient.get<ProductListResponse>("/products", { params });
    return response.data;
  },

  /**
   * Search products by query with AbortSignal support to prevent race conditions
   */
  async searchProducts(
    query: string,
    options: FetchProductsOptions = {},
    signal?: AbortSignal
  ): Promise<ProductListResponse> {
    const params: Record<string, string | number> = {
      q: query,
      limit: options.limit ?? 10,
      skip: options.skip ?? 0,
    };

    if (options.sortBy && options.sortBy !== "id") {
      params.sortBy = options.sortBy;
      params.order = options.order || "asc";
    }

    if (options.delay) {
      params.delay = options.delay;
    }

    const response = await apiClient.get<ProductListResponse>("/products/search", {
      params,
      signal,
    });
    return response.data;
  },

  /**
   * Fetch all product categories, normalizing string[] or object[] responses
   */
  async getCategories(): Promise<CategoryItem[]> {
    const response = await apiClient.get<unknown[]>("/products/categories");
    const rawData = response.data;

    if (!Array.isArray(rawData)) {
      return [];
    }

    return rawData.map((item) => {
      if (typeof item === "string") {
        return {
          slug: item,
          name: item
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        };
      }
      const typed = item as { slug?: string; name?: string; url?: string };
      return {
        slug: typed.slug || "",
        name: typed.name || typed.slug || "",
        url: typed.url,
      };
    });
  },

  /**
   * Fetch products by category
   */
  async getProductsByCategory(
    category: string,
    options: FetchProductsOptions = {}
  ): Promise<ProductListResponse> {
    const params: Record<string, string | number> = {
      limit: options.limit ?? 10,
      skip: options.skip ?? 0,
    };

    if (options.sortBy && options.sortBy !== "id") {
      params.sortBy = options.sortBy;
      params.order = options.order || "asc";
    }

    if (options.delay) {
      params.delay = options.delay;
    }

    const response = await apiClient.get<ProductListResponse>(
      `/products/category/${encodeURIComponent(category)}`,
      { params }
    );
    return response.data;
  },

  /**
   * Get single product details by ID
   */
  async getProductById(id: number | string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Create new product (DummyJSON simulates this and returns new object with mock id)
   */
  async addProduct(productData: Partial<Product>): Promise<Product> {
    const response = await apiClient.post<Product>("/products/add", productData);
    return response.data;
  },

  /**
   * Update existing product by ID
   */
  async updateProduct(id: number | string, productData: Partial<Product>): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, productData);
    return response.data;
  },

  /**
   * Delete product by ID
   */
  async deleteProduct(id: number | string): Promise<{ id: number; isDeleted: boolean; deletedOn?: string }> {
    const response = await apiClient.delete<{ id: number; isDeleted: boolean; deletedOn?: string }>(
      `/products/${id}`
    );
    return response.data;
  },
};
