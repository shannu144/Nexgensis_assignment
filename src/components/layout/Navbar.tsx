"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import { useProductOverlay } from "@/context/ProductOverlayContext";
import {
  LogOut,
  Package,
  RefreshCw,
  Sun,
  Moon,
  ChevronDown,
  User as UserIcon,
  Shield,
} from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { hasLocalChanges, resetAllLocalChanges } = useProductOverlay();
  const { setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Avoid hydration mismatch for theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link
            href="/products"
            className="flex items-center gap-2.5 font-bold text-xl text-gray-900 dark:text-white tracking-tight hover:opacity-90 transition"
          >
            <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Package className="w-5 h-5" />
            </div>
            <span>
              Nex<span className="text-indigo-600 dark:text-indigo-400">Admin</span>
            </span>
          </Link>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition"
                title={`Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} mode`}
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}

            {/* Quick Reset Local Changes indicator */}
            {hasLocalChanges && (
              <button
                onClick={resetAllLocalChanges}
                title="Reset added/edited/deleted products to API defaults"
                className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Local Data</span>
              </button>
            )}

            {/* User Profile Dropdown */}
            {user && (
              <div className="relative pl-1" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800/80 transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
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

                  <div className="hidden sm:block text-left pr-1">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white leading-tight">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      @{user.username}
                    </p>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl py-2 z-50 animate-fade-in">
                    {/* User info summary */}
                    <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {user.email || `${user.username}@dummyjson.com`}
                      </p>
                      <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        <Shield className="w-2.5 h-2.5" /> Authenticated Admin
                      </span>
                    </div>

                    {/* Reset Local Data option for mobile / menu */}
                    {hasLocalChanges && (
                      <button
                        type="button"
                        onClick={() => {
                          resetAllLocalChanges();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 flex items-center gap-2 transition"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset Local Session Data</span>
                      </button>
                    )}

                    {/* My Account label */}
                    <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>Account ID #{user.id}</span>
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
