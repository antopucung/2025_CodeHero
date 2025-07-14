import React from 'react';
import { motion } from 'framer-motion';

// Enhanced character explosion with speed and pattern effects
export const CharacterExplosion = ({ char, x, y, isCorrect, combo = 1, speed = 'lame', patterns = 0, onComplete, reduced = false }) => {
  const getExplosionColor = (isCorrect, speed, combo) => {
    if (!isCorrect) return '#ff1744';
    
    const speedColors = {
      perfect: '#ff6b6b',
      best: '#ffd93d',
      good: '#4ecdc4',
      lame: '#00ff00'
    };
    
    return speedColors[speed] || '#00ff00';
  };

  const explosionColor = getExplosionColor(isCorrect, speed, combo);
  const particleCount = reduced ? 
    (isCorrect ? Math.min(4 + combo / 4, 8) : 4) :
    (isCorrect ? Math.min(8 + combo / 2 + patterns * 3, 20) : 10);
  const explosionSize = isCorrect ? Math.min(35 + combo * 2 + patterns * 8, 100) : 30;
  const speedMultiplier = { perfect: 1.5, best: 1.3, good: 1.1, lame: 1 }[speed] || 1;
  
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (i * (360 / particleCount)) * (Math.PI / 180),
    velocity: (20 + Math.random() * explosionSize) * speedMultiplier,
    size: isCorrect ? 2 + Math.random() * (4 + patterns) : 2 + Math.random() * 2,
    delay: Math.random() * 0.3
  }));

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 2 + (patterns * 0.3) }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 999
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ 
            x: 0, 
            y: 0, 
            scale: 1,
            opacity: 1
          }}
          animate={{ 
            x: Math.cos(particle.angle) * particle.velocity,
            y: Math.sin(particle.angle) * particle.velocity,
            scale: [1, 1.8 + (patterns * 0.2), 0],
            opacity: [1, 0.9, 0]
          }}
          transition={{ 
            duration: reduced ? 1 : 1.5 + (patterns * 0.2), 
            ease: "easeOut",
            delay: particle.delay
          }}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${explosionColor}, ${explosionColor}88)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${particle.size * 3}px ${explosionColor}`
          }}
        />
      ))}
      
      {/* Enhanced main character explosion */}
      <motion.div
        initial={{ scale: 1, rotate: 0 }}
        animate={{ 
          scale: isCorrect ? [1, 3.5 + (patterns * 0.5), 0] : [1, 3, 0], 
          opacity: [1, 0.9, 0],
          rotate: isCorrect ? [0, 180 + (patterns * 60), 360 + (patterns * 120)] : [0, -90, -180]
        }}
        transition={{ duration: 1 + (patterns * 0.2) }}
        style={{
          color: explosionColor,
          fontFamily: "'Courier New', monospace",
          fontWeight: 'bold',
          fontSize: isCorrect && (combo > 10 || patterns > 0) ? '24px' : '18px',
          textShadow: `0 0 ${20 + patterns * 5}px ${explosionColor}`,
          position: 'absolute',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {char}
      </motion.div>

      {/* Speed indicator */}
      {isCorrect && speed !== 'lame' && !reduced && (
        <motion.div
          initial={{ scale: 0, y: -10, opacity: 0 }}
          animate={{ 
            scale: [1, 1.5, 1.2],
            y: [-30, -40, -35],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 1.2,
            opacity: { delay: 0.8, duration: 0.4 }
          }}
          style={{
            position: 'absolute',
            top: '-35px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: explosionColor,
            fontSize: '12px',
            fontWeight: 'bold',
            textShadow: `0 0 10px ${explosionColor}`
          }}
        >
          {speed.toUpperCase()}!
        </motion.div>
      )}

      {/* Pattern bonus indicator */}
      {patterns > 0 && !reduced && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ 
            scale: [1, 2, 1.5],
            rotate: [0, 360, 180],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 1.5,
            opacity: { delay: 1, duration: 0.5 }
          }}
          style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ff6b6b',
            fontSize: '16px',
            fontWeight: 'bold',
            textShadow: '0 0 15px #ff6b6b'
          }}
        >
          ⭐ BONUS!
        </motion.div>
      )}

      {/* Enhanced error indicator */}
      {!isCorrect && !reduced && (
        <motion.div
          initial={{ scale: 0, y: 0, rotate: -90 }}
          animate={{ 
            scale: [1, 2, 1.5],
            y: [-25, -35, -30],
            rotate: [0, 15, -15, 0],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 1.2,
            opacity: { delay: 0.6, duration: 0.6 }
          }}
          style={{
            position: 'absolute',
            top: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ff1744',
            fontSize: '24px',
            fontWeight: 'bold',
            textShadow: '0 0 20px #ff1744'
          }}
        >
          ✗
        </motion.div>
      )}

      {/* Enhanced celebration rings for high performance */}
      {isCorrect && (combo > 5 || patterns > 0) && !reduced && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 2.5 + patterns, 4 + patterns],
              opacity: [1, 0.7, 0]
            }}
            transition={{ duration: 2 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              border: `4px solid ${explosionColor}`,
              borderRadius: '50%',
              boxShadow: `0 0 30px ${explosionColor}`
            }}
          />
          
          {patterns > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{
                scale: [0, 3 + patterns, 5 + patterns],
                opacity: [0.8, 0.5, 0]
              }}
              transition={{ duration: 2.5, delay: 0.3 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100px',
                height: '100px',
                border: `6px solid ${explosionColor}`,
                borderRadius: '50%',
                boxShadow: `0 0 40px ${explosionColor}`
              }}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

// Enhanced combo burst effect with pattern matching
export const ComboBurstEffect = ({ isActive, combo, x, y, patterns = [], reduced = false }) => {
  if (!isActive || combo <= 5) return null;

  const getComboColor = (combo) => {
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 10) return '#4ecdc4';
    return '#45b7d1';
  };

  const burstColor = getComboColor(combo);
  const particleCount = reduced ? 
    Math.min(Math.floor(combo / 6) + patterns.length, 6) :
    Math.min(Math.floor(combo / 3) + patterns.length * 2, 16);
  const burstSize = Math.min(combo * 2 + patterns.length * 10, 60);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 999,
        pointerEvents: 'none'
      }}
    >
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5 + (patterns.length * 0.3), 0],
            x: Math.cos((i * (360 / particleCount)) * Math.PI / 180) * burstSize,
            y: Math.sin((i * (360 / particleCount)) * Math.PI / 180) * burstSize,
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: reduced ? 0.8 : 1.2 + (patterns.length * 0.2),
            delay: i * 0.03,
            repeat: Infinity,
            repeatDelay: 0.8
          }}
          style={{
            position: 'absolute',
            width: `${6 + patterns.length}px`,
            height: `${6 + patterns.length}px`,
            background: `radial-gradient(circle, ${burstColor}, ${burstColor}88)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${10 + patterns.length * 2}px ${burstColor}`
          }}
        />
      ))}
      
      {/* Enhanced central burst for pattern matches */}
      {!reduced && <motion.div
        animate={{
          scale: [1, 1.5 + (patterns.length * 0.2), 1],
          opacity: [0.8, 0.4, 0.8],
          rotate: [0, 180 + (patterns.length * 30), 360 + (patterns.length * 60)]
        }}
        transition={{
          duration: 1 + (patterns.length * 0.2),
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          width: `${12 + patterns.length * 2}px`,
          height: `${12 + patterns.length * 2}px`,
          background: `radial-gradient(circle, ${burstColor}, transparent)`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 ${20 + patterns.length * 5}px ${burstColor}`
        }}
      />}
    </motion.div>
  );
};