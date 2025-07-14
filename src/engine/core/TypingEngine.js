// Typing Gamification Engine - Core Engine
import { EventEmitter } from 'events';

export class TypingEngine extends EventEmitter {
  constructor(config = {}) {
    super();
    
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
      
      // Effects
      explosions: [],
      floatingScores: [],
      bonusEffects: []
    };
    
    this.targetText = '';
    this.onComplete = null;
    this.onCharacterTyped = null;
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
    this.emit('stateChange', this.state);
  }
  
  // Process correct character
  processCorrectChar(char, speed, now, timeDiff) {
    const newTypedText = this.state.typedText + char;
    this.state.typedText = newTypedText;
    this.state.currentIndex++;
    
    // Update speed tracking
    this.updateAnticipationLevel(speed);
    
    // Update streak and combo
    this.state.streak++;
    this.updateCombo(speed, timeDiff);
    this.state.lastCorrectTime = now;
    
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
    
    // Calculate and add score
    const score = this.calculateScore(speed, this.state.combo, this.state.streak, patterns);
    this.state.totalScore += score;
    
    // Add visual effects
    this.addFloatingScore(score, speed, this.state.combo, patterns.length);
    this.addCharacterExplosion(char, true, speed, this.state.combo, patterns.length);
    
    // Update character upgrade
    this.upgradeCharacter(this.state.currentIndex - 1, speed, this.state.combo);
    
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
    this.state.errors++;
    this.state.streak = 0;
    this.state.combo = 1;
    this.state.perfectStreak = 0;
    this.state.typingSpeed = 'lame';
    
    // Add error effects
    this.addCharacterExplosion(char, false, 'error', 0, 0);
    this.addBonusEffect('error_shake', 1);
    
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
      achievements: this.state.achievements.length
    };
    
    this.checkAchievements(finalStats);
    
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
    const streakBonus = streak > 10 ? Math.floor(streak / 5) * 5 : 0;
    const patternBonus = patterns.reduce((sum, p) => sum + p.bonus, 0);
    const speedMultiplier = { perfect: 2, best: 1.5, good: 1.2, lame: 1 }[speed];
    
    return Math.round((baseScore + speedBonus + comboBonus + streakBonus + patternBonus) * speedMultiplier);
  }
  
  checkPatterns(newTypedText, currentCombo) {
    const patterns = [];
    
    // Check for consecutive perfect characters
    const recentChars = this.state.recentlyTyped.slice(-5);
    const perfectCount = recentChars.filter(char => char.speed === 'perfect').length;
    
    if (perfectCount >= 3) {
      patterns.push({
        type: 'perfect_streak',
        count: perfectCount,
        bonus: perfectCount * 50,
        color: '#ff6b6b',
        id: Date.now() + Math.random()
      });
    }
    
    // Check for combo milestones
    if (currentCombo > 0 && currentCombo % 10 === 0) {
      patterns.push({
        type: 'combo_milestone',
        combo: currentCombo,
        bonus: currentCombo * 10,
        color: '#ffd93d',
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
    
    this.state.achievements = [...this.state.achievements, ...newAchievements];
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
    const effect = {
      id: Date.now() + Math.random(),
      score,
      speed,
      combo,
      patterns,
      x: Math.random() * 200,
      y: Math.random() * 50,
      color: this.getPerformanceColor(speed).glow
    };
    
    this.state.floatingScores = [...this.state.floatingScores, effect];
  }
  
  addCharacterExplosion(char, isCorrect, speed, combo, patterns) {
    const effect = {
      id: Date.now() + Math.random(),
      char,
      x: this.state.currentIndex * 20,
      y: 0,
      isCorrect,
      speed,
      combo,
      patterns
    };
    
    this.state.explosions = [...this.state.explosions, effect];
  }
  
  addBonusEffect(type, intensity, data = null) {
    const effect = {
      id: Date.now() + Math.random(),
      type,
      intensity,
      data
    };
    
    this.state.bonusEffects = [...this.state.bonusEffects, effect];
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
}