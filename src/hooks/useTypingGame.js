import { useState, useEffect, useCallback, useRef } from 'react';

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
  const [lastCorreectTime, setLastCorrectTime] = useState(null);
  const [explosions, setExplosions] = useState([]);
  const [floatingScores, setFloatingScores] = useState([]);
  const [screenShake, setScreenShake] = useState(false);
  
  const intervalRef = useRef(null);

  const calculateStats = useCallback(() => {
    if (!startTime) return;
    
    const now = Date.now();
    const timeElapsed = (now - startTime) / 1000 / 60; // minutes
    const wordsTyped = typedText.length / 5; // standard word length
    const currentWpm = Math.round(wordsTyped / timeElapsed) || 0;
    const currentAccuracy = Math.round(((typedText.length - errors) / typedText.length) * 100) || 100;
    
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
      
      // Calculate combo based on typing speed
      if (lastCorreectTime && (now - lastCorreectTime) < 300) {
        setCombo(prev => Math.min(prev + 1, 10));
      } else {
        setCombo(1);
      }
      setLastCorrectTime(now);
      
      // Add floating score
      const baseScore = 10;
      const comboBonus = combo > 1 ? combo * 5 : 0;
      const streakBonus = newStreak > 10 ? Math.floor(newStreak / 10) * 5 : 0;
      const totalScore = baseScore + comboBonus + streakBonus;
      
      setFloatingScores(prev => [...prev, {
        id: Date.now(),
        score: totalScore,
        x: Math.random() * 200,
        y: Math.random() * 100
      }]);
      
      // Trigger character explosion
      setExplosions(prev => [...prev, {
        id: Date.now(),
        char,
        x: currentIndex * 12,
        y: 0,
        isCorrect: true
      }]);
      
      // Notify parent
      if (onCharacterTyped) {
        onCharacterTyped({
          char,
          isCorrect: true,
          streak: newStreak,
          combo,
          score: totalScore
        });
      }
      
      // Check if completed
      if (currentIndex + 1 >= targetText.length) {
        setIsComplete(true);
        setIsActive(false);
        setEndTime(Date.now());
        
        // Massive celebration for completion
        setTimeout(() => {
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00ff00', '#ffff00', '#ff6b6b']
              });
            }, i * 200);
          }
        }, 100);
        
        if (onComplete) {
          onComplete({
            wpm,
            accuracy,
            errors,
            timeElapsed: (Date.now() - startTime) / 1000,
            streak: newStreak,
            combo
          });
        }
      }
    } else {
      setErrors(errors + 1);
      setStreak(0);
      setCombo(1);
      
      // Screen shake on error
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);
      
      // Error explosion
      setExplosions(prev => [...prev, {
        id: Date.now(),
        char,
        x: currentIndex * 12,
        y: 0,
        isCorrect: false
      }]);
      
      if (onCharacterTyped) {
        onCharacterTyped({
          char,
          isCorrect: false,
          streak: 0,
          combo: 1,
          score: 0
        });
      }
    }
  }, [currentIndex, typedText, targetText, isActive, startTime, errors, wpm, accuracy, streak, combo, lastCorreectTime, onComplete, onCharacterTyped]);

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
    setLastCorrectTime(null);
    setExplosions([]);
    setFloatingScores([]);
    setScreenShake(false);
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