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