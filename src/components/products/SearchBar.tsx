"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Zap } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchBarProps {
  initialValue: string;
  onSearchChange: (value: string) => void;
  isSimulatedDelay: boolean;
  onToggleSimulatedDelay: () => void;
}

export default function SearchBar({
  initialValue,
  onSearchChange,
  isSimulatedDelay,
  onToggleSimulatedDelay,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const debouncedValue = useDebounce(inputValue, 350);

  // Sync internal state if initialValue changes externally (e.g. URL change or reset)
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  // Notify parent whenever debounced value changes
  useEffect(() => {
    if (debouncedValue !== initialValue) {
      onSearchChange(debouncedValue);
    }
  }, [debouncedValue, initialValue, onSearchChange]);

  const handleClear = () => {
    setInputValue("");
    onSearchChange("");
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search products by title, brand, description..."
          className="w-full pl-10 pr-9 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white placeholder-gray-400 shadow-xs transition"
        />
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Artificial Delay Simulator Toggle for testing race conditions (Assignment requirement) */}
      <button
        type="button"
        onClick={onToggleSimulatedDelay}
        title="Toggle artificial &delay=2000 to test that fast typing cancels and never overwrites newer results"
        className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border transition ${
          isSimulatedDelay
            ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-xs"
            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
      >
        <Zap className={`w-3.5 h-3.5 ${isSimulatedDelay ? "text-amber-600 animate-pulse" : "text-gray-400"}`} />
        <span>{isSimulatedDelay ? "2s Delay ON" : "Test Race (+2s)"}</span>
      </button>
    </div>
  );
}
