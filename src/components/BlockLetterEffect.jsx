import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@chakra-ui/react';

// Block letter typing effect with wave animation
export const BlockLetterTyping = ({ text, currentIndex, getCharacterStatus, onCharacterClick }) => {
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => (prev + 0.1) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const renderCharacter = (char, index) => {
    const status = getCharacterStatus(index);
    const isActive = index === currentIndex;
    const waveY = Math.sin(waveOffset + index * 0.3) * 3;
    
    let bgColor = 'transparent';
    let textColor = '#666';
    let borderColor = 'transparent';
    let glowColor = 'transparent';
    let scale = 1;
    
    switch (status) {
      case 'correct':
        bgColor = '#003300';
        textColor = '#00ff00';
        borderColor = '#00ff00';
        glowColor = '#00ff00';
        break;
      case 'incorrect':
        bgColor = '#330000';
        textColor = '#ff4444';
        borderColor = '#ff4444';
        glowColor = '#ff4444';
        scale = 0.9;
        break;
      case 'current':
        bgColor = '#333300';
        textColor = '#ffff00';
        borderColor = '#ffff00';
        glowColor = '#ffff00';
        scale = 1.2;
        break;
      default:
        textColor = '#666';
    }

    return (
      <motion.div
        key={index}
        className="block-letter"
        initial={{ scale: 0, rotateY: -90 }}
        animate={{ 
          scale: scale,
          rotateY: 0,
          y: isActive ? waveY : 0,
          backgroundColor: bgColor,
          borderColor: borderColor,
          boxShadow: `0 0 ${isActive ? '20px' : '10px'} ${glowColor}`,
          textShadow: `0 0 10px ${glowColor}`
        }}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        whileHover={{ 
          scale: scale * 1.1,
          y: -5,
          transition: { duration: 0.2 }
        }}
        onClick={() => onCharacterClick && onCharacterClick(index)}
        style={{
          display: 'inline-block',
          width: char === ' ' ? '12px' : '16px',
          height: '24px',
          margin: '2px 1px',
          border: '1px solid',
          borderRadius: '3px',
          textAlign: 'center',
          lineHeight: '22px',
          fontFamily: "'Courier New', monospace",
          fontSize: '14px',
          fontWeight: 'bold',
          color: textColor,
          cursor: 'pointer',
          position: 'relative',
          userSelect: 'none'
        }}
      >
        {char === ' ' ? '' : char === '\n' ? '↵' : char}
        
        {/* Pulse effect for current character */}
        {isActive && (
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              position: 'absolute',
              top: '-2px',
              left: '-2px',
              right: '-2px',
              bottom: '-2px',
              border: '2px solid #ffff00',
              borderRadius: '5px',
              pointerEvents: 'none'
            }}
          />
        )}
        
        {/* Sparkle effect for correct characters */}
        {status === 'correct' && (
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              width: '8px',
              height: '8px',
              background: 'radial-gradient(circle, #ffff00, #00ff00)',
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
      className="block-letter-container"
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

// Gradient wave background effect
export const GradientWaveBackground = ({ isActive, intensity = 1 }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setTime(prev => prev + 0.05);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(
          ${time * 50}deg,
          rgba(0, 255, 0, ${0.1 * intensity}) 0%,
          rgba(255, 255, 0, ${0.05 * intensity}) 25%,
          rgba(0, 255, 255, ${0.1 * intensity}) 50%,
          rgba(255, 0, 255, ${0.05 * intensity}) 75%,
          rgba(0, 255, 0, ${0.1 * intensity}) 100%
        )`,
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  );
};

// Pulse animation for stats
export const PulseAnimation = ({ children, isActive, color = '#00ff00', intensity = 1 }) => {
  return (
    <motion.div
      animate={isActive ? {
        scale: [1, 1 + (0.1 * intensity), 1],
        textShadow: [
          `0 0 5px ${color}`,
          `0 0 ${15 * intensity}px ${color}`,
          `0 0 5px ${color}`
        ],
        boxShadow: [
          `0 0 5px ${color}`,
          `0 0 ${20 * intensity}px ${color}`,
          `0 0 5px ${color}`
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

// Typing cursor with advanced animation
export const AdvancedTypingCursor = ({ isVisible, x, y }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [1, 0, 1],
            scale: [1, 1.2, 1],
            x: x,
            y: y
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            opacity: { duration: 1, repeat: Infinity },
            scale: { duration: 0.5, repeat: Infinity },
            x: { duration: 0.2 },
            y: { duration: 0.2 }
          }}
          style={{
            position: 'absolute',
            width: '2px',
            height: '20px',
            background: 'linear-gradient(to bottom, #ffff00, #00ff00)',
            boxShadow: '0 0 10px #ffff00',
            zIndex: 1000,
            pointerEvents: 'none'
          }}
        />
      )}
    </AnimatePresence>
  );
};

// Combo burst effect
export const ComboBurstEffect = ({ isActive, combo, x, y }) => {
  if (!isActive || combo <= 1) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: [1, 1.5, 1],
        rotate: [0, 180, 360],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 999,
        pointerEvents: 'none'
      }}
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos((i * 45) * Math.PI / 180) * 30,
            y: Math.sin((i * 45) * Math.PI / 180) * 30,
            opacity: [1, 0.5, 0]
          }}
          transition={{
            duration: 1,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
          style={{
            position: 'absolute',
            width: '4px',
            height: '4px',
            background: `hsl(${60 + combo * 10}, 100%, 50%)`,
            borderRadius: '50%',
            boxShadow: `0 0 6px hsl(${60 + combo * 10}, 100%, 50%)`
          }}
        />
      ))}
    </motion.div>
  );
};