"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { productService } from "@/services/product.service";
import { Product, ProductFilterParams } from "@/types/product";
import { useProductOverlay } from "@/context/ProductOverlayContext";

interface UseProductsResult {
  products: Product[];
  total: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useProducts(
  params: ProductFilterParams,
  artificialDelay: number = 0
): UseProductsResult {
  const { applyOverlayToList } = useProductOverlay();

  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [rawTotal, setRawTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { page, limit, search, category, sortBy, order } = params;

  // References to guarantee race condition prevention
  const lastRequestIdRef = useRef<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async () => {
    // Abort any ongoing in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const currentController = new AbortController();
    abortControllerRef.current = currentController;

    const requestId = ++lastRequestIdRef.current;

    setIsLoading(true);
    setError(null);

    const skip = Math.max(0, (page - 1) * limit);

    try {
      let fetchedProducts: Product[] = [];
      let fetchedTotal = 0;

      // Case 1: Search query active
      if (search.trim()) {
        const response = await productService.searchProducts(
          search.trim(),
          {
            limit,
            skip,
            sortBy: sortBy !== "id" ? sortBy : undefined,
            order,
            delay: artificialDelay > 0 ? artificialDelay : undefined,
          },
          currentController.signal
        );

        // Architectural Decision: DummyJSON search does not support category filter simultaneously.
        // If a category is selected alongside a search term, we filter the search results by category.
        if (category.trim()) {
          const filtered = response.products.filter(
            (p) => p.category.toLowerCase() === category.toLowerCase()
          );
          fetchedProducts = filtered;
          fetchedTotal = filtered.length;
        } else {
          fetchedProducts = response.products;
          fetchedTotal = response.total;
        }
      }
      // Case 2: Category filter active (without search query)
      else if (category.trim()) {
        const response = await productService.getProductsByCategory(category.trim(), {
          limit,
          skip,
          sortBy: sortBy !== "id" ? sortBy : undefined,
          order,
          delay: artificialDelay > 0 ? artificialDelay : undefined,
        });
        fetchedProducts = response.products;
        fetchedTotal = response.total;
      }
      // Case 3: Default paginated list with sorting
      else {
        const response = await productService.getProducts({
          limit,
          skip,
          sortBy: sortBy !== "id" ? sortBy : undefined,
          order,
          delay: artificialDelay > 0 ? artificialDelay : undefined,
        });
        fetchedProducts = response.products;
        fetchedTotal = response.total;
      }

      // Check if this is still the latest initiated request
      if (requestId === lastRequestIdRef.current) {
        setRawProducts(fetchedProducts);
        setRawTotal(fetchedTotal);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      // Ignore cancellations from AbortController
      if (axios.isCancel(err) || (err instanceof Error && err.name === "CanceledError")) {
        return;
      }

      // Only set error if this is the active request
      if (requestId === lastRequestIdRef.current) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch products. Please try again.";
        setError(message);
        setIsLoading(false);
      }
    }
  }, [page, limit, search, category, sortBy, order, artificialDelay]);

  useEffect(() => {
    fetchProducts();

    return () => {
      // Cleanup on unmount or query change
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProducts]);

  // Apply optimistic local overlay (locally added, edited, deleted items)
  const { products: overlayProducts, total: overlayTotal } = applyOverlayToList(
    rawProducts,
    rawTotal,
    {
      search: params.search,
      category: params.category,
      page: params.page,
      limit: params.limit,
    }
  );

  const totalPages = Math.max(1, Math.ceil(overlayTotal / params.limit));

  return {
    products: overlayProducts,
    total: overlayTotal,
    totalPages,
    isLoading,
    error,
    refetch: fetchProducts,
  };
}
