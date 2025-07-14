// Analytics and Progress Tracking System
export class AnalyticsTracker {
  constructor() {
    this.sessionData = {
      startTime: Date.now(),
      totalKeystrokes: 0,
      correctKeystrokes: 0,
      errors: 0,
      maxWpm: 0,
      maxAccuracy: 0,
      maxCombo: 0,
      maxStreak: 0,
      totalScore: 0,
      challengesCompleted: 0,
      achievementsUnlocked: [],
      patternsMatched: [],
      timeSpentTyping: 0,
      languages: new Set(),
      difficulties: new Set()
    };
    
    this.progressData = this.loadProgress();
    this.heatmapData = new Map(); // Character-level performance tracking
    this.performanceHistory = [];
    this.streakHistory = [];
    this.dailyStats = new Map();
    
    this.setupTracking();
  }

  // Load saved progress
  loadProgress() {
    try {
      const saved = localStorage.getItem('typing_progress_v2');
      return saved ? JSON.parse(saved) : this.getDefaultProgress();
    } catch (error) {
      console.warn('Failed to load progress:', error);
      return this.getDefaultProgress();
    }
  }

  getDefaultProgress() {
    return {
      totalSessions: 0,
      totalTime: 0,
      totalKeystrokes: 0,
      totalChallenges: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      longestStreak: 0,
      highestCombo: 0,
      totalScore: 0,
      level: 1,
      xp: 0,
      achievements: [],
      languageStats: {},
      difficultyStats: {},
      weeklyProgress: [],
      monthlyProgress: [],
      skillProgression: {
        speed: 1,
        accuracy: 1,
        consistency: 1,
        patterns: 1
      },
      personalBests: {
        fastestChallenge: null,
        mostAccurateChallenge: null,
        highestScoringChallenge: null,
        longestSession: null
      }
    };
  }

  // Setup automatic tracking
  setupTracking() {
    // Track session time
    this.sessionTimer = setInterval(() => {
      this.sessionData.timeSpentTyping += 1000;
    }, 1000);
    
    // Save progress periodically
    this.saveTimer = setInterval(() => {
      this.saveProgress();
    }, 30000); // Save every 30 seconds
    
    // Track daily stats
    this.updateDailyStats();
  }

  // Track keystroke
  trackKeystroke(char, isCorrect, speed, combo, streak) {
    this.sessionData.totalKeystrokes++;
    
    if (isCorrect) {
      this.sessionData.correctKeystrokes++;
      this.updateHeatmap(char, speed, true);
    } else {
      this.sessionData.errors++;
      this.updateHeatmap(char, 'error', false);
    }
    
    // Update maximums
    this.sessionData.maxCombo = Math.max(this.sessionData.maxCombo, combo);
    this.sessionData.maxStreak = Math.max(this.sessionData.maxStreak, streak);
    
    // Track performance point
    this.addPerformancePoint({
      timestamp: Date.now(),
      char,
      isCorrect,
      speed,
      combo,
      streak
    });
  }

  // Update character heatmap
  updateHeatmap(char, speed, isCorrect) {
    if (!this.heatmapData.has(char)) {
      this.heatmapData.set(char, {
        total: 0,
        correct: 0,
        speeds: { perfect: 0, best: 0, good: 0, lame: 0, error: 0 },
        accuracy: 100,
        averageSpeed: 'lame'
      });
    }
    
    const data = this.heatmapData.get(char);
    data.total++;
    
    if (isCorrect) {
      data.correct++;
      data.speeds[speed]++;
    } else {
      data.speeds.error++;
    }
    
    data.accuracy = (data.correct / data.total) * 100;
    
    // Calculate average speed
    const speedWeights = { perfect: 4, best: 3, good: 2, lame: 1, error: 0 };
    let totalWeight = 0;
    let weightedSum = 0;
    
    Object.entries(data.speeds).forEach(([speed, count]) => {
      const weight = speedWeights[speed];
      totalWeight += count;
      weightedSum += weight * count;
    });
    
    const avgWeight = weightedSum / totalWeight;
    if (avgWeight >= 3.5) data.averageSpeed = 'perfect';
    else if (avgWeight >= 2.5) data.averageSpeed = 'best';
    else if (avgWeight >= 1.5) data.averageSpeed = 'good';
    else data.averageSpeed = 'lame';
  }

  // Add performance data point
  addPerformancePoint(point) {
    this.performanceHistory.push(point);
    
    // Keep only last 1000 points for memory efficiency
    if (this.performanceHistory.length > 1000) {
      this.performanceHistory = this.performanceHistory.slice(-1000);
    }
  }

  // Track challenge completion
  trackChallengeComplete(stats, challenge) {
    this.sessionData.challengesCompleted++;
    this.sessionData.totalScore += stats.totalScore;
    this.sessionData.maxWpm = Math.max(this.sessionData.maxWpm, stats.wpm);
    this.sessionData.maxAccuracy = Math.max(this.sessionData.maxAccuracy, stats.accuracy);
    
    // Track language and difficulty
    this.sessionData.languages.add(challenge.language);
    this.sessionData.difficulties.add(challenge.difficulty);
    
    // Update progress data
    this.updateProgressData(stats, challenge);
    
    // Check for personal bests
    this.checkPersonalBests(stats, challenge);
    
    // Update skill progression
    this.updateSkillProgression(stats);
  }

  // Update overall progress
  updateProgressData(stats, challenge) {
    const progress = this.progressData;
    
    progress.totalChallenges++;
    progress.totalScore += stats.totalScore;
    progress.bestWpm = Math.max(progress.bestWpm, stats.wpm);
    progress.bestAccuracy = Math.max(progress.bestAccuracy, stats.accuracy);
    progress.longestStreak = Math.max(progress.longestStreak, stats.streak);
    progress.highestCombo = Math.max(progress.highestCombo, stats.maxCombo);
    
    // Update language stats
    if (!progress.languageStats[challenge.language]) {
      progress.languageStats[challenge.language] = {
        challenges: 0,
        totalScore: 0,
        bestWpm: 0,
        bestAccuracy: 0,
        averageWpm: 0,
        averageAccuracy: 0
      };
    }
    
    const langStats = progress.languageStats[challenge.language];
    langStats.challenges++;
    langStats.totalScore += stats.totalScore;
    langStats.bestWpm = Math.max(langStats.bestWpm, stats.wpm);
    langStats.bestAccuracy = Math.max(langStats.bestAccuracy, stats.accuracy);
    
    // Update difficulty stats
    if (!progress.difficultyStats[challenge.difficulty]) {
      progress.difficultyStats[challenge.difficulty] = {
        challenges: 0,
        totalScore: 0,
        averageWpm: 0,
        averageAccuracy: 0
      };
    }
    
    const diffStats = progress.difficultyStats[challenge.difficulty];
    diffStats.challenges++;
    diffStats.totalScore += stats.totalScore;
    
    // Calculate averages
    progress.averageWpm = this.calculateAverageWpm();
    progress.averageAccuracy = this.calculateAverageAccuracy();
  }

  // Check for personal bests
  checkPersonalBests(stats, challenge) {
    const bests = this.progressData.personalBests;
    
    // Fastest challenge
    if (!bests.fastestChallenge || stats.wpm > bests.fastestChallenge.wpm) {
      bests.fastestChallenge = {
        wpm: stats.wpm,
        challenge: challenge.title,
        date: new Date().toISOString()
      };
    }
    
    // Most accurate challenge
    if (!bests.mostAccurateChallenge || stats.accuracy > bests.mostAccurateChallenge.accuracy) {
      bests.mostAccurateChallenge = {
        accuracy: stats.accuracy,
        challenge: challenge.title,
        date: new Date().toISOString()
      };
    }
    
    // Highest scoring challenge
    if (!bests.highestScoringChallenge || stats.totalScore > bests.highestScoringChallenge.score) {
      bests.highestScoringChallenge = {
        score: stats.totalScore,
        challenge: challenge.title,
        date: new Date().toISOString()
      };
    }
  }

  // Update skill progression
  updateSkillProgression(stats) {
    const skills = this.progressData.skillProgression;
    
    // Speed progression (based on WPM)
    if (stats.wpm >= 60) skills.speed = Math.max(skills.speed, 5);
    else if (stats.wpm >= 45) skills.speed = Math.max(skills.speed, 4);
    else if (stats.wpm >= 30) skills.speed = Math.max(skills.speed, 3);
    else if (stats.wpm >= 20) skills.speed = Math.max(skills.speed, 2);
    
    // Accuracy progression
    if (stats.accuracy >= 98) skills.accuracy = Math.max(skills.accuracy, 5);
    else if (stats.accuracy >= 95) skills.accuracy = Math.max(skills.accuracy, 4);
    else if (stats.accuracy >= 90) skills.accuracy = Math.max(skills.accuracy, 3);
    else if (stats.accuracy >= 85) skills.accuracy = Math.max(skills.accuracy, 2);
    
    // Consistency progression (based on combo)
    if (stats.maxCombo >= 50) skills.consistency = Math.max(skills.consistency, 5);
    else if (stats.maxCombo >= 30) skills.consistency = Math.max(skills.consistency, 4);
    else if (stats.maxCombo >= 20) skills.consistency = Math.max(skills.consistency, 3);
    else if (stats.maxCombo >= 10) skills.consistency = Math.max(skills.consistency, 2);
    
    // Pattern recognition (based on achievements)
    const patternAchievements = stats.achievements || 0;
    if (patternAchievements >= 10) skills.patterns = Math.max(skills.patterns, 5);
    else if (patternAchievements >= 7) skills.patterns = Math.max(skills.patterns, 4);
    else if (patternAchievements >= 5) skills.patterns = Math.max(skills.patterns, 3);
    else if (patternAchievements >= 3) skills.patterns = Math.max(skills.patterns, 2);
  }

  // Track achievement unlock
  trackAchievement(achievement) {
    if (!this.sessionData.achievementsUnlocked.includes(achievement)) {
      this.sessionData.achievementsUnlocked.push(achievement);
      
      if (!this.progressData.achievements.includes(achievement)) {
        this.progressData.achievements.push(achievement);
      }
    }
  }

  // Track pattern match
  trackPatternMatch(pattern) {
    this.sessionData.patternsMatched.push({
      type: pattern.type,
      bonus: pattern.bonus,
      timestamp: Date.now()
    });
  }

  // Update daily stats
  updateDailyStats() {
    const today = new Date().toDateString();
    
    if (!this.dailyStats.has(today)) {
      this.dailyStats.set(today, {
        date: today,
        challenges: 0,
        keystrokes: 0,
        timeSpent: 0,
        bestWpm: 0,
        bestAccuracy: 0,
        totalScore: 0
      });
    }
  }

  // Calculate statistics
  calculateAverageWpm() {
    if (this.performanceHistory.length === 0) return 0;
    
    const recentPoints = this.performanceHistory.slice(-100);
    const wpmSum = recentPoints.reduce((sum, point) => {
      const speedValues = { perfect: 80, best: 60, good: 40, lame: 20 };
      return sum + (speedValues[point.speed] || 20);
    }, 0);
    
    return Math.round(wpmSum / recentPoints.length);
  }

  calculateAverageAccuracy() {
    if (this.performanceHistory.length === 0) return 100;
    
    const recentPoints = this.performanceHistory.slice(-100);
    const correctCount = recentPoints.filter(p => p.isCorrect).length;
    
    return Math.round((correctCount / recentPoints.length) * 100);
  }

  // Get analytics data
  getSessionStats() {
    return {
      ...this.sessionData,
      sessionAccuracy: this.sessionData.totalKeystrokes > 0 ? 
        Math.round((this.sessionData.correctKeystrokes / this.sessionData.totalKeystrokes) * 100) : 100,
      languages: Array.from(this.sessionData.languages),
      difficulties: Array.from(this.sessionData.difficulties)
    };
  }

  getProgressStats() {
    return this.progressData;
  }

  getHeatmapData() {
    return Object.fromEntries(this.heatmapData);
  }

  getPerformanceHistory() {
    return this.performanceHistory.slice(-100); // Last 100 points
  }

  // Get insights and recommendations
  getInsights() {
    const insights = [];
    const heatmap = this.getHeatmapData();
    
    // Find problem characters
    const problemChars = Object.entries(heatmap)
      .filter(([char, data]) => data.accuracy < 80 && data.total > 5)
      .sort((a, b) => a[1].accuracy - b[1].accuracy)
      .slice(0, 3);
    
    if (problemChars.length > 0) {
      insights.push({
        type: 'improvement',
        title: 'Focus on Problem Characters',
        description: `Practice these characters: ${problemChars.map(([char]) => char).join(', ')}`,
        priority: 'high'
      });
    }
    
    // Speed recommendations
    if (this.progressData.averageWpm < 30) {
      insights.push({
        type: 'speed',
        title: 'Build Typing Speed',
        description: 'Focus on consistent rhythm rather than bursts of speed',
        priority: 'medium'
      });
    }
    
    // Accuracy recommendations
    if (this.progressData.averageAccuracy < 90) {
      insights.push({
        type: 'accuracy',
        title: 'Improve Accuracy',
        description: 'Slow down and focus on correct keystrokes',
        priority: 'high'
      });
    }
    
    return insights;
  }

  // Save progress
  saveProgress() {
    try {
      // Update session totals
      this.progressData.totalSessions++;
      this.progressData.totalTime += this.sessionData.timeSpentTyping;
      this.progressData.totalKeystrokes += this.sessionData.totalKeystrokes;
      
      localStorage.setItem('typing_progress_v2', JSON.stringify(this.progressData));
    } catch (error) {
      console.warn('Failed to save progress:', error);
    }
  }

  // Export data
  exportData() {
    return {
      session: this.getSessionStats(),
      progress: this.getProgressStats(),
      heatmap: this.getHeatmapData(),
      performance: this.getPerformanceHistory(),
      insights: this.getInsights(),
      exportDate: new Date().toISOString()
    };
  }

  // Cleanup
  destroy() {
    if (this.sessionTimer) clearInterval(this.sessionTimer);
    if (this.saveTimer) clearInterval(this.saveTimer);
    this.saveProgress();
  }
}