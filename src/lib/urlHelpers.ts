import { SortByField, SortOrder } from "@/types/product";

export const ALLOWED_LIMITS = [10, 20, 50] as const;
export type AllowedLimit = (typeof ALLOWED_LIMITS)[number];

export function parsePage(param: string | null): number {
  if (!param) return 1;
  const parsed = parseInt(param, 10);
  if (isNaN(parsed) || parsed < 1) return 1;
  return parsed;
}

export function parseLimit(param: string | null): number {
  if (!param) return 10;
  const parsed = parseInt(param, 10);
  if ([10, 20, 50].includes(parsed)) {
    return parsed;
  }
  return 10;
}

export function parseSortBy(param: string | null): SortByField {
  if (param === "price" || param === "rating" || param === "title") {
    return param;
  }
  return "id";
}

export function parseOrder(param: string | null): SortOrder {
  if (param === "desc") return "desc";
  return "asc";
}

export function formatShowingText(
  page: number,
  limit: number,
  total: number
): string {
  if (total === 0) return "Showing 0 of 0";
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  return `Showing ${start}–${end} of ${total}`;
}
