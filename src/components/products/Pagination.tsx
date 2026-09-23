"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { formatShowingText, ALLOWED_LIMITS } from "@/lib/urlHelpers";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
  isLoading = false,
}: PaginationProps) {
  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();
  const showingText = formatShowingText(currentPage, limit, totalItems);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-2 select-none">
      {/* Showing count indicator & Page Size Selector */}
      <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        <span className="font-medium text-gray-800 dark:text-gray-200">
          {showingText}
        </span>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-800">
          <label htmlFor="limit-select" className="text-xs text-gray-500">
            Per page:
          </label>
          <select
            id="limit-select"
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            disabled={isLoading}
            className="text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-2.5 py-1 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {ALLOWED_LIMITS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1 || isLoading}
          aria-label="First page"
          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Numeric Page Buttons */}
        <div className="flex items-center gap-1 mx-1">
          {pageNumbers.map((page, idx) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-gray-400 select-none"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                disabled={isLoading}
                aria-current={isActive ? "page" : undefined}
                className={`min-w-[32px] h-8 px-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isLoading}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages || isLoading}
          aria-label="Last page"
          className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
