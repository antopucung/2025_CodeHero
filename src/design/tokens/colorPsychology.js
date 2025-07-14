// Color Psychology System for Typing Engine
// Based on cognitive science and muscle memory research

export const colorPsychology = {
  // Core typing states with psychological impact
  typingStates: {
    // PENDING - Calm, neutral, ready state
    pending: {
      primary: '#4A5568', // Cool gray - neutral, non-distracting
      secondary: '#718096',
      background: 'rgba(74, 85, 104, 0.1)',
      psychology: 'Neutral state promotes focus without anxiety'
    },
    
    // CURRENT - High attention, active focus
    current: {
      primary: '#3182CE', // Blue - enhances concentration and focus
      secondary: '#4299E1',
      background: 'rgba(49, 130, 206, 0.15)',
      glow: '#3182CE',
      psychology: 'Blue increases focus and cognitive performance'
    },
    
    // CORRECT - Positive reinforcement, success
    correct: {
      primary: '#38A169', // Green - success, positive reinforcement
      secondary: '#48BB78',
      background: 'rgba(56, 161, 105, 0.12)',
      glow: '#38A169',
      psychology: 'Green triggers dopamine release, reinforces success'
    },
    
    // INCORRECT - Alert, but not aggressive
    incorrect: {
      primary: '#E53E3E', // Red - error state, immediate attention
      secondary: '#F56565',
      background: 'rgba(229, 62, 62, 0.15)',
      glow: '#E53E3E',
      psychology: 'Red creates urgency without overwhelming stress'
    }
  },
  
  // Speed-based colors for muscle memory training
  speedColors: {
    // PERFECT - Elite performance, mastery
    perfect: {
      primary: '#805AD5', // Purple - mastery, excellence
      secondary: '#9F7AEA',
      gradient: 'linear-gradient(135deg, #805AD5 0%, #9F7AEA 50%, #B794F6 100%)',
      glow: '#805AD5',
      psychology: 'Purple represents mastery and elite performance'
    },
    
    // BEST - High performance, confidence
    best: {
      primary: '#D69E2E', // Gold - achievement, high value
      secondary: '#ECC94B',
      gradient: 'linear-gradient(135deg, #D69E2E 0%, #ECC94B 50%, #F6E05E 100%)',
      glow: '#D69E2E',
      psychology: 'Gold creates sense of achievement and value'
    },
    
    // GOOD - Progress, improvement
    good: {
      primary: '#319795', // Teal - progress, balance
      secondary: '#4FD1C7',
      gradient: 'linear-gradient(135deg, #319795 0%, #4FD1C7 50%, #81E6D9 100%)',
      glow: '#319795',
      psychology: 'Teal promotes calm confidence and steady progress'
    },
    
    // SLOW - Needs improvement, but not discouraging
    slow: {
      primary: '#718096', // Gray - neutral, room for improvement
      secondary: '#A0AEC0',
      gradient: 'linear-gradient(135deg, #718096 0%, #A0AEC0 50%, #CBD5E0 100%)',
      glow: '#718096',
      psychology: 'Gray maintains motivation while indicating improvement needed'
    }
  },
  
  // Combo and streak colors for progressive motivation
  comboColors: {
    // Low combo - encouraging start
    low: {
      primary: '#4299E1', // Light blue - encouraging, calm
      secondary: '#63B3ED',
      psychology: 'Light blue encourages continuation without pressure'
    },
    
    // Medium combo - building momentum
    medium: {
      primary: '#38A169', // Green - positive momentum
      secondary: '#48BB78',
      psychology: 'Green reinforces positive momentum and success'
    },
    
    // High combo - excitement, flow state
    high: {
      primary: '#D69E2E', // Gold - achievement, excitement
      secondary: '#ECC94B',
      psychology: 'Gold creates excitement and flow state maintenance'
    },
    
    // Epic combo - mastery, elite performance
    epic: {
      primary: '#805AD5', // Purple - mastery, elite status
      secondary: '#9F7AEA',
      psychology: 'Purple represents mastery and elite achievement'
    },
    
    // Legendary combo - transcendent performance
    legendary: {
      primary: '#E53E3E', // Red - intense energy, peak performance
      secondary: '#F56565',
      psychology: 'Red creates intense focus and peak performance state'
    }
  },
  
  // Background and environment colors
  environment: {
    // Primary background - reduces eye strain
    background: '#1A202C', // Dark blue-gray - reduces eye strain, professional
    
    // Secondary background - subtle contrast
    surface: '#2D3748', // Slightly lighter - creates depth without distraction
    
    // Border and dividers - subtle definition
    border: '#4A5568', // Medium gray - defines areas without harsh contrast
    
    // Text colors for optimal readability
    text: {
      primary: '#F7FAFC', // Near white - maximum readability
      secondary: '#E2E8F0', // Light gray - secondary information
      muted: '#A0AEC0', // Medium gray - less important information
      accent: '#3182CE' // Blue - interactive elements
    },
    
    psychology: 'Dark theme reduces eye strain and improves focus during extended typing sessions'
  },
  
  // UI element colors for clear hierarchy
  interface: {
    // Primary actions - clear, confident
    primary: {
      background: '#3182CE',
      hover: '#2C5282',
      active: '#2A4365',
      text: '#FFFFFF'
    },
    
    // Secondary actions - supportive
    secondary: {
      background: '#4A5568',
      hover: '#2D3748',
      active: '#1A202C',
      text: '#E2E8F0'
    },
    
    // Success states - positive reinforcement
    success: {
      background: '#38A169',
      hover: '#2F855A',
      active: '#276749',
      text: '#FFFFFF'
    },
    
    // Warning states - attention without alarm
    warning: {
      background: '#D69E2E',
      hover: '#B7791F',
      active: '#975A16',
      text: '#1A202C'
    },
    
    // Error states - clear but not overwhelming
    error: {
      background: '#E53E3E',
      hover: '#C53030',
      active: '#9C1C1C',
      text: '#FFFFFF'
    }
  }
};

// Psychological timing for color transitions
export const transitionTiming = {
  // Immediate feedback - critical for muscle memory
  immediate: '50ms', // Character state changes
  
  // Quick feedback - maintains flow
  quick: '150ms', // Hover states, button interactions
  
  // Standard feedback - comfortable pace
  standard: '300ms', // Panel transitions, mode changes
  
  // Slow feedback - dramatic changes
  slow: '500ms', // Achievement celebrations, level ups
  
  psychology: 'Timing based on human reaction time and flow state maintenance'
};

// Color accessibility and contrast ratios
export const accessibility = {
  // WCAG AAA compliance for text
  textContrast: {
    minimum: 7.0, // AAA standard for normal text
    large: 4.5,   // AAA standard for large text
    ui: 3.0       // Minimum for UI elements
  },
  
  // Color blindness considerations
  colorBlind: {
    // Use shape and position in addition to color
    useShapes: true,
    
    // Avoid problematic color combinations
    avoidRedGreen: true,
    
    // Provide alternative indicators
    usePatterns: true,
    useIcons: true
  },
  
  psychology: 'Accessibility ensures all users can benefit from color psychology'
};

// Helper functions for color psychology
export const getStateColor = (state, speed = null, combo = 1) => {
  // Base state color
  let baseColor = colorPsychology.typingStates[state];
  
  // Speed-based modifications for current and correct states
  if ((state === 'current' || state === 'correct') && speed) {
    const speedColor = colorPsychology.speedColors[speed];
    if (speedColor) {
      baseColor = {
        ...baseColor,
        primary: speedColor.primary,
        glow: speedColor.glow
      };
    }
  }
  
  // Combo-based intensity modifications
  if (combo > 1) {
    const comboLevel = getComboLevel(combo);
    const comboColor = colorPsychology.comboColors[comboLevel];
    
    if (comboColor && state === 'correct') {
      baseColor = {
        ...baseColor,
        primary: comboColor.primary,
        glow: comboColor.primary
      };
    }
  }
  
  return baseColor;
};

export const getComboLevel = (combo) => {
  if (combo >= 50) return 'legendary';
  if (combo >= 30) return 'epic';
  if (combo >= 15) return 'high';
  if (combo >= 5) return 'medium';
  return 'low';
};

export const getSpeedLevel = (wpm) => {
  if (wpm >= 80) return 'perfect';
  if (wpm >= 60) return 'best';
  if (wpm >= 40) return 'good';
  return 'slow';
};

// Muscle memory training colors
export const muscleMemoryColors = {
  // Consistent colors for specific keys/patterns
  commonKeys: {
    vowels: '#4299E1',      // Blue - frequent, important
    consonants: '#718096',   // Gray - neutral, common
    numbers: '#D69E2E',     // Gold - special attention
    symbols: '#805AD5',     // Purple - requires focus
    space: '#38A169'        // Green - rhythm marker
  },
  
  // Pattern-based colors for code typing
  codePatterns: {
    keywords: '#E53E3E',     // Red - language keywords
    strings: '#38A169',      // Green - string literals
    numbers: '#D69E2E',      // Gold - numeric values
    operators: '#805AD5',    // Purple - operators
    brackets: '#319795',     // Teal - structural elements
    comments: '#718096'      // Gray - comments
  },
  
  psychology: 'Consistent colors for similar elements builds muscle memory and pattern recognition'
};