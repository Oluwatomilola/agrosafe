/**
 * Error Logging and Reporting Utility for AgroSafe Application
 * 
 * This module provides comprehensive error tracking, logging, and reporting
 * functionality to help developers identify and resolve issues in production.
 * 
 * Features:
 * - Structured error logging with context
 * - Error categorization and severity levels
 * - Integration with error boundaries
 * - Local storage for error persistence
 * - Error analytics and reporting hooks
 * 
 * @fileoverview Error logging utilities for React components
 */

export interface ErrorLogEntry {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info';
  category: 'web3' | 'routing' | 'component' | 'network' | 'user' | 'unknown';
  message: string;
  stack?: string;
  componentStack?: string;
  context?: Record<string, any>;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
}

export interface ErrorReportingConfig {
  enableConsoleLogging: boolean;
  enableLocalStorage: boolean;
  maxStoredErrors: number;
  enableAnalytics: boolean;
  errorReportingEndpoint?: string;
}

class ErrorLogger {
  private config: ErrorReportingConfig;
  private sessionId: string;

  constructor(config: Partial<ErrorReportingConfig> = {}) {
    this.config = {
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      enableLocalStorage: true,
      maxStoredErrors: 50,
      enableAnalytics: process.env.NODE_ENV === 'production',
      ...config
    };
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log an error with structured information
   */
  public log(
    level: ErrorLogEntry['level'],
    category: ErrorLogEntry['category'],
    message: string,
    error?: Error,
    context?: Record<string, any>
  ): ErrorLogEntry {
    const errorEntry: ErrorLogEntry = {
      id: this.generateErrorId(),
      timestamp: new Date(),
      level,
      category,
      message,
      stack: error?.stack,
      context,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      sessionId: this.sessionId
    };

    // Console logging
    if (this.config.enableConsoleLogging) {
      this.logToConsole(errorEntry, error);
    }

    // Local storage persistence
    if (this.config.enableLocalStorage) {
      this.persistError(errorEntry);
    }

    // Analytics integration
    if (this.config.enableAnalytics) {
      this.reportToAnalytics(errorEntry);
    }

    // External error reporting service
    if (this.config.errorReportingEndpoint) {
      this.reportToService(errorEntry);
    }

    return errorEntry;
  }

  /**
   * Convenience methods for different log levels
   */
  public error(category: ErrorLogEntry['category'], message: string, error?: Error, context?: Record<string, any>) {
    return this.log('error', category, message, error, context);
  }

  public warning(category: ErrorLogEntry['category'], message: string, context?: Record<string, any>) {
    return this.log('warning', category, message, undefined, context);
  }

  public info(category: ErrorLogEntry['category'], message: string, context?: Record<string, any>) {
    return this.log('info', category, message, undefined, context);
  }

  /**
   * Log Web3-specific errors
   */
  public logWeb3Error(message: string, error?: Error, context?: Record<string, any>) {
    return this.error('web3', message, error, {
      ...context,
      walletConnection: context?.walletConnection || 'unknown',
      networkId: context?.networkId || 'unknown',
      blockchainAction: context?.blockchainAction || 'unknown'
    });
  }

  /**
   * Log routing/navigation errors
   */
  public logRoutingError(message: string, error?: Error, context?: Record<string, any>) {
    return this.error('routing', message, error, {
      ...context,
      currentRoute: context?.currentRoute || 'unknown',
      targetRoute: context?.targetRoute || 'unknown',
      navigationMethod: context?.navigationMethod || 'unknown'
    });
  }

  /**
   * Log component errors
   */
  public logComponentError(componentName: string, message: string, error?: Error, context?: Record<string, any>) {
    return this.error('component', `${componentName}: ${message}`, error, {
      ...context,
      componentName,
      componentStack: error?.stack
    });
  }

  private logToConsole(entry: ErrorLogEntry, error?: Error) {
    const logMessage = `[${entry.level.toUpperCase()}] [${entry.category.toUpperCase()}] ${entry.message}`;
    
    switch (entry.level) {
      case 'error':
        console.error(logMessage, { entry, error });
        break;
      case 'warning':
        console.warn(logMessage, { entry });
        break;
      case 'info':
        console.info(logMessage, { entry });
        break;
    }
  }

  private persistError(entry: ErrorLogEntry) {
    try {
      const existingErrors = this.getStoredErrors();
      const updatedErrors = [entry, ...existingErrors].slice(0, this.config.maxStoredErrors);
      localStorage.setItem('agrosafe_error_log', JSON.stringify(updatedErrors));
    } catch (err) {
      console.warn('Failed to persist error to localStorage:', err);
    }
  }

  private getStoredErrors(): ErrorLogEntry[] {
    try {
      const stored = localStorage.getItem('agrosafe_error_log');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private reportToAnalytics(entry: ErrorLogEntry) {
    // Example: Send to Google Analytics, Mixpanel, etc.
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: `${entry.category}: ${entry.message}`,
        fatal: entry.level === 'error',
        custom_map: {
          error_category: entry.category,
          error_id: entry.id
        }
      });
    }

    // Example: Custom analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('error', {
        errorId: entry.id,
        category: entry.category,
        level: entry.level,
        message: entry.message,
        url: entry.url,
        userAgent: entry.userAgent
      });
    }
  }

  private async reportToService(entry: ErrorLogEntry) {
    if (!this.config.errorReportingEndpoint) return;

    try {
      await fetch(this.config.errorReportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (err) {
      console.warn('Failed to report error to external service:', err);
    }
  }

  /**
   * Get recent errors for debugging
   */
  public getRecentErrors(limit = 10): ErrorLogEntry[] {
    return this.getStoredErrors().slice(0, limit);
  }

  /**
   * Clear stored errors
   */
  public clearStoredErrors(): void {
    try {
      localStorage.removeItem('agrosafe_error_log');
    } catch (err) {
      console.warn('Failed to clear stored errors:', err);
    }
  }

  /**
   * Get error statistics
   */
  public getErrorStats() {
    const errors = this.getStoredErrors();
    const stats = {
      total: errors.length,
      byLevel: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      recentErrors: errors.slice(0, 5)
    };

    errors.forEach(error => {
      stats.byLevel[error.level] = (stats.byLevel[error.level] || 0) + 1;
      stats.byCategory[error.category] = (stats.byCategory[error.category] || 0) + 1;
    });

    return stats;
  }
}

// Create singleton instance
export const errorLogger = new ErrorLogger();

// Convenience functions for easy importing
export const logError = (category: ErrorLogEntry['category'], message: string, error?: Error, context?: Record<string, any>) =>
  errorLogger.error(category, message, error, context);

export const logWarning = (category: ErrorLogEntry['category'], message: string, context?: Record<string, any>) =>
  errorLogger.warning(category, message, context);

export const logInfo = (category: ErrorLogEntry['category'], message: string, context?: Record<string, any>) =>
  errorLogger.info(category, message, context);

export const logWeb3Error = (message: string, error?: Error, context?: Record<string, any>) =>
  errorLogger.logWeb3Error(message, error, context);

export const logRoutingError = (message: string, error?: Error, context?: Record<string, any>) =>
  errorLogger.logRoutingError(message, error, context);

export const logComponentError = (componentName: string, message: string, error?: Error, context?: Record<string, any>) =>
  errorLogger.logComponentError(componentName, message, error, context);

// Development utilities
if (process.env.NODE_ENV === 'development') {
  (window as any).agrosafeErrorLogger = {
    getRecentErrors: () => errorLogger.getRecentErrors(),
    getErrorStats: () => errorLogger.getErrorStats(),
    clearErrors: () => errorLogger.clearStoredErrors(),
    logError,
    logWarning,
    logInfo
  };
}