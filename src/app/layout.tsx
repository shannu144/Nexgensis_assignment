import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ProductOverlayProvider } from "@/context/ProductOverlayContext";
import { ToastProvider } from "@/components/common/Toast";
import { ThemeProvider } from "@/components/common/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50/60 dark:bg-gray-950 font-sans antialiased text-gray-900 dark:text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ProductOverlayProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </ProductOverlayProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
