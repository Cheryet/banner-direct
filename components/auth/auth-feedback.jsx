'use client';

import * as React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * AuthFeedback - Accessible feedback component for auth flows
 * Handles error, success, and info states with aria-live for screen readers
 *
 * UX Rules from architecture doc:
 * - Never blame the user
 * - Always explain next steps
 * - Avoid technical jargon
 * - No raw Supabase error messages
 */

const VARIANTS = {
  error: {
    icon: AlertCircle,
    containerClass: 'bg-red-50 border-red-100 text-red-800',
    iconClass: 'text-red-500',
  },
  success: {
    icon: CheckCircle,
    containerClass: 'bg-emerald-50 border-emerald-100 text-emerald-800',
    iconClass: 'text-emerald-500',
  },
  info: {
    icon: Info,
    containerClass: 'bg-blue-50 border-blue-100 text-blue-800',
    iconClass: 'text-blue-500',
  },
  warning: {
    icon: AlertCircle,
    containerClass: 'bg-amber-50 border-amber-100 text-amber-800',
    iconClass: 'text-amber-500',
  },
};

/**
 * Maps Supabase error codes to user-friendly messages
 * Following the copy examples from auth-architecture.md
 */
const ERROR_MESSAGES = {
  'Invalid login credentials': "That email or password doesn't look right.",
  'Email not confirmed': 'Please confirm your email to finish signing in.',
  'User already registered': 'An account with this email already exists.',
  'Password should be at least 6 characters': 'Please use a password with at least 8 characters.',
  'Email rate limit exceeded': "You've tried too many times. Please try again in a moment.",
  'For security purposes, you can only request this once every 60 seconds':
    'Please wait a moment before trying again.',
  'User not found': "We couldn't find an account with that email.",
  'Invalid email': 'Please enter a valid email address.',
  'Signup disabled': 'Account creation is temporarily unavailable.',
  'Email link is invalid or has expired': 'This link has expired. Please request a new one.',
};

/**
 * Transforms raw error messages to user-friendly copy
 */
function getFriendlyMessage(message) {
  if (!message) return null;

  // Check for exact matches first
  if (ERROR_MESSAGES[message]) {
    return ERROR_MESSAGES[message];
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Default fallback - generic but friendly
  return 'Something went wrong. Please try again.';
}

function AuthFeedback({
  variant = 'info',
  message,
  title,
  onDismiss,
  dismissible = false,
  className,
  children,
}) {
  const config = VARIANTS[variant] || VARIANTS.info;
  const Icon = config.icon;

  // Transform error messages to friendly copy
  const displayMessage = variant === 'error' ? getFriendlyMessage(message) : message;

  if (!displayMessage && !children) return null;

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={cn('relative flex gap-3 rounded-lg border p-4', config.containerClass, className)}
    >
      <Icon className={cn('h-5 w-5 shrink-0', config.iconClass)} aria-hidden="true" />
      <div className="flex-1 space-y-1">
        {title && <p className="font-medium">{title}</p>}
        {displayMessage && <p className="text-sm">{displayMessage}</p>}
        {children}
      </div>
      {dismissible && onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-2 top-2 rounded-md p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export { AuthFeedback, getFriendlyMessage };
