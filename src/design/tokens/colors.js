// Enhanced Design System - Color Tokens with Psychology
import { colorPsychology, getStateColor, getComboLevel, getSpeedLevel } from './colorPsychology';

// Base color palette optimized for typing and focus
export const colors = {
  // Primary brand colors - professional and focused
  primary: {
    50: '#EBF8FF',
    100: '#BEE3F8',
    200: '#90CDF4',
    300: '#63B3ED',
    400: '#4299E1',
    500: '#3182CE', // Main blue - enhances focus and concentration
    600: '#2C5282',
    700: '#2A4365',
    800: '#1A365D',
    900: '#153E75'
  },
  
  // Terminal/environment colors - optimized for extended use
  terminal: {
    bg: '#1A202C',      // Dark blue-gray - reduces eye strain
    surface: '#2D3748',  // Slightly lighter - creates depth
    border: '#4A5568',   // Medium gray - subtle definition
    text: '#F7FAFC',     // Near white - maximum readability
    textSecondary: '#E2E8F0', // Light gray - secondary info
    textMuted: '#A0AEC0',     // Medium gray - less important
    accent: '#3182CE'    // Blue - interactive elements
  },
  
  // Typing state colors - based on cognitive psychology
  typing: {
    pending: {
      primary: '#4A5568',
      background: 'rgba(74, 85, 104, 0.1)',
      border: '#718096'
    },
    current: {
      primary: '#3182CE',
      background: 'rgba(49, 130, 206, 0.15)',
      border: '#3182CE',
      glow: '#3182CE'
    },
    correct: {
      primary: '#38A169',
      background: 'rgba(56, 161, 105, 0.12)',
      border: '#38A169',
      glow: '#38A169'
    },
    incorrect: {
      primary: '#E53E3E',
      background: 'rgba(229, 62, 62, 0.15)',
      border: '#E53E3E',
      glow: '#E53E3E'
    }
  },
  
  // Speed-based performance colors
  performance: {
    perfect: {
      primary: '#805AD5',
      secondary: '#9F7AEA',
      gradient: 'linear-gradient(135deg, #805AD5 0%, #9F7AEA 50%, #B794F6 100%)',
      glow: '#805AD5',
      shadow: '0 0 20px rgba(128, 90, 213, 0.4)'
    },
    best: {
      primary: '#D69E2E',
      secondary: '#ECC94B',
      gradient: 'linear-gradient(135deg, #D69E2E 0%, #ECC94B 50%, #F6E05E 100%)',
      glow: '#D69E2E',
      shadow: '0 0 20px rgba(214, 158, 46, 0.4)'
    },
    good: {
      primary: '#319795',
      secondary: '#4FD1C7',
      gradient: 'linear-gradient(135deg, #319795 0%, #4FD1C7 50%, #81E6D9 100%)',
      glow: '#319795',
      shadow: '0 0 20px rgba(49, 151, 149, 0.4)'
    },
    slow: {
      primary: '#718096',
      secondary: '#A0AEC0',
      gradient: 'linear-gradient(135deg, #718096 0%, #A0AEC0 50%, #CBD5E0 100%)',
      glow: '#718096',
      shadow: '0 0 20px rgba(113, 128, 150, 0.4)'
    },
    error: {
      primary: '#E53E3E',
      secondary: '#F56565',
      gradient: 'linear-gradient(45deg, #E53E3E, #F56565)',
      glow: '#E53E3E',
      shadow: '0 0 20px rgba(229, 62, 62, 0.4)'
    }
  },
  
  // Combo and streak colors for progressive motivation
  combo: {
    low: '#4299E1',      // Light blue - encouraging
    medium: '#38A169',   // Green - positive momentum
    high: '#D69E2E',     // Gold - achievement
    epic: '#805AD5',     // Purple - mastery
    legendary: '#E53E3E' // Red - peak performance
  },
  
  // UI element colors
  interface: {
    primary: {
      bg: '#3182CE',
      hover: '#2C5282',
      active: '#2A4365',
      text: '#FFFFFF'
    },
    secondary: {
      bg: '#4A5568',
      hover: '#2D3748',
      active: '#1A202C',
      text: '#E2E8F0'
    },
    success: {
      bg: '#38A169',
      hover: '#2F855A',
      active: '#276749',
      text: '#FFFFFF'
    },
    warning: {
      bg: '#D69E2E',
      hover: '#B7791F',
      active: '#975A16',
      text: '#1A202C'
    },
    error: {
      bg: '#E53E3E',
      hover: '#C53030',
      active: '#9C1C1C',
      text: '#FFFFFF'
    }
  },
  
  // Achievement and celebration colors
  achievement: {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF'
  }
};

// Enhanced color helper functions
export const getPerformanceColor = (speed) => {
  return colors.performance[speed] || colors.performance.slow;
};

export const getComboColor = (combo) => {
  const level = getComboLevel(combo);
  return colors.combo[level];
};

export const getTypingStateColor = (state, speed = null, combo = 1) => {
  return getStateColor(state, speed, combo);
};

// Muscle memory color mappings for consistent learning
export const muscleMemoryColors = {
  // Key categories for consistent color coding
  keyTypes: {
    vowels: colors.primary[400],      // Blue - frequent, important
    consonants: colors.terminal.textMuted, // Gray - neutral, common
    numbers: colors.performance.best.primary, // Gold - special attention
    symbols: colors.performance.perfect.primary, // Purple - requires focus
    space: colors.performance.good.primary // Teal - rhythm marker
  },
  
  // Code syntax colors for programming typing
  syntax: {
    keywords: colors.performance.error.primary,  // Red - language keywords
    strings: colors.performance.good.primary,    // Teal - string literals
    numbers: colors.performance.best.primary,    // Gold - numeric values
    operators: colors.performance.perfect.primary, // Purple - operators
    brackets: colors.combo.medium,               // Green - structural elements
    comments: colors.terminal.textMuted         // Gray - comments
  }
};

// Export color psychology system
export { colorPsychology, getStateColor, getComboLevel, getSpeedLevel };