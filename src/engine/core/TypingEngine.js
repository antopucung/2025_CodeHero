// Typing Gamification Engine - Main Engine Coordinator
import { CustomEventEmitter } from './EventEmitter.js';
import { EngineState } from './EngineState.js';
import { TypingProcessor } from './TypingProcessor.js';
import { StatsCalculator } from './StatsCalculator.js';
import { EffectManager } from './EffectManager.js';
import { PerformanceOptimizer } from './PerformanceOptimizer.js';
import { MobileOptimizer } from './MobileOptimizer.js';
import { SoundManager } from './SoundManager.js';
import { AnalyticsTracker } from './AnalyticsTracker.js';

export class TypingEngine extends CustomEventEmitter {
  constructor(config = {}) {
    super();
    
    // Configuration
    this.config = {
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
      enableSounds: true,
      enableAnalytics: true,
      performanceMode: 'auto',
      ...config
    };
    
    // Initialize core systems
    this.engineState = new EngineState();
    this.performanceOptimizer = new PerformanceOptimizer();
    this.mobileOptimizer = new MobileOptimizer();
    this.soundManager = new SoundManager();
    this.analyticsTracker = new AnalyticsTracker();
    
    // Initialize processing systems
    this.typingProcessor = new TypingProcessor(this.engineState, this.config);
    this.statsCalculator = new StatsCalculator(this.engineState);
    this.effectManager = new EffectManager(this.engineState, this.performanceOptimizer);
    
    // Callbacks
    this.onComplete = null;
    this.onCharacterTyped = null;
    
    this.initializeSystems();
  }
  
  // Initialize all systems
  async initializeSystems() {
    // Start performance monitoring
    this.performanceOptimizer.startMonitoring();
    
    // Initialize sound system (requires user interaction)
    if (this.config.enableSounds) {
      document.addEventListener('click', () => {
        this.soundManager.initialize();
      }, { once: true });
    }
    
    // Start effect system
    this.effectManager.startEffectSystem();
    
    // Setup event listeners between systems
    this.setupEventListeners();
    
    // Update state with optimization data
    this.updateOptimizationData();
  }
  
  // Setup event listeners between systems
  setupEventListeners() {
    // Typing processor events
    this.typingProcessor.on('start', () => {
      this.statsCalculator.startCalculating();
      this.emit('start');
    });
    
    this.typingProcessor.on('characterProcessed', (data) => {
      if (this.config.enableAnalytics) {
        this.analyticsTracker.trackKeystroke(
          data.char, 
          data.isCorrect, 
          data.speed, 
          this.engineState.getCombo(), 
          this.engineState.getStreak()
        );
      }
      
      if (this.onCharacterTyped) {
        this.onCharacterTyped(data);
      }
    });
    
    this.typingProcessor.on('correctChar', (data) => {
      // Play sounds
      if (this.config.enableSounds && this.soundManager.isInitialized) {
        this.soundManager.playKeypressSound(data.speed);
        this.soundManager.playCorrectSound(data.combo);
      }
      
      // Add visual effects
      this.effectManager.addFloatingScore(data.score, data.speed, data.combo, data.patterns.length);
      this.effectManager.addCharacterExplosion(data.char, true, data.speed, data.combo, data.patterns.length);
      
      // Upgrade character
      this.effectManager.upgradeCharacter(this.engineState.getCurrentIndex() - 1, data.speed, data.combo);
      
      // Trigger confetti for high scores
      if (data.score > 100 || data.combo >= 20) {
        this.effectManager.triggerConfetti(data.combo);
      }
      
      // Pattern celebrations
      data.patterns.forEach(pattern => {
        this.effectManager.celebratePattern(pattern);
        if (this.config.enableSounds && this.soundManager.isInitialized) {
          this.soundManager.playPatternMatchSound(pattern.bonus);
        }
        if (this.config.enableAnalytics) {
          this.analyticsTracker.trackPatternMatch(pattern);
        }
      });
      
      // Combo milestone sounds
      if (data.combo > 0 && data.combo % 10 === 0 && this.config.enableSounds) {
        this.soundManager.playComboSound(data.combo);
      }
    });
    
    this.typingProcessor.on('incorrectChar', (data) => {
      // Play error sound
      if (this.config.enableSounds && this.soundManager.isInitialized) {
        this.soundManager.playErrorSound();
      }
      
      // Add error effects
      this.effectManager.addCharacterExplosion(data.char, false, 'error', 0, 0);
      this.effectManager.addBonusEffect('error_shake', 1);
    });
    
    this.typingProcessor.on('levelUp', (data) => {
      // Play level up sound
      if (this.config.enableSounds && this.soundManager.isInitialized) {
        this.soundManager.playLevelUpSound(data.newLevel);
      }
      
      // Track level up
      if (this.config.enableAnalytics) {
        this.analyticsTracker.trackAchievement(`level_${data.newLevel}`);
      }
      
      // Celebrate level up
      this.effectManager.celebrateLevelUp(data.oldLevel, data.newLevel);
      
      this.emit('levelUp', data);
    });
    
    this.typingProcessor.on('achievement', (achievement) => {
      // Play achievement sound
      if (this.config.enableSounds && this.soundManager.isInitialized) {
        this.soundManager.playAchievementSound('legendary');
      }
      
      // Track achievement
      if (this.config.enableAnalytics) {
        this.analyticsTracker.trackAchievement(achievement);
      }
      
      // Celebrate achievement
      this.effectManager.unlockAchievement(achievement);
    });
    
    this.typingProcessor.on('complete', (finalStats) => {
      this.statsCalculator.stopCalculating();
      
      // Track completion
      if (this.config.enableAnalytics) {
        this.analyticsTracker.trackChallengeComplete(finalStats, {
          language: 'javascript', // TODO: Get from challenge
          difficulty: 'intermediate', // TODO: Get from challenge
          title: 'Challenge' // TODO: Get from challenge
        });
      }
      
      // Play completion sound
      if (this.config.enableSounds && this.soundManager.isInitialized) {
        this.soundManager.playChallengeComplete(finalStats.totalScore);
      }
      
      if (this.onComplete) {
        this.onComplete(finalStats);
      }
      
      this.emit('complete', finalStats);
    });
  }
  
  // Public API methods
  initialize(targetText, onComplete, onCharacterTyped) {
    this.typingProcessor.setTargetText(targetText);
    this.onComplete = onComplete;
    this.onCharacterTyped = onCharacterTyped;
    this.reset();
  }
  
  processKeyPress(char) {
    this.typingProcessor.processKeyPress(char);
    this.updateOptimizationData();
    this.emit('stateChange', this.engineState.getState());
  }
  
  reset() {
    this.engineState.reset();
    this.statsCalculator.stopCalculating();
    this.emit('reset');
  }
  
  // State getters
  get state() {
    return this.engineState.getState();
  }
  
  getCharacterStatus(index) {
    return this.typingProcessor.getCharacterStatus(index);
  }
  
  getCharacterSpeed(index) {
    return this.typingProcessor.getCharacterSpeed(index);
  }
  
  getCharacterUpgrade(index) {
    return this.engineState.getCharacterUpgrade(index);
  }
  
  getProgress() {
    return this.typingProcessor.getProgress();
  }
  
  // Optimization and analytics
  updateOptimizationData() {
    this.engineState.state.performanceStats = this.performanceOptimizer.getStats();
    this.engineState.state.mobileOptimizations = this.mobileOptimizer.getOptimizations();
  }
  
  getOptimizationSettings() {
    return {
      performance: this.performanceOptimizer.getStats(),
      mobile: this.mobileOptimizer.getOptimizations(),
      effects: this.mobileOptimizer.getEffectSettings()
    };
  }
  
  getAnalyticsData() {
    if (!this.config.enableAnalytics) return null;
    
    return {
      session: this.analyticsTracker.getSessionStats(),
      progress: this.analyticsTracker.getProgressStats(),
      heatmap: this.analyticsTracker.getHeatmapData(),
      insights: this.analyticsTracker.getInsights()
    };
  }
  
  getSoundHooks() {
    if (!this.config.enableSounds) return {};
    return this.soundManager.getSoundHooks();
  }
  
  getPerformanceMetrics() {
    return this.statsCalculator.getPerformanceMetrics();
  }
  
  getTypingRhythm() {
    return this.statsCalculator.getTypingRhythm();
  }
  
  getEffectStats() {
    return this.effectManager.getEffectStats();
  }
  
  // Cleanup methods
  cleanupEffects() {
    this.effectManager.cleanupEffects();
    this.performanceOptimizer.optimizeActiveEffects();
    this.updateOptimizationData();
  }
  
  destroy() {
    // Stop all systems
    this.statsCalculator.destroy();
    this.effectManager.destroy();
    this.performanceOptimizer.destroy();
    this.soundManager.destroy();
    this.analyticsTracker.destroy();
    
    // Clear event listeners
    this.typingProcessor.removeAllListeners();
    this.removeAllListeners();
  }
}

// Re-export CustomEventEmitter for backward compatibility
export { CustomEventEmitter } from './EventEmitter.js';