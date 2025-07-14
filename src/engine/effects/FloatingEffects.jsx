import React from 'react';
import { motion } from 'framer-motion';

// Enhanced floating score with speed and pattern indicators
export const FloatingScore = ({ score, x, y, color = '#00ff00', combo = 1, speed = 'lame', patterns = 0, onComplete, reduced = false }) => {
  const getScoreSize = (combo, patterns) => {
    const baseSize = 12; // Smaller base size
    const comboBonus = Math.min(combo / 15, 4); // Less size increase
    const patternBonus = patterns * 1; // Less pattern bonus
    return `${baseSize + comboBonus + patternBonus}px`;
  };

  // Simple clicker-game style floating - no rotation, just gentle float up
  const getScoreEffect = (combo, speed, patterns) => {
    return {
      scale: [0.8, 1.1, 1], // Gentle scale, no big pops
      textShadow: [`0 0 5px ${color}`, `0 0 10px ${color}`, `0 0 5px ${color}`] // Subtle glow
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
        textShadow: effects.textShadow,
        y: y - 60, // Gentle float up, like clicker games
        x: x + (-10 + Math.random() * 20) // Small horizontal drift
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 1.5, // Faster, consistent duration
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
      {/* Only show combo text for high combos to reduce clutter */}
      {combo > 20 && !reduced && (
        <motion.span
          style={{
            display: 'block',
            fontSize: '8px',
            marginTop: '2px'
          }}
        >
          x{combo} COMBO!
        </motion.span>
      )}
      {/* Only show speed for perfect speed to reduce clutter */}
      {speed === 'perfect' && !reduced && (
        <motion.span
          style={{
            display: 'block',
            fontSize: '7px',
            marginTop: '1px',
            color: '#ff6b6b'
          }}
        >
          PERFECT!
        </motion.span>
      )}
      {/* Only show pattern bonus for multiple patterns */}
      {patterns > 1 && !reduced && (
        <motion.span
          style={{
            display: 'block',
            fontSize: '7px',
            marginTop: '2px',
            color: '#ff6b6b'
          }}
        >
          BONUS!
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
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ 
            scale: 1,
            opacity: [1, 1, 0],
            y: [0, -40] // Gentle float up
          }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 1.5, // Faster
            delay: index * 0.2
          }}
          onAnimationComplete={() => index === patterns.length - 1 && onComplete && onComplete()}
          style={{
            position: 'fixed',
            top: '80px',
            right: '10px',
            zIndex: 120, // Lower z-index
            background: `linear-gradient(45deg, ${pattern.color}, ${pattern.color}cc)`,
            padding: '6px 10px', // Smaller padding
            borderRadius: '4px',
            color: '#fff',
            fontFamily: "'Courier New', monospace",
            fontWeight: 'bold',
            fontSize: '10px', // Smaller text
            textAlign: 'center',
            border: `1px solid ${pattern.color}`,
            boxShadow: `0 0 15px ${pattern.color}44`,
            cursor: 'pointer',
            pointerEvents: 'auto',
            maxWidth: '150px' // Smaller width
          }}
          onClick={() => onComplete && onComplete()} // Click to dismiss
        >
          <div>
            🎯 {pattern.type.replace('_', ' ').toUpperCase()}!
            <div style={{ fontSize: '8px', marginTop: '2px' }}>
              +{pattern.bonus} BONUS POINTS!
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};