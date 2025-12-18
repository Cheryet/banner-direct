/**
 * Order-related constants
 * Shared across admin order pages for consistent status handling
 */

import {
  Clock,
  CheckCircle,
  RefreshCw,
  Printer,
  ClipboardCheck,
  Truck,
  Package,
  XCircle,
  PackageCheck,
} from 'lucide-react';

export const ORDER_STATUSES = [
  {
    id: 'pending',
    label: 'Pending',
    color: 'yellow',
    icon: Clock,
    description: 'Awaiting confirmation',
  },
  {
    id: 'confirmed',
    label: 'Confirmed',
    color: 'blue',
    icon: CheckCircle,
    description: 'Payment received',
  },
  {
    id: 'processing',
    label: 'Processing',
    color: 'blue',
    icon: RefreshCw,
    description: 'Preparing artwork',
  },
  {
    id: 'printing',
    label: 'Printing',
    color: 'purple',
    icon: Printer,
    description: 'In production',
  },
  {
    id: 'quality_check',
    label: 'Quality Check',
    color: 'indigo',
    icon: ClipboardCheck,
    description: 'Final inspection',
  },
  {
    id: 'shipped',
    label: 'Shipped',
    color: 'emerald',
    icon: Truck,
    description: 'On the way',
  },
  {
    id: 'delivered',
    label: 'Delivered',
    color: 'emerald',
    icon: PackageCheck,
    description: 'Completed',
  },
  {
    id: 'cancelled',
    label: 'Cancelled',
    color: 'gray',
    icon: XCircle,
    description: 'Order cancelled',
  },
];

export const ORDER_PIPELINE = [
  {
    id: 'pending',
    label: 'Pending',
    icon: Clock,
    color: 'yellow',
    description: 'Awaiting confirmation',
  },
  {
    id: 'confirmed',
    label: 'Confirmed',
    icon: CheckCircle,
    color: 'blue',
    description: 'Payment verified',
  },
  {
    id: 'processing',
    label: 'Processing',
    icon: RefreshCw,
    color: 'blue',
    description: 'Preparing artwork',
  },
  {
    id: 'printing',
    label: 'Printing',
    icon: Printer,
    color: 'purple',
    description: 'In production',
  },
  {
    id: 'quality_check',
    label: 'QC',
    icon: ClipboardCheck,
    color: 'indigo',
    description: 'Final inspection',
  },
  {
    id: 'shipped',
    label: 'Shipped',
    icon: Truck,
    color: 'emerald',
    description: 'On the way',
  },
  {
    id: 'delivered',
    label: 'Delivered',
    icon: PackageCheck,
    color: 'emerald',
    description: 'Complete',
  },
];

export const STATUS_COLORS = {
  pending: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    border: 'border-yellow-300',
    accent: 'bg-yellow-500',
  },
  confirmed: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
    accent: 'bg-blue-500',
  },
  processing: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    border: 'border-blue-300',
    accent: 'bg-blue-500',
  },
  printing: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-300',
    accent: 'bg-purple-500',
  },
  quality_check: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    border: 'border-indigo-300',
    accent: 'bg-indigo-500',
  },
  shipped: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    accent: 'bg-emerald-500',
  },
  delivered: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    border: 'border-emerald-300',
    accent: 'bg-emerald-500',
  },
  cancelled: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    accent: 'bg-gray-500',
  },
  refunded: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300',
    accent: 'bg-gray-500',
  },
};

/**
 * Get the next status in the pipeline
 * @param {string} currentStatus - Current order status
 * @returns {string|null} Next status or null if at end
 */
export function getNextStatus(currentStatus) {
  const pipelineIds = ORDER_PIPELINE.map((s) => s.id);
  const currentIndex = pipelineIds.indexOf(currentStatus);
  if (currentIndex === -1 || currentIndex >= pipelineIds.length - 1) return null;
  return pipelineIds[currentIndex + 1];
}

/**
 * Get the previous status in the pipeline
 * @param {string} currentStatus - Current order status
 * @returns {string|null} Previous status or null if at start
 */
export function getPreviousStatus(currentStatus) {
  const pipelineIds = ORDER_PIPELINE.map((s) => s.id);
  const currentIndex = pipelineIds.indexOf(currentStatus);
  if (currentIndex <= 0) return null;
  return pipelineIds[currentIndex - 1];
}

/**
 * Get status configuration by ID
 * @param {string} statusId - Status ID
 * @returns {Object|undefined} Status configuration
 */
export function getStatusById(statusId) {
  return ORDER_STATUSES.find((s) => s.id === statusId);
}
