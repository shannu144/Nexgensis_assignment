"use client";

import React, { useEffect, useState } from "react";
import { ArrowDownAZ, ArrowUpZA, Filter, SlidersHorizontal, RotateCcw } from "lucide-react";
import { CategoryItem, SortByField, SortOrder } from "@/types/product";
import { productService } from "@/services/product.service";

interface FilterSortBarProps {
  selectedCategory: string;
  sortBy: SortByField;
  order: SortOrder;
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: SortByField, order: SortOrder) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export default function FilterSortBar({
  selectedCategory,
  sortBy,
  order,
  onCategoryChange,
  onSortChange,
  onResetFilters,
  hasActiveFilters,
}: FilterSortBarProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);

  useEffect(() => {
    let mounted = true;
    async function loadCategories() {
      try {
        const data = await productService.getCategories();
        if (mounted) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        if (mounted) {
          setIsLoadingCategories(false);
        }
      }
    }
    loadCategories();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleSortOrder = () => {
    onSortChange(sortBy, order === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700/80 shadow-xs">
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <label htmlFor="category-select" className="text-xs font-medium text-gray-500 dark:text-gray-400 sr-only">
            Category
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={isLoadingCategories}
            className="text-xs sm:text-sm font-medium bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Field Selector */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 shrink-0" />
          <label htmlFor="sort-select" className="text-xs font-medium text-gray-500 dark:text-gray-400 sr-only">
            Sort by
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortByField, order)}
            className="text-xs sm:text-sm font-medium bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-3 py-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition cursor-pointer"
          >
            <option value="id">Default (ID)</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
            <option value="title">Title (Name)</option>
          </select>
        </div>

        {/* Sort Order Button */}
        {sortBy !== "id" && (
          <button
            type="button"
            onClick={toggleSortOrder}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            title={`Currently ${order === "asc" ? "Ascending (Low to High)" : "Descending (High to Low)"}. Click to toggle.`}
          >
            {order === "asc" ? (
              <>
                <ArrowDownAZ className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Ascending</span>
              </>
            ) : (
              <>
                <ArrowUpZA className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Descending</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Reset Filter Button */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
}
