// Typing Block Component - Clean, reusable character block
import React from 'react';
import { motion } from 'framer-motion';
import { colors, getPerformanceColor } from '../../design/tokens/colors';
import { spacing } from '../../design/tokens/spacing';
import { typography } from '../../design/tokens/typography';
import { createPulseAnimation, createGlowAnimation } from '../../design/tokens/animations';

export const TypingBlock = ({
  char,
  status = 'pending',
  speed = 'lame',
  upgrade = { level: 0, speed: 'lame' },
  combo = 1,
  anticipationLevel = 1,
  onClick,
  style = {}
}) => {
  const getBlockStyle = () => {
    const performanceColors = getPerformanceColor(speed);
    
    switch (status) {
      case 'incorrect':
        return {
          background: colors.performance.error.gradient,
          borderColor: colors.performance.error.primary,
          boxShadow: colors.performance.error.shadow,
          color: '#fff'
        };
        
      case 'current':
        return {
          background: performanceColors.gradient,
          borderColor: performanceColors.glow,
          boxShadow: performanceColors.shadow,
          color: speed === 'perfect' || speed === 'best' ? '#000' : '#fff'
        };
        
      case 'correct':
        const upgradeMultiplier = 1 + (upgrade.level * 0.3);
        return {
          background: performanceColors.gradient,
          borderColor: performanceColors.glow,
          boxShadow: performanceColors.shadow,
          color: speed === 'perfect' || speed === 'best' ? '#fff' : '#000'
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
    const baseProps = {
      scale: status === 'current' ? 1.2 + (anticipationLevel * 0.1) : 
             status === 'correct' ? 1.1 + (upgrade.level * 0.05) : 1,
      opacity: status === 'pending' ? 0.4 : 1
    };
    
    if (status === 'current') {
      return {
        ...baseProps,
        ...createPulseAnimation(anticipationLevel, anticipationLevel),
        ...createGlowAnimation(getPerformanceColor(speed).glow, anticipationLevel, anticipationLevel)
      };
    }
    
    if (status === 'correct') {
      const intensity = 1 + (upgrade.level * 0.2);
      return {
        ...baseProps,
        scale: [1, 1.2 + (intensity * 0.1), 1.1 + (intensity * 0.05)],
        rotate: [0, 3 * intensity, 0]
      };
    }
    
    if (status === 'incorrect') {
      return {
        ...baseProps,
        scale: [1, 1.2, 0.9, 1.1, 1],
        rotate: [0, -3, 3, -2, 0],
        x: [0, -2, 2, -1, 0]
      };
    }
    
    return baseProps;
  };
  
  const blockStyle = getBlockStyle();
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0.6 }}
      animate={getAnimationProps()}
      whileHover={{ scale: 1.05, y: -2 }}
      onClick={onClick}
      style={{
        display: 'inline-block',
        width: char === ' ' ? '12px' : spacing.component.blockChar.width,
        height: spacing.component.blockChar.height,
        margin: spacing.component.blockChar.margin,
        border: `2px solid ${blockStyle.borderColor}`,
        borderRadius: '6px',
        textAlign: 'center',
        lineHeight: '24px',
        fontFamily: typography.fonts.mono,
        fontSize: typography.sizes.base,
        fontWeight: typography.weights.bold,
        cursor: 'pointer',
        position: 'relative',
        userSelect: 'none',
        ...blockStyle,
        ...style
      }}
    >
      {char === ' ' ? '' : char === '\n' ? '↵' : char}
      
      {/* Upgrade indicator */}
      {status === 'correct' && upgrade.level > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 0.8, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: `${8 + (upgrade.level * 2)}px`,
            height: `${8 + (upgrade.level * 2)}px`,
            background: blockStyle.borderColor,
            borderRadius: '50%',
            boxShadow: `0 0 ${10 + (upgrade.level * 5)}px ${blockStyle.borderColor}`,
            zIndex: 10
          }}
        />
      )}
      
      {/* Speed indicator for current character */}
      {status === 'current' && speed !== 'lame' && (
        <motion.div
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity
          }}
          style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: typography.sizes.xs,
            color: blockStyle.borderColor,
            fontWeight: typography.weights.bold,
            textShadow: `0 0 5px ${blockStyle.borderColor}`,
            zIndex: 10
          }}
        >
          {speed.toUpperCase()}
        </motion.div>
      )}
      
      {/* Error indicator */}
      {status === 'incorrect' && (
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ 
            scale: [1, 1.5, 1.2],
            rotate: [0, 10, -10, 0],
            opacity: [1, 0.7, 1]
          }}
          transition={{ 
            duration: 0.6,
            opacity: { repeat: 2, duration: 0.2 }
          }}
          style={{
            position: 'absolute',
            top: '-12px',
            right: '-12px',
            color: colors.performance.error.primary,
            fontSize: '18px',
            fontWeight: typography.weights.bold,
            textShadow: `0 0 10px ${colors.performance.error.primary}`,
            zIndex: 10
          }}
        >
          ✗
        </motion.div>
      )}
    </motion.div>
  );
};