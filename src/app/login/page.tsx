"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Package, Lock, User, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import Button from "@/components/common/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to products immediately
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/products";
      router.replace(redirect);
    }
  }, [isAuthenticated, authLoading, router, searchParams]);

  // Show session expired alert if redirected due to 401
  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      setError("Your session has expired. Please log in again.");
    }
    if (searchParams.get("registered") === "true") {
      const registeredUser = searchParams.get("username") || "";
      if (registeredUser) {
        setUsername(registeredUser);
      }
      setSuccessNotice("Account created successfully! For complete API demo access, you can also sign in with the verified demo credentials below.");
    }
  }, [searchParams]);

  const fillDemoCredentials = () => {
    setUsername("emilys");
    setPassword("emilyspass");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple clicks

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await login({ username, password });
      const redirect = searchParams.get("redirect") || "/products";
      router.replace(redirect);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Invalid credentials. Please check your username and password.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-indigo-50/70 via-white to-sky-50/70 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-600 items-center justify-center text-white shadow-xl shadow-indigo-500/25 mb-3 transition hover:scale-105">
            <Package className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Welcome to NexAdmin
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Sign in to manage your products and inventory
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-700 shadow-xl shadow-gray-200/40 dark:shadow-none">
          {successNotice && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div className="flex-1">{successNotice}</div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. emilys"
                  autoComplete="username"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Demo Credentials Box */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
            <div className="bg-indigo-50/70 dark:bg-indigo-950/40 rounded-2xl p-4 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Demo Credentials</span>
                </div>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Auto-fill
                </button>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Username: <code className="font-mono bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-300">emilys</code>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Password: <code className="font-mono bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-300">emilyspass</code>
              </p>
            </div>
          </div>

          {/* New to NexAdmin? Sign up link */}
          <div className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Create an account
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          Product Admin Dashboard • Built with Next.js, Tailwind CSS & Axios
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950" />}>
      <LoginForm />
    </Suspense>
  );
}
