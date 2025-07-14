// Enhanced Typing Block with compelling typography and visual effects
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { codeTypography, codeConceptStyles, codeGradients, codeSpacing } from '../../design/tokens/codeTypography';
import { colors, getTypingStateColor } from '../../design/tokens/colors';

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
  spacing = 'normal'
}) => {
  
  const getConceptStyle = () => {
    if (!concept) return codeConceptStyles.variable;
    
    // Get typography style based on concept type
    const baseStyle = codeConceptStyles[concept.type] || codeConceptStyles.variable;
    
    // Enhanced styles for different concepts
    switch (concept.type) {
      case 'function':
        return {
          ...baseStyle,
          fontWeight: 700,
          fontSize: fullScreen ? '15px' : '14px',
          letterSpacing: '0.02em',
          textShadow: status === 'correct' ? '0 0 8px rgba(128, 90, 213, 0.6)' : 'none'
        };
        
      case 'class':
        return {
          ...baseStyle,
          fontWeight: 700,
          fontSize: fullScreen ? '16px' : '15px',
          letterSpacing: '0.03em',
          textTransform: 'none',
          textShadow: status === 'correct' ? '0 0 8px rgba(214, 158, 46, 0.6)' : 'none'
        };
        
      case 'keyword':
        return {
          ...baseStyle,
          fontWeight: 700,
          fontSize: fullScreen ? '15px' : '14px',
          letterSpacing: '0.05em',
          fontStyle: 'italic',
          textShadow: status === 'correct' ? '0 0 8px rgba(229, 62, 62, 0.6)' : 'none'
        };
        
      case 'string':
        return {
          ...baseStyle,
          fontWeight: 500,
          fontSize: fullScreen ? '14px' : '13px',
          letterSpacing: '0em',
          textShadow: status === 'correct' ? '0 0 8px rgba(56, 161, 105, 0.6)' : 'none'
        };
        
      case 'number':
        return {
          ...baseStyle,
          fontWeight: 600,
          fontSize: fullScreen ? '14px' : '13px',
          letterSpacing: '0.02em',
          textShadow: status === 'correct' ? '0 0 8px rgba(221, 107, 32, 0.6)' : 'none'
        };
        
      case 'operator':
        return {
          ...baseStyle,
          fontWeight: 600,
          fontSize: fullScreen ? '15px' : '14px',
          letterSpacing: '0.1em',
          textShadow: status === 'correct' ? '0 0 8px rgba(49, 151, 149, 0.6)' : 'none'
        };
        
      case 'bracket':
        return {
          ...baseStyle,
          fontWeight: 800,
          fontSize: fullScreen ? '16px' : '15px',
          letterSpacing: '0.05em',
          textShadow: status === 'correct' ? '0 0 8px rgba(113, 128, 150, 0.6)' : 'none'
        };
        
      case 'comment':
        return {
          ...baseStyle,
          fontWeight: 300,
          fontSize: fullScreen ? '12px' : '11px',
          letterSpacing: '0em',
          fontStyle: 'italic',
          opacity: 0.7
        };
        
      default:
        return baseStyle;
    }
  };
  
  const getBlockStyle = () => {
    const stateColor = getTypingStateColor(status, speed, combo);
    const conceptStyle = getConceptStyle();
    
    // Enhanced background with concept-aware gradients
    const getBackground = () => {
      if (!concept) {
        // Default backgrounds
        switch (status) {
          case 'incorrect': return 'rgba(229, 62, 62, 0.95)';
          case 'current': return 'rgba(49, 130, 206, 0.85)';
          case 'correct': return 'rgba(56, 161, 105, 0.15)'; // Much more faded
          default: return 'rgba(74, 85, 104, 0.05)'; // Very faded
        }
      }
      
      // Concept-aware backgrounds with gradients
      const gradient = codeGradients[concept.type];
      if (!gradient) return getBackground();
      
      switch (status) {
        case 'incorrect': 
          return 'rgba(229, 62, 62, 0.95)';
        case 'current': 
          return `linear-gradient(135deg, rgba(49, 130, 206, 0.8), rgba(99, 179, 237, 0.6))`;
        case 'correct': 
          // Use concept gradient with very low opacity
          return gradient.primary.replace(/[\d.]+\)/g, '0.12)');
        default: 
          return 'rgba(74, 85, 104, 0.03)'; // Almost invisible
      }
    };
    
    // Enhanced border with concept colors
    const getBorderColor = () => {
      if (status === 'incorrect') return colors.performance.error.primary;
      if (status === 'current') return stateColor.primary;
      
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
        return conceptColors[concept.type] || stateColor.primary;
      }
      
      return 'rgba(113, 128, 150, 0.2)';
    };
    
    // Enhanced glow effects
    const getBoxShadow = () => {
      const borderColor = getBorderColor();
      
      if (status === 'incorrect') {
        return `0 0 12px rgba(229, 62, 62, 0.8), inset 0 0 8px rgba(229, 62, 62, 0.3)`;
      }
      
      if (status === 'current') {
        const intensity = Math.min(anticipationLevel * 1.5, 2.5);
        return `0 0 ${15 * intensity}px rgba(49, 130, 206, 0.8), inset 0 0 8px rgba(255,255,255,0.1)`;
      }
      
      if (status === 'correct' && concept) {
        const intensity = Math.min(1 + (combo / 20) + (upgrade.level * 0.3), 2);
        return `0 0 ${8 * intensity}px ${borderColor}33, inset 0 0 4px ${borderColor}22`;
      }
      
      return 'none';
    };
    
    return {
      background: getBackground(),
      borderColor: getBorderColor(),
      boxShadow: getBoxShadow(),
      color: status === 'pending' ? colors.terminal.textMuted : 
             status === 'incorrect' ? '#FFFFFF' : 
             concept ? getBorderColor() : stateColor.primary,
      ...conceptStyle
    };
  };
  
  const getAnimationProps = () => {
    if (status === 'current') {
      const pulseScale = 1 + (anticipationLevel * 0.08);
      return {
        scale: [1, pulseScale, 1],
        transition: { 
          duration: Math.max(0.4, 0.8 / anticipationLevel), 
          repeat: Infinity,
          ease: "easeInOut"
        }
      };
    }
    
    if (status === 'correct') {
      const intensity = 1 + (upgrade.level * 0.15) + (concept ? 0.2 : 0);
      return {
        scale: [1, 1.3 + (intensity * 0.1), 1.08 + (intensity * 0.03)],
        rotate: [0, 3 * intensity, 0],
        transition: { duration: 0.5 }
      };
    }
    
    if (status === 'incorrect') {
      return {
        scale: [1, 1.15, 0.95, 1.05, 1],
        rotate: [0, -3, 3, -1, 0],
        x: [0, -2, 2, -1, 0],
        transition: { duration: 0.4 }
      };
    }
    
    return {
      scale: 1,
      opacity: status === 'pending' ? 0.6 : 1,
      transition: { duration: 0.15 }
    };
  };
  
  const blockStyle = getBlockStyle();
  
  // Character spacing based on concept and context
  const getSpacing = () => {
    const baseSpacing = codeSpacing.character[spacing] || codeSpacing.character.normal;
    
    if (concept) {
      switch (concept.type) {
        case 'operator': return codeSpacing.character.wide;
        case 'bracket': return codeSpacing.character.normal;
        case 'keyword': return codeSpacing.character.wide;
        default: return baseSpacing;
      }
    }
    
    return baseSpacing;
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
  const spacing = getSpacing();
  
  return (
    <motion.div
      animate={getAnimationProps()}
      onClick={onClick}
      style={{
        ...dimensions,
        margin: `1px ${spacing}`,
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
      
      {/* Concept indicator */}
      {concept && status === 'correct' && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.8, 0],
            opacity: [1, 0.8, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 1.2 }}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: '12px',
            height: '12px',
            background: `radial-gradient(circle, ${blockStyle.borderColor}, ${blockStyle.borderColor}aa)`,
            borderRadius: '50%',
            boxShadow: `0 0 12px ${blockStyle.borderColor}`,
            zIndex: 10
          }}
        />
      )}
      
      {/* Enhanced concept label */}
      {concept && status === 'current' && (
        <motion.div
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity
          }}
          style={{
            position: 'absolute',
            top: fullScreen ? '-18px' : '-14px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: fullScreen ? '9px' : '7px',
            color: blockStyle.borderColor,
            fontWeight: 'bold',
            textShadow: `0 0 4px ${blockStyle.borderColor}`,
            zIndex: 10,
            padding: '1px 4px',
            background: 'rgba(0,0,0,0.8)',
            borderRadius: '2px',
            whiteSpace: 'nowrap'
          }}
        >
          {concept.type.toUpperCase()}
        </motion.div>
      )}
      
      {/* Enhanced error indicator */}
      {showError && status === 'incorrect' && (
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ 
            scale: [1, 1.5, 1.2],
            rotate: [0, 15, -15, 0],
            opacity: [1, 0.7, 1]
          }}
          transition={{ 
            duration: 0.6,
            opacity: { repeat: 3, duration: 0.2 }
          }}
          style={{
            position: 'absolute',
            top: fullScreen ? '-18px' : '-14px',
            right: fullScreen ? '-18px' : '-14px',
            color: colors.performance.error.primary,
            fontSize: fullScreen ? '18px' : '16px',
            fontWeight: 'bold',
            textShadow: `0 0 8px ${colors.performance.error.glow}`,
            zIndex: 10
          }}
        >
          ✗
        </motion.div>
      )}

      {/* Concept completion ripple */}
      {status === 'correct' && concept && (
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{
            scale: [0, 3 + (upgrade.level * 0.5), 4 + (upgrade.level * 0.7)],
            opacity: [0.8, 0.4, 0]
          }}
          transition={{ duration: 1.5 + (upgrade.level * 0.2) }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${(fullScreen ? 50 : 40) + (upgrade.level * 8)}px`,
            height: `${(fullScreen ? 50 : 40) + (upgrade.level * 8)}px`,
            border: `2px solid ${blockStyle.borderColor}`,
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      )}
    </motion.div>
  );
});

EnhancedTypingBlock.displayName = 'EnhancedTypingBlock';