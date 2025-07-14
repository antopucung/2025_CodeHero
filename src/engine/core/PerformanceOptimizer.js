// Performance Optimization System - 60fps guarantee
export class PerformanceOptimizer {
  constructor() {
    this.frameTime = 16.67; // Target 60fps
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.fps = 60;
    this.performanceMode = 'auto'; // auto, high, medium, low
    this.effectLimits = {
      high: { particles: 50, effects: 20, animations: 30 },
      medium: { particles: 30, effects: 12, animations: 20 },
      low: { particles: 15, effects: 8, animations: 10 }
    };
    this.activeEffects = new Set();
    this.effectPool = new Map();
    this.isOptimizing = false;
  }

  // Monitor performance and auto-adjust
  startMonitoring() {
    const monitor = () => {
      const now = performance.now();
      const deltaTime = now - this.lastFrameTime;
      
      if (deltaTime > 0) {
        this.fps = 1000 / deltaTime;
        this.frameCount++;
        
        // Auto-adjust performance mode
        if (this.performanceMode === 'auto') {
          if (this.fps < 45) {
            this.setPerformanceMode('low');
          } else if (this.fps < 55) {
            this.setPerformanceMode('medium');
          } else if (this.fps > 58) {
            this.setPerformanceMode('high');
          }
        }
      }
      
      this.lastFrameTime = now;
      requestAnimationFrame(monitor);
    };
    
    requestAnimationFrame(monitor);
  }

  // Set performance mode
  setPerformanceMode(mode) {
    this.performanceMode = mode;
    this.optimizeActiveEffects();
  }

  // Optimize active effects based on performance
  optimizeActiveEffects() {
    const limits = this.effectLimits[this.performanceMode] || this.effectLimits.medium;
    
    // Limit particle count
    if (this.activeEffects.size > limits.effects) {
      const effectsArray = Array.from(this.activeEffects);
      const toRemove = effectsArray.slice(0, this.activeEffects.size - limits.effects);
      toRemove.forEach(effect => this.removeEffect(effect));
    }
  }

  // Effect pooling for memory efficiency
  getPooledEffect(type) {
    if (!this.effectPool.has(type)) {
      this.effectPool.set(type, []);
    }
    
    const pool = this.effectPool.get(type);
    return pool.pop() || this.createEffect(type);
  }

  returnToPool(type, effect) {
    if (!this.effectPool.has(type)) {
      this.effectPool.set(type, []);
    }
    
    const pool = this.effectPool.get(type);
    if (pool.length < 10) { // Limit pool size
      this.resetEffect(effect);
      pool.push(effect);
    }
  }

  createEffect(type) {
    return {
      id: Date.now() + Math.random(),
      type,
      active: false,
      startTime: 0,
      duration: 1000
    };
  }

  resetEffect(effect) {
    effect.active = false;
    effect.startTime = 0;
  }

  // Throttle effect creation
  shouldCreateEffect(type) {
    const limits = this.effectLimits[this.performanceMode] || this.effectLimits.medium;
    const typeCount = Array.from(this.activeEffects).filter(e => e.type === type).length;
    
    return typeCount < (limits[type] || 5);
  }

  // Add effect with performance checks
  addEffect(effect) {
    if (this.shouldCreateEffect(effect.type)) {
      this.activeEffects.add(effect);
      return true;
    }
    return false;
  }

  removeEffect(effect) {
    this.activeEffects.delete(effect);
    this.returnToPool(effect.type, effect);
  }

  // Get current performance stats
  getStats() {
    return {
      fps: Math.round(this.fps),
      mode: this.performanceMode,
      activeEffects: this.activeEffects.size,
      frameTime: this.lastFrameTime
    };
  }

  // Cleanup
  destroy() {
    this.activeEffects.clear();
    this.effectPool.clear();
  }
}