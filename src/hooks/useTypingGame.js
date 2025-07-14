import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

export const useTypingGame = (targetText = '', onComplete = null, onCharacterTyped = null) => {
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
  
  const intervalRef = useRef(null);

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

  useEffect(() => {
    if (isActive && !isComplete) {
      intervalRef.current = setInterval(calculateStats, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isActive, isComplete, calculateStats]);

  const triggerComboEffects = useCallback((newCombo) => {
    // Simple milestone celebrations
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
    
    if (isCorrect) {
      const newTypedText = typedText + char;
      setTypedText(newTypedText);
      setCurrentIndex(currentIndex + 1);
      
      // Simple combo system
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Enhanced combo system with timing
      const timeDiff = lastCorrectTime ? now - lastCorrectTime : 200;
      let newCombo = combo;
      
      if (timeDiff < 200) { // Very fast typing
        newCombo = Math.min(combo + 2, 100);
      } else if (timeDiff < 300) { // Fast typing
        newCombo = Math.min(combo + 1, 100);
      } else if (timeDiff > 600) { // Slow typing decreases combo
        newCombo = Math.max(1, combo - 1);
      }
      
      setCombo(newCombo);
      setComboLevel(newCombo); // This should be passed to BlockLetterTyping
      setMaxCombo(prev => Math.max(prev, newCombo));
      setLastCorrectTime(now);
      
      // Track recently typed characters for wave effects
      setRecentlyTyped(prev => [...prev.slice(-10), { char, index: currentIndex, time: now, combo: newCombo }]);
      
      // Enhanced scoring system
      const baseScore = 15;
      const speedBonus = timeDiff < 150 ? 25 : timeDiff < 200 ? 20 : timeDiff < 250 ? 15 : 10;
      const comboBonus = newCombo * 3;
      const streakBonus = newStreak > 10 ? Math.floor(newStreak / 5) * 5 : 0;
      const finalScore = baseScore + speedBonus + comboBonus;
      
      setTotalScore(prev => prev + finalScore);
      
      // Enhanced floating score with combo colors
      const getScoreColor = (combo) => {
        if (combo >= 50) return '#ff6b6b';
        if (combo >= 30) return '#ffd93d';
        if (combo >= 20) return '#6bcf7f';
        if (combo >= 10) return '#4ecdc4';
        if (combo >= 5) return '#45b7d1';
        return '#00ff00';
      };
      
      setFloatingScores(prev => [...prev, {
        id: Date.now(),
        score: finalScore,
        combo: newCombo,
        x: Math.random() * 200,
        y: Math.random() * 50,
        color: getScoreColor(newCombo)
      }]);
      
      // Character explosion
      setExplosions(prev => [...prev, {
        id: Date.now(),
        char,
        x: currentIndex * 12,
        combo: newCombo,
        y: 0,
        isCorrect: true,
        combo: newCombo
      }]);
      
      triggerComboEffects(newCombo);
      
      if (onCharacterTyped) {
        onCharacterTyped({
          char,
          isCorrect: true,
          streak: newStreak,
          combo: newCombo,
          score: finalScore,
          totalScore: totalScore + finalScore
        });
      }
      
      // Check completion
      if (currentIndex + 1 >= targetText.length) {
        setIsComplete(true);
        setIsActive(false);
        setEndTime(Date.now());
        
        // Completion celebration
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00ff00', '#ffff00', '#ff6b6b', '#4ecdc4', '#ffd93d']
          });
        }, 200);
        
        if (onComplete) {
          onComplete({
            wpm,
            accuracy,
            errors,
            timeElapsed: (Date.now() - startTime) / 1000,
            streak: newStreak,
            maxCombo,
            totalScore: totalScore + finalScore
          });
        }
      }
    } else {
      // Handle error
      setErrors(errors + 1);
      setStreak(0);
      setCombo(1); // Reset combo on error
      setComboLevel(1);
      
      // Error explosion
      setExplosions(prev => [...prev, {
        id: Date.now(),
        char,
        x: currentIndex * 12,
        y: 0,
        combo: 0,
        isCorrect: false,
        combo: 0
      }]);
      
      if (onCharacterTyped) {
        onCharacterTyped({
          char,
          isCorrect: false,
          streak: 0,
          combo: 1,
          score: 0,
          totalScore
        });
      }
    }
  }, [currentIndex, typedText, targetText, isActive, startTime, errors, wpm, accuracy, streak, combo, maxCombo, lastCorrectTime, totalScore, onComplete, onCharacterTyped, triggerComboEffects]);

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
  }, []);

  const getCharacterStatus = useCallback((index) => {
    if (index < typedText.length) {
      return targetText[index] === typedText[index] ? 'correct' : 'incorrect';
    } else if (index === currentIndex) {
      return 'current';
    }
    return 'pending';
  }, [typedText, targetText, currentIndex]);

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
    progress: (currentIndex / targetText.length) * 100,
    setExplosions,
    setFloatingScores
  };
};