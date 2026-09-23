import React from "react";

export default function SkeletonTable({ rows = 6 }: { rows?: number }) {
  return (
    <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-xs uppercase font-semibold text-gray-400 dark:text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th scope="col" className="px-6 py-4">Product</th>
              <th scope="col" className="px-6 py-4">Category</th>
              <th scope="col" className="px-6 py-4">Price</th>
              <th scope="col" className="px-6 py-4">Rating</th>
              <th scope="col" className="px-6 py-4">Stock</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {/* Product with thumbnail */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-800 skeleton-shimmer shrink-0" />
                    <div className="space-y-2 flex-1 max-w-[200px]">
                      <div className="h-4 bg-gray-200 dark:bg-gray-800 skeleton-shimmer rounded-md w-4/5" />
                      <div className="h-3 bg-gray-150 dark:bg-gray-850 skeleton-shimmer rounded-md w-1/2" />
                    </div>
                  </div>
                </td>
                {/* Category badge */}
                <td className="px-6 py-4">
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-800 skeleton-shimmer rounded-full" />
                </td>
                {/* Price */}
                <td className="px-6 py-4">
                  <div className="h-4 w-14 bg-gray-200 dark:bg-gray-800 skeleton-shimmer rounded-md" />
                </td>
                {/* Rating */}
                <td className="px-6 py-4">
                  <div className="h-4 w-10 bg-gray-200 dark:bg-gray-800 skeleton-shimmer rounded-md" />
                </td>
                {/* Stock badge */}
                <td className="px-6 py-4">
                  <div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 skeleton-shimmer rounded-full" />
                </td>
                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800 skeleton-shimmer" />
                    <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800 skeleton-shimmer" />
                    <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800 skeleton-shimmer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
