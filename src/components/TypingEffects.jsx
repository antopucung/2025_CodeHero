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

// Enhanced streak counter with speed tracking
export const StreakCounter = ({ streak, combo, perfectStreak = 0 }) => {
  const [showStreak, setShowStreak] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState(1);

  useEffect(() => {
    if (streak > 5) {
      setShowStreak(true);
      setPulseIntensity(Math.min(1 + (streak / 15) + (perfectStreak / 10), 3));
      const timer = setTimeout(() => setShowStreak(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [streak, perfectStreak]);

  if (!showStreak) return null;

  const getStreakColor = (streak, perfectStreak) => {
    if (perfectStreak >= 10) return '#ff1744';
    if (streak >= 50) return '#ff6b6b';
    if (streak >= 30) return '#ffd93d';
    if (streak >= 20) return '#6bcf7f';
    if (streak >= 10) return '#4ecdc4';
    return '#45b7d1';
  };

  const streakColor = getStreakColor(streak, perfectStreak);

  return (
    <motion.div
      initial={{ scale: 0, y: 20, rotate: -10 }}
      animate={{ 
        scale: [1, 1.2 + (pulseIntensity * 0.1), 1], 
        y: 0,
        rotate: [0, 5, -5, 0],
        boxShadow: [
          `0 0 20px ${streakColor}`,
          `0 0 ${40 * pulseIntensity}px ${streakColor}`,
          `0 0 20px ${streakColor}`
        ]
      }}
      exit={{ scale: 0, y: 20 }}
      transition={{ 
        scale: { repeat: Infinity, duration: 1.2 / pulseIntensity },
        rotate: { repeat: Infinity, duration: 2 / pulseIntensity },
        boxShadow: { repeat: Infinity, duration: 1.5 / pulseIntensity }
      }}
      style={{
        position: 'fixed',
        top: '15%',
        right: '20px',
        zIndex: 1000,
        background: `linear-gradient(45deg, ${streakColor}, ${streakColor}cc)`,
        padding: '15px 25px',
        borderRadius: '25px',
        color: perfectStreak >= 10 || streak >= 30 ? '#000' : '#fff',
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
          scale: [1, 1.1 + (pulseIntensity * 0.05), 1],
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 0.8 / pulseIntensity,
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
      {perfectStreak > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: [1, 1.2, 1],
            textShadow: [
              `0 0 5px #ff1744`,
              `0 0 15px #ff1744`,
              `0 0 5px #ff1744`
            ]
          }}
          transition={{
            scale: { repeat: Infinity, duration: 0.6 },
            textShadow: { repeat: Infinity, duration: 0.8 }
          }}
          style={{ 
            fontSize: '10px', 
            marginTop: '3px',
            color: '#ff1744',
            fontWeight: 'bold'
          }}
        >
          ⚡ {perfectStreak} PERFECT!
        </motion.div>
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

// Enhanced progress bar with anticipation effects
export const JuicyProgressBar = ({ progress, color = '#00ff00', combo = 1, anticipationLevel = 1, typingSpeed = 'lame' }) => {
  const getProgressColor = (combo, typingSpeed) => {
    const speedColors = {
      perfect: '#ff6b6b',
      best: '#ffd93d',
      good: '#4ecdc4',
      lame: '#00ff00'
    };
    
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 10) return '#4ecdc4';
    if (combo >= 5) return '#45b7d1';
    return speedColors[typingSpeed] || color;
  };

  const progressColor = getProgressColor(combo, typingSpeed);
  const glowIntensity = Math.min(1 + (combo / 15) + anticipationLevel, 3);

  return (
    <Box 
      position="relative" 
      bg="#000" 
      border="2px solid #333" 
      h="14px" 
      borderRadius="7px" 
      overflow="hidden"
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ 
          width: `${progress}%`,
          boxShadow: [
            `0 0 10px ${progressColor}`,
            `0 0 ${25 * glowIntensity}px ${progressColor}`,
            `0 0 10px ${progressColor}`
          ]
        }}
        transition={{ 
          width: { duration: 0.5, ease: "easeOut" },
          boxShadow: { duration: 1 / anticipationLevel, repeat: Infinity }
        }}
        style={{
          height: '100%',
          background: `linear-gradient(90deg, ${progressColor}, ${progressColor}cc, ${progressColor})`,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Enhanced wave shine effect */}
        <motion.div
          animate={{ x: [-200, 400] }}
          transition={{ 
            repeat: Infinity, 
            duration: 3 / anticipationLevel, 
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
              rgba(255,255,255,${0.3 + anticipationLevel * 0.1}), 
              rgba(255,255,255,${0.5 + anticipationLevel * 0.2}), 
              rgba(255,255,255,${0.3 + anticipationLevel * 0.1}), 
              transparent)`,
            width: '200px',
            transform: 'skewX(-25deg)'
          }}
        />
        
        {/* Enhanced pulse overlay */}
        <motion.div
          animate={{
            opacity: [0.2, 0.6 + (anticipationLevel * 0.2), 0.2]
          }}
          transition={{
            duration: 1.8 / anticipationLevel,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(180deg, rgba(255,255,255,${0.3 + anticipationLevel * 0.1}), transparent, rgba(255,255,255,${0.2 + anticipationLevel * 0.05}))`
          }}
        />
      </motion.div>
    </Box>
  );
};

// Enhanced level up animation with achievements
export const LevelUpAnimation = ({ isVisible, newLevel, achievements = [], onComplete }) => {
  useEffect(() => {
    if (isVisible) {
      // Multiple enhanced confetti bursts
      const burst1 = () => confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00ff00', '#ffff00', '#ff6b6b', '#4ecdc4', '#ffd93d']
      });
      
      const burst2 = () => confetti({
        particleCount: 80,
        spread: 140,
        origin: { y: 0.7, x: 0.2 },
        colors: ['#ff6b6b', '#ffd93d', '#6bcf7f']
      });
      
      const burst3 = () => confetti({
        particleCount: 80,
        spread: 140,
        origin: { y: 0.7, x: 0.8 },
        colors: ['#4ecdc4', '#45b7d1', '#00ff00']
      });

      burst1();
      setTimeout(burst2, 300);
      setTimeout(burst3, 600);
      
      // Additional bursts for achievements
      achievements.forEach((_, index) => {
        setTimeout(() => {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.5, x: 0.5 },
            colors: ['#ff6b6b', '#ffd93d']
          });
        }, 1000 + (index * 200));
      });
    }
  }, [isVisible, achievements]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ 
        scale: [0, 1.3, 1], 
        opacity: 1,
        rotate: [0, 360, 0]
      }}
      exit={{ scale: 0, opacity: 0, rotate: 180 }}
      transition={{ 
        duration: 1.5, 
        ease: "backOut",
        rotate: { duration: 2 }
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
        padding: '50px',
        borderRadius: '25px',
        boxShadow: '0 0 80px #00ff00, inset 0 0 40px rgba(0, 255, 0, 0.1)'
      }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          textShadow: [
            '0 0 25px #00ff00',
            '0 0 50px #00ff00, 0 0 25px #ffff00',
            '0 0 25px #00ff00'
          ]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2.5 
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.08, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity
          }}
        >
          <Text fontSize="5xl" color="#00ff00" fontWeight="bold" mb={6}>
            🎉 LEVEL UP! 🎉
          </Text>
        </motion.div>
        
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            textShadow: [
              '0 0 20px #ffff00',
              '0 0 40px #ffff00, 0 0 20px #ffd93d',
              '0 0 20px #ffff00'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          <Text fontSize="9xl" color="#ffff00" fontWeight="bold" textShadow="0 0 35px #ffff00">
            {newLevel}
          </Text>
        </motion.div>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Text fontSize="2xl" color="#ffd93d" mt={6} fontWeight="bold">
            🚀 INCREDIBLE PROGRESS! 🚀
          </Text>
          <Text fontSize="lg" color="#4ecdc4" mt={3}>
            Your typing skills are evolving!
          </Text>
          
          {achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              style={{ marginTop: '20px' }}
            >
              <Text fontSize="lg" color="#ff6b6b" fontWeight="bold" mb={2}>
                🏆 NEW ACHIEVEMENTS! 🏆
              </Text>
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.5 + (index * 0.2) }}
                >
                  <Text fontSize="md" color="#ffaa00" mt={1}>
                    ⭐ {achievement.replace('_', ' ').toUpperCase()}
                  </Text>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Enhanced combo multiplier with anticipation effects
export const ComboMultiplier = ({ multiplier, isActive, anticipationLevel = 1, typingSpeed = 'lame' }) => {
  if (!isActive || multiplier <= 1) return null;

  const getComboStyle = (multiplier, typingSpeed) => {
    const speedColors = {
      perfect: { bg: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)', color: '#fff', glow: '#ff6b6b' },
      best: { bg: 'linear-gradient(45deg, #ffd93d, #ffed4e)', color: '#000', glow: '#ffd93d' },
      good: { bg: 'linear-gradient(45deg, #4ecdc4, #5ed9d1)', color: '#000', glow: '#4ecdc4' },
      lame: { bg: 'linear-gradient(45deg, #45b7d1, #5bc3d7)', color: '#fff', glow: '#45b7d1' }
    };
    
    if (multiplier >= 50) return { 
      bg: 'linear-gradient(45deg, #ff1744, #ff4569)', 
      color: '#fff',
      glow: '#ff1744'
    };
    if (multiplier >= 30) return speedColors.best;
    if (multiplier >= 20) return { 
      bg: 'linear-gradient(45deg, #6bcf7f, #7dd87f)', 
      color: '#000',
      glow: '#6bcf7f'
    };
    if (multiplier >= 10) return speedColors.good;
    return speedColors[typingSpeed] || speedColors.lame;
  };

  const style = getComboStyle(multiplier, typingSpeed);
  const pulseIntensity = Math.min(1 + (multiplier / 20) + anticipationLevel, 3);

  return (
    <motion.div
      initial={{ scale: 0, y: 20, rotate: -45 }}
      animate={{ 
        scale: [1, 1.2 + (anticipationLevel * 0.1), 1], 
        y: 0,
        rotate: [0, 8, -8, 0],
        boxShadow: [
          `0 0 30px ${style.glow}`,
          `0 0 ${60 * pulseIntensity}px ${style.glow}`,
          `0 0 30px ${style.glow}`
        ]
      }}
      transition={{ 
        scale: { repeat: Infinity, duration: 1 / anticipationLevel },
        rotate: { repeat: Infinity, duration: 1.8 / anticipationLevel },
        boxShadow: { repeat: Infinity, duration: 1.4 / anticipationLevel }
      }}
      style={{
        position: 'fixed',
        top: '25%',
        right: '20px',
        zIndex: 1000,
        background: style.bg,
        padding: '25px',
        borderRadius: '50%',
        color: style.color,
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '22px',
        textAlign: 'center',
        minWidth: '90px',
        minHeight: '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        border: `5px solid ${style.glow}`,
        transform: 'perspective(100px) rotateX(12deg)'
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 20, -20, 0]
        }}
        transition={{
          duration: 1.2 / anticipationLevel,
          repeat: Infinity
        }}
      >
        <div>x{multiplier}</div>
        <div style={{ fontSize: '12px', marginTop: '6px' }}>COMBO</div>
        {typingSpeed !== 'lame' && (
          <div style={{ fontSize: '8px', marginTop: '2px', opacity: 0.8 }}>
            {typingSpeed.toUpperCase()}
          </div>
        )}
      </motion.div>
      
      {/* Enhanced orbiting particles */}
      {Array.from({ length: 4 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: [0, 360],
            scale: [0.6, 1.4, 0.6]
          }}
          transition={{
            rotate: { duration: 2.5 / anticipationLevel, repeat: Infinity, delay: i * 0.2 },
            scale: { duration: 1.2 / anticipationLevel, repeat: Infinity, delay: i * 0.15 }
          }}
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            background: style.glow,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transformOrigin: `${35 + i * 8}px 0px`,
            boxShadow: `0 0 15px ${style.glow}`
          }}
        />
      ))}
    </motion.div>
  );
};

// New: Pattern Match Celebration
export const PatternMatchCelebration = ({ patterns, onComplete }) => {
  if (!patterns || patterns.length === 0) return null;

  return (
    <AnimatePresence>
      {patterns.map((pattern, index) => (
        <motion.div
          key={pattern.id}
          initial={{ scale: 0, opacity: 0, y: 50 }}
          animate={{ 
            scale: [1, 1.5, 1.2],
            opacity: [1, 1, 0],
            y: [0, -100, -150]
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 3,
            delay: index * 0.2
          }}
          onAnimationComplete={() => index === patterns.length - 1 && onComplete && onComplete()}
          style={{
            position: 'fixed',
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1001,
            background: `linear-gradient(45deg, ${pattern.color}, ${pattern.color}cc)`,
            padding: '20px 30px',
            borderRadius: '15px',
            color: '#fff',
            fontFamily: "'Courier New', monospace",
            fontWeight: 'bold',
            fontSize: '18px',
            textAlign: 'center',
            border: `3px solid ${pattern.color}`,
            boxShadow: `0 0 30px ${pattern.color}`
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity
            }}
          >
            🎯 {pattern.type.replace('_', ' ').toUpperCase()}!
            <div style={{ fontSize: '14px', marginTop: '5px' }}>
              +{pattern.bonus} BONUS POINTS!
            </div>
          </motion.div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

// New: Screen Flash Effect
export const ScreenFlashEffect = ({ isActive, intensity = 1, color = '#ffffff' }) => {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, 0.3 * intensity, 0]
      }}
      transition={{ 
        duration: 0.2,
        ease: "easeInOut"
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: color,
        zIndex: 999,
        pointerEvents: 'none'
      }}
    />
  );
};