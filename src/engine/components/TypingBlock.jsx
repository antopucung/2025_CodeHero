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
  showError = false,
  fullScreen = false
}) => {
  const getBlockStyle = () => {
    switch (status) {
      case 'incorrect':
        return {
          background: 'linear-gradient(45deg, #ff1744, #ff4569, #ff1744)',
          borderColor: '#ff1744',
          boxShadow: `0 0 15px #ff1744`,
          color: '#fff'
        };
        
      case 'current':
        // Dynamic anticipation colors based on typing speed prediction
        const anticipationColors = {
          perfect: { bg: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 50%, #ff6b6b 100%)', glow: '#ff6b6b' },
          best: { bg: 'linear-gradient(135deg, #ffd93d 0%, #ffed4e 50%, #ffd93d 100%)', glow: '#ffd93d' },
          good: { bg: 'linear-gradient(135deg, #4ecdc4 0%, #5ed9d1 50%, #4ecdc4 100%)', glow: '#4ecdc4' },
          lame: { bg: 'linear-gradient(135deg, #00ff00 0%, #00e676 50%, #00ff00 100%)', glow: '#00ff00' }
        };
        
        const currentColors = anticipationColors[speed] || anticipationColors.lame;
        const pulseIntensity = anticipationLevel * 2;
        
        return {
          background: currentColors.bg,
          borderColor: currentColors.glow,
          boxShadow: `0 0 ${15 * pulseIntensity}px ${currentColors.glow}`,
          color: speed === 'perfect' || speed === 'best' ? '#000' : '#fff'
        };
        
      case 'correct':
        // Stable colors based on combo level with upgrade effects
        const comboColor = combo >= 50 ? '#ff6b6b' :
                          combo >= 30 ? '#ffd93d' :
                          combo >= 20 ? '#6bcf7f' :
                          combo >= 10 ? '#4ecdc4' :
                          '#45b7d1';
        
        const upgradeMultiplier = 1 + (upgrade.level * 0.3);
        
        return {
          background: `linear-gradient(135deg, ${comboColor}44, ${comboColor}22)`,
          borderColor: comboColor,
          boxShadow: `0 0 ${(8 + Math.min(combo / 5, 15)) * upgradeMultiplier}px ${comboColor}`,
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
    if (status === 'current') {
      // Dynamic pulsing based on anticipation
      const pulseScale = 1 + (anticipationLevel * 0.1);
      return {
        scale: [1, pulseScale, 1],
        transition: { 
          duration: 0.6 / Math.max(1, anticipationLevel), 
          repeat: Infinity,
          ease: "easeInOut"
        }
      };
    }
    
    if (status === 'correct') {
      // Explosive success animation
      const intensity = 1 + (upgrade.level * 0.2);
      return {
        scale: [1, 1.3 + (intensity * 0.1), 1.1 + (intensity * 0.05)],
        rotate: [0, 5 * intensity, 0],
        transition: { duration: 0.6 }
      };
    }
    
    if (status === 'incorrect') {
      // Error shake animation
      return {
        scale: [1, 1.2, 0.9, 1.1, 1],
        rotate: [0, -5, 5, -3, 0],
        x: [0, -3, 3, -2, 0],
        transition: { duration: 0.4 }
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
  const width = isSpace ? (fullScreen ? '12px' : '8px') : (fullScreen ? '24px' : '16px');
  const height = fullScreen ? '30px' : '20px';
  const fontSize = fullScreen ? '16px' : '12px';
  const lineHeight = fullScreen ? '28px' : '18px';
  
  return (
    <motion.div
      animate={getAnimationProps()}
      onClick={onClick}
      style={{
        display: 'inline-block',
        width,
        height,
        margin: fullScreen ? '2px' : '1px',
        border: `1px solid ${blockStyle.borderColor}`,
        borderRadius: fullScreen ? '4px' : '2px',
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
      
      {/* Enhanced upgrade indicator */}
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
            width: `${(fullScreen ? 12 : 8) + (upgrade.level * 2)}px`,
            height: `${(fullScreen ? 12 : 8) + (upgrade.level * 2)}px`,
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
            top: fullScreen ? '-16px' : '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: fullScreen ? '10px' : '8px',
            color: blockStyle.borderColor,
            fontWeight: 'bold',
            textShadow: `0 0 5px ${blockStyle.borderColor}`,
            zIndex: 10
          }}
        >
          {speed.toUpperCase()}
        </motion.div>
      )}
      
      {/* Error X indicator with enhanced animation */}
      {showError && status === 'incorrect' && (
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ 
            scale: [1, 1.8, 1.3],
            rotate: [0, 15, -15, 0],
            opacity: [1, 0.7, 1]
          }}
          transition={{ 
            duration: 0.8,
            opacity: { repeat: 3, duration: 0.2 }
          }}
          style={{
            position: 'absolute',
            top: fullScreen ? '-16px' : '-12px',
            right: fullScreen ? '-16px' : '-12px',
            color: '#ff1744',
            fontSize: fullScreen ? '24px' : '18px',
            fontWeight: 'bold',
            textShadow: '0 0 10px #ff1744',
            zIndex: 10
          }}
        >
          ✗
        </motion.div>
      )}

      {/* Enhanced wave ripple effect for correct typing */}
      {status === 'correct' && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{
              scale: [0, 2 + (upgrade.level * 0.3), 3 + (upgrade.level * 0.5)],
              opacity: [0.8, 0.4, 0]
            }}
            transition={{ duration: 1 + (upgrade.level * 0.2) }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${(fullScreen ? 60 : 40) + (upgrade.level * 10)}px`,
              height: `${(fullScreen ? 60 : 40) + (upgrade.level * 10)}px`,
              border: `2px solid ${blockStyle.borderColor}`,
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
          
          {/* Additional upgrade ripples */}
          {upgrade.level >= 2 && (
            <motion.div
              initial={{ scale: 0, opacity: 0.6 }}
              animate={{
                scale: [0, 1.5, 2.5],
                opacity: [0.6, 0.3, 0]
              }}
              transition={{ duration: 1.2, delay: 0.2 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${(fullScreen ? 90 : 60) + (upgrade.level * 15)}px`,
                height: `${(fullScreen ? 90 : 60) + (upgrade.level * 15)}px`,
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