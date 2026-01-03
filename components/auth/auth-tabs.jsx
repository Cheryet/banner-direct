'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

/**
 * AuthTabs - Accessible tab navigation for auth methods
 * Built on Radix UI Tabs for keyboard navigation and accessibility
 */
const AuthTabs = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Root ref={ref} className={cn('w-full', className)} {...props} />
));
AuthTabs.displayName = 'AuthTabs';

/**
 * AuthTabsList - Container for tab triggers
 */
const AuthTabsList = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('mb-6 flex rounded-lg border border-gray-200 bg-gray-50 p-1', className)}
    {...props}
  />
));
AuthTabsList.displayName = 'AuthTabsList';

/**
 * AuthTabsTrigger - Individual tab button
 */
const AuthTabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
      'text-gray-600 hover:text-gray-900',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
));
AuthTabsTrigger.displayName = 'AuthTabsTrigger';

/**
 * AuthTabsContent - Content panel for each tab
 */
const AuthTabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));
AuthTabsContent.displayName = 'AuthTabsContent';

export { AuthTabs, AuthTabsList, AuthTabsTrigger, AuthTabsContent };
