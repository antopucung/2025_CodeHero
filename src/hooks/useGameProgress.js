import { useState, useEffect } from 'react';

const STORAGE_KEY = 'terminal_ide_progress';

export const useGameProgress = () => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      level: 1,
      xp: 0,
      totalChallengesCompleted: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      achievements: [],
      dailyStreak: 0,
      lastPlayDate: null,
      optimizations: {
        performance: { mode: 'auto', fps: 60 },
        mobile: { isMobile: false, touchSupport: false },
        effects: { particleCount: 1, animationDuration: 1 }
      },
      languageProgress: {
        javascript: { level: 1, xp: 0 },
        python: { level: 1, xp: 0 },
        typescript: { level: 1, xp: 0 },
        java: { level: 1, xp: 0 },
        csharp: { level: 1, xp: 0 },
        php: { level: 1, xp: 0 }
      }
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const addXP = (amount, language = null) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      newProgress.xp += amount;
      
      // Level up logic
      const xpForNextLevel = newProgress.level * 100;
      if (newProgress.xp >= xpForNextLevel) {
        newProgress.level += 1;
        newProgress.xp = newProgress.xp - xpForNextLevel;
      }
      
      // Language-specific progress
      if (language && newProgress.languageProgress[language]) {
        newProgress.languageProgress[language].xp += amount;
        const langXpForNext = newProgress.languageProgress[language].level * 50;
        if (newProgress.languageProgress[language].xp >= langXpForNext) {
          newProgress.languageProgress[language].level += 1;
          newProgress.languageProgress[language].xp -= langXpForNext;
        }
      }
      
      return newProgress;
    });
  };

  const completeChallenge = (stats, language) => {
    setProgress(prev => {
      const newProgress = { ...prev };
      newProgress.totalChallengesCompleted += 1;
      
      // Update best stats
      if (stats.wpm > newProgress.bestWpm) {
        newProgress.bestWpm = stats.wpm;
      }
      if (stats.accuracy > newProgress.bestAccuracy) {
        newProgress.bestAccuracy = stats.accuracy;
      }
      
      // Calculate XP based on performance
      let xpGained = 10; // Base XP
      xpGained += Math.floor(stats.wpm / 10) * 5; // WPM bonus
      xpGained += Math.floor(stats.accuracy / 10) * 2; // Accuracy bonus
      
      addXP(xpGained, language);
      
      // Check for new achievements
      checkAchievements(newProgress, stats);
      
      return newProgress;
    });
  };

  const checkAchievements = (currentProgress, stats) => {
    const achievements = [];
    
    if (stats.wpm >= 50 && !currentProgress.achievements.includes('speed_demon')) {
      achievements.push('speed_demon');
    }
    if (stats.accuracy >= 95 && !currentProgress.achievements.includes('perfectionist')) {
      achievements.push('perfectionist');
    }
    if (currentProgress.totalChallengesCompleted >= 10 && !currentProgress.achievements.includes('dedicated_coder')) {
      achievements.push('dedicated_coder');
    }
    
    if (achievements.length > 0) {
      setProgress(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...achievements]
      }));
    }
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress({
      level: 1,
      xp: 0,
      totalChallengesCompleted: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      achievements: [],
      dailyStreak: 0,
      lastPlayDate: null,
      languageProgress: {
        javascript: { level: 1, xp: 0 },
        python: { level: 1, xp: 0 },
        typescript: { level: 1, xp: 0 },
        java: { level: 1, xp: 0 },
        csharp: { level: 1, xp: 0 },
        php: { level: 1, xp: 0 }
      }
    });
  };

  return {
    progress,
    addXP,
    completeChallenge,
    resetProgress
  };
};