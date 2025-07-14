// Celebration System - Manages major achievements and milestones
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

// Level up celebration with maximum impact
export const MegaLevelUpCelebration = ({ newLevel, onComplete }) => {
  const [phase, setPhase] = React.useState('buildup');

  useEffect(() => {
    // Auto-complete after shorter duration to prevent blocking
    const autoComplete = setTimeout(() => {
      if (onComplete) onComplete();
    }, 4000); // Reduced from 6000ms
    
    // Massive confetti celebration
    const celebrate = () => {
      const colors = ['#ff6b6b', '#ffd93d', '#4ecdc4', '#9c27b0', '#00e5ff'];
      
      // Central massive explosion
      confetti({
        particleCount: 300,
        spread: 120,
        origin: { y: 0.5 },
        colors,
        scalar: 1.5
      });
      
      // Side explosions
      setTimeout(() => {
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6, x: 0.1 },
          colors
        });
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6, x: 0.9 },
          colors
        });
      }, 200);
      
      // Top explosions
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.3, x: 0.3 },
          colors
        });
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.3, x: 0.7 },
          colors
        });
      }, 400);
      
      // Final burst
      setTimeout(() => {
        confetti({
          particleCount: 400,
          spread: 140,
          origin: { y: 0.7 },
          colors,
          scalar: 2
        });
      }, 600);
    };
    
    celebrate();
    
    // Phase progression
    const timer1 = setTimeout(() => setPhase('explosion'), 800);
    const timer2 = setTimeout(() => setPhase('celebration'), 2000);
    const timer3 = setTimeout(() => setPhase('complete'), 3500);
    
    return () => {
      clearTimeout(autoComplete);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  if (phase === 'complete') {
    onComplete && onComplete();
    return null;
  }

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 200,
        maxWidth: '300px',
        background: 'linear-gradient(135deg, #000, #111)',
        border: '2px solid #00ff00',
        borderRadius: '8px',
        padding: '15px',
        cursor: 'pointer'
      }}
      onClick={() => onComplete && onComplete()} // Click to dismiss
    >
      {phase === 'buildup' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1],
            opacity: [0, 0.7, 1, 1]
          }}
          transition={{ duration: 0.5 }}
          style={{
            textAlign: 'center',
            color: '#ffd93d'
          }}
        >
          <motion.div
            animate={{
              textShadow: [
                '0 0 30px #ffd93d',
                '0 0 60px #ffd93d',
                '0 0 30px #ffd93d'
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}
          >
            LEVEL UP!
          </motion.div>
          
          <motion.div
            style={{
              fontSize: '24px',
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
            scale: [0, 1.2, 1]
          }}
          transition={{ duration: 0.8 }}
          style={{
            textAlign: 'center'
          }}
        >
          <motion.div
            animate={{
              textShadow: [
                '0 0 40px #ff6b6b',
                '0 0 80px #ff6b6b',
                '0 0 40px #ff6b6b'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#ff6b6b',
              marginBottom: '8px'
            }}
          >
            LEVEL UP!
          </motion.div>
          
          <motion.div
            animate={{
              color: ['#ffd93d', '#ff6b6b', '#4ecdc4', '#ffd93d'],
              textShadow: [
                '0 0 30px #ffd93d',
                '0 0 60px #ff6b6b',
                '0 0 30px #4ecdc4',
                '0 0 30px #ffd93d'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontSize: '32px',
              fontWeight: 'bold'
            }}
          >
            {newLevel}
          </motion.div>
        </motion.div>
      )}
      
      {phase === 'celebration' && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            textAlign: 'center',
            color: '#4ecdc4'
          }}
        >
          <motion.div
            animate={{
              textShadow: [
                '0 0 35px #4ecdc4',
                '0 0 70px #4ecdc4',
                '0 0 35px #4ecdc4'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '8px'
            }}
          >
            🚀 PROGRESS! 🚀
          </motion.div>
          
          <motion.div
            style={{
              fontSize: '12px',
              color: '#ffd93d',
              marginBottom: '8px'
            }}
          >
            Level {newLevel}!
          </motion.div>
          
          <motion.div
            style={{
              fontSize: '20px',
              marginTop: '8px'
            }}
          >
            🎉
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Achievement unlock with maximum satisfaction
export const MegaAchievementUnlock = ({ achievement, onComplete }) => {
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
      }
    };
    return achievements[type] || achievements.speed_demon;
  };

  const data = getAchievementData(achievement);

  useEffect(() => {
    // Auto-dismiss after shorter duration
    const autoDismiss = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000); // Reduced from longer duration
    
    // Massive achievement celebration
    const celebrate = () => {
      const colors = [data.color, '#ffd93d', '#ff6b6b', '#4ecdc4'];
      
      // Central explosion
      confetti({
        particleCount: 250,
        spread: 100,
        origin: { y: 0.6 },
        colors,
        scalar: 1.8
      });
      
      // Multiple bursts
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { 
              y: 0.7, 
              x: 0.2 + (i * 0.15) 
            },
            colors
          });
        }, i * 150);
      }
    };
    
    celebrate();
    
    return () => {
      clearTimeout(autoDismiss);
    };
  }, [data.color]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -360 }}
      animate={{ 
        scale: [0, 1],
        opacity: [0, 1, 1, 1, 0], // Keep visible longer before fade
        y: [0, -20, 0, 0, -100] // Less dramatic movement
      }}
      transition={{ 
        duration: 3, // Reduced duration
        times: [0, 0.3, 0.7, 0.9, 1]
      }}
      onAnimationComplete={onComplete}
      onClick={() => onComplete && onComplete()} // Click to dismiss
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        zIndex: 200,
        background: `linear-gradient(135deg, ${data.color}, ${data.color}cc, #000)`,
        border: `2px solid ${data.color}`,
        borderRadius: '8px',
        padding: '15px',
        textAlign: 'center',
        maxWidth: '280px',
        boxShadow: `0 0 80px ${data.color}, inset 0 0 40px rgba(0,0,0,0.3)`,
        cursor: 'pointer' // Indicate it's clickable
      }}
    >
      {/* Achievement burst background */}
      <motion.div
        animate={{
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle, ${data.color}44, transparent)`,
          borderRadius: '6px'
        }}
      />
      
      {/* Rarity indicator */}
      <motion.div
        animate={{
          textShadow: [
            `0 0 15px ${data.color}`,
            `0 0 35px ${data.color}`,
            `0 0 15px ${data.color}`
          ]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{
          color: data.color,
          fontSize: '10px',
          fontWeight: 'bold',
          marginBottom: '8px',
          letterSpacing: '1px'
        }}
      >
        {data.rarity} ACHIEVEMENT
      </motion.div>
      
      {/* Achievement icon */}
      <motion.div
        style={{
          fontSize: '24px',
          marginBottom: '8px'
        }}
      >
        {data.icon}
      </motion.div>
      
      {/* Achievement title */}
      <motion.div
        animate={{
          textShadow: [
            `0 0 20px ${data.color}`,
            `0 0 40px ${data.color}`,
            `0 0 20px ${data.color}`
          ]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{
          color: '#fff',
          fontSize: '14px',
          fontWeight: 'bold',
          marginBottom: '6px',
          fontFamily: "'Courier New', monospace"
        }}
      >
        {data.title}
      </motion.div>
      
      {/* Achievement description */}
      <div
        style={{
          color: '#ccc',
          fontSize: '10px',
          fontFamily: "'Courier New', monospace"
        }}
      >
        {data.desc}
      </div>
    </motion.div>
  );
};