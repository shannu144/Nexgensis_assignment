"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { Product, ProductFormData, CategoryItem } from "@/types/product";
import { productService } from "@/services/product.service";
import { useProductOverlay } from "@/context/ProductOverlayContext";
import { useToast } from "@/components/common/Toast";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSuccess: () => void;
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  price?: string;
  stock?: string;
  rating?: string;
}

export default function ProductModal({
  isOpen,
  onClose,
  productToEdit,
  onSuccess,
}: ProductModalProps) {
  const isEditing = Boolean(productToEdit);
  const { addLocalProduct, updateLocalProduct } = useProductOverlay();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    category: "beauty",
    price: 0,
    stock: 0,
    brand: "",
    rating: 4.5,
    thumbnail: "",
  });

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories for dropdown
  useEffect(() => {
    let mounted = true;
    productService.getCategories().then((data) => {
      if (mounted) setCategories(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Prepopulate form when productToEdit changes
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        title: productToEdit.title || "",
        description: productToEdit.description || "",
        category: productToEdit.category || "beauty",
        price: productToEdit.price || 0,
        stock: productToEdit.stock || 0,
        brand: productToEdit.brand || "",
        rating: productToEdit.rating || 4.5,
        thumbnail: productToEdit.thumbnail || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        category: "beauty",
        price: 0,
        stock: 10,
        brand: "",
        rating: 4.5,
        thumbnail: "",
      });
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters long.";
    }

    if (!formData.description.trim() || formData.description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters long.";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Please select a category.";
    }

    if (formData.price === undefined || formData.price === null || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = "Price must be a positive number greater than 0.";
    }

    if (formData.stock === undefined || formData.stock === null || isNaN(formData.stock) || formData.stock < 0) {
      newErrors.stock = "Stock must be a non-negative number.";
    }

    if (formData.rating !== undefined && (formData.rating < 0 || formData.rating > 5)) {
      newErrors.rating = "Rating must be between 0 and 5.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple clicks

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (isEditing && productToEdit) {
        // Call API
        const payload: Partial<Product> = {
          ...productToEdit,
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          rating: Number(formData.rating),
        };

        const updated = await productService.updateProduct(productToEdit.id, payload);

        // Update local persistence overlay so changes are preserved in app
        updateLocalProduct({
          ...productToEdit,
          ...updated,
          ...formData,
        });

        showToast("Product updated successfully!", "success");
      } else {
        // Add new product
        const payload: Partial<Product> = {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          rating: Number(formData.rating),
          thumbnail:
            formData.thumbnail ||
            "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png",
          images: formData.thumbnail ? [formData.thumbnail] : [],
        };

        const created = await productService.addProduct(payload);

        // Persist into local overlay store
        addLocalProduct({
          ...created,
          ...payload,
          id: created.id || Date.now(),
        } as Product);

        showToast("Product added successfully!", "success");
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save product.";
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Product" : "Add New Product"}
      description={
        isEditing
          ? "Update product details. Changes will be saved in your session."
          : "Fill in the details below to create a new product item."
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Product Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Wireless Noise Canceling Headphones"
            className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
              errors.title
                ? "border-rose-400 focus:border-rose-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-rose-500">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide a detailed description of the product..."
            className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition resize-none ${
              errors.description
                ? "border-rose-400 focus:border-rose-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-rose-500">{errors.description}</p>
          )}
        </div>

        {/* Category & Brand row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-rose-500">{errors.category}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Brand
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              placeholder="e.g. Apple, Sony, Essence"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Price, Stock, Rating row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Price ($) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
              }
              className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                errors.price
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {errors.price && (
              <p className="mt-1 text-xs text-rose-500">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Stock <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) =>
                setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })
              }
              className={`w-full px-3.5 py-2 text-sm rounded-xl border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                errors.stock
                  ? "border-rose-400 focus:border-rose-500"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-rose-500">{errors.stock}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Rating (0 - 5)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Image URL (Optional)
          </label>
          <input
            type="url"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            placeholder="https://example.com/product-image.jpg"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          />
        </div>

        {/* Form Actions with double-click protection */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700/60">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isEditing ? "Save Changes" : "Create Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
