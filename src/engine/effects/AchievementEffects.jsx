import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Text as ChakraText } from '@chakra-ui/react';
import confetti from 'canvas-confetti';

// Enhanced character upgrade system with visual evolution
export const CharacterUpgradeEffect = ({ char, index, upgrade, onComplete }) => {
  const getUpgradeStyle = (level) => {
    const styles = {
      1: { color: '#4ecdc4', glow: '#4ecdc4', name: 'BRONZE' },
      2: { color: '#ffd93d', glow: '#ffd93d', name: 'SILVER' },
      3: { color: '#ff6b6b', glow: '#ff6b6b', name: 'GOLD' },
      4: { color: '#9c27b0', glow: '#9c27b0', name: 'PLATINUM' },
      5: { color: '#00e5ff', glow: '#00e5ff', name: 'DIAMOND' }
    };
    return styles[level] || styles[1];
  };

  const style = getUpgradeStyle(upgrade.level);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 0 }}
      animate={{ 
        scale: [0, 2, 1.5, 0],
        opacity: [0, 1, 1, 0],
        y: [0, -60, -80, -120],
        rotate: [0, 180, 360, 540]
      }}
      transition={{ 
        duration: 2.5,
        times: [0, 0.3, 0.7, 1]
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        left: index * 17,
        top: -40,
        zIndex: 1002,
        pointerEvents: 'none'
      }}
    >
      {/* Upgrade burst effect */}
      <motion.div
        animate={{
          scale: [0, 3, 0],
          opacity: [1, 0.3, 0]
        }}
        transition={{ duration: 1.5 }}
        style={{
          position: 'absolute',
          width: '60px',
          height: '60px',
          background: `radial-gradient(circle, ${style.glow}, transparent)`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
      
      {/* Character with upgrade glow */}
      <motion.div
        animate={{
          textShadow: [
            `0 0 10px ${style.glow}`,
            `0 0 30px ${style.glow}`,
            `0 0 20px ${style.glow}`
          ]
        }}
        transition={{ duration: 1, repeat: 2 }}
        style={{
          color: style.color,
          fontSize: '24px',
          fontWeight: 'bold',
          fontFamily: "'Courier New', monospace",
          textAlign: 'center'
        }}
      >
        {char}
      </motion.div>
      
      {/* Upgrade level indicator */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ 
          scale: [0, 1.5, 1.2],
          rotate: [0, 360, 180]
        }}
        transition={{ duration: 1.2, delay: 0.5 }}
        style={{
          position: 'absolute',
          top: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: `linear-gradient(45deg, ${style.color}, ${style.color}cc)`,
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '10px',
          fontWeight: 'bold',
          border: `2px solid ${style.glow}`,
          boxShadow: `0 0 15px ${style.glow}`
        }}
      >
        {style.name} LV.{upgrade.level}
      </motion.div>
      
      {/* Orbiting particles */}
      {Array.from({ length: upgrade.level + 2 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: [0, 360],
            scale: [0.5, 1.2, 0.5]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, delay: i * 0.2 },
            scale: { duration: 1, repeat: Infinity, delay: i * 0.1 }
          }}
          style={{
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: style.glow,
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transformOrigin: `${20 + i * 8}px 0px`,
            boxShadow: `0 0 8px ${style.glow}`
          }}
        />
      ))}
    </motion.div>
  );
};

// Achievement unlock celebration
export const AchievementUnlock = ({ achievement, onComplete }) => {
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
    // Trigger massive confetti celebration
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
      <ChakraText
        color="#ccc"
        fontSize="14px"
        fontFamily="'Courier New', monospace"
      >
        {data.desc}
      </ChakraText>
      
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