"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Edit3, Trash2, Star, Sparkles } from "lucide-react";
import { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="hidden md:block overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50/80 dark:bg-gray-800/80 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th scope="col" className="px-6 py-4">
                Product
              </th>
              <th scope="col" className="px-6 py-4">
                Category
              </th>
              <th scope="col" className="px-6 py-4">
                Price
              </th>
              <th scope="col" className="px-6 py-4">
                Rating
              </th>
              <th scope="col" className="px-6 py-4">
                Stock
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {products.map((product) => {
              const isLowStock = product.stock > 0 && product.stock <= 10;
              const isOutOfStock = product.stock <= 0;

              return (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50/80 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {/* Thumbnail & Title */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0 border border-gray-200/80 dark:border-gray-700/80">
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            sizes="48px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition truncate block"
                          title={product.title}
                        >
                          {product.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          {product.brand && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {product.brand}
                            </span>
                          )}
                          {product.isLocalAdded && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                              <Sparkles className="w-2.5 h-2.5" /> Added
                            </span>
                          )}
                          {product.isLocalEdited && (
                            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                              Edited
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="inline-block text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 capitalize">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                    ${Number(product.price).toFixed(2)}
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {Number(product.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
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
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
