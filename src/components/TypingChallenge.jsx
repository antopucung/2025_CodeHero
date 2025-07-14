import { useState, useEffect, useRef } from "react";
import { Box, Text, VStack, HStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useTypingGame } from "../hooks/useTypingGame";
import { 
  FloatingScore, 
  StreakCounter, 
  CharacterExplosion,
  JuicyProgressBar,
  LevelUpAnimation,
  ComboMultiplier,
  PatternMatchCelebration,
  ScreenFlashEffect
} from "./TypingEffects";
import { 
  BlockLetterTyping, 
  GradientWaveBackground, 
  PulseAnimation,
  AdvancedTypingCursor,
  ComboBurstEffect
} from "./BlockLetterEffect";

const MotionBox = motion(Box);

const TypingChallenge = ({ challenge, onComplete, isActive = false, currentLevel }) => {
  const [isStarted, setIsStarted] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [screenFlash, setScreenFlash] = useState({ active: false, intensity: 1, color: '#ffffff' });
  const containerRef = useRef(null);
  
  const {
    currentIndex,
    typedText,
    errors,
    wpm,
    accuracy,
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
    progress,
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
  } = useTypingGame(challenge.code, (stats) => {
    const oldLevel = currentLevel;
    
    onComplete({
      ...stats,
      challenge: challenge.id,
      language: challenge.language,
      maxCombo,
      totalScore
    });
    
    setTimeout(() => {
      if (currentLevel > oldLevel) {
        setNewLevel(currentLevel);
        setShowLevelUp(true);
      }
    }, 500);
  }, (charData) => {
    if (charData.isCorrect && charData.score > 0) {
      // Handle pattern matches
      if (charData.patterns && charData.patterns.length > 0) {
        setPatternMatches(prev => [...prev, ...charData.patterns]);
      }
      
      setTimeout(() => {
        setFloatingScores(prev => prev.filter(score => score.id !== charData.id));
      }, 1500);
    }
    
    setTimeout(() => {
      setExplosions(prev => prev.filter(exp => 
        Date.now() - exp.id > 1000
      ));
    }, 1000);
  }, currentLevel);

  // Handle bonus effects
  useEffect(() => {
    bonusEffects.forEach(effect => {
      if (effect.type === 'screen_flash') {
        setScreenFlash({ active: true, intensity: effect.intensity, color: '#ffff00' });
        setTimeout(() => setScreenFlash({ active: false, intensity: 1, color: '#ffffff' }), 200);
      } else if (effect.type === 'error_shake') {
        setScreenFlash({ active: true, intensity: 0.5, color: '#ff1744' });
        setTimeout(() => setScreenFlash({ active: false, intensity: 1, color: '#ffffff' }), 150);
      }
    });
    
    // Clean up bonus effects
    if (bonusEffects.length > 0) {
      setTimeout(() => {
        setBonusEffects([]);
      }, 1000);
    }
  }, [bonusEffects, setBonusEffects]);

  // Simple cursor position calculation
  useEffect(() => {
    if (containerRef.current) {
      const charWidth = 20;
      const lineHeight = 32;
      const charsPerLine = Math.floor(containerRef.current.offsetWidth / charWidth);
      
      const line = Math.floor(currentIndex / charsPerLine);
      const col = currentIndex % charsPerLine;
      
      setCursorPosition({
        x: col * charWidth + 8,
        y: line * lineHeight + 4
      });
    }
  }, [currentIndex]);

  // Clean up effects
  useEffect(() => {
    const cleanup = setInterval(() => {
      setFloatingScores(prev => prev.filter(score => 
        Date.now() - score.id < 2000
      ));
      setExplosions(prev => prev.filter(exp => 
        Date.now() - exp.id < 1500
      ));
      setPatternMatches(prev => prev.filter(pattern => 
        Date.now() - pattern.id < 3000
      ));
    }, 500);
    
    return () => clearInterval(cleanup);
  }, [setFloatingScores, setExplosions, setPatternMatches]);

  useEffect(() => {
    if (!isActive || !isStarted) return;

    const handleKeyDown = (e) => {
      e.preventDefault();
      
      if (e.key === 'Backspace') {
        return;
      }
      
      if (e.key.length === 1) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isStarted, handleKeyPress]);

  const startChallenge = () => {
    setIsStarted(true);
    reset();
  };

  if (!isStarted) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        bg="#111"
        border="1px solid #333"
        p={4}
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        <GradientWaveBackground isActive={true} intensity={0.3} combo={1} />
        
        <VStack spacing={4}>
          <PulseAnimation isActive={true} color="#00ff00" intensity={1} combo={1}>
            <Text fontSize="lg" color="#00ff00" fontWeight="bold">
              {challenge.title}
            </Text>
          </PulseAnimation>
          
          <Text fontSize="sm" color="#666">
            {challenge.description}
          </Text>
          
          <HStack spacing={4}>
            <Text fontSize="xs" color="#ffaa00">
              LANGUAGE: {challenge.language.toUpperCase()}
            </Text>
            <Text fontSize="xs" color="#ffaa00">
              DIFFICULTY: {challenge.difficulty.toUpperCase()}
            </Text>
          </HStack>
          
          <MotionBox
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              bg="#000"
              color="#00ff00"
              border="1px solid #00ff00"
              borderRadius="0"
              fontFamily="'Courier New', monospace"
              _hover={{ 
                bg: "#003300",
                boxShadow: "0 0 15px #00ff00"
              }}
              onClick={startChallenge}
              size="lg"
            >
              🚀 START TYPING CHALLENGE 🚀
            </Button>
          </MotionBox>
        </VStack>
      </MotionBox>
    );
  }

  return (
    <Box bg="#111" border="1px solid #333" p={3} position="relative" overflow="hidden">
      {/* Enhanced Background Effects */}
      <GradientWaveBackground 
        isActive={isActive && !isComplete} 
        intensity={Math.min(combo / 20, 1)}
        combo={combo}
        anticipationLevel={anticipationLevel}
        typingSpeed={typingSpeed}
      />
      
      {/* Enhanced Floating Scores */}
      {floatingScores.map((score) => (
        <FloatingScore
          key={score.id}
          score={score.score}
          combo={score.combo}
          speed={score.speed}
          patterns={score.patterns}
          x={score.x}
          y={score.y}
          color={score.color}
          onComplete={() => {
            setFloatingScores(prev => prev.filter(s => s.id !== score.id));
          }}
        />
      ))}
      
      {/* Enhanced Character Explosions */}
      {explosions.map((explosion) => (
        <CharacterExplosion
          key={explosion.id}
          char={explosion.char}
          x={explosion.x}
          y={explosion.y}
          isCorrect={explosion.isCorrect}
          combo={explosion.combo}
          speed={explosion.speed}
          patterns={explosion.patterns}
          onComplete={() => {
            setExplosions(prev => prev.filter(e => e.id !== explosion.id));
          }}
        />
      ))}
      
      {/* Enhanced Combo Effects */}
      <ComboBurstEffect 
        isActive={combo > 5}
        combo={combo}
        x={cursorPosition.x}
        y={cursorPosition.y}
        patterns={patternMatches.length}
      />
      
      {/* Enhanced Streak Counter */}
      <StreakCounter streak={streak} combo={combo} perfectStreak={perfectStreak} />
      
      {/* Enhanced Combo Multiplier */}
      <ComboMultiplier 
        multiplier={combo} 
        isActive={combo > 1} 
        anticipationLevel={anticipationLevel}
        typingSpeed={typingSpeed}
      />
      
      {/* Pattern Match Celebrations */}
      <PatternMatchCelebration 
        patterns={patternMatches}
        onComplete={() => setPatternMatches([])}
      />
      
      {/* Screen Flash Effects */}
      <ScreenFlashEffect 
        isActive={screenFlash.active}
        intensity={screenFlash.intensity}
        color={screenFlash.color}
      />
      
      <Text fontSize="xs" color="#666" mb={2} fontFamily="'Courier New', monospace">
        │ TYPING CHALLENGE - {challenge.title.toUpperCase()}
      </Text>
      
      {/* Simple Progress Bar */}
      <Box bg="#000" border="1px solid #333" p={2} mb={3} position="relative">
        <HStack justify="space-between" mb={2}>
          <Text fontSize="xs" color="#666">PROGRESS</Text>
          <HStack spacing={4}>
            <PulseAnimation isActive={streak > 5} color="#ffaa00" combo={combo} anticipationLevel={anticipationLevel}>
              <Text fontSize="xs" color="#ffaa00">STREAK: {streak}</Text>
            </PulseAnimation>
            <PulseAnimation isActive={combo > 1} color="#ff6b6b" combo={combo} anticipationLevel={anticipationLevel}>
              <Text fontSize="xs" color={combo >= 50 ? "#ff6b6b" : combo >= 30 ? "#ffd93d" : combo >= 20 ? "#6bcf7f" : combo >= 10 ? "#4ecdc4" : "#00ff00"}>
                COMBO: x{combo}
              </Text>
            </PulseAnimation>
            <PulseAnimation isActive={perfectStreak > 0} color="#ff1744" combo={combo} anticipationLevel={anticipationLevel}>
              <Text fontSize="xs" color="#ff1744">PERFECT: {perfectStreak}</Text>
            </PulseAnimation>
            <Text fontSize="xs" color="#00ff00">{Math.round(progress)}%</Text>
          </HStack>
        </HStack>
        <JuicyProgressBar 
          progress={progress} 
          color="#00ff00" 
          combo={combo}
          anticipationLevel={anticipationLevel}
          typingSpeed={typingSpeed}
        />
      </Box>

      {/* Simple Live Stats */}
      <HStack justify="space-between" mb={3} fontSize="xs" position="relative">
        <PulseAnimation isActive={wpm > 30} color="#ffff00" intensity={1} combo={combo} anticipationLevel={anticipationLevel}>
          <MotionBox
            animate={{ 
              color: wpm > 60 ? "#ff6b6b" : wpm > 40 ? "#ffd93d" : wpm > 20 ? "#6bcf7f" : "#00ff00"
            }}
          >
            <Text>WPM: {wpm}</Text>
          </MotionBox>
        </PulseAnimation>
        
        <PulseAnimation isActive={accuracy === 100} color="#ffff00" combo={combo} anticipationLevel={anticipationLevel}>
          <MotionBox
            animate={{ 
              color: accuracy > 95 ? "#ffff00" : accuracy > 85 ? "#6bcf7f" : "#ff6b6b"
            }}
          >
            <Text>ACC: {accuracy}%</Text>
          </MotionBox>
        </PulseAnimation>
        
        <MotionBox
          animate={{ 
            scale: errors > 0 ? [1, 1.1, 1] : 1
          }}
          transition={{ duration: 0.3 }}
        >
          <Text color={errors > 0 ? "#ff4444" : "#00ff00"}>ERRORS: {errors}</Text>
        </MotionBox>

        <PulseAnimation isActive={totalScore > 0} color="#ffd93d" combo={combo} anticipationLevel={anticipationLevel}>
          <Text color="#ffd93d">SCORE: {totalScore}</Text>
        </PulseAnimation>
        
        <PulseAnimation isActive={typingSpeed !== 'lame'} color={ANTICIPATION_COLORS[typingSpeed]?.glow || '#666'} combo={combo} anticipationLevel={anticipationLevel}>
          <Text color={ANTICIPATION_COLORS[typingSpeed]?.glow || '#666'}>
            SPEED: {typingSpeed.toUpperCase()}
          </Text>
        </PulseAnimation>
      </HStack>

      {/* Simple Block Letter Code Display */}
      <Box
        ref={containerRef}
        bg="#000"
        border="1px solid #333"
        p={3}
        minH="200px"
        maxH="400px"
        overflowY="auto"
        position="relative"
      >
        {/* Enhanced Typing Cursor */}
        <AdvancedTypingCursor 
          isVisible={isActive && !isComplete}
          x={cursorPosition.x}
          y={cursorPosition.y}
          combo={combo}
          typingSpeed={typingSpeed}
          anticipationLevel={anticipationLevel}
        />
        
        {/* Enhanced Block Letter Typing Effect */}
        <BlockLetterTyping
          text={challenge.code}
          currentIndex={currentIndex}
          getCharacterStatus={getCharacterStatus}
          getCharacterSpeed={getCharacterSpeed}
          getCharacterUpgrade={getCharacterUpgrade}
          combo={combo}
          typingSpeed={typingSpeed}
          anticipationLevel={anticipationLevel}
          ANTICIPATION_COLORS={ANTICIPATION_COLORS}
          RESULT_COLORS={RESULT_COLORS}
          onCharacterClick={(index) => {
            console.log('Clicked character at index:', index);
          }}
        />
        
        {isComplete && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: [
                "0 0 15px #00ff00",
                "0 0 25px #00ff00", 
                "0 0 15px #00ff00"
              ]
            }}
            transition={{ 
              boxShadow: { repeat: Infinity, duration: 1.5 }
            }}
            mt={4}
            p={3}
            bg="#003300"
            border="1px solid #00ff00"
            textAlign="center"
            position="relative"
            overflow="hidden"
          >
            <GradientWaveBackground isActive={true} intensity={1} combo={maxCombo} />
            
            <PulseAnimation isActive={true} color="#00ff00" intensity={1.5} combo={maxCombo}>
              <Text color="#00ff00" fontWeight="bold" mb={2} fontSize="lg">
                🎉 CHALLENGE COMPLETED! 🎉
              </Text>
            </PulseAnimation>
            
            <HStack justify="center" spacing={4} mb={2}>
              <PulseAnimation isActive={wpm > 30} color="#ffff00" combo={maxCombo} anticipationLevel={1}>
                <Text fontSize="sm" color="#ffff00">WPM: {wpm}</Text>
              </PulseAnimation>
              <PulseAnimation isActive={accuracy > 90} color="#ffff00" combo={maxCombo} anticipationLevel={1}>
                <Text fontSize="sm" color="#ffff00">Accuracy: {accuracy}%</Text>
              </PulseAnimation>
              <Text fontSize="sm" color={errors > 0 ? "#ff6b6b" : "#ffff00"}>Errors: {errors}</Text>
              <PulseAnimation isActive={maxCombo > 5} color="#ffd93d" combo={maxCombo} anticipationLevel={1}>
                <Text fontSize="sm" color="#ffd93d">Max Combo: x{maxCombo}</Text>
              </PulseAnimation>
            </HStack>
            
            <PulseAnimation isActive={true} color="#ffd93d" intensity={1.5} combo={maxCombo} anticipationLevel={1}>
              <Text fontSize="lg" color="#ffd93d" fontWeight="bold">
                TOTAL SCORE: {totalScore}
              </Text>
            </PulseAnimation>
            
            {streak > 10 && (
              <PulseAnimation isActive={true} color="#ff6b6b" intensity={1.5} combo={maxCombo} anticipationLevel={1}>
                <Text fontSize="sm" color="#ff6b6b" fontWeight="bold" mt={2}>
                  🔥 AMAZING STREAK: {streak} 🔥
                </Text>
              </PulseAnimation>
            )}
            
            {perfectStreak > 5 && (
              <PulseAnimation isActive={true} color="#ff1744" intensity={2} combo={maxCombo} anticipationLevel={1}>
                <Text fontSize="sm" color="#ff1744" fontWeight="bold" mt={2}>
                  ⚡ PERFECT STREAK: {perfectStreak} ⚡
                </Text>
              </PulseAnimation>
            )}
            
            {achievements.length > 0 && (
              <Box mt={3}>
                <Text fontSize="sm" color="#ffaa00" fontWeight="bold" mb={1}>
                  🏆 ACHIEVEMENTS UNLOCKED! 🏆
                </Text>
                <HStack spacing={2} justify="center" flexWrap="wrap">
                  {achievements.map((achievement, index) => (
                    <PulseAnimation key={index} isActive={true} color="#ffaa00" combo={maxCombo} anticipationLevel={1}>
                      <Text fontSize="xs" color="#ffaa00" bg="#222" px={2} py={1} border="1px solid #444">
                        {achievement.replace('_', ' ').toUpperCase()}
                      </Text>
                    </PulseAnimation>
                  ))}
                </HStack>
              </Box>
            )}
          </MotionBox>
        )}
      </Box>

      {!isComplete && (
        <MotionBox
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Text fontSize="xs" color="#666" mt={2} textAlign="center">
            Type the code above exactly as shown. Build combos for higher scores!
          </Text>
        </MotionBox>
      )}
      
      {/* Level Up Animation */}
      <LevelUpAnimation 
        isVisible={showLevelUp}
        newLevel={newLevel}
        achievements={achievements}
        onComplete={() => setShowLevelUp(false)}
      />
    </Box>
  );
};

export default TypingChallenge;