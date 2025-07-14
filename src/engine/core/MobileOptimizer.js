// Mobile Optimization System - Touch and responsive design
export class MobileOptimizer {
  constructor() {
    this.isMobile = this.detectMobile();
    this.isTablet = this.detectTablet();
    this.touchSupport = 'ontouchstart' in window;
    this.orientation = this.getOrientation();
    this.screenSize = this.getScreenSize();
    this.optimizations = {
      reducedAnimations: this.isMobile,
      simplifiedEffects: this.isMobile,
      touchFriendly: this.touchSupport,
      responsiveLayout: true
    };
    
    this.setupEventListeners();
  }

  detectMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  detectTablet() {
    return /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
  }

  getOrientation() {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  getScreenSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      category: this.categorizeScreen()
    };
  }

  categorizeScreen() {
    const width = window.innerWidth;
    if (width < 480) return 'mobile';
    if (width < 768) return 'mobile-large';
    if (width < 1024) return 'tablet';
    if (width < 1440) return 'desktop';
    return 'desktop-large';
  }

  setupEventListeners() {
    // Orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.orientation = this.getOrientation();
        this.screenSize = this.getScreenSize();
        this.updateOptimizations();
      }, 100);
    });

    // Resize
    window.addEventListener('resize', () => {
      this.screenSize = this.getScreenSize();
      this.updateOptimizations();
    });

    // Touch events for mobile typing
    if (this.touchSupport) {
      this.setupTouchTyping();
    }
  }

  setupTouchTyping() {
    // Virtual keyboard handling
    let initialViewportHeight = window.innerHeight;
    
    window.addEventListener('resize', () => {
      const currentHeight = window.innerHeight;
      const heightDiff = initialViewportHeight - currentHeight;
      
      // Keyboard is likely open if height decreased significantly
      if (heightDiff > 150) {
        document.body.classList.add('keyboard-open');
        this.adjustForKeyboard(heightDiff);
      } else {
        document.body.classList.remove('keyboard-open');
        this.resetKeyboardAdjustments();
      }
    });
  }

  adjustForKeyboard(keyboardHeight) {
    // Adjust typing interface for virtual keyboard
    const typingContainer = document.querySelector('[data-typing-container]');
    if (typingContainer) {
      typingContainer.style.paddingBottom = `${keyboardHeight}px`;
      typingContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  resetKeyboardAdjustments() {
    const typingContainer = document.querySelector('[data-typing-container]');
    if (typingContainer) {
      typingContainer.style.paddingBottom = '';
    }
  }

  updateOptimizations() {
    // Update optimizations based on current device state
    this.optimizations = {
      reducedAnimations: this.isMobile || this.screenSize.category === 'mobile',
      simplifiedEffects: this.isMobile,
      touchFriendly: this.touchSupport,
      responsiveLayout: true,
      compactMode: this.screenSize.category === 'mobile'
    };
  }

  // Get responsive breakpoints
  getBreakpoints() {
    return {
      mobile: '480px',
      mobileLarge: '768px',
      tablet: '1024px',
      desktop: '1440px'
    };
  }

  // Get optimized effect settings
  getEffectSettings() {
    if (this.optimizations.simplifiedEffects) {
      return {
        particleCount: 0.3, // 30% of normal
        animationDuration: 0.7, // 70% of normal
        complexEffects: false,
        backgroundEffects: false
      };
    }
    
    return {
      particleCount: 1,
      animationDuration: 1,
      complexEffects: true,
      backgroundEffects: true
    };
  }

  // Touch-friendly component props
  getTouchProps() {
    if (!this.touchSupport) return {};
    
    return {
      touchAction: 'manipulation',
      userSelect: 'none',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none'
    };
  }

  // Responsive font sizes
  getResponsiveFontSize(baseSize) {
    const multipliers = {
      mobile: 0.8,
      'mobile-large': 0.9,
      tablet: 1,
      desktop: 1,
      'desktop-large': 1.1
    };
    
    return `${baseSize * (multipliers[this.screenSize.category] || 1)}px`;
  }

  // Get current optimization state
  getOptimizations() {
    return {
      ...this.optimizations,
      screenSize: this.screenSize,
      orientation: this.orientation,
      isMobile: this.isMobile,
      isTablet: this.isTablet
    };
  }
}