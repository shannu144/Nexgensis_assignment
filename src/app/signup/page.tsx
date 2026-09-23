"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useToast } from "@/components/common/Toast";
import Button from "@/components/common/Button";
import {
  Package,
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute password strength (0 to 4)
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/\d/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(formData.password);

  const getStrengthLabel = (score: number) => {
    if (!formData.password) return "";
    switch (score) {
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "Very Weak";
    }
  };

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 1:
        return "bg-rose-500";
      case 2:
        return "bg-amber-500";
      case 3:
        return "bg-sky-500";
      case 4:
        return "bg-emerald-500";
      default:
        return "bg-gray-300 dark:bg-gray-700";
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errs.firstName = "First name is required.";
    }
    if (!formData.lastName.trim()) {
      errs.lastName = "Last name is required.";
    }
    if (!formData.username.trim() || formData.username.trim().length < 3) {
      errs.username = "Username must be at least 3 characters.";
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.password || formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const result = await authService.signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      showToast(`Account created for ${result.firstName}! Redirecting to login...`, "success");

      // Redirect to login with username prepopulated
      setTimeout(() => {
        router.push(`/login?registered=true&username=${encodeURIComponent(formData.username)}`);
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register account.";
      showToast(msg, "error");
      setErrors({ form: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-indigo-50/70 via-white to-sky-50/70 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/login"
            className="inline-flex w-14 h-14 rounded-2xl bg-linear-to-tr from-indigo-600 to-violet-600 items-center justify-center text-white shadow-xl shadow-indigo-500/25 mb-3 transition hover:scale-105"
          >
            <Package className="w-7 h-7" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Create an Admin Account
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Join NexAdmin to start managing products and inventory
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-700 shadow-xl shadow-gray-200/40 dark:shadow-none">
          {errors.form && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1">{errors.form}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First and Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  First Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. John"
                  className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                    errors.firstName ? "border-rose-400" : "border-gray-300 dark:border-gray-700"
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-rose-500">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Last Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Doe"
                  className={`w-full px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                    errors.lastName ? "border-rose-400" : "border-gray-300 dark:border-gray-700"
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-rose-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Username <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="e.g. johndoe"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                    errors.username ? "border-rose-400" : "border-gray-300 dark:border-gray-700"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-xs text-rose-500">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                    errors.email ? "border-rose-400" : "border-gray-300 dark:border-gray-700"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                    errors.password ? "border-rose-400" : "border-gray-300 dark:border-gray-700"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-500">{errors.password}</p>
              )}

              {/* Password strength meter */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                    <span>Password Strength</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {getStrengthLabel(strength)}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`rounded-full transition-all duration-300 ${
                          strength >= step ? getStrengthColor(strength) : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-900 border rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition ${
                    errors.confirmPassword ? "border-rose-400" : "border-gray-300 dark:border-gray-700"
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-500">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="w-full mt-3"
            >
              Create Account
            </Button>
          </form>

          {/* DummyJSON Notice */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-200 text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
              <p>
                <strong>DummyJSON Mock API:</strong> Registration uses <code className="font-mono bg-white dark:bg-gray-900 px-1 py-0.5 rounded">POST /users/add</code>. To log in with a fully authenticated JWT token, use the pre-configured credentials <code className="font-mono bg-white dark:bg-gray-900 px-1 py-0.5 rounded">emilys / emilyspass</code>.
              </p>
            </div>
          </div>

          {/* Already have an account link */}
          <div className="mt-6 text-center text-xs text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign in here
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
