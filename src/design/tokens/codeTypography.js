// Code Typography System - Enhanced visual hierarchy for code concepts
export const codeTypography = {
  // Font weights for different code concepts
  fontWeights: {
    // Basic elements - lighter weight
    text: 400,
    comments: 300,
    whitespace: 400,
    
    // Important elements - medium weight
    variables: 500,
    properties: 500,
    strings: 500,
    numbers: 600,
    
    // Critical elements - bold weight
    keywords: 700,
    functions: 700,
    classes: 700,
    operators: 600,
    
    // Structural elements - extra bold
    brackets: 800,
    braces: 800,
    parentheses: 800
  },
  
  // Font sizes for visual hierarchy
  fontSizes: {
    // Smaller for less important
    comments: '11px',
    whitespace: '12px',
    
    // Standard size
    text: '13px',
    variables: '13px',
    strings: '13px',
    numbers: '13px',
    
    // Larger for important concepts
    keywords: '14px',
    functions: '14px',
    classes: '15px',
    
    // Largest for structural
    brackets: '15px',
    operators: '14px'
  },
  
  // Letter spacing for readability
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.05em',
    wider: '0.1em'
  },
  
  // Line heights for different contexts
  lineHeights: {
    compact: 1.2,
    normal: 1.4,
    relaxed: 1.6
  }
};

// Code concept visual styles
export const codeConceptStyles = {
  // Variables and identifiers
  variable: {
    fontWeight: 500,
    fontSize: '13px',
    letterSpacing: '0.02em',
    textTransform: 'none',
    fontStyle: 'normal'
  },
  
  // Function names and calls
  function: {
    fontWeight: 700,
    fontSize: '14px',
    letterSpacing: '0.01em',
    textTransform: 'none',
    fontStyle: 'normal'
  },
  
  // Class names and constructors
  class: {
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.03em',
    textTransform: 'none',
    fontStyle: 'normal'
  },
  
  // Keywords (if, for, while, etc.)
  keyword: {
    fontWeight: 700,
    fontSize: '14px',
    letterSpacing: '0.05em',
    textTransform: 'none',
    fontStyle: 'italic'
  },
  
  // String literals
  string: {
    fontWeight: 500,
    fontSize: '13px',
    letterSpacing: '0em',
    textTransform: 'none',
    fontStyle: 'normal'
  },
  
  // Numeric values
  number: {
    fontWeight: 600,
    fontSize: '13px',
    letterSpacing: '0.02em',
    textTransform: 'none',
    fontStyle: 'normal'
  },
  
  // Operators (+, -, *, etc.)
  operator: {
    fontWeight: 600,
    fontSize: '14px',
    letterSpacing: '0.1em',
    textTransform: 'none',
    fontStyle: 'normal'
  },
  
  // Brackets and braces
  bracket: {
    fontWeight: 800,
    fontSize: '15px',
    letterSpacing: '0.05em',
    textTransform: 'none',
    fontStyle: 'normal'
  },
  
  // Comments
  comment: {
    fontWeight: 300,
    fontSize: '11px',
    letterSpacing: '0em',
    textTransform: 'none',
    fontStyle: 'italic'
  }
};

// Gradient definitions for different code concepts
export const codeGradients = {
  // Variable gradients - subtle blues and teals
  variable: {
    primary: 'linear-gradient(135deg, #4299E1 0%, #63B3ED 100%)',
    hover: 'linear-gradient(135deg, #3182CE 0%, #4299E1 100%)',
    active: 'linear-gradient(135deg, #2C5282 0%, #3182CE 100%)'
  },
  
  // Function gradients - vibrant purples
  function: {
    primary: 'linear-gradient(135deg, #805AD5 0%, #9F7AEA 100%)',
    hover: 'linear-gradient(135deg, #6B46C1 0%, #805AD5 100%)',
    active: 'linear-gradient(135deg, #553C9A 0%, #6B46C1 100%)'
  },
  
  // Class gradients - rich golds
  class: {
    primary: 'linear-gradient(135deg, #D69E2E 0%, #ECC94B 100%)',
    hover: 'linear-gradient(135deg, #B7791F 0%, #D69E2E 100%)',
    active: 'linear-gradient(135deg, #975A16 0%, #B7791F 100%)'
  },
  
  // Keyword gradients - strong reds
  keyword: {
    primary: 'linear-gradient(135deg, #E53E3E 0%, #F56565 100%)',
    hover: 'linear-gradient(135deg, #C53030 0%, #E53E3E 100%)',
    active: 'linear-gradient(135deg, #9C1C1C 0%, #C53030 100%)'
  },
  
  // String gradients - fresh greens
  string: {
    primary: 'linear-gradient(135deg, #38A169 0%, #48BB78 100%)',
    hover: 'linear-gradient(135deg, #2F855A 0%, #38A169 100%)',
    active: 'linear-gradient(135deg, #276749 0%, #2F855A 100%)'
  },
  
  // Number gradients - warm oranges
  number: {
    primary: 'linear-gradient(135deg, #DD6B20 0%, #ED8936 100%)',
    hover: 'linear-gradient(135deg, #C05621 0%, #DD6B20 100%)',
    active: 'linear-gradient(135deg, #9C4221 0%, #C05621 100%)'
  },
  
  // Operator gradients - cool cyans
  operator: {
    primary: 'linear-gradient(135deg, #319795 0%, #4FD1C7 100%)',
    hover: 'linear-gradient(135deg, #2C7A7B 0%, #319795 100%)',
    active: 'linear-gradient(135deg, #285E61 0%, #2C7A7B 100%)'
  },
  
  // Bracket gradients - metallic silvers
  bracket: {
    primary: 'linear-gradient(135deg, #718096 0%, #A0AEC0 100%)',
    hover: 'linear-gradient(135deg, #4A5568 0%, #718096 100%)',
    active: 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)'
  }
};

// Spacing system for code concepts
export const codeSpacing = {
  // Character spacing
  character: {
    tight: '1px',
    normal: '2px',
    wide: '3px',
    wider: '4px'
  },
  
  // Word spacing
  word: {
    tight: '4px',
    normal: '6px',
    wide: '8px',
    wider: '12px'
  },
  
  // Line spacing
  line: {
    compact: '20px',
    normal: '24px',
    relaxed: '28px',
    loose: '32px'
  },
  
  // Block spacing (functions, classes)
  block: {
    before: '8px',
    after: '8px',
    indent: '16px'
  }
};

// Animation timings for different concepts
export const codeAnimations = {
  // Quick animations for frequent elements
  character: {
    duration: '0.1s',
    easing: 'ease-out'
  },
  
  // Medium animations for words
  word: {
    duration: '0.2s',
    easing: 'ease-in-out'
  },
  
  // Slower animations for concepts
  concept: {
    duration: '0.3s',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  // Celebration animations
  celebration: {
    duration: '0.6s',
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};