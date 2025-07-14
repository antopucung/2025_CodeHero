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
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999, // Reduced z-index
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.85)', // Less opaque
        backdropFilter: 'blur(2px)', // Add blur instead of solid overlay
        cursor: 'pointer' // Indicate it's clickable
      }}
      onClick={() => onComplete && onComplete()} // Click to dismiss
    >
      {phase === 'buildup' && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 0.8, 1.5, 1],
            opacity: [0, 0.7, 1, 1]
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
                '0 0 30px #ffd93d',
                '0 0 60px #ffd93d',
                '0 0 30px #ffd93d'
              ],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              marginBottom: '30px'
            }}
          >
            LEVEL UP INCOMING...
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1.5, repeat: Infinity }
            }}
            style={{
              fontSize: '120px',
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
            scale: [0, 3, 2],
            rotate: [0, 360, 720]
          }}
          transition={{ duration: 1.5 }}
          style={{
            textAlign: 'center'
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              textShadow: [
                '0 0 40px #ff6b6b',
                '0 0 80px #ff6b6b',
                '0 0 40px #ff6b6b'
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{
              fontSize: '96px',
              fontWeight: 'bold',
              color: '#ff6b6b',
              marginBottom: '30px'
            }}
          >
            💥 LEVEL UP! 💥
          </motion.div>
          
          <motion.div
            animate={{
              scale: [1, 1.8, 1],
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
              fontSize: '160px',
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
              scale: [1, 1.2, 1],
              textShadow: [
                '0 0 35px #4ecdc4',
                '0 0 70px #4ecdc4',
                '0 0 35px #4ecdc4'
              ]
            }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              marginBottom: '30px'
            }}
          >
            🚀 INCREDIBLE PROGRESS! 🚀
          </motion.div>
          
          <motion.div
            style={{
              fontSize: '24px',
              color: '#ffd93d',
              marginBottom: '20px'
            }}
          >
            Your typing skills have evolved to Level {newLevel}!
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.5, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            style={{
              fontSize: '80px',
              marginTop: '30px'
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
        scale: [0, 1.5, 1],
        opacity: [0, 1, 1, 1, 0], // Keep visible longer before fade
        rotate: [0, 720, 0],
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
        top: '20%', // Moved down to be less intrusive
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9998, // Lower z-index
        background: `linear-gradient(135deg, ${data.color}, ${data.color}cc, #000)`,
        border: `6px solid ${data.color}`,
        borderRadius: '25px',
        padding: '40px',
        textAlign: 'center',
        minWidth: '350px', // Smaller width
        maxWidth: '90vw', // Responsive width
        boxShadow: `0 0 80px ${data.color}, inset 0 0 40px rgba(0,0,0,0.3)`,
        cursor: 'pointer' // Indicate it's clickable
      }}
    >
      {/* Achievement burst background */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle, ${data.color}44, transparent)`,
          borderRadius: '20px'
        }}
      />
      
      {/* Rarity indicator */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          textShadow: [
            `0 0 15px ${data.color}`,
            `0 0 35px ${data.color}`,
            `0 0 15px ${data.color}`
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          color: data.color,
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '15px',
          letterSpacing: '3px'
        }}
      >
        {data.rarity} ACHIEVEMENT
      </motion.div>
      
      {/* Achievement icon */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, 20, -20, 0]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
        style={{
          fontSize: '80px',
          marginBottom: '20px'
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
        transition={{ duration: 2.2, repeat: Infinity }}
        style={{
          color: '#fff',
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '15px',
          fontFamily: "'Courier New', monospace"
        }}
      >
        {data.title}
      </motion.div>
      
      {/* Achievement description */}
      <div
        style={{
          color: '#ccc',
          fontSize: '18px',
          fontFamily: "'Courier New', monospace"
        }}
      >
        {data.desc}
      </div>
      
      {/* Orbiting achievement particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.6, 0.8]
          }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, delay: i * 0.2 },
            scale: { duration: 2, repeat: Infinity, delay: i * 0.1 }
          }}
          style={{
            position: 'absolute',
            width: '12px',
            height: '12px',
            background: data.color,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transformOrigin: `${80 + i * 15}px 0px`,
            boxShadow: `0 0 20px ${data.color}`
          }}
        />
      ))}
    </motion.div>
  );
};