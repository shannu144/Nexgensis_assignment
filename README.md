# 🛍️ Product Admin Dashboard

A production-ready frontend assignment built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Axios**, consuming the [DummyJSON API](https://dummyjson.com).

- 🌐 **Live URL**: [https://nexgensis-assignment-ivory.vercel.app/products](https://nexgensis-assignment-ivory.vercel.app/products)
- 📦 **GitHub Repository**: [https://github.com/shannu144/Nexgensis_assignment](https://github.com/shannu144/Nexgensis_assignment)

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- npm ≥ 10

### Installation & Running

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint check
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) — the root redirects to `/products`.

### Demo Credentials
| Field    | Value         |
|----------|---------------|
| Username | `emilys`      |
| Password | `emilyspass`  |

---

## 🏗️ Architecture & Design Decisions

### Framework & Libraries
| Concern       | Choice                     | Notes                                                 |
|---------------|----------------------------|-------------------------------------------------------|
| Framework     | Next.js 16 (App Router)    | TypeScript, RSC/CSR, file-based routing               |
| Styling       | Tailwind CSS v4            | Utility-first, responsive                             |
| HTTP Client   | Axios                      | Centralized instance with interceptors                |
| State         | React Context + useState   | No third-party state management library               |
| Icons         | Lucide React               | Consistent icon set                                   |
| **Query lib** | **None**                   | React Query / SWR explicitly excluded per assignment  |
| **Table lib** | **None**                   | TanStack Table explicitly excluded per assignment     |

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx               # Root layout — AuthProvider + ProductOverlayProvider + ToastProvider
│   ├── page.tsx                 # Redirects / → /products
│   ├── not-found.tsx            # Custom 404
│   ├── login/page.tsx           # Login page
│   └── products/
│       ├── page.tsx             # Dashboard list (search, filter, sort, paginate, CRUD)
│       └── [id]/page.tsx        # Product details (gallery, specs, reviews, edit, 404)
├── components/
│   ├── auth/AuthGuard.tsx       # Route protection HOC
│   ├── common/                  # Button, Modal, Spinner, Toast, ErrorState
│   ├── layout/                  # Navbar, Shell
│   └── products/                # ProductTable, ProductCard, SearchBar, FilterSortBar,
│                                #   Pagination, ProductModal, DeleteConfirmModal
├── context/
│   ├── AuthContext.tsx          # Login / Logout / session persistence
│   └── ProductOverlayContext.tsx # Local persistence overlay for CRUD mutations
├── hooks/
│   ├── useDebounce.ts           # Debounce hook (400ms)
│   └── useProducts.ts           # Custom data-fetching hook — NO React Query / SWR
├── lib/
│   ├── axios.ts                 # Shared Axios instance
│   └── urlHelpers.ts            # URL query param parsers & sanitizers
├── services/
│   ├── auth.service.ts          # /auth/login, /auth/me
│   └── product.service.ts       # /products CRUD + search + categories
└── types/
    ├── auth.ts                  # User, LoginCredentials types
    └── product.ts               # Product, Review, CategoryItem types
```

---

## 🔑 Key Technical Implementations

### 1. Axios — Centralized Instance with Interceptors (`src/lib/axios.ts`)

A single Axios instance is shared across the entire app:

- **Request Interceptor**: Reads the JWT from `localStorage` and attaches it as `Authorization: Bearer <token>` on every request automatically.
- **Response Interceptor**: Normalizes all API errors into readable messages. On `401 Unauthorized`, it clears localStorage and redirects the user to `/login?expired=true`, preventing them from reaching protected pages with a stale token.

### 2. Race Condition Prevention in Search

This is a subtle but critical edge case the assignment explicitly calls out.

**Problem**: Typing "ph" triggers a search, then typing "phone" triggers another. If the "ph" network response arrives *after* the "phone" response (due to latency), it would replace the correct "phone" results with stale "ph" results.

**Solution** (`src/hooks/useProducts.ts`):
- Each fetch call creates a new `AbortController` and **cancels the previous in-flight request** before starting a new one.
- A monotonically incrementing `lastRequestIdRef` counter is compared after each successful response — only the response matching the **latest request ID** is allowed to update state.
- The **"Test Race (+2s)"** toggle button in the SearchBar adds `&delay=2000` to the API call, simulating a slow network. Rapidly typing while this is ON proves old responses are always discarded.

### 3. Mock API Persistence Overlay (`src/context/ProductOverlayContext.tsx`)

DummyJSON does not persist mutations server-side. Add/edit/delete API responses are simulated and reset on every new fetch.

**Solution**: A dedicated **ProductOverlayContext** tracks three sets in `localStorage`:
- `addedProducts[]` — locally created items
- `editedProducts[id]` — locally modified items keyed by ID
- `deletedProductIds[]` — soft-deleted IDs to exclude from server data

After every API fetch, `applyOverlayToList()` merges the server response with the local overlay: filtering deleted IDs out, replacing edited items, and prepending added items on page 1. This makes all CRUD operations survive:
- Pagination changes
- Search/filter changes
- Page refreshes (via localStorage)
- Navigation to `/products/[id]` and back

### 4. Search + Category Limitation

**DummyJSON limitation**: `/products/search?q=` does not accept a `category` query param. And `/products/category/:name` does not accept a `q` param. They are separate endpoints.

**Strategy** (`src/hooks/useProducts.ts`):
- If only search is active → use `/products/search?q=`
- If only category is active → use `/products/category/:name`
- If **both** are active → search globally via `/products/search?q=` then **client-side filter** the results by the selected category. A prominent informational badge in the UI explains this behavior to the user.

### 5. URL State Management & Bad Parameter Resilience

All filter, sort, pagination, and search state is encoded in the URL query string:

```
/products?page=2&limit=20&q=phone&category=smartphones&sortBy=price&order=desc
```

The `src/lib/urlHelpers.ts` module sanitizes every parameter defensively:
- `?page=abc` → falls back to page 1
- `?page=99999` → clamped to `totalPages` (effect runs after fetch)
- `?limit=7` → falls back to 10 (only 10, 20, 50 are valid)
- `?sortBy=invalid` → falls back to `"id"` (default order)

### 6. Double-Submit Protection

Login, Save, and Delete action buttons are disabled and show a spinner while the associated API call is in-flight (`isSubmitting` state). This prevents race conditions from rapid button clicking, which could result in duplicate API calls or corrupted state.

### 7. Responsive Layout

| Viewport | Layout          |
|----------|-----------------|
| ≥ 768px  | Desktop table (hidden on mobile) |
| < 768px  | Card grid (hidden on desktop)    |

Both views share the same data source and action handlers.

---

## ✅ Feature Checklist

| Feature                                      | Status |
|----------------------------------------------|--------|
| Login page with `emilys` / `emilyspass`      | ✅     |
| JWT stored in localStorage, sent via headers | ✅     |
| 401 auto-redirect to /login                  | ✅     |
| Session persists on refresh                  | ✅     |
| AuthGuard protecting all dashboard routes    | ✅     |
| Product listing with thumbnail, title, category, price, rating, stock | ✅ |
| Desktop table view                           | ✅     |
| Mobile card grid view                        | ✅     |
| Custom pagination (no third-party library)   | ✅     |
| Page size selector (10 / 20 / 50)            | ✅     |
| "Showing X–Y of Z" indicator                 | ✅     |
| Debounced search (350ms)                     | ✅     |
| Race condition prevention (AbortController + request ID) | ✅ |
| "Test Race +2s" toggle to simulate & verify  | ✅     |
| Category filter dropdown (fetched from API)  | ✅     |
| Sort by Price / Rating / Title (asc/desc)    | ✅     |
| URL reflects all state (page, q, category, sortBy, order) | ✅ |
| Graceful handling of bad URL params          | ✅     |
| Product details page `/products/[id]`        | ✅     |
| Image gallery with thumbnail navigation      | ✅     |
| Customer reviews section                     | ✅     |
| 404 / not-found state for invalid product IDs | ✅    |
| Add product form with validation             | ✅     |
| Edit product form pre-populated              | ✅     |
| Delete confirmation modal                    | ✅     |
| Loading spinner state                        | ✅     |
| Shimmer skeleton loaders (table + mobile cards) | ✅  |
| Empty state with "Reset filters" button      | ✅     |
| Error state with Retry button                | ✅     |
| Toast notifications for CRUD actions         | ✅     |
| Logout clears session and redirects          | ✅     |
| Signup page `/signup` with password strength meter | ✅ |
| Dark mode toggle (next-themes)               | ✅     |
| User profile dropdown in Navbar              | ✅     |
| Live inventory stats bar (4 metric cards)    | ✅     |
| Clean git commit history                     | ✅     |
| ESLint 0 errors                              | ✅     |
| TypeScript build 0 errors                    | ✅     |

---

## 🤖 AI Usage Disclosure

This project was built with the assistance of **Antigravity (Google DeepMind AI coding assistant)**. The AI helped with:
- Scaffolding component structure and boilerplate
- Writing Axios interceptor patterns
- Implementing the `AbortController` race condition prevention pattern
- Drafting the local persistence overlay strategy

All generated code was reviewed for correctness, and architectural decisions (especially the search+category limitation workaround and the local persistence overlay design) were deliberate choices informed by the DummyJSON API constraints.

---

## 🧪 Testing the Race Condition Feature

1. Open the Products page
2. Click the **"Test Race (+2s)"** toggle button in the search bar (it turns amber)
3. Type quickly into the search box — e.g., type `p`, then `ph`, then `pho`, then `phone`
4. Observe: only the **final result** (for `phone`) is shown, never stale intermediate results
5. Check the network tab — older requests are cancelled with status `canceled`
