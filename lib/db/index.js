// Server-side data fetching utilities
// These should only be used in Server Components or API routes

// Client-facing data
export * from './categories';
export * from './templates';
export * from './settings';
export * from './shipping';
export * from './lead-times';

// Admin data
export * from './orders';
export * from './customers';
export * from './uploads';

// Re-export from products.js for convenience
export { 
  getProducts, 
  getProductBySlug, 
  getProductById, 
  getProductCategories,
  getRelatedProducts,
  calculatePrice,
  formatPrice 
} from '@/lib/products';
