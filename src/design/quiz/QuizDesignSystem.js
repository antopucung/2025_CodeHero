// Quiz Design System - Centralized design tokens for all quiz components
import { designSystem } from '../system/DesignSystem';

export const quizDesignSystem = {
  // Quiz-specific colors beyond the base design system
  colors: {
    // Quiz type colors
    quizTypes: {
      codeStacking: '#4ecdc4',
      codeCompletion: '#ffd93d',
      debugChallenge: '#ff6b6b',
      multipleChoice: '#6bcf7f',
      dinoRun: '#a374db'
    },
    
    // State colors for interactive elements
    state: {
      correct: '#38a169',
      incorrect: '#e53e3e',
      neutral: '#718096',
      active: '#3182ce',
      dragging: '#4ecdc4',
      dropping: 'rgba(78, 205, 196, 0.3)',
      highlight: 'rgba(255, 217, 61, 0.3)'
    },
    
    // Game feedback colors
    feedback: {
      success: {
        bg: 'rgba(0, 255, 0, 0.2)',
        text: '#00ff00',
        border: '#00ff00'
      },
      error: {
        bg: 'rgba(255, 0, 0, 0.2)',
        text: '#ff6b6b',
        border: '#ff6b6b'
      },
      info: {
        bg: 'rgba(78, 205, 196, 0.2)',
        text: '#4ecdc4',
        border: '#4ecdc4'
      },
      warning: {
        bg: 'rgba(255, 217, 61, 0.2)',
        text: '#ffd93d',
        border: '#ffd93d'
      }
    }
  },
  
  // Quiz-specific spacing
  spacing: {
    ...designSystem.spacing,
    // Add quiz-specific spacing values
    dragPadding: '8px',
    dropZoneHeight: '50px',
    comboIndicator: '16px',
    questionPadding: '24px'
  },
  
  // Animation timings
  animation: {
    duration: {
      fast: 0.2,
      normal: 0.3,
      slow: 0.5,
      bounce: 0.8
    },
    
    // Easing functions
    easing: {
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
    },
    
    // Juiciness levels for animations
    juiciness: {
      low: {
        scale: 0.3,
        speed: 0.7,
        particles: false,
        effects: 'minimal'
      },
      medium: {
        scale: 0.7,
        speed: 1.0,
        particles: true,
        effects: 'moderate'
      },
      high: {
        scale: 1.0,
        speed: 1.3,
        particles: true,
        effects: 'maximum'
      }
    }
  },
  
  // Component-specific styles
  components: {
    // Quiz card styles
    quizCard: {
      borderRadius: designSystem.radii.md,
      shadow: designSystem.shadows.md,
      hoverTransform: 'scale(1.03)',
      activeTransform: 'scale(0.98)'
    },
    
    // Drag and drop elements
    draggableBlock: {
      height: '40px',
      borderRadius: designSystem.radii.sm,
      dragScale: 1.05,
      dragShadow: '0 10px 20px rgba(0, 0, 0, 0.4)'
    },
    
    dropZone: {
      minHeight: '40px',
      borderStyle: 'dashed',
      borderWidth: '2px',
      activeBorderStyle: 'dashed',
      activeBorderWidth: '2px'
    },
    
    // Quiz UI elements
    timer: {
      warningThreshold: 10, // seconds
      height: '6px',
      borderRadius: 'full'
    },
    
    scoreIndicator: {
      fontWeight: 'bold',
      animationDuration: 0.5
    }
  },
  
  // Helper functions for component styling
  getQuizTypeColor: (quizType) => {
    return quizDesignSystem.colors.quizTypes[quizType] || designSystem.colors.brand.primary;
  },
  
  getJuicinessLevel: (level = 'medium') => {
    return quizDesignSystem.animation.juiciness[level] || quizDesignSystem.animation.juiciness.medium;
  },
  
  // Responsive breakpoints for quiz layouts
  breakpoints: {
    ...designSystem.breakpoints,
    quiz: {
      compact: '480px',
      standard: '768px',
      wide: '1024px'
    }
  }
};

export default quizDesignSystem;