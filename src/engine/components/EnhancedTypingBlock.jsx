// Enhanced Typing Block with better readability and performance
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { colors } from '../../design/tokens/colors';

export const EnhancedTypingBlock = memo(({
  char,
  status = 'pending',
  speed = 'slow',
  concept = null,
  upgrade = { level: 0, speed: 'slow' },
  combo = 1,
  anticipationLevel = 1,
  onClick,
  style = {},
  showError = false,
  fullScreen = false,
  charSpacing = 'normal'
}) => {
  
  const getConceptStyle = () => {
    if (!concept) {
      return {
        fontWeight: status === 'pending' ? 600 : 500, // Bolder for pending
        fontSize: fullScreen ? '14px' : '13px',
        letterSpacing: '0.02em'
      };
    }
    
    // Enhanced styles for different concepts with better visibility
    switch (concept.type) {
      case 'function':
        return {
          fontWeight: 700,
          fontSize: fullScreen ? '15px' : '14px',
          letterSpacing: '0.02em'
        };
        
      case 'class':
        return {
          fontWeight: 700,
          fontSize: fullScreen ? '16px' : '15px',
          letterSpacing: '0.03em'
        };
        
      case 'keyword':
        return {
          fontWeight: 700,
          fontSize: fullScreen ? '15px' : '14px',
          letterSpacing: '0.05em',
          fontStyle: 'italic'
        };
        
      case 'string':
        return {
          fontWeight: 600, // Increased from 500
          fontSize: fullScreen ? '14px' : '13px',
          letterSpacing: '0em'
        };
        
      case 'number':
        return {
          fontWeight: 600,
          fontSize: fullScreen ? '14px' : '13px',
          letterSpacing: '0.02em'
        };
        
      case 'operator':
        return {
          fontWeight: 700, // Increased from 600
          fontSize: fullScreen ? '15px' : '14px',
          letterSpacing: '0.1em'
        };
        
      case 'bracket':
        return {
          fontWeight: 800,
          fontSize: fullScreen ? '16px' : '15px',
          letterSpacing: '0.05em'
        };
        
      case 'comment':
        return {
          fontWeight: 500, // Increased from 300
          fontSize: fullScreen ? '12px' : '11px',
          letterSpacing: '0em',
          fontStyle: 'italic'
        };
        
      default:
        return {
          fontWeight: 600, // Increased default
          fontSize: fullScreen ? '14px' : '13px',
          letterSpacing: '0.02em'
        };
    }
  };
  
  const getBlockStyle = () => {
    const conceptStyle = getConceptStyle();
    
    // Fixed readability with proper contrast
    const getBackground = () => {
      switch (status) {
        case 'incorrect': 
          return 'rgba(229, 62, 62, 0.9)';
        case 'current': 
          return 'rgba(49, 130, 206, 0.8)';
        case 'correct': 
          return 'rgba(56, 161, 105, 0.15)'; // Very subtle for completed
        default: 
          return 'rgba(74, 85, 104, 0.08)'; // Very subtle for pending
      }
    };
    
    // Enhanced text color for better readability
    const getTextColor = () => {
      if (status === 'incorrect') return '#FFFFFF';
      if (status === 'current') return '#FFFFFF';
      
      // Enhanced colors for better visibility
      if (concept) {
        const conceptColors = {
          function: '#9F7AEA',    // Brighter purple
          class: '#ECC94B',      // Brighter gold
          keyword: '#F56565',    // Brighter red
          string: '#68D391',     // Brighter green
          number: '#F6AD55',     // Brighter orange
          operator: '#4FD1C7',   // Brighter cyan
          bracket: '#A0AEC0',    // Brighter gray
          variable: '#63B3ED',   // Brighter blue
          comment: '#A0AEC0'     // Readable gray
        };
        
        if (status === 'correct') {
          return conceptColors[concept.type] || '#68D391';
        } else {
          // Pending characters - much brighter for readability
          return conceptColors[concept.type] || '#E2E8F0';
        }
      }
      
      // Default colors with better contrast
      if (status === 'correct') return '#68D391';
      return '#E2E8F0'; // Much brighter for pending
    };
    
    // Enhanced border colors
    const getBorderColor = () => {
      if (status === 'incorrect') return colors.performance.error.primary;
      if (status === 'current') return '#3182CE';
      
      if (concept && status === 'correct') {
        const conceptColors = {
          function: '#805AD5',
          class: '#D69E2E', 
          keyword: '#E53E3E',
          string: '#38A169',
          number: '#DD6B20',
          operator: '#319795',
          bracket: '#718096',
          variable: '#4299E1'
        };
        return conceptColors[concept.type] || '#38A169';
      }
      
      return 'rgba(113, 128, 150, 0.3)';
    };
    
    // Optimized glow effects - reduced for performance
    const getBoxShadow = () => {
      const borderColor = getBorderColor();
      
      if (status === 'incorrect') {
        return `0 0 8px rgba(229, 62, 62, 0.6)`;
      }
      
      if (status === 'current') {
        const intensity = Math.min(anticipationLevel * 1.2, 2);
        return `0 0 ${10 * intensity}px rgba(49, 130, 206, 0.6)`;
      }
      
      if (status === 'correct' && concept && combo > 5) {
        return `0 0 6px ${borderColor}44`;
      }
      
      return 'none';
    };
    
    return {
      background: getBackground(),
      borderColor: getBorderColor(),
      boxShadow: getBoxShadow(),
      color: getTextColor(),
      ...conceptStyle
    };
  };
  
  const getAnimationProps = () => {
    if (status === 'current') {
      const pulseScale = 1 + (anticipationLevel * 0.06);
      return {
        scale: [1, pulseScale, 1],
        transition: { 
          duration: Math.max(0.5, 0.8 / anticipationLevel), 
          repeat: Infinity,
          ease: "easeInOut"
        }
      };
    }
    
    if (status === 'correct') {
      const intensity = 1 + (upgrade.level * 0.1);
      return {
        scale: [1, 1.2 + (intensity * 0.05), 1.05 + (intensity * 0.02)],
        rotate: [0, 2 * intensity, 0],
        transition: { duration: 0.4 }
      };
    }
    
    if (status === 'incorrect') {
      return {
        scale: [1, 1.1, 0.95, 1.03, 1],
        rotate: [0, -2, 2, -1, 0],
        x: [0, -1, 1, -0.5, 0],
        transition: { duration: 0.35 }
      };
    }
    
    return {
      scale: 1,
      opacity: status === 'pending' ? 0.85 : 1, // Better visibility for pending
      transition: { duration: 0.12 }
    };
  };
  
  const blockStyle = getBlockStyle();
  
  // Character spacing
  const getCharSpacing = () => {
    if (concept) {
      switch (concept.type) {
        case 'operator': return fullScreen ? '4px' : '3px';
        case 'bracket': return fullScreen ? '3px' : '2px';
        case 'keyword': return fullScreen ? '3px' : '2px';
        default: return fullScreen ? '2px' : '1.5px';
      }
    }
    return fullScreen ? '2px' : '1.5px';
  };
  
  // Handle special characters
  const isSpace = char === ' ';
  const isTab = char === '\t';
  const isNewline = char === '\n';
  
  const getCharacterDimensions = () => {
    if (isNewline) {
      return {
        width: fullScreen ? '24px' : '20px',
        height: fullScreen ? '28px' : '24px',
        display: 'inline-block'
      };
    }
    
    if (isTab) {
      return {
        width: fullScreen ? '32px' : '28px',
        height: fullScreen ? '28px' : '24px',
        display: 'inline-block'
      };
    }
    
    if (isSpace) {
      return {
        width: fullScreen ? '12px' : '10px',
        height: fullScreen ? '28px' : '24px',
        display: 'inline-block'
      };
    }
    
    // Concept-aware sizing
    const baseWidth = fullScreen ? '22px' : '18px';
    const baseHeight = fullScreen ? '28px' : '24px';
    
    if (concept) {
      switch (concept.type) {
        case 'bracket':
        case 'operator':
          return {
            width: fullScreen ? '24px' : '20px',
            height: baseHeight,
            display: 'inline-block'
          };
        default:
          return {
            width: baseWidth,
            height: baseHeight,
            display: 'inline-block'
          };
      }
    }
    
    return {
      width: baseWidth,
      height: baseHeight,
      display: 'inline-block'
    };
  };
  
  const dimensions = getCharacterDimensions();
  const calculatedSpacing = getCharSpacing();
  
  return (
    <motion.div
      animate={getAnimationProps()}
      onClick={onClick}
      style={{
        ...dimensions,
        margin: `1px ${calculatedSpacing}`,
        border: `1px solid ${blockStyle.borderColor}`,
        borderRadius: fullScreen ? '4px' : '3px',
        textAlign: 'center',
        lineHeight: dimensions.height,
        fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
        cursor: 'pointer',
        position: 'relative',
        userSelect: 'none',
        verticalAlign: 'top',
        ...blockStyle,
        ...style
      }}
    >
      {isSpace ? '' : isTab ? '→' : isNewline ? '↵' : char}
      
      {/* Optimized concept indicator - only for important concepts */}
      {concept && status === 'correct' && ['function', 'class', 'keyword'].includes(concept.type) && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 0.8, 0]
          }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '8px',
            height: '8px',
            background: `radial-gradient(circle, ${blockStyle.borderColor}, ${blockStyle.borderColor}aa)`,
            borderRadius: '50%',
            zIndex: 10
          }}
        />
      )}
      
      {/* Enhanced error indicator */}
      {showError && status === 'incorrect' && (
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ 
            scale: [1, 1.4, 1.1],
            rotate: [0, 10, -10, 0],
            opacity: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 0.5,
            opacity: { repeat: 2, duration: 0.2 }
          }}
          style={{
            position: 'absolute',
            top: fullScreen ? '-16px' : '-12px',
            right: fullScreen ? '-16px' : '-12px',
            color: colors.performance.error.primary,
            fontSize: fullScreen ? '16px' : '14px',
            fontWeight: 'bold',
            textShadow: `0 0 6px ${colors.performance.error.glow}`,
            zIndex: 10
          }}
        >
          ✗
        </motion.div>
      )}

      {/* Optimized success ripple - only for high combos */}
      {status === 'correct' && combo > 10 && (
        <motion.div
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{
            scale: [0, 2.5, 3.5],
            opacity: [0.6, 0.3, 0]
          }}
          transition={{ duration: 1.2 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${fullScreen ? 40 : 30}px`,
            height: `${fullScreen ? 40 : 30}px`,
            border: `1px solid ${blockStyle.borderColor}`,
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      )}
    </motion.div>
  );
});

EnhancedTypingBlock.displayName = 'EnhancedTypingBlock';