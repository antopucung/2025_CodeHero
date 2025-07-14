// Effect Manager - Handles visual effects and animations
import { CustomEventEmitter } from './TypingEngine.js';

export class EffectManager extends CustomEventEmitter {
  constructor(engineState, performanceOptimizer) {
    super();
    this.state = engineState;
    this.performanceOptimizer = performanceOptimizer;
    this.cleanupInterval = null;
  }

  startEffectSystem() {
    this.cleanupInterval = setInterval(() => {
      this.cleanupEffects();
    }, 500);
  }

  stopEffectSystem() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  // Add floating score effect
  addFloatingScore(score, speed, combo, patterns) {
    if (!this.performanceOptimizer.shouldCreateEffect('floatingScore')) {
      return false;
    }

    const effect = {
      id: Date.now() + Math.random(),
      score,
      speed,
      combo,
      patterns,
      x: Math.random() * 200,
      y: Math.random() * 50,
      color: this.getPerformanceColor(speed).glow,
      createdAt: Date.now()
    };

    this.state.addFloatingScore(effect);
    this.emit('floatingScore', effect);
    return true;
  }

  // Add character explosion effect
  addCharacterExplosion(char, isCorrect, speed, combo, patterns) {
    if (!this.performanceOptimizer.shouldCreateEffect('explosion')) {
      return false;
    }

    const effect = {
      id: Date.now() + Math.random(),
      char,
      x: this.state.getCurrentIndex() * 20,
      y: 0,
      isCorrect,
      speed,
      combo,
      patterns,
      createdAt: Date.now()
    };

    this.state.addExplosion(effect);
    this.emit('explosion', effect);
    return true;
  }

  // Add bonus effect
  addBonusEffect(type, intensity, data = null) {
    if (!this.performanceOptimizer.shouldCreateEffect('bonusEffect')) {
      return false;
    }

    const effect = {
      id: Date.now() + Math.random(),
      type,
      intensity,
      data,
      createdAt: Date.now()
    };

    this.state.addBonusEffect(effect);
    this.emit('bonusEffect', effect);
    return true;
  }

  // Trigger confetti celebrations
  triggerConfetti(combo) {
    if (typeof window !== 'undefined' && window.confetti) {
      const colors = combo >= 50 ? ['#ff6b6b'] : 
                   combo >= 30 ? ['#ffd93d'] :
                   combo >= 20 ? ['#6bcf7f'] :
                   ['#4ecdc4'];

      window.confetti({
        particleCount: Math.min(combo, 100),
        spread: 45,
        origin: { y: 0.7 },
        colors
      });

      this.emit('confetti', { combo, colors });
    }
  }

  // Screen flash effect
  triggerScreenFlash(type = 'success', intensity = 1) {
    this.emit('screenFlash', { type, intensity });
  }

  // Character upgrade effect
  upgradeCharacter(index, speed, currentCombo) {
    const currentUpgrade = this.state.getCharacterUpgrade(index);
    
    let newLevel = currentUpgrade.level;
    if (speed === 'perfect' && currentCombo >= 10) newLevel = Math.max(newLevel, 3);
    else if (speed === 'best' && currentCombo >= 5) newLevel = Math.max(newLevel, 2);
    else if (speed === 'good') newLevel = Math.max(newLevel, 1);

    if (newLevel > currentUpgrade.level) {
      const upgrade = { level: newLevel, speed };
      this.state.updateCharacterUpgrade(index, upgrade);
      
      this.emit('characterUpgrade', {
        index,
        upgrade,
        char: this.getCharacterAtIndex(index)
      });
      
      return true;
    }
    
    return false;
  }

  // Pattern celebration
  celebratePattern(pattern) {
    this.emit('patternCelebration', pattern);
  }

  // Achievement unlock
  unlockAchievement(achievement) {
    this.emit('achievementUnlock', achievement);
  }

  // Level up celebration
  celebrateLevelUp(oldLevel, newLevel) {
    this.emit('levelUpCelebration', { oldLevel, newLevel });
  }

  // Cleanup expired effects
  cleanupEffects() {
    this.state.cleanupFloatingScores();
    this.state.cleanupExplosions();
    this.state.cleanupPatternMatches();
    this.state.cleanupBonusEffects();
    
    this.emit('effectsCleanup');
  }

  // Helper methods
  getPerformanceColor(speed) {
    const colors = {
      perfect: { glow: '#ff6b6b' },
      best: { glow: '#ffd93d' },
      good: { glow: '#4ecdc4' },
      lame: { glow: '#00ff00' },
      error: { glow: '#ff1744' }
    };
    
    return colors[speed] || colors.lame;
  }

  getCharacterAtIndex(index) {
    // This would need to be provided by the typing processor
    return '?'; // Placeholder
  }

  // Get effect statistics
  getEffectStats() {
    return {
      floatingScores: this.state.state.floatingScores.length,
      explosions: this.state.state.explosions.length,
      patternMatches: this.state.state.patternMatches.length,
      bonusEffects: this.state.state.bonusEffects.length,
      performance: this.performanceOptimizer.getStats()
    };
  }

  destroy() {
    this.stopEffectSystem();
    this.removeAllListeners();
  }
}