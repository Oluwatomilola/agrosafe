import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

/**
 * Route Error Boundary for handling page-level routing and navigation errors
 * 
 * This component wraps page components with specialized error handling
 * for routing issues, navigation problems, and page rendering errors.
 * 
 * Features:
 * - Specialized UI for routing and navigation errors
 * - Page-level error recovery
 * - Navigation state preservation
 * - User-friendly error messages for routing issues
 * 
 * @param props - Component props
 * @param props.children - Child page components
 * @param props.fallback - Custom fallback UI for route errors
 * @returns Route error boundary component
 */
interface RouteErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  routeName?: string;
}

export function RouteErrorBoundary({ children, fallback, routeName = 'page' }: RouteErrorBoundaryProps) {
  const handleRouteError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log route-specific errors with navigation context
    console.group('🧭 Route Error Boundary');
    console.error('Route:', routeName);
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Boundary caught a routing/navigation error');
    console.groupEnd();

    // Track route errors for analytics
    // analytics.track('route_error', { route: routeName, error: error.message });

    // You could send this to an error reporting service
    // errorReportingService.captureException(error, { 
    //   tags: { context: 'routing', route: routeName } 
    // });
  };

  const routeFallback = fallback || (
    <div className="flex flex-col items-center justify-center p-8 bg-orange-50 border border-orange-200 rounded-lg min-h-[400px]">
      <div className="text-6xl mb-4">🗺️</div>
      <h2 className="text-2xl font-bold text-orange-800 mb-4">Navigation Error</h2>
      <p className="text-orange-700 text-center mb-6 max-w-md">
        We encountered an issue loading the <strong>{routeName}</strong> page. This could be due to:
      </p>
      <ul className="text-orange-600 text-sm space-y-2 mb-6 max-w-md">
        <li>• Missing or invalid page data</li>
        <li>• Network connectivity issues</li>
        <li>• Invalid page parameters</li>
        <li>• Component rendering errors</li>
      </ul>
      <div className="flex gap-3">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          Go Back
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Reload Page
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Go Home
        </button>
      </div>
      <p className="text-xs text-orange-500 mt-4 text-center">
        If the problem persists, please try navigating to a different page or contact support.
      </p>
    </div>
  );

  return (
    <ErrorBoundary
      level="page"
      title={`${routeName.charAt(0).toUpperCase() + routeName.slice(1)} Page Error`}
      description={`Unable to load the ${routeName} page`}
      onError={handleRouteError}
      fallback={routeFallback}
    >
      {children}
    </ErrorBoundary>
  );
}