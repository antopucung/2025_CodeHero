// Component Patterns - Enforces consistent component architecture
import { designSystem } from '../system/DesignSystem';

/**
 * Standard component patterns that should be followed across the codebase
 * This ensures consistency in component structure and prevents architectural drift
 */

// Pattern 1: Functional Component with Props Destructuring
export const FUNCTIONAL_COMPONENT_PATTERN = `
function ComponentName({ prop1, prop2, ...restProps }) {
  // 1. State declarations
  const [state, setState] = useState(initialValue);
  
  // 2. Custom hooks
  const { data, loading, error } = useCustomHook();
  
  // 3. Computed values
  const computedValue = useMemo(() => {
    return computeValue(prop1, prop2);
  }, [prop1, prop2]);
  
  // 4. Event handlers
  const handleEvent = useCallback((event) => {
    // Handle event
  }, [dependencies]);
  
  // 5. Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // 6. Early returns (loading, error states)
  if (loading) return <LoadingComponent />;
  if (error) return <ErrorComponent error={error} />;
  
  // 7. Main render
  return (
    <StandardizedComponent {...restProps}>
      {/* Component content */}
    </StandardizedComponent>
  );
}
`;

// Pattern 2: Prop Types and Default Props
export const PROPS_PATTERN = {
  // Use TypeScript or PropTypes for type checking
  propTypes: `
    ComponentName.propTypes = {
      required: PropTypes.string.isRequired,
      optional: PropTypes.string,
      callback: PropTypes.func,
      children: PropTypes.node
    };
  `,
  
  // Provide sensible defaults
  defaultProps: `
    ComponentName.defaultProps = {
      optional: 'default value',
      callback: () => {}
    };
  `
};

// Pattern 3: Styling Patterns
export const STYLING_PATTERNS = {
  // Use design system variants instead of inline styles
  preferred: `
    import { Card, Stack, BodyText } from '../design/components/StandardizedComponents';
    
    function MyComponent() {
      return (
        <Card animated hover>
          <Stack>
            <BodyText>Content</BodyText>
          </Stack>
        </Card>
      );
    }
  `,
  
  // Avoid inline styling
  avoid: `
    function MyComponent() {
      return (
        <Box 
          bg="#111" 
          p="24px" 
          borderRadius="8px"
          border="1px solid #333"
        >
          <Text fontSize="16px" color="#ccc">Content</Text>
        </Box>
      );
    }
  `
};

// Pattern 4: State Management Patterns
export const STATE_PATTERNS = {
  // Use custom hooks for complex state logic
  customHook: `
    function useComponentState(initialData) {
      const [data, setData] = useState(initialData);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);
      
      const updateData = useCallback(async (newData) => {
        setLoading(true);
        try {
          const result = await api.update(newData);
          setData(result);
          setError(null);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }, []);
      
      return { data, loading, error, updateData };
    }
  `,
  
  // Keep component state simple
  componentState: `
    function Component() {
      const { data, loading, error, updateData } = useComponentState(initialData);
      
      if (loading) return <LoadingState />;
      if (error) return <ErrorState error={error} />;
      
      return <SuccessState data={data} onUpdate={updateData} />;
    }
  `
};

// Pattern 5: Event Handling Patterns
export const EVENT_PATTERNS = {
  // Use useCallback for event handlers
  eventHandler: `
    const handleSubmit = useCallback(async (formData) => {
      try {
        await onSubmit(formData);
        // Handle success
      } catch (error) {
        // Handle error
      }
    }, [onSubmit]);
  `,
  
  // Prevent default and stop propagation when needed
  preventDefaults: `
    const handleClick = useCallback((event) => {
      event.preventDefault();
      event.stopPropagation();
      onClick(event);
    }, [onClick]);
  `
};

// Pattern 6: Component Composition Patterns
export const COMPOSITION_PATTERNS = {
  // Use render props for flexible composition
  renderProps: `
    function DataProvider({ children, render }) {
      const [data, setData] = useState(null);
      
      return render ? render(data, setData) : children(data, setData);
    }
    
    // Usage:
    <DataProvider render={(data, setData) => (
      <MyComponent data={data} onChange={setData} />
    )} />
  `,
  
  // Use compound components for related functionality
  compoundComponents: `
    function Card({ children }) {
      return <div className="card">{children}</div>;
    }
    
    Card.Header = function CardHeader({ children }) {
      return <header className="card-header">{children}</header>;
    };
    
    Card.Body = function CardBody({ children }) {
      return <main className="card-body">{children}</main>;
    };
    
    // Usage:
    <Card>
      <Card.Header>Title</Card.Header>
      <Card.Body>Content</Card.Body>
    </Card>
  `
};

// Pattern 7: Error Boundary Patterns
export const ERROR_BOUNDARY_PATTERN = `
  // Wrap components that might fail
  function SafeComponent({ children, fallback }) {
    return (
      <ErrorBoundary fallback={fallback}>
        {children}
      </ErrorBoundary>
    );
  }
  
  // Provide meaningful error messages
  function ErrorFallback({ error, resetError }) {
    return (
      <Card>
        <Stack>
          <BodyText color="error">Something went wrong:</BodyText>
          <Caption>{error.message}</Caption>
          <StandardButton onClick={resetError}>Try Again</StandardButton>
        </Stack>
      </Card>
    );
  }
`;

// Pattern 8: Performance Patterns
export const PERFORMANCE_PATTERNS = {
  // Use React.memo for expensive components
  memoization: `
    const ExpensiveComponent = React.memo(function ExpensiveComponent({ data }) {
      const expensiveValue = useMemo(() => 
        performExpensiveCalculation(data), [data]
      );
      
      return <div>{expensiveValue}</div>;
    });
  `,
  
  // Use lazy loading for code splitting
  lazyLoading: `
    const LazyComponent = React.lazy(() => import('./LazyComponent'));
    
    function App() {
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <LazyComponent />
        </Suspense>
      );
    }
  `
};

// Validation functions to check if components follow patterns
export const validateComponentPattern = (componentCode) => {
  const checks = {
    usesFunctionalComponent: componentCode.includes('function ') || componentCode.includes('const ') && componentCode.includes('=> {'),
    usesPropsDestructuring: componentCode.includes('{ ') && componentCode.includes(' }'),
    usesStandardizedComponents: componentCode.includes('from \'../design/components/StandardizedComponents\''),
    avoidsInlineStyles: !componentCode.includes('style={{') || componentCode.split('style={{').length <= 2, // Allow minimal inline styles
    usesDesignSystem: componentCode.includes('designSystem') || componentCode.includes('StandardizedComponents'),
    hasErrorHandling: componentCode.includes('error') || componentCode.includes('Error'),
    usesLoadingStates: componentCode.includes('loading') || componentCode.includes('Loading')
  };
  
  return {
    score: Object.values(checks).filter(Boolean).length / Object.keys(checks).length,
    checks,
    recommendations: generateRecommendations(checks)
  };
};

function generateRecommendations(checks) {
  const recommendations = [];
  
  if (!checks.usesFunctionalComponent) {
    recommendations.push('Use functional components instead of class components');
  }
  
  if (!checks.usesPropsDestructuring) {
    recommendations.push('Use props destructuring for cleaner code');
  }
  
  if (!checks.usesStandardizedComponents) {
    recommendations.push('Import from StandardizedComponents for consistency');
  }
  
  if (!checks.avoidsInlineStyles) {
    recommendations.push('Avoid inline styles, use design system variants');
  }
  
  if (!checks.usesDesignSystem) {
    recommendations.push('Use design system tokens instead of hardcoded values');
  }
  
  if (!checks.hasErrorHandling) {
    recommendations.push('Add error handling for better user experience');
  }
  
  if (!checks.usesLoadingStates) {
    recommendations.push('Add loading states for async operations');
  }
  
  return recommendations;
}

// Export pattern enforcement utilities
export const enforcePatterns = {
  validateComponentPattern,
  generateRecommendations,
  
  // Template for new components
  getComponentTemplate: (componentName) => `
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Card,
  Stack,
  PageTitle,
  BodyText,
  StandardButton
} from '../design/components/StandardizedComponents';
import { useStandardizedTheme } from '../design/hooks/useStandardizedTheme';

function ${componentName}({ 
  // Required props
  data,
  onAction,
  
  // Optional props with defaults
  loading = false,
  error = null,
  
  // Rest props for flexibility
  ...restProps 
}) {
  // 1. Custom hooks
  const theme = useStandardizedTheme();
  
  // 2. Local state
  const [localState, setLocalState] = useState(null);
  
  // 3. Computed values
  const computedValue = useMemo(() => {
    return data ? processData(data) : null;
  }, [data]);
  
  // 4. Event handlers
  const handleAction = useCallback((actionData) => {
    onAction?.(actionData);
  }, [onAction]);
  
  // 5. Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // 6. Early returns
  if (loading) {
    return (
      <Card>
        <BodyText textAlign="center">Loading...</BodyText>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <Stack>
          <BodyText color="error">Error: {error}</BodyText>
          <StandardButton onClick={() => window.location.reload()}>
            Retry
          </StandardButton>
        </Stack>
      </Card>
    );
  }
  
  // 7. Main render
  return (
    <Card animated hover {...restProps}>
      <Stack>
        <PageTitle>{componentName}</PageTitle>
        <BodyText>{computedValue}</BodyText>
        <StandardButton onClick={handleAction} animated>
          Action
        </StandardButton>
      </Stack>
    </Card>
  );
}

export default ${componentName};
`
};

export default {
  FUNCTIONAL_COMPONENT_PATTERN,
  PROPS_PATTERN,
  STYLING_PATTERNS,
  STATE_PATTERNS,
  EVENT_PATTERNS,
  COMPOSITION_PATTERNS,
  ERROR_BOUNDARY_PATTERN,
  PERFORMANCE_PATTERNS,
  enforcePatterns
};