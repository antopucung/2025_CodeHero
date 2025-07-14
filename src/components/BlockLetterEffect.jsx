import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@chakra-ui/react';

// Juicy block letter typing effect with wave springs and gradients
export const BlockLetterTyping = ({ text, currentIndex, getCharacterStatus, onCharacterClick, combo = 1 }) => {
  const [waveOffset, setWaveOffset] = useState(0);
  const [comboLevel, setComboLevel] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => (prev + 0.15) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getComboColors = (combo) => {
    // GOD COMBO (50+) - Legendary Red Hot
    if (combo >= 50) return {
      bg: 'linear-gradient(135deg, #ff1744 0%, #ff6b6b 25%, #ff8a80 50%, #ff6b6b 75%, #ff1744 100%)',
      border: '#ff1744',
      glow: '#ff1744',
      shadow: '0 0 40px #ff1744, 0 0 20px #ff6b6b, inset 0 0 20px rgba(255, 23, 68, 0.4)',
      textColor: '#fff',
      intensity: 3
    };
    // PERFECT COMBO (30-49) - Golden Glory
    if (combo >= 30) return {
      bg: 'linear-gradient(135deg, #ffc107 0%, #ffd93d 25%, #ffeb3b 50%, #ffd93d 75%, #ffc107 100%)',
      border: '#ffc107',
      glow: '#ffd93d',
      shadow: '0 0 35px #ffd93d, 0 0 15px #ffc107, inset 0 0 15px rgba(255, 217, 61, 0.4)',
      textColor: '#000',
      intensity: 2.5
    };
    // TRIPLE COMBO (20-29) - Emerald Excellence
    if (combo >= 20) return {
      bg: 'linear-gradient(135deg, #4caf50 0%, #6bcf7f 25%, #81c784 50%, #6bcf7f 75%, #4caf50 100%)',
      border: '#4caf50',
      glow: '#6bcf7f',
      shadow: '0 0 30px #6bcf7f, 0 0 12px #4caf50, inset 0 0 12px rgba(107, 207, 127, 0.3)',
      textColor: '#000',
      intensity: 2
    };
    // DOUBLE COMBO (10-19) - Cyan Power
    if (combo >= 10) return {
      bg: 'linear-gradient(135deg, #00bcd4 0%, #4ecdc4 25%, #80deea 50%, #4ecdc4 75%, #00bcd4 100%)',
      border: '#00bcd4',
      glow: '#4ecdc4',
      shadow: '0 0 25px #4ecdc4, 0 0 10px #00bcd4, inset 0 0 10px rgba(78, 205, 196, 0.3)',
      textColor: '#000',
      intensity: 1.8
    };
    // COMBO START (5-9) - Blue Boost
    if (combo >= 5) return {
      bg: 'linear-gradient(135deg, #2196f3 0%, #45b7d1 25%, #64b5f6 50%, #45b7d1 75%, #2196f3 100%)',
      border: '#2196f3',
      glow: '#45b7d1',
      shadow: '0 0 20px #45b7d1, 0 0 8px #2196f3, inset 0 0 8px rgba(69, 183, 209, 0.3)',
      textColor: '#fff',
      intensity: 1.5
    };
    // BASIC (1-4) - Fresh Green
    return {
      bg: 'linear-gradient(135deg, #00e676 0%, #00ff00 25%, #69f0ae 50%, #00ff00 75%, #00e676 100%)',
      border: '#00e676',
      glow: '#00ff00',
      shadow: '0 0 15px #00ff00, 0 0 6px #00e676, inset 0 0 6px rgba(0, 255, 0, 0.3)',
      textColor: '#000',
      intensity: 1
    };
  };

  const getErrorColors = () => ({
    bg: 'linear-gradient(45deg, #ff1744, #ff4569, #ff1744)',
    border: '#ff1744',
    glow: '#ff1744',
    shadow: '0 0 30px #ff1744, inset 0 0 20px rgba(255, 23, 68, 0.4)'
  });

  const getCurrentColors = () => ({
    bg: 'linear-gradient(135deg, #ffeb3b 0%, #fff176 25%, #ffff8d 50%, #fff176 75%, #ffeb3b 100%)',
    border: '#ffeb3b',
    glow: '#ffeb3b',
    shadow: '0 0 25px #ffeb3b, inset 0 0 15px rgba(255, 235, 59, 0.4)',
    textColor: '#000',
    intensity: 1.2
  });

  const renderCharacter = (char, index) => {
    const status = getCharacterStatus(index);
    const isActive = index === currentIndex;
    const currentCombo = combo || 1;
    
    let colors;
    if (status === 'incorrect') colors = getErrorColors();
    else if (status === 'current') colors = getCurrentColors();
    else if (status === 'correct') colors = getComboColors(currentCombo);
    else colors = { bg: 'transparent', border: '#333', glow: 'transparent', shadow: 'none' };
    
    // Wave effect for active character
    const waveY = isActive ? Math.sin(waveOffset + index * 0.4) * 4 : 0;
    const waveScale = isActive ? 1 + Math.sin(waveOffset * 2) * 0.1 : 1;
    
    // Spring effect for correct characters
    const getAnimateProps = () => {
      const baseProps = {
        scale: status === 'current' ? waveScale * 1.2 : 
               status === 'correct' ? 1.1 : 
               status === 'incorrect' ? 1 : 1,
        opacity: status === 'pending' ? 0.4 : 1,
        y: waveY,
        background: colors.bg,
        borderColor: colors.border,
        boxShadow: colors.shadow,
        color: colors.textColor || '#000'
      };

      if (status === 'correct') {
        const intensity = colors.intensity || 1;
        return {
          ...baseProps,
          scale: [1, 1.2 + (intensity * 0.1), 1.1 + (intensity * 0.05)],
          rotate: [0, 3 * intensity, 0],
          y: [waveY, waveY - (4 * intensity), waveY - (2 * intensity)],
          boxShadow: [
            colors.shadow,
            `${colors.shadow}, 0 0 ${30 * intensity}px ${colors.glow}`,
            colors.shadow
          ]
        };
      }

      if (status === 'incorrect') {
        return {
          ...baseProps,
          scale: [1, 1.2, 0.9, 1.1, 1],
          rotate: [0, -3, 3, -2, 0]
        };
      }

      return baseProps;
    };

    const getTransitionProps = () => {
      if (status === 'correct' || status === 'incorrect') {
        return {
          duration: status === 'correct' ? 0.6 : 0.3
        };
      }
      
      return {
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20
      };
    };

    return (
      <motion.div
        key={index}
        initial={{ scale: 0.8, opacity: 0.6 }}
        animate={getAnimateProps()}
        transition={getTransitionProps()}
        whileHover={{ scale: 1.05, y: -2 }}
        onClick={() => onCharacterClick && onCharacterClick(index)}
        style={{
          display: 'inline-block',
          width: char === ' ' ? '12px' : '20px',
          height: '28px',
          margin: '3px 2px',
          border: `2px solid ${colors.border}`,
          borderRadius: '6px',
          textAlign: 'center',
          lineHeight: '24px',
          fontFamily: "'Courier New', monospace",
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          position: 'relative',
          userSelect: 'none',
          color: colors.textColor || (status === 'pending' ? '#666' : '#000')
        }}
      >
        {char === ' ' ? '' : char === '\n' ? '↵' : char}
        
        {/* Enhanced blinking gradient effect for current character */}
        {isActive && (
          <motion.div
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.15, 1],
              boxShadow: [
                `0 0 10px ${colors.glow}`,
                `0 0 30px ${colors.glow}, 0 0 15px ${colors.border}`,
                `0 0 10px ${colors.glow}`
              ]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: '-4px',
              left: '-4px',
              right: '-4px',
              bottom: '-4px',
              background: colors.bg,
              borderRadius: '8px',
              zIndex: -1,
              filter: 'blur(2px)'
            }}
          />
        )}
        
        {/* Enhanced combo celebration effect */}
        {status === 'correct' && currentCombo > 1 && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.5 + (currentCombo * 0.05), 0],
              opacity: [1, 0.8, 0],
              rotate: [0, 180 + (currentCombo * 10), 360 + (currentCombo * 10)]
            }}
            transition={{ 
              duration: 0.8 + (currentCombo * 0.02)
            }}
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              width: `${12 + (currentCombo * 0.5)}px`,
              height: `${12 + (currentCombo * 0.5)}px`,
              background: colors.glow,
              borderRadius: '50%',
              boxShadow: `0 0 ${15 + (currentCombo * 2)}px ${colors.glow}`
            }}
          />
        )}
        
        {/* Error X indicator with pulse */}
        {status === 'incorrect' && (
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: 0,
              opacity: [1, 0.7, 1]
            }}
            transition={{ 
              duration: 0.5,
              opacity: { repeat: 3, duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              top: '-12px',
              right: '-12px',
              color: '#ff1744',
              fontSize: '16px',
              fontWeight: 'bold',
              textShadow: '0 0 10px #ff1744',
              zIndex: 10
            }}
          >
            ✗
          </motion.div>
        )}

        {/* Wave ripple effect for correct typing */}
        {status === 'correct' && (
          <>
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{
              scale: [0, 2 + (currentCombo * 0.1), 3 + (currentCombo * 0.15)],
              opacity: [0.8, 0.4, 0]
            }}
            transition={{ duration: 1 + (currentCombo * 0.05) }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: `${40 + (currentCombo * 2)}px`,
              height: `${40 + (currentCombo * 2)}px`,
              border: `2px solid ${colors.glow}`,
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
          
          {/* Additional ripple for high combos */}
          {currentCombo >= 10 && (
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
                width: `${60 + (currentCombo * 3)}px`,
                height: `${60 + (currentCombo * 3)}px`,
                border: `3px solid ${colors.glow}`,
                borderRadius: '50%',
                pointerEvents: 'none'
              }}
            />
          )}
          </>
        )}
      </motion.div>
    );
  };

  return (
    <Box
      style={{
        lineHeight: '36px',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap'
      }}
    >
      {text.split('').map((char, index) => renderCharacter(char, index))}
    </Box>
  );
};

// Enhanced gradient wave background with combo effects
export const GradientWaveBackground = ({ isActive, intensity = 1, combo = 1 }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setTime(prev => prev + 0.08);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  const getGradient = (combo, time) => {
    const baseOpacity = 0.15 * intensity;
    const pulseOpacity = baseOpacity + Math.sin(time * 3) * 0.05;
    
    if (combo >= 50) {
      return `
        radial-gradient(circle at ${50 + Math.sin(time) * 20}% ${50 + Math.cos(time * 1.3) * 20}%, 
          rgba(255, 107, 107, ${pulseOpacity * 1.2}) 0%, 
          rgba(255, 20, 147, ${pulseOpacity * 0.8}) 30%, 
          rgba(255, 107, 107, ${pulseOpacity * 0.6}) 60%,
          transparent 100%),
        linear-gradient(${time * 45}deg, 
          rgba(255, 107, 107, ${pulseOpacity * 0.3}) 0%, 
          rgba(255, 20, 147, ${pulseOpacity * 0.2}) 50%, 
          rgba(255, 107, 107, ${pulseOpacity * 0.3}) 100%)
      `;
    } else if (combo >= 30) {
      return `
        radial-gradient(circle at ${50 + Math.sin(time * 1.2) * 15}% ${50 + Math.cos(time) * 15}%, 
          rgba(255, 217, 61, ${pulseOpacity}) 0%, 
          rgba(255, 193, 7, ${pulseOpacity * 0.7}) 40%, 
          transparent 80%),
        linear-gradient(${time * 35}deg, 
          rgba(255, 217, 61, ${pulseOpacity * 0.4}) 0%, 
          rgba(255, 193, 7, ${pulseOpacity * 0.2}) 50%, 
          rgba(255, 217, 61, ${pulseOpacity * 0.4}) 100%)
      `;
    } else if (combo >= 20) {
      return `
        radial-gradient(circle at ${50 + Math.sin(time * 0.8) * 12}% ${50 + Math.cos(time * 1.1) * 12}%, 
          rgba(107, 207, 127, ${pulseOpacity}) 0%, 
          rgba(76, 175, 80, ${pulseOpacity * 0.6}) 50%, 
          transparent 100%),
        linear-gradient(${time * 25}deg, 
          rgba(107, 207, 127, ${pulseOpacity * 0.3}) 0%, 
          rgba(76, 175, 80, ${pulseOpacity * 0.2}) 50%, 
          rgba(107, 207, 127, ${pulseOpacity * 0.3}) 100%)
      `;
    } else if (combo >= 10) {
      return `
        radial-gradient(circle at ${50 + Math.sin(time * 0.6) * 10}% ${50 + Math.cos(time * 0.9) * 10}%, 
          rgba(78, 205, 196, ${pulseOpacity}) 0%, 
          rgba(0, 188, 212, ${pulseOpacity * 0.6}) 60%, 
          transparent 100%),
        linear-gradient(${time * 20}deg, 
          rgba(78, 205, 196, ${pulseOpacity * 0.2}) 0%, 
          rgba(0, 188, 212, ${pulseOpacity * 0.15}) 50%, 
          rgba(78, 205, 196, ${pulseOpacity * 0.2}) 100%)
      `;
    }
    
    return `
      radial-gradient(circle at ${50 + Math.sin(time * 0.5) * 8}% ${50 + Math.cos(time * 0.7) * 8}%, 
        rgba(0, 255, 0, ${pulseOpacity}) 0%, 
        rgba(0, 255, 255, ${pulseOpacity * 0.5}) 70%, 
        transparent 100%),
      linear-gradient(${time * 15}deg, 
        rgba(0, 255, 0, ${pulseOpacity * 0.2}) 0%, 
        rgba(0, 255, 255, ${pulseOpacity * 0.1}) 50%, 
        rgba(0, 255, 0, ${pulseOpacity * 0.2}) 100%)
    `;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: getGradient(combo, time),
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  );
};

// Enhanced pulse animation with combo effects
export const PulseAnimation = ({ children, isActive, color = '#00ff00', intensity = 1, combo = 1 }) => {
  const getComboColor = (combo) => {
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 10) return '#4ecdc4';
    if (combo >= 5) return '#45b7d1';
    return color;
  };

  const pulseColor = getComboColor(combo);
  const pulseIntensity = Math.min(1 + (combo / 20), 2);

  return (
    <motion.div
      animate={isActive ? {
        scale: [1, 1 + (0.08 * intensity * pulseIntensity), 1],
        textShadow: [
          `0 0 5px ${pulseColor}`,
          `0 0 ${20 * intensity * pulseIntensity}px ${pulseColor}, 0 0 ${10 * intensity}px ${pulseColor}`,
          `0 0 5px ${pulseColor}`
        ]
      } : {}}
      transition={{
        duration: 0.6,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced typing cursor with combo effects
export const AdvancedTypingCursor = ({ isVisible, x, y, combo = 1 }) => {
  const getComboColor = (combo) => {
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 10) return '#4ecdc4';
    if (combo >= 5) return '#45b7d1';
    return '#ffff00';
  };

  const cursorColor = getComboColor(combo);
  const cursorIntensity = Math.min(1 + (combo / 25), 2);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [1, 0.3, 1],
            x: x,
            y: y,
            scaleY: [1, 1.1, 1],
            boxShadow: [
              `0 0 8px ${cursorColor}`,
              `0 0 ${15 * cursorIntensity}px ${cursorColor}`,
              `0 0 8px ${cursorColor}`
            ]
          }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.6, repeat: Infinity },
            scaleY: { duration: 0.6, repeat: Infinity },
            boxShadow: { duration: 0.6, repeat: Infinity },
            x: { duration: 0.1 },
            y: { duration: 0.1 }
          }}
          style={{
            position: 'absolute',
            width: '3px',
            height: '24px',
            background: `linear-gradient(180deg, ${cursorColor}, ${cursorColor}aa)`,
            borderRadius: '2px',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        />
      )}
    </AnimatePresence>
  );
};

// Enhanced combo burst effect
export const ComboBurstEffect = ({ isActive, combo, x, y }) => {
  if (!isActive || combo <= 5) return null;

  const getComboColor = (combo) => {
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 10) return '#4ecdc4';
    return '#45b7d1';
  };

  const burstColor = getComboColor(combo);
  const particleCount = Math.min(Math.floor(combo / 3), 12);
  const burstSize = Math.min(combo * 2, 40);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 999,
        pointerEvents: 'none'
      }}
    >
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            x: Math.cos((i * (360 / particleCount)) * Math.PI / 180) * burstSize,
            y: Math.sin((i * (360 / particleCount)) * Math.PI / 180) * burstSize,
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.03,
            repeat: Infinity,
            repeatDelay: 0.8
          }}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: `radial-gradient(circle, ${burstColor}, ${burstColor}88)`,
            borderRadius: '50%',
            boxShadow: `0 0 10px ${burstColor}`
          }}
        />
      ))}
      
      {/* Central burst effect */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 0.4, 0.8],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          width: '12px',
          height: '12px',
          background: `radial-gradient(circle, ${burstColor}, transparent)`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 20px ${burstColor}`
        }}
      />
    </motion.div>
  );
};