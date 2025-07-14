import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@chakra-ui/react';

// Enhanced Block letter typing effect matching the reference game
export const BlockLetterTyping = ({ text, currentIndex, getCharacterStatus, onCharacterClick }) => {
  const [waveOffset, setWaveOffset] = useState(0);
  const [comboLevel, setComboLevel] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => (prev + 0.15) % (Math.PI * 2));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const getComboColor = (combo) => {
    if (combo >= 50) return { bg: '#ff6b6b', text: '#fff', glow: '#ff6b6b' }; // Red hot
    if (combo >= 30) return { bg: '#ffd93d', text: '#000', glow: '#ffd93d' }; // Gold
    if (combo >= 20) return { bg: '#6bcf7f', text: '#000', glow: '#6bcf7f' }; // Green
    if (combo >= 10) return { bg: '#4ecdc4', text: '#000', glow: '#4ecdc4' }; // Cyan
    if (combo >= 5) return { bg: '#45b7d1', text: '#fff', glow: '#45b7d1' };  // Blue
    return { bg: '#00ff00', text: '#000', glow: '#00ff00' }; // Default green
  };

  const renderCharacter = (char, index) => {
    const status = getCharacterStatus(index);
    const isActive = index === currentIndex;
    const waveY = Math.sin(waveOffset + index * 0.2) * (isActive ? 8 : 3);
    const comboColors = getComboColor(comboLevel);
    
    let bgColor = 'transparent';
    let textColor = '#444';
    let borderColor = '#222';
    let glowColor = 'transparent';
    let scale = 1;
    let rotateX = 0;
    let rotateY = 0;
    
    switch (status) {
      case 'correct':
        bgColor = comboColors.bg;
        textColor = comboColors.text;
        borderColor = comboColors.glow;
        glowColor = comboColors.glow;
        scale = 1.05;
        rotateY = 360;
        break;
      case 'incorrect':
        bgColor = '#ff1744';
        textColor = '#fff';
        borderColor = '#ff1744';
        glowColor = '#ff1744';
        scale = 0.85;
        rotateX = 180;
        break;
      case 'current':
        bgColor = '#ffeb3b';
        textColor = '#000';
        borderColor = '#ffeb3b';
        glowColor = '#ffeb3b';
        scale = 1.3;
        break;
      default:
        textColor = '#666';
        borderColor = '#333';
    }

    return (
      <motion.div
        key={index}
        className="enhanced-block-letter"
        initial={{ 
          scale: 0, 
          rotateY: -180,
          opacity: 0,
          z: -100
        }}
        animate={{ 
          scale: scale,
          rotateY: rotateY,
          rotateX: rotateX,
          opacity: 1,
          z: 0,
          y: waveY,
          backgroundColor: bgColor,
          borderColor: borderColor,
          boxShadow: [
            `0 0 ${isActive ? '25px' : '15px'} ${glowColor}`,
            `inset 0 0 ${isActive ? '15px' : '10px'} rgba(255,255,255,0.1)`,
            `0 ${scale > 1 ? '8px' : '4px'} ${scale > 1 ? '16px' : '8px'} rgba(0,0,0,0.3)`
          ].join(', '),
          textShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
          transform: `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateY(${waveY}px) 
            scale(${scale})
          `
        }}
        transition={{ 
          duration: status === 'correct' ? 0.6 : 0.3,
          type: "spring",
          stiffness: 400,
          damping: 25,
          rotateY: { duration: 0.8, ease: "backOut" },
          rotateX: { duration: 0.4, ease: "easeOut" }
        }}
        whileHover={{ 
          scale: scale * 1.15,
          y: waveY - 8,
          rotateZ: 5,
          transition: { duration: 0.2 }
        }}
        onClick={() => onCharacterClick && onCharacterClick(index)}
        style={{
          display: 'inline-block',
          width: char === ' ' ? '14px' : '20px',
          height: '28px',
          margin: '3px 2px',
          border: '2px solid',
          borderRadius: '6px',
          textAlign: 'center',
          lineHeight: '24px',
          fontFamily: "'Courier New', monospace",
          fontSize: '16px',
          fontWeight: 'bold',
          color: textColor,
          cursor: 'pointer',
          position: 'relative',
          userSelect: 'none',
          transformStyle: 'preserve-3d'
        }}
      >
        {char === ' ' ? '' : char === '\n' ? '↵' : char}
        
        {/* Enhanced pulse effect for current character */}
        {isActive && (
          <>
            <motion.div
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.8, 0, 0.8],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: '-4px',
                left: '-4px',
                right: '-4px',
                bottom: '-4px',
                border: '3px solid #ffeb3b',
                borderRadius: '8px',
                pointerEvents: 'none'
              }}
            />
            <motion.div
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.6, 0, 0.6]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2
              }}
              style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                right: '-2px',
                bottom: '-2px',
                border: '2px solid #fff',
                borderRadius: '7px',
                pointerEvents: 'none'
              }}
            />
          </>
        )}
        
        {/* Enhanced sparkle effect for correct characters */}
        {status === 'correct' && (
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 1.5, 0],
                  rotate: [0, 360, 720],
                  opacity: [0, 1, 0],
                  x: Math.cos((i * 60) * Math.PI / 180) * 15,
                  y: Math.sin((i * 60) * Math.PI / 180) * 15
                }}
                transition={{ 
                  duration: 1.2, 
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '6px',
                  height: '6px',
                  background: `radial-gradient(circle, ${comboColors.glow}, transparent)`,
                  borderRadius: '50%',
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </>
        )}

        {/* Error shake effect */}
        {status === 'incorrect' && (
          <motion.div
            animate={{
              x: [-2, 2, -2, 2, 0],
              y: [-1, 1, -1, 1, 0]
            }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: '#ff1744',
              fontSize: '20px',
              fontWeight: 'bold',
              pointerEvents: 'none'
            }}
          >
            ✗
          </motion.div>
        )}

        {/* Combo level indicator */}
        {status === 'correct' && comboLevel > 5 && (
          <motion.div
            initial={{ scale: 0, y: 0 }}
            animate={{ 
              scale: [1, 1.2, 1],
              y: [-20, -25, -20]
            }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute',
              top: '-15px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: comboColors.glow,
              fontSize: '10px',
              fontWeight: 'bold',
              pointerEvents: 'none'
            }}
          >
            +{comboLevel}
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <Box
      className="enhanced-block-letter-container"
      style={{
        lineHeight: '36px',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        perspective: '1000px'
      }}
    >
      {text.split('').map((char, index) => renderCharacter(char, index))}
    </Box>
  );
};

// Enhanced gradient wave background with combo colors
export const GradientWaveBackground = ({ isActive, intensity = 1, combo = 1 }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setTime(prev => prev + 0.08);
    }, 40);
    
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  const getComboGradient = (combo, time) => {
    if (combo >= 50) {
      return `linear-gradient(
        ${time * 60}deg,
        rgba(255, 107, 107, ${0.3 * intensity}) 0%,
        rgba(255, 20, 147, ${0.2 * intensity}) 25%,
        rgba(255, 69, 0, ${0.3 * intensity}) 50%,
        rgba(255, 215, 0, ${0.2 * intensity}) 75%,
        rgba(255, 107, 107, ${0.3 * intensity}) 100%
      )`;
    } else if (combo >= 30) {
      return `linear-gradient(
        ${time * 50}deg,
        rgba(255, 217, 61, ${0.25 * intensity}) 0%,
        rgba(255, 193, 7, ${0.15 * intensity}) 25%,
        rgba(255, 235, 59, ${0.25 * intensity}) 50%,
        rgba(255, 193, 7, ${0.15 * intensity}) 75%,
        rgba(255, 217, 61, ${0.25 * intensity}) 100%
      )`;
    } else if (combo >= 20) {
      return `linear-gradient(
        ${time * 40}deg,
        rgba(107, 207, 127, ${0.2 * intensity}) 0%,
        rgba(76, 175, 80, ${0.1 * intensity}) 25%,
        rgba(139, 195, 74, ${0.2 * intensity}) 50%,
        rgba(76, 175, 80, ${0.1 * intensity}) 75%,
        rgba(107, 207, 127, ${0.2 * intensity}) 100%
      )`;
    } else if (combo >= 10) {
      return `linear-gradient(
        ${time * 35}deg,
        rgba(78, 205, 196, ${0.15 * intensity}) 0%,
        rgba(0, 188, 212, ${0.1 * intensity}) 25%,
        rgba(0, 172, 193, ${0.15 * intensity}) 50%,
        rgba(0, 188, 212, ${0.1 * intensity}) 75%,
        rgba(78, 205, 196, ${0.15 * intensity}) 100%
      )`;
    }
    
    return `linear-gradient(
      ${time * 30}deg,
      rgba(0, 255, 0, ${0.1 * intensity}) 0%,
      rgba(0, 255, 255, ${0.05 * intensity}) 25%,
      rgba(0, 255, 127, ${0.1 * intensity}) 50%,
      rgba(0, 255, 255, ${0.05 * intensity}) 75%,
      rgba(0, 255, 0, ${0.1 * intensity}) 100%
    )`;
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
        background: getComboGradient(combo, time),
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  );
};

// Enhanced pulse animation with combo colors
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
  const pulseIntensity = Math.min(intensity * (1 + combo * 0.1), 3);

  return (
    <motion.div
      animate={isActive ? {
        scale: [1, 1 + (0.15 * pulseIntensity), 1],
        textShadow: [
          `0 0 5px ${pulseColor}`,
          `0 0 ${25 * pulseIntensity}px ${pulseColor}`,
          `0 0 5px ${pulseColor}`
        ],
        boxShadow: [
          `0 0 5px ${pulseColor}`,
          `0 0 ${30 * pulseIntensity}px ${pulseColor}`,
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

// Advanced typing cursor with combo effects
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
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [1, 0.3, 1],
            scale: [1, 1.4, 1],
            x: x,
            y: y,
            boxShadow: [
              `0 0 10px ${cursorColor}`,
              `0 0 25px ${cursorColor}`,
              `0 0 10px ${cursorColor}`
            ]
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{
            opacity: { duration: 0.8, repeat: Infinity },
            scale: { duration: 0.6, repeat: Infinity },
            x: { duration: 0.15 },
            y: { duration: 0.15 },
            boxShadow: { duration: 1, repeat: Infinity }
          }}
          style={{
            position: 'absolute',
            width: '3px',
            height: '24px',
            background: `linear-gradient(to bottom, ${cursorColor}, ${cursorColor}aa)`,
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
  if (!isActive || combo <= 1) return null;

  const getComboColor = (combo) => {
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 10) return '#4ecdc4';
    if (combo >= 5) return '#45b7d1';
    return '#00ff00';
  };

  const burstColor = getComboColor(combo);
  const particleCount = Math.min(combo, 12);

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
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
            x: Math.cos((i * (360 / particleCount)) * Math.PI / 180) * (30 + combo * 2),
            y: Math.sin((i * (360 / particleCount)) * Math.PI / 180) * (30 + combo * 2),
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.05,
            repeat: Infinity,
            repeatDelay: 1
          }}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: `radial-gradient(circle, ${burstColor}, transparent)`,
            borderRadius: '50%',
            boxShadow: `0 0 8px ${burstColor}`
          }}
        />
      ))}
    </motion.div>
  );
};