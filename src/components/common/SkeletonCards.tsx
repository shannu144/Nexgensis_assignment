import React from "react";

export default function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-xs animate-pulse p-4 space-y-3"
        >
          {/* Card image placeholder */}
          <div className="h-40 w-full rounded-xl bg-gray-200 dark:bg-gray-800 skeleton-shimmer" />

          {/* Title & Brand */}
          <div className="space-y-1.5 pt-1">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 skeleton-shimmer rounded-md w-3/4" />
            <div className="h-3 bg-gray-150 dark:bg-gray-850 skeleton-shimmer rounded-md w-1/3" />
          </div>

          {/* Price & Rating */}
          <div className="flex items-center justify-between pt-2">
            <div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 skeleton-shimmer rounded-md" />
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 skeleton-shimmer rounded-md" />
          </div>

          {/* Stock */}
          <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 skeleton-shimmer rounded-md" />

          {/* Action footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 skeleton-shimmer rounded-md" />
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-md bg-gray-200 dark:bg-gray-800 skeleton-shimmer" />
              <div className="w-6 h-6 rounded-md bg-gray-200 dark:bg-gray-800 skeleton-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
