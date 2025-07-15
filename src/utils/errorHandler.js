/**
 * Centralized error handling utility
 * This utility provides consistent error handling across the application
 */

// Log error to console with additional context
export const logError = (error, context = {}) => {
  console.error(`[ERROR] ${error?.message || 'Unknown error'}`, {
    error,
    stack: error?.stack,
    ...context
  });
};

// Handle API/async errors in a consistent way
export const handleAsyncError = async (promise, context = {}) => {
  try {
    const result = await promise;
    return { data: result, error: null };
  } catch (error) {
    logError(error, context);
    return { 
      data: null, 
      error: {
        message: error?.message || 'An unexpected error occurred',
        code: error?.code || 'UNKNOWN_ERROR',
        context
      }
    };
  }
};

// Format error for display to the user
export const formatErrorForDisplay = (error) => {
  // Don't expose internal details to the user
  return {
    message: error?.message || 'Something went wrong. Please try again.',
    actionable: getActionableErrorMessage(error)
  };
};

// Get actionable message based on error type
const getActionableErrorMessage = (error) => {
  const errorCode = error?.code;
  const errorMessage = error?.message || '';
  
  // Common error types with suggested actions
  if (errorMessage.includes('network') || errorCode === 'NETWORK_ERROR') {
    return 'Please check your internet connection and try again.';
  }
  
  if (errorMessage.includes('permission') || errorCode === 'PERMISSION_DENIED') {
    return 'You don\'t have permission to perform this action.';
  }
  
  if (errorMessage.includes('not found') || errorCode === 'NOT_FOUND') {
    return 'The requested resource could not be found.';
  }
  
  if (errorMessage.includes('timeout') || errorCode === 'TIMEOUT') {
    return 'The request took too long to complete. Please try again.';
  }
  
  if (errorMessage.includes('auth') || errorCode?.includes('AUTH')) {
    return 'Please sign in again to continue.';
  }
  
  // Default actionable message
  return 'Please try again or contact support if the problem persists.';
};

// Component error boundary HOC
export const withErrorHandling = (Component, fallback) => {
  return (props) => {
    try {
      return <Component {...props} />;
    } catch (error) {
      logError(error, { component: Component.name, props });
      return fallback ? fallback(error, props) : (
        <div className="error-fallback">
          <h3>Something went wrong</h3>
          <p>{formatErrorForDisplay(error).message}</p>
        </div>
      );
    }
  };
};