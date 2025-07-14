import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

export const useTypingGame = (targetText = '', onComplete = null, onCharacterTyped = null, currentLevel = 1) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isComplete, setIsComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [combo, setCombo] = useState(1);
  const [maxCombo, setMaxCombo] = useState(1);
  const [lastCorrectTime, setLastCorrectTime] = useState(null);
  const [explosions, setExplosions] = useState([]);
  const [floatingScores, setFloatingScores] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [comboLevel, setComboLevel] = useState(1);
  const [recentlyTyped, setRecentlyTyped] = useState([]);
  
  // New addictive features
  const [typingSpeed, setTypingSpeed] = useState('lame'); // lame, good, best, perfect
  const [speedHistory, setSpeedHistory] = useState([]);
  const [patternMatches, setPatternMatches] = useState([]);
  const [bonusEffects, setBonusEffects] = useState([]);
  const [characterUpgrades, setCharacterUpgrades] = useState(new Map());
  const [anticipationLevel, setAnticipationLevel] = useState(0);
  const [perfectStreak, setPerfectStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);
  
  const intervalRef = useRef(null);

  // Speed thresholds (milliseconds between keystrokes)
  const SPEED_THRESHOLDS = {
    perfect: 120,  // < 120ms = perfect
    best: 180,     // 120-180ms = best  
    good: 250,     // 180-250ms = good
    lame: 999      // > 250ms = lame
  };

  // Color systems for different performance levels
  const ANTICIPATION_COLORS = {
    perfect: {
      bg: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 50%, #ff6b6b 100%)',
      glow: '#ff6b6b',
      pulse: 3
    },
    best: {
      bg: 'linear-gradient(135deg, #ffd93d 0%, #ffeb3b 50%, #ffd93d 100%)',
      glow: '#ffd93d',
      pulse: 2.5
    },
    good: {
      bg: 'linear-gradient(135deg, #4ecdc4 0%, #45b7d1 50%, #4ecdc4 100%)',
      glow: '#4ecdc4',
      pulse: 2
    },
    lame: {
      bg: 'linear-gradient(135deg, #666 0%, #888 50%, #666 100%)',
      glow: '#666',
      pulse: 1
    }
  };

  const RESULT_COLORS = {
    perfect: {
      bg: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 25%, #ffb3b3 50%, #ff8e8e 75%, #ff6b6b 100%)',
      glow: '#ff6b6b',
      shadow: '0 0 40px #ff6b6b, 0 0 20px #ff8e8e, inset 0 0 20px rgba(255, 107, 107, 0.4)'
    },
    best: {
      bg: 'linear-gradient(135deg, #ffd93d 0%, #ffed4e 25%, #fff176 50%, #ffed4e 75%, #ffd93d 100%)',
      glow: '#ffd93d',
      shadow: '0 0 35px #ffd93d, 0 0 15px #ffc107, inset 0 0 15px rgba(255, 217, 61, 0.4)'
    },
    good: {
      bg: 'linear-gradient(135deg, #4ecdc4 0%, #5ed9d1 25%, #80deea 50%, #5ed9d1 75%, #4ecdc4 100%)',
      glow: '#4ecdc4',
      shadow: '0 0 30px #4ecdc4, 0 0 12px #00bcd4, inset 0 0 12px rgba(78, 205, 196, 0.3)'
    },
    lame: {
      bg: 'linear-gradient(135deg, #00e676 0%, #00ff00 25%, #69f0ae 50%, #00ff00 75%, #00e676 100%)',
      glow: '#00ff00',
      shadow: '0 0 20px #00ff00, 0 0 8px #00e676, inset 0 0 8px rgba(0, 255, 0, 0.3)'
    }
  };

  const calculateStats = useCallback(() => {
    if (!startTime) return;
    
    const now = Date.now();
    const timeElapsed = (now - startTime) / 1000 / 60; // minutes
    const wordsTyped = typedText.length / 5; // standard word length
    const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
    const currentAccuracy = Math.round(((typedText.length - errors) / Math.max(typedText.length, 1)) * 100) || 100;
    
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
  }, [startTime, typedText.length, errors]);

  // Determine typing speed based on time between keystrokes
  const getTypingSpeed = useCallback((timeDiff) => {
    if (timeDiff < SPEED_THRESHOLDS.perfect) return 'perfect';
    if (timeDiff < SPEED_THRESHOLDS.best) return 'best';
    if (timeDiff < SPEED_THRESHOLDS.good) return 'good';
    return 'lame';
  }, []);

  // Calculate anticipation level based on recent typing speed
  const updateAnticipationLevel = useCallback((speed) => {
    const speedValues = { perfect: 4, best: 3, good: 2, lame: 1 };
    const newHistory = [...speedHistory.slice(-4), speedValues[speed]];
    setSpeedHistory(newHistory);
    
    const avgSpeed = newHistory.reduce((a, b) => a + b, 0) / newHistory.length;
    setAnticipationLevel(avgSpeed);
    
    // Update current typing speed for cursor color
    setTypingSpeed(speed);
  }, [speedHistory]);

  // Pattern matching system (like Candy Crush)
  const checkPatterns = useCallback((newTypedText, currentCombo) => {
    const patterns = [];
    
    // Check for consecutive perfect characters
    const recentChars = recentlyTyped.slice(-5);
    const perfectCount = recentChars.filter(char => char.speed === 'perfect').length;
    
    if (perfectCount >= 3) {
      patterns.push({
        type: 'perfect_streak',
        count: perfectCount,
        bonus: perfectCount * 50,
        color: '#ff6b6b'
      });
    }
    
    // Check for speed consistency
    const speeds = recentChars.map(char => char.speed);
    const uniqueSpeeds = [...new Set(speeds)];
    if (uniqueSpeeds.length === 1 && speeds.length >= 4) {
      patterns.push({
        type: 'consistency_bonus',
        speed: uniqueSpeeds[0],
        bonus: 100,
        color: RESULT_COLORS[uniqueSpeeds[0]].glow
      });
    }
    
    // Check for combo milestones
    if (currentCombo > 0 && currentCombo % 10 === 0) {
      patterns.push({
        type: 'combo_milestone',
        combo: currentCombo,
        bonus: currentCombo * 10,
        color: '#ffd93d'
      });
    }
    
    return patterns;
  }, [recentlyTyped]);

  // Upgrade character colors based on performance
  const upgradeCharacter = useCallback((index, speed, currentCombo) => {
    const upgrades = new Map(characterUpgrades);
    const currentUpgrade = upgrades.get(index) || { level: 0, speed: 'lame' };
    
    // Upgrade logic
    let newLevel = currentUpgrade.level;
    if (speed === 'perfect' && currentCombo >= 10) newLevel = Math.max(newLevel, 3);
    else if (speed === 'best' && currentCombo >= 5) newLevel = Math.max(newLevel, 2);
    else if (speed === 'good') newLevel = Math.max(newLevel, 1);
    
    if (newLevel > currentLevel) {
      upgrades.set(index, { level: newLevel, speed });
      setCharacterUpgrades(upgrades);
      
      // Trigger upgrade effect
      setBonusEffects(prev => [...prev, {
        id: Date.now(),
        type: 'upgrade',
        index,
        level: newLevel,
        x: index * 20,
        y: 0
      }]);
    }
  }, [characterUpgrades, currentLevel]);

  // Achievement system
  const checkAchievements = useCallback((stats) => {
    const newAchievements = [];
    
    if (stats.perfectStreak >= 10 && !achievements.includes('speed_demon')) {
      newAchievements.push('speed_demon');
    }
    
    if (stats.combo >= 50 && !achievements.includes('combo_master')) {
      newAchievements.push('combo_master');
    }
    
    if (stats.accuracy === 100 && !achievements.includes('perfectionist')) {
      newAchievements.push('perfectionist');
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      
      // Trigger achievement effects
      newAchievements.forEach(achievement => {
        setBonusEffects(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: 'achievement',
          achievement,
          x: Math.random() * 200,
          y: Math.random() * 100
        }]);
      });
    }
  }, [achievements]);

  useEffect(() => {
    if (isActive && !isComplete) {
      intervalRef.current = setInterval(calculateStats, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isActive, isComplete, calculateStats]);

  const triggerComboEffects = useCallback((newCombo) => {
    // Enhanced combo celebrations
    if (newCombo % 10 === 0 && newCombo > 0) {
      const colors = newCombo >= 50 ? ['#ff6b6b'] : 
                   newCombo >= 30 ? ['#ffd93d'] :
                   newCombo >= 20 ? ['#6bcf7f'] :
                   ['#4ecdc4'];
      
      confetti({
        particleCount: newCombo,
        spread: 45,
        origin: { y: 0.7 },
        colors
      });
      
      // Screen flash effect
      if (newCombo >= 30) {
        setBonusEffects(prev => [...prev, {
          id: Date.now(),
          type: 'screen_flash',
          intensity: Math.min(newCombo / 30, 2)
        }]);
      }
    }
  }, []);

  const handleKeyPress = useCallback((char) => {
    if (!isActive && !startTime) {
      setStartTime(Date.now());
      setIsActive(true);
    }

    const expectedChar = targetText[currentIndex];
    const now = Date.now();
    const isCorrect = char === expectedChar;
    const timeDiff = lastCorrectTime ? now - lastCorrectTime : 200;
    const speed = getTypingSpeed(timeDiff);
    
    if (isCorrect) {
      const newTypedText = typedText + char;
      setTypedText(newTypedText);
      setCurrentIndex(currentIndex + 1);
      
      // Update speed tracking
      updateAnticipationLevel(speed);
      
      // Enhanced combo system with speed consideration
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      let newCombo = combo;
      const speedMultiplier = { perfect: 3, best: 2, good: 1.5, lame: 1 }[speed];
      
      if (speed === 'perfect') {
        newCombo = Math.min(combo + 2, 100);
        setPerfectStreak(prev => prev + 1);
      } else if (speed === 'best') {
        newCombo = Math.min(combo + 1, 100);
      } else if (timeDiff > 600) {
        newCombo = Math.max(1, combo - 1);
      }
      
      setCombo(newCombo);
      setMaxCombo(prev => Math.max(prev, newCombo));
      setLastCorrectTime(now);
      
      // Track character with performance data
      const charData = { 
        char, 
        index: currentIndex, 
        time: now, 
        combo: newCombo, 
        speed,
        timeDiff 
      };
      setRecentlyTyped(prev => [...prev.slice(-10), charData]);
      
      // Check for patterns and bonuses
      const patterns = checkPatterns(newTypedText, newCombo);
      patterns.forEach(pattern => {
        setPatternMatches(prev => [...prev, { ...pattern, id: Date.now() + Math.random() }]);
      });
      
      // Upgrade character
      upgradeCharacter(currentIndex, speed, newCombo);
      
      // Enhanced scoring with speed and pattern bonuses
      const baseScore = 15;
      const speedBonus = { perfect: 50, best: 30, good: 20, lame: 10 }[speed];
      const comboBonus = newCombo * 3;
      const streakBonus = newStreak > 10 ? Math.floor(newStreak / 5) * 5 : 0;
      const patternBonus = patterns.reduce((sum, p) => sum + p.bonus, 0);
      const finalScore = Math.round((baseScore + speedBonus + comboBonus + streakBonus + patternBonus) * speedMultiplier);
      
      setTotalScore(prev => prev + finalScore);
      
      // Enhanced floating score with speed indication
      setFloatingScores(prev => [...prev, {
        id: Date.now(),
        score: finalScore,
        combo: newCombo,
        speed,
        patterns: patterns.length,
        x: Math.random() * 200,
        y: Math.random() * 50,
        color: RESULT_COLORS[speed].glow
      }]);
      
      // Character explosion with speed-based effects
      setExplosions(prev => [...prev, {
        id: Date.now(),
        char,
        x: currentIndex * 20,
        y: 0,
        isCorrect: true,
        combo: newCombo,
        speed,
        patterns: patterns.length
      }]);
      
      triggerComboEffects(newCombo);
      
      if (onCharacterTyped) {
        onCharacterTyped({
          char,
          isCorrect: true,
          streak: newStreak,
          combo: newCombo,
          speed,
          score: finalScore,
          totalScore: totalScore + finalScore,
          patterns
        });
      }
      
      // Check completion
      if (currentIndex + 1 >= targetText.length) {
        setIsComplete(true);
        setIsActive(false);
        setEndTime(Date.now());
        
        const finalStats = {
          wpm,
          accuracy,
          errors,
          timeElapsed: (Date.now() - startTime) / 1000,
          streak: newStreak,
          maxCombo,
          totalScore: totalScore + finalScore,
          perfectStreak,
          achievements: achievements.length
        };
        
        checkAchievements(finalStats);
        
        // Massive completion celebration
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff6b6b', '#ffd93d', '#6bcf7f', '#4ecdc4', '#45b7d1']
          });
        }, 200);
        
        if (onComplete) {
          onComplete(finalStats);
        }
      }
    } else {
      // Enhanced error handling
      setErrors(errors + 1);
      setStreak(0);
      setCombo(1);
      setPerfectStreak(0);
      setTypingSpeed('lame');
      
      // Error explosion with punishment effects
      setExplosions(prev => [...prev, {
        id: Date.now(),
        char,
        x: currentIndex * 20,
        y: 0,
        isCorrect: false,
        combo: 0,
        speed: 'error'
      }]);
      
      // Screen shake on error
      setBonusEffects(prev => [...prev, {
        id: Date.now(),
        type: 'error_shake',
        intensity: 1
      }]);
      
      if (onCharacterTyped) {
        onCharacterTyped({
          char,
          isCorrect: false,
          streak: 0,
          combo: 1,
          speed: 'error',
          score: 0,
          totalScore
        });
      }
    }
  }, [currentIndex, typedText, targetText, isActive, startTime, errors, wpm, accuracy, streak, combo, maxCombo, lastCorrectTime, totalScore, perfectStreak, achievements, onComplete, onCharacterTyped, getTypingSpeed, updateAnticipationLevel, checkPatterns, upgradeCharacter, checkAchievements, triggerComboEffects]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setTypedText('');
    setErrors(0);
    setStartTime(null);
    setEndTime(null);
    setIsActive(false);
    setWpm(0);
    setAccuracy(100);
    setIsComplete(false);
    setStreak(0);
    setCombo(1);
    setMaxCombo(1);
    setLastCorrectTime(null);
    setExplosions([]);
    setFloatingScores([]);
    setTotalScore(0);
    setComboLevel(1);
    setRecentlyTyped([]);
    setTypingSpeed('lame');
    setSpeedHistory([]);
    setPatternMatches([]);
    setBonusEffects([]);
    setCharacterUpgrades(new Map());
    setAnticipationLevel(0);
    setPerfectStreak(0);
    setAchievements([]);
  }, []);

  const getCharacterStatus = useCallback((index) => {
    if (index < typedText.length) {
      return targetText[index] === typedText[index] ? 'correct' : 'incorrect';
    } else if (index === currentIndex) {
      return 'current';
    }
    return 'pending';
  }, [typedText, targetText, currentIndex]);

  const getCharacterSpeed = useCallback((index) => {
    const charData = recentlyTyped.find(char => char.index === index);
    return charData?.speed || 'lame';
  }, [recentlyTyped]);

  const getCharacterUpgrade = useCallback((index) => {
    return characterUpgrades.get(index) || { level: 0, speed: 'lame' };
  }, [characterUpgrades]);

  return {
    currentIndex,
    typedText,
    errors,
    wpm,
    accuracy,
    isActive,
    isComplete,
    streak,
    combo,
    maxCombo,
    totalScore,
    comboLevel,
    recentlyTyped,
    explosions,
    floatingScores,
    handleKeyPress,
    reset,
    getCharacterStatus,
    getCharacterSpeed,
    getCharacterUpgrade,
    progress: (currentIndex / targetText.length) * 100,
    setExplosions,
    setFloatingScores,
    
    // New addictive features
    typingSpeed,
    anticipationLevel,
    patternMatches,
    bonusEffects,
    perfectStreak,
    achievements,
    setBonusEffects,
    setPatternMatches,
    ANTICIPATION_COLORS,
    RESULT_COLORS
  };
};