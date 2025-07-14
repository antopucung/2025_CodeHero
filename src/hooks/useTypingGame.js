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
  const [screenShake, setScreenShake] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  
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

  // Calculate combo multiplier based on streak and speed
  const calculateComboMultiplier = useCallback((streak, timeDiff) => {
    let multiplier = 1;
    
    // Speed bonus (faster typing = higher multiplier)
    if (timeDiff < 100) multiplier += 3;
    else if (timeDiff < 150) multiplier += 2;
    else if (timeDiff < 200) multiplier += 1;
    
    // Streak bonus
    if (streak >= 50) multiplier += 5;
    else if (streak >= 30) multiplier += 4;
    else if (streak >= 20) multiplier += 3;
    else if (streak >= 10) multiplier += 2;
    else if (streak >= 5) multiplier += 1;
    
    return Math.min(multiplier, 10); // Cap at 10x
  }, []);

  useEffect(() => {
    if (isActive && !isComplete) {
      intervalRef.current = setInterval(calculateStats, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isActive, isComplete, calculateStats]);

  const triggerComboEffects = useCallback((newCombo, newStreak) => {
    // Trigger special effects for milestone combos
    if (newCombo % 10 === 0 && newCombo > 0) {
      // Milestone combo celebration
      confetti({
        particleCount: newCombo * 2,
        spread: 60,
        origin: { y: 0.7 },
        colors: newCombo >= 50 ? ['#ff6b6b', '#ff1744'] : 
               newCombo >= 30 ? ['#ffd93d', '#ffb300'] :
               newCombo >= 20 ? ['#6bcf7f', '#4caf50'] :
               ['#4ecdc4', '#00bcd4']
      });
    }

    // Screen flash for high combos
    if (newCombo >= 25 && newCombo % 5 === 0) {
      const flash = document.createElement('div');
      const flashColor = newCombo >= 50 ? 'rgba(255, 107, 107, 0.3)' :
                        newCombo >= 30 ? 'rgba(255, 217, 61, 0.3)' :
                        newCombo >= 20 ? 'rgba(107, 207, 127, 0.3)' :
                        'rgba(78, 205, 196, 0.3)';
      
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: ${flashColor};
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(flash);
      
      setTimeout(() => {
        if (document.body.contains(flash)) {
          document.body.removeChild(flash);
        }
      }, 150);
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
      
      // Update streak and combo
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Calculate combo based on typing speed and streak
      const timeDiff = lastCorrectTime ? now - lastCorrectTime : 200;
      let newCombo = combo;
      
      if (timeDiff < 300) { // Fast typing maintains/increases combo
        newCombo = Math.min(combo + 1, 100);
      } else {
        newCombo = Math.max(1, combo - 1); // Slow typing decreases combo
      }
      
      setCombo(newCombo);
      setMaxCombo(prev => Math.max(prev, newCombo));
      setLastCorrectTime(now);
      
      // Calculate score with combo multiplier
      const baseScore = 10;
      const speedBonus = timeDiff < 100 ? 20 : timeDiff < 150 ? 15 : timeDiff < 200 ? 10 : 5;
      const comboBonus = newCombo * 5;
      const streakBonus = newStreak > 10 ? Math.floor(newStreak / 10) * 10 : 0;
      const finalScore = (baseScore + speedBonus + comboBonus + streakBonus) * calculateComboMultiplier(newStreak, timeDiff);
      
      setTotalScore(prev => prev + finalScore);
      
      // Add floating score with combo colors
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
        x: Math.random() * 300,
        y: Math.random() * 100,
        color: getScoreColor(newCombo)
      }]);
      
      // Trigger character explosion with combo colors
      setExplosions(prev => [...prev, {
        id: Date.now(),
        char,
        x: currentIndex * 15,
        y: 0,
        isCorrect: true,
        combo: newCombo
      }]);
      
      // Trigger combo effects
      triggerComboEffects(newCombo, newStreak);
      
      // Notify parent
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
      
      // Check if completed
      if (currentIndex + 1 >= targetText.length) {
        setIsComplete(true);
        setIsActive(false);
        setEndTime(Date.now());
        
        // Massive completion celebration
        setTimeout(() => {
          for (let i = 0; i < 8; i++) {
            setTimeout(() => {
              confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#00ff00', '#ffff00', '#ff6b6b', '#4ecdc4', '#ffd93d']
              });
            }, i * 300);
          }
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
      // Handle incorrect character
      setErrors(errors + 1);
      setStreak(0);
      setCombo(1); // Reset combo on error
      
      // Screen shake on error
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 400);
      
      // Error explosion with shake effect
      setExplosions(prev => [...prev, {
        id: Date.now(),
        char,
        x: currentIndex * 15,
        y: 0,
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
  }, [currentIndex, typedText, targetText, isActive, startTime, errors, wpm, accuracy, streak, combo, maxCombo, lastCorrectTime, totalScore, onComplete, onCharacterTyped, calculateComboMultiplier, triggerComboEffects]);

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
    setScreenShake(false);
    setComboMultiplier(1);
    setTotalScore(0);
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
    explosions,
    floatingScores,
    screenShake,
    handleKeyPress,
    reset,
    getCharacterStatus,
    progress: (currentIndex / targetText.length) * 100,
    setExplosions,
    setFloatingScores
  };
};