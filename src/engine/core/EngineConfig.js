// Engine Configuration Constants
export const ENGINE_CONFIG = {
  speedThresholds: {
    perfect: 120,
    best: 180,
    good: 250,
    lame: 999
  },
  
  comboThresholds: {
    basic: 1,
    double: 5,
    triple: 10,
    perfect: 20,
    god: 30,
    legendary: 50
  },
  
  scoring: {
    baseScore: 15,
    speedBonus: {
      perfect: 50,
      best: 30,
      good: 20,
      lame: 10
    },
    speedMultiplier: {
      perfect: 2,
      best: 1.5,
      good: 1.2,
      lame: 1
    }
  },
  
  performance: {
    updateInterval: 100,
    cleanupInterval: 500,
    effectLimits: {
      high: { particles: 50, effects: 25, animations: 30 },
      medium: { particles: 25, effects: 15, animations: 20 },
      low: { particles: 10, effects: 8, animations: 10 }
    }
  },
  
  ui: {
    blockDimensions: {
      width: 20,
      height: 26,
      margin: 2
    },
    fonts: {
      base: 14,
      large: 16
    }
  }
};

export const PATTERN_DEFINITIONS = {
  perfect_streak: { icon: '⚡', name: 'LIGHTNING FAST', bonus: 75 },
  function_declaration: { icon: '🔧', name: 'CODE WIZARD', bonus: 150 },
  advanced_syntax: { icon: '🎓', name: 'SYNTAX MASTER', bonus: 200 },
  module_syntax: { icon: '📦', name: 'MODULE EXPERT', bonus: 175 },
  bracket_combo: { icon: '🎯', name: 'BRACKET MASTER', bonus: 125 },
  speed_consistency: { icon: '🚀', name: 'UNSTOPPABLE', bonus: 100 },
  line_completion: { icon: '✅', name: 'CLEAN CODE', bonus: 90 },
  string_mastery: { icon: '📝', name: 'STRING NINJA', bonus: 110 },
  arrow_function: { icon: '🏹', name: 'ARROW MASTER', bonus: 140 },
  combo_milestone: { icon: '🔥', name: 'ON FIRE', bonus: 15 },
  flawless_execution: { icon: '💎', name: 'FLAWLESS', bonus: 250 }
};

export const ACHIEVEMENT_DEFINITIONS = {
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
  speed_racer: { 
    icon: '🏎️', 
    title: 'SPEED RACER', 
    desc: 'Achieved 60+ WPM!',
    color: '#4ecdc4',
    rarity: 'EPIC'
  },
  high_scorer: { 
    icon: '🎯', 
    title: 'HIGH SCORER', 
    desc: 'Scored 5000+ points!',
    color: '#ff6b6b',
    rarity: 'RARE'
  }
};