import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';
import { Web3ErrorBoundary } from './Web3ErrorBoundary';
import { RouteErrorBoundary } from './RouteErrorBoundary';

/**
 * Test component for Error Boundaries
 * 
 * This component is designed to help test and verify that error boundaries
 * are working correctly. It includes buttons to trigger different types of errors.
 * 
 * Usage: Add this component to any page in development mode to test error boundaries.
 * 
 * @example
 * ```tsx
 * {process.env.NODE_ENV === 'development' && <ErrorBoundaryTest />}
 * ```
 */
export function ErrorBoundaryTest() {
  const [showTests, setShowTests] = useState(false);

  // Component that throws an error during render
  const BrokenComponent = () => {
    throw new Error('This is a test error from BrokenComponent');
    // This will never render
    return <div>This won't render</div>;
  };

  // Web3 component that throws an error
  const BrokenWeb3Component = () => {
    throw new Error('This is a test Web3 error');
    return <div>Web3 component</div>;
  };

  // Route component that throws an error
  const BrokenRouteComponent = () => {
    throw new Error('This is a test route error');
    return <div>Route component</div>;
  };

  if (!showTests) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setShowTests(true)}
          className="px-4 py-2 bg-purple-500 text-white rounded shadow-lg hover:bg-purple-600"
        >
          🧪 Test Error Boundaries
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Error Boundary Test Suite</h2>
          <button
            onClick={() => setShowTests(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Use these test buttons to verify that error boundaries are working correctly.
          Each test will trigger a different type of error to test different boundary levels.
        </p>

        <div className="space-y-4">
          {/* Test 1: Component Level Error */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Test 1: Component Level Error</h3>
            <p className="text-sm text-gray-600 mb-3">
              Tests the base ErrorBoundary at component level
            </p>
            <ErrorBoundary level="component" title="Component Test Error">
              <BrokenComponent />
            </ErrorBoundary>
          </div>

          {/* Test 2: Web3 Error */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Test 2: Web3 Error</h3>
            <p className="text-sm text-gray-600 mb-3">
              Tests the Web3ErrorBoundary with blockchain-specific error handling
            </p>
            <Web3ErrorBoundary>
              <BrokenWeb3Component />
            </Web3ErrorBoundary>
          </div>

          {/* Test 3: Route Error */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Test 3: Route Error</h3>
            <p className="text-sm text-gray-600 mb-3">
              Tests the RouteErrorBoundary with navigation-specific error handling
            </p>
            <RouteErrorBoundary routeName="test route">
              <BrokenRouteComponent />
            </RouteErrorBoundary>
          </div>

          {/* Test 4: Page Level Error */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Test 4: Page Level Error</h3>
            <p className="text-sm text-gray-600 mb-3">
              Tests error boundary at page level (largest scope)
            </p>
            <ErrorBoundary level="page" title="Page Test Error">
              <div className="p-4 bg-gray-100 rounded">
                <p className="mb-2">This is a container for page-level error testing.</p>
                <ErrorBoundary level="component">
                  <BrokenComponent />
                </ErrorBoundary>
              </div>
            </ErrorBoundary>
          </div>

          {/* Test 5: Section Level Error */}
          <div className="border rounded p-4">
            <h3 className="font-semibold mb-2">Test 5: Section Level Error</h3>
            <p className="text-sm text-gray-600 mb-3">
              Tests error boundary at section level (smallest scope)
            </p>
            <div className="p-4 bg-gray-50 rounded">
              <ErrorBoundary level="section" title="Section Test Error">
                <BrokenComponent />
              </ErrorBoundary>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h4 className="font-semibold mb-2">Expected Behavior:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Each test should show an error boundary fallback UI</li>
            <li>• Different error levels should have different colored backgrounds</li>
            <li>• Try Again button should reset the error boundary</li>
            <li>• Reload Page button should refresh the entire page</li>
            <li>• Error details should be visible (expandable in development)</li>
          </ul>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setShowTests(false)}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close Test Suite
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundaryTest;