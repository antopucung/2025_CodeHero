import React, { useEffect, useRef, useState } from 'react';
import { Box, Text as ChakraText } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Enhanced floating score with speed and pattern indicators
export const FloatingScore = ({ score, x, y, color = '#00ff00', combo = 1, speed = 'lame', patterns = 0, onComplete, reduced = false }) => {
  const getScoreSize = (combo, patterns) => {
    const baseSize = 16;
    const comboBonus = Math.min(combo / 10, 8);
    const patternBonus = patterns * 2;
    return `${baseSize + comboBonus + patternBonus}px`;
  };

  const getScoreEffect = (combo, speed, patterns) => {
    const speedMultiplier = { perfect: 2, best: 1.5, good: 1.2, lame: 1 }[speed];
    const patternMultiplier = 1 + (patterns * 0.3);
    
    // Reduce effects for performance
    if (reduced) {
      return { scale: [0.5, 1.2, 1], rotate: [0, 45, 0], textShadow: [`0 0 5px ${color}`, `0 0 15px ${color}`, `0 0 5px ${color}`] };
    }
    
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
        duration: reduced ? 1.5 : 2.5 + (patterns * 0.5), 
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
      {combo > 10 && !reduced && (
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
      {speed !== 'lame' && !reduced && (
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
      {patterns > 0 && !reduced && (
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
export const CharacterExplosion = ({ char, x, y, isCorrect, combo = 1, speed = 'lame', patterns = 0, onComplete, reduced = false }) => {
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
  const particleCount = reduced ? 
    (isCorrect ? Math.min(4 + combo / 4, 8) : 4) :
    (isCorrect ? Math.min(8 + combo / 2 + patterns * 3, 20) : 10);
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
            duration: reduced ? 1 : 1.5 + (patterns * 0.2), 
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
      {isCorrect && speed !== 'lame' && !reduced && (
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
      {patterns > 0 && !reduced && (
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
      {!isCorrect && !reduced && (
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
      {isCorrect && (combo > 5 || patterns > 0) && !reduced && (
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
export const ComboBurstEffect = ({ isActive, combo, x, y, patterns = [], reduced = false }) => {
  if (!isActive || combo <= 5) return null;

  const getComboColor = (combo) => {
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 10) return '#4ecdc4';
    return '#45b7d1';
  };

  const burstColor = getComboColor(combo);
  const particleCount = reduced ? 
    Math.min(Math.floor(combo / 6) + patterns.length, 6) :
    Math.min(Math.floor(combo / 3) + patterns.length * 2, 16);
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
            duration: reduced ? 0.8 : 1.2 + (patterns.length * 0.2),
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
      {!reduced && <motion.div
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
      />}
    </motion.div>
  );
};

// Dynamic anticipation cursor
export const AnticipationCursor = ({ isVisible, position, typingSpeed = 'lame', anticipationLevel = 1, combo = 1, reduced = false }) => {
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
  const intensity = reduced ? 1 : Math.min(1 + (combo / 15) + anticipationLevel, 3);

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
      {typingSpeed !== 'lame' && !reduced && (
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
    
    // Reduce animation frequency for performance
    const updateInterval = intensity < 0.5 ? 100 : 50;
    
    const interval = setInterval(() => {
      setTime(prev => prev + (0.08 * anticipationLevel));
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [isActive, anticipationLevel, intensity]);

  if (!isActive) return null;

  const getGradient = (combo, time, anticipationLevel, typingSpeed) => {
    const baseOpacity = Math.min(0.15 * intensity * anticipationLevel, 0.3);
    const pulseOpacity = baseOpacity + Math.sin(time * 3) * 0.05;
    
    // Anticipation-based background colors
    const anticipationColors = {
      perfect: ['255, 107, 107', '255, 20, 147'],
      best: ['255, 217, 61', '255, 193, 7'],
      good: ['78, 205, 196', '0, 188, 212'],
      lame: ['0, 255, 0', '0, 255, 255']
    };
    
    const [color1, color2] = anticipationColors[typingSpeed] || anticipationColors.lame;
    
    // Simplified gradients for better performance
    if (combo >= 50) {
      return `
        radial-gradient(circle at ${50 + Math.sin(time) * 10}% ${50 + Math.cos(time) * 10}%, 
          rgba(${color1}, ${pulseOpacity * 1.5}) 0%, 
          transparent 70%)
      `;
    } else if (combo >= 30) {
      return `
        radial-gradient(circle at ${50 + Math.sin(time) * 8}% ${50 + Math.cos(time) * 8}%, 
          rgba(${color1}, ${pulseOpacity * 1.2}) 0%, 
          transparent 80%),
      `;
    }
    
    return `
      radial-gradient(circle at ${50 + Math.sin(time * 0.5) * 5}% ${50 + Math.cos(time * 0.5) * 5}%, 
        rgba(${color1}, ${pulseOpacity}) 0%, 
        transparent 90%)
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

// Enhanced character upgrade system with visual evolution
export const CharacterUpgradeEffect = ({ char, index, upgrade, onComplete }) => {
  const getUpgradeStyle = (level) => {
    const styles = {
      1: { color: '#4ecdc4', glow: '#4ecdc4', name: 'BRONZE' },
      2: { color: '#ffd93d', glow: '#ffd93d', name: 'SILVER' },
      3: { color: '#ff6b6b', glow: '#ff6b6b', name: 'GOLD' },
      4: { color: '#9c27b0', glow: '#9c27b0', name: 'PLATINUM' },
      5: { color: '#00e5ff', glow: '#00e5ff', name: 'DIAMOND' }
    };
    return styles[level] || styles[1];
  };

  const style = getUpgradeStyle(upgrade.level);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 0 }}
      animate={{ 
        scale: [0, 2, 1.5, 0],
        opacity: [0, 1, 1, 0],
        y: [0, -60, -80, -120],
        rotate: [0, 180, 360, 540]
      }}
      transition={{ 
        duration: 2.5,
        times: [0, 0.3, 0.7, 1]
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        left: index * 17,
        top: -40,
        zIndex: 1002,
        pointerEvents: 'none'
      }}
    >
      {/* Upgrade burst effect */}
      <motion.div
        animate={{
          scale: [0, 3, 0],
          opacity: [1, 0.3, 0]
        }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'absolute',
          width: '60px',
          height: '60px',
          background: `radial-gradient(circle, ${style.glow}, transparent)`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Character with upgrade glow */}
      <motion.div
        animate={{
          textShadow: [
            `0 0 10px ${style.glow}`,
            `0 0 30px ${style.glow}`,
            `0 0 20px ${style.glow}`
          ]
        }}
        transition={{ duration: 1, repeat: 2 }}
        style={{
          color: style.color,
          fontSize: '24px',
          fontWeight: 'bold',
          fontFamily: "'Courier New', monospace",
          textAlign: 'center'
        }}
      >
        {char}
      </motion.div>
      
      {/* Upgrade level indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0, 1.5, 1.2],
          rotate: [0, 360, 180]
        }}
        transition={{ duration: 1.2, delay: 0.5 }}
        style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: `linear-gradient(45deg, ${style.color}, ${style.color}cc)`,
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '10px',
          fontWeight: 'bold',
          border: `2px solid ${style.glow}`,
          boxShadow: `0 0 15px ${style.glow}`
        }}
      >
        {style.name} LV.{upgrade.level}
      </motion.div>
      
      {/* Orbiting particles */}
      {Array.from({ length: upgrade.level + 2 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: [0, 360],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, delay: i * 0.2 },
            scale: { duration: 1, repeat: Infinity, delay: i * 0.1 }
          }}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: style.glow,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transformOrigin: `${20 + i * 8}px 0px`,
            boxShadow: `0 0 8px ${style.glow}`
          }}
        />
      ))}
    </motion.div>
  );
};

// Achievement unlock celebration
export const AchievementUnlock = ({ achievement, onComplete }) => {
  const getAchievementData = (type) => {
    const achievements = {
      speed_demon: { 
        icon: '⚡', 
        title: 'SPEED DEMON', 
        desc: 'Achieved 15+ perfect streak!',
        color: '#ff6b6b',
        rarity: 'LEGENDARY'
      },
      combo_master: { 
        icon: '🔥', 
        title: 'COMBO MASTER', 
        desc: 'Reached 50x combo multiplier!',
        color: '#ffd93d',
        rarity: 'EPIC'
      },
      perfectionist: { 
        icon: '💎', 
        title: 'PERFECTIONIST', 
        desc: 'Completed with 100% accuracy!',
        color: '#9c27b0',
        rarity: 'LEGENDARY'
      },
      code_wizard: { 
        icon: '🧙‍♂️', 
        title: 'CODE WIZARD', 
        desc: 'Mastered advanced syntax patterns!',
        color: '#00e5ff',
        rarity: 'MYTHIC'
      },
      syntax_master: { 
        icon: '🎯', 
        title: 'SYNTAX MASTER', 
        desc: 'Expert in coding constructs!',
        color: '#4ecdc4',
        rarity: 'RARE'
      }
    };
    return achievements[type] || achievements.speed_demon;
  };

  const data = getAchievementData(achievement);

  useEffect(() => {
    // Trigger massive confetti celebration
    const celebrate = () => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: [data.color, '#ffd93d', '#ff6b6b', '#4ecdc4']
      });
      
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.8, x: 0.2 },
          colors: [data.color]
        });
      }, 300);
      
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.8, x: 0.8 },
          colors: [data.color]
        });
      }, 600);
    };
    
    celebrate();
  }, [data.color]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ 
        scale: [0, 1.3, 1],
        opacity: [0, 1, 1, 0],
        rotate: [0, 360, 0],
        y: [0, -20, 0, -100]
      }}
      transition={{ 
        duration: 4,
        times: [0, 0.3, 0.8, 1]
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        background: `linear-gradient(135deg, ${data.color}, ${data.color}cc, #000)`,
        border: `4px solid ${data.color}`,
        borderRadius: '20px',
        padding: '30px',
        textAlign: 'center',
        minWidth: '350px',
        boxShadow: `0 0 50px ${data.color}, inset 0 0 30px rgba(0,0,0,0.3)`
      }}
    >
      {/* Achievement burst background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle, ${data.color}33, transparent)`,
          borderRadius: '16px'
        }}
      />
      
      {/* Rarity indicator */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          textShadow: [
            `0 0 10px ${data.color}`,
            `0 0 25px ${data.color}`,
            `0 0 10px ${data.color}`
          ]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          color: data.color,
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '10px',
          letterSpacing: '2px'
        }}
      >
        {data.rarity} ACHIEVEMENT
      </motion.div>
      
      {/* Achievement icon */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 15, -15, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          fontSize: '60px',
          marginBottom: '15px'
        }}
      >
        {data.icon}
      </motion.div>
      
      {/* Achievement title */}
      <motion.div
        animate={{
          textShadow: [
            `0 0 15px ${data.color}`,
            `0 0 30px ${data.color}`,
            `0 0 15px ${data.color}`
          ]
        }}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{
          color: '#fff',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '10px',
          fontFamily: "'Courier New', monospace"
        }}
      >
        {data.title}
      </motion.div>
      
      {/* Achievement description */}
      <ChakraText
        color="#ccc"
        fontSize="14px"
        fontFamily="'Courier New', monospace"
      >
        {data.desc}
      </ChakraText>
      
      {/* Orbiting achievement particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.4, 0.8]
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, delay: i * 0.2 },
            scale: { duration: 1.5, repeat: Infinity, delay: i * 0.1 }
          }}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: data.color,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transformOrigin: `${60 + i * 10}px 0px`,
            boxShadow: `0 0 12px ${data.color}`
          }}
        />
      ))}
    </motion.div>
  );
};

// Streak multiplier visual effect
export const StreakMultiplierEffect = ({ streak, multiplier, isActive }) => {
  if (!isActive || streak < 10) return null;

  const getStreakColor = (streak) => {
    if (streak >= 50) return '#ff1744';
    if (streak >= 30) return '#ff6b6b';
    if (streak >= 20) return '#ffd93d';
    if (streak >= 15) return '#4ecdc4';
    return '#45b7d1';
  };

  const color = getStreakColor(streak);
  const intensity = Math.min(streak / 20, 3);

  return (
    <motion.div
      initial={{ scale: 0, x: 100 }}
      animate={{ 
        scale: [1, 1.2 + (intensity * 0.1), 1],
        x: 0,
        boxShadow: [
          `0 0 20px ${color}`,
          `0 0 ${40 * intensity}px ${color}`,
          `0 0 20px ${color}`
        ]
      }}
      exit={{ scale: 0, x: 100 }}
      transition={{ 
        scale: { repeat: Infinity, duration: 1.2 / intensity },
        boxShadow: { repeat: Infinity, duration: 1.5 / intensity }
      }}
      style={{
        position: 'fixed',
        top: '35%',
        right: '20px',
        zIndex: 1000,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        padding: '20px',
        borderRadius: '15px',
        color: streak >= 30 ? '#000' : '#fff',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '18px',
        textAlign: 'center',
        minWidth: '120px',
        border: `3px solid ${color}`,
        transform: 'perspective(100px) rotateY(-10deg)'
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 1 / intensity,
          repeat: Infinity
        }}
      >
        <div style={{ fontSize: '14px', opacity: 0.8 }}>STREAK</div>
        <div style={{ fontSize: '28px', margin: '5px 0' }}>{streak}</div>
        <div style={{ fontSize: '12px', opacity: 0.9 }}>x{multiplier} MULTIPLIER</div>
      </motion.div>
      
      {/* Streak fire particles */}
      {Array.from({ length: Math.min(streak / 5, 8) }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, -50],
            opacity: [1, 0.5, 0],
            scale: [0.5, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3
          }}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: `${20 + i * 15}%`,
            width: '4px',
            height: '8px',
            background: color,
            borderRadius: '50%',
            boxShadow: `0 0 8px ${color}`
          }}
        />
      ))}
    </motion.div>
  );
};

// Level up transformation sequence
export const LevelUpTransformation = ({ newLevel, onComplete }) => {
  const [phase, setPhase] = useState('buildup');

  useEffect(() => {
    // Phase progression
    const timer1 = setTimeout(() => setPhase('explosion'), 1000);
    const timer2 = setTimeout(() => setPhase('celebration'), 2500);
    const timer3 = setTimeout(() => setPhase('complete'), 5000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    if (phase === 'explosion') {
      // Massive confetti explosion
      const colors = ['#ff6b6b', '#ffd93d', '#4ecdc4', '#9c27b0', '#00e5ff'];
      
      // Central explosion
      confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.5 },
        colors
      });
      
      // Side explosions
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6, x: 0.1 },
          colors
        });
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6, x: 0.9 },
          colors
        });
      }, 200);
    }
  }, [phase]);

  if (phase === 'complete') {
    onComplete && onComplete();
    return null;
  }

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.9)'
      }}
    >
      {phase === 'buildup' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 0.5, 1.2, 1],
            opacity: [0, 0.5, 1, 1]
          }}
          transition={{ duration: 1 }}
          style={{
            textAlign: 'center',
            color: '#ffd93d'
          }}
        >
          <motion.div
            animate={{
              textShadow: [
                '0 0 20px #ffd93d',
                '0 0 40px #ffd93d',
                '0 0 20px #ffd93d'
              ]
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}
          >
            LEVEL UP INCOMING...
          </motion.div>
          
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              fontSize: '80px',
              color: '#4ecdc4'
            }}
          >
            ⚡
          </motion.div>
        </motion.div>
      )}
      
      {phase === 'explosion' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0, 2, 1.5],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 1.5 }}
          style={{
            textAlign: 'center'
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              textShadow: [
                '0 0 30px #ff6b6b',
                '0 0 60px #ff6b6b',
                '0 0 30px #ff6b6b'
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#ff6b6b',
              marginBottom: '20px'
            }}
          >
            💥 LEVEL UP! 💥
          </motion.div>
          
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              color: ['#ffd93d', '#ff6b6b', '#4ecdc4', '#ffd93d']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontSize: '120px',
              fontWeight: 'bold'
            }}
          >
            {newLevel}
          </motion.div>
        </motion.div>
      )}
      
      {phase === 'celebration' && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            textAlign: 'center',
            color: '#4ecdc4'
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              textShadow: [
                '0 0 25px #4ecdc4',
                '0 0 50px #4ecdc4',
                '0 0 25px #4ecdc4'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              marginBottom: '20px'
            }}
          >
            🚀 INCREDIBLE PROGRESS! 🚀
          </motion.div>
          
          <ChakraText fontSize="18px" color="#ffd93d">
            Your typing skills have evolved to Level {newLevel}!
          </ChakraText>
          
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{
              fontSize: '60px',
              marginTop: '20px'
            }}
          >
            🎉
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Pattern Match Celebration
export const PatternCelebration = ({ patterns, onComplete }) => {
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

// Screen flash effect for major achievements and errors
export const ScreenFlashEffect = ({ isActive, type = 'success', intensity = 1, onComplete }) => {
  if (!isActive) return null;

  const getFlashColor = (type) => {
    const colors = {
      success: 'rgba(0, 255, 0, 0.3)',
      achievement: 'rgba(255, 215, 0, 0.4)',
      combo: 'rgba(255, 107, 107, 0.3)',
      perfect: 'rgba(0, 255, 255, 0.3)',
      error: 'rgba(255, 0, 0, 0.4)'
    };
    return colors[type] || colors.success;
  };

  const flashColor = getFlashColor(type);
  const duration = type === 'error' ? 0.3 : 0.5;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, intensity, 0],
        scale: [1, 1.02, 1]
      }}
      transition={{ 
        duration: duration,
        ease: "easeInOut"
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: flashColor,
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};

// Enhanced combo multiplier with anticipation effects
export const ComboMultiplier = ({ multiplier, isActive, anticipationLevel = 1, typingSpeed = 'lame' }) => {
  if (!isActive || multiplier <= 1) return null;

  const getMultiplierColor = (multiplier, typingSpeed) => {
    const speedColors = {
      perfect: '#ff6b6b',
      best: '#ffd93d', 
      good: '#4ecdc4',
      lame: '#45b7d1'
    };
    
    if (multiplier >= 5) return '#ff1744';
    if (multiplier >= 4) return speedColors[typingSpeed] || speedColors.lame;
    if (multiplier >= 3) return '#ffd93d';
    if (multiplier >= 2) return '#4ecdc4';
    return speedColors[typingSpeed] || speedColors.lame;
  };

  const color = getMultiplierColor(multiplier, typingSpeed);
  const intensity = Math.min(multiplier / 2, 3) * anticipationLevel;

  return (
    <motion.div
      initial={{ scale: 0, x: -50 }}
      animate={{ 
        scale: [1, 1.1 + (intensity * 0.1), 1],
        x: 0,
        boxShadow: [
          `0 0 15px ${color}`,
          `0 0 ${25 * intensity}px ${color}`,
          `0 0 15px ${color}`
        ]
      }}
      exit={{ scale: 0, x: -50 }}
      transition={{ 
        scale: { repeat: Infinity, duration: 1 / intensity },
        boxShadow: { repeat: Infinity, duration: 1.2 / intensity }
      }}
      style={{
        position: 'fixed',
        top: '25%',
        left: '20px',
        zIndex: 1000,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        padding: '15px 20px',
        borderRadius: '12px',
        color: multiplier >= 4 ? '#000' : '#fff',
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '16px',
        textAlign: 'center',
        minWidth: '100px',
        border: `2px solid ${color}`,
        transform: 'perspective(100px) rotateY(10deg)'
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{
          duration: 0.8 / intensity,
          repeat: Infinity
        }}
      >
        <div style={{ fontSize: '12px', opacity: 0.8 }}>COMBO</div>
        <div style={{ fontSize: '24px', margin: '5px 0' }}>x{multiplier}</div>
        <div style={{ fontSize: '10px', opacity: 0.9 }}>MULTIPLIER</div>
      </motion.div>
      
      {/* Multiplier energy particles */}
      {Array.from({ length: Math.min(multiplier, 6) }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -25, -40],
            opacity: [1, 0.7, 0],
            scale: [0.3, 1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2
          }}
          style={{
            position: 'absolute',
            bottom: '100%',
            left: `${15 + i * 12}%`,
            width: '3px',
            height: '6px',
            background: color,
            borderRadius: '50%',
            boxShadow: `0 0 6px ${color}`
          }}
        />
      ))}
    </motion.div>
  );
};