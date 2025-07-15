import React from 'react';
import { Box, Text, Button, VStack, Code, Collapse } from '@chakra-ui/react';
import { logError } from '../utils/errorHandler';

/**
 * Error Boundary component to catch and display runtime errors
 * Prevents the entire app from crashing when an error occurs in a component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console
    logError(error, {
      componentStack: errorInfo.componentStack,
      componentName: this.props.componentName || 'Unknown component'
    });
    
    this.setState({
      errorInfo
    });
  }
  
  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };
  
  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  render() {
    if (this.state.hasError) {
      const errorFallback = this.props.fallback || (
        <Box 
          p={6} 
          bg="#111" 
          border="1px solid #333"
          borderRadius="md"
          textAlign="center"
          my={4}
          maxW="800px"
          mx="auto"
        >
          <VStack spacing={5}>
            <Text color="#ff6b6b" fontSize="xl" fontWeight="bold">
              Something went wrong
            </Text>
            
            <Text color="#ccc">
              We're sorry, but there was an error in this component. 
            </Text>
            
            <Button 
              colorScheme="red" 
              onClick={this.handleRetry}
            >
              Try Again
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={this.toggleDetails}
            >
              {this.state.showDetails ? 'Hide' : 'Show'} Technical Details
            </Button>
            
            <Collapse in={this.state.showDetails}>
              <VStack align="start" spacing={3} p={4} bg="#000" borderRadius="md" w="100%" maxH="300px" overflowY="auto">
                <Text color="#ff6b6b" fontSize="sm" fontWeight="bold">
                  Error: {this.state.error?.toString() || 'Unknown error'}
                </Text>
                
                <Text color="#666" fontSize="xs" fontWeight="bold" mt={2}>Component Stack:</Text>
                <Code 
                  colorScheme="red" 
                  whiteSpace="pre" 
                  fontSize="xs"
                  p={3} 
                  w="100%"
                  overflowX="auto"
                >
                  {this.state.errorInfo?.componentStack || 'No stack trace available'}
                </Code>
              </VStack>
            </Collapse>
          </VStack>
        </Box>
      );
      
      return errorFallback;
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap components with error boundary
 */
export const withErrorBoundary = (Component, options = {}) => {
  const WithErrorBoundary = (props) => (
    <ErrorBoundary 
      componentName={options.name || Component.displayName || Component.name} 
      fallback={options.fallback}
    >
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WithErrorBoundary.displayName = `WithErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;
  
  return WithErrorBoundary;
};

export default ErrorBoundary;