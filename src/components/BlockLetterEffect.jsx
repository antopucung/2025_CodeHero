import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@chakra-ui/react';

// Juicy block letter typing effect with wave springs and gradients
export const BlockLetterTyping = ({ text, currentIndex, getCharacterStatus, onCharacterClick }) => {
  const [waveOffset, setWaveOffset] = useState(0);
  const [comboLevel, setComboLevel] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => (prev + 0.15) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getComboColors = (combo) => {
    if (combo >= 50) return {
      bg: 'linear-gradient(45deg, #ff6b6b, #ff8e8e, #ff6b6b)',
      border: '#ff6b6b',
      glow: '#ff6b6b',
      shadow: '0 0 25px #ff6b6b, inset 0 0 15px rgba(255, 107, 107, 0.3)'
    };
    if (combo >= 30) return {
      bg: 'linear-gradient(45deg, #ffd93d, #ffed4e, #ffd93d)',
      border: '#ffd93d',
      glow: '#ffd93d',
      shadow: '0 0 25px #ffd93d, inset 0 0 15px rgba(255, 217, 61, 0.3)'
    };
    if (combo >= 20) return {
      bg: 'linear-gradient(45deg, #6bcf7f, #7dd87f, #6bcf7f)',
      border: '#6bcf7f',
      glow: '#6bcf7f',
      shadow: '0 0 25px #6bcf7f, inset 0 0 15px rgba(107, 207, 127, 0.3)'
    };
    if (combo >= 10) return {
      bg: 'linear-gradient(45deg, #4ecdc4, #5ed9d1, #4ecdc4)',
      border: '#4ecdc4',
      glow: '#4ecdc4',
      shadow: '0 0 25px #4ecdc4, inset 0 0 15px rgba(78, 205, 196, 0.3)'
    };
    if (combo >= 5) return {
      bg: 'linear-gradient(45deg, #45b7d1, #5bc3d7, #45b7d1)',
      border: '#45b7d1',
      glow: '#45b7d1',
      shadow: '0 0 25px #45b7d1, inset 0 0 15px rgba(69, 183, 209, 0.3)'
    };
    return {
      bg: 'linear-gradient(45deg, #00ff00, #33ff33, #00ff00)',
      border: '#00ff00',
      glow: '#00ff00',
      shadow: '0 0 20px #00ff00, inset 0 0 10px rgba(0, 255, 0, 0.3)'
    };
  };

  const getErrorColors = () => ({
    bg: 'linear-gradient(45deg, #ff1744, #ff4569, #ff1744)',
    border: '#ff1744',
    glow: '#ff1744',
    shadow: '0 0 30px #ff1744, inset 0 0 20px rgba(255, 23, 68, 0.4)'
  });

  const getCurrentColors = () => ({
    bg: 'linear-gradient(45deg, #ffeb3b, #fff176, #ffeb3b)',
    border: '#ffeb3b',
    glow: '#ffeb3b',
    shadow: '0 0 25px #ffeb3b, inset 0 0 15px rgba(255, 235, 59, 0.4)'
  });

  const renderCharacter = (char, index) => {
    const status = getCharacterStatus(index);
    const isActive = index === currentIndex;
    
    let colors;
    if (status === 'incorrect') colors = getErrorColors();
    else if (status === 'current') colors = getCurrentColors();
    else if (status === 'correct') colors = getComboColors(comboLevel);
    else colors = { bg: 'transparent', border: '#333', glow: 'transparent', shadow: 'none' };
    
    // Wave effect for active character
    const waveY = isActive ? Math.sin(waveOffset + index * 0.4) * 4 : 0;
    const waveScale = isActive ? 1 + Math.sin(waveOffset * 2) * 0.1 : 1;
    
    // Spring effect for correct characters
    const springEffect = status === 'correct' ? {
      scale: [1, 1.3, 1.1, 1.2, 1.1],
      rotate: [0, 5, -3, 2, 0],
      y: [0, -8, -4, -6, -2]
    } : {};

    return (
      <motion.div
        key={index}
        initial={{ scale: 0.8, opacity: 0.6 }}
        animate={{ 
          scale: status === 'current' ? waveScale * 1.2 : 
                 status === 'correct' ? 1.1 : 
                 status === 'incorrect' ? [1, 1.2, 0.9, 1.1, 1] : 1,
          opacity: status === 'pending' ? 0.4 : 1,
          y: waveY,
          background: colors.bg,
          borderColor: colors.border,
          boxShadow: colors.shadow,
          ...springEffect
        }}
        transition={{ 
          duration: status === 'correct' ? 0.6 : 0.3,
          type: "spring",
          stiffness: status === 'correct' ? 200 : 300,
          damping: status === 'correct' ? 15 : 20
        }}
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
          color: status === 'pending' ? '#666' : 
                 status === 'incorrect' ? '#fff' : 
                 status === 'current' ? '#000' : '#000'
        }}
      >
        {char === ' ' ? '' : char === '\n' ? '↵' : char}
        
        {/* Blinking gradient effect for current character */}
        {isActive && (
          <motion.div
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: '-4px',
              left: '-4px',
              right: '-4px',
              bottom: '-4px',
              background: 'linear-gradient(45deg, #ffeb3b, #fff176, #ffeb3b)',
              borderRadius: '8px',
              zIndex: -1,
              filter: 'blur(2px)'
            }}
          />
        )}
        
        {/* Combo celebration effect */}
        {status === 'correct' && comboLevel > 1 && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [1, 0.8, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              width: '16px',
              height: '16px',
              background: colors.glow,
              borderRadius: '50%',
              boxShadow: `0 0 15px ${colors.glow}`
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
          <motion.div
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{
              scale: [0, 2, 3],
              opacity: [0.8, 0.4, 0]
            }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '40px',
              height: '40px',
              border: `2px solid ${colors.glow}`,
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />
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