// Score Calculation Logic
import { ENGINE_CONFIG } from '../core/EngineConfig.js';

export class ScoreCalculator {
  constructor() {
    this.config = ENGINE_CONFIG.scoring;
  }

  calculateScore(speed, combo, streak, patterns) {
    const baseScore = this.config.baseScore;
    const speedBonus = this.config.speedBonus[speed] || this.config.speedBonus.lame;
    const comboBonus = combo * 3;
    const streakBonus = streak > 10 ? Math.floor(streak / 5) * 10 : 0;
    const patternBonus = patterns.reduce((sum, p) => sum + p.bonus, 0);
    const speedMultiplier = this.config.speedMultiplier[speed] || this.config.speedMultiplier.lame;

    return Math.round((baseScore + speedBonus + comboBonus + streakBonus + patternBonus) * speedMultiplier);
  }

  calculateXP(score) {
    return Math.floor(score / 10);
  }

  calculateLevelUp(currentXP, currentLevel) {
    const xpForNextLevel = currentLevel * 100;
    if (currentXP >= xpForNextLevel) {
      return {
        newLevel: currentLevel + 1,
        remainingXP: currentXP - xpForNextLevel
      };
    }
    return null;
  }

  getSpeedMultiplier(speed) {
    return this.config.speedMultiplier[speed] || this.config.speedMultiplier.lame;
  }

  getSpeedBonus(speed) {
    return this.config.speedBonus[speed] || this.config.speedBonus.lame;
  }
}