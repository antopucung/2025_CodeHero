// Speed Analysis Logic
import { ENGINE_CONFIG } from '../core/EngineConfig.js';

export class SpeedAnalyzer {
  constructor() {
    this.thresholds = ENGINE_CONFIG.speedThresholds;
  }

  getTypingSpeed(timeDiff) {
    if (timeDiff < this.thresholds.perfect) return 'perfect';
    if (timeDiff < this.thresholds.best) return 'best';
    if (timeDiff < this.thresholds.good) return 'good';
    return 'lame';
  }

  updateCombo(currentCombo, speed, timeDiff) {
    if (speed === 'perfect') {
      return Math.min(currentCombo + 2, 100);
    } else if (speed === 'best') {
      return Math.min(currentCombo + 1, 100);
    } else if (timeDiff > 600) {
      return Math.max(1, currentCombo - 1);
    }
    return currentCombo;
  }

  calculateAnticipationLevel(speedHistory) {
    if (speedHistory.length === 0) return 1;
    
    const speedValues = { perfect: 4, best: 3, good: 2, lame: 1 };
    const avgSpeed = speedHistory.reduce((sum, speed) => {
      return sum + (speedValues[speed] || 1);
    }, 0) / speedHistory.length;
    
    return Math.max(1, Math.min(avgSpeed, 4));
  }

  getPerformanceMetrics(recentChars) {
    if (recentChars.length === 0) {
      return {
        averageSpeed: 'lame',
        speedDistribution: { perfect: 0, best: 0, good: 0, lame: 100 },
        consistency: 0,
        trend: 'stable'
      };
    }

    // Calculate speed distribution
    const speedCounts = { perfect: 0, best: 0, good: 0, lame: 0 };
    recentChars.forEach(char => {
      speedCounts[char.speed]++;
    });

    const total = recentChars.length;
    const speedDistribution = {
      perfect: Math.round((speedCounts.perfect / total) * 100),
      best: Math.round((speedCounts.best / total) * 100),
      good: Math.round((speedCounts.good / total) * 100),
      lame: Math.round((speedCounts.lame / total) * 100)
    };

    // Calculate average speed
    const speedValues = { perfect: 4, best: 3, good: 2, lame: 1 };
    const avgSpeedValue = recentChars.reduce((sum, char) => sum + speedValues[char.speed], 0) / total;
    
    let averageSpeed = 'lame';
    if (avgSpeedValue >= 3.5) averageSpeed = 'perfect';
    else if (avgSpeedValue >= 2.5) averageSpeed = 'best';
    else if (avgSpeedValue >= 1.5) averageSpeed = 'good';

    // Calculate consistency
    const variance = recentChars.reduce((sum, char) => {
      const diff = speedValues[char.speed] - avgSpeedValue;
      return sum + (diff * diff);
    }, 0) / total;
    
    const consistency = Math.max(0, Math.round((1 - (variance / 4)) * 100));

    // Calculate trend
    const firstHalf = recentChars.slice(0, Math.floor(total / 2));
    const secondHalf = recentChars.slice(Math.floor(total / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, char) => sum + speedValues[char.speed], 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, char) => sum + speedValues[char.speed], 0) / secondHalf.length;
    
    let trend = 'stable';
    if (secondHalfAvg > firstHalfAvg + 0.3) trend = 'improving';
    else if (secondHalfAvg < firstHalfAvg - 0.3) trend = 'declining';

    return {
      averageSpeed,
      speedDistribution,
      consistency,
      trend,
      recentPerformance: {
        avgSpeedValue: Math.round(avgSpeedValue * 100) / 100,
        variance: Math.round(variance * 100) / 100
      }
    };
  }
}