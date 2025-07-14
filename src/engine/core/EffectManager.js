// Effect Manager - Performance-optimized visual effects
import { CustomEventEmitter } from './EventEmitter.js';

export class EffectManager extends CustomEventEmitter {
  constructor(engineState, performanceOptimizer) {
    super();
    this.state = engineState;
    this.performanceOptimizer = performanceOptimizer;
    this.cleanupInterval = null;
    this.effectQueue = [];
    this.isProcessingQueue = false;
    this.lastEffectTime = new Map(); // Throttling
  }

  startEffectSystem() {
    this.cleanupInterval = setInterval(() => {
      this.cleanupEffects();
      this.processEffectQueue();
    }, 100); // More frequent cleanup for responsiveness
  }

  stopEffectSystem() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  // Smart effect throttling
  shouldThrottleEffect(type) {
    const now = performance.now();
    const lastTime = this.lastEffectTime.get(type) || 0;
    const throttleTime = {
      floatingScore: 50,   // Max 20 per second
      explosion: 30,       // Max 33 per second
      bonusEffect: 100,    // Max 10 per second
      confetti: 200,       // Max 5 per second
      screenFlash: 500     // Max 2 per second
    }[type] || 50;
    
    if (now - lastTime < throttleTime) {
      return true; // Should throttle
    }
    
    this.lastEffectTime.set(type, now);
    return false;
  }

  // Queue effects for batch processing
  queueEffect(effectData) {
    if (this.shouldThrottleEffect(effectData.type)) {
      return false;
    }
    
    this.effectQueue.push(effectData);
    
    // Process immediately if queue is small
    if (this.effectQueue.length < 3 && !this.isProcessingQueue) {
      this.processEffectQueue();
    }
    
    return true;
  }

  // Process effect queue with performance consideration
  processEffectQueue() {
    if (this.isProcessingQueue || this.effectQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    const settings = this.performanceOptimizer.getAnimationSettings();
    const maxProcessPerFrame = settings.reducedMotion ? 2 : 5;
    
    // Process effects in batches
    const batch = this.effectQueue.splice(0, maxProcessPerFrame);
    
    batch.forEach(effectData => {
      this.createEffectImmediate(effectData);
    });
    
    this.isProcessingQueue = false;
    
    // Continue processing if queue has more items
    if (this.effectQueue.length > 0) {
      requestAnimationFrame(() => this.processEffectQueue());
    }
  }

  // Create effect immediately with performance scaling
  createEffectImmediate(effectData) {
    const scale = this.performanceOptimizer.getEffectScale();
    const settings = this.performanceOptimizer.getAnimationSettings();
    
    // Scale effect intensity
    effectData.intensity = (effectData.intensity || 1) * scale;
    effectData.duration = (effectData.duration || 1000) * settings.animationDuration;
    effectData.particleCount = Math.round((effectData.particleCount || 10) * settings.particleCount);
    
    // Skip complex effects in low performance mode
    if (!settings.complexEffects && effectData.complexity === 'high') {
      return false;
    }
    
    if (this.performanceOptimizer.addEffect(effectData)) {
      this.emit(effectData.type, effectData);
      return true;
    }
    
    return false;
  }

  // Add floating score effect with smart scaling
  addFloatingScore(score, speed, combo, patterns) {
    const priority = combo >= 20 ? 'high' : combo >= 10 ? 'normal' : 'low';
    
    return this.queueEffect({
      type: 'floatingScore',
      id: Date.now() + Math.random(),
      score,
      speed,
      combo,
      patterns,
      x: Math.random() * 200,
      y: Math.random() * 50,
      color: this.getPerformanceColor(speed).glow,
      priority,
      complexity: 'medium',
      createdAt: Date.now()
    });
  }

  // Add character explosion with performance scaling
  addCharacterExplosion(char, isCorrect, speed, combo, patterns) {
    const priority = isCorrect ? (combo >= 15 ? 'high' : 'normal') : 'critical';
    
    return this.queueEffect({
      type: 'explosion',
      id: Date.now() + Math.random(),
      char,
      x: this.state.getCurrentIndex() * 20,
      y: 0,
      isCorrect,
      speed,
      combo,
      patterns,
      priority,
      complexity: patterns > 0 ? 'high' : 'medium',
      createdAt: Date.now()
    });
  }

  // Add bonus effect with throttling
  addBonusEffect(type, intensity, data = null) {
    return this.queueEffect({
      type: 'bonusEffect',
      id: Date.now() + Math.random(),
      effectType: type,
      intensity,
      data,
      priority: 'normal',
      complexity: 'low',
      createdAt: Date.now()
    });
  }

  // Optimized confetti with performance scaling
  triggerConfetti(combo) {
    if (!this.performanceOptimizer.shouldCreateEffect('confetti', 'high')) {
      return false;
    }
    
    if (typeof window !== 'undefined' && window.confetti) {
      const settings = this.performanceOptimizer.getAnimationSettings();
      const particleCount = Math.round(Math.min(combo, 100) * settings.particleCount);
      
      if (particleCount < 5) return false; // Skip if too few particles
      
      const colors = combo >= 50 ? ['#ff6b6b'] : 
                   combo >= 30 ? ['#ffd93d'] :
                   combo >= 20 ? ['#6bcf7f'] :
                   ['#4ecdc4'];

      // Use requestAnimationFrame for smooth confetti
      requestAnimationFrame(() => {
        window.confetti({
          particleCount,
          spread: 45,
          origin: { y: 0.7 },
          colors,
          disableForReducedMotion: settings.reducedMotion
        });
      });

      this.emit('confetti', { combo, colors, particleCount });
      return true;
    }
    
    return false;
  }

  // Throttled screen flash
  triggerScreenFlash(type = 'success', intensity = 1) {
    if (this.shouldThrottleEffect('screenFlash')) {
      return false;
    }
    
    const scaledIntensity = intensity * this.performanceOptimizer.getEffectScale();
    this.emit('screenFlash', { type, intensity: scaledIntensity });
    return true;
  }

  // Optimized character upgrade
  upgradeCharacter(index, speed, currentCombo) {
    const currentUpgrade = this.state.getCharacterUpgrade(index);
    
    let newLevel = currentUpgrade.level;
    if (speed === 'perfect' && currentCombo >= 10) newLevel = Math.max(newLevel, 3);
    else if (speed === 'best' && currentCombo >= 5) newLevel = Math.max(newLevel, 2);
    else if (speed === 'good') newLevel = Math.max(newLevel, 1);

    if (newLevel > currentUpgrade.level) {
      const upgrade = { level: newLevel, speed };
      this.state.updateCharacterUpgrade(index, upgrade);
      
      // Queue upgrade effect
      this.queueEffect({
        type: 'characterUpgrade',
        id: Date.now() + Math.random(),
        index,
        upgrade,
        char: this.getCharacterAtIndex(index),
        priority: 'normal',
        complexity: 'high',
        createdAt: Date.now()
      });
      
      return true;
    }
    
    return false;
  }

  // Pattern celebration with performance consideration
  celebratePattern(pattern) {
    const priority = pattern.bonus >= 200 ? 'high' : 'normal';
    
    return this.queueEffect({
      type: 'patternCelebration',
      id: Date.now() + Math.random(),
      pattern,
      priority,
      complexity: 'medium',
      createdAt: Date.now()
    });
  }

  // Achievement unlock with high priority
  unlockAchievement(achievement) {
    return this.queueEffect({
      type: 'achievementUnlock',
      id: Date.now() + Math.random(),
      achievement,
      priority: 'critical',
      complexity: 'high',
      createdAt: Date.now()
    });
  }

  // Level up celebration with maximum priority
  celebrateLevelUp(oldLevel, newLevel) {
    return this.queueEffect({
      type: 'levelUpCelebration',
      id: Date.now() + Math.random(),
      oldLevel,
      newLevel,
      priority: 'critical',
      complexity: 'high',
      createdAt: Date.now()
    });
  }

  // Aggressive cleanup for performance
  cleanupEffects() {
    const now = performance.now();
    const mode = this.performanceOptimizer.getCurrentEffectiveMode();
    
    // More aggressive cleanup in low performance
    const maxAge = {
      high: 3000,
      medium: 2000,
      low: 1000,
      emergency: 500
    }[mode] || 2000;
    
    this.state.cleanupFloatingScores();
    this.state.cleanupExplosions();
    this.state.cleanupPatternMatches();
    this.state.cleanupBonusEffects();
    
    // Clear effect queue if performance is poor
    if (mode === 'low' || mode === 'emergency') {
      const criticalEffects = this.effectQueue.filter(e => e.priority === 'critical');
      this.effectQueue = criticalEffects;
    }
    
    // Clear throttling history
    this.lastEffectTime.forEach((time, type) => {
      if (now - time > 5000) {
        this.lastEffectTime.delete(type);
      }
    });
    
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

  // Get effect statistics with performance info
  getEffectStats() {
    return {
      floatingScores: this.state.state.floatingScores.length,
      explosions: this.state.state.explosions.length,
      patternMatches: this.state.state.patternMatches.length,
      bonusEffects: this.state.state.bonusEffects.length,
      queueLength: this.effectQueue.length,
      throttledTypes: this.lastEffectTime.size,
      performance: this.performanceOptimizer.getStats()
    };
  }

  destroy() {
    this.stopEffectSystem();
    this.effectQueue = [];
    this.lastEffectTime.clear();
    this.removeAllListeners();
  }
}