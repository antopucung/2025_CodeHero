// Typing Processing Logic - Handles character input and validation
import { CustomEventEmitter } from './TypingEngine.js';

export class TypingProcessor extends CustomEventEmitter {
  constructor(engineState, config) {
    super();
    this.state = engineState;
    this.config = config;
    this.targetText = '';
  }

  setTargetText(text) {
    this.targetText = text;
  }

  // Process key press
  processKeyPress(char) {
    if (!this.state.isActiveSession() && !this.state.state.startTime) {
      this.state.setStartTime(Date.now());
      this.state.setActive(true);
      this.emit('start');
    }

    const expectedChar = this.targetText[this.state.getCurrentIndex()];
    const now = Date.now();
    const isCorrect = char === expectedChar;
    const timeDiff = this.state.state.lastCorrectTime ? now - this.state.state.lastCorrectTime : 200;
    const speed = this.getTypingSpeed(timeDiff);

    if (isCorrect) {
      this.processCorrectChar(char, speed, now, timeDiff);
    } else {
      this.processIncorrectChar(char);
    }

    this.emit('characterProcessed', {
      char,
      isCorrect,
      speed,
      index: this.state.getCurrentIndex()
    });

    // Check completion
    if (this.state.getCurrentIndex() >= this.targetText.length) {
      this.complete();
    }
  }

  // Process correct character
  processCorrectChar(char, speed, now, timeDiff) {
    const newTypedText = this.state.getTypedText() + char;
    this.state.setTypedText(newTypedText);
    this.state.setCurrentIndex(this.state.getCurrentIndex() + 1);

    // Update speed tracking
    this.state.updateSpeedHistory(speed);

    // Update streak and combo
    this.state.setStreak(this.state.getStreak() + 1);
    this.updateCombo(speed, timeDiff);
    this.state.setLastCorrectTime(now);

    // Check for perfect streak milestones
    if (speed === 'perfect') {
      this.state.setPerfectStreak(this.state.getPerfectStreak() + 1);
    }

    // Track character performance
    const charData = {
      char,
      index: this.state.getCurrentIndex() - 1,
      time: now,
      combo: this.state.getCombo(),
      speed,
      timeDiff
    };

    this.state.addRecentlyTyped(charData);

    // Check for patterns and bonuses
    const patterns = this.checkPatterns(newTypedText, this.state.getCombo());
    patterns.forEach(pattern => this.state.addPatternMatch(pattern));

    // Calculate and add score
    const score = this.calculateScore(speed, this.state.getCombo(), this.state.getStreak(), patterns);
    this.state.addScore(score);

    // Update XP and check for level up
    this.updateXP(score);

    // Emit events for effects
    this.emit('correctChar', {
      char,
      speed,
      combo: this.state.getCombo(),
      patterns,
      score,
      totalScore: this.state.getTotalScore()
    });
  }

  // Process incorrect character
  processIncorrectChar(char) {
    this.state.incrementErrors();
    this.state.setStreak(0);
    this.state.setCombo(1);
    this.state.setPerfectStreak(0);
    this.state.setTypingSpeed('lame');

    this.emit('incorrectChar', {
      char,
      totalScore: this.state.getTotalScore()
    });
  }

  // Helper methods
  getTypingSpeed(timeDiff) {
    if (timeDiff < this.config.speedThresholds.perfect) return 'perfect';
    if (timeDiff < this.config.speedThresholds.best) return 'best';
    if (timeDiff < this.config.speedThresholds.good) return 'good';
    return 'lame';
  }

  updateCombo(speed, timeDiff) {
    if (speed === 'perfect') {
      this.state.setCombo(Math.min(this.state.getCombo() + 2, 100));
    } else if (speed === 'best') {
      this.state.setCombo(Math.min(this.state.getCombo() + 1, 100));
    } else if (timeDiff > 600) {
      this.state.setCombo(Math.max(1, this.state.getCombo() - 1));
    }

    this.state.updateMaxCombo(this.state.getCombo());
  }

  calculateScore(speed, combo, streak, patterns) {
    const baseScore = 15;
    const speedBonus = { perfect: 50, best: 30, good: 20, lame: 10 }[speed];
    const comboBonus = combo * 3;
    const streakBonus = streak > 10 ? Math.floor(streak / 5) * 10 : 0;
    const patternBonus = patterns.reduce((sum, p) => sum + p.bonus, 0);
    const speedMultiplier = { perfect: 2, best: 1.5, good: 1.2, lame: 1 }[speed];

    return Math.round((baseScore + speedBonus + comboBonus + streakBonus + patternBonus) * speedMultiplier);
  }

  updateXP(score) {
    const xpGained = Math.floor(score / 10);
    this.state.setXP(this.state.getXP() + xpGained);

    // Check for level up
    const xpForNextLevel = this.state.getLevel() * 100;
    if (this.state.getXP() >= xpForNextLevel) {
      const oldLevel = this.state.getLevel();
      this.state.setLevel(this.state.getLevel() + 1);
      this.state.setXP(this.state.getXP() - xpForNextLevel);
      this.state.setNewLevel(this.state.getLevel());

      this.emit('levelUp', { oldLevel, newLevel: this.state.getLevel() });
    }
  }

  checkPatterns(newTypedText, currentCombo) {
    const patterns = [];
    const recentChars = this.state.state.recentlyTyped.slice(-5);
    const perfectCount = recentChars.filter(char => char.speed === 'perfect').length;

    // Perfect streak pattern
    if (perfectCount >= 3) {
      patterns.push({
        type: 'perfect_streak',
        count: perfectCount,
        bonus: perfectCount * 75,
        color: '#ff6b6b',
        id: Date.now() + Math.random()
      });
    }

    // Function/method pattern detection
    const recentText = newTypedText.slice(-10);
    if (recentText.includes('function') || recentText.includes('const ') || recentText.includes('let ')) {
      patterns.push({
        type: 'function_declaration',
        bonus: 150,
        color: '#4ecdc4',
        id: Date.now() + Math.random()
      });
    }

    // Advanced coding patterns
    if (recentText.includes('class ') || recentText.includes('interface ') || recentText.includes('type ')) {
      patterns.push({
        type: 'advanced_syntax',
        bonus: 200,
        color: '#ff6b6b',
        id: Date.now() + Math.random()
      });
    }

    // Combo milestones
    if (currentCombo > 0 && currentCombo % 10 === 0) {
      patterns.push({
        type: 'combo_milestone',
        combo: currentCombo,
        bonus: currentCombo * 15,
        color: '#ffd93d',
        id: Date.now() + Math.random()
      });
    }

    return patterns;
  }

  complete() {
    this.state.setComplete(true);
    this.state.setActive(false);

    const finalStats = {
      wpm: this.state.getWPM(),
      accuracy: this.state.getAccuracy(),
      errors: this.state.getErrors(),
      timeElapsed: (Date.now() - this.state.state.startTime) / 1000,
      streak: this.state.getStreak(),
      maxCombo: this.state.getMaxCombo(),
      totalScore: this.state.getTotalScore(),
      perfectStreak: this.state.getPerfectStreak(),
      achievements: this.state.state.achievements.length,
      level: this.state.getLevel(),
      xp: this.state.getXP()
    };

    this.checkAchievements(finalStats);
    this.emit('complete', finalStats);
  }

  checkAchievements(stats) {
    const newAchievements = [];

    if (stats.perfectStreak >= 10 && !this.state.state.achievements.includes('speed_demon')) {
      newAchievements.push('speed_demon');
    }

    if (stats.maxCombo >= 50 && !this.state.state.achievements.includes('combo_master')) {
      newAchievements.push('combo_master');
    }

    if (stats.accuracy === 100 && !this.state.state.achievements.includes('perfectionist')) {
      newAchievements.push('perfectionist');
    }

    if (stats.wpm >= 60 && !this.state.state.achievements.includes('speed_racer')) {
      newAchievements.push('speed_racer');
    }

    if (stats.totalScore >= 5000 && !this.state.state.achievements.includes('high_scorer')) {
      newAchievements.push('high_scorer');
    }

    newAchievements.forEach(achievement => {
      this.state.addAchievement(achievement);
      this.emit('achievement', achievement);
    });
  }

  // Character status helpers
  getCharacterStatus(index) {
    if (index < this.state.getTypedText().length) {
      return this.targetText[index] === this.state.getTypedText()[index] ? 'correct' : 'incorrect';
    } else if (index === this.state.getCurrentIndex()) {
      return 'current';
    }
    return 'pending';
  }

  getCharacterSpeed(index) {
    const charData = this.state.state.recentlyTyped.find(char => char.index === index);
    return charData?.speed || 'lame';
  }

  getProgress() {
    return (this.state.getCurrentIndex() / this.targetText.length) * 100;
  }
}