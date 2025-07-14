// Reward System - Manages all juicy effects and addictive feedback
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Enhanced floating score with maximum juice
export const JuicyFloatingScore = ({ score, x, y, color = '#00ff00', combo = 1, speed = 'lame', patterns = 0, onComplete }) => {
  const getScoreSize = (combo, patterns) => {
    const baseSize = 18;
    const comboBonus = Math.min(combo / 8, 12);
    const patternBonus = patterns * 3;
    return `${baseSize + comboBonus + patternBonus}px`;
  };

  const getJuicyEffect = (combo, speed, patterns) => {
    const speedMultiplier = { perfect: 2.5, best: 2, good: 1.5, lame: 1 }[speed];
    const patternMultiplier = 1 + (patterns * 0.5);
    
    if (combo >= 50) return {
      scale: [0.3, 3.5 * speedMultiplier * patternMultiplier, 2.2],
      rotate: [0, 720 + (patterns * 180), 360],
      textShadow: [
        `0 0 15px ${color}`,
        `0 0 60px ${color}, 0 0 30px #ffff00`,
        `0 0 40px ${color}`
      ],
      filter: [
        'brightness(1)',
        'brightness(2) saturate(2)',
        'brightness(1.5)'
      ]
    };
    if (combo >= 30) return {
      scale: [0.3, 2.8 * speedMultiplier * patternMultiplier, 1.8],
      rotate: [0, 540 + (patterns * 120), 270],
      textShadow: [
        `0 0 12px ${color}`,
        `0 0 50px ${color}, 0 0 25px #ffd93d`,
        `0 0 30px ${color}`
      ],
      filter: [
        'brightness(1)',
        'brightness(1.8) saturate(1.8)',
        'brightness(1.3)'
      ]
    };
    if (combo >= 10) return {
      scale: [0.3, 2.2 * speedMultiplier * patternMultiplier, 1.5],
      rotate: [0, 360 + (patterns * 90), 180],
      textShadow: [
        `0 0 10px ${color}`,
        `0 0 40px ${color}, 0 0 20px #4ecdc4`,
        `0 0 25px ${color}`
      ],
      filter: [
        'brightness(1)',
        'brightness(1.6) saturate(1.6)',
        'brightness(1.2)'
      ]
    };
    return {
      scale: [0.3, 1.8 * speedMultiplier * patternMultiplier, 1.2],
      rotate: [0, 180 + (patterns * 60), 90],
      textShadow: [
        `0 0 8px ${color}`,
        `0 0 30px ${color}`,
        `0 0 15px ${color}`
      ],
      filter: [
        'brightness(1)',
        'brightness(1.4) saturate(1.4)',
        'brightness(1.1)'
      ]
    };
  };

  const effects = getJuicyEffect(combo, speed, patterns);

  return (
    <motion.div
      initial={{ 
        opacity: 1, 
        scale: 0.3, 
        x: x, 
        y: y,
        rotate: 0,
        filter: 'brightness(1)'
      }}
      animate={{ 
        opacity: [1, 1, 1, 0], 
        scale: effects.scale,
        rotate: effects.rotate,
        textShadow: effects.textShadow,
        filter: effects.filter,
        y: y - 150 - (patterns * 30),
        x: x + (-30 + Math.random() * 60)
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 3 + (patterns * 0.8), 
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
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          textShadow: [
            `0 0 10px ${color}`,
            `0 0 25px ${color}`,
            `0 0 10px ${color}`
          ]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity
        }}
      >
        +{score}
      </motion.div>
      
      {combo > 5 && (
        <motion.span
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.5, 1.2, 0]
          }}
          transition={{ duration: 2, delay: 0.3 }}
          style={{
            display: 'block',
            fontSize: '12px',
            marginTop: '4px',
            color: '#ffff00',
            textShadow: '0 0 15px #ffff00'
          }}
        >
          x{combo} COMBO!
        </motion.span>
      )}
      
      {speed !== 'lame' && (
        <motion.span
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.3, 1.4, 1.1, 0],
            rotate: [0, 360, 180, 0]
          }}
          transition={{ duration: 1.8, delay: 0.5 }}
          style={{
            display: 'block',
            fontSize: '10px',
            marginTop: '2px',
            color: speed === 'perfect' ? '#ff6b6b' : speed === 'best' ? '#ffd93d' : '#4ecdc4',
            textShadow: `0 0 12px ${speed === 'perfect' ? '#ff6b6b' : speed === 'best' ? '#ffd93d' : '#4ecdc4'}`
          }}
        >
          {speed.toUpperCase()}!
        </motion.span>
      )}
      
      {patterns > 0 && (
        <motion.span
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.2, 1.6, 1.3, 0],
            rotate: [0, 720, 360, 0]
          }}
          transition={{ duration: 2.5, delay: 0.2 }}
          style={{
            display: 'block',
            fontSize: '14px',
            marginTop: '3px',
            color: '#ff6b6b',
            textShadow: '0 0 20px #ff6b6b'
          }}
        >
          ⭐ PATTERN BONUS! ⭐
        </motion.span>
      )}
    </motion.div>
  );
};

// Enhanced character explosion with maximum satisfaction
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
  const particleCount = isCorrect ? Math.min(6 + combo / 4, 12) : 8; // Much fewer particles
  const explosionSize = isCorrect ? Math.min(30 + combo * 1, 60) : 25; // Smaller explosions
  const speedMultiplier = { perfect: 2, best: 1.7, good: 1.4, lame: 1 }[speed] || 1;
  
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (i * (360 / particleCount)) * (Math.PI / 180),
    velocity: (25 + Math.random() * explosionSize) * speedMultiplier,
    size: isCorrect ? 2 + Math.random() * 3 : 2 + Math.random() * 2, // Smaller particles
    delay: Math.random() * 0.4
  }));

  // MUCH more selective confetti - only for exceptional performance
  React.useEffect(() => {
    if (isCorrect && (combo >= 30 || (speed === 'perfect' && combo >= 10) || patterns > 1)) {
      const colors = [explosionColor, '#ffff00', '#ff6b6b', '#4ecdc4'];
      
      if (combo >= 50 || patterns > 2) {
        // Only major celebrations for very high performance
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { x: x / window.innerWidth, y: y / window.innerHeight },
          colors
        });
      } else if (combo >= 30 || (speed === 'perfect' && combo >= 15)) {
        // Medium celebration for good performance
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { x: x / window.innerWidth, y: y / window.innerHeight },
          colors
        });
      }
    }
  }, [isCorrect, combo, speed, patterns, explosionColor, x, y]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 2.5 + (patterns * 0.5) }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 999
      }}
    >
      {/* Simpler particle explosion */}
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
            scale: [1, 1.8, 0], // Simpler scaling
            opacity: [1, 0.9, 0]
          }}
          transition={{ 
            duration: 1.2, // Faster
            ease: "easeOut",
            delay: particle.delay
          }}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${explosionColor}, ${explosionColor}88)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${particle.size * 2}px ${explosionColor}44`
          }}
        />
      ))}
      
      {/* Simpler main character explosion - NO ROTATION */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ 
          scale: isCorrect ? [1, 2.2, 0] : [1, 2, 0], // Much simpler scaling
          opacity: [1, 0.9, 0],
          // NO ROTATION - just simple scale and fade
        }}
        transition={{ duration: 1 }}
        style={{
          color: explosionColor,
          fontFamily: "'Courier New', monospace",
          fontWeight: 'bold',
          fontSize: isCorrect && combo > 20 ? '20px' : '16px',
          textShadow: `0 0 15px ${explosionColor}`,
          position: 'absolute',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {char}
      </motion.div>

      {/* Only show speed indicator for perfect speed */}
      {isCorrect && speed === 'perfect' && (
        <motion.div
          initial={{ scale: 0.8, y: -10, opacity: 0 }}
          animate={{ 
            scale: 1,
            y: -25,
            opacity: [1, 1, 0],
            rotate: [0, 360, 180]
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
            color: explosionColor,
            fontSize: '10px',
            fontWeight: 'bold',
            textShadow: `0 0 8px ${explosionColor}`
          }}
        >
          PERFECT!
        </motion.div>
      )}

      {/* Only show pattern bonus for multiple patterns */}
      {patterns > 1 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1,
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 1,
            opacity: { delay: 0.5, duration: 0.5 }
          }}
          style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ff6b6b',
            fontSize: '10px',
            fontWeight: 'bold',
            textShadow: '0 0 8px #ff6b6b'
          }}
        >
          BONUS!
        </motion.div>
      )}

      {/* Only show celebration rings for high combos */}
      {isCorrect && combo > 15 && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 2.5, 3.5],
              opacity: [1, 0.8, 0]
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
              boxShadow: `0 0 20px ${explosionColor}44`
            }}
          />
        </>
      )}
    </motion.div>
  );
};

// Enhanced combo burst effect
export const JuicyComboBurst = ({ isActive, combo, x, y, patterns = [] }) => {
  if (!isActive || combo <= 15) return null; // Higher threshold

  const getComboColor = (combo) => {
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 15) return '#4ecdc4';
    return '#45b7d1';
  };

  const burstColor = getComboColor(combo);
  const particleCount = Math.min(Math.floor(combo / 4), 8); // Much fewer particles
  const burstSize = Math.min(combo * 1.5, 40); // Smaller burst

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
            scale: [0, 1.8, 0], // Simpler scaling
            x: Math.cos((i * (360 / particleCount)) * Math.PI / 180) * burstSize,
            y: Math.sin((i * (360 / particleCount)) * Math.PI / 180) * burstSize,
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: 1.5, // Faster
            delay: i * 0.05,
            // No repeat to reduce clutter
          }}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: `radial-gradient(circle, ${burstColor}, ${burstColor}88)`,
            borderRadius: '50%',
            boxShadow: `0 0 10px ${burstColor}44`
          }}
        />
      ))}
      
      {/* Simpler central burst - NO ROTATION */}
      <motion.div
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.8, 0.4, 0.8],
          // NO ROTATION
        }}
        transition={{
          duration: 1.5,
          // No repeat
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          width: '15px',
          height: '15px',
          background: `radial-gradient(circle, ${burstColor}, transparent)`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 20px ${burstColor}44`
        }}
      />
    </motion.div>
  );
};

// Screen shake effect for major achievements
export const ScreenShakeEffect = ({ isActive, intensity = 1 }) => {
  if (!isActive) return null;

  return (
    <motion.div
      animate={{
        x: [0, -2 * intensity, 2 * intensity, -1 * intensity, 1 * intensity, 0],
        y: [0, 1 * intensity, -1 * intensity, 2 * intensity, -2 * intensity, 0]
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut"
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9998
      }}
    />
  );
};