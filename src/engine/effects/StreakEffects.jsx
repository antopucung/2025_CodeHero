import React from 'react';
import { motion } from 'framer-motion';
import { Text as ChakraText } from '@chakra-ui/react';

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
    // Simplified streak display without background panel
    <motion.div
      initial={{ scale: 0, y: -20 }}
      animate={{ 
        scale: [1, 1.1, 1],
        y: 0,
        textShadow: [
          `0 0 10px ${color}`,
          `0 0 20px ${color}`,
          `0 0 10px ${color}`
        ]
      }}
      exit={{ scale: 0, y: -20 }}
      transition={{ 
        scale: { repeat: Infinity, duration: 1.5 },
        textShadow: { repeat: Infinity, duration: 2 }
      }}
      style={{
        position: 'fixed',
        top: '15%',
        right: '20px',
        zIndex: 1000,
        color: color,
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '24px',
        textAlign: 'center',
        pointerEvents: 'none'
      }}
    >
      🔥 {streak}
    </motion.div>
  );
};

// Combo multiplier visual effect
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
    // Simplified combo display without background panel
    <motion.div
      initial={{ scale: 0, y: -20 }}
      animate={{ 
        scale: [1, 1.15, 1],
        y: 0,
        textShadow: [
          `0 0 10px ${color}`,
          `0 0 20px ${color}`,
          `0 0 10px ${color}`
        ]
      }}
      exit={{ scale: 0, y: -20 }}
      transition={{ 
        scale: { repeat: Infinity, duration: 1.2 },
        textShadow: { repeat: Infinity, duration: 1.8 }
      }}
      style={{
        position: 'fixed',
        top: '25%',
        left: '20px',
        zIndex: 1000,
        color: color,
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: '20px',
        textAlign: 'center',
        pointerEvents: 'none'
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

  React.useEffect(() => {
    if (phase === 'explosion') {
      // Massive confetti explosion
      const colors = ['#ff6b6b', '#ffd93d', '#4ecdc4', '#9c27b0', '#00e5ff'];
      
      // Central explosion
      window.confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.5 },
        colors
      });
      
      // Side explosions
      setTimeout(() => {
        window.confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6, x: 0.1 },
          colors
        });
        window.confetti({
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