"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Product } from "@/types/product";

interface ProductOverlayContextType {
  addedProducts: Product[];
  editedProducts: Record<number, Product>;
  deletedProductIds: number[];
  addLocalProduct: (product: Product) => void;
  updateLocalProduct: (product: Product) => void;
  deleteLocalProduct: (id: number) => void;
  applyOverlayToList: (
    serverProducts: Product[],
    serverTotal: number,
    options?: { search?: string; category?: string; page?: number; limit?: number }
  ) => { products: Product[]; total: number };
  applyOverlayToProduct: (product: Product) => Product | null;
  getLocalProductById: (id: number) => Product | undefined;
  resetAllLocalChanges: () => void;
  hasLocalChanges: boolean;
}

const STORAGE_KEYS = {
  ADDED: "dashboard_local_added_products",
  EDITED: "dashboard_local_edited_products",
  DELETED: "dashboard_local_deleted_ids",
};

const ProductOverlayContext = createContext<ProductOverlayContextType | undefined>(undefined);

export function ProductOverlayProvider({ children }: { children: React.ReactNode }) {
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  const [editedProducts, setEditedProducts] = useState<Record<number, Product>>({});
  const [deletedProductIds, setDeletedProductIds] = useState<number[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const storedAdded = localStorage.getItem(STORAGE_KEYS.ADDED);
      const storedEdited = localStorage.getItem(STORAGE_KEYS.EDITED);
      const storedDeleted = localStorage.getItem(STORAGE_KEYS.DELETED);

      if (storedAdded) setAddedProducts(JSON.parse(storedAdded));
      if (storedEdited) setEditedProducts(JSON.parse(storedEdited));
      if (storedDeleted) setDeletedProductIds(JSON.parse(storedDeleted));
    } catch (e) {
      console.error("Failed to parse local product overlay data", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Sync to localStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ADDED, JSON.stringify(addedProducts));
      localStorage.setItem(STORAGE_KEYS.EDITED, JSON.stringify(editedProducts));
      localStorage.setItem(STORAGE_KEYS.DELETED, JSON.stringify(deletedProductIds));
    } catch (e) {
      console.error("Failed to save local product overlay data", e);
    }
  }, [addedProducts, editedProducts, deletedProductIds, isHydrated]);

  const addLocalProduct = useCallback((product: Product) => {
    const enriched: Product = {
      ...product,
      isLocalAdded: true,
      id: product.id || Date.now(),
    };
    setAddedProducts((prev) => [enriched, ...prev]);
  }, []);

  const updateLocalProduct = useCallback((product: Product) => {
    const enriched: Product = {
      ...product,
      isLocalEdited: true,
    };
    // If it's a locally added product, update it in addedProducts
    setAddedProducts((prev) =>
      prev.map((p) => (p.id === product.id ? enriched : p))
    );
    // Also record in editedProducts dictionary
    setEditedProducts((prev) => ({
      ...prev,
      [product.id]: enriched,
    }));
  }, []);

  const deleteLocalProduct = useCallback((id: number) => {
    setDeletedProductIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    // If in addedProducts, remove it completely
    setAddedProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const resetAllLocalChanges = useCallback(() => {
    setAddedProducts([]);
    setEditedProducts({});
    setDeletedProductIds([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.ADDED);
      localStorage.removeItem(STORAGE_KEYS.EDITED);
      localStorage.removeItem(STORAGE_KEYS.DELETED);
    } catch (e) {
      console.error("Failed to clear local storage", e);
    }
  }, []);

  const getLocalProductById = useCallback(
    (id: number): Product | undefined => {
      // Check if deleted
      if (deletedProductIds.includes(id)) return undefined;
      // Check locally added
      const added = addedProducts.find((p) => p.id === id);
      if (added) return added;
      // Check edited
      if (editedProducts[id]) return editedProducts[id];
      return undefined;
    },
    [addedProducts, editedProducts, deletedProductIds]
  );

  const applyOverlayToProduct = useCallback(
    (product: Product): Product | null => {
      if (deletedProductIds.includes(product.id)) {
        return null;
      }
      if (editedProducts[product.id]) {
        return editedProducts[product.id];
      }
      return product;
    },
    [deletedProductIds, editedProducts]
  );

  const applyOverlayToList = useCallback(
    (
      serverProducts: Product[],
      serverTotal: number,
      options?: { search?: string; category?: string; page?: number; limit?: number }
    ): { products: Product[]; total: number } => {
      const search = options?.search?.toLowerCase().trim() || "";
      const category = options?.category?.toLowerCase().trim() || "";
      const page = options?.page || 1;
      const limit = options?.limit || 10;

      // 1. Filter out deleted server products
      let list = serverProducts
        .filter((p) => !deletedProductIds.includes(p.id))
        .map((p) => (editedProducts[p.id] ? editedProducts[p.id] : p));

      // 2. Filter locally added products matching current search & category
      const matchingAdded = addedProducts.filter((p) => {
        if (deletedProductIds.includes(p.id)) return false;
        if (category && p.category.toLowerCase() !== category) return false;
        if (search) {
          const matchTitle = p.title.toLowerCase().includes(search);
          const matchDesc = p.description.toLowerCase().includes(search);
          const matchCat = p.category.toLowerCase().includes(search);
          const matchBrand = p.brand?.toLowerCase().includes(search);
          if (!matchTitle && !matchDesc && !matchCat && !matchBrand) return false;
        }
        return true;
      });

      // 3. For page 1, prepend matching locally added products
      // Calculate adjusted total
      const deletedCount = deletedProductIds.length;
      const addedCount = matchingAdded.length;
      const total = Math.max(0, serverTotal - deletedCount + addedCount);

      if (page === 1) {
        // Prepend added products avoiding duplicates
        const existingIds = new Set(list.map((p) => p.id));
        const newItemsToAdd = matchingAdded.filter((p) => !existingIds.has(p.id));
        list = [...newItemsToAdd, ...list].slice(0, limit);
      }

      return { products: list, total };
    },
    [addedProducts, editedProducts, deletedProductIds]
  );

  const hasLocalChanges =
    addedProducts.length > 0 ||
    Object.keys(editedProducts).length > 0 ||
    deletedProductIds.length > 0;

  return (
    <ProductOverlayContext.Provider
      value={{
        addedProducts,
        editedProducts,
        deletedProductIds,
        addLocalProduct,
        updateLocalProduct,
        deleteLocalProduct,
        applyOverlayToList,
        applyOverlayToProduct,
        getLocalProductById,
        resetAllLocalChanges,
        hasLocalChanges,
      }}
    >
      {children}
    </ProductOverlayContext.Provider>
  );
}

export function useProductOverlay() {
  const context = useContext(ProductOverlayContext);
  if (!context) {
    throw new Error("useProductOverlay must be used within a ProductOverlayProvider");
  }
  return context;
}
