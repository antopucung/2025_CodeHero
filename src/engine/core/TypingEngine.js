// Typing Gamification Engine - Core Engine

// Browser-compatible EventEmitter implementation
export class CustomEventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event, listenerToRemove) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
  }

  emit(event, ...args) {
    if (!this.events[event]) return;
    this.events[event].forEach(listener => listener(...args));
  }

  removeAllListeners() {
    this.events = {};
  }
}

import { PerformanceOptimizer } from './PerformanceOptimizer.js';
import { MobileOptimizer } from './MobileOptimizer.js';
import { SoundManager } from './SoundManager.js';
import { AnalyticsTracker } from './AnalyticsTracker.js';

export class TypingEngine extends CustomEventEmitter {
  constructor(config = {}) {
    super();
    
    // Initialize optimization systems
    this.performanceOptimizer = new PerformanceOptimizer();
    this.mobileOptimizer = new MobileOptimizer();
    this.soundManager = new SoundManager();
    this.analyticsTracker = new AnalyticsTracker();
    
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
    
    this.state = {
      currentIndex: 0,
      typedText: '',
      errors: 0,
      startTime: null,
      isActive: false,
      isComplete: false,
      
      // Performance metrics
      wpm: 0,
      accuracy: 100,
      streak: 0,
      combo: 1,
      maxCombo: 1,
      perfectStreak: 0,
      totalScore: 0,
      level: 1,
      xp: 0,
      
      // Timing data
      lastCorrectTime: null,
      typingSpeed: 'lame',
      anticipationLevel: 1,
      speedHistory: [],
      
      // Character tracking
      recentlyTyped: [],
      characterUpgrades: new Map(),
      
      // Pattern matching
      patternMatches: [],
      achievements: [],
      newAchievements: [],
      newLevel: null,
      
      // Effects
      explosions: [],
      floatingScores: [],
      bonusEffects: [],
      
      // Optimization data
      performanceStats: {},
      mobileOptimizations: {}
    };
    
    this.targetText = '';
    this.onComplete = null;
    this.onCharacterTyped = null;
    
    // Initialize systems
    this.initializeSystems();
  }
  
  // Initialize optimization systems
  async initializeSystems() {
    // Start performance monitoring
    this.performanceOptimizer.startMonitoring();
    
    // Initialize sound system (requires user interaction)
    if (this.config.enableSounds) {
      // Will be initialized on first user interaction
      document.addEventListener('click', () => {
        this.soundManager.initialize();
      }, { once: true });
    }
    
    // Update state with optimization data
    this.state.performanceStats = this.performanceOptimizer.getStats();
    this.state.mobileOptimizations = this.mobileOptimizer.getOptimizations();
  }
  
  // Initialize engine with target text
  initialize(targetText, onComplete, onCharacterTyped) {
    this.targetText = targetText;
    this.onComplete = onComplete;
    this.onCharacterTyped = onCharacterTyped;
    this.reset();
  }
  
  // Reset engine state
  reset() {
    this.state = {
      ...this.state,
      currentIndex: 0,
      typedText: '',
      errors: 0,
      startTime: null,
      isActive: false,
      isComplete: false,
      wpm: 0,
      accuracy: 100,
      streak: 0,
      combo: 1,
      maxCombo: 1,
      perfectStreak: 0,
      totalScore: 0,
      lastCorrectTime: null,
      typingSpeed: 'lame',
      anticipationLevel: 1,
      speedHistory: [],
      recentlyTyped: [],
      characterUpgrades: new Map(),
      patternMatches: [],
      achievements: [],
      explosions: [],
      floatingScores: [],
      bonusEffects: []
    };
    
    this.emit('reset');
  }
  
  // Process key press
  processKeyPress(char) {
    // Immediate response - no delays
    if (!this.state.isActive && !this.state.startTime) {
      this.state.startTime = Date.now();
      this.state.isActive = true;
      this.emit('start');
    }
    
    const expectedChar = this.targetText[this.state.currentIndex];
    const now = Date.now();
    const isCorrect = char === expectedChar;
    const timeDiff = this.state.lastCorrectTime ? now - this.state.lastCorrectTime : 200;
    const speed = this.getTypingSpeed(timeDiff);
    
    if (isCorrect) {
      this.processCorrectChar(char, speed, now, timeDiff);
    } else {
      this.processIncorrectChar(char);
    }
    
    this.updateStats();
    // Emit state change immediately for responsive UI
    this.emit('stateChange', this.state);
  }
  
  // Process correct character
  processCorrectChar(char, speed, now, timeDiff) {
    const newTypedText = this.state.typedText + char;
    this.state.typedText = newTypedText;
    this.state.currentIndex++;
    
    // Track analytics
    if (this.config.enableAnalytics) {
      this.analyticsTracker.trackKeystroke(char, true, speed, this.state.combo, this.state.streak);
    }
    
    // Play sound feedback
    if (this.config.enableSounds && this.soundManager.isInitialized) {
      this.soundManager.playKeypressSound(speed);
      this.soundManager.playCorrectSound(this.state.combo);
    }
    
    // Update speed tracking
    this.updateAnticipationLevel(speed);
    
    // Update streak and combo
    this.state.streak++;
    this.updateCombo(speed, timeDiff);
    this.state.lastCorrectTime = now;
    
    // Check for perfect streak milestones
    if (speed === 'perfect') {
      this.state.perfectStreak++;
      if (this.state.perfectStreak >= 10 && this.config.enableSounds) {
        this.soundManager.playPerfectStreakSound(this.state.perfectStreak);
      }
    }
    
    // Track character performance
    const charData = {
      char,
      index: this.state.currentIndex - 1,
      time: now,
      combo: this.state.combo,
      speed,
      timeDiff
    };
    
    this.state.recentlyTyped = [...this.state.recentlyTyped.slice(-10), charData];
    
    // Check for patterns and bonuses
    const patterns = this.checkPatterns(newTypedText, this.state.combo);
    this.state.patternMatches = [...this.state.patternMatches, ...patterns];
    
    // Play pattern match sounds
    if (patterns.length > 0 && this.config.enableSounds && this.soundManager.isInitialized) {
      patterns.forEach(pattern => {
        this.soundManager.playPatternMatchSound(pattern.bonus);
      });
    }
    
    // Track patterns in analytics
    if (this.config.enableAnalytics) {
      patterns.forEach(pattern => {
        this.analyticsTracker.trackPatternMatch(pattern);
      });
    }
    
    // Calculate and add score
    const score = this.calculateScore(speed, this.state.combo, this.state.streak, patterns);
    this.state.totalScore += score;
    
    // Update XP and check for level up
    this.updateXP(score);
    
    // Add visual effects
    if (this.performanceOptimizer.shouldCreateEffect('floatingScore')) {
      this.addFloatingScore(score, speed, this.state.combo, patterns.length);
    }
    
    if (this.performanceOptimizer.shouldCreateEffect('explosion')) {
      this.addCharacterExplosion(char, true, speed, this.state.combo, patterns.length);
    }
    
    // Update character upgrade
    this.upgradeCharacter(this.state.currentIndex - 1, speed, this.state.combo);
    
    // Check for combo milestones
    if (this.state.combo > 0 && this.state.combo % 10 === 0 && this.config.enableSounds) {
      this.soundManager.playComboSound(this.state.combo);
    }
    
    // Emit character typed event
    if (this.onCharacterTyped) {
      this.onCharacterTyped({
        char,
        isCorrect: true,
        streak: this.state.streak,
        combo: this.state.combo,
        speed,
        score,
        totalScore: this.state.totalScore,
        patterns
      });
    }
    
    // Check completion
    if (this.state.currentIndex >= this.targetText.length) {
      this.complete();
    }
  }
  
  // Process incorrect character
  processIncorrectChar(char) {
    // Track analytics
    if (this.config.enableAnalytics) {
      this.analyticsTracker.trackKeystroke(char, false, 'error', this.state.combo, this.state.streak);
    }
    
    // Play error sound
    if (this.config.enableSounds && this.soundManager.isInitialized) {
      this.soundManager.playErrorSound();
    }
    
    this.state.errors++;
    this.state.streak = 0;
    this.state.combo = 1;
    this.state.perfectStreak = 0;
    this.state.typingSpeed = 'lame';
    
    // Add error effects
    if (this.performanceOptimizer.shouldCreateEffect('explosion')) {
      this.addCharacterExplosion(char, false, 'error', 0, 0);
    }
    
    if (this.performanceOptimizer.shouldCreateEffect('bonusEffect')) {
      this.addBonusEffect('error_shake', 1);
    }
    
    // Emit character typed event
    if (this.onCharacterTyped) {
      this.onCharacterTyped({
        char,
        isCorrect: false,
        streak: 0,
        combo: 1,
        speed: 'error',
        score: 0,
        totalScore: this.state.totalScore
      });
    }
  }
  
  // Update XP and handle level ups
  updateXP(score) {
    const xpGained = Math.floor(score / 10); // 10 points = 1 XP
    this.state.xp += xpGained;
    
    // Check for level up
    const xpForNextLevel = this.state.level * 100;
    if (this.state.xp >= xpForNextLevel) {
      const oldLevel = this.state.level;
      this.state.level++;
      this.state.xp -= xpForNextLevel;
      this.state.newLevel = this.state.level;
      
      // Play level up sound
      if (this.config.enableSounds && this.soundManager.isInitialized) {
        this.soundManager.playLevelUpSound(this.state.level);
      }
      
      // Track level up
      if (this.config.enableAnalytics) {
        this.analyticsTracker.trackAchievement(`level_${this.state.level}`);
      }
      
      this.emit('levelUp', { oldLevel, newLevel: this.state.level });
    }
  }
  
  // Complete typing session
  complete() {
    this.state.isComplete = true;
    this.state.isActive = false;
    
    const finalStats = {
      wpm: this.state.wpm,
      accuracy: this.state.accuracy,
      errors: this.state.errors,
      timeElapsed: (Date.now() - this.state.startTime) / 1000,
      streak: this.state.streak,
      maxCombo: this.state.maxCombo,
      totalScore: this.state.totalScore,
      perfectStreak: this.state.perfectStreak,
      achievements: this.state.achievements.length,
      level: this.state.level,
      xp: this.state.xp
    };
    
    this.checkAchievements(finalStats);
    
    // Track completion in analytics
    if (this.config.enableAnalytics) {
      this.analyticsTracker.trackChallengeComplete(finalStats, {
        language: 'javascript', // TODO: Get from challenge
        difficulty: 'intermediate', // TODO: Get from challenge
        title: 'Challenge' // TODO: Get from challenge
      });
    }
    
    // Play completion sound
    if (this.config.enableSounds && this.soundManager.isInitialized) {
      this.soundManager.playChallengeComplete(this.state.totalScore);
    }
    
    if (this.onComplete) {
      this.onComplete(finalStats);
    }
    
    this.emit('complete', finalStats);
  }
  
  // Helper methods
  getTypingSpeed(timeDiff) {
    if (timeDiff < this.config.speedThresholds.perfect) return 'perfect';
    if (timeDiff < this.config.speedThresholds.best) return 'best';
    if (timeDiff < this.config.speedThresholds.good) return 'good';
    return 'lame';
  }
  
  updateAnticipationLevel(speed) {
    const speedValues = { perfect: 4, best: 3, good: 2, lame: 1 };
    const newHistory = [...this.state.speedHistory.slice(-4), speedValues[speed]];
    this.state.speedHistory = newHistory;
    
    const avgSpeed = newHistory.reduce((a, b) => a + b, 0) / newHistory.length;
    this.state.anticipationLevel = avgSpeed;
    this.state.typingSpeed = speed;
  }
  
  updateCombo(speed, timeDiff) {
    const speedMultiplier = { perfect: 3, best: 2, good: 1.5, lame: 1 }[speed];
    
    if (speed === 'perfect') {
      this.state.combo = Math.min(this.state.combo + 2, 100);
      this.state.perfectStreak++;
    } else if (speed === 'best') {
      this.state.combo = Math.min(this.state.combo + 1, 100);
    } else if (timeDiff > 600) {
      this.state.combo = Math.max(1, this.state.combo - 1);
    }
    
    this.state.maxCombo = Math.max(this.state.maxCombo, this.state.combo);
  }
  
  calculateScore(speed, combo, streak, patterns) {
    const baseScore = 15;
    const speedBonus = { perfect: 50, best: 30, good: 20, lame: 10 }[speed];
    const comboBonus = combo * 3;
    const streakBonus = streak > 10 ? Math.floor(streak / 5) * 10 : 0;
    const patternBonus = patterns.reduce((sum, p) => sum + p.bonus, 0);
    const speedMultiplier = { perfect: 2, best: 1.5, good: 1.2, lame: 1 }[speed];
    const streakMultiplier = this.state.streakMultiplier;
    
    return Math.round((baseScore + speedBonus + comboBonus + streakBonus + patternBonus) * speedMultiplier * streakMultiplier);
  }
  
  checkPatterns(newTypedText, currentCombo) {
    const patterns = [];
    
    // Enhanced pattern detection for addictive bonus combos
    const recentChars = this.state.recentlyTyped.slice(-5);
    const perfectCount = recentChars.filter(char => char.speed === 'perfect').length;
    
    // Perfect streak pattern - Lightning Fast Bonus
    if (perfectCount >= 3) {
      patterns.push({
        type: 'perfect_streak',
        count: perfectCount,
        bonus: perfectCount * 75, // Increased bonus for addiction
        color: '#ff6b6b',
        id: Date.now() + Math.random()
      });
    }
    
    // Function/method pattern detection - Code Wizard Bonus
    const recentText = newTypedText.slice(-10);
    if (recentText.includes('function') || recentText.includes('const ') || recentText.includes('let ')) {
      patterns.push({
        type: 'function_declaration',
        bonus: 150, // Major bonus for coding patterns
        color: '#4ecdc4',
        id: Date.now() + Math.random()
      });
    }
    
    // Advanced coding pattern detection
    if (recentText.includes('class ') || recentText.includes('interface ') || recentText.includes('type ')) {
      patterns.push({
        type: 'advanced_syntax',
        bonus: 200, // Premium bonus for advanced syntax
        color: '#ff6b6b',
        id: Date.now() + Math.random()
      });
    }
    
    // Import/export pattern
    if (recentText.includes('import ') || recentText.includes('export ') || recentText.includes('from ')) {
      patterns.push({
        type: 'module_syntax',
        bonus: 120,
        color: '#6bcf7f',
        id: Date.now() + Math.random()
      });
    }
    
    // Bracket/parentheses matching pattern - Syntax Master
    const brackets = recentText.match(/[\(\)\[\]\{\}]/g);
    if (brackets && brackets.length >= 2) {
      patterns.push({
        type: 'bracket_combo',
        bonus: 100, // Increased for better feedback
        color: '#ffd93d',
        id: Date.now() + Math.random()
      });
    }
    
    // Speed consistency pattern - Unstoppable Bonus
    const speeds = recentChars.map(char => char.speed);
    const uniqueSpeeds = [...new Set(speeds)];
    if (uniqueSpeeds.length === 1 && speeds.length >= 4 && uniqueSpeeds[0] !== 'lame') {
      patterns.push({
        type: 'speed_consistency',
        speed: uniqueSpeeds[0],
        bonus: 180, // Major bonus for consistency
        color: '#6bcf7f',
        id: Date.now() + Math.random()
      });
    }
    
    // Line completion pattern - Clean Code Bonus
    if (recentText.includes('\n') || recentText.includes(';')) {
      patterns.push({
        type: 'line_completion',
        bonus: 100,
        color: '#45b7d1',
        id: Date.now() + Math.random()
      });
    }
    
    // String/template literal patterns
    if (recentText.includes('`') || recentText.includes('"') || recentText.includes("'")) {
      patterns.push({
        type: 'string_mastery',
        bonus: 90,
        color: '#ffaa00',
        id: Date.now() + Math.random()
      });
    }
    
    // Arrow function pattern
    if (recentText.includes('=>') || recentText.includes('() =>')) {
      patterns.push({
        type: 'arrow_function',
        bonus: 130,
        color: '#ff6b6b',
        id: Date.now() + Math.random()
      });
    }
    
    // Check for combo milestones - On Fire Bonus
    if (currentCombo > 0 && currentCombo % 10 === 0) {
      patterns.push({
        type: 'combo_milestone',
        combo: currentCombo,
        bonus: currentCombo * 15, // Escalating milestone rewards
        color: '#ffd93d',
        id: Date.now() + Math.random()
      });
    }
    
    // Perfect typing streak (no errors for extended period)
    if (this.state.streak >= 20 && this.state.errors === 0) {
      patterns.push({
        type: 'flawless_execution',
        bonus: 250,
        color: '#ff1744',
        id: Date.now() + Math.random()
      });
    }
    
    return patterns;
  }
  
  upgradeCharacter(index, speed, currentCombo) {
    const upgrades = new Map(this.state.characterUpgrades);
    const currentUpgrade = upgrades.get(index) || { level: 0, speed: 'lame' };
    
    let newLevel = currentUpgrade.level;
    if (speed === 'perfect' && currentCombo >= 10) newLevel = Math.max(newLevel, 3);
    else if (speed === 'best' && currentCombo >= 5) newLevel = Math.max(newLevel, 2);
    else if (speed === 'good') newLevel = Math.max(newLevel, 1);
    
    if (newLevel > currentUpgrade.level) {
      upgrades.set(index, { level: newLevel, speed });
      this.state.characterUpgrades = upgrades;
      
      this.addBonusEffect('upgrade', newLevel, index);
    }
  }
  
  checkAchievements(stats) {
    const newAchievements = [];
    
    if (stats.perfectStreak >= 10 && !this.state.achievements.includes('speed_demon')) {
      newAchievements.push('speed_demon');
    }
    
    if (stats.maxCombo >= 50 && !this.state.achievements.includes('combo_master')) {
      newAchievements.push('combo_master');
    }
    
    if (stats.accuracy === 100 && !this.state.achievements.includes('perfectionist')) {
      newAchievements.push('perfectionist');
    }
    
    if (stats.wpm >= 60 && !this.state.achievements.includes('speed_racer')) {
      newAchievements.push('speed_racer');
    }
    
    if (stats.totalScore >= 5000 && !this.state.achievements.includes('high_scorer')) {
      newAchievements.push('high_scorer');
    }
    
    // Add new achievements to state
    this.state.achievements = [...this.state.achievements, ...newAchievements];
    this.state.newAchievements = newAchievements;
    
    // Play achievement sounds and track analytics
    newAchievements.forEach(achievement => {
      if (this.config.enableSounds && this.soundManager.isInitialized) {
        this.soundManager.playAchievementSound('legendary');
      }
      
      if (this.config.enableAnalytics) {
        this.analyticsTracker.trackAchievement(achievement);
      }
    });
  }
  
  updateStats() {
    if (!this.state.startTime) return;
    
    const now = Date.now();
    const timeElapsed = (now - this.state.startTime) / 1000 / 60; // minutes
    const wordsTyped = this.state.typedText.length / 5; // standard word length
    this.state.wpm = Math.round(wordsTyped / timeElapsed) || 0;
    this.state.accuracy = Math.round(((this.state.typedText.length - this.state.errors) / Math.max(this.state.typedText.length, 1)) * 100) || 100;
  }
  
  // Effect management
  addFloatingScore(score, speed, combo, patterns) {
    if (!this.performanceOptimizer.addEffect({ type: 'floatingScore' })) {
      return; // Skip if performance is poor
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
    
    this.state.floatingScores = [...this.state.floatingScores, effect];
    
    // Trigger confetti for high scores
    if (score > 100 || combo >= 20) {
      this.triggerConfetti(combo);
    }
  }
  
  addCharacterExplosion(char, isCorrect, speed, combo, patterns) {
    if (!this.performanceOptimizer.addEffect({ type: 'explosion' })) {
      return; // Skip if performance is poor
    }
    
    const effect = {
      id: Date.now() + Math.random(),
      char,
      x: this.state.currentIndex * 20,
      y: 0,
      isCorrect,
      speed,
      combo,
      patterns,
      createdAt: Date.now()
    };
    
    this.state.explosions = [...this.state.explosions, effect];
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
    }
  }
  
  addBonusEffect(type, intensity, data = null) {
    if (!this.performanceOptimizer.addEffect({ type: 'bonusEffect' })) {
      return; // Skip if performance is poor
    }
    
    const effect = {
      id: Date.now() + Math.random(),
      type,
      intensity,
      data,
      createdAt: Date.now()
    };
    
    this.state.bonusEffects = [...this.state.bonusEffects, effect];
  }
  
  // Get optimization settings
  getOptimizationSettings() {
    return {
      performance: this.performanceOptimizer.getStats(),
      mobile: this.mobileOptimizer.getOptimizations(),
      effects: this.mobileOptimizer.getEffectSettings()
    };
  }
  
  // Get analytics data
  getAnalyticsData() {
    if (!this.config.enableAnalytics) return null;
    
    return {
      session: this.analyticsTracker.getSessionStats(),
      progress: this.analyticsTracker.getProgressStats(),
      heatmap: this.analyticsTracker.getHeatmapData(),
      insights: this.analyticsTracker.getInsights()
    };
  }
  
  // Get sound hooks for UI components
  getSoundHooks() {
    if (!this.config.enableSounds) return {};
    
    return this.soundManager.getSoundHooks();
  }
  
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
  
  // Cleanup methods
  cleanupEffects() {
    const now = Date.now();
    
    // Use performance optimizer for cleanup
    this.performanceOptimizer.optimizeActiveEffects();
    
    this.state.floatingScores = this.state.floatingScores.filter(
      effect => now - effect.id < 2000
    );
    
    this.state.explosions = this.state.explosions.filter(
      effect => now - effect.id < 1500
    );
    
    this.state.patternMatches = this.state.patternMatches.filter(
      pattern => now - pattern.id < 3000
    );
    
    this.state.bonusEffects = this.state.bonusEffects.filter(
      effect => now - effect.id < 1000
    );
    
    // Update performance stats
    this.state.performanceStats = this.performanceOptimizer.getStats();
  }
  
  // Getters
  getCharacterStatus(index) {
    if (index < this.state.typedText.length) {
      return this.targetText[index] === this.state.typedText[index] ? 'correct' : 'incorrect';
    } else if (index === this.state.currentIndex) {
      return 'current';
    }
    return 'pending';
  }
  
  getCharacterSpeed(index) {
    const charData = this.state.recentlyTyped.find(char => char.index === index);
    return charData?.speed || 'lame';
  }
  
  getCharacterUpgrade(index) {
    return this.state.characterUpgrades.get(index) || { level: 0, speed: 'lame' };
  }
  
  getProgress() {
    return (this.state.currentIndex / this.targetText.length) * 100;
  }
  
  // Cleanup and destroy
  destroy() {
    // Cleanup systems
    this.performanceOptimizer.destroy();
    this.soundManager.destroy();
    this.analyticsTracker.destroy();
    
    // Clear state
    this.removeAllListeners();
  }
}