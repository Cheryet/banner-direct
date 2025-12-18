import { Package, Eye, Download } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

/**
 * Order item display card
 * Server component - displays order item details
 */
export function OrderItemCard({ item }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-start sm:gap-4 sm:p-4">
      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 overflow-hidden sm:h-20 sm:w-20">
        {item.artwork_url ? (
          <img
            src={item.artwork_url}
            alt={item.product_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <Package className="h-6 w-6 text-gray-400 sm:h-8 sm:w-8" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-gray-900 text-sm sm:text-base">{item.product_name}</h3>
        {item.product_options && (
          <div className="mt-1 flex flex-wrap gap-1 sm:gap-2">
            {typeof item.product_options === 'object' ? (
              Object.entries(item.product_options).map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs"
                >
                  <span className="font-medium text-gray-700">{key}:</span>
                  <span className="ml-1 text-gray-600">{String(value).substring(0, 20)}</span>
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">{item.product_options}</span>
            )}
          </div>
        )}
        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <span>
              Qty: <strong>{item.quantity}</strong>
            </span>
            <span className="hidden sm:inline">{formatCurrency(item.unit_price)} each</span>
          </div>
          <p className="font-semibold text-gray-900 sm:hidden">
            {formatCurrency(item.unit_price * item.quantity)}
          </p>
        </div>
        {item.artwork_url && (
          <div className="mt-2 flex gap-2">
            <a
              href={item.artwork_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700"
            >
              <Eye className="h-3 w-3" />
              View Artwork
            </a>
            <a
              href={item.artwork_url}
              download
              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-700"
            >
              <Download className="h-3 w-3" />
              Download
            </a>
          </div>
        )}
      </div>
      <div className="hidden text-right sm:block">
        <p className="font-semibold text-gray-900">
          {formatCurrency(item.unit_price * item.quantity)}
        </p>
      </div>
    </div>
  );
}

/**
 * Order items list component
 * Server component - displays list of order items
 */
export function OrderItemsList({ items }) {
  if (!items || items.length === 0) {
    return <p className="py-4 text-center text-sm text-gray-500">No items in this order</p>;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((item) => (
        <OrderItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
