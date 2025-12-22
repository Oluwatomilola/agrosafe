# Error Boundaries Implementation

This document describes the comprehensive error boundary implementation for the AgroSafe frontend application.

## Overview

Error boundaries are React components that catch JavaScript errors anywhere in the child component tree, log those errors, and display a fallback UI instead of the component tree that crashed. This implementation provides multiple layers of error handling to ensure better user experience and easier debugging.

## Components

### 1. Base ErrorBoundary (`ErrorBoundary.tsx`)

The foundational error boundary component that can be used anywhere in the application.

**Features:**
- Catches rendering errors in child components
- Provides customizable fallback UI based on error level
- Supports custom error handling via onError callback
- Different UI variants for different error contexts (page, component, section)
- Retry functionality and error details in development mode

**Usage:**
```tsx
<ErrorBoundary 
  level="component" 
  title="Custom Error Title"
  description="Custom error description"
  onError={(error, errorInfo) => {
    // Custom error handling
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### 2. Web3ErrorBoundary (`Web3ErrorBoundary.tsx`)

Specialized error boundary for blockchain and wallet-related errors.

**Features:**
- Specialized UI for Web3 connection errors
- Wallet connectivity troubleshooting
- Network-specific error messages
- Integration with wallet connection retry mechanisms

**Usage:**
```tsx
<Web3ErrorBoundary>
  <YourWeb3Component />
</Web3ErrorBoundary>
```

### 3. RouteErrorBoundary (`RouteErrorBoundary.tsx`)

Error boundary for handling page-level routing and navigation errors.

**Features:**
- Specialized UI for routing and navigation errors
- Page-level error recovery
- Navigation state preservation
- User-friendly error messages for routing issues

**Usage:**
```tsx
<RouteErrorBoundary routeName="dashboard">
  <Dashboard />
</RouteErrorBoundary>
```

## Implementation Architecture

### Application Level (App.tsx)

```tsx
<ErrorBoundary level="page">
  <div className="min-h-screen bg-slate-50">
    <ErrorBoundary level="component">
      <Navbar />
    </ErrorBoundary>
    <main className="p-6">
      {renderCurrentPage()}
    </main>
  </div>
</ErrorBoundary>
```

### Web3 Provider Level (Web3Provider.tsx)

```tsx
<Web3ErrorBoundary>
  <WagmiConfig config={config}>
    {children}
  </WagmiConfig>
</Web3ErrorBoundary>
```

### Component Level (Navbar.tsx)

```tsx
<ErrorBoundary level="section">
  <nav>
    {/* Navigation buttons */}
  </nav>
</ErrorBoundary>

<ErrorBoundary level="component">
  <WalletConnect />
</ErrorBoundary>
```

### Page Level (Each Page)

Each page component is wrapped with `RouteErrorBoundary`:

```tsx
<RouteErrorBoundary routeName="dashboard">
  <Dashboard />
</RouteErrorBoundary>
```

## Error Levels

### Page Level (`level="page"`)
- **Purpose**: Catches errors that affect entire pages
- **UI**: Full-page error display with navigation options
- **Color Scheme**: Red (critical errors)
- **Min Height**: 400px

### Component Level (`level="component"`)
- **Purpose**: Catches errors in individual components
- **UI**: Component-sized error display
- **Color Scheme**: Orange (warning errors)
- **Min Height**: 200px

### Section Level (`level="section"`)
- **Purpose**: Catches errors in small sections/parts of components
- **UI**: Small section error display
- **Color Scheme**: Yellow (minor errors)
- **Min Height**: 100px

## Fallback UI Features

### Standard Fallback Components
- **Error Icon**: Visual indicator (⚠️)
- **Title**: Context-appropriate error title
- **Description**: User-friendly error explanation
- **Error Details**: Collapsible section with technical details (development only)
- **Action Buttons**: 
  - "Try Again" - Resets the error boundary state
  - "Reload Page" - Full page refresh

### Web3-Specific Fallback Features
- **Blockchain Icon**: 🔗
- **Web3 Context**: Specific messaging for blockchain errors
- **Wallet Troubleshooting**: Lists common wallet connection issues
- **Network Context**: Mentions network-specific problems

### Route-Specific Fallback Features
- **Navigation Icon**: 🗺️
- **Route Context**: Shows which page failed to load
- **Navigation Actions**: 
  - "Go Back" - Browser back navigation
  - "Reload Page" - Current page refresh
  - "Go Home" - Navigate to dashboard

## Error Logging

### Built-in Error Logging (`errorLogging.ts`)

A comprehensive error logging system that provides:

#### Features
- Structured error logging with context
- Error categorization (web3, routing, component, network, user, unknown)
- Multiple severity levels (error, warning, info)
- Local storage persistence
- Analytics integration hooks
- Development debugging utilities

#### Usage
```tsx
import { logError, logWeb3Error, logRoutingError } from '../utils/errorLogging';

// General error logging
logError('component', 'Component failed to render', error, { componentName: 'MyComponent' });

// Web3-specific error logging
logWeb3Error('Failed to connect wallet', error, { walletType: 'MetaMask' });

// Routing error logging
logRoutingError('Failed to load dashboard', error, { route: 'dashboard' });
```

#### Development Utilities
In development mode, access the error logger via:
```tsx
window.agrosafeErrorLogger.getRecentErrors()
window.agrosafeErrorLogger.getErrorStats()
window.agrosafeErrorLogger.clearErrors()
```

## Testing Error Boundaries

### Manual Testing
1. **Component Errors**: Temporarily add `throw new Error('Test error')` to any component
2. **Web3 Errors**: Disconnect wallet or use invalid network
3. **Route Errors**: Modify page components to throw errors
4. **Navigation Errors**: Test with invalid route parameters

### Error Boundary Testing Component
```tsx
// Test component that always throws an error
export function ErrorTest() {
  throw new Error('This is a test error for error boundary');
}

// Usage in development
{process.env.NODE_ENV === 'development' && <ErrorTest />}
```

## Best Practices

### 1. Strategic Placement
- Wrap critical components that are likely to fail
- Use appropriate error levels for context
- Don't wrap every single component (overhead)

### 2. User Experience
- Provide meaningful error messages
- Offer actionable recovery options
- Log errors for debugging without exposing to users

### 3. Development vs Production
- Show detailed error information in development
- Provide user-friendly messages in production
- Use appropriate error reporting services in production

### 4. Error Recovery
- Implement retry mechanisms where appropriate
- Preserve user state when possible
- Provide fallback functionality

## Configuration

### Environment Variables
```env
# Development
NODE_ENV=development

# Production (example for error reporting)
VITE_ERROR_REPORTING_ENDPOINT=https://your-error-service.com/api/errors
VITE_ENABLE_ERROR_ANALYTICS=true
```

### Custom Error Reporting
Integrate with external error reporting services by modifying the error logging utility:

```tsx
// In errorLogging.ts
private async reportToService(entry: ErrorLogEntry) {
  if (!this.config.errorReportingEndpoint) return;

  try {
    await fetch(this.config.errorReportingEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yourApiKey}`,
      },
      body: JSON.stringify(entry),
    });
  } catch (err) {
    console.warn('Failed to report error to external service:', err);
  }
}
```

## Monitoring and Analytics

### Error Metrics to Track
- Error frequency by component
- Error types (Web3, routing, component)
- Recovery success rates
- User impact (session abandonment)

### Integration Points
- Google Analytics exception tracking
- Custom analytics events
- Error reporting services (Sentry, Bugsnag, etc.)
- Performance monitoring tools

## Future Enhancements

### Planned Improvements
1. **Error Recovery Patterns**: Implement more sophisticated recovery mechanisms
2. **Error Context Preservation**: Better state preservation during error recovery
3. **User Feedback Integration**: Allow users to report errors directly
4. **A/B Testing**: Test different fallback UI approaches
5. **Performance Monitoring**: Track error boundary performance impact

### Advanced Features
1. **Error Boundary Composition**: Combine multiple error boundaries
2. **Conditional Error Handling**: Different handling based on error type
3. **Error Boundary Analytics**: Detailed usage analytics
4. **Automatic Error Reporting**: Seamless integration with monitoring services

## Troubleshooting

### Common Issues

#### Error Boundary Not Catching Errors
- Ensure the error occurs during rendering, not in event handlers
- Check that the component is properly wrapped
- Verify error boundaries are at the right level in the component tree

#### TypeScript Errors
- Ensure proper type imports and declarations
- Check for strict mode compatibility issues
- Verify React and TypeScript version compatibility

#### Performance Impact
- Error boundaries add minimal overhead
- Avoid wrapping too many components
- Use appropriate error levels

### Debug Mode
Enable detailed error logging in development:
```tsx
// In development, errors will include full stack traces
// Check browser console for detailed error information
```

## Conclusion

This error boundary implementation provides a robust foundation for error handling in the AgroSafe application. It balances user experience, developer experience, and production monitoring needs while providing flexibility for future enhancements.

The multi-layered approach ensures that errors are caught at the appropriate level with context-specific handling, while the comprehensive logging system aids in debugging and monitoring application health.