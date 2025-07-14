import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@chakra-ui/react';

// Simple but juicy block letter typing effect matching the reference game
export const BlockLetterTyping = ({ text, currentIndex, getCharacterStatus, onCharacterClick }) => {
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => (prev + 0.1) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getCharacterColors = (status, combo = 1) => {
    switch (status) {
      case 'correct':
        if (combo >= 50) return { bg: '#ff6b6b', text: '#fff', glow: '#ff6b6b' };
        if (combo >= 30) return { bg: '#ffd93d', text: '#000', glow: '#ffd93d' };
        if (combo >= 20) return { bg: '#6bcf7f', text: '#000', glow: '#6bcf7f' };
        if (combo >= 10) return { bg: '#4ecdc4', text: '#000', glow: '#4ecdc4' };
        if (combo >= 5) return { bg: '#45b7d1', text: '#fff', glow: '#45b7d1' };
        return { bg: '#00ff00', text: '#000', glow: '#00ff00' };
      case 'incorrect':
        return { bg: '#ff1744', text: '#fff', glow: '#ff1744' };
      case 'current':
        return { bg: '#ffeb3b', text: '#000', glow: '#ffeb3b' };
      default:
        return { bg: 'transparent', text: '#444', glow: 'transparent' };
    }
  };

  const renderCharacter = (char, index) => {
    const status = getCharacterStatus(index);
    const isActive = index === currentIndex;
    const colors = getCharacterColors(status);
    
    // Simple wave effect for active character
    const waveY = isActive ? Math.sin(waveOffset + index * 0.3) * 3 : 0;
    
    return (
      <motion.div
        key={index}
        className="simple-block-letter"
        initial={{ scale: 0.8, opacity: 0.6 }}
        animate={{ 
          scale: status === 'current' ? 1.2 : status === 'correct' ? 1.1 : 1,
          opacity: 1,
          y: waveY,
          backgroundColor: colors.bg,
          color: colors.text,
          boxShadow: status !== 'pending' ? `0 0 15px ${colors.glow}` : 'none'
        }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        whileHover={{ scale: 1.05 }}
        onClick={() => onCharacterClick && onCharacterClick(index)}
        style={{
          display: 'inline-block',
          width: char === ' ' ? '12px' : '18px',
          height: '24px',
          margin: '2px 1px',
          border: status !== 'pending' ? `2px solid ${colors.glow}` : '2px solid #333',
          borderRadius: '4px',
          textAlign: 'center',
          lineHeight: '20px',
          fontFamily: "'Courier New', monospace",
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          position: 'relative',
          userSelect: 'none'
        }}
      >
        {char === ' ' ? '' : char === '\n' ? '↵' : char}
        
        {/* Simple pulse effect for current character */}
        {isActive && (
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: '-3px',
              left: '-3px',
              right: '-3px',
              bottom: '-3px',
              border: '2px solid #ffeb3b',
              borderRadius: '6px',
              pointerEvents: 'none'
            }}
          />
        )}
        
        {/* Simple error indicator */}
        {status === 'incorrect' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              color: '#ff1744',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            ✗
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <Box
      className="simple-block-letter-container"
      style={{
        lineHeight: '32px',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap'
      }}
    >
      {text.split('').map((char, index) => renderCharacter(char, index))}
    </Box>
  );
};

// Simple gradient background effect
export const GradientWaveBackground = ({ isActive, intensity = 1, combo = 1 }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setTime(prev => prev + 0.05);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  const getGradient = (combo, time) => {
    const baseOpacity = 0.1 * intensity;
    
    if (combo >= 50) {
      return `linear-gradient(${time * 30}deg, rgba(255, 107, 107, ${baseOpacity}) 0%, rgba(255, 20, 147, ${baseOpacity * 0.7}) 50%, rgba(255, 107, 107, ${baseOpacity}) 100%)`;
    } else if (combo >= 30) {
      return `linear-gradient(${time * 25}deg, rgba(255, 217, 61, ${baseOpacity}) 0%, rgba(255, 193, 7, ${baseOpacity * 0.7}) 50%, rgba(255, 217, 61, ${baseOpacity}) 100%)`;
    } else if (combo >= 20) {
      return `linear-gradient(${time * 20}deg, rgba(107, 207, 127, ${baseOpacity}) 0%, rgba(76, 175, 80, ${baseOpacity * 0.7}) 50%, rgba(107, 207, 127, ${baseOpacity}) 100%)`;
    } else if (combo >= 10) {
      return `linear-gradient(${time * 15}deg, rgba(78, 205, 196, ${baseOpacity}) 0%, rgba(0, 188, 212, ${baseOpacity * 0.7}) 50%, rgba(78, 205, 196, ${baseOpacity}) 100%)`;
    }
    
    return `linear-gradient(${time * 10}deg, rgba(0, 255, 0, ${baseOpacity}) 0%, rgba(0, 255, 255, ${baseOpacity * 0.7}) 50%, rgba(0, 255, 0, ${baseOpacity}) 100%)`;
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

// Simple pulse animation
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

  return (
    <motion.div
      animate={isActive ? {
        scale: [1, 1 + (0.1 * intensity), 1],
        textShadow: [
          `0 0 5px ${pulseColor}`,
          `0 0 ${15 * intensity}px ${pulseColor}`,
          `0 0 5px ${pulseColor}`
        ]
      } : {}}
      transition={{
        duration: 0.8,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Simple typing cursor
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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [1, 0.3, 1],
            x: x,
            y: y
          }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.8, repeat: Infinity },
            x: { duration: 0.1 },
            y: { duration: 0.1 }
          }}
          style={{
            position: 'absolute',
            width: '2px',
            height: '20px',
            background: cursorColor,
            borderRadius: '1px',
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: `0 0 8px ${cursorColor}`
          }}
        />
      )}
    </AnimatePresence>
  );
};

// Simple combo burst effect
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
  const particleCount = Math.min(combo / 5, 8);

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
            scale: [0, 1, 0],
            x: Math.cos((i * (360 / particleCount)) * Math.PI / 180) * 20,
            y: Math.sin((i * (360 / particleCount)) * Math.PI / 180) * 20,
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.05,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: burstColor,
            borderRadius: '50%',
            boxShadow: `0 0 6px ${burstColor}`
          }}
        />
      ))}
    </motion.div>
  );
};