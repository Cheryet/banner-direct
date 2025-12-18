# UI Refactor Plan

## Status: Phase 3 Complete ✓

### Phase 1 - Completed
- [x] Created shared format utilities (`lib/format.js`)
- [x] Created order constants (`lib/constants/orders.js`)
- [x] Created shared UI components (LoadingSpinner, AlertMessage, EmptyState, PageHeader, StatsCard)
- [x] Created admin components (OrderStatusBadge, OrderStatusSelect)
- [x] Updated 10+ files to use shared utilities

### Phase 2 - Completed
- [x] Extract OrderPipeline and OrderQuickActions components
- [x] Extract OrderItemCard and OrderItemsList components
- [x] Extract OrderShippingForm and OrderTrackingInfo components
- [x] Create TabNav component for reusable tab navigation
- [x] Order detail page: 957 → 602 lines (37% reduction)

### Phase 3 - Completed
- [x] Extract ProductVariantsTab (sizes, materials, finishings)
- [x] Extract ProductShippingTab (lead times, shipping details)
- [x] Extract ProductPricingTab (volume discounts)
- [x] Extract ProductAddonsTab (product add-ons)
- [x] Product edit page: 1224 → 691 lines (44% reduction)

### Phase 4 - Completed
- [x] Extract AdminProductCard, ProductsEmptyState, ProductsGrid components
- [x] Update admin products page to use ProductsGrid (279 → 203 lines)
- [x] Update board page to use shared ORDER_PIPELINE constants
- [x] Review client/server component boundaries (all appropriate)

### Summary
**Total file size reductions:**
- `app/admin/orders/[id]/page.jsx`: 957 → 602 lines (37%)
- `app/admin/products/[id]/page.jsx`: 1224 → 691 lines (44%)
- `app/admin/products/page.jsx`: 279 → 203 lines (27%)

---

## Audit Summary

### Large Files (>200 lines) - Priority for Extraction
| File | Lines | Notes |
|------|-------|-------|
| `app/admin/products/[id]/page.jsx` | 1224 | Product edit form - split into tab components |
| `app/product/[slug]/page.jsx` | 1012 | Product detail page - extract configurator |
| `app/admin/orders/[id]/page.jsx` | 956 | Order detail - extract pipeline, cards |
| `app/account/settings/page.jsx` | 855 | Settings page - already has sections |
| `app/bulk/page.jsx` | 808 | Bulk order page |
| `components/admin/orders-page-client.jsx` | 686 | Orders list - extract table, filters |
| `app/admin/settings/page.jsx` | 569 | Admin settings |
| `app/pricing/page.jsx` | 477 | Pricing page |
| `app/admin/templates/[id]/page.jsx` | 452 | Template editor |
| `app/admin/page.jsx` | 437 | Admin dashboard - extract stat cards |
| `app/orders/[id]/page.jsx` | 433 | Client order detail |
| `app/admin/orders/board/page.jsx` | 422 | Fulfillment board |

### Duplicated Code Patterns

1. **ORDER_STATUSES / STATUS_COLORS** - Defined in 2 files:
   - `components/admin/orders-page-client.jsx`
   - `app/admin/orders/[id]/page.jsx`

2. **formatCurrency** - Defined locally in 9+ files

3. **formatDate** - Defined locally in 8+ files

4. **Loading spinner pattern** - Repeated across many files:
   ```jsx
   <div className="flex items-center justify-center py-16">
     <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
   </div>
   ```

5. **Error/Success alerts** - Repeated pattern:
   ```jsx
   <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-700">
     <AlertCircle className="h-5 w-5" />
     {error}
   </div>
   ```

6. **Empty state pattern** - Repeated across tables/lists

7. **Stats cards** - Similar pattern in admin dashboard, analytics

---

## Extraction Plan (Incremental)

### Phase 1: Shared Utilities
Create `lib/format.js`:
- `formatCurrency(amount)`
- `formatDate(date, options)`

Create `lib/constants/orders.js`:
- `ORDER_STATUSES`
- `STATUS_COLORS`
- `ORDER_PIPELINE`

### Phase 2: Shared UI Components
Create in `components/ui/`:
- `loading-spinner.jsx` - Reusable loading state
- `alert-message.jsx` - Error/success/warning alerts
- `empty-state.jsx` - Empty list/table state
- `stats-card.jsx` - Dashboard stat cards
- `page-header.jsx` - Page title + description + actions

### Phase 3: Admin Components
Create in `components/admin/`:
- `order-status-badge.jsx` - Color-coded status badge
- `order-status-select.jsx` - Status dropdown with colors
- `order-pipeline.jsx` - Visual pipeline tracker
- `data-table.jsx` - Reusable table wrapper

### Phase 4: Large Page Decomposition
Split large pages into smaller components:
- Product edit page → tab content components
- Order detail page → section components
- Dashboard → widget components

---

## Rules
- Server components by default
- `"use client"` only in leaf components that need interactivity
- All data via props
- No Supabase calls in UI components
- Preserve existing visual output exactly
