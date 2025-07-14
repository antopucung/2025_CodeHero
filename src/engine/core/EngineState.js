// Engine State Management - Centralized state handling
export class EngineState {
  constructor() {
    this.state = {
      // Core typing state
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
  }

  // State getters
  getCurrentIndex() { return this.state.currentIndex; }
  getTypedText() { return this.state.typedText; }
  getErrors() { return this.state.errors; }
  getWPM() { return this.state.wpm; }
  getAccuracy() { return this.state.accuracy; }
  getStreak() { return this.state.streak; }
  getCombo() { return this.state.combo; }
  getMaxCombo() { return this.state.maxCombo; }
  getPerfectStreak() { return this.state.perfectStreak; }
  getTotalScore() { return this.state.totalScore; }
  getLevel() { return this.state.level; }
  getXP() { return this.state.xp; }
  getTypingSpeed() { return this.state.typingSpeed; }
  getAnticipationLevel() { return this.state.anticipationLevel; }
  isActiveSession() { return this.state.isActive; }
  isCompleted() { return this.state.isComplete; }

  // State setters
  setCurrentIndex(index) { this.state.currentIndex = index; }
  setTypedText(text) { this.state.typedText = text; }
  incrementErrors() { this.state.errors++; }
  setWPM(wpm) { this.state.wpm = wpm; }
  setAccuracy(accuracy) { this.state.accuracy = accuracy; }
  setStreak(streak) { this.state.streak = streak; }
  setCombo(combo) { this.state.combo = combo; }
  updateMaxCombo(combo) { this.state.maxCombo = Math.max(this.state.maxCombo, combo); }
  setPerfectStreak(streak) { this.state.perfectStreak = streak; }
  addScore(score) { this.state.totalScore += score; }
  setLevel(level) { this.state.level = level; }
  setXP(xp) { this.state.xp = xp; }
  setTypingSpeed(speed) { this.state.typingSpeed = speed; }
  setAnticipationLevel(level) { this.state.anticipationLevel = level; }
  setActive(active) { this.state.isActive = active; }
  setComplete(complete) { this.state.isComplete = complete; }
  setStartTime(time) { this.state.startTime = time; }
  setLastCorrectTime(time) { this.state.lastCorrectTime = time; }

  // Complex state operations
  addRecentlyTyped(charData) {
    this.state.recentlyTyped = [...this.state.recentlyTyped.slice(-10), charData];
  }

  updateSpeedHistory(speed) {
    const speedValues = { perfect: 4, best: 3, good: 2, lame: 1 };
    const newHistory = [...this.state.speedHistory.slice(-4), speedValues[speed]];
    this.state.speedHistory = newHistory;
    
    const avgSpeed = newHistory.reduce((a, b) => a + b, 0) / newHistory.length;
    this.setAnticipationLevel(avgSpeed);
    this.setTypingSpeed(speed);
  }

  addPatternMatch(pattern) {
    this.state.patternMatches = [...this.state.patternMatches, pattern];
  }

  addAchievement(achievement) {
    if (!this.state.achievements.includes(achievement)) {
      this.state.achievements = [...this.state.achievements, achievement];
      this.state.newAchievements = [...this.state.newAchievements, achievement];
    }
  }

  clearNewAchievements() {
    this.state.newAchievements = [];
  }

  setNewLevel(level) {
    this.state.newLevel = level;
  }

  clearNewLevel() {
    this.state.newLevel = null;
  }

  addFloatingScore(score) {
    this.state.floatingScores = [...this.state.floatingScores, score];
  }

  addExplosion(explosion) {
    this.state.explosions = [...this.state.explosions, explosion];
  }

  addBonusEffect(effect) {
    this.state.bonusEffects = [...this.state.bonusEffects, effect];
  }

  updateCharacterUpgrade(index, upgrade) {
    const upgrades = new Map(this.state.characterUpgrades);
    upgrades.set(index, upgrade);
    this.state.characterUpgrades = upgrades;
  }

  getCharacterUpgrade(index) {
    return this.state.characterUpgrades.get(index) || { level: 0, speed: 'lame' };
  }

  // Cleanup methods
  cleanupFloatingScores() {
    const now = Date.now();
    this.state.floatingScores = this.state.floatingScores.filter(
      effect => now - effect.id < 2000
    );
  }

  cleanupExplosions() {
    const now = Date.now();
    this.state.explosions = this.state.explosions.filter(
      effect => now - effect.id < 1500
    );
  }

  cleanupPatternMatches() {
    const now = Date.now();
    this.state.patternMatches = this.state.patternMatches.filter(
      pattern => now - pattern.id < 3000
    );
  }

  cleanupBonusEffects() {
    const now = Date.now();
    this.state.bonusEffects = this.state.bonusEffects.filter(
      effect => now - effect.id < 1000
    );
  }

  // Reset state
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
  }

  // Get full state
  getState() {
    return { ...this.state };
  }
}