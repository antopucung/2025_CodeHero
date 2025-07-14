// Celebration System - Manages major achievements and milestones
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

// Level up celebration - minimal and non-blocking
export const MegaLevelUpCelebration = ({ newLevel, onComplete }) => {
  useEffect(() => {
    // Auto-complete after 3 seconds
    const autoComplete = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);
    
    // Confetti only for milestone levels (every 10 levels)
    const celebrate = () => {
      if (newLevel % 10 === 0) {
        const colors = ['#ff6b6b', '#ffd93d', '#4ecdc4', '#9c27b0'];
        
        // Celebration confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors
        });
        
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 120,
            origin: { y: 0.7, x: 0.2 },
            colors
          });
        }, 300);
        
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 120,
            origin: { y: 0.7, x: 0.8 },
            colors
          });
        }, 600);
      }
    };
    
    celebrate();

    return () => {
      clearTimeout(autoComplete);
    };
  }, [newLevel, onComplete]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ 
        scale: [0, 1.2, 1], 
        opacity: 1
      }}
      exit={{ 
        scale: 0,
        opacity: 0,
        rotate: 180
      }}
      transition={{ 
        duration: 1.2, 
        ease: "backOut"
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        textAlign: 'center',
        pointerEvents: 'none'
      }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          textShadow: [
            '0 0 25px #00ff00',
            '0 0 35px #00ff00',
            '0 0 25px #00ff00'
          ]
        }}
        transition={{ 
          repeat: 2, 
          duration: 1.5 
        }}
      >
        <div style={{ fontSize: '48px', color: '#00ff00', fontWeight: 'bold', marginBottom: '20px', textShadow: '0 0 20px #00ff00' }}>
          🎉 LEVEL UP! 🎉
        </div>
        
        <div style={{ fontSize: '72px', color: '#ffff00', fontWeight: 'bold', textShadow: '0 0 35px #ffff00' }}>
          {newLevel}
        </div>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div style={{ fontSize: '24px', color: '#ffd93d', marginTop: '20px', fontWeight: 'bold', textShadow: '0 0 15px #ffd93d' }}>
            🚀 INCREDIBLE PROGRESS! 🚀
          </div>
          <div style={{ fontSize: '18px', color: '#4ecdc4', marginTop: '10px', textShadow: '0 0 10px #4ecdc4' }}>
            Your typing skills are evolving!
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Achievement unlock celebration
export const MegaAchievementUnlock = ({ achievement, onComplete }) => {
  const getAchievementData = (type) => {
    const achievements = {
      speed_demon: { 
        icon: '⚡', 
        title: 'SPEED DEMON', 
        desc: 'Achieved 15+ perfect streak!',
        color: '#ff6b6b',
        rarity: 'LEGENDARY',
      },
      combo_master: { 
        icon: '🔥', 
        title: 'COMBO MASTER', 
        desc: 'Reached 50x combo multiplier!',
        color: '#ffd93d',
        rarity: 'EPIC',
      },
      perfectionist: { 
        icon: '💎', 
        title: 'PERFECTIONIST', 
        desc: 'Completed with 100% accuracy!',
        color: '#9c27b0',
        rarity: 'LEGENDARY',
      },
      code_wizard: { 
        icon: '🧙‍♂️', 
        title: 'CODE WIZARD', 
        desc: 'Mastered advanced syntax patterns!',
        color: '#00e5ff',
        rarity: 'MYTHIC',
      },
      syntax_master: { 
        icon: '🎯', 
        title: 'SYNTAX MASTER', 
        desc: 'Expert in coding constructs!',
        color: '#4ecdc4',
        rarity: 'RARE'
      }
    };
    return achievements[type] || achievements.speed_demon;
  };

  const data = getAchievementData(achievement);

  useEffect(() => {
    // Massive confetti celebration
    const celebrate = () => {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: [data.color, '#ffd93d', '#ff6b6b', '#4ecdc4']
      });
      
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.8, x: 0.2 },
          colors: [data.color]
        });
      }, 300);
      
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 60,
          origin: { y: 0.8, x: 0.8 },
          colors: [data.color]
        });
      }, 600);
    };
    
    celebrate();
  }, [data.color]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.3, 1],
        opacity: [0, 1, 1, 0]
      }}
      transition={{ 
        duration: 3,
        times: [0, 0.3, 0.9, 1]
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        textAlign: 'center',
        pointerEvents: 'none'
      }}
    >
      {/* Rarity indicator */}
      <div style={{
        color: data.color,
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: '10px',
        letterSpacing: '2px',
        textShadow: `0 0 10px ${data.color}`
      }}>
        {data.rarity} ACHIEVEMENT
      </div>
      
      {/* Achievement icon */}
      <div style={{
        fontSize: '60px',
        marginBottom: '15px',
        filter: `drop-shadow(0 0 20px ${data.color})`
      }}>
        {data.icon}
      </div>
      
      {/* Achievement title */}
      <div style={{
        color: '#fff',
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
        fontFamily: "'Courier New', monospace",
        textShadow: `0 0 15px ${data.color}`
      }}>
        {data.title}
      </div>
      
      {/* Achievement description */}
      <div
        style={{
          color: '#ccc',
          fontSize: '14px',
          fontFamily: "'Courier New', monospace",
          textShadow: '0 0 8px #ccc'
        }}
      >
        {data.desc}
      </div>
    </motion.div>
  );
};