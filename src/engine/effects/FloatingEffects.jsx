import React from 'react';
import { motion } from 'framer-motion';

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
    
    // Simplified effects for better performance
    if (combo >= 30) return {
      scale: [0.5, 1.8, 1.3],
      rotate: [0, 180, 90],
      textShadow: [`0 0 8px ${color}`, `0 0 25px ${color}`, `0 0 15px ${color}`]
    };
    if (combo >= 10) return {
      scale: [0.5, 1.5, 1.2],
      rotate: [0, 90, 45],
      textShadow: [`0 0 6px ${color}`, `0 0 20px ${color}`, `0 0 10px ${color}`]
    };
    return {
      scale: [0.5, 1.3, 1.1],
      rotate: [0, 45, 0],
      textShadow: [`0 0 5px ${color}`, `0 0 15px ${color}`, `0 0 8px ${color}`]
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

// Pattern Match Celebration
export const PatternCelebration = ({ patterns, onComplete }) => {
  if (!patterns || patterns.length === 0) return null;

  return (
    <>
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
            duration: 2, // Faster to avoid blocking
            delay: index * 0.2
          }}
          onAnimationComplete={() => index === patterns.length - 1 && onComplete && onComplete()}
          style={{
            position: 'fixed',
            top: '25%', // Higher position
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200, // Lower z-index
            background: `linear-gradient(45deg, ${pattern.color}, ${pattern.color}cc)`,
            padding: '15px 25px', // Smaller padding
            borderRadius: '15px',
            color: '#fff',
            fontFamily: "'Courier New', monospace",
            fontWeight: 'bold',
            fontSize: '16px', // Smaller font
            textAlign: 'center',
            border: `3px solid ${pattern.color}`,
            boxShadow: `0 0 30px ${pattern.color}`,
            cursor: 'pointer',
            pointerEvents: 'auto'
          }}
          onClick={() => onComplete && onComplete()} // Click to dismiss
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
    </>
  );
};