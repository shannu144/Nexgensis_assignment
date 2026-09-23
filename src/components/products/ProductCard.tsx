"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Edit3, Trash2, Star, Sparkles } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-xs hover:shadow-md transition">
      {/* Top Banner / Image Area */}
      <div className="relative h-44 w-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-3">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-contain p-2"
          />
        ) : (
          <span className="text-gray-400 text-xs">No Image Available</span>
        )}

        {/* Category tag */}
        <span className="absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 backdrop-blur-xs capitalize shadow-xs">
          {product.category}
        </span>

        {/* Local modified tags */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {product.isLocalAdded && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-indigo-600 text-white shadow-xs">
              <Sparkles className="w-2.5 h-2.5" /> Added
            </span>
          )}
          {product.isLocalEdited && (
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-xs">
              Edited
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/products/${product.id}`}
              className="font-semibold text-base text-gray-900 dark:text-white hover:text-indigo-600 line-clamp-1"
            >
              {product.title}
            </Link>
          </div>

          {product.brand && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {product.brand}
            </p>
          )}

          {/* Price & Rating */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${Number(product.price).toFixed(2)}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                {Number(product.rating || 0).toFixed(1)}
              </span>
            </div>
          </div>

          {/* Stock Indicator */}
          <div className="mt-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium ${
                isOutOfStock
                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                  : isLowStock
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                  : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOutOfStock
                    ? "bg-rose-500"
                    : isLowStock
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
              />
              {isOutOfStock
                ? "Out of stock"
                : `${product.stock} in stock`}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100 dark:border-gray-800">
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="p-1.5 text-gray-500 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              title="Edit Product"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(product)}
              className="p-1.5 text-gray-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
