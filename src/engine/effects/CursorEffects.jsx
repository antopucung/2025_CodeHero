import React from 'react';
import { motion } from 'framer-motion';

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