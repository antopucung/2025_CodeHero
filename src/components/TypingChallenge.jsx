// Updated Typing Challenge Component - Using new engine
import React, { useState, useEffect } from "react";
import { Box, Text, VStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import confetti from 'canvas-confetti';
import { TypingEngine } from "../engine/core/TypingEngine";
import { EffectSystem } from "../engine/systems/EffectSystem";
import { ConceptualTypingDisplay } from "../engine/components/ConceptualTypingDisplay";
import { MegaLevelUpCelebration, MegaAchievementUnlock } from "../engine/effects/CelebrationSystem";
import { GameStats } from "../engine/components/GameStats";
import { TerminalPanel } from "../design/components/TerminalPanel";
import { PatternBonusDisplay } from "../design/components/PatternBonusDisplay";
import { colors, colorPsychology } from "../design/tokens/colors";
import { typography } from "../design/tokens/typography";
import { spacing } from "../design/tokens/spacing";
import { createPulseAnimation } from "../design/tokens/animations";

const MotionBox = motion(Box);

const TypingChallenge = ({ challenge, onComplete, isActive = false, currentLevel, fullScreen = false }) => {
  const [engine] = useState(() => new TypingEngine());
  const [effectSystem] = useState(() => new EffectSystem());
  const [isStarted, setIsStarted] = useState(false);
  const [engineState, setEngineState] = useState(engine.state);
  const [activePatterns, setActivePatterns] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievement, setShowAchievement] = useState(null);

  // DISABLE ALL REWARD POPUPS FOR NOW
  const DISABLE_POPUPS = true;

  // Performance optimization - limit concurrent effects
  const [effectLimiter, setEffectLimiter] = useState({
    maxFloatingScores: 5,
    maxExplosions: 3,
    maxPatterns: 2,
    lastCleanup: Date.now()
  });

  // Initialize engine
  useEffect(() => {
    if (challenge && isStarted) {
      engine.initialize(
        challenge.code,
        (stats) => {
          onComplete({
            ...stats,
            challenge: challenge.id,
            language: challenge.language
          });
        },
        (charData) => {
          // Handle character typed events
          console.log('Character typed:', charData);
        }
      );
    }
  }, [challenge, isStarted, engine, onComplete]);

  // Listen to engine state changes
  useEffect(() => {
    const handleStateChange = (newState) => {
      setEngineState({ ...newState });
      
      // Show new pattern bonuses
      if (newState.patternMatches && newState.patternMatches.length > 0) {
        if (!DISABLE_POPUPS) {
          const newPatterns = newState.patternMatches.filter(
            pattern => !activePatterns.some(active => active.id === pattern.id)
          ).slice(0, effectLimiter.maxPatterns); // Limit concurrent patterns
          
          if (newPatterns.length > 0) {
            setActivePatterns(prev => [...prev, ...newPatterns]);
          }
        }
      }
      
      // Clear new achievements after showing
      if (newState.newAchievements && newState.newAchievements.length > 0) {
        if (!DISABLE_POPUPS) {
          setTimeout(() => {
            engine.state.newAchievements = [];
          }, 100);
        }
      }
      
      // Clear new level after showing
      if (newState.newLevel) {
        if (!DISABLE_POPUPS) {
          setShowLevelUp(newState.newLevel);
          setTimeout(() => {
            engine.state.newLevel = null;
          }, 100);
        }
      }
      
      // Show new achievements
      if (newState.newAchievements && newState.newAchievements.length > 0) {
        if (!DISABLE_POPUPS) {
          setShowAchievement(newState.newAchievements[0]);
        }
      }
    };

    engine.on('stateChange', handleStateChange);
    
    return () => {
      engine.off('stateChange', handleStateChange);
    };
  }, [engine, activePatterns]);

  // Handle keyboard input
  useEffect(() => {
    if (!isActive || !isStarted || engineState?.isComplete) return;

    // Make confetti available globally for engine
    window.confetti = confetti;

    const handleKeyDown = (e) => {
      // Only prevent default for typing characters
      if (e.key.length === 1 || e.key === 'Backspace') {
        e.preventDefault();
      }
      
      // Ignore backspace for now (can be added later)
      if (e.key === 'Backspace') {
        return;
      }
      
      // Process only printable characters immediately
      if (e.key.length === 1) {
        engine.processKeyPress(e.key);
      }
    };

    // Use keydown for immediate response
    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isStarted, engine, engineState?.isComplete]);

  // Cleanup effects
  useEffect(() => {
    const cleanup = setInterval(() => {
      engine.cleanupEffects();
      
      // Aggressive cleanup for performance
      const now = Date.now();
      if (now - effectLimiter.lastCleanup > 1000) {
        setActivePatterns(prev => prev.slice(0, effectLimiter.maxPatterns));
        setEffectLimiter(prev => ({ ...prev, lastCleanup: now }));
      }
    }, 250); // More frequent cleanup
    
    return () => clearInterval(cleanup);
  }, [engine, effectLimiter]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      effectSystem.destroy();
      engine.destroy();
    };
  }, [effectSystem, engine]);

  const startChallenge = () => {
    setIsStarted(true);
    engine.reset();
  };

  if (!isStarted) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        position="relative"
        overflow="hidden"
        h={fullScreen ? "100%" : "auto"}
        display={fullScreen ? "flex" : "block"}
        alignItems={fullScreen ? "center" : "stretch"}
        justifyContent={fullScreen ? "center" : "stretch"}
      >
        <TerminalPanel title="TYPING CHALLENGE READY" variant="primary">
          <VStack spacing={spacing[4]}>
            <Box
              {...createPulseAnimation(1)}
              color={colorPsychology.interface.primary.background}
              fontWeight={typography.weights.bold}
              fontSize={fullScreen ? typography.sizes['3xl'] : typography.sizes.xl}
            >
              {challenge.title}
            </Box>
            
            <Text 
              fontSize={fullScreen ? typography.sizes.lg : typography.sizes.base} 
              color={colorPsychology.environment.text.secondary}
              textAlign="center"
            >
              {challenge.description}
            </Text>
            
            <Box 
              fontSize={fullScreen ? typography.sizes.base : typography.sizes.xs} 
              color={colorPsychology.speedColors.best.primary}
              textAlign="center"
            >
              LANGUAGE: {challenge.language.toUpperCase()} | 
              DIFFICULTY: {challenge.difficulty.toUpperCase()}
            </Box>
            
            <MotionBox
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                bg={colors.terminal.bg}
                color={colors.primary[500]}
                border={`1px solid ${colors.primary[500]}`}
                borderRadius="0"
                fontFamily={typography.fonts.mono}
                fontSize={fullScreen ? typography.sizes.lg : typography.sizes.base}
                p={fullScreen ? 8 : 4}
                _hover={{ 
                  bg: colors.terminal.surface,
                  boxShadow: `0 0 15px ${colors.primary[500]}`
                }}
                onClick={startChallenge}
                size={fullScreen ? "xl" : "lg"}
              >
                🚀 START TYPING CHALLENGE 🚀
              </Button>
            </MotionBox>
          </VStack>
        </TerminalPanel>
      </MotionBox>
    );
  }

  return (
    <Box 
      w="100%"
      h="100%"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* REWARD POPUPS DISABLED FOR NOW */}
      {!DISABLE_POPUPS && (
        <>
          {/* Pattern Bonus Display */}
          <PatternBonusDisplay
            patterns={activePatterns}
            onPatternComplete={(patternId) => {
              setActivePatterns(prev => prev.filter(p => p.id !== patternId));
            }}
          />
          
          {/* Level Up Celebration */}
          {showLevelUp && (
            <MegaLevelUpCelebration
              newLevel={showLevelUp}
              onComplete={() => {
                setShowLevelUp(false);
              }}
            />
          )}
          
          {/* Achievement Unlock */}
          {showAchievement && (
            <MegaAchievementUnlock
              achievement={showAchievement}
              onComplete={() => {
                setShowAchievement(null);
              }}
            />
          )}
        </>
      )}
      
      {/* Progress Bar */}
      <Box
        bg={colors.terminal.surface}
        border={`1px solid ${colors.terminal.border}`}
        p={2}
        flexShrink={0}
      >
        <Text fontSize="xs" color={colors.terminal.textSecondary} mb={2}>
          │ PROGRESS
        </Text>
        <Box 
          bg={colors.terminal.bg}
          border={`1px solid ${colors.terminal.border}`}
          h="12px"
          borderRadius="0"
          overflow="hidden"
          position="relative"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${engine.getProgress()}%` }}
            transition={{ duration: 0.3 }}
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${colors.primary[500]}, ${colors.primary[400]})`,
              boxShadow: `0 0 10px ${colors.primary[500]}`
            }}
          />
        </Box>
        
        <Text 
          fontSize="xs"
          color={colors.terminal.textSecondary}
          textAlign="center" 
          mt={1}
        >
          {Math.round(engine.getProgress())}% Complete
        </Text>
      </Box>
      
      {/* Typing Display */}
      <Box flex={1} overflow="hidden">
        <ConceptualTypingDisplay
          text={challenge.code}
          engine={engine}
          onCharacterClick={(index) => {
            console.log('Clicked character at index:', index);
          }}
          fullScreen={fullScreen}
        />
      </Box>
      
      {/* Completion Message */}
      {engineState.isComplete && (
        !DISABLE_POPUPS && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: [
                `0 0 15px ${colors.primary[500]}`,
                `0 0 25px ${colors.primary[500]}`,
                `0 0 15px ${colors.primary[500]}`
              ]
            }}
            transition={{ 
              boxShadow: { repeat: Infinity, duration: 1.5 }
            }}
            position="fixed"
            top="10px"
            left="50%"
            transform="translateX(-50%)"
            zIndex={999} // Lower z-index
            textAlign="center"
            pointerEvents="none"
            onClick={() => {
              // Allow clicking to dismiss or continue
              if (onComplete) {
                onComplete({
                  ...engineState,
                  challenge: challenge.id,
                  language: challenge.language
                });
              }
            }}
          >
            <VStack spacing={2}>
              <Box
                {...createPulseAnimation(1.5)}
                color={colors.primary[500]}
                fontWeight={typography.weights.bold}
                fontSize="md"
                textAlign="center"
                style={{ textShadow: `0 0 20px ${colors.primary[500]}` }}
              >
                🎉 COMPLETED! 🎉
              </Box>
              
              <Box textAlign="center">
                <Text color={colors.combo.perfect} fontSize="sm" style={{ textShadow: `0 0 15px ${colors.combo.perfect}` }}>
                  Score: {engineState.totalScore}
                </Text>
                <Text color={colors.terminal.textSecondary} fontSize="xs" mt={1} style={{ textShadow: '0 0 10px #666' }}>
                  WPM: {engineState.wpm} | Accuracy: {engineState.accuracy}%
                </Text>
              </Box>
              
              {engineState.perfectStreak > 5 && (
                <Box
                  color="#fff"
                  textAlign="center"
                  fontWeight={typography.weights.bold}
                  fontSize="xs"
                  style={{ textShadow: `0 0 20px ${colors.performance.perfect.primary}` }}
                >
                  ⚡ PERFECT STREAK: {engineState.perfectStreak} ⚡
                </Box>
              )}
            </VStack>
          </MotionBox>
        )
      )}
      
      {!engineState.isComplete && (
        <Text 
          fontSize="xs"
          color={colors.terminal.textSecondary} 
          textAlign="center"
          style={{ opacity: 0.7 }}
          position="absolute"
          bottom="10px"
          left="50%"
          transform="translateX(-50%)"
        >
          Type the code above exactly as shown. Build combos for higher scores!
        </Text>
      )}
    </Box>
  );
};

export default TypingChallenge;