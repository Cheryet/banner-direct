'use client';

import { ORDER_PIPELINE, STATUS_COLORS } from '@/lib/constants/orders';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, ArrowRight, Loader2, XCircle } from 'lucide-react';

/**
 * Visual order pipeline progress tracker
 * Shows all stages with current status highlighted
 * Client component - handles onClick interactions
 */
export function OrderPipeline({ currentStatus, onStatusChange }) {
  const currentIndex = ORDER_PIPELINE.findIndex((s) => s.id === currentStatus);

  return (
    <div className="relative">
      <div className="flex items-center justify-between" style={{ minWidth: '500px' }}>
        {ORDER_PIPELINE.map((stage, index) => {
          const Icon = stage.icon;
          const isComplete = index < currentIndex;
          const isCurrent = index === currentIndex;
          const colors = STATUS_COLORS[stage.id];

          return (
            <div key={stage.id} className="flex flex-1 items-center">
              <button
                onClick={() => onStatusChange(stage.id)}
                className={`relative z-10 flex flex-col items-center ${isCurrent || isComplete ? 'cursor-pointer' : 'cursor-pointer opacity-60 hover:opacity-100'}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all sm:h-10 sm:w-10 ${
                    isComplete
                      ? `${colors.accent} border-transparent text-white`
                      : isCurrent
                        ? `${colors.bg} ${colors.border} ${colors.text}`
                        : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </div>
                <span
                  className={`mt-1 text-xs font-medium sm:mt-2 ${isCurrent ? colors.text : isComplete ? 'text-gray-700' : 'text-gray-400'}`}
                >
                  {stage.label}
                </span>
              </button>
              {index < ORDER_PIPELINE.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 sm:mx-2 ${index < currentIndex ? 'bg-emerald-500' : 'bg-gray-200'}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Quick action buttons for order status changes
 * Shows next/previous status buttons and cancel option
 * Client component - handles onClick interactions
 */
export function OrderQuickActions({ status, onAction, isLoading }) {
  const currentIndex = ORDER_PIPELINE.findIndex((s) => s.id === status);
  const nextStage =
    currentIndex < ORDER_PIPELINE.length - 1 ? ORDER_PIPELINE[currentIndex + 1] : null;
  const prevStage = currentIndex > 0 ? ORDER_PIPELINE[currentIndex - 1] : null;

  return (
    <div className="flex flex-wrap gap-2">
      {prevStage && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction(prevStage.id)}
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Back to {prevStage.label}</span>
        </Button>
      )}
      {nextStage && (
        <Button
          size="sm"
          onClick={() => onAction(nextStage.id)}
          disabled={isLoading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin sm:mr-1" />
          ) : (
            <ArrowRight className="h-4 w-4 sm:mr-1" />
          )}
          <span className="hidden sm:inline">Move to</span> {nextStage.label}
        </Button>
      )}
      {status !== 'cancelled' && status !== 'delivered' && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAction('cancelled')}
          disabled={isLoading}
          className="text-red-600 hover:bg-red-50"
        >
          <XCircle className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Cancel</span>
        </Button>
      )}
    </div>
  );
}
