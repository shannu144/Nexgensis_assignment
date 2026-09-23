"use client";

import React, { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import Shell from "@/components/layout/Shell";
import Spinner from "@/components/common/Spinner";
import Button from "@/components/common/Button";
import ProductModal from "@/components/products/ProductModal";
import { Product } from "@/types/product";
import { productService } from "@/services/product.service";
import { useProductOverlay } from "@/context/ProductOverlayContext";
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Truck,
  Edit3,
  Calendar,
  User,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface ProductDetailsPageProps {
  params: Promise<{ id: string }>;
}

function ProductDetailsContent({ id }: { id: string }) {
  const { getLocalProductById, applyOverlayToProduct } = useProductOverlay();

  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      setIsLoading(true);
      setIsNotFound(false);

      const numericId = parseInt(id, 10);

      // Check if product is available in local overlay store (e.g. locally added or edited)
      if (!isNaN(numericId)) {
        const localProduct = getLocalProductById(numericId);
        if (localProduct) {
          if (mounted) {
            setProduct(localProduct);
            setActiveImage(localProduct.thumbnail || localProduct.images?.[0] || "");
            setIsLoading(false);
          }
          return;
        }
      }

      try {
        const fetched = await productService.getProductById(id);
        const finalProduct = applyOverlayToProduct(fetched);

        if (!finalProduct) {
          // It was deleted locally
          if (mounted) {
            setIsNotFound(true);
            setIsLoading(false);
          }
          return;
        }

        if (mounted) {
          setProduct(finalProduct);
          setActiveImage(finalProduct.thumbnail || finalProduct.images?.[0] || "");
          setIsLoading(false);
        }
      } catch {
        if (mounted) {
          setIsNotFound(true);
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [id, getLocalProductById, applyOverlayToProduct]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Spinner size="lg" />
        <p className="mt-4 text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Loading product details...
        </p>
      </div>
    );
  }

  // Not Found State (Requirement: "Show a 'not found' page for a wrong id.")
  if (isNotFound || !product) {
    return (
      <div className="max-w-xl mx-auto my-12 text-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Product Not Found
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          We couldn&apos;t find any product matching ID{" "}
          <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-800 dark:text-gray-200 font-mono">
            {id}
          </code>
          . It may have been deleted or the URL might be invalid.
        </p>
        <Link href="/products">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.thumbnail
      ? [product.thumbnail]
      : [];

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Action bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditModalOpen(true)}
          leftIcon={<Edit3 className="w-3.5 h-3.5" />}
        >
          Edit Product
        </Button>
      </div>

      {/* Main Product Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-xs">
        {/* Left: Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl bg-gray-50 dark:bg-gray-800 overflow-hidden border border-gray-100 dark:border-gray-700/60">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-contain p-4"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Thumbnails list */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((imgUrl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-16 h-16 rounded-xl bg-gray-50 dark:bg-gray-800 overflow-hidden shrink-0 border-2 transition ${
                    activeImage === imgUrl
                      ? "border-indigo-600 ring-2 ring-indigo-500/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={imgUrl}
                    alt={`${product.title} view ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info, Price, Specs */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 capitalize">
                {product.category}
              </span>
              {product.brand && (
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  by {product.brand}
                </span>
              )}
              {product.isLocalAdded && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-indigo-600 text-white">
                  <Sparkles className="w-2.5 h-2.5" /> Added Item
                </span>
              )}
              {product.isLocalEdited && (
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-500 text-white">
                  Edited Item
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {product.title}
            </h1>

            {/* Rating and Reviews count */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  {Number(product.rating || 0).toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {product.reviews?.length || 0} verified customer reviews
              </span>
            </div>

            {/* Price block */}
            <div className="flex items-baseline gap-3 mt-6">
              <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.discountPercentage ? (
                <span className="text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {product.discountPercentage}% OFF
                </span>
              ) : null}
            </div>

            {/* Description */}
            <p className="mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Metadata badges grid */}
          <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">Stock Availability</p>
              <p className={`text-sm font-semibold mt-0.5 ${
                isOutOfStock
                  ? "text-rose-600"
                  : isLowStock
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}>
                {isOutOfStock ? "Out of Stock" : `${product.stock} units in stock`}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
              <p className="text-xs text-gray-500 dark:text-gray-400">Product SKU</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-0.5 font-mono">
                {product.sku || `SKU-${product.id}`}
              </p>
            </div>

            {product.warrantyInformation && (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Warranty</p>
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    {product.warrantyInformation}
                  </p>
                </div>
              </div>
            )}

            {product.shippingInformation && (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 flex items-center gap-2.5">
                <Truck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Shipping</p>
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    {product.shippingInformation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section (Assignment requirement: "with images, description, price and reviews") */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-xs">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Customer Reviews ({product.reviews?.length || 0})
        </h2>

        {!product.reviews || product.reviews.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
            No customer reviews yet for this product.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((rev, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gray-50/70 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/60 flex flex-col justify-between"
              >
                <div>
                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star
                        key={starIdx}
                        className={`w-3.5 h-3.5 ${
                          starIdx < rev.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-200 italic mb-4">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-200/60 dark:border-gray-700/40">
                  <div className="flex items-center gap-1.5 font-medium text-gray-800 dark:text-gray-200">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span>{rev.reviewerName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{new Date(rev.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      <ProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        productToEdit={product}
        onSuccess={() => {
          // Refresh state with updated product
          const updated = getLocalProductById(product.id);
          if (updated) {
            setProduct(updated);
          }
        }}
      />
    </div>
  );
}

export default function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  // Unwrap promise params in Next.js
  const unwrappedParams = use(params);

  return (
    <AuthGuard>
      <Shell>
        <ProductDetailsContent id={unwrappedParams.id} />
      </Shell>
    </AuthGuard>
  );
}
