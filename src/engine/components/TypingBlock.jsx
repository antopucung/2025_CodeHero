// Enhanced Typing Block Component - Optimized for performance and responsiveness
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { colors, getPerformanceColor } from '../../design/tokens/colors';
import { spacing } from '../../design/tokens/spacing';
import { typography } from '../../design/tokens/typography';

export const TypingBlock = memo(({
  char,
  status = 'pending',
  speed = 'lame',
  upgrade = { level: 0, speed: 'lame' },
  combo = 1,
  anticipationLevel = 1,
  onClick,
  style = {},
  showError = false
}) => {
  const getBlockStyle = () => {
    const performanceColors = getPerformanceColor(speed);
    
    switch (status) {
      case 'incorrect':
        return {
          background: colors.performance.error.gradient,
          borderColor: colors.performance.error.primary,
          boxShadow: `0 0 15px ${colors.performance.error.primary}`,
          color: '#fff'
        };
        
      case 'current':
        return {
          background: 'transparent',
          borderColor: colors.primary[500],
          boxShadow: `0 0 8px ${colors.primary[500]}`,
          color: colors.primary[500]
        };
        
      case 'correct':
        // Stable colors based on combo level - no random blinking
        const comboColor = combo >= 50 ? colors.performance.perfect.primary :
                          combo >= 30 ? colors.performance.best.primary :
                          combo >= 20 ? colors.performance.good.primary :
                          combo >= 10 ? colors.combo.triple :
                          colors.combo.basic;
        
        return {
          background: `linear-gradient(135deg, ${comboColor}22, ${comboColor}11)`,
          borderColor: comboColor,
          boxShadow: `0 0 ${5 + Math.min(combo / 10, 10)}px ${comboColor}`,
          color: comboColor
        };
        
      default:
        return {
          background: 'transparent',
          borderColor: colors.terminal.border,
          color: colors.terminal.textSecondary
        };
    }
  };
  
  const getAnimationProps = () => {
    // Minimal animations for performance
    if (status === 'current') {
      return {
        scale: 1,
        opacity: 1,
        transition: { duration: 0.1 }
      };
    }
    
    if (status === 'correct') {
      return {
        scale: 1,
        opacity: 1,
        transition: { duration: 0.15 }
      };
    }
    
    if (status === 'incorrect') {
      return {
        scale: [1, 1.1, 1],
        x: [0, -2, 2, 0],
        transition: { duration: 0.2 }
      };
    }
    
    return {
      scale: 1,
      opacity: status === 'pending' ? 0.4 : 1,
      transition: { duration: 0.1 }
    };
  };
  
  const blockStyle = getBlockStyle();
  
  // Fixed dimensions for consistent spacing
  const isSpace = char === ' ';
  const width = isSpace ? '8px' : '16px';
  const height = '20px';
  
  return (
    <motion.div
      animate={getAnimationProps()}
      onClick={onClick}
      style={{
        display: 'inline-block',
        width,
        height,
        margin: '1px',
        border: `1px solid ${blockStyle.borderColor}`,
        borderRadius: '2px',
        textAlign: 'center',
        lineHeight: '18px',
        fontFamily: typography.fonts.mono,
        fontSize: '12px',
        fontWeight: typography.weights.bold,
        cursor: 'pointer',
        position: 'relative',
        userSelect: 'none',
        verticalAlign: 'top',
        ...blockStyle,
        ...style
      }}
    >
      {isSpace ? '' : char === '\n' ? '↵' : char}
      
      {/* Error X indicator - only show when explicitly set */}
      {showError && status === 'incorrect' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 1],
            opacity: [0, 1, 0.8],
            rotate: [0, 180, 0]
          }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            color: colors.performance.error.primary,
            fontSize: '14px',
            fontWeight: typography.weights.bold,
            textShadow: `0 0 5px ${colors.performance.error.primary}`,
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          ✗
        </motion.div>
      )}
      
      {/* Combo bonus indicator */}
      {status === 'correct' && combo >= 20 && (
        <motion.div
          initial={{ scale: 0, y: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            y: [0, -15, -12]
          }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '8px',
            color: colors.combo.perfect,
            fontWeight: typography.weights.bold,
            textShadow: `0 0 3px ${colors.combo.perfect}`,
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          ⭐
        </motion.div>
      )}
    </motion.div>
  );
});

TypingBlock.displayName = 'TypingBlock';