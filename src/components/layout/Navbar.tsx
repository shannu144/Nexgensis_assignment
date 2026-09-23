"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useProductOverlay } from "@/context/ProductOverlayContext";
import { LogOut, Package, RefreshCw } from "lucide-react";
import Button from "@/components/common/Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { hasLocalChanges, resetAllLocalChanges } = useProductOverlay();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/products"
            className="flex items-center gap-2.5 font-bold text-xl text-gray-900 dark:text-white tracking-tight hover:opacity-90 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Package className="w-5 h-5" />
            </div>
            <span>
              Nex<span className="text-indigo-600 dark:text-indigo-400">Admin</span>
            </span>
          </Link>

          {/* User actions */}
          <div className="flex items-center gap-3">
            {/* Local Mock Persistence indicator & reset button */}
            {hasLocalChanges && (
              <button
                onClick={resetAllLocalChanges}
                title="Reset added/edited/deleted products to API defaults"
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 hover:bg-amber-100 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Local Data</span>
              </button>
            )}

            {/* User profile */}
            {user && (
              <div className="flex items-center gap-2.5 pl-2 border-l border-gray-200 dark:border-gray-800">
                {user.image ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <Image
                      src={user.image}
                      alt={user.firstName}
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-semibold flex items-center justify-center text-xs">
                    {user.firstName?.charAt(0) || "U"}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    @{user.username}
                  </p>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={logout}
              leftIcon={<LogOut className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />}
              className="text-xs"
            >
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
