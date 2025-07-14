// Design System - Animation Tokens
export const animations = {
  // Duration tokens
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
    slowest: 1.2
  },
  
  // Easing tokens
  easing: {
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  
  // Animation presets
  presets: {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3 }
    },
    
    scaleIn: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { duration: 0.3, type: 'spring', stiffness: 300 }
    },
    
    slideUp: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.3 }
    },
    
    pulse: (intensity = 1) => ({
      animate: {
        scale: [1, 1 + (0.1 * intensity), 1]
      },
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }),
    
    glow: (color, intensity = 1) => ({
      animate: {
        boxShadow: [
          `0 0 10px ${color}`,
          `0 0 ${30 * intensity}px ${color}`,
          `0 0 10px ${color}`
        ]
      },
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    })
  }
};

export const createPulseAnimation = (intensity = 1, speed = 1) => ({
  animate: {
    scale: [1, 1 + (0.1 * intensity), 1]
  },
  transition: {
    duration: Math.max(0.1, 0.6 / speed),
    repeat: Infinity,
    ease: 'easeInOut'
  }
});

export const createGlowAnimation = (color, intensity = 1, speed = 1) => ({
  animate: {
    boxShadow: [
      `0 0 10px ${color}`,
      `0 0 ${30 * intensity}px ${color}`,
      `0 0 10px ${color}`
    ]
  },
  transition: {
    duration: Math.max(0.1, 1 / speed),
    repeat: Infinity,
    ease: 'easeInOut'
  }
});