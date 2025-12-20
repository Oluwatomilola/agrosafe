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
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private getDefaultFallback() {
    const level = this.props.level || 'component';
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
      <div className={`${baseClasses} ${levelClasses[level as keyof typeof levelClasses]}`}>
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            {this.props.title || titleMap[level as keyof typeof titleMap]}
          </h2>
          <p className="text-gray-600 mb-4">
            {this.props.description || "An unexpected error occurred. Please try again."}
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
      return this.props.fallback || this.getDefaultFallback();
    }

    return this.props.children;
  }
}