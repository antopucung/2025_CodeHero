// Celebration System - Manages major achievements and milestones
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

// Level up celebration with maximum impact
export const MegaLevelUpCelebration = ({ newLevel, onComplete }) => {
  const [phase, setPhase] = React.useState('buildup');

  useEffect(() => {
    // Much faster auto-complete
    const autoComplete = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000); // Much faster
    
    // ONLY confetti for major level milestones (every 5 levels)
    const celebrate = () => {
      // Only show confetti for milestone levels (5, 10, 15, 20, etc.)
      if (newLevel % 5 === 0) {
        const colors = ['#ff6b6b', '#ffd93d', '#4ecdc4'];
        
        // Single modest confetti burst
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors
        });
      }
    };
    
    celebrate();
    
    // Phase progression
    const timer1 = setTimeout(() => setPhase('complete'), 1800);
    
    return () => {
      clearTimeout(autoComplete);
      clearTimeout(timer1);
    };
  }, []);

  if (phase === 'complete') {
    onComplete && onComplete();
    return null;
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ 
        scale: 1,
        opacity: 1,
        y: 0
      }}
      exit={{ 
        scale: 0.8,
        opacity: 0,
        y: -20
      }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        top: '5px',
        right: '10px',
        zIndex: 150,
        maxWidth: '200px', // Much smaller
        background: 'linear-gradient(135deg, #000, #111)',
        border: '2px solid #00ff00',
        borderRadius: '6px',
        padding: '8px 12px', // Much smaller padding
        cursor: 'pointer'
      }}
      onClick={() => onComplete && onComplete()} // Click to dismiss
    >
      {/* Simple, clean level up notification */}
      <div style={{ textAlign: 'center' }}>
        <motion.div
          animate={{
            textShadow: [
              '0 0 10px #ffd93d',
              '0 0 20px #ffd93d',
              '0 0 10px #ffd93d'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#ffd93d',
            marginBottom: '4px'
          }}
        >
          LEVEL UP!
        </motion.div>
        
        <div style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#4ecdc4'
        }}>
          {newLevel}
        </div>
        
        {/* Show special indicator for milestone levels */}
        {newLevel % 5 === 0 && (
          <div style={{
            fontSize: '10px',
            color: '#ff6b6b',
            marginTop: '2px'
          }}>
            🎉 MILESTONE!
          </div>
        )}
      </div>
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
        rarity: 'LEGENDARY',
        important: true
      },
      combo_master: { 
        icon: '🔥', 
        title: 'COMBO MASTER', 
        desc: 'Reached 50x combo multiplier!',
        color: '#ffd93d',
        rarity: 'EPIC',
        important: true
      },
      perfectionist: { 
        icon: '💎', 
        title: 'PERFECTIONIST', 
        desc: 'Completed with 100% accuracy!',
        color: '#9c27b0',
        rarity: 'LEGENDARY',
        important: true
      },
      code_wizard: { 
        icon: '🧙‍♂️', 
        title: 'CODE WIZARD', 
        desc: 'Mastered advanced syntax patterns!',
        color: '#00e5ff',
        rarity: 'MYTHIC',
        important: true
      }
    };
    return achievements[type] || achievements.speed_demon;
  };

  const data = getAchievementData(achievement);

  useEffect(() => {
    // Much faster auto-dismiss
    const autoDismiss = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);
    
    // ONLY confetti for important achievements
    const celebrate = () => {
      // Only show confetti for important achievements
      if (data.important) {
        const colors = [data.color, '#ffd93d'];
        
        // Single modest confetti burst
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.8 },
          colors
        });
      }
    };
    
    celebrate();
    
    return () => {
      clearTimeout(autoDismiss);
    };
  }, [data.color]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ 
        scale: 1,
        opacity: 1,
        y: 0
      }}
      exit={{ 
        scale: 0.8,
        opacity: 0,
        y: -20
      }}
      transition={{ duration: 0.3 }}
      onAnimationComplete={onComplete}
      onClick={() => onComplete && onComplete()} // Click to dismiss
      style={{
        position: 'fixed',
        top: '5px',
        left: '10px',
        zIndex: 150,
        background: `linear-gradient(135deg, ${data.color}, ${data.color}cc, #000)`,
        border: `2px solid ${data.color}`,
        borderRadius: '6px',
        padding: '8px 12px', // Much smaller
        textAlign: 'center',
        maxWidth: '180px', // Much smaller
        boxShadow: `0 0 20px ${data.color}44`,
        cursor: 'pointer' // Indicate it's clickable
      }}
    >
      {/* Simple achievement notification */}
      <div
        style={{
          fontSize: '16px',
          marginBottom: '4px'
        }}
      >
        {data.icon}
      </div>
      
      <div
        style={{
          color: data.color,
          fontSize: '11px',
          fontWeight: 'bold',
          marginBottom: '2px'
        }}
      >
        {data.title}
      </div>
      
      <div
        style={{
          color: '#aaa',
          fontSize: '10px',
          opacity: 0.8
        }}
      >
        {data.rarity}
      </div>
    </motion.div>
  );
};