// Typing Processing Logic - Handles character input and validation
import { CustomEventEmitter } from './EventEmitter.js';
import { ScoreCalculator } from '../processors/ScoreCalculator.js';
import { PatternMatcher } from '../processors/PatternMatcher.js';
import { AchievementChecker } from '../processors/AchievementChecker.js';
import { SpeedAnalyzer } from '../processors/SpeedAnalyzer.js';

export class TypingProcessor extends CustomEventEmitter {
  constructor(engineState, config) {
    super();
    this.state = engineState;
    this.config = config;
    this.targetText = '';
    
    // Initialize processors
    this.scoreCalculator = new ScoreCalculator();
    this.patternMatcher = new PatternMatcher();
    this.achievementChecker = new AchievementChecker();
    this.speedAnalyzer = new SpeedAnalyzer();
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
    const speed = this.speedAnalyzer.getTypingSpeed(timeDiff);

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
    const newCombo = this.speedAnalyzer.updateCombo(this.state.getCombo(), speed, timeDiff);
    this.state.setCombo(newCombo);
    this.state.updateMaxCombo(newCombo);
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
    const patterns = this.patternMatcher.checkPatterns(
      newTypedText, 
      this.state.getCombo(), 
      this.state.state.recentlyTyped
    );
    patterns.forEach(pattern => this.state.addPatternMatch(pattern));

    // Calculate and add score
    const score = this.scoreCalculator.calculateScore(
      speed, 
      this.state.getCombo(), 
      this.state.getStreak(), 
      patterns
    );
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

  updateXP(score) {
    const xpGained = this.scoreCalculator.calculateXP(score);
    this.state.setXP(this.state.getXP() + xpGained);

    // Check for level up
    const levelUp = this.scoreCalculator.calculateLevelUp(
      this.state.getXP(), 
      this.state.getLevel()
    );
    
    if (levelUp) {
      const oldLevel = this.state.getLevel();
      this.state.setLevel(levelUp.newLevel);
      this.state.setXP(levelUp.remainingXP);
      this.state.setNewLevel(levelUp.newLevel);

      this.emit('levelUp', { oldLevel, newLevel: levelUp.newLevel });
    }
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
    const newAchievements = this.achievementChecker.checkAchievements(
      stats, 
      this.state.state.achievements
    );

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

  getPerformanceMetrics() {
    return this.speedAnalyzer.getPerformanceMetrics(this.state.state.recentlyTyped.slice(-20));
  }
}