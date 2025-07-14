// Analytics Tracker - Tracks user progress and performance
export class AnalyticsTracker {
  constructor() {
    this.sessionData = {
      startTime: Date.now(),
      keystrokes: [],
      challenges: [],
      achievements: [],
      patterns: [],
      errors: []
    };
    
    this.progressData = {
      totalSessions: 0,
      totalKeystrokes: 0,
      totalChallenges: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      bestWpm: 0,
      bestAccuracy: 0
    };
    
    this.heatmapData = new Map();
    this.loadProgressData();
  }
  
  trackKeystroke(char, isCorrect, speed, combo, streak) {
    const keystroke = {
      char,
      isCorrect,
      speed,
      combo,
      streak,
      timestamp: Date.now()
    };
    
    this.sessionData.keystrokes.push(keystroke);
    this.updateHeatmap(char, isCorrect);
  }
  
  trackChallengeComplete(stats, challengeInfo) {
    const challenge = {
      ...stats,
      ...challengeInfo,
      timestamp: Date.now(),
      sessionId: this.sessionData.startTime
    };
    
    this.sessionData.challenges.push(challenge);
    this.updateProgressData(stats);
  }
  
  trackAchievement(achievement) {
    const achievementData = {
      type: achievement,
      timestamp: Date.now(),
      sessionId: this.sessionData.startTime
    };
    
    this.sessionData.achievements.push(achievementData);
  }
  
  trackPatternMatch(pattern) {
    const patternData = {
      ...pattern,
      timestamp: Date.now(),
      sessionId: this.sessionData.startTime
    };
    
    this.sessionData.patterns.push(patternData);
  }
  
  updateHeatmap(char, isCorrect) {
    const key = char.toLowerCase();
    const current = this.heatmapData.get(key) || { correct: 0, incorrect: 0 };
    
    if (isCorrect) {
      current.correct++;
    } else {
      current.incorrect++;
    }
    
    this.heatmapData.set(key, current);
  }
  
  updateProgressData(stats) {
    this.progressData.totalChallenges++;
    this.progressData.totalKeystrokes += this.sessionData.keystrokes.length;
    
    // Update averages
    const challenges = this.sessionData.challenges;
    if (challenges.length > 0) {
      this.progressData.averageWpm = Math.round(
        challenges.reduce((sum, c) => sum + c.wpm, 0) / challenges.length
      );
      this.progressData.averageAccuracy = Math.round(
        challenges.reduce((sum, c) => sum + c.accuracy, 0) / challenges.length
      );
    }
    
    // Update bests
    this.progressData.bestWpm = Math.max(this.progressData.bestWpm, stats.wpm);
    this.progressData.bestAccuracy = Math.max(this.progressData.bestAccuracy, stats.accuracy);
    
    this.saveProgressData();
  }
  
  getSessionStats() {
    const session = this.sessionData;
    const duration = Date.now() - session.startTime;
    
    return {
      duration: Math.round(duration / 1000),
      keystrokes: session.keystrokes.length,
      challenges: session.challenges.length,
      achievements: session.achievements.length,
      patterns: session.patterns.length,
      accuracy: session.keystrokes.length > 0 ? 
        Math.round((session.keystrokes.filter(k => k.isCorrect).length / session.keystrokes.length) * 100) : 100
    };
  }
  
  getProgressStats() {
    return { ...this.progressData };
  }
  
  getHeatmapData() {
    const heatmap = {};
    this.heatmapData.forEach((value, key) => {
      const total = value.correct + value.incorrect;
      heatmap[key] = {
        ...value,
        total,
        accuracy: total > 0 ? Math.round((value.correct / total) * 100) : 100
      };
    });
    return heatmap;
  }
  
  getInsights() {
    const heatmap = this.getHeatmapData();
    const sessionStats = this.getSessionStats();
    
    // Find problematic characters
    const problematicChars = Object.entries(heatmap)
      .filter(([char, data]) => data.total >= 5 && data.accuracy < 80)
      .sort((a, b) => a[1].accuracy - b[1].accuracy)
      .slice(0, 5)
      .map(([char]) => char);
    
    // Find strong characters
    const strongChars = Object.entries(heatmap)
      .filter(([char, data]) => data.total >= 5 && data.accuracy >= 95)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 5)
      .map(([char]) => char);
    
    return {
      problematicChars,
      strongChars,
      sessionProgress: sessionStats,
      recommendations: this.generateRecommendations(problematicChars, sessionStats)
    };
  }
  
  generateRecommendations(problematicChars, sessionStats) {
    const recommendations = [];
    
    if (problematicChars.length > 0) {
      recommendations.push(`Focus on improving accuracy with: ${problematicChars.join(', ')}`);
    }
    
    if (sessionStats.accuracy < 90) {
      recommendations.push('Slow down and focus on accuracy over speed');
    }
    
    if (sessionStats.challenges < 3) {
      recommendations.push('Complete more challenges to improve consistency');
    }
    
    return recommendations;
  }
  
  loadProgressData() {
    try {
      const saved = localStorage.getItem('typing_analytics_progress');
      if (saved) {
        this.progressData = { ...this.progressData, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load analytics data:', error);
    }
  }
  
  saveProgressData() {
    try {
      localStorage.setItem('typing_analytics_progress', JSON.stringify(this.progressData));
    } catch (error) {
      console.warn('Failed to save analytics data:', error);
    }
  }
  
  exportData() {
    return {
      session: this.sessionData,
      progress: this.progressData,
      heatmap: this.getHeatmapData(),
      insights: this.getInsights()
    };
  }
  
  destroy() {
    this.saveProgressData();
  }
}