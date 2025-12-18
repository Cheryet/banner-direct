/**
 * Production-ready logging utility
 * 
 * In development: Logs to console
 * In production: Can be extended to send to monitoring services
 * (e.g., Sentry, LogRocket, Datadog, etc.)
 */

const isDev = process.env.NODE_ENV === 'development';

/**
 * Log levels for categorizing messages
 */
const LogLevel = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

/**
 * Format log message with timestamp and context
 */
function formatMessage(level, message, context = {}) {
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    level,
    message,
    ...context,
  };
}

/**
 * Send log to monitoring service (extend for production)
 * This is where you'd integrate Sentry, LogRocket, etc.
 */
function sendToMonitoring(logData) {
  // TODO: Integrate with monitoring service
  // Example for Sentry:
  // if (typeof Sentry !== 'undefined' && logData.level === 'error') {
  //   Sentry.captureException(new Error(logData.message), {
  //     extra: logData,
  //   });
  // }
}

/**
 * Core logging function
 */
function log(level, message, context = {}) {
  const logData = formatMessage(level, message, context);

  // Always log errors, only log debug in development
  if (level === LogLevel.DEBUG && !isDev) {
    return;
  }

  // Console output
  switch (level) {
    case LogLevel.ERROR:
      console.error(`[${logData.timestamp}] ERROR:`, message, context);
      break;
    case LogLevel.WARN:
      console.warn(`[${logData.timestamp}] WARN:`, message, context);
      break;
    case LogLevel.INFO:
      console.info(`[${logData.timestamp}] INFO:`, message, context);
      break;
    case LogLevel.DEBUG:
      console.debug(`[${logData.timestamp}] DEBUG:`, message, context);
      break;
  }

  // Send to monitoring in production
  if (!isDev && (level === LogLevel.ERROR || level === LogLevel.WARN)) {
    sendToMonitoring(logData);
  }
}

/**
 * Public logging API
 */
export const logger = {
  debug: (message, context) => log(LogLevel.DEBUG, message, context),
  info: (message, context) => log(LogLevel.INFO, message, context),
  warn: (message, context) => log(LogLevel.WARN, message, context),
  error: (message, context) => log(LogLevel.ERROR, message, context),
};

/**
 * Log API errors with request context
 */
export function logApiError(error, request = {}) {
  logger.error('API Error', {
    error: error.message || String(error),
    stack: error.stack,
    url: request.url,
    method: request.method,
  });
}

/**
 * Log Supabase errors with query context
 */
export function logSupabaseError(error, operation = '') {
  logger.error('Supabase Error', {
    error: error.message || String(error),
    code: error.code,
    details: error.details,
    hint: error.hint,
    operation,
  });
}

/**
 * Log client-side errors (for error boundaries)
 */
export function logClientError(error, errorInfo = {}) {
  logger.error('Client Error', {
    error: error.message || String(error),
    stack: error.stack,
    componentStack: errorInfo.componentStack,
  });
}
