import React, { useEffect, useRef, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Enhanced floating score with juicy effects
export const FloatingScore = ({ score, x, y, color = '#00ff00', combo = 1, onComplete }) => {
  const getScoreSize = (combo) => {
    if (combo >= 50) return '24px';
    if (combo >= 30) return '22px';
    if (combo >= 20) return '20px';
    if (combo >= 10) return '18px';
    return '16px';
  };

  const getScoreEffect = (combo) => {
    if (combo >= 50) return {
      scale: [0.5, 2, 1.5],
      rotate: [0, 360, 180],
      textShadow: [`0 0 10px ${color}`, `0 0 30px ${color}`, `0 0 20px ${color}`]
    };
    if (combo >= 30) return {
      scale: [0.5, 1.8, 1.3],
      rotate: [0, 180, 90],
      textShadow: [`0 0 8px ${color}`, `0 0 25px ${color}`, `0 0 15px ${color}`]
    };
    if (combo >= 10) return {
      scale: [0.5, 1.5, 1.2],
      rotate: [0, 90, 45],
      textShadow: [`0 0 6px ${color}`, `0 0 20px ${color}`, `0 0 12px ${color}`]
    };
    return {
      scale: [0.5, 1.3, 1],
      rotate: [0, 45, 0],
      textShadow: [`0 0 5px ${color}`, `0 0 15px ${color}`, `0 0 10px ${color}`]
    };
  };

  const effects = getScoreEffect(combo);

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
        y: y - 100,
        x: x + (-15 + Math.random() * 30)
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 2, 
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
        fontSize: getScoreSize(combo)
      }}
    >
      +{score}
      {combo > 10 && (
        <motion.span
          animate={{
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 1]
          }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            display: 'block',
            fontSize: '12px',
            marginTop: '2px'
          }}
        >
          x{combo} COMBO!
        </motion.span>
      )}
    </motion.div>
  );
};

// Enhanced streak counter with juicy effects
export const StreakCounter = ({ streak, combo }) => {
  const [showStreak, setShowStreak] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(1);

  useEffect(() => {
    if (streak > 5) {
      setShowStreak(true);
      setPulseIntensity(Math.min(1 + (streak / 20), 2));
      const timer = setTimeout(() => setShowStreak(false), 3000);
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
      initial={{ scale: 0, y: 20, rotate: -10 }}
      animate={{ 
        scale: [1, 1.2, 1], 
        y: 0,
        rotate: [0, 5, -5, 0],
        boxShadow: [
          `0 0 20px ${streakColor}`,
          `0 0 40px ${streakColor}`,
          `0 0 20px ${streakColor}`
        ]
      }}
      exit={{ scale: 0, y: 20 }}
      transition={{ 
        scale: { repeat: Infinity, duration: 1.2 },
        rotate: { repeat: Infinity, duration: 2 },
        boxShadow: { repeat: Infinity, duration: 1.5 }
      }}
      style={{
        position: 'fixed',
        top: '15%',
        right: '20px',
        zIndex: 1000,
        background: `linear-gradient(45deg, ${streakColor}, ${streakColor}cc)`,
        padding: '15px 25px',
        borderRadius: '25px',
        color: streak >= 30 ? '#000' : '#fff',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '16px',
        textAlign: 'center',
        border: `3px solid ${streakColor}`,
        transform: 'perspective(100px) rotateX(5deg)'
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity
        }}
      >
        🔥 {streak} STREAK!
      </motion.div>
      {combo > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            fontSize: '12px', 
            marginTop: '5px',
            textShadow: `0 0 10px ${streakColor}`
          }}
        >
          x{combo} COMBO ACTIVE
        </motion.div>
      )}
    </motion.div>
  );
};

// Enhanced character explosion with juicy effects
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
  const particleCount = isCorrect ? Math.min(6 + combo / 3, 16) : 8;
  const explosionSize = isCorrect ? Math.min(30 + combo * 2, 80) : 25;
  
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (i * (360 / particleCount)) * (Math.PI / 180),
    velocity: 15 + Math.random() * explosionSize,
    size: isCorrect ? 2 + Math.random() * 4 : 2 + Math.random() * 2,
    delay: Math.random() * 0.2
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
            scale: [1, 1.5, 0],
            opacity: [1, 0.8, 0]
          }}
          transition={{ 
            duration: 1.2, 
            ease: "easeOut",
            delay: particle.delay
          }}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${explosionColor}, ${explosionColor}88)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${particle.size * 2}px ${explosionColor}`
          }}
        />
      ))}
      
      {/* Main character explosion */}
      <motion.div
        initial={{ scale: 1, rotate: 0 }}
        animate={{ 
          scale: isCorrect ? [1, 3, 0] : [1, 2.5, 0], 
          opacity: [1, 0.8, 0],
          rotate: isCorrect ? [0, 180, 360] : [0, -90, -180]
        }}
        transition={{ duration: 0.8 }}
        style={{
          color: explosionColor,
          fontFamily: "'Courier New', monospace",
          fontWeight: 'bold',
          fontSize: isCorrect && combo > 10 ? '20px' : '16px',
          textShadow: `0 0 15px ${explosionColor}`,
          position: 'absolute',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {char}
      </motion.div>

      {/* Enhanced error indicator */}
      {!isCorrect && (
        <motion.div
          initial={{ scale: 0, y: 0, rotate: -90 }}
          animate={{ 
            scale: [1, 1.5, 1.2],
            y: [-20, -30, -25],
            rotate: [0, 10, -10, 0],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 1,
            opacity: { delay: 0.5, duration: 0.5 }
          }}
          style={{
            position: 'absolute',
            top: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ff1744',
            fontSize: '20px',
            fontWeight: 'bold',
            textShadow: '0 0 15px #ff1744'
          }}
        >
          ✗
        </motion.div>
      )}

      {/* Combo celebration ring */}
      {isCorrect && combo > 5 && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 2, 3],
            opacity: [1, 0.6, 0]
          }}
          transition={{ duration: 1.5 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60px',
            height: '60px',
            border: `3px solid ${explosionColor}`,
            borderRadius: '50%',
            boxShadow: `0 0 20px ${explosionColor}`
          }}
        />
      )}
    </motion.div>
  );
};

// Enhanced progress bar with wave effects
export const JuicyProgressBar = ({ progress, color = '#00ff00', combo = 1 }) => {
  const getProgressColor = (combo) => {
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 10) return '#4ecdc4';
    if (combo >= 5) return '#45b7d1';
    return color;
  };

  const progressColor = getProgressColor(combo);
  const glowIntensity = Math.min(1 + (combo / 20), 2);

  return (
    <Box 
      position="relative" 
      bg="#000" 
      border="2px solid #333" 
      h="12px" 
      borderRadius="6px" 
      overflow="hidden"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ 
          width: `${progress}%`,
          boxShadow: [
            `0 0 10px ${progressColor}`,
            `0 0 ${20 * glowIntensity}px ${progressColor}`,
            `0 0 10px ${progressColor}`
          ]
        }}
        transition={{ 
          width: { duration: 0.5, ease: "easeOut" },
          boxShadow: { duration: 1, repeat: Infinity }
        }}
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${progressColor}, ${progressColor}cc, ${progressColor})`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Wave shine effect */}
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
            background: `linear-gradient(90deg, 
              transparent, 
              rgba(255,255,255,0.4), 
              rgba(255,255,255,0.6), 
              rgba(255,255,255,0.4), 
              transparent)`,
            width: '150px',
            transform: 'skewX(-20deg)'
          }}
        />
        
        {/* Pulse overlay */}
        <motion.div
          animate={{
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(180deg, rgba(255,255,255,0.2), transparent, rgba(255,255,255,0.1))`
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
      // Multiple confetti bursts
      const burst1 = () => confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ff00', '#ffff00', '#ff6b6b', '#4ecdc4', '#ffd93d']
      });
      
      const burst2 = () => confetti({
        particleCount: 50,
        spread: 120,
        origin: { y: 0.7, x: 0.3 },
        colors: ['#ff6b6b', '#ffd93d', '#6bcf7f']
      });
      
      const burst3 = () => confetti({
        particleCount: 50,
        spread: 120,
        origin: { y: 0.7, x: 0.7 },
        colors: ['#4ecdc4', '#45b7d1', '#00ff00']
      });

      burst1();
      setTimeout(burst2, 200);
      setTimeout(burst3, 400);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ 
        scale: [0, 1.2, 1], 
        opacity: 1,
        rotate: [0, 360, 0]
      }}
      exit={{ scale: 0, opacity: 0, rotate: 180 }}
      transition={{ 
        duration: 1.2, 
        ease: "backOut",
        rotate: { duration: 1.5 }
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        textAlign: 'center',
        background: 'linear-gradient(45deg, #000, #111, #000)',
        border: '4px solid #00ff00',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 0 60px #00ff00, inset 0 0 30px rgba(0, 255, 0, 0.1)'
      }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          textShadow: [
            '0 0 20px #00ff00',
            '0 0 40px #00ff00, 0 0 20px #ffff00',
            '0 0 20px #00ff00'
          ]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2 
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity
          }}
        >
          <Text fontSize="4xl" color="#00ff00" fontWeight="bold" mb={4}>
            🎉 LEVEL UP! 🎉
          </Text>
        </motion.div>
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            textShadow: [
              '0 0 15px #ffff00',
              '0 0 30px #ffff00, 0 0 15px #ffd93d',
              '0 0 15px #ffff00'
            ]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity
          }}
        >
          <Text fontSize="8xl" color="#ffff00" fontWeight="bold" textShadow="0 0 25px #ffff00">
            {newLevel}
          </Text>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Text fontSize="xl" color="#ffd93d" mt={4} fontWeight="bold">
            🚀 INCREDIBLE PROGRESS! 🚀
          </Text>
          <Text fontSize="md" color="#4ecdc4" mt={2}>
            Keep typing to unlock more rewards!
          </Text>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced combo multiplier display
export const ComboMultiplier = ({ multiplier, isActive }) => {
  if (!isActive || multiplier <= 1) return null;

  const getComboStyle = (multiplier) => {
    if (multiplier >= 50) return { 
      bg: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)', 
      color: '#fff',
      glow: '#ff6b6b'
    };
    if (multiplier >= 30) return { 
      bg: 'linear-gradient(45deg, #ffd93d, #ffed4e)', 
      color: '#000',
      glow: '#ffd93d'
    };
    if (multiplier >= 20) return { 
      bg: 'linear-gradient(45deg, #6bcf7f, #7dd87f)', 
      color: '#000',
      glow: '#6bcf7f'
    };
    if (multiplier >= 10) return { 
      bg: 'linear-gradient(45deg, #4ecdc4, #5ed9d1)', 
      color: '#000',
      glow: '#4ecdc4'
    };
    return { 
      bg: 'linear-gradient(45deg, #45b7d1, #5bc3d7)', 
      color: '#fff',
      glow: '#45b7d1'
    };
  };

  const style = getComboStyle(multiplier);

  return (
    <motion.div
      initial={{ scale: 0, y: 20, rotate: -45 }}
      animate={{ 
        scale: [1, 1.2, 1], 
        y: 0,
        rotate: [0, 5, -5, 0],
        boxShadow: [
          `0 0 25px ${style.glow}`,
          `0 0 50px ${style.glow}`,
          `0 0 25px ${style.glow}`
        ]
      }}
      transition={{ 
        scale: { repeat: Infinity, duration: 0.8 },
        rotate: { repeat: Infinity, duration: 1.5 },
        boxShadow: { repeat: Infinity, duration: 1.2 }
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
        fontSize: '20px',
        textAlign: 'center',
        minWidth: '80px',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        border: `4px solid ${style.glow}`,
        transform: 'perspective(100px) rotateX(10deg)'
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 15, -15, 0]
        }}
        transition={{
          duration: 1,
          repeat: Infinity
        }}
      >
        <div>x{multiplier}</div>
        <div style={{ fontSize: '10px', marginTop: '4px' }}>COMBO</div>
      </motion.div>
      
      {/* Orbiting particles */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, delay: i * 0.3 },
            scale: { duration: 1, repeat: Infinity, delay: i * 0.2 }
          }}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: style.glow,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transformOrigin: `${30 + i * 10}px 0px`,
            boxShadow: `0 0 10px ${style.glow}`
          }}
        />
      ))}
    </motion.div>
  );
};