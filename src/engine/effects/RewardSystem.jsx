// Reward System - Manages all juicy effects and addictive feedback
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Juicy floating score with proper performance
export const JuicyFloatingScore = ({ score, x, y, color = '#00ff00', combo = 1, speed = 'lame', patterns = 0, onComplete }) => {
  const getScoreSize = (combo, patterns) => {
    const baseSize = 14;
    const comboBonus = Math.min(combo / 10, 8);
    const patternBonus = patterns * 2;
    return `${baseSize + comboBonus + patternBonus}px`;
  };

  const getJuicyEffect = (combo, speed, patterns) => {
    const speedMultiplier = { perfect: 1.8, best: 1.5, good: 1.2, lame: 1 }[speed];
    const patternMultiplier = 1 + (patterns * 0.3);
    
    if (combo >= 30) return {
      scale: [0.5, 2.2 * speedMultiplier * patternMultiplier, 1.5],
      textShadow: [
        `0 0 15px ${color}`,
        `0 0 35px ${color}`,
        `0 0 20px ${color}`
      ]
    };
    if (combo >= 15) return {
      scale: [0.5, 1.8 * speedMultiplier * patternMultiplier, 1.3],
      textShadow: [
        `0 0 12px ${color}`,
        `0 0 25px ${color}`,
        `0 0 15px ${color}`
      ]
    };
    if (combo >= 5) return {
      scale: [0.5, 1.5 * speedMultiplier * patternMultiplier, 1.2],
      textShadow: [
        `0 0 10px ${color}`,
        `0 0 20px ${color}`,
        `0 0 12px ${color}`
      ]
    };
    return {
      scale: [0.5, 1.3 * speedMultiplier * patternMultiplier, 1.1],
      textShadow: [
        `0 0 8px ${color}`,
        `0 0 18px ${color}`,
        `0 0 10px ${color}`
      ]
    };
  };

  const effects = getJuicyEffect(combo, speed, patterns);

  return (
    <motion.div
      initial={{ 
        opacity: 1, 
        scale: 0.5, 
        x: x, 
        y: y,
      }}
      animate={{ 
        opacity: [1, 1, 0], 
        scale: effects.scale,
        textShadow: effects.textShadow,
        y: y - 80 - (patterns * 15),
        x: x + (-15 + Math.random() * 30)
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 2 + (patterns * 0.3), 
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
        fontSize: getScoreSize(combo, patterns),
        textAlign: 'center'
      }}
    >
      +{score}
      
      {combo > 10 && (
        <motion.span
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.2, 1, 0]
          }}
          transition={{ duration: 1.5, delay: 0.2 }}
          style={{
            display: 'block',
            fontSize: '10px',
            marginTop: '2px',
            color: '#ffd93d'
          }}
        >
          x{combo} COMBO!
        </motion.span>
      )}
      
      {speed === 'perfect' && (
        <motion.span
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.2, 1, 0]
          }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{
            display: 'block',
            fontSize: '8px',
            marginTop: '2px',
            color: '#ff6b6b'
          }}
        >
          PERFECT!
        </motion.span>
      )}
      
      {patterns > 1 && (
        <motion.span
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.3, 1, 0]
          }}
          transition={{ duration: 1.5, delay: 0.1 }}
          style={{
            display: 'block',
            fontSize: '8px',
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

// Character explosion with proper juice
export const JuicyCharacterExplosion = ({ char, x, y, isCorrect, combo = 1, speed = 'lame', patterns = 0, onComplete }) => {
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
  const particleCount = isCorrect ? Math.min(8 + combo / 3, 16) : 6;
  const explosionSize = isCorrect ? Math.min(35 + combo * 1.5, 80) : 30;
  const speedMultiplier = { perfect: 1.5, best: 1.3, good: 1.1, lame: 1 }[speed] || 1;
  
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (i * (360 / particleCount)) * (Math.PI / 180),
    velocity: (20 + Math.random() * explosionSize) * speedMultiplier,
    size: isCorrect ? 2 + Math.random() * (3 + patterns) : 2 + Math.random() * 2,
    delay: Math.random() * 0.4
  }));

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.5 + (patterns * 0.2) }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 999
      }}
    >
      {/* Particle explosion */}
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
            duration: 1.2 + (patterns * 0.1),
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
      
      {/* Main character explosion */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ 
          scale: isCorrect ? [1, 3 + (patterns * 0.3), 0] : [1, 2.5, 0],
          opacity: [1, 0.9, 0],
        }}
        transition={{ duration: 0.8 + (patterns * 0.1) }}
        style={{
          color: explosionColor,
          fontFamily: "'Courier New', monospace",
          fontWeight: 'bold',
          fontSize: isCorrect && (combo > 10 || patterns > 0) ? '20px' : '16px',
          textShadow: `0 0 ${15 + patterns * 3}px ${explosionColor}`,
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
            scale: [1, 1.3, 1.1],
            y: [-25, -35, -30],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 1.2,
            opacity: { delay: 0.8, duration: 0.4 }
          }}
          style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: explosionColor,
            fontSize: '11px',
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
            scale: [1, 1.5, 1.2],
            rotate: [0, 180, 90],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 1.3,
            opacity: { delay: 0.9, duration: 0.4 }
          }}
          style={{
            position: 'absolute',
            top: '-45px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ff6b6b',
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: '0 0 12px #ff6b6b'
          }}
        >
          ⭐ BONUS!
        </motion.div>
      )}

      {/* Celebration rings for high performance */}
      {isCorrect && (combo > 5 || patterns > 0) && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 2.5 + patterns, 4 + patterns],
              opacity: [1, 0.7, 0]
            }}
            transition={{ duration: 1.8 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '70px',
              height: '70px',
              border: `4px solid ${explosionColor}`,
              borderRadius: '50%',
              boxShadow: `0 0 25px ${explosionColor}`
            }}
          />
          
          {patterns > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{
                scale: [0, 3 + patterns, 5 + patterns],
                opacity: [0.8, 0.5, 0]
              }}
              transition={{ duration: 2.2, delay: 0.3 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90px',
                height: '90px',
                border: `5px solid ${explosionColor}`,
                borderRadius: '50%',
                boxShadow: `0 0 35px ${explosionColor}`
              }}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

// Combo burst effect
export const JuicyComboBurst = ({ isActive, combo, x, y, patterns = [] }) => {
  if (!isActive || combo <= 5) return null;

  const getComboColor = (combo) => {
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 10) return '#4ecdc4';
    return '#45b7d1';
  };

  const burstColor = getComboColor(combo);
  const particleCount = Math.min(Math.floor(combo / 3) + patterns.length * 2, 12);
  const burstSize = Math.min(combo * 2 + patterns.length * 8, 50);

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
            scale: [0, 1.5 + (patterns.length * 0.2), 0],
            x: Math.cos((i * (360 / particleCount)) * Math.PI / 180) * burstSize,
            y: Math.sin((i * (360 / particleCount)) * Math.PI / 180) * burstSize,
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: 1.2 + (patterns.length * 0.2),
            delay: i * 0.05,
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
      
      {/* Central burst */}
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