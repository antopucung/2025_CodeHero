import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@chakra-ui/react';

// Enhanced block letter typing with Candy Crush-style effects
export const BlockLetterTyping = ({ text, currentIndex, getCharacterStatus, getCharacterSpeed, getCharacterUpgrade, onCharacterClick, combo = 1, typingSpeed = 'lame', anticipationLevel = 1, ANTICIPATION_COLORS, RESULT_COLORS }) => {
  const [waveOffset, setWaveOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveOffset(prev => (prev + 0.15) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const renderCharacter = (char, index) => {
    const status = getCharacterStatus(index);
    const speed = getCharacterSpeed ? getCharacterSpeed(index) : 'lame';
    const upgrade = getCharacterUpgrade ? getCharacterUpgrade(index) : { level: 0, speed: 'lame' };
    const isActive = index === currentIndex;
    
    let colors;
    
    if (status === 'incorrect') {
      colors = {
        bg: 'linear-gradient(45deg, #ff1744, #ff4569, #ff1744)',
        border: '#ff1744',
        glow: '#ff1744',
        shadow: '0 0 30px #ff1744, inset 0 0 20px rgba(255, 23, 68, 0.4)',
        textColor: '#fff'
      };
    } else if (status === 'current') {
      // Dynamic anticipation colors based on typing speed prediction
      const anticipationColors = ANTICIPATION_COLORS[typingSpeed] || ANTICIPATION_COLORS.lame;
      const pulseIntensity = anticipationLevel * anticipationColors.pulse;
      
      colors = {
        bg: anticipationColors.bg,
        border: anticipationColors.glow,
        glow: anticipationColors.glow,
        shadow: `0 0 ${15 * pulseIntensity}px ${anticipationColors.glow}, inset 0 0 ${8 * pulseIntensity}px rgba(255, 235, 59, 0.4)`,
        textColor: typingSpeed === 'perfect' || typingSpeed === 'best' ? '#000' : '#fff',
        pulseIntensity
      };
    } else if (status === 'correct') {
      // Result colors based on actual typing speed with upgrade effects
      const baseColors = RESULT_COLORS[speed] || RESULT_COLORS.lame;
      const upgradeMultiplier = 1 + (upgrade.level * 0.3);
      
      colors = {
        bg: baseColors.bg,
        border: baseColors.glow,
        glow: baseColors.glow,
        shadow: baseColors.shadow,
        textColor: speed === 'perfect' || speed === 'best' ? '#fff' : '#000',
        upgradeLevel: upgrade.level
      };
    } else {
      colors = { 
        bg: 'transparent', 
        border: '#333', 
        glow: 'transparent', 
        shadow: 'none',
        textColor: '#666'
      };
    }
    
    // Enhanced wave effects
    const waveY = isActive ? Math.sin(waveOffset + index * 0.4) * (4 * (colors.pulseIntensity || 1)) : 0;
    const waveScale = isActive ? 1 + Math.sin(waveOffset * 2) * (0.1 * (colors.pulseIntensity || 1)) : 1;
    
    const getAnimateProps = () => {
      const baseProps = {
        scale: status === 'current' ? waveScale * (1.2 + (anticipationLevel * 0.1)) : 
               status === 'correct' ? 1.1 + (colors.upgradeLevel * 0.05) : 
               status === 'incorrect' ? 1 : 1,
        opacity: status === 'pending' ? 0.4 : 1,
        y: waveY,
        background: colors.bg,
        borderColor: colors.border,
        boxShadow: colors.shadow,
        color: colors.textColor || '#000'
      };

      if (status === 'correct') {
        const intensity = 1 + (colors.upgradeLevel * 0.2);
        return {
          ...baseProps,
          scale: [1, 1.2 + (intensity * 0.1), 1.1 + (intensity * 0.05)],
          rotate: [0, 3 * intensity, 0],
          y: [waveY, waveY - (4 * intensity), waveY - (2 * intensity)]
        };
      }

      if (status === 'incorrect') {
        return {
          ...baseProps,
          scale: [1, 1.2, 0.9, 1.1, 1],
          rotate: [0, -3, 3, -2, 0],
          x: [0, -2, 2, -1, 0] // Shake effect
        };
      }

      if (status === 'current') {
        return {
          ...baseProps,
          scale: [baseProps.scale, baseProps.scale * 1.1, baseProps.scale],
          boxShadow: [
            colors.shadow,
            `${colors.shadow}, 0 0 ${30 * colors.pulseIntensity}px ${colors.glow}`,
            colors.shadow
          ]
        };
      }

      return baseProps;
    };

    const getTransitionProps = () => {
      if (status === 'current') {
        return {
          duration: 0.6,
          repeat: Infinity,
          ease: "easeInOut"
        };
      }
      
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
        
        {/* Enhanced upgrade indicator */}
        {status === 'correct' && colors.upgradeLevel > 0 && (
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
              width: `${8 + (colors.upgradeLevel * 2)}px`,
              height: `${8 + (colors.upgradeLevel * 2)}px`,
              background: colors.glow,
              borderRadius: '50%',
              boxShadow: `0 0 ${10 + (colors.upgradeLevel * 5)}px ${colors.glow}`,
              zIndex: 10
            }}
          />
        )}
        
        {/* Speed indicator for current character */}
        {isActive && typingSpeed !== 'lame' && (
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
              fontSize: '8px',
              color: colors.glow,
              fontWeight: 'bold',
              textShadow: `0 0 5px ${colors.glow}`,
              zIndex: 10
            }}
          >
            {typingSpeed.toUpperCase()}
          </motion.div>
        )}
        
        {/* Error X indicator with enhanced animation */}
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
              color: '#ff1744',
              fontSize: '18px',
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
                scale: [0, 2 + (colors.upgradeLevel * 0.3), 3 + (colors.upgradeLevel * 0.5)],
                opacity: [0.8, 0.4, 0]
              }}
              transition={{ duration: 1 + (colors.upgradeLevel * 0.2) }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${40 + (colors.upgradeLevel * 10)}px`,
                height: `${40 + (colors.upgradeLevel * 10)}px`,
                border: `2px solid ${colors.glow}`,
                borderRadius: '50%',
                pointerEvents: 'none'
              }}
            />
            
            {/* Additional upgrade ripples */}
            {colors.upgradeLevel >= 2 && (
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
                  width: `${60 + (colors.upgradeLevel * 15)}px`,
                  height: `${60 + (colors.upgradeLevel * 15)}px`,
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

// Enhanced gradient wave background with anticipation effects
export const GradientWaveBackground = ({ isActive, intensity = 1, combo = 1, anticipationLevel = 1, typingSpeed = 'lame' }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setTime(prev => prev + (0.08 * anticipationLevel));
    }, 50);
    
    return () => clearInterval(interval);
  }, [isActive, anticipationLevel]);

  if (!isActive) return null;

  const getGradient = (combo, time, anticipationLevel, typingSpeed) => {
    const baseOpacity = 0.15 * intensity * anticipationLevel;
    const pulseOpacity = baseOpacity + Math.sin(time * 3) * 0.05;
    
    // Anticipation-based background colors
    const anticipationColors = {
      perfect: ['255, 107, 107', '255, 20, 147'],
      best: ['255, 217, 61', '255, 193, 7'],
      good: ['78, 205, 196', '0, 188, 212'],
      lame: ['0, 255, 0', '0, 255, 255']
    };
    
    const [color1, color2] = anticipationColors[typingSpeed] || anticipationColors.lame;
    
    if (combo >= 50) {
      return `
        radial-gradient(circle at ${50 + Math.sin(time) * 20}% ${50 + Math.cos(time * 1.3) * 20}%, 
          rgba(${color1}, ${pulseOpacity * 1.5}) 0%, 
          rgba(${color2}, ${pulseOpacity * 1.2}) 30%, 
          rgba(${color1}, ${pulseOpacity * 0.8}) 60%,
          transparent 100%),
        linear-gradient(${time * 45}deg, 
          rgba(${color1}, ${pulseOpacity * 0.4}) 0%, 
          rgba(${color2}, ${pulseOpacity * 0.3}) 50%, 
          rgba(${color1}, ${pulseOpacity * 0.4}) 100%)
      `;
    } else if (combo >= 30) {
      return `
        radial-gradient(circle at ${50 + Math.sin(time * 1.2) * 15}% ${50 + Math.cos(time) * 15}%, 
          rgba(${color1}, ${pulseOpacity * 1.2}) 0%, 
          rgba(${color2}, ${pulseOpacity * 0.9}) 40%, 
          transparent 80%),
        linear-gradient(${time * 35}deg, 
          rgba(${color1}, ${pulseOpacity * 0.3}) 0%, 
          rgba(${color2}, ${pulseOpacity * 0.2}) 50%, 
          rgba(${color1}, ${pulseOpacity * 0.3}) 100%)
      `;
    }
    
    return `
      radial-gradient(circle at ${50 + Math.sin(time * 0.5) * 8}% ${50 + Math.cos(time * 0.7) * 8}%, 
        rgba(${color1}, ${pulseOpacity}) 0%, 
        rgba(${color2}, ${pulseOpacity * 0.7}) 70%, 
        transparent 100%),
      linear-gradient(${time * 15}deg, 
        rgba(${color1}, ${pulseOpacity * 0.2}) 0%, 
        rgba(${color2}, ${pulseOpacity * 0.15}) 50%, 
        rgba(${color1}, ${pulseOpacity * 0.2}) 100%)
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
        background: getGradient(combo, time, anticipationLevel, typingSpeed),
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  );
};

// Enhanced pulse animation with anticipation effects
export const PulseAnimation = ({ children, isActive, color = '#00ff00', intensity = 1, combo = 1, anticipationLevel = 1 }) => {
  const getComboColor = (combo) => {
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 10) return '#4ecdc4';
    if (combo >= 5) return '#45b7d1';
    return color;
  };

  const pulseColor = getComboColor(combo);
  const pulseIntensity = Math.min(1 + (combo / 20) + anticipationLevel, 3);

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
        duration: 0.6 / anticipationLevel,
        repeat: isActive ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced typing cursor with anticipation effects
export const AdvancedTypingCursor = ({ isVisible, x, y, combo = 1, typingSpeed = 'lame', anticipationLevel = 1 }) => {
  const getSpeedColor = (speed) => {
    const colors = {
      perfect: '#ff6b6b',
      best: '#ffd93d',
      good: '#4ecdc4',
      lame: '#ffff00'
    };
    return colors[speed] || colors.lame;
  };

  const cursorColor = getSpeedColor(typingSpeed);
  const cursorIntensity = Math.min(1 + (combo / 25) + anticipationLevel, 3);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [1, 0.3, 1],
            x: x,
            y: y,
            scaleY: [1, 1.1 + (anticipationLevel * 0.1), 1],
            boxShadow: [
              `0 0 8px ${cursorColor}`,
              `0 0 ${15 * cursorIntensity}px ${cursorColor}`,
              `0 0 8px ${cursorColor}`
            ]
          }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.6 / anticipationLevel, repeat: Infinity },
            scaleY: { duration: 0.6 / anticipationLevel, repeat: Infinity },
            boxShadow: { duration: 0.6 / anticipationLevel, repeat: Infinity },
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

// Enhanced combo burst effect with pattern matching
export const ComboBurstEffect = ({ isActive, combo, x, y, patterns = [] }) => {
  if (!isActive || combo <= 5) return null;

  const getComboColor = (combo) => {
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 10) return '#4ecdc4';
    return '#45b7d1';
  };

  const burstColor = getComboColor(combo);
  const particleCount = Math.min(Math.floor(combo / 3) + patterns.length * 2, 16);
  const burstSize = Math.min(combo * 2 + patterns.length * 10, 60);

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
            scale: [0, 1.5 + (patterns.length * 0.3), 0],
            x: Math.cos((i * (360 / particleCount)) * Math.PI / 180) * burstSize,
            y: Math.sin((i * (360 / particleCount)) * Math.PI / 180) * burstSize,
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: 1.2 + (patterns.length * 0.2),
            delay: i * 0.03,
            repeat: Infinity,
            repeatDelay: 0.8
          }}
          style={{
            position: 'absolute',
            width: `${6 + patterns.length}px`,
            height: `${6 + patterns.length}px`,
            background: `radial-gradient(circle, ${burstColor}, ${burstColor}88)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${10 + patterns.length * 2}px ${burstColor}`
          }}
        />
      ))}
      
      {/* Enhanced central burst for pattern matches */}
      <motion.div
        animate={{
          scale: [1, 1.5 + (patterns.length * 0.2), 1],
          opacity: [0.8, 0.4, 0.8],
          rotate: [0, 180 + (patterns.length * 30), 360 + (patterns.length * 60)]
        }}
        transition={{
          duration: 1 + (patterns.length * 0.2),
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          width: `${12 + patterns.length * 2}px`,
          height: `${12 + patterns.length * 2}px`,
          background: `radial-gradient(circle, ${burstColor}, transparent)`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 ${20 + patterns.length * 5}px ${burstColor}`
        }}
      />
    </motion.div>
  );
};