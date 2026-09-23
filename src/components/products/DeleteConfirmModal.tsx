"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { Product } from "@/types/product";
import { productService } from "@/services/product.service";
import { useProductOverlay } from "@/context/ProductOverlayContext";
import { useToast } from "@/components/common/Toast";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSuccess: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  product,
  onSuccess,
}: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteLocalProduct } = useProductOverlay();
  const { showToast } = useToast();

  if (!product) return null;

  const handleDelete = async () => {
    if (isDeleting) return; // Prevent multiple requests

    setIsDeleting(true);
    try {
      // Call DummyJSON delete endpoint
      await productService.deleteProduct(product.id);

      // Record in local overlay state so it remains deleted during user session
      deleteLocalProduct(product.id);

      showToast(`"${product.title}" has been deleted.`, "success");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete product.";
      showToast(msg, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="text-center py-2">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Delete Product?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete{" "}
          <strong className="text-gray-800 dark:text-gray-200">
            &ldquo;{product.title}&rdquo;
          </strong>
          ? This action will remove the product from your dashboard.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            disabled={isDeleting}
            leftIcon={<Trash2 className="w-4 h-4" />}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
