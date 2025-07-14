// Effect Manager - Handles all visual effects coordination
import { CustomEventEmitter } from './EventEmitter.js';

export class EffectManager extends CustomEventEmitter {
  constructor(engineState, performanceOptimizer) {
    super();
    
    this.state = engineState;
    this.performanceOptimizer = performanceOptimizer;
    
    this.effects = {
      floatingScores: new Map(),
      explosions: new Map(),
      patterns: new Map(),
      bonuses: new Map(),
      screenEffects: new Map(),
      achievements: new Map(),
      levelUps: new Map(),
      streaks: new Map(),
      upgrades: new Map()
    };
    
    this.cleanupInterval = null;
    this.isActive = false;
  }
  
  startEffectSystem() {
    this.isActive = true;
    this.cleanupInterval = setInterval(() => {
      this.cleanupEffects();
    }, 1000);
  }
  
  // Add floating score effect
  addFloatingScore(score, speed, combo, patterns) {
    const id = Date.now() + Math.random();
    const effect = {
      id,
      score,
      speed,
      combo,
      patterns,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: this.getSpeedColor(speed),
      createdAt: Date.now()
    };
    
    this.effects.floatingScores.set(id, effect);
    this.state.addFloatingScore(effect);
    this.emit('floatingScore', effect);
    
    return id;
  }
  
  // Add character explosion effect
  addCharacterExplosion(char, isCorrect, speed, combo, patterns) {
    const id = Date.now() + Math.random();
    const effect = {
      id,
      char,
      isCorrect,
      speed,
      combo,
      patterns,
      x: Math.random() * 100,
      y: Math.random() * 100,
      createdAt: Date.now()
    };
    
    this.effects.explosions.set(id, effect);
    this.state.addExplosion(effect);
    this.emit('explosion', effect);
    
    return id;
  }
  
  // Celebrate pattern match
  celebratePattern(pattern) {
    const id = Date.now() + Math.random();
    const effect = {
      ...pattern,
      id,
      createdAt: Date.now()
    };
    
    this.effects.patterns.set(id, effect);
    this.state.addPatternMatch(effect);
    this.emit('pattern', effect);
    
    return id;
  }
  
  // Add bonus effect
  addBonusEffect(type, intensity) {
    const id = Date.now() + Math.random();
    const effect = {
      id,
      type,
      intensity,
      createdAt: Date.now()
    };
    
    this.effects.bonuses.set(id, effect);
    this.state.addBonusEffect(effect);
    this.emit('bonus', effect);
    
    return id;
  }
  
  // Trigger confetti celebration
  triggerConfetti(combo) {
    if (typeof window !== 'undefined' && window.confetti) {
      const colors = this.getComboColors(combo);
      window.confetti({
        particleCount: Math.min(combo * 2, 100),
        spread: 70,
        origin: { y: 0.6 },
        colors
      });
    }
  }
  
  // Upgrade character
  upgradeCharacter(index, speed, combo) {
    const currentUpgrade = this.state.getCharacterUpgrade(index);
    const newLevel = Math.min(currentUpgrade.level + 1, 5);
    
    const upgrade = {
      level: newLevel,
      speed,
      combo,
      timestamp: Date.now()
    };
    
    this.state.updateCharacterUpgrade(index, upgrade);
    
    const id = Date.now() + Math.random();
    const effect = {
      id,
      index,
      upgrade,
      createdAt: Date.now()
    };
    
    this.effects.upgrades.set(id, effect);
    this.emit('upgrade', effect);
    
    return id;
  }
  
  // Unlock achievement
  unlockAchievement(achievement) {
    const id = Date.now() + Math.random();
    const effect = {
      id,
      achievement,
      createdAt: Date.now()
    };
    
    this.effects.achievements.set(id, effect);
    this.emit('achievement', effect);
    
    return id;
  }
  
  // Celebrate level up
  celebrateLevelUp(oldLevel, newLevel) {
    const id = Date.now() + Math.random();
    const effect = {
      id,
      oldLevel,
      newLevel,
      createdAt: Date.now()
    };
    
    this.effects.levelUps.set(id, effect);
    this.emit('levelUp', effect);
    
    return id;
  }
  
  // Helper methods
  getSpeedColor(speed) {
    const colors = {
      perfect: '#ff6b6b',
      best: '#ffd93d',
      good: '#4ecdc4',
      lame: '#00ff00'
    };
    return colors[speed] || colors.lame;
  }
  
  getComboColors(combo) {
    if (combo >= 50) return ['#ff6b6b', '#ff8e8e', '#ffb3b3'];
    if (combo >= 30) return ['#ffd93d', '#ffed4e', '#fff176'];
    if (combo >= 20) return ['#6bcf7f', '#7dd87f', '#8ee68f'];
    if (combo >= 10) return ['#4ecdc4', '#5ed9d1', '#80deea'];
    return ['#45b7d1', '#5bc3d7', '#80deea'];
  }
  
  // Cleanup expired effects
  cleanupEffects() {
    const now = Date.now();
    const maxAge = {
      floatingScores: 3000,
      explosions: 2000,
      patterns: 4000,
      bonuses: 1500,
      screenEffects: 1000,
      achievements: 6000,
      levelUps: 8000,
      streaks: 5000,
      upgrades: 3000
    };
    
    Object.keys(this.effects).forEach(type => {
      const effects = this.effects[type];
      const age = maxAge[type];
      
      effects.forEach((effect, id) => {
        if (now - effect.createdAt > age) {
          effects.delete(id);
          this.emit('effectExpired', { type, id, effect });
        }
      });
    });
    
    // Cleanup state effects
    this.state.cleanupFloatingScores();
    this.state.cleanupExplosions();
    this.state.cleanupPatternMatches();
    this.state.cleanupBonusEffects();
  }
  
  // Get effect statistics
  getEffectStats() {
    const stats = {};
    Object.keys(this.effects).forEach(type => {
      stats[type] = this.effects[type].size;
    });
    return stats;
  }
  
  // Clear all effects
  clear() {
    Object.keys(this.effects).forEach(type => {
      this.effects[type].clear();
    });
    
    this.emit('cleared');
  }
  
  // Destroy effect manager
  destroy() {
    this.isActive = false;
    
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    
    this.clear();
    this.removeAllListeners();
  }
}