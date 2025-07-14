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
  fullScreen = false
}) => {
  const getBlockStyle = () => {
    // Get base color from psychology system
    const stateColor = getTypingStateColor(status, speed, combo);
    
    // Apply muscle memory colors for specific character types
    const muscleMemoryColor = getMuscleMemoryColor(char);
    
    switch (status) {
      case 'incorrect':
        return {
          background: colors.performance.error.gradient,
          borderColor: colors.performance.error.primary,
          boxShadow: `0 0 15px ${colors.performance.error.glow}`,
          color: '#FFFFFF'
        };
        
      case 'current':
        // Enhanced anticipation with muscle memory hints
        const anticipationIntensity = Math.min(anticipationLevel * 2, 3);
        return {
          background: stateColor.gradient || `linear-gradient(135deg, ${stateColor.primary}, ${stateColor.secondary || stateColor.primary}cc)`,
          borderColor: stateColor.primary,
          boxShadow: `0 0 ${15 * anticipationIntensity}px ${stateColor.glow}, inset 0 0 10px rgba(255,255,255,0.1)`,
          color: '#FFFFFF',
          // Subtle muscle memory hint
          borderBottom: muscleMemoryColor ? `3px solid ${muscleMemoryColor}` : undefined
        };
        
      case 'correct':
        // Success state with combo progression
        const comboIntensity = Math.min(1 + (combo / 20), 2);
        const upgradeGlow = upgrade.level > 0 ? upgrade.level * 5 : 0;
        
        return {
          background: `linear-gradient(135deg, ${stateColor.primary}44, ${stateColor.primary}22)`,
          borderColor: stateColor.primary,
          boxShadow: `0 0 ${(12 + upgradeGlow) * comboIntensity}px ${stateColor.glow}`,
          color: stateColor.primary,
          // Success reinforcement
          borderTop: `2px solid ${stateColor.primary}`
        };
        
      default: // pending
        return {
          background: 'rgba(74, 85, 104, 0.05)',
          borderColor: colors.terminal.border,
          color: colors.terminal.textMuted,
          // Subtle muscle memory preview
          borderBottom: muscleMemoryColor ? `1px solid ${muscleMemoryColor}33` : undefined
        };
    }
  };
  
  const getMuscleMemoryColor = (char) => {
    if (!char || char === ' ' || char === '\n') return null;
    
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
      // Dynamic pulsing based on anticipation and muscle memory
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
      // Success celebration with upgrade effects
      const intensity = 1 + (upgrade.level * 0.15);
      return {
        scale: [1, 1.25 + (intensity * 0.08), 1.08 + (intensity * 0.03)],
        rotate: [0, 3 * intensity, 0],
        transition: { duration: 0.5 }
      };
    }
    
    if (status === 'incorrect') {
      // Error feedback - clear but not overwhelming
      return {
        scale: [1, 1.15, 0.95, 1.05, 1],
        rotate: [0, -3, 3, -2, 0],
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
  
  // Responsive dimensions
  const isSpace = char === ' ';
  const width = isSpace ? (fullScreen ? '12px' : '8px') : (fullScreen ? '22px' : '18px');
  const height = fullScreen ? '28px' : '24px';
  const fontSize = fullScreen ? '15px' : '13px';
  const lineHeight = fullScreen ? '26px' : '22px';
  
  return (
    <motion.div
      animate={getAnimationProps()}
      onClick={onClick}
      style={{
        display: 'inline-block',
        width,
        height,
        margin: fullScreen ? '2px 1px' : '1px',
        border: `2px solid ${blockStyle.borderColor}`,
        borderRadius: fullScreen ? '6px' : '4px',
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
      {isSpace ? '' : char === '\n' ? '↵' : char}
      
      {/* Enhanced upgrade indicator with psychology colors */}
      {status === 'correct' && upgrade.level > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.8, 0],
            opacity: [1, 0.9, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 1.2 }}
          style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            width: `${10 + (upgrade.level * 2)}px`,
            height: `${10 + (upgrade.level * 2)}px`,
            background: `radial-gradient(circle, ${blockStyle.borderColor}, ${blockStyle.borderColor}aa)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${12 + (upgrade.level * 3)}px ${blockStyle.borderColor}`,
            zIndex: 10
          }}
        />
      )}
      
      {/* Speed indicator with psychology-based colors */}
      {status === 'current' && speed !== 'slow' && (
        <motion.div
          animate={{
            opacity: [0.4, 0.9, 0.4],
            scale: [1, 1.15, 1]
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
            fontSize: fullScreen ? '10px' : '8px',
            color: colors.performance[speed]?.primary || blockStyle.borderColor,
            fontWeight: 'bold',
            textShadow: `0 0 6px ${colors.performance[speed]?.glow || blockStyle.borderColor}`,
            zIndex: 10,
            padding: '1px 4px',
            background: 'rgba(0,0,0,0.7)',
            borderRadius: '3px'
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
            scale: [1, 1.6, 1.2],
            rotate: [0, 12, -12, 0],
            opacity: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 0.6,
            opacity: { repeat: 2, duration: 0.25 }
          }}
          style={{
            position: 'absolute',
            top: fullScreen ? '-18px' : '-14px',
            right: fullScreen ? '-18px' : '-14px',
            color: colors.performance.error.primary,
            fontSize: fullScreen ? '20px' : '16px',
            fontWeight: 'bold',
            textShadow: `0 0 8px ${colors.performance.error.glow}`,
            zIndex: 10
          }}
        >
          ✗
        </motion.div>
      )}

      {/* Success ripple effects with psychology-based timing */}
      {status === 'correct' && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{
              scale: [0, 2.2 + (upgrade.level * 0.3), 3.5 + (upgrade.level * 0.5)],
              opacity: [0.8, 0.5, 0]
            }}
            transition={{ duration: 1.2 + (upgrade.level * 0.2) }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${(fullScreen ? 50 : 35) + (upgrade.level * 8)}px`,
              height: `${(fullScreen ? 50 : 35) + (upgrade.level * 8)}px`,
              border: `2px solid ${blockStyle.borderColor}`,
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
          
          {/* Additional ripple for high upgrades */}
          {upgrade.level >= 2 && (
            <motion.div
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{
                scale: [0, 1.8, 3],
                opacity: [0.6, 0.3, 0]
              }}
              transition={{ duration: 1.5, delay: 0.2 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${(fullScreen ? 70 : 50) + (upgrade.level * 12)}px`,
                height: `${(fullScreen ? 70 : 50) + (upgrade.level * 12)}px`,
                border: `3px solid ${blockStyle.borderColor}`,
                borderRadius: '50%',
                pointerEvents: 'none'
              }}
            />
          )}
        </>
      )}
    </motion.div>
  );
});

TypingBlock.displayName = 'TypingBlock';