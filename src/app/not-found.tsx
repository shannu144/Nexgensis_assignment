import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import Button from "@/components/common/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md text-center mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/products">
        <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
}
