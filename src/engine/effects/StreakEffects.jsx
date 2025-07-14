import React from 'react';
import { motion } from 'framer-motion';

// Enhanced streak counter with speed tracking
export const StreakMultiplierEffect = ({ streak, multiplier, isActive }) => {
  const [showStreak, setShowStreak] = React.useState(false);
  const [pulseIntensity, setPulseIntensity] = React.useState(1);

  React.useEffect(() => {
    if (streak > 5) {
      setShowStreak(true);
      setPulseIntensity(Math.min(1 + (streak / 15), 3));
      const timer = setTimeout(() => setShowStreak(false), 4000);
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
      {multiplier > 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            fontSize: '12px', 
            marginTop: '5px',
            textShadow: `0 0 10px ${streakColor}`
          }}
        >
          x{multiplier} COMBO ACTIVE
        </motion.div>
      )}
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

// Level up transformation sequence
export const LevelUpTransformation = ({ newLevel, onComplete }) => {
  const [phase, setPhase] = React.useState('buildup');

  React.useEffect(() => {
    const autoComplete = setTimeout(() => {
      onComplete && onComplete();
    }, 4000);
    
    const celebrate = () => {
      if (newLevel % 5 === 0) {
        const colors = ['#ff6b6b', '#ffd93d', '#4ecdc4', '#9c27b0', '#00e5ff'];
        
        window.confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors
        });
        
        setTimeout(() => {
          window.confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.8, x: 0.2 },
            colors
          });
        }, 300);
        
        setTimeout(() => {
          window.confetti({
            particleCount: 100,
            spread: 60,
            origin: { y: 0.8, x: 0.8 },
            colors
          });
        }, 600);
      }
    };
    
    celebrate();
    
    const timer1 = setTimeout(() => setPhase('celebration'), 800);
    const timer2 = setTimeout(() => setPhase('complete'), 3500);
    
    return () => {
      clearTimeout(autoComplete);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [newLevel, onComplete]);

  if (phase === 'complete') {
    onComplete && onComplete();
    return null;
  }

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        background: 'linear-gradient(135deg, #000, #111)',
        border: '4px solid #ffd93d',
        borderRadius: '20px',
        padding: '40px',
        textAlign: 'center',
        minWidth: '300px',
        boxShadow: '0 0 60px #ffd93d'
      }}
    >
      {phase === 'buildup' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 1],
            opacity: 1,
            rotate: [0, 360, 0]
          }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center',
            color: '#ffd93d'
          }}
        >
          <div style={{
            fontSize: '3xl',
            fontWeight: 'bold',
            marginBottom: '20px'
          }}>
            ⚡ POWER SURGE! ⚡
          </div>
          
          <div style={{
            fontSize: '2xl',
            color: '#4ecdc4'
          }}>
            Preparing Level {newLevel}...
          </div>
        </motion.div>
      )}
      
      {phase === 'celebration' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0, 1.3, 1],
            rotate: [0, 720, 0]
          }}
          transition={{ duration: 1 }}
          style={{
            textAlign: 'center'
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              textShadow: [
                '0 0 20px #ff6b6b',
                '0 0 40px #ff6b6b',
                '0 0 20px #ff6b6b'
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div style={{
              fontSize: '4xl',
              fontWeight: 'bold',
              color: '#ff6b6b',
              marginBottom: '20px'
            }}>
              🎉 LEVEL UP! 🎉
            </div>
          </motion.div>
          
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              textShadow: [
                '0 0 30px #ffd93d',
                '0 0 50px #ffd93d',
                '0 0 30px #ffd93d'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <div style={{
              fontSize: '6xl',
              fontWeight: 'bold',
              color: '#ffd93d'
            }}>
              {newLevel}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div style={{
              fontSize: 'xl',
              color: '#4ecdc4',
              marginTop: '20px'
            }}>
              🚀 SKILLS ENHANCED! 🚀
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
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