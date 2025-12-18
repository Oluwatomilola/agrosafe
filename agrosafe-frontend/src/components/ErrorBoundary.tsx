import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'component' | 'section';
  title?: string;
  description?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Base Error Boundary component for React applications
 * 
 * This component catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * Features:
 * - Catches rendering errors in child components
 * - Provides customizable fallback UI based on error level
 * - Supports custom error handling via onError callback
 * - Logs errors to console for debugging
 * - Different UI variants for different error contexts
 * 
 * @param props - Component props
 * @param props.children - Child components to wrap with error boundary
 * @param props.fallback - Custom fallback UI to display on error
 * @param props.onError - Callback function to handle errors
 * @param props.level - Error level for appropriate styling ('page', 'component', 'section')
 * @param props.title - Custom title for the error display
 * @param props.description - Custom description for the error display
 * @returns Error boundary component or children if no error
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console and any error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private getDefaultFallback() {
    const { level = 'component', title, description } = this.props;
    const { error } = this.state;

    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const baseClasses = "flex flex-col items-center justify-center p-6 rounded-lg border";
    const levelClasses = {
      page: "min-h-[400px] bg-red-50 border-red-200 text-center",
      component: "min-h-[200px] bg-orange-50 border-orange-200",
      section: "min-h-[100px] bg-yellow-50 border-yellow-200"
    };

    const titleMap = {
      page: "Oops! Something went wrong",
      component: "Component Error",
      section: "Section Error"
    };

    return (
      <div className={`${baseClasses} ${levelClasses[level]}`}>
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            {title || titleMap[level]}
          </h2>
          <p className="text-gray-600 mb-4">
            {description || "An unexpected error occurred. Please try again."}
          </p>
          
          {error && (
            <details className="text-left mb-4">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error Details
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs font-mono text-gray-700 overflow-auto">
                <div className="font-semibold mb-1">Error: {error.message}</div>
                {error.stack && isDevelopment && (
                  <pre className="whitespace-pre-wrap">{error.stack}</pre>
                )}
              </div>
            </details>
          )}
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  public render() {
    if (this.state.hasError) {
      // Return custom fallback UI or default fallback
      return this.props.fallback || this.getDefaultFallback();
    }

    return this.props.children;
  }
}