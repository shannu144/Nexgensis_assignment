"use client";

import React, { useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import Shell from "@/components/layout/Shell";
import ProductTable from "@/components/products/ProductTable";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/products/Pagination";
import SearchBar from "@/components/products/SearchBar";
import FilterSortBar from "@/components/products/FilterSortBar";
import StatsBar from "@/components/products/StatsBar";
import SkeletonTable from "@/components/common/SkeletonTable";
import SkeletonCards from "@/components/common/SkeletonCards";
import ProductModal from "@/components/products/ProductModal";
import DeleteConfirmModal from "@/components/products/DeleteConfirmModal";
import ErrorState from "@/components/common/ErrorState";
import Spinner from "@/components/common/Spinner";
import Button from "@/components/common/Button";
import { useProducts } from "@/hooks/useProducts";
import { Product, ProductFilterParams, SortByField, SortOrder } from "@/types/product";
import { parsePage, parseLimit, parseSortBy, parseOrder } from "@/lib/urlHelpers";
import { Plus, PackageSearch, Sparkles } from "lucide-react";

function ProductsDashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Read & Sanitize params from URL query string
  const rawPage = searchParams.get("page");
  const rawLimit = searchParams.get("limit");
  const rawQ = searchParams.get("q") || "";
  const rawCategory = searchParams.get("category") || "";
  const rawSortBy = searchParams.get("sortBy");
  const rawOrder = searchParams.get("order");

  const page = parsePage(rawPage);
  const limit = parseLimit(rawLimit);
  const search = rawQ;
  const category = rawCategory;
  const sortBy = parseSortBy(rawSortBy);
  const order = parseOrder(rawOrder);

  // Simulated delay state (to test race-condition requirement: &delay=2000)
  const [isSimulatedDelay, setIsSimulatedDelay] = useState(false);

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Helper to update URL params cleanly
  const updateQueryParams = useCallback(
    (newParams: Partial<Record<string, string | number | null>>) => {
      const current = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });

      router.push(`${pathname}?${current.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const filterParams: ProductFilterParams = {
    page,
    limit,
    search,
    category,
    sortBy,
    order,
  };

  // 2. Fetch products with custom hook (Zero React-Query / SWR)
  const {
    products,
    total,
    totalPages,
    isLoading,
    error,
    refetch,
  } = useProducts(filterParams, isSimulatedDelay ? 2000 : 0);

  // Handle wrong page values exceeding totalPages gracefully (e.g. ?page=999)
  React.useEffect(() => {
    if (!isLoading && totalPages > 0 && page > totalPages) {
      updateQueryParams({ page: totalPages });
    }
  }, [isLoading, totalPages, page, updateQueryParams]);

  // Handlers
  const handleSearchChange = (val: string) => {
    // Reset to page 1 when search changes as required
    updateQueryParams({ q: val, page: 1 });
  };

  const handleCategoryChange = (cat: string) => {
    // Reset to page 1 when category changes
    updateQueryParams({ category: cat, page: 1 });
  };

  const handleSortChange = (newSortBy: SortByField, newOrder: SortOrder) => {
    updateQueryParams({
      sortBy: newSortBy === "id" ? null : newSortBy,
      order: newOrder,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage });
  };

  const handleLimitChange = (newLimit: number) => {
    updateQueryParams({ limit: newLimit, page: 1 });
  };

  const handleResetFilters = () => {
    updateQueryParams({
      q: null,
      category: null,
      sortBy: null,
      order: null,
      page: 1,
    });
  };

  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const hasActiveFilters = Boolean(
    search || category || (sortBy && sortBy !== "id") || (order && order !== "asc")
  );

  const isBothSearchAndCategory = Boolean(search.trim() && category.trim());

  return (
    <Shell>
      <div className="animate-fade-in space-y-6">
        {/* Page Title & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Products Overview
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your product catalog, real-time inventory, categories, and pricing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={handleOpenAddModal}
              leftIcon={<Plus className="w-4 h-4" />}
              className="shadow-md shadow-indigo-500/20"
            >
              Add Product
            </Button>
          </div>
        </div>

        {/* Live Metrics Stats Bar */}
        <StatsBar
          totalItems={total}
          products={products}
          activeCategory={category}
        />

        {/* Search and Filters Section */}
        <div className="space-y-3">
          <SearchBar
            initialValue={search}
            onSearchChange={handleSearchChange}
            isSimulatedDelay={isSimulatedDelay}
            onToggleSimulatedDelay={() => setIsSimulatedDelay((prev) => !prev)}
          />

          <FilterSortBar
            selectedCategory={category}
            sortBy={sortBy}
            order={order}
            onCategoryChange={handleCategoryChange}
            onSortChange={handleSortChange}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Category + Search Notice */}
          {isBothSearchAndCategory && (
            <div className="flex items-center gap-2 p-3 text-xs bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 rounded-xl border border-indigo-100 dark:border-indigo-900/60 animate-fade-in">
              <Sparkles className="w-4 h-4 shrink-0 text-indigo-500" />
              <span>
                Searching for <strong>&ldquo;{search}&rdquo;</strong> filtered within the <strong>&ldquo;{category}&rdquo;</strong> category.
              </span>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        {error ? (
          <ErrorState message={error} onRetry={refetch} isRetrying={isLoading} />
        ) : isLoading ? (
          <div className="space-y-4">
            <SkeletonTable rows={Math.min(limit, 8)} />
            <SkeletonCards count={4} />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-6 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 flex items-center justify-center mb-3">
              <PackageSearch className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
              No products found
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-5">
              {hasActiveFilters
                ? "We couldn't find any products matching your active search or category filters."
                : "There are currently no products available."}
            </p>
            {hasActiveFilters && (
              <Button variant="secondary" size="sm" onClick={handleResetFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Desktop Table View */}
            <ProductTable
              products={products}
              onEdit={handleOpenEditModal}
              onDelete={(p) => setProductToDelete(p)}
            />

            {/* Mobile Cards View */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleOpenEditModal}
                  onDelete={(p) => setProductToDelete(p)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              limit={limit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
        onSuccess={() => {
          refetch();
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        product={productToDelete}
        onSuccess={() => {
          refetch();
        }}
      />
    </Shell>
  );
}

export default function ProductsPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
            <Spinner size="lg" />
          </div>
        }
      >
        <ProductsDashboardContent />
      </Suspense>
    </AuthGuard>
  );
}
