import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export default function ErrorState({
  title = "Failed to load products",
  message = "There was a problem communicating with the server. Please check your connection and try again.",
  onRetry,
  isRetrying = false,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 my-6">
      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mb-6">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          isLoading={isRetrying}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
        >
          Retry
        </Button>
      )}
    </div>
  );
}
