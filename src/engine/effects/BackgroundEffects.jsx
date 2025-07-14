import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Background wave effect
export const BackgroundWaveEffect = ({ isActive, intensity = 1, combo = 1, anticipationLevel = 1, typingSpeed = 'lame' }) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    
    // Reduce animation frequency for performance
    const updateInterval = intensity < 0.5 ? 100 : 50;
    
    const interval = setInterval(() => {
      setTime(prev => prev + (0.08 * anticipationLevel));
    }, updateInterval);
    
    return () => clearInterval(interval);
  }, [isActive, anticipationLevel, intensity]);

  if (!isActive) return null;

  const getGradient = (combo, time, anticipationLevel, typingSpeed) => {
    const baseOpacity = Math.min(0.15 * intensity * anticipationLevel, 0.3);
    const pulseOpacity = baseOpacity + Math.sin(time * 3) * 0.05;
    
    // Anticipation-based background colors
    const anticipationColors = {
      perfect: ['255, 107, 107', '255, 20, 147'],
      best: ['255, 217, 61', '255, 193, 7'],
      good: ['78, 205, 196', '0, 188, 212'],
      lame: ['0, 255, 0', '0, 255, 255']
    };
    
    const [color1, color2] = anticipationColors[typingSpeed] || anticipationColors.lame;
    
    // Simplified gradients for better performance
    if (combo >= 50) {
      return `
        radial-gradient(circle at ${50 + Math.sin(time) * 10}% ${50 + Math.cos(time) * 10}%, 
          rgba(${color1}, ${pulseOpacity * 1.5}) 0%, 
          transparent 70%)
      `;
    } else if (combo >= 30) {
      return `
        radial-gradient(circle at ${50 + Math.sin(time) * 8}% ${50 + Math.cos(time) * 8}%, 
          rgba(${color1}, ${pulseOpacity * 1.2}) 0%, 
          transparent 80%),
      `;
    }
    
    return `
      radial-gradient(circle at ${50 + Math.sin(time * 0.5) * 5}% ${50 + Math.cos(time * 0.5) * 5}%, 
        rgba(${color1}, ${pulseOpacity}) 0%, 
        transparent 90%)
    `;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: getGradient(combo, time, anticipationLevel, typingSpeed),
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  );
};

// Screen flash effect for major achievements and errors
export const ScreenFlashEffect = ({ isActive, type = 'success', intensity = 1, onComplete }) => {
  if (!isActive) return null;

  const getFlashColor = (type) => {
    const colors = {
      success: 'rgba(0, 255, 0, 0.3)',
      achievement: 'rgba(255, 215, 0, 0.4)',
      combo: 'rgba(255, 107, 107, 0.3)',
      perfect: 'rgba(0, 255, 255, 0.3)',
      error: 'rgba(255, 0, 0, 0.4)'
    };
    return colors[type] || colors.success;
  };

  const flashColor = getFlashColor(type);
  const duration = type === 'error' ? 0.3 : 0.5;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: [0, intensity, 0],
        scale: [1, 1.02, 1]
      }}
      transition={{ 
        duration: duration,
        ease: "easeInOut"
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: flashColor,
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  );
};