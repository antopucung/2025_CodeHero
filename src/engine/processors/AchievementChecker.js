// Achievement Checking Logic
import { ACHIEVEMENT_DEFINITIONS } from '../core/EngineConfig.js';

export class AchievementChecker {
  constructor() {
    this.achievements = ACHIEVEMENT_DEFINITIONS;
  }

  checkAchievements(stats, currentAchievements) {
    const newAchievements = [];

    // Speed Demon - 15+ perfect streak
    if (stats.perfectStreak >= 15 && !currentAchievements.includes('speed_demon')) {
      newAchievements.push('speed_demon');
    }

    // Combo Master - 50+ combo
    if (stats.maxCombo >= 50 && !currentAchievements.includes('combo_master')) {
      newAchievements.push('combo_master');
    }

    // Perfectionist - 100% accuracy
    if (stats.accuracy === 100 && !currentAchievements.includes('perfectionist')) {
      newAchievements.push('perfectionist');
    }

    // Speed Racer - 60+ WPM
    if (stats.wpm >= 60 && !currentAchievements.includes('speed_racer')) {
      newAchievements.push('speed_racer');
    }

    // High Scorer - 5000+ points
    if (stats.totalScore >= 5000 && !currentAchievements.includes('high_scorer')) {
      newAchievements.push('high_scorer');
    }

    return newAchievements;
  }

  getAchievementData(type) {
    return this.achievements[type] || this.achievements.speed_demon;
  }

  getAllAchievements() {
    return Object.keys(this.achievements);
  }
}