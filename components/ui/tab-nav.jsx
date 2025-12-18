'use client';

import { cn } from '@/lib/utils';

/**
 * Reusable tab navigation component
 * Client component - handles tab switching
 */
export function TabNav({ tabs, activeTab, onTabChange, className }) {
  return (
    <div className={cn('flex flex-wrap gap-2 border-b', className)}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-gray-600 hover:border-gray-300'
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
