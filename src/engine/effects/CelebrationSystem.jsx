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
        scale: [0, 1.3, 1], 
        opacity: 1,
        rotate: [0, 360, 0]
      }}
      exit={{ 
        scale: 0,
        opacity: 0,
        rotate: 180
      }}
      transition={{ 
        duration: 1.5, 
        ease: "backOut",
        rotate: { duration: 2 }
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        textAlign: 'center',
        background: 'linear-gradient(45deg, #000, #111, #000)',
        border: '4px solid #00ff00',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 0 60px #00ff00, inset 0 0 30px rgba(0, 255, 0, 0.1)'
      }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          textShadow: [
            '0 0 25px #00ff00',
            '0 0 50px #00ff00, 0 0 25px #ffff00',
            '0 0 25px #00ff00'
          ]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2.5 
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.08, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity
          }}
        >
          <div style={{ fontSize: '4xl', color: '#00ff00', fontWeight: 'bold', marginBottom: '20px' }}>
            🎉 LEVEL UP! 🎉
          </div>
        </motion.div>
        
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            textShadow: [
              '0 0 20px #ffff00',
              '0 0 40px #ffff00, 0 0 20px #ffd93d',
              '0 0 20px #ffff00'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          <div style={{ fontSize: '6xl', color: '#ffff00', fontWeight: 'bold', textShadow: '0 0 35px #ffff00' }}>
            {newLevel}
          </div>
        </motion.div>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div style={{ fontSize: '2xl', color: '#ffd93d', marginTop: '20px', fontWeight: 'bold' }}>
            🚀 INCREDIBLE PROGRESS! 🚀
          </div>
          <div style={{ fontSize: 'lg', color: '#4ecdc4', marginTop: '10px' }}>
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
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ 
        scale: [0, 1.3, 1],
        opacity: [0, 1, 1, 0],
        rotate: [0, 360, 0],
        y: [0, -20, 0, -100]
      }}
      transition={{ 
        duration: 4,
        times: [0, 0.3, 0.8, 1]
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        background: `linear-gradient(135deg, ${data.color}, ${data.color}cc, #000)`,
        border: `4px solid ${data.color}`,
        borderRadius: '20px',
        padding: '30px',
        textAlign: 'center',
        minWidth: '350px',
        boxShadow: `0 0 50px ${data.color}, inset 0 0 30px rgba(0,0,0,0.3)`
      }}
    >
      {/* Achievement burst background */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle, ${data.color}33, transparent)`,
          borderRadius: '16px'
        }}
      />
      
      {/* Rarity indicator */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          textShadow: [
            `0 0 10px ${data.color}`,
            `0 0 25px ${data.color}`,
            `0 0 10px ${data.color}`
          ]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{
          color: data.color,
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '10px',
          letterSpacing: '2px'
        }}
      >
        {data.rarity} ACHIEVEMENT
      </motion.div>
      
      {/* Achievement icon */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 15, -15, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          fontSize: '60px',
          marginBottom: '15px'
        }}
      >
        {data.icon}
      </motion.div>
      
      {/* Achievement title */}
      <motion.div
        animate={{
          textShadow: [
            `0 0 15px ${data.color}`,
            `0 0 30px ${data.color}`,
            `0 0 15px ${data.color}`
          ]
        }}
        transition={{ duration: 1.8, repeat: Infinity }}
        style={{
          color: '#fff',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '10px',
          fontFamily: "'Courier New', monospace"
        }}
      >
        {data.title}
      </motion.div>
      
      {/* Achievement description */}
      <div
        style={{
          color: '#ccc',
          fontSize: '14px',
          fontFamily: "'Courier New', monospace"
        }}
      >
        {data.desc}
      </div>
      
      {/* Orbiting achievement particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.4, 0.8]
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, delay: i * 0.2 },
            scale: { duration: 1.5, repeat: Infinity, delay: i * 0.1 }
          }}
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            background: data.color,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transformOrigin: `${60 + i * 10}px 0px`,
            boxShadow: `0 0 12px ${data.color}`
          }}
        />
      ))}
    </motion.div>
  );
};