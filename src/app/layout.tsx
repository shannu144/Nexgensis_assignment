import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ProductOverlayProvider } from "@/context/ProductOverlayContext";
import { ToastProvider } from "@/components/common/Toast";

export const metadata: Metadata = {
  title: "Product Admin Dashboard",
  description: "Manage products, inventory, categories and pricing with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans antialiased text-gray-900 dark:text-gray-100">
        <AuthProvider>
          <ProductOverlayProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ProductOverlayProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
