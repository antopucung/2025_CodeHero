// Design System - Color Tokens
export const colors = {
  // Base colors
  primary: {
    50: '#e6fffa',
    100: '#b3fff0',
    200: '#80ffe6',
    300: '#4dffdc',
    400: '#1affd2',
    500: '#00ff00', // Main green
    600: '#00e600',
    700: '#00cc00',
    800: '#00b300',
    900: '#009900'
  },
  
  // Terminal colors
  terminal: {
    bg: '#000000',
    surface: '#111111',
    border: '#333333',
    text: '#00ff00',
    textSecondary: '#666666',
    textMuted: '#888888'
  },
  
  // Performance colors
  performance: {
    perfect: {
      primary: '#ff6b6b',
      secondary: '#ff8e8e',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 25%, #ffb3b3 50%, #ff8e8e 75%, #ff6b6b 100%)',
      glow: '#ff6b6b',
      shadow: '0 0 40px #ff6b6b, 0 0 20px #ff8e8e, inset 0 0 20px rgba(255, 107, 107, 0.4)'
    },
    best: {
      primary: '#ffd93d',
      secondary: '#ffed4e',
      gradient: 'linear-gradient(135deg, #ffd93d 0%, #ffed4e 25%, #fff176 50%, #ffed4e 75%, #ffd93d 100%)',
      glow: '#ffd93d',
      shadow: '0 0 35px #ffd93d, 0 0 15px #ffc107, inset 0 0 15px rgba(255, 217, 61, 0.4)'
    },
    good: {
      primary: '#4ecdc4',
      secondary: '#5ed9d1',
      gradient: 'linear-gradient(135deg, #4ecdc4 0%, #5ed9d1 25%, #80deea 50%, #5ed9d1 75%, #4ecdc4 100%)',
      glow: '#4ecdc4',
      shadow: '0 0 30px #4ecdc4, 0 0 12px #00bcd4, inset 0 0 12px rgba(78, 205, 196, 0.3)'
    },
    lame: {
      primary: '#00e676',
      secondary: '#00ff00',
      gradient: 'linear-gradient(135deg, #00e676 0%, #00ff00 25%, #69f0ae 50%, #00ff00 75%, #00e676 100%)',
      glow: '#00ff00',
      shadow: '0 0 20px #00ff00, 0 0 8px #00e676, inset 0 0 8px rgba(0, 255, 0, 0.3)'
    },
    error: {
      primary: '#ff1744',
      secondary: '#ff4569',
      gradient: 'linear-gradient(45deg, #ff1744, #ff4569, #ff1744)',
      glow: '#ff1744',
      shadow: '0 0 30px #ff1744, inset 0 0 20px rgba(255, 23, 68, 0.4)'
    }
  },
  
  // Combo colors
  combo: {
    basic: '#45b7d1',
    double: '#4ecdc4',
    triple: '#6bcf7f',
    perfect: '#ffd93d',
    god: '#ff6b6b',
    legendary: '#ff1744'
  },
  
  // Achievement colors
  achievement: {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    platinum: '#e5e4e2',
    diamond: '#b9f2ff'
  }
};

export const getPerformanceColor = (speed) => {
  return colors.performance[speed] || colors.performance.lame;
};

export const getComboColor = (combo) => {
  if (combo >= 50) return colors.combo.legendary;
  if (combo >= 30) return colors.combo.god;
  if (combo >= 20) return colors.combo.perfect;
  if (combo >= 10) return colors.combo.triple;
  if (combo >= 5) return colors.combo.double;
  return colors.combo.basic;
};