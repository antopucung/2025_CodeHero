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
import { ENGINE_CONFIG } from './EngineConfig.js';

export class TypingEngine extends CustomEventEmitter {
  constructor(config = {}) {
    super();
    
    // Configuration
    this.config = {
      ...ENGINE_CONFIG,
      enableSounds: false,
      enableAnalytics: false,
      enableEffects: false,
      minimalistMode: true,
      performanceMode: 'auto',
      ...config
    };
    
    // Initialize core systems
    this.engineState = new EngineState();
    this.performanceOptimizer = new PerformanceOptimizer();
    this.mobileOptimizer = new MobileOptimizer();
    this.soundManager = this.config.enableSounds ? new SoundManager() : null;
    this.analyticsTracker = this.config.enableAnalytics ? new AnalyticsTracker() : null;
    
    // Initialize processing systems
    this.typingProcessor = new TypingProcessor(this.engineState, this.config);
    this.statsCalculator = new StatsCalculator(this.engineState);
    this.effectManager = this.config.enableEffects ? new EffectManager(this.engineState, this.performanceOptimizer) : null;
    
    // Callbacks
    this.onComplete = null;
    this.onCharacterTyped = null;
    
    this.initializeSystems();
  }
  
  // Initialize all systems
  async initializeSystems() {
    // Start performance monitoring
    this.performanceOptimizer.startMonitoring();
    
    // Initialize sound system only if enabled
    if (this.config.enableSounds && this.soundManager) {
      document.addEventListener('click', () => {
        this.soundManager.initialize();
      }, { once: true });
    }
    
    // Start effect system only if enabled
    if (this.config.enableEffects && this.effectManager) {
      this.effectManager.startEffectSystem();
    }
    
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
      if (this.config.enableAnalytics && this.analyticsTracker) {
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
      // Play sounds only if enabled
      if (this.config.enableSounds && this.soundManager && this.soundManager.isInitialized) {
        this.soundManager.playKeypressSound(data.speed);
        this.soundManager.playCorrectSound(data.combo);
      }
      
      // Add visual effects only if enabled
      if (this.config.enableEffects && this.effectManager) {
        this.effectManager.addFloatingScore(data.score, data.speed, data.combo, data.patterns.length);
        this.effectManager.addCharacterExplosion(data.char, true, data.speed, data.combo, data.patterns.length);
        this.effectManager.upgradeCharacter(this.engineState.getCurrentIndex() - 1, data.speed, data.combo);
        
        if (data.score > 100 || data.combo >= 20) {
          this.effectManager.triggerConfetti(data.combo);
        }
        
        data.patterns.forEach(pattern => {
          this.effectManager.celebratePattern(pattern);
          if (this.config.enableSounds && this.soundManager && this.soundManager.isInitialized) {
            this.soundManager.playPatternMatchSound(pattern.bonus);
          }
          if (this.config.enableAnalytics && this.analyticsTracker) {
            this.analyticsTracker.trackPatternMatch(pattern);
          }
        });
      }
      
      // Combo milestone sounds
      if (data.combo > 0 && data.combo % 10 === 0 && this.config.enableSounds && this.soundManager) {
        this.soundManager.playComboSound(data.combo);
      }
    });
    
    this.typingProcessor.on('incorrectChar', (data) => {
      // Play error sound only if enabled
      if (this.config.enableSounds && this.soundManager && this.soundManager.isInitialized) {
        this.soundManager.playErrorSound();
      }
      
      // Add error effects only if enabled
      if (this.config.enableEffects && this.effectManager) {
        this.effectManager.addCharacterExplosion(data.char, false, 'error', 0, 0);
        this.effectManager.addBonusEffect('error_shake', 1);
      }
    });
    
    this.typingProcessor.on('levelUp', (data) => {
      // Play level up sound only if enabled
      if (this.config.enableSounds && this.soundManager && this.soundManager.isInitialized) {
        this.soundManager.playLevelUpSound(data.newLevel);
      }
      
      // Track level up only if enabled
      if (this.config.enableAnalytics && this.analyticsTracker) {
        this.analyticsTracker.trackAchievement(`level_${data.newLevel}`);
      }
      
      // Celebrate level up only if enabled
      if (this.config.enableEffects && this.effectManager) {
        this.effectManager.celebrateLevelUp(data.oldLevel, data.newLevel);
      }
      
      this.emit('levelUp', data);
    });
    
    this.typingProcessor.on('achievement', (achievement) => {
      // Play achievement sound only if enabled
      if (this.config.enableSounds && this.soundManager && this.soundManager.isInitialized) {
        this.soundManager.playAchievementSound('legendary');
      }
      
      // Track achievement only if enabled
      if (this.config.enableAnalytics && this.analyticsTracker) {
        this.analyticsTracker.trackAchievement(achievement);
      }
      
      // Celebrate achievement only if enabled
      if (this.config.enableEffects && this.effectManager) {
        this.effectManager.unlockAchievement(achievement);
      }
    });
    
    this.typingProcessor.on('complete', (finalStats) => {
      this.statsCalculator.stopCalculating();
      
      // Track completion only if enabled
      if (this.config.enableAnalytics && this.analyticsTracker) {
        this.analyticsTracker.trackChallengeComplete(finalStats, {
          language: 'javascript', // TODO: Get from challenge
          difficulty: 'intermediate', // TODO: Get from challenge
          title: 'Challenge' // TODO: Get from challenge
        });
      }
      
      // Play completion sound only if enabled
      if (this.config.enableSounds && this.soundManager && this.soundManager.isInitialized) {
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
    return this.typingProcessor.getPerformanceMetrics();
  }
  
  getTypingRhythm() {
    return this.statsCalculator.getTypingRhythm();
  }
  
  getEffectStats() {
    return this.effectManager.getEffectStats();
  }
  
  // Cleanup methods
  cleanupEffects() {
    if (this.effectManager) {
      this.effectManager.cleanupEffects();
    }
    this.performanceOptimizer.optimizeActiveEffects();
    this.updateOptimizationData();
  }
  
  destroy() {
    // Stop all systems
    this.statsCalculator.destroy();
    if (this.effectManager) {
      this.effectManager.destroy();
    }
    this.performanceOptimizer.destroy();
    if (this.soundManager) {
      this.soundManager.destroy();
    }
    if (this.analyticsTracker) {
      this.analyticsTracker.destroy();
    }
    
    // Clear event listeners
    this.typingProcessor.removeAllListeners();
    this.removeAllListeners();
  }
}

// Re-export CustomEventEmitter for backward compatibility
export { CustomEventEmitter } from './EventEmitter.js';