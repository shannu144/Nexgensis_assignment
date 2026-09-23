import React from "react";
import { Package, AlertTriangle, Star, Tags } from "lucide-react";
import { Product } from "@/types/product";

interface StatsBarProps {
  totalItems: number;
  products: Product[];
  activeCategory: string;
}

export default function StatsBar({
  totalItems,
  products,
  activeCategory,
}: StatsBarProps) {
  // Compute low stock items
  const lowStockCount = products.filter(
    (p) => p.stock !== undefined && p.stock <= 10
  ).length;

  // Compute average rating for current products
  const avgRating =
    products.length > 0
      ? (
          products.reduce((acc, p) => acc + (p.rating || 0), 0) /
          products.length
        ).toFixed(1)
      : "0.0";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Total Products */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex items-center gap-3.5 transition hover:shadow-sm">
        <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <Package className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Total Inventory
          </p>
          <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-0.5">
            {totalItems}
          </h4>
        </div>
      </div>

      {/* Active Category */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex items-center gap-3.5 transition hover:shadow-sm">
        <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
          <Tags className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Filter Scope
          </p>
          <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-0.5 capitalize truncate">
            {activeCategory || "All Categories"}
          </h4>
        </div>
      </div>

      {/* Low Stock Items */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex items-center gap-3.5 transition hover:shadow-sm">
        <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Low Stock (&le;10)
          </p>
          <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-0.5">
            {lowStockCount}{" "}
            <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
              on page
            </span>
          </h4>
        </div>
      </div>

      {/* Avg Rating */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-xs flex items-center gap-3.5 transition hover:shadow-sm">
        <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <Star className="w-5 h-5 fill-emerald-500 text-emerald-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Avg. Page Rating
          </p>
          <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mt-0.5">
            {avgRating} <span className="text-xs font-normal text-gray-400">/ 5.0</span>
          </h4>
        </div>
      </div>
    </div>
  );
}
