// Reward System - Manages all juicy effects and addictive feedback
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Enhanced floating score with maximum juice
export const JuicyFloatingScore = ({ score, x, y, color = '#00ff00', combo = 1, speed = 'lame', patterns = 0, onComplete }) => {
  const getScoreSize = (combo, patterns) => {
    const baseSize = 18;
    const comboBonus = Math.min(combo / 8, 12);
    const patternBonus = patterns * 3;
    return `${baseSize + comboBonus + patternBonus}px`;
  };

  const getJuicyEffect = (combo, speed, patterns) => {
    const speedMultiplier = { perfect: 2.5, best: 2, good: 1.5, lame: 1 }[speed];
    const patternMultiplier = 1 + (patterns * 0.5);
    
    if (combo >= 50) return {
      scale: [0.3, 3.5 * speedMultiplier * patternMultiplier, 2.2],
      rotate: [0, 720 + (patterns * 180), 360],
      textShadow: [
        `0 0 15px ${color}`,
        `0 0 60px ${color}, 0 0 30px #ffff00`,
        `0 0 40px ${color}`
      ],
      filter: [
        'brightness(1)',
        'brightness(2) saturate(2)',
        'brightness(1.5)'
      ]
    };
    if (combo >= 30) return {
      scale: [0.3, 2.8 * speedMultiplier * patternMultiplier, 1.8],
      rotate: [0, 540 + (patterns * 120), 270],
      textShadow: [
        `0 0 12px ${color}`,
        `0 0 50px ${color}, 0 0 25px #ffd93d`,
        `0 0 30px ${color}`
      ],
      filter: [
        'brightness(1)',
        'brightness(1.8) saturate(1.8)',
        'brightness(1.3)'
      ]
    };
    if (combo >= 10) return {
      scale: [0.3, 2.2 * speedMultiplier * patternMultiplier, 1.5],
      rotate: [0, 360 + (patterns * 90), 180],
      textShadow: [
        `0 0 10px ${color}`,
        `0 0 40px ${color}, 0 0 20px #4ecdc4`,
        `0 0 25px ${color}`
      ],
      filter: [
        'brightness(1)',
        'brightness(1.6) saturate(1.6)',
        'brightness(1.2)'
      ]
    };
    return {
      scale: [0.3, 1.8 * speedMultiplier * patternMultiplier, 1.2],
      rotate: [0, 180 + (patterns * 60), 90],
      textShadow: [
        `0 0 8px ${color}`,
        `0 0 30px ${color}`,
        `0 0 15px ${color}`
      ],
      filter: [
        'brightness(1)',
        'brightness(1.4) saturate(1.4)',
        'brightness(1.1)'
      ]
    };
  };

  const effects = getJuicyEffect(combo, speed, patterns);

  return (
    <motion.div
      initial={{ 
        opacity: 1, 
        scale: 0.3, 
        x: x, 
        y: y,
        rotate: 0,
        filter: 'brightness(1)'
      }}
      animate={{ 
        opacity: [1, 1, 1, 0], 
        scale: effects.scale,
        rotate: effects.rotate,
        textShadow: effects.textShadow,
        filter: effects.filter,
        y: y - 150 - (patterns * 30),
        x: x + (-30 + Math.random() * 60)
      }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 3 + (patterns * 0.8), 
        ease: "easeOut"
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        zIndex: 1000,
        color: color,
        fontFamily: "'Courier New', monospace",
        fontWeight: 'bold',
        fontSize: getScoreSize(combo, patterns),
        textAlign: 'center'
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          textShadow: [
            `0 0 10px ${color}`,
            `0 0 25px ${color}`,
            `0 0 10px ${color}`
          ]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity
        }}
      >
        +{score}
      </motion.div>
      
      {combo > 5 && (
        <motion.span
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.5, 1.2, 0]
          }}
          transition={{ duration: 2, delay: 0.3 }}
          style={{
            display: 'block',
            fontSize: '12px',
            marginTop: '4px',
            color: '#ffff00',
            textShadow: '0 0 15px #ffff00'
          }}
        >
          x{combo} COMBO!
        </motion.span>
      )}
      
      {speed !== 'lame' && (
        <motion.span
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.3, 1.4, 1.1, 0],
            rotate: [0, 360, 180, 0]
          }}
          transition={{ duration: 1.8, delay: 0.5 }}
          style={{
            display: 'block',
            fontSize: '10px',
            marginTop: '2px',
            color: speed === 'perfect' ? '#ff6b6b' : speed === 'best' ? '#ffd93d' : '#4ecdc4',
            textShadow: `0 0 12px ${speed === 'perfect' ? '#ff6b6b' : speed === 'best' ? '#ffd93d' : '#4ecdc4'}`
          }}
        >
          {speed.toUpperCase()}!
        </motion.span>
      )}
      
      {patterns > 0 && (
        <motion.span
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.2, 1.6, 1.3, 0],
            rotate: [0, 720, 360, 0]
          }}
          transition={{ duration: 2.5, delay: 0.2 }}
          style={{
            display: 'block',
            fontSize: '14px',
            marginTop: '3px',
            color: '#ff6b6b',
            textShadow: '0 0 20px #ff6b6b'
          }}
        >
          ⭐ PATTERN BONUS! ⭐
        </motion.span>
      )}
    </motion.div>
  );
};

// Enhanced character explosion with maximum satisfaction
export const JuicyCharacterExplosion = ({ char, x, y, isCorrect, combo = 1, speed = 'lame', patterns = 0, onComplete }) => {
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
  const particleCount = isCorrect ? Math.min(12 + combo / 2 + patterns * 4, 25) : 15;
  const explosionSize = isCorrect ? Math.min(50 + combo * 3 + patterns * 12, 120) : 40;
  const speedMultiplier = { perfect: 2, best: 1.7, good: 1.4, lame: 1 }[speed] || 1;
  
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    angle: (i * (360 / particleCount)) * (Math.PI / 180),
    velocity: (25 + Math.random() * explosionSize) * speedMultiplier,
    size: isCorrect ? 3 + Math.random() * (6 + patterns) : 3 + Math.random() * 3,
    delay: Math.random() * 0.4
  }));

  // Trigger confetti for high performance
  React.useEffect(() => {
    if (isCorrect && (combo >= 10 || speed === 'perfect' || patterns > 0)) {
      const colors = [explosionColor, '#ffff00', '#ff6b6b', '#4ecdc4'];
      
      if (combo >= 30 || patterns > 1) {
        // Major celebration
        confetti({
          particleCount: 100 + (combo * 2),
          spread: 90,
          origin: { x: x / window.innerWidth, y: y / window.innerHeight },
          colors
        });
      } else if (combo >= 10 || speed === 'perfect') {
        // Medium celebration
        confetti({
          particleCount: 50 + combo,
          spread: 60,
          origin: { x: x / window.innerWidth, y: y / window.innerHeight },
          colors
        });
      }
    }
  }, [isCorrect, combo, speed, patterns, explosionColor, x, y]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 2.5 + (patterns * 0.5) }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 999
      }}
    >
      {/* Enhanced particle explosion */}
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
            scale: [1, 2.5 + (patterns * 0.4), 0],
            opacity: [1, 0.9, 0]
          }}
          transition={{ 
            duration: 2 + (patterns * 0.3), 
            ease: "easeOut",
            delay: particle.delay
          }}
          style={{
            position: 'absolute',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${explosionColor}, ${explosionColor}88)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${particle.size * 4}px ${explosionColor}`
          }}
        />
      ))}
      
      {/* Enhanced main character explosion */}
      <motion.div
        initial={{ scale: 1, rotate: 0 }}
        animate={{ 
          scale: isCorrect ? [1, 4.5 + (patterns * 0.8), 0] : [1, 3.5, 0], 
          opacity: [1, 0.9, 0],
          rotate: isCorrect ? [0, 360 + (patterns * 180), 720 + (patterns * 360)] : [0, -180, -360],
          filter: isCorrect ? [
            'brightness(1)',
            'brightness(2.5) saturate(2)',
            'brightness(1)'
          ] : [
            'brightness(1)',
            'brightness(1.5)',
            'brightness(1)'
          ]
        }}
        transition={{ duration: 1.5 + (patterns * 0.3) }}
        style={{
          color: explosionColor,
          fontFamily: "'Courier New', monospace",
          fontWeight: 'bold',
          fontSize: isCorrect && (combo > 10 || patterns > 0) ? '28px' : '20px',
          textShadow: `0 0 ${30 + patterns * 8}px ${explosionColor}`,
          position: 'absolute',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {char}
      </motion.div>

      {/* Enhanced speed indicator */}
      {isCorrect && speed !== 'lame' && (
        <motion.div
          initial={{ scale: 0, y: -15, opacity: 0 }}
          animate={{ 
            scale: [1, 2, 1.5],
            y: [-40, -55, -50],
            opacity: [1, 1, 0],
            rotate: [0, 360, 180]
          }}
          transition={{ 
            duration: 1.8,
            opacity: { delay: 1, duration: 0.8 }
          }}
          style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: explosionColor,
            fontSize: '16px',
            fontWeight: 'bold',
            textShadow: `0 0 15px ${explosionColor}`
          }}
        >
          {speed.toUpperCase()}!
        </motion.div>
      )}

      {/* Enhanced pattern bonus indicator */}
      {patterns > 0 && (
        <motion.div
          initial={{ scale: 0, rotate: -360 }}
          animate={{ 
            scale: [1, 3, 2],
            rotate: [0, 720, 360],
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 2.5,
            opacity: { delay: 1.5, duration: 1 }
          }}
          style={{
            position: 'absolute',
            top: '-70px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ff6b6b',
            fontSize: '20px',
            fontWeight: 'bold',
            textShadow: '0 0 25px #ff6b6b'
          }}
        >
          ⭐ PATTERN! ⭐
        </motion.div>
      )}

      {/* Enhanced celebration rings */}
      {isCorrect && (combo > 5 || patterns > 0) && (
        <>
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 4 + patterns, 6 + patterns],
              opacity: [1, 0.8, 0]
            }}
            transition={{ duration: 2.5 }}
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
          
          {patterns > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{
                scale: [0, 5 + patterns, 8 + patterns],
                opacity: [0.8, 0.6, 0]
              }}
              transition={{ duration: 3, delay: 0.5 }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '120px',
                border: `8px solid ${explosionColor}`,
                borderRadius: '50%',
                boxShadow: `0 0 60px ${explosionColor}`
              }}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

// Enhanced combo burst effect
export const JuicyComboBurst = ({ isActive, combo, x, y, patterns = [] }) => {
  if (!isActive || combo <= 5) return null;

  const getComboColor = (combo) => {
    if (combo >= 50) return '#ff6b6b';
    if (combo >= 30) return '#ffd93d';
    if (combo >= 20) return '#6bcf7f';
    if (combo >= 10) return '#4ecdc4';
    return '#45b7d1';
  };

  const burstColor = getComboColor(combo);
  const particleCount = Math.min(Math.floor(combo / 2) + patterns.length * 3, 20);
  const burstSize = Math.min(combo * 3 + patterns.length * 15, 80);

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
            scale: [0, 2.5 + (patterns.length * 0.5), 0],
            x: Math.cos((i * (360 / particleCount)) * Math.PI / 180) * burstSize,
            y: Math.sin((i * (360 / particleCount)) * Math.PI / 180) * burstSize,
            opacity: [1, 0.8, 0]
          }}
          transition={{
            duration: 2 + (patterns.length * 0.4),
            delay: i * 0.05,
            repeat: Infinity,
            repeatDelay: 1.5
          }}
          style={{
            position: 'absolute',
            width: `${8 + patterns.length * 2}px`,
            height: `${8 + patterns.length * 2}px`,
            background: `radial-gradient(circle, ${burstColor}, ${burstColor}88)`,
            borderRadius: '50%',
            boxShadow: `0 0 ${15 + patterns.length * 3}px ${burstColor}`
          }}
        />
      ))}
      
      {/* Enhanced central burst */}
      <motion.div
        animate={{
          scale: [1, 2.5 + (patterns.length * 0.4), 1],
          opacity: [0.8, 0.4, 0.8],
          rotate: [0, 360 + (patterns.length * 60), 720 + (patterns.length * 120)]
        }}
        transition={{
          duration: 2 + (patterns.length * 0.4),
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          width: `${20 + patterns.length * 4}px`,
          height: `${20 + patterns.length * 4}px`,
          background: `radial-gradient(circle, ${burstColor}, transparent)`,
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 ${30 + patterns.length * 8}px ${burstColor}`
        }}
      />
    </motion.div>
  );
};

// Screen shake effect for major achievements
export const ScreenShakeEffect = ({ isActive, intensity = 1 }) => {
  if (!isActive) return null;

  return (
    <motion.div
      animate={{
        x: [0, -2 * intensity, 2 * intensity, -1 * intensity, 1 * intensity, 0],
        y: [0, 1 * intensity, -1 * intensity, 2 * intensity, -2 * intensity, 0]
      }}
      transition={{
        duration: 0.5,
        ease: "easeInOut"
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9998
      }}
    />
  );
};