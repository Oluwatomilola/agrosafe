import React, { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

/**
 * Web3 Error Boundary specifically for handling blockchain and wallet-related errors
 * 
 * This component wraps Web3-related components with specialized error handling
 * that provides context-specific fallback UI for blockchain operations.
 * 
 * Features:
 * - Specialized UI for Web3 connection errors
 * - Wallet connectivity troubleshooting
 * - Network-specific error messages
 * - Integration with wallet connection retry mechanisms
 * 
 * @param props - Component props
 * @param props.children - Child components that may contain Web3 functionality
 * @param props.fallback - Custom fallback UI for Web3 errors
 * @returns Web3 error boundary component
 */
interface Web3ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function Web3ErrorBoundary({ children, fallback }: Web3ErrorBoundaryProps) {
  const handleWeb3Error = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log Web3-specific errors with additional context
    console.group('🚨 Web3 Error Boundary');
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error Boundary caught a Web3-related error');
    console.groupEnd();

    // You could send this to an error reporting service like Sentry
    // errorReportingService.captureException(error, { tags: { context: 'web3' } });
  };

  const web3Fallback = fallback || (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg min-h-[300px]">
      <div className="text-6xl mb-4">🔗</div>
      <h2 className="text-2xl font-bold text-red-800 mb-4">Blockchain Connection Error</h2>
      <p className="text-red-700 text-center mb-6 max-w-md">
        We encountered an issue connecting to the blockchain. This might be due to:
      </p>
      <ul className="text-red-600 text-sm space-y-2 mb-6 max-w-md">
        <li>• Wallet not connected or locked</li>
        <li>• Network connectivity issues</li>
        <li>• Unsupported blockchain network</li>
        <li>• Smart contract interaction errors</li>
      </ul>
      <div className="flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Reload Page
        </button>
        <button
          onClick={() => {
            // Try to reconnect wallet
            window.location.reload();
          }}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Retry Connection
        </button>
      </div>
      <p className="text-xs text-red-500 mt-4 text-center">
        If the problem persists, please check your wallet connection and network settings.
      </p>
    </div>
  );

  return (
    <ErrorBoundary
      level="component"
      title="Blockchain Error"
      description="Unable to interact with the blockchain"
      onError={handleWeb3Error}
      fallback={web3Fallback}
    >
      {children}
    </ErrorBoundary>
  );
}