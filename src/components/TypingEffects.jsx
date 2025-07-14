import React, { useEffect, useRef, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Enhanced floating score animations with combo colors
export const FloatingScore = ({ score, x, y, color = '#00ff00', onComplete }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 1, 
        scale: 0.3, 
        x: x, 
        y: y,
        rotate: -15 + Math.random() * 30
      }}
      animate={{ 
        opacity: 0, 
        scale: 2, 
        y: y - 120,
        rotate: -30 + Math.random() * 60,
        x: x + (-20 + Math.random() * 40)
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 2, 
        ease: "easeOut",
        scale: { duration: 0.4 }
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 1000,
        color: color,
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '20px',
        textShadow: `0 0 15px ${color}, 0 0 30px ${color}`
      }}
    >
      +{score}
    </motion.div>
  );
};

// Enhanced streak counter with fire effects
export const StreakCounter = ({ streak, combo }) => {
  const [showStreak, setShowStreak] = useState(false);

  useEffect(() => {
    if (streak > 5) {
      setShowStreak(true);
      const timer = setTimeout(() => setShowStreak(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  if (!showStreak) return null;

  const getStreakColor = (streak) => {
    if (streak >= 50) return 'linear-gradient(45deg, #ff1744, #ff6b6b)';
    if (streak >= 30) return 'linear-gradient(45deg, #ff6b6b, #ffd93d)';
    if (streak >= 20) return 'linear-gradient(45deg, #ffd93d, #6bcf7f)';
    if (streak >= 10) return 'linear-gradient(45deg, #6bcf7f, #4ecdc4)';
    return 'linear-gradient(45deg, #4ecdc4, #45b7d1)';
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: [1, 1.3, 1], 
        rotate: 0,
        y: [0, -15, 0]
      }}
      exit={{ scale: 0, rotate: 180 }}
      transition={{ 
        duration: 0.8,
        scale: { repeat: Infinity, duration: 1.2 }
      }}
      style={{
        position: 'fixed',
        top: '15%',
        right: '20px',
        zIndex: 1000,
        background: getStreakColor(streak),
        padding: '15px 25px',
        borderRadius: '30px',
        color: '#000',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '16px',
        boxShadow: '0 0 30px rgba(255, 107, 107, 0.6)',
        textAlign: 'center'
      }}
    >
      🔥 {streak} STREAK! 🔥
      {combo > 1 && (
        <div style={{ 
          fontSize: '12px', 
          marginTop: '5px',
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '10px',
          padding: '2px 8px'
        }}>
          x{combo} COMBO
        </div>
      )}
    </motion.div>
  );
};

// Enhanced character explosion effect with combo colors
export const CharacterExplosion = ({ char, x, y, isCorrect, combo = 1, onComplete }) => {
  const getExplosionColor = (isCorrect, combo) => {
    if (!isCorrect) return '#ff1744';
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 10) return '#4ecdc4';
    if (combo >= 5) return '#45b7d1';
    return '#00ff00';
  };

  const explosionColor = getExplosionColor(isCorrect, combo);
  const particleCount = isCorrect ? Math.min(8 + combo, 16) : 6;
  
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (i * (360 / particleCount)) * (Math.PI / 180),
    velocity: 40 + Math.random() * 40 + (combo * 2),
    size: 3 + Math.random() * 3 + (combo * 0.2)
  }));

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
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
            scale: 0,
            opacity: 0
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: explosionColor,
            borderRadius: '50%',
            boxShadow: `0 0 8px ${explosionColor}`
          }}
        />
      ))}
      
      {/* Enhanced character explosion */}
      <motion.div
        initial={{ scale: 1, rotate: 0 }}
        animate={{ 
          scale: [1, 2.5, 0], 
          rotate: isCorrect ? 360 : -360,
          opacity: [1, 1, 0]
        }}
        transition={{ duration: 0.8 }}
        style={{
          color: explosionColor,
          fontFamily: "'Courier New', monospace",
          fontWeight: 'bold',
          fontSize: '20px',
          textShadow: `0 0 15px ${explosionColor}, 0 0 30px ${explosionColor}`
        }}
      >
        {char}
      </motion.div>

      {/* Error indicator */}
      {!isCorrect && (
        <motion.div
          initial={{ scale: 0, y: 0 }}
          animate={{ 
            scale: [1, 1.5, 1],
            y: [-20, -30, -20]
          }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'absolute',
            top: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ff1744',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '0 0 10px #ff1744'
          }}
        >
          ✗
        </motion.div>
      )}
    </motion.div>
  );
};

// Enhanced screen shake effect
export const ScreenShake = ({ isShaking, children }) => {
  return (
    <motion.div
      animate={isShaking ? {
        x: [0, -4, 4, -4, 4, 0],
        y: [0, -2, 2, -2, 2, 0]
      } : { x: 0, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
};

// Enhanced progress bar with animated shine
export const JuicyProgressBar = ({ progress, color = '#00ff00' }) => {
  return (
    <Box position="relative" bg="#000" border="1px solid #333" h="10px" borderRadius="2px" overflow="hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}cc, ${color})`,
          boxShadow: `0 0 15px ${color}`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Enhanced animated shine effect */}
        <motion.div
          animate={{ x: [-150, 300] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2.5, 
            ease: "linear" 
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            width: '150px',
            transform: 'skewX(-20deg)'
          }}
        />
      </motion.div>
    </Box>
  );
};

// Enhanced level up animation
export const LevelUpAnimation = ({ isVisible, newLevel, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      // Massive confetti celebration
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#00ff00', '#ffff00', '#ff6b6b', '#4ecdc4', '#ffd93d']
          });
        }, i * 200);
      }
      
      // Enhanced screen flash effect
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(45deg, rgba(0, 255, 0, 0.4), rgba(255, 255, 0, 0.4));
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(flash);
      
      setTimeout(() => {
        if (document.body.contains(flash)) {
          document.body.removeChild(flash);
        }
      }, 300);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ 
        scale: [0, 1.3, 1], 
        rotate: [0, 20, 0],
        opacity: 1
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 1.2, ease: "backOut" }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        textAlign: 'center',
        background: 'linear-gradient(45deg, #000, #003300, #000)',
        border: '4px solid #00ff00',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 0 60px #00ff00, inset 0 0 30px rgba(0,255,0,0.1)'
      }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          textShadow: [
            '0 0 15px #00ff00',
            '0 0 30px #00ff00',
            '0 0 15px #00ff00'
          ]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.8 
        }}
      >
        <Text fontSize="4xl" color="#00ff00" fontWeight="bold" mb={3}>
          🎉 LEVEL UP! 🎉
        </Text>
        <Text fontSize="8xl" color="#ffff00" fontWeight="bold" textShadow="0 0 20px #ffff00">
          {newLevel}
        </Text>
        <Text fontSize="lg" color="#ffd93d" mt={3}>
          INCREDIBLE PROGRESS!
        </Text>
      </motion.div>
    </motion.div>
  );
};

// Enhanced combo multiplier display
export const ComboMultiplier = ({ multiplier, isActive }) => {
  if (!isActive || multiplier <= 1) return null;

  const getComboStyle = (multiplier) => {
    if (multiplier >= 50) return {
      bg: 'linear-gradient(45deg, #ff1744, #ff6b6b)',
      color: '#fff',
      shadow: 'rgba(255, 23, 68, 0.8)'
    };
    if (multiplier >= 30) return {
      bg: 'linear-gradient(45deg, #ffd93d, #ff6b6b)',
      color: '#000',
      shadow: 'rgba(255, 217, 61, 0.8)'
    };
    if (multiplier >= 20) return {
      bg: 'linear-gradient(45deg, #6bcf7f, #ffd93d)',
      color: '#000',
      shadow: 'rgba(107, 207, 127, 0.8)'
    };
    if (multiplier >= 10) return {
      bg: 'linear-gradient(45deg, #4ecdc4, #6bcf7f)',
      color: '#000',
      shadow: 'rgba(78, 205, 196, 0.8)'
    };
    return {
      bg: 'linear-gradient(45deg, #45b7d1, #4ecdc4)',
      color: '#fff',
      shadow: 'rgba(69, 183, 209, 0.8)'
    };
  };

  const style = getComboStyle(multiplier);

  return (
    <motion.div
      initial={{ scale: 0, y: 20 }}
      animate={{ 
        scale: [1, 1.3, 1], 
        y: 0,
        rotate: [0, 10, -10, 0]
      }}
      transition={{ 
        scale: { repeat: Infinity, duration: 0.8 },
        rotate: { repeat: Infinity, duration: 1.5 }
      }}
      style={{
        position: 'fixed',
        top: '25%',
        right: '20px',
        zIndex: 1000,
        background: style.bg,
        padding: '20px',
        borderRadius: '50%',
        color: style.color,
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '24px',
        textAlign: 'center',
        boxShadow: `0 0 40px ${style.shadow}`,
        minWidth: '80px',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <div>x{multiplier}</div>
      <div style={{ fontSize: '10px', marginTop: '2px' }}>COMBO</div>
    </motion.div>
  );
};