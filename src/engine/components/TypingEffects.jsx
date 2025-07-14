import React, { useEffect, useRef, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Enhanced floating score with speed and pattern indicators
export const FloatingScore = ({ score, x, y, color = '#00ff00', combo = 1, speed = 'lame', patterns = 0, onComplete }) => {
  const getScoreSize = (combo, patterns) => {
    const baseSize = 16;
    const comboBonus = Math.min(combo / 10, 8);
    const patternBonus = patterns * 2;
    return `${baseSize + comboBonus + patternBonus}px`;
  };

  const getScoreEffect = (combo, speed, patterns) => {
    const speedMultiplier = { perfect: 2, best: 1.5, good: 1.2, lame: 1 }[speed];
    const patternMultiplier = 1 + (patterns * 0.3);
    
    if (combo >= 50) return {
      scale: [0.5, 2.5 * speedMultiplier * patternMultiplier, 1.8],
      rotate: [0, 360 + (patterns * 90), 180],
      textShadow: [`0 0 10px ${color}`, `0 0 40px ${color}`, `0 0 25px ${color}`]
    };
    if (combo >= 30) return {
      scale: [0.5, 2 * speedMultiplier * patternMultiplier, 1.5],
      rotate: [0, 270 + (patterns * 60), 135],
      textShadow: [`0 0 8px ${color}`, `0 0 35px ${color}`, `0 0 20px ${color}`]
    };
    if (combo >= 10) return {
      scale: [0.5, 1.8 * speedMultiplier * patternMultiplier, 1.3],
      rotate: [0, 180 + (patterns * 45), 90],
      textShadow: [`0 0 6px ${color}`, `0 0 30px ${color}`, `0 0 15px ${color}`]
    };
    return {
      scale: [0.5, 1.5 * speedMultiplier * patternMultiplier, 1.1],
      rotate: [0, 90 + (patterns * 30), 45],
      textShadow: [`0 0 5px ${color}`, `0 0 25px ${color}`, `0 0 12px ${color}`]
    };
  };

  const effects = getScoreEffect(combo, speed, patterns);

  return (
    <motion.div
      initial={{ 
        opacity: 1, 
        scale: 0.5, 
        x: x, 
        y: y,
        rotate: 0
      }}
      animate={{ 
        opacity: [1, 1, 0], 
        scale: effects.scale,
        rotate: effects.rotate,
        textShadow: effects.textShadow,
        y: y - 120 - (patterns * 20),
        x: x + (-20 + Math.random() * 40)
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 2.5 + (patterns * 0.5), 
        ease: "easeOut"
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 1000,
        color: color,
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: getScoreSize(combo, patterns)
      }}
    >
      +{score}
      {combo > 10 && (
        <motion.span
          animate={{
            opacity: [0, 1, 0],
            scale: [0.8, 1.3, 1]
          }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{
            display: 'block',
            fontSize: '10px',
            marginTop: '2px'
          }}
        >
          x{combo} COMBO!
        </motion.span>
      )}
      {speed !== 'lame' && (
        <motion.span
          animate={{
            opacity: [0, 1, 0],
            scale: [0.6, 1.1, 0.9]
          }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            display: 'block',
            fontSize: '8px',
            marginTop: '1px',
            color: speed === 'perfect' ? '#ff6b6b' : speed === 'best' ? '#ffd93d' : '#4ecdc4'
          }}
        >
          {speed.toUpperCase()}!
        </motion.span>
      )}
      {patterns > 0 && (
        <motion.span
          animate={{
            opacity: [0, 1, 0],
            scale: [0.4, 1.2, 1],
            rotate: [0, 360, 180]
          }}
          transition={{ duration: 1.5, delay: 0.2 }}
          style={{
            display: 'block',
            fontSize: '12px',
            marginTop: '2px',
            color: '#ff6b6b'
          }}
        >
          ⭐ BONUS!
        </motion.span>
      )}
    </motion.div>
  );
};

// Enhanced character explosion with speed and pattern effects
export const CharacterExplosion = ({ char, x, y, isCorrect, combo = 1, speed = 'lame', patterns = 0, onComplete }) => {
  const getExplosionColor = (isCorrect, speed, combo) => {
    if (!isCorrect) return '#ff1744';
    
    const speedColors = {
      perfect: '#ff6b6b',
      best: '#ffd93d',
      good: '#4ecdc4',
      lame: '#00ff00'
    };
    
    return speedColors[speed] || '#00ff00';
  };

  const explosionColor = getExplosionColor(isCorrect, speed, combo);
  const particleCount = isCorrect ? Math.min(8 + combo / 2 + patterns * 3, 20) : 10;
  const explosionSize = isCorrect ? Math.min(35 + combo * 2 + patterns * 8, 100) : 30;
  const speedMultiplier = { perfect: 1.5, best: 1.3, good: 1.1, lame: 1 }[speed] || 1;
  
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (i * (360 / particleCount)) * (Math.PI / 180),
    velocity: (20 + Math.random() * explosionSize) * speedMultiplier,
    size: isCorrect ? 2 + Math.random() * (4 + patterns) : 2 + Math.random() * 2,
    delay: Math.random() * 0.3
  }));

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 2 + (patterns * 0.3) }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 999
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 1,
            opacity: 1
          }}
          animate={{ 
            x: Math.cos(particle.angle) * particle.velocity,
            y: Math.sin(particle.angle) * particle.velocity,
            scale: [1, 1.8 + (patterns * 0.2), 0],
            opacity: [1, 0.9, 0]
          }}
          transition={{ 
            duration: 1.5 + (patterns * 0.2), 
            ease: "easeOut",
            delay: particle.delay
          }}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${explosionColor}, ${explosionColor}88)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${particle.size * 3}px ${explosionColor}`
          }}
        />
      ))}
      
      {/* Enhanced main character explosion */}
      <motion.div
        initial={{ scale: 1, rotate: 0 }}
        animate={{ 
          scale: isCorrect ? [1, 3.5 + (patterns * 0.5), 0] : [1, 3, 0], 
          opacity: [1, 0.9, 0],
          rotate: isCorrect ? [0, 180 + (patterns * 60), 360 + (patterns * 120)] : [0, -90, -180]
        }}
        transition={{ duration: 1 + (patterns * 0.2) }}
        style={{
          color: explosionColor,
          fontFamily: "'Courier New', monospace",
          fontWeight: 'bold',
          fontSize: isCorrect && (combo > 10 || patterns > 0) ? '24px' : '18px',
          textShadow: `0 0 ${20 + patterns * 5}px ${explosionColor}`,
          position: 'absolute',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {char}
      </motion.div>

      {/* Speed indicator */}
      {isCorrect && speed !== 'lame' && (
        <motion.div
          initial={{ scale: 0, y: -10, opacity: 0 }}
          animate={{ 
            scale: [1, 1.5, 1.2],
            y: [-30, -40, -35],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 1.2,
            opacity: { delay: 0.8, duration: 0.4 }
          }}
          style={{
            position: 'absolute',
            top: '-35px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: explosionColor,
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: `0 0 10px ${explosionColor}`
          }}
        >
          {speed.toUpperCase()}!
        </motion.div>
      )}

      {/* Pattern bonus indicator */}
      {patterns > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: [1, 2, 1.5],
            rotate: [0, 360, 180],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 1.5,
            opacity: { delay: 1, duration: 0.5 }
          }}
          style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ff6b6b',
            fontSize: '16px',
            fontWeight: 'bold',
            textShadow: '0 0 15px #ff6b6b'
          }}
        >
          ⭐ BONUS!
        </motion.div>
      )}

      {/* Enhanced error indicator */}
      {!isCorrect && (
        <motion.div
          initial={{ scale: 0, y: 0, rotate: -90 }}
          animate={{ 
            scale: [1, 2, 1.5],
            y: [-25, -35, -30],
            rotate: [0, 15, -15, 0],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 1.2,
            opacity: { delay: 0.6, duration: 0.6 }
          }}
          style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ff1744',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '0 0 20px #ff1744'
          }}
        >
          ✗
        </motion.div>
      )}

      {/* Enhanced celebration rings for high performance */}
      {isCorrect && (combo > 5 || patterns > 0) && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 2.5 + patterns, 4 + patterns],
              opacity: [1, 0.7, 0]
            }}
            transition={{ duration: 2 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              border: `4px solid ${explosionColor}`,
              borderRadius: '50%',
              boxShadow: `0 0 30px ${explosionColor}`
            }}
          />
          
          {patterns > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{
                scale: [0, 3 + patterns, 5 + patterns],
                opacity: [0.8, 0.5, 0]
              }}
              transition={{ duration: 2.5, delay: 0.3 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px',
                border: `6px solid ${explosionColor}`,
                borderRadius: '50%',
                boxShadow: `0 0 40px ${explosionColor}`
              }}
            />
          )}
        </>
      )}
    </motion.div>
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

// Dynamic anticipation cursor
export const AnticipationCursor = ({ isVisible, position, typingSpeed = 'lame', anticipationLevel = 1, combo = 1 }) => {
  if (!isVisible) return null;
  
  const getSpeedColor = (speed) => {
    const colors = {
      perfect: '#ff6b6b',
      best: '#ffd93d',
      good: '#4ecdc4',
      lame: '#00ff00'
    };
    return colors[speed] || colors.lame;
  };

  const cursorColor = getSpeedColor(typingSpeed);
  const intensity = Math.min(1 + (combo / 15) + anticipationLevel, 3);

  return (
    <motion.div
      animate={{
        opacity: [1, 0.3, 1],
        scaleY: [1, 1.1 + (anticipationLevel * 0.1), 1],
        boxShadow: [
          `0 0 8px ${cursorColor}`,
          `0 0 ${15 * intensity}px ${cursorColor}`,
          `0 0 8px ${cursorColor}`
        ]
      }}
      transition={{
        opacity: { duration: 0.6 / Math.max(1, anticipationLevel), repeat: Infinity },
        scaleY: { duration: 0.6 / Math.max(1, anticipationLevel), repeat: Infinity },
        boxShadow: { duration: 0.6 / Math.max(1, anticipationLevel), repeat: Infinity }
      }}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '3px',
        height: '20px',
        background: `linear-gradient(180deg, ${cursorColor}, ${cursorColor}aa)`,
        borderRadius: '2px',
        zIndex: 1000,
        pointerEvents: 'none'
      }}
    >
      {/* Speed indicator for current character */}
      {typingSpeed !== 'lame' && (
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
            color: cursorColor,
            fontWeight: 'bold',
            textShadow: `0 0 5px ${cursorColor}`,
            zIndex: 10
          }}
        >
          {typingSpeed.toUpperCase()}
        </motion.div>
      )}
    </motion.div>
  );
};

// Background wave effect
export const BackgroundWaveEffect = ({ isActive, intensity = 1, combo = 1, anticipationLevel = 1, typingSpeed = 'lame' }) => {
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

// Enhanced Screen Flash Effect for Major Events
export const ScreenFlashEffect = ({ isActive, intensity = 1, color = '#ffffff', type = 'success' }) => {
  if (!isActive) return null;

  const flashColors = {
    success: '#00ff00',
    perfect: '#ff6b6b', 
    combo: '#ffd93d',
    error: '#ff1744',
    achievement: '#ff6b6b'
  };

  const flashColor = flashColors[type] || color;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.4 * intensity, 0.6 * intensity, 0]
      }}
      transition={{ 
        duration: type === 'error' ? 0.15 : 0.3,
        ease: "easeInOut"
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle, ${flashColor}22, ${flashColor}11, transparent)`,
        zIndex: 999,
        pointerEvents: 'none'
      }}
    />
  );
};

// Progressive Intensity Background Effect
export const ProgressiveBackgroundEffect = ({ 
  isActive, 
  combo = 1, 
  perfectStreak = 0, 
  typingSpeed = 'lame',
  anticipationLevel = 1 
}) => {
  const [time, setTime] = useState(0);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setTime(prev => prev + (0.1 * anticipationLevel));
    }, 50);
    
    return () => clearInterval(interval);
  }, [isActive, anticipationLevel]);

  // Generate floating particles for high performance
  useEffect(() => {
    if (combo >= 20 || perfectStreak >= 10) {
      const particleCount = Math.min(Math.floor(combo / 5) + Math.floor(perfectStreak / 3), 15);
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        speed: 0.5 + Math.random() * 1.5,
        color: combo >= 50 ? '#ff6b6b' : combo >= 30 ? '#ffd93d' : '#4ecdc4'
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [combo, perfectStreak]);

  if (!isActive) return null;

  const getIntensityLevel = () => {
    if (combo >= 50 || perfectStreak >= 15) return 'legendary';
    if (combo >= 30 || perfectStreak >= 10) return 'epic';
    if (combo >= 20 || perfectStreak >= 7) return 'rare';
    if (combo >= 10 || perfectStreak >= 5) return 'uncommon';
    return 'common';
  };

  const intensityLevel = getIntensityLevel();
  const baseOpacity = {
    legendary: 0.25,
    epic: 0.2,
    rare: 0.15,
    uncommon: 0.1,
    common: 0.05
  }[intensityLevel];

  const pulseOpacity = baseOpacity + Math.sin(time * 2) * (baseOpacity * 0.5);

  const getGradientByIntensity = () => {
    const speedColors = {
      perfect: ['255, 107, 107', '255, 20, 147'],
      best: ['255, 217, 61', '255, 193, 7'],
      good: ['78, 205, 196', '0, 188, 212'],
      lame: ['0, 255, 0', '0, 255, 255']
    };
    
    const [color1, color2] = speedColors[typingSpeed] || speedColors.lame;
    
    switch (intensityLevel) {
      case 'legendary':
        return `
          radial-gradient(circle at ${50 + Math.sin(time) * 30}% ${50 + Math.cos(time * 1.5) * 30}%, 
            rgba(${color1}, ${pulseOpacity * 2}) 0%, 
            rgba(${color2}, ${pulseOpacity * 1.5}) 20%, 
            rgba(255, 107, 107, ${pulseOpacity}) 40%,
            transparent 70%),
          linear-gradient(${time * 60}deg, 
            rgba(${color1}, ${pulseOpacity * 0.6}) 0%, 
            rgba(${color2}, ${pulseOpacity * 0.4}) 50%, 
            rgba(255, 107, 107, ${pulseOpacity * 0.3}) 100%)
        `;
      case 'epic':
        return `
          radial-gradient(circle at ${50 + Math.sin(time * 1.3) * 25}% ${50 + Math.cos(time) * 25}%, 
            rgba(${color1}, ${pulseOpacity * 1.5}) 0%, 
            rgba(${color2}, ${pulseOpacity * 1.2}) 30%, 
            transparent 60%),
          linear-gradient(${time * 45}deg, 
            rgba(${color1}, ${pulseOpacity * 0.4}) 0%, 
            rgba(${color2}, ${pulseOpacity * 0.3}) 50%, 
            rgba(${color1}, ${pulseOpacity * 0.4}) 100%)
        `;
      case 'rare':
        return `
          radial-gradient(circle at ${50 + Math.sin(time * 0.8) * 20}% ${50 + Math.cos(time * 1.2) * 20}%, 
            rgba(${color1}, ${pulseOpacity * 1.2}) 0%, 
            rgba(${color2}, ${pulseOpacity * 0.9}) 40%, 
            transparent 70%),
          linear-gradient(${time * 30}deg, 
            rgba(${color1}, ${pulseOpacity * 0.3}) 0%, 
            rgba(${color2}, ${pulseOpacity * 0.2}) 50%, 
            rgba(${color1}, ${pulseOpacity * 0.3}) 100%)
        `;
      default:
        return `
          radial-gradient(circle at ${50 + Math.sin(time * 0.5) * 10}% ${50 + Math.cos(time * 0.7) * 10}%, 
            rgba(${color1}, ${pulseOpacity}) 0%, 
            rgba(${color2}, ${pulseOpacity * 0.7}) 60%, 
            transparent 80%),
          linear-gradient(${time * 20}deg, 
            rgba(${color1}, ${pulseOpacity * 0.2}) 0%, 
            rgba(${color2}, ${pulseOpacity * 0.15}) 50%, 
            rgba(${color1}, ${pulseOpacity * 0.2}) 100%)
        `;
    }
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
        background: getGradientByIntensity(),
        pointerEvents: 'none',
        zIndex: -1
      }}
    >
      {/* Floating Performance Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y - 40}%`],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0.5],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            style={{
              position: 'absolute',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: `radial-gradient(circle, ${particle.color}, ${particle.color}88)`,
              borderRadius: '50%',
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
              pointerEvents: 'none'
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Intensity Level Indicator */}
      {intensityLevel !== 'common' && (
        <motion.div
          animate={{
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: `linear-gradient(45deg, ${particles[0]?.color || '#4ecdc4'}, ${particles[0]?.color || '#4ecdc4'}88)`,
            color: '#fff',
            padding: '5px 10px',
            borderRadius: '15px',
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            border: `1px solid ${particles[0]?.color || '#4ecdc4'}`,
            boxShadow: `0 0 15px ${particles[0]?.color || '#4ecdc4'}`,
            zIndex: 10
          }}
        >
          {intensityLevel} MODE
        </motion.div>
      )}
    </motion.div>
  );
};

// Enhanced Pattern Celebration with Screen Effects
export const PatternCelebration = ({ pattern, onComplete }) => {
  const [showScreenFlash, setShowScreenFlash] = useState(false);

  useEffect(() => {
    if (pattern.bonus >= 100) {
      setShowScreenFlash(true);
      setTimeout(() => setShowScreenFlash(false), 300);
    }
  }, [pattern.bonus]);

  const getPatternInfo = (type) => {
    const patterns = {
      perfect_streak: { 
        icon: '⚡', 
        name: 'PERFECT STREAK',
        color: '#ff6b6b',
        celebration: 'LIGHTNING FAST!'
      },
      function_declaration: { 
        icon: '🔧', 
        name: 'FUNCTION MASTER',
        color: '#4ecdc4',
        celebration: 'CODE WIZARD!'
      },
      bracket_combo: { 
        icon: '🎯', 
        name: 'BRACKET COMBO',
        color: '#ffd93d',
        celebration: 'SYNTAX MASTER!'
      },
      speed_consistency: { 
        icon: '🚀', 
        name: 'SPEED DEMON',
        color: '#6bcf7f',
        celebration: 'UNSTOPPABLE!'
      },
      line_completion: { 
        icon: '✅', 
        name: 'LINE COMPLETE',
        color: '#45b7d1',
        celebration: 'CLEAN CODE!'
      },
      combo_milestone: { 
        icon: '🔥', 
        name: 'COMBO MILESTONE',
        color: '#ff6b6b',
        celebration: 'ON FIRE!'
      }
    };
    
    return patterns[type] || { 
      icon: '⭐', 
      name: 'BONUS',
      color: '#ffaa00',
      celebration: 'AMAZING!'
    };
  };
  
  const patternInfo = getPatternInfo(pattern.type);
  
  return (
    <>
      {/* Screen Flash for Major Patterns */}
      <ScreenFlashEffect 
        isActive={showScreenFlash}
        intensity={Math.min(pattern.bonus / 100, 2)}
        type="achievement"
      />
      
      {/* Main Pattern Celebration */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 100, rotate: -45 }}
        animate={{ 
          scale: [0, 1.5, 1.2, 1],
          opacity: [0, 1, 1, 1, 0],
          y: [100, 20, 0, -20, -150],
          rotate: [0, 15, -10, 5, 0]
        }}
        transition={{ 
          duration: 3,
          times: [0, 0.2, 0.4, 0.8, 1],
          ease: "easeOut"
        }}
        onAnimationComplete={onComplete}
        style={{
          position: 'fixed',
          top: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1001,
          background: `linear-gradient(135deg, ${patternInfo.color}, ${patternInfo.color}cc, ${patternInfo.color}88)`,
          padding: '20px 30px',
          borderRadius: '20px',
          color: '#fff',
          fontFamily: "'Courier New', monospace",
          fontWeight: 'bold',
          fontSize: '18px',
          textAlign: 'center',
          border: `3px solid ${patternInfo.color}`,
          boxShadow: `0 0 40px ${patternInfo.color}, inset 0 0 20px rgba(255,255,255,0.2)`,
          minWidth: '250px'
        }}
      >
        {/* Orbiting particles around the celebration */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              rotate: [0, 360],
              scale: [0.5, 1.2, 0.8, 1]
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, delay: i * 0.2 },
              scale: { duration: 1, repeat: Infinity, delay: i * 0.1 }
            }}
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              background: patternInfo.color,
              borderRadius: '50%',
              top: '50%',
              left: '50%',
              transformOrigin: `${40 + i * 8}px 0px`,
              boxShadow: `0 0 10px ${patternInfo.color}`
            }}
          />
        ))}
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{
            duration: 0.8,
            repeat: 2
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
            {patternInfo.icon}
          </div>
          <div style={{ fontSize: '16px', marginBottom: '5px' }}>
            {patternInfo.name}
          </div>
          <div style={{ fontSize: '12px', color: '#ffff00', marginBottom: '8px' }}>
            +{pattern.bonus} BONUS POINTS!
          </div>
          <motion.div 
            animate={{
              opacity: [0, 1, 0],
              scale: [0.8, 1.1, 0.9]
            }}
            transition={{
              duration: 1.5,
              delay: 0.5
            }}
            style={{ 
              fontSize: '14px', 
              color: '#fff',
              textShadow: `0 0 10px ${patternInfo.color}`
            }}
          >
            {patternInfo.celebration}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};

// Enhanced combo multiplier with anticipation effects
export const ComboMultiplier = ({ multiplier, isActive, anticipationLevel = 1, typingSpeed = 'lame' }) => {