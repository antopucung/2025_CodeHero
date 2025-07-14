// Performance Optimization System - Enhanced 60fps guarantee with effect scaling
export class PerformanceOptimizer {
  constructor() {
    this.frameTime = 16.67; // Target 60fps
    this.lastFrameTime = 0;
    this.frameCount = 0;
    this.fps = 60;
    this.performanceMode = 'auto'; // auto, high, medium, low
    this.effectLimits = {
      high: { 
        particles: 50, 
        effects: 25, 
        animations: 30,
        floatingScores: 8,
        explosions: 6,
        comboBursts: 4,
        backgroundEffects: true,
        complexAnimations: true
      },
      medium: { 
        particles: 25, 
        effects: 15, 
        animations: 20,
        floatingScores: 5,
        explosions: 4,
        comboBursts: 2,
        backgroundEffects: true,
        complexAnimations: false
      },
      low: { 
        particles: 10, 
        effects: 8, 
        animations: 10,
        floatingScores: 3,
        explosions: 2,
        comboBursts: 1,
        backgroundEffects: false,
        complexAnimations: false
      }
    };
    this.activeEffects = new Map();
    this.effectPool = new Map();
    this.frameDropCount = 0;
    this.performanceHistory = [];
    this.adaptiveThresholds = {
      downgrade: 45, // FPS below this triggers downgrade
      upgrade: 58,   // FPS above this allows upgrade
      emergency: 30  // Emergency mode below this
    };
  }

  // Enhanced monitoring with adaptive thresholds
  startMonitoring() {
    const monitor = () => {
      const now = performance.now();
      const deltaTime = now - this.lastFrameTime;
      
      if (deltaTime > 0) {
        this.fps = Math.min(1000 / deltaTime, 60);
        this.frameCount++;
        
        // Track performance history
        this.performanceHistory.push(this.fps);
        if (this.performanceHistory.length > 30) {
          this.performanceHistory.shift();
        }
        
        // Count frame drops
        if (this.fps < 50) {
          this.frameDropCount++;
        } else {
          this.frameDropCount = Math.max(0, this.frameDropCount - 1);
        }
        
        // Auto-adjust performance mode with hysteresis
        if (this.performanceMode === 'auto') {
          this.adaptPerformanceMode();
        }
      }
      
      this.lastFrameTime = now;
      requestAnimationFrame(monitor);
    };
    
    requestAnimationFrame(monitor);
  }

  // Adaptive performance mode with smart thresholds
  adaptPerformanceMode() {
    const avgFps = this.getAverageFPS();
    const currentMode = this.getCurrentEffectiveMode();
    
    // Emergency mode for severe performance issues
    if (avgFps < this.adaptiveThresholds.emergency) {
      this.setPerformanceMode('emergency');
      return;
    }
    
    // Downgrade if performance is poor
    if (avgFps < this.adaptiveThresholds.downgrade && this.frameDropCount > 5) {
      if (currentMode === 'high') {
        this.setPerformanceMode('medium');
      } else if (currentMode === 'medium') {
        this.setPerformanceMode('low');
      }
      this.frameDropCount = 0;
    }
    
    // Upgrade if performance is good and stable
    if (avgFps > this.adaptiveThresholds.upgrade && this.frameDropCount === 0) {
      if (currentMode === 'low' && this.isPerformanceStable()) {
        this.setPerformanceMode('medium');
      } else if (currentMode === 'medium' && this.isPerformanceStable()) {
        this.setPerformanceMode('high');
      }
    }
  }

  // Check if performance is stable
  isPerformanceStable() {
    if (this.performanceHistory.length < 20) return false;
    
    const recent = this.performanceHistory.slice(-20);
    const variance = this.calculateVariance(recent);
    return variance < 25; // Low variance indicates stability
  }

  calculateVariance(values) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  getAverageFPS() {
    if (this.performanceHistory.length === 0) return 60;
    const recent = this.performanceHistory.slice(-10);
    return recent.reduce((a, b) => a + b, 0) / recent.length;
  }

  getCurrentEffectiveMode() {
    if (this.performanceMode === 'auto') {
      const avgFps = this.getAverageFPS();
      if (avgFps < 35) return 'low';
      if (avgFps < 50) return 'medium';
      return 'high';
    }
    return this.performanceMode;
  }

  // Enhanced effect limiting with smart scaling
  shouldCreateEffect(type, priority = 'normal') {
    const mode = this.getCurrentEffectiveMode();
    const limits = this.effectLimits[mode] || this.effectLimits.medium;
    
    // Emergency mode - only critical effects
    if (mode === 'emergency') {
      return priority === 'critical' && Math.random() < 0.3;
    }
    
    // Check specific effect limits
    const currentCount = this.getEffectCount(type);
    const limit = limits[type] || limits.effects;
    
    // Priority-based scaling
    const priorityMultiplier = {
      critical: 1.0,
      high: 0.8,
      normal: 0.6,
      low: 0.3
    }[priority] || 0.6;
    
    return currentCount < (limit * priorityMultiplier);
  }

  getEffectCount(type) {
    let count = 0;
    this.activeEffects.forEach(effect => {
      if (effect.type === type) count++;
    });
    return count;
  }

  // Smart effect scaling based on performance
  getEffectScale(baseIntensity = 1) {
    const mode = this.getCurrentEffectiveMode();
    const fps = this.getAverageFPS();
    
    const modeScales = {
      high: 1.0,
      medium: 0.7,
      low: 0.4,
      emergency: 0.2
    };
    
    const fpsScale = Math.max(0.3, Math.min(1.0, fps / 60));
    return baseIntensity * modeScales[mode] * fpsScale;
  }

  // Get optimized animation settings
  getAnimationSettings() {
    const mode = this.getCurrentEffectiveMode();
    const limits = this.effectLimits[mode];
    
    return {
      particleCount: this.getEffectScale(1),
      animationDuration: mode === 'low' ? 0.5 : mode === 'medium' ? 0.7 : 1.0,
      complexEffects: limits.complexAnimations,
      backgroundEffects: limits.backgroundEffects,
      maxConcurrentAnimations: limits.animations,
      reducedMotion: mode === 'low' || mode === 'emergency'
    };
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
    if (pool.length < 5) { // Limit pool size
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

  // Set performance mode with immediate optimization
  setPerformanceMode(mode) {
    const oldMode = this.performanceMode;
    this.performanceMode = mode;
    
    if (oldMode !== mode) {
      this.optimizeActiveEffects();
      console.log(`Performance mode changed: ${oldMode} → ${mode} (FPS: ${Math.round(this.fps)})`);
    }
  }

  // Optimize active effects based on performance
  optimizeActiveEffects() {
    const mode = this.getCurrentEffectiveMode();
    const limits = this.effectLimits[mode] || this.effectLimits.medium;
    
    // Remove excess effects by priority
    const effectsByType = new Map();
    this.activeEffects.forEach(effect => {
      if (!effectsByType.has(effect.type)) {
        effectsByType.set(effect.type, []);
      }
      effectsByType.get(effect.type).push(effect);
    });
    
    effectsByType.forEach((effects, type) => {
      const limit = limits[type] || limits.effects;
      if (effects.length > limit) {
        // Remove oldest effects first
        const toRemove = effects
          .sort((a, b) => a.startTime - b.startTime)
          .slice(0, effects.length - limit);
        
        toRemove.forEach(effect => this.removeEffect(effect));
      }
    });
  }

  // Add effect with performance checks
  addEffect(effect) {
    if (this.shouldCreateEffect(effect.type, effect.priority || 'normal')) {
      effect.startTime = performance.now();
      this.activeEffects.set(effect.id, effect);
      return true;
    }
    return false;
  }

  removeEffect(effect) {
    this.activeEffects.delete(effect.id);
    this.returnToPool(effect.type, effect);
  }

  // Get current performance stats
  getStats() {
    return {
      fps: Math.round(this.fps),
      avgFps: Math.round(this.getAverageFPS()),
      mode: this.getCurrentEffectiveMode(),
      activeEffects: this.activeEffects.size,
      frameDrops: this.frameDropCount,
      isStable: this.isPerformanceStable(),
      effectScale: this.getEffectScale(),
      memoryUsage: this.getMemoryUsage()
    };
  }

  getMemoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }

  // Cleanup with performance consideration
  cleanup() {
    const now = performance.now();
    const mode = this.getCurrentEffectiveMode();
    
    // Aggressive cleanup in low performance modes
    const maxAge = mode === 'low' ? 1000 : mode === 'medium' ? 2000 : 3000;
    
    this.activeEffects.forEach((effect, id) => {
      if (now - effect.startTime > maxAge) {
        this.removeEffect(effect);
      }
    });
    
    // Clean effect pools
    this.effectPool.forEach((pool, type) => {
      if (pool.length > 10) {
        this.effectPool.set(type, pool.slice(-5));
      }
    });
  }

  // Destroy with cleanup
  destroy() {
    this.activeEffects.clear();
    this.effectPool.clear();
    this.performanceHistory = [];
  }
}