import React, { useEffect, useRef, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Simple floating score animations
export const FloatingScore = ({ score, x, y, color = '#00ff00', onComplete }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 1, 
        scale: 0.5, 
        x: x, 
        y: y
      }}
      animate={{ 
        opacity: 0, 
        scale: 1.5, 
        y: y - 80,
        x: x + (-10 + Math.random() * 20)
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 1.5, 
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
        fontSize: '16px',
        textShadow: `0 0 10px ${color}`
      }}
    >
      +{score}
    </motion.div>
  );
};

// Simple streak counter
export const StreakCounter = ({ streak, combo }) => {
  const [showStreak, setShowStreak] = useState(false);

  useEffect(() => {
    if (streak > 5) {
      setShowStreak(true);
      const timer = setTimeout(() => setShowStreak(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [streak]);

  if (!showStreak) return null;

  const getStreakColor = (streak) => {
    if (streak >= 50) return '#ff6b6b';
    if (streak >= 30) return '#ffd93d';
    if (streak >= 20) return '#6bcf7f';
    if (streak >= 10) return '#4ecdc4';
    return '#45b7d1';
  };

  const streakColor = getStreakColor(streak);

  return (
    <motion.div
      initial={{ scale: 0, y: 20 }}
      animate={{ 
        scale: [1, 1.1, 1], 
        y: 0
      }}
      exit={{ scale: 0, y: 20 }}
      transition={{ 
        scale: { repeat: Infinity, duration: 1 }
      }}
      style={{
        position: 'fixed',
        top: '15%',
        right: '20px',
        zIndex: 1000,
        background: streakColor,
        padding: '10px 20px',
        borderRadius: '20px',
        color: '#000',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '14px',
        boxShadow: `0 0 20px ${streakColor}`,
        textAlign: 'center'
      }}
    >
      🔥 {streak} STREAK!
      {combo > 1 && (
        <div style={{ fontSize: '10px', marginTop: '2px' }}>
          x{combo} COMBO
        </div>
      )}
    </motion.div>
  );
};

// Simple character explosion effect
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
  const particleCount = isCorrect ? Math.min(4 + combo / 5, 8) : 4;
  
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (i * (360 / particleCount)) * (Math.PI / 180),
    velocity: 20 + Math.random() * 20,
    size: 2 + Math.random() * 2
  }));

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1 }}
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
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: explosionColor,
            borderRadius: '50%',
            boxShadow: `0 0 6px ${explosionColor}`
          }}
        />
      ))}
      
      {/* Simple character explosion */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ 
          scale: [1, 2, 0], 
          opacity: [1, 1, 0]
        }}
        transition={{ duration: 0.6 }}
        style={{
          color: explosionColor,
          fontFamily: "'Courier New', monospace",
          fontWeight: 'bold',
          fontSize: '16px',
          textShadow: `0 0 10px ${explosionColor}`
        }}
      >
        {char}
      </motion.div>

      {/* Simple error indicator */}
      {!isCorrect && (
        <motion.div
          initial={{ scale: 0, y: 0 }}
          animate={{ 
            scale: [1, 1.2, 1],
            y: [-15, -20, -15]
          }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ff1744',
            fontSize: '16px',
            fontWeight: 'bold',
            textShadow: '0 0 8px #ff1744'
          }}
        >
          ✗
        </motion.div>
      )}
    </motion.div>
  );
};

// Simple progress bar with shine
export const JuicyProgressBar = ({ progress, color = '#00ff00' }) => {
  return (
    <Box position="relative" bg="#000" border="1px solid #333" h="8px" borderRadius="2px" overflow="hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          height: '100%',
          background: color,
          boxShadow: `0 0 10px ${color}`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Simple shine effect */}
        <motion.div
          animate={{ x: [-100, 200] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: "linear" 
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            width: '100px'
          }}
        />
      </motion.div>
    </Box>
  );
};

// Simple level up animation
export const LevelUpAnimation = ({ isVisible, newLevel, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      // Simple confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ff00', '#ffff00', '#ff6b6b', '#4ecdc4', '#ffd93d']
      });
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.1, 1], 
        opacity: 1
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.8, ease: "backOut" }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        textAlign: 'center',
        background: '#000',
        border: '3px solid #00ff00',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 40px #00ff00'
      }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          textShadow: [
            '0 0 10px #00ff00',
            '0 0 20px #00ff00',
            '0 0 10px #00ff00'
          ]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.5 
        }}
      >
        <Text fontSize="3xl" color="#00ff00" fontWeight="bold" mb={2}>
          🎉 LEVEL UP! 🎉
        </Text>
        <Text fontSize="6xl" color="#ffff00" fontWeight="bold" textShadow="0 0 15px #ffff00">
          {newLevel}
        </Text>
        <Text fontSize="md" color="#ffd93d" mt={2}>
          GREAT PROGRESS!
        </Text>
      </motion.div>
    </motion.div>
  );
};

// Simple combo multiplier display
export const ComboMultiplier = ({ multiplier, isActive }) => {
  if (!isActive || multiplier <= 1) return null;

  const getComboStyle = (multiplier) => {
    if (multiplier >= 50) return { bg: '#ff6b6b', color: '#fff' };
    if (multiplier >= 30) return { bg: '#ffd93d', color: '#000' };
    if (multiplier >= 20) return { bg: '#6bcf7f', color: '#000' };
    if (multiplier >= 10) return { bg: '#4ecdc4', color: '#000' };
    return { bg: '#45b7d1', color: '#fff' };
  };

  const style = getComboStyle(multiplier);

  return (
    <motion.div
      initial={{ scale: 0, y: 20 }}
      animate={{ 
        scale: [1, 1.1, 1], 
        y: 0
      }}
      transition={{ 
        scale: { repeat: Infinity, duration: 0.6 }
      }}
      style={{
        position: 'fixed',
        top: '25%',
        right: '20px',
        zIndex: 1000,
        background: style.bg,
        padding: '15px',
        borderRadius: '50%',
        color: style.color,
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '18px',
        textAlign: 'center',
        boxShadow: `0 0 25px ${style.bg}`,
        minWidth: '60px',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      <div>x{multiplier}</div>
      <div style={{ fontSize: '8px', marginTop: '2px' }}>COMBO</div>
    </motion.div>
  );
};