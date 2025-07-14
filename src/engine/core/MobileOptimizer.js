// Mobile Optimizer - Optimizes engine for mobile devices
export class MobileOptimizer {
  constructor() {
    this.optimizations = {
      isMobile: this.detectMobile(),
      isTablet: this.detectTablet(),
      touchSupport: this.detectTouch(),
      screenSize: this.getScreenSize(),
      orientation: this.getOrientation(),
      devicePixelRatio: window.devicePixelRatio || 1
    };
    
    this.effectSettings = this.calculateEffectSettings();
    
    // Listen for orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.updateOptimizations();
      }, 100);
    });
    
    // Listen for resize events
    window.addEventListener('resize', () => {
      this.updateOptimizations();
    });
  }
  
  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  detectTablet() {
    return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768;
  }
  
  detectTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }
  
  getScreenSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width < 768) return 'mobile';
    if (width < 1200) return 'tablet';
    return 'desktop';
  }
  
  getOrientation() {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
  }
  
  calculateEffectSettings() {
    const { isMobile, isTablet, screenSize } = this.optimizations;
    
    if (isMobile && screenSize === 'mobile') {
      return {
        particleCount: 0.3,
        animationDuration: 0.7,
        effectIntensity: 0.5,
        maxConcurrentEffects: 3
      };
    }
    
    if (isTablet || screenSize === 'tablet') {
      return {
        particleCount: 0.6,
        animationDuration: 0.8,
        effectIntensity: 0.7,
        maxConcurrentEffects: 5
      };
    }
    
    return {
      particleCount: 1,
      animationDuration: 1,
      effectIntensity: 1,
      maxConcurrentEffects: 8
    };
  }
  
  updateOptimizations() {
    this.optimizations.screenSize = this.getScreenSize();
    this.optimizations.orientation = this.getOrientation();
    this.effectSettings = this.calculateEffectSettings();
  }
  
  getOptimizations() {
    return { ...this.optimizations };
  }
  
  getEffectSettings() {
    return { ...this.effectSettings };
  }
  
  shouldReduceEffects() {
    return this.optimizations.isMobile || this.optimizations.screenSize === 'mobile';
  }
  
  getTouchSettings() {
    if (!this.optimizations.touchSupport) return null;
    
    return {
      tapTargetSize: this.optimizations.isMobile ? 44 : 32,
      gestureThreshold: 10,
      longPressDelay: 500
    };
  }
}