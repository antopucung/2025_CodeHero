import React, { useEffect, useRef, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Floating score animations
export const FloatingScore = ({ score, x, y, onComplete }) => {
  return (
    <motion.div
      initial={{ 
        opacity: 1, 
        scale: 0.5, 
        x: x, 
        y: y,
        rotate: -10 + Math.random() * 20
      }}
      animate={{ 
        opacity: 0, 
        scale: 1.5, 
        y: y - 100,
        rotate: -20 + Math.random() * 40
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 1.5, 
        ease: "easeOut",
        scale: { duration: 0.3 }
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 1000,
        color: '#00ff00',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '18px',
        textShadow: '0 0 10px #00ff00'
      }}
    >
      +{score} XP
    </motion.div>
  );
};

// Streak counter with pulsing effect
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

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ 
        scale: [1, 1.2, 1], 
        rotate: 0,
        y: [0, -10, 0]
      }}
      exit={{ scale: 0, rotate: 180 }}
      transition={{ 
        duration: 0.6,
        scale: { repeat: Infinity, duration: 0.8 }
      }}
      style={{
        position: 'fixed',
        top: '20%',
        right: '20px',
        zIndex: 1000,
        background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
        padding: '10px 20px',
        borderRadius: '25px',
        color: '#000',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        boxShadow: '0 0 20px rgba(255, 107, 107, 0.5)'
      }}
    >
      🔥 {streak} STREAK! 🔥
      {combo > 1 && <div style={{ fontSize: '12px' }}>x{combo} COMBO</div>}
    </motion.div>
  );
};

// Character explosion effect
export const CharacterExplosion = ({ char, x, y, isCorrect, onComplete }) => {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    angle: (i * 45) * (Math.PI / 180),
    velocity: 50 + Math.random() * 30,
    color: isCorrect ? '#00ff00' : '#ff4444'
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
            width: '4px',
            height: '4px',
            backgroundColor: particle.color,
            borderRadius: '50%',
            boxShadow: `0 0 6px ${particle.color}`
          }}
        />
      ))}
      
      {/* Character itself with explosion */}
      <motion.div
        initial={{ scale: 1, rotate: 0 }}
        animate={{ 
          scale: [1, 2, 0], 
          rotate: 360,
          opacity: [1, 1, 0]
        }}
        transition={{ duration: 0.6 }}
        style={{
          color: isCorrect ? '#00ff00' : '#ff4444',
          fontFamily: "'Courier New', monospace",
          fontWeight: 'bold',
          fontSize: '16px',
          textShadow: `0 0 10px ${isCorrect ? '#00ff00' : '#ff4444'}`
        }}
      >
        {char}
      </motion.div>
    </motion.div>
  );
};

// Screen shake effect
export const ScreenShake = ({ isShaking, children }) => {
  return (
    <motion.div
      animate={isShaking ? {
        x: [0, -2, 2, -2, 2, 0],
        y: [0, -1, 1, -1, 1, 0]
      } : { x: 0, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// Progress bar with juice
export const JuicyProgressBar = ({ progress, color = '#00ff00' }) => {
  return (
    <Box position="relative" bg="#000" border="1px solid #333" h="8px">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          boxShadow: `0 0 10px ${color}`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Animated shine effect */}
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

// Level up animation
export const LevelUpAnimation = ({ isVisible, newLevel, onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ff00', '#ffff00', '#ff6b6b']
      });
      
      // Screen flash effect
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 255, 0, 0.3);
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(flash);
      
      setTimeout(() => {
        document.body.removeChild(flash);
      }, 200);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ 
        scale: [0, 1.2, 1], 
        rotate: [0, 10, 0],
        opacity: 1
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 1, ease: "backOut" }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        textAlign: 'center',
        background: 'linear-gradient(45deg, #000, #003300)',
        border: '3px solid #00ff00',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 0 50px #00ff00'
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
        <Text fontSize="6xl" color="#ffff00" fontWeight="bold">
          {newLevel}
        </Text>
      </motion.div>
    </motion.div>
  );
};

// Combo multiplier display
export const ComboMultiplier = ({ multiplier, isActive }) => {
  if (!isActive || multiplier <= 1) return null;

  return (
    <motion.div
      initial={{ scale: 0, y: 20 }}
      animate={{ 
        scale: [1, 1.2, 1], 
        y: 0,
        rotate: [0, 5, -5, 0]
      }}
      transition={{ 
        scale: { repeat: Infinity, duration: 0.6 },
        rotate: { repeat: Infinity, duration: 1.2 }
      }}
      style={{
        position: 'fixed',
        top: '30%',
        right: '20px',
        zIndex: 1000,
        background: 'linear-gradient(45deg, #ffd93d, #ff6b6b)',
        padding: '15px',
        borderRadius: '50%',
        color: '#000',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '18px',
        textAlign: 'center',
        boxShadow: '0 0 30px rgba(255, 217, 61, 0.8)',
        minWidth: '60px',
        minHeight: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      x{multiplier}
    </motion.div>
  );
};