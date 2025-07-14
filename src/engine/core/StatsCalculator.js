// Statistics Calculator - Handles WPM, accuracy, and performance metrics
export class StatsCalculator {
  constructor(engineState) {
    this.state = engineState;
    this.updateInterval = null;
  }

  startCalculating() {
    this.updateInterval = setInterval(() => {
      this.updateStats();
    }, 100);
  }

  stopCalculating() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  updateStats() {
    if (!this.state.state.startTime) return;

    const now = Date.now();
    const timeElapsed = (now - this.state.state.startTime) / 1000 / 60; // minutes
    const wordsTyped = this.state.getTypedText().length / 5; // standard word length
    const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
    const currentAccuracy = Math.round(((this.state.getTypedText().length - this.state.getErrors()) / Math.max(this.state.getTypedText().length, 1)) * 100) || 100;

    this.state.setWPM(currentWpm);
    this.state.setAccuracy(currentAccuracy);
  }

  calculateFinalStats() {
    if (!this.state.state.startTime) return null;

    const timeElapsed = (Date.now() - this.state.state.startTime) / 1000;
    const wordsTyped = this.state.getTypedText().length / 5;
    const finalWpm = Math.round((wordsTyped / (timeElapsed / 60))) || 0;
    const finalAccuracy = Math.round(((this.state.getTypedText().length - this.state.getErrors()) / Math.max(this.state.getTypedText().length, 1)) * 100) || 100;

    return {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      errors: this.state.getErrors(),
      timeElapsed,
      wordsTyped,
      charactersTyped: this.state.getTypedText().length,
      correctCharacters: this.state.getTypedText().length - this.state.getErrors(),
      streak: this.state.getStreak(),
      maxCombo: this.state.getMaxCombo(),
      perfectStreak: this.state.getPerfectStreak(),
      totalScore: this.state.getTotalScore(),
      level: this.state.getLevel(),
      xp: this.state.getXP()
    };
  }

  getPerformanceMetrics() {
    const recentChars = this.state.state.recentlyTyped.slice(-20);
    
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

    // Calculate consistency (lower variance = higher consistency)
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

  getTypingRhythm() {
    const recentChars = this.state.state.recentlyTyped.slice(-10);
    
    if (recentChars.length < 2) {
      return { rhythm: 'unknown', stability: 0, pattern: 'none' };
    }

    // Calculate time differences between keystrokes
    const timeDiffs = [];
    for (let i = 1; i < recentChars.length; i++) {
      timeDiffs.push(recentChars[i].timeDiff);
    }

    // Calculate rhythm stability
    const avgTimeDiff = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
    const variance = timeDiffs.reduce((sum, diff) => {
      const deviation = diff - avgTimeDiff;
      return sum + (deviation * deviation);
    }, 0) / timeDiffs.length;
    
    const stability = Math.max(0, Math.round((1 - (Math.sqrt(variance) / avgTimeDiff)) * 100));

    // Determine rhythm type
    let rhythm = 'irregular';
    if (stability >= 80) rhythm = 'very-steady';
    else if (stability >= 60) rhythm = 'steady';
    else if (stability >= 40) rhythm = 'moderate';

    // Detect patterns
    let pattern = 'none';
    const isAccelerating = timeDiffs.every((diff, i) => i === 0 || diff <= timeDiffs[i - 1]);
    const isDecelerating = timeDiffs.every((diff, i) => i === 0 || diff >= timeDiffs[i - 1]);
    
    if (isAccelerating) pattern = 'accelerating';
    else if (isDecelerating) pattern = 'decelerating';
    else if (stability >= 70) pattern = 'consistent';

    return {
      rhythm,
      stability,
      pattern,
      avgTimeDiff: Math.round(avgTimeDiff),
      variance: Math.round(variance)
    };
  }

  destroy() {
    this.stopCalculating();
  }
}