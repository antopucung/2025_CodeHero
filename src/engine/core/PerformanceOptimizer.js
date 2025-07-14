// Performance Optimizer - Monitors and optimizes engine performance
export class PerformanceOptimizer {
  constructor() {
    this.stats = {
      fps: 60,
      frameTime: 16.67,
      memoryUsage: 0,
      effectCount: 0,
      mode: 'high',
      effectScale: 1
    };
    
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    this.isMonitoring = false;
    this.monitoringInterval = null;
  }
  
  startMonitoring() {
    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.updateStats();
      this.optimizePerformance();
    }, 1000);
  }
  
  updateStats() {
    const now = performance.now();
    const deltaTime = now - this.lastTime;
    const currentFps = Math.round(1000 / deltaTime);
    
    this.fpsHistory.push(currentFps);
    if (this.fpsHistory.length > 10) {
      this.fpsHistory.shift();
    }
    
    const avgFps = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    
    this.stats.fps = Math.round(avgFps);
    this.stats.frameTime = deltaTime;
    this.lastTime = now;
    
    // Update memory usage if available
    if (performance.memory) {
      this.stats.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
    }
  }
  
  optimizePerformance() {
    const { fps } = this.stats;
    
    // Determine performance mode based on FPS
    if (fps >= 55) {
      this.stats.mode = 'high';
      this.stats.effectScale = 1;
    } else if (fps >= 45) {
      this.stats.mode = 'medium';
      this.stats.effectScale = 0.7;
    } else if (fps >= 30) {
      this.stats.mode = 'low';
      this.stats.effectScale = 0.4;
    } else {
      this.stats.mode = 'minimal';
      this.stats.effectScale = 0.2;
    }
  }
  
  optimizeActiveEffects() {
    // This method can be called to reduce active effects when performance drops
    const { mode } = this.stats;
    
    const limits = {
      high: { particles: 50, effects: 25 },
      medium: { particles: 25, effects: 15 },
      low: { particles: 10, effects: 8 },
      minimal: { particles: 5, effects: 3 }
    };
    
    return limits[mode] || limits.minimal;
  }
  
  getStats() {
    return { ...this.stats };
  }
  
  destroy() {
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }
}