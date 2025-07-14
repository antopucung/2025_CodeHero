import React from 'react';
import { motion } from 'framer-motion';
import { Text as ChakraText } from '@chakra-ui/react';

// Streak multiplier visual effect
export const StreakMultiplierEffect = ({ streak, multiplier, isActive }) => {
  if (!isActive || streak < 15) return null; // Higher threshold to reduce clutter

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
      initial={{ scale: 0, y: -20 }}
      animate={{ 
        scale: [1, 1.05, 1],
        y: 0,
        textShadow: [
          `0 0 10px ${color}`,
          `0 0 15px ${color}`,
          `0 0 10px ${color}`
        ]
      }}
      exit={{ scale: 0, y: -20 }}
      transition={{ 
        scale: { repeat: Infinity, duration: 2 },
        textShadow: { repeat: Infinity, duration: 2.5 }
      }}
      style={{
        position: 'fixed',
        top: '80px',
        right: '10px',
        zIndex: 1100,
        color: color,
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '12px',
        textAlign: 'center',
        pointerEvents: 'none',
        opacity: 0.9,
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '4px 8px',
        borderRadius: '4px',
        border: `1px solid ${color}`,
        maxWidth: '120px'
      }}
    >
      🔥 {streak}
    </motion.div>
  );
};

// Combo multiplier visual effect
export const ComboMultiplier = ({ multiplier, isActive, anticipationLevel = 1, typingSpeed = 'lame' }) => {
  if (!isActive || multiplier <= 2) return null; // Higher threshold

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
      initial={{ scale: 0, y: -20 }}
      animate={{ 
        scale: [1, 1.05, 1],
        y: 0,
        textShadow: [
          `0 0 10px ${color}`,
          `0 0 15px ${color}`,
          `0 0 10px ${color}`
        ]
      }}
      exit={{ scale: 0, y: -20 }}
      transition={{ 
        scale: { repeat: Infinity, duration: 2 },
        textShadow: { repeat: Infinity, duration: 2.5 }
      }}
      style={{
        position: 'fixed',
        top: '80px',
        left: '10px',
        zIndex: 1100,
        color: color,
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '12px',
        textAlign: 'center',
        pointerEvents: 'none',
        opacity: 0.9,
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '4px 8px',
        borderRadius: '4px',
        border: `1px solid ${color}`,
        maxWidth: '100px'
      }}
    >
      x{multiplier}
    </motion.div>
  );
};

// Level up transformation sequence
export const LevelUpTransformation = ({ newLevel, onComplete }) => {
  const [phase, setPhase] = React.useState('buildup');

  React.useEffect(() => {
    const autoComplete = setTimeout(() => {
      onComplete && onComplete();
    }, 2000);
    
    const timer1 = setTimeout(() => setPhase('celebration'), 400);
    const timer2 = setTimeout(() => setPhase('complete'), 1800);
    
    return () => {
      clearTimeout(autoComplete);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  React.useEffect(() => {
    if (phase === 'celebration' && newLevel % 5 === 0) {
      const colors = ['#ff6b6b', '#ffd93d', '#4ecdc4', '#9c27b0', '#00e5ff'];
      
      window.confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.5 },
        colors
      });
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
        top: '120px',
        right: '10px',
        zIndex: 150,
        maxWidth: '150px',
        background: 'linear-gradient(135deg, #000, #111)',
        border: '1px solid #ffd93d',
        borderRadius: '4px',
        padding: '6px 8px',
        cursor: 'pointer'
      }}
      onClick={() => onComplete && onComplete()} // Click to dismiss
    >
      {phase === 'buildup' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1,
            opacity: 1
          }}
          transition={{ duration: 0.3 }}
          style={{
            textAlign: 'center',
            color: '#ffd93d'
          }}
        >
          <div style={{
            fontSize: '10px',
            fontWeight: 'bold',
            marginBottom: '4px'
          }}>
            LEVEL UP!
          </div>
          
          <div style={{
            fontSize: '12px',
            color: '#4ecdc4'
          }}>
            ⚡
          </div>
        </motion.div>
      )}
      
      {phase === 'celebration' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1
          }}
          transition={{ duration: 0.3 }}
          style={{
            textAlign: 'center'
          }}
        >
          <div style={{
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#ff6b6b',
            marginBottom: '4px'
          }}>
            LEVEL UP!
          </div>
          
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#ffd93d'
          }}>
            {newLevel}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};