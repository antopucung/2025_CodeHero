// Enhanced Typing Block with better background fade and code-aware styling
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { colors, getTypingStateColor, muscleMemoryColors } from '../../design/tokens/colors';
import { spacing } from '../../design/tokens/spacing';
import { typography } from '../../design/tokens/typography';

export const TypingBlock = memo(({
  char,
  status = 'pending',
  speed = 'slow',
  upgrade = { level: 0, speed: 'slow' },
  combo = 1,
  anticipationLevel = 1,
  onClick,
  style = {},
  showError = false,
  fullScreen = false,
  isNewline = false,
  indentLevel = 0,
  syntaxType = 'text'
}) => {
  const getBlockStyle = () => {
    // Get base color from psychology system
    const stateColor = getTypingStateColor(status, speed, combo);
    
    // Apply muscle memory colors for specific character types
    const muscleMemoryColor = getMuscleMemoryColor(char, syntaxType);
    
    // Enhanced background fade for better readability
    const getBackgroundOpacity = () => {
      switch (status) {
        case 'incorrect': return 0.95;
        case 'current': return 0.85;
        case 'correct': return 0.25; // More fade for completed characters
        default: return 0.08; // Much more fade for pending
      }
    };
    
    switch (status) {
      case 'incorrect':
        return {
          background: `rgba(229, 62, 62, ${getBackgroundOpacity()})`,
          borderColor: colors.performance.error.primary,
          boxShadow: `0 0 8px rgba(229, 62, 62, 0.6)`,
          color: '#FFFFFF'
        };
        
      case 'current':
        // Enhanced anticipation with muscle memory hints
        const anticipationIntensity = Math.min(anticipationLevel * 1.5, 2.5);
        return {
          background: `rgba(49, 130, 206, ${getBackgroundOpacity()})`,
          borderColor: stateColor.primary,
          boxShadow: `0 0 ${12 * anticipationIntensity}px rgba(49, 130, 206, 0.8), inset 0 0 8px rgba(255,255,255,0.1)`,
          color: '#FFFFFF',
          // Subtle muscle memory hint
          borderBottom: muscleMemoryColor ? `2px solid ${muscleMemoryColor}` : undefined
        };
        
      case 'correct':
        // Success state with much more fade
        const comboIntensity = Math.min(1 + (combo / 25), 1.8);
        const upgradeGlow = upgrade.level > 0 ? upgrade.level * 3 : 0;
        
        return {
          background: `rgba(56, 161, 105, ${getBackgroundOpacity()})`,
          borderColor: `rgba(56, 161, 105, 0.4)`,
          boxShadow: `0 0 ${(8 + upgradeGlow) * comboIntensity}px rgba(56, 161, 105, 0.3)`,
          color: stateColor.primary,
          // Success reinforcement
          borderTop: `1px solid rgba(56, 161, 105, 0.6)`
        };
        
      default: // pending
        return {
          background: `rgba(74, 85, 104, ${getBackgroundOpacity()})`,
          borderColor: `rgba(113, 128, 150, 0.2)`,
          color: colors.terminal.textMuted,
          // Subtle muscle memory preview
          borderBottom: muscleMemoryColor ? `1px solid ${muscleMemoryColor}22` : undefined
        };
    }
  };
  
  const getMuscleMemoryColor = (char, syntaxType) => {
    if (!char || char === ' ' || char === '\n') return null;
    
    // Syntax-based coloring for code awareness
    if (syntaxType) {
      switch (syntaxType) {
        case 'keyword': return muscleMemoryColors.syntax.keywords;
        case 'string': return muscleMemoryColors.syntax.strings;
        case 'number': return muscleMemoryColors.syntax.numbers;
        case 'operator': return muscleMemoryColors.syntax.operators;
        case 'bracket': return muscleMemoryColors.syntax.brackets;
        case 'comment': return muscleMemoryColors.syntax.comments;
      }
    }
    
    const lowerChar = char.toLowerCase();
    
    // Vowels - important for rhythm
    if ('aeiou'.includes(lowerChar)) {
      return muscleMemoryColors.keyTypes.vowels;
    }
    
    // Numbers - special attention
    if ('0123456789'.includes(char)) {
      return muscleMemoryColors.keyTypes.numbers;
    }
    
    // Common programming symbols
    if ('(){}[]<>'.includes(char)) {
      return muscleMemoryColors.syntax.brackets;
    }
    
    if ('+-*/=!&|'.includes(char)) {
      return muscleMemoryColors.syntax.operators;
    }
    
    if ('"\'`'.includes(char)) {
      return muscleMemoryColors.syntax.strings;
    }
    
    // Default consonants
    if (/[a-z]/i.test(char)) {
      return muscleMemoryColors.keyTypes.consonants;
    }
    
    // Other symbols
    return muscleMemoryColors.keyTypes.symbols;
  };
  
  const getAnimationProps = () => {
    if (status === 'current') {
      // Dynamic pulsing based on anticipation
      const pulseScale = 1 + (anticipationLevel * 0.06);
      return {
        scale: [1, pulseScale, 1],
        transition: { 
          duration: Math.max(0.5, 0.9 / anticipationLevel), 
          repeat: Infinity,
          ease: "easeInOut"
        }
      };
    }
    
    if (status === 'correct') {
      // Success celebration with upgrade effects
      const intensity = 1 + (upgrade.level * 0.12);
      return {
        scale: [1, 1.2 + (intensity * 0.06), 1.06 + (intensity * 0.02)],
        rotate: [0, 2 * intensity, 0],
        transition: { duration: 0.4 }
      };
    }
    
    if (status === 'incorrect') {
      // Error feedback - clear but not overwhelming
      return {
        scale: [1, 1.12, 0.96, 1.04, 1],
        rotate: [0, -2, 2, -1, 0],
        x: [0, -1, 1, -0.5, 0],
        transition: { duration: 0.35 }
      };
    }
    
    return {
      scale: 1,
      opacity: status === 'pending' ? 0.7 : 1,
      transition: { duration: 0.12 }
    };
  };
  
  const blockStyle = getBlockStyle();
  
  // Handle special characters for code layout
  const isSpace = char === ' ';
  const isTab = char === '\t';
  const isNewlineChar = char === '\n' || isNewline;
  
  // Responsive dimensions with code-aware sizing
  const getCharacterDimensions = () => {
    if (isNewlineChar) {
      return {
        width: fullScreen ? '24px' : '20px',
        height: fullScreen ? '26px' : '22px',
        display: 'inline-block'
      };
    }
    
    if (isTab) {
      return {
        width: fullScreen ? '32px' : '28px', // Tab is wider
        height: fullScreen ? '26px' : '22px',
        display: 'inline-block'
      };
    }
    
    if (isSpace) {
      return {
        width: fullScreen ? '12px' : '10px',
        height: fullScreen ? '26px' : '22px',
        display: 'inline-block'
      };
    }
    
    return {
      width: fullScreen ? '20px' : '17px',
      height: fullScreen ? '26px' : '22px',
      display: 'inline-block'
    };
  };
  
  const dimensions = getCharacterDimensions();
  const fontSize = fullScreen ? '14px' : '12px';
  const lineHeight = fullScreen ? '24px' : '20px';
  
  return (
    <motion.div
      animate={getAnimationProps()}
      onClick={onClick}
      style={{
        ...dimensions,
        margin: fullScreen ? '1px 0.5px' : '1px 0.5px',
        border: `1px solid ${blockStyle.borderColor}`,
        borderRadius: fullScreen ? '4px' : '3px',
        textAlign: 'center',
        lineHeight,
        fontFamily: typography.fonts.mono,
        fontSize,
        fontWeight: typography.weights.bold,
        cursor: 'pointer',
        position: 'relative',
        userSelect: 'none',
        verticalAlign: 'top',
        ...blockStyle,
        ...style
      }}
    >
      {isSpace ? '' : isTab ? '→' : isNewlineChar ? '↵' : char}
      
      {/* Enhanced upgrade indicator */}
      {status === 'correct' && upgrade.level > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.6, 0],
            opacity: [1, 0.8, 0],
            rotate: [0, 160, 320]
          }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: `${8 + (upgrade.level * 1.5)}px`,
            height: `${8 + (upgrade.level * 1.5)}px`,
            background: `radial-gradient(circle, ${blockStyle.borderColor}, ${blockStyle.borderColor}aa)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${10 + (upgrade.level * 2)}px ${blockStyle.borderColor}`,
            zIndex: 10
          }}
        />
      )}
      
      {/* Speed indicator */}
      {status === 'current' && speed !== 'slow' && (
        <motion.div
          animate={{
            opacity: [0.5, 0.9, 0.5],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 0.7,
            repeat: Infinity
          }}
          style={{
            position: 'absolute',
            top: fullScreen ? '-16px' : '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: fullScreen ? '9px' : '7px',
            color: colors.performance[speed]?.primary || blockStyle.borderColor,
            fontWeight: 'bold',
            textShadow: `0 0 4px ${colors.performance[speed]?.glow || blockStyle.borderColor}`,
            zIndex: 10,
            padding: '1px 3px',
            background: 'rgba(0,0,0,0.8)',
            borderRadius: '2px'
          }}
        >
          {speed.toUpperCase()}
        </motion.div>
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

      {/* Success ripple effects */}
      {status === 'correct' && (
        <motion.div
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{
            scale: [0, 2 + (upgrade.level * 0.2), 3 + (upgrade.level * 0.3)],
            opacity: [0.6, 0.4, 0]
          }}
          transition={{ duration: 1 + (upgrade.level * 0.15) }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${(fullScreen ? 40 : 30) + (upgrade.level * 6)}px`,
            height: `${(fullScreen ? 40 : 30) + (upgrade.level * 6)}px`,
            border: `1px solid ${blockStyle.borderColor}`,
            borderRadius: '50%',
            pointerEvents: 'none'
          }}
        />
      )}
    </motion.div>
  );
});

TypingBlock.displayName = 'TypingBlock';