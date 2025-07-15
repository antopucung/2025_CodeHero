// Updated Typing Challenge Component - Using new engine
import React, { useState, useEffect } from "react";
import { Box, Text, VStack, Button, HStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { createTypingEngine } from "../engine/engineFactory";
import { ConceptualTypingDisplay } from "../engine/components/ConceptualTypingDisplay";
import { TerminalPanel } from "../design/components/TerminalPanel";
import { colors, colorPsychology } from "../design/tokens/colors";
import { typography } from "../design/tokens/typography";
import { spacing } from "../design/tokens/spacing";
import { createPulseAnimation } from "../design/tokens/animations";

const MotionBox = motion(Box);

const TypingChallenge = ({ challenge, onComplete, isActive = false, currentLevel, fullScreen = false }) => {
  const [engine] = useState(() => createTypingEngine({ 
    minimalistMode: true,
    enableEffects: false,
    enableSounds: false,
    enableAnalytics: false
  }));
  const [isStarted, setIsStarted] = useState(false);
  const [engineState, setEngineState] = useState(engine.state);

  // Add game state tracking
  const [gameStats, setGameStats] = useState({
    streakLevel: 0,
    perfectKeystrokes: 0,
    powerLevel: 1,
    bonusPoints: 0
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
    };

    engine.on('stateChange', handleStateChange);
    
    return () => {
      engine.off('stateChange', handleStateChange);
    };
  }, [engine]);

  // Track game stats
  useEffect(() => {
    if (engineState && engineState.streak > 0) {
      // Update streak level
      let streakLevel = 0;
      if (engineState.streak >= 50) streakLevel = 5;
      else if (engineState.streak >= 30) streakLevel = 4;
      else if (engineState.streak >= 20) streakLevel = 3;
      else if (engineState.streak >= 10) streakLevel = 2;
      else if (engineState.streak >= 5) streakLevel = 1;
      
      // Count perfect keystrokes
      const perfectCount = engineState.recentlyTyped?.filter(char => char.speed === 'perfect').length || 0;
      
      // Calculate power level based on combo and perfect keystrokes
      const powerLevel = Math.min(10, Math.floor((engineState.combo / 10) + (perfectCount / 5)));
      
      // Bonus points based on streak and power
      const bonusPoints = engineState.streak * powerLevel * 5;
      
      setGameStats({
        streakLevel,
        perfectKeystrokes: perfectCount,
        powerLevel,
        bonusPoints
      });
    }
  }, [engineState]);

  // Handle keyboard input
  useEffect(() => {
    if (!isActive || !isStarted || engineState?.isComplete) return;

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
    }, 250); // More frequent cleanup
    
    return () => clearInterval(cleanup);
  }, [engine]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      engine.destroy();
    };
  }, [engine]);

  const startChallenge = () => {
    setIsStarted(true);
    engine.reset();
  };

  if (!isStarted) {
    return (
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
              textAlign="center">
              LANGUAGE: {challenge.language.toUpperCase()} | DIFFICULTY: {challenge.difficulty.toUpperCase()}
            </Box>
            
            {/* Gamification Elements */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              bg="#001100"
              border="1px solid #003300"
              borderRadius="4px"
              p={3}
              mt={4}
              maxW="450px"
              mx="auto"
            >
              <Text color="#00ff00" fontSize="sm" mb={2} fontWeight="bold" textAlign="center">
                🎮 CODING QUEST OBJECTIVES
              </Text>
              <VStack spacing={2} align="start" fontSize="xs" color="#00cc00">
                <Box>
                  <Text>✅ Type code accurately to gain XP</Text>
                </Box>
                <Box>
                  <Text>✅ Build combos for multiplier bonuses</Text>
                </Box>
                <Box>
                  <Text>✅ Achieve 100% accuracy for achievements</Text>
                </Box>
                <Box>
                  <Text>✅ Maintain streaks to unlock special powers</Text>
                </Box>
              </VStack>
            </MotionBox>
            
            <MotionBox
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
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
                _active={{ transform: "scale(0.98)" }}
                size={fullScreen ? "xl" : "lg"}
              >
                🚀 BEGIN QUEST 🚀
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
      {/* Progress Bar */}
      <Box
        bg={colors.terminal.surface}
        border={`1px solid ${colors.terminal.border}`}
        p={2}
        flexShrink={0}
      >
        <HStack justify="space-between" mb={2}>
          <Text fontSize="xs" color={colors.terminal.textSecondary}>
            │ QUEST PROGRESS
          </Text>
          
          {gameStats.streakLevel > 0 && (
            <HStack spacing={1}>
              <Text fontSize="xs" color="#ffd93d">STREAK LEVEL:</Text>
              <Text fontSize="xs" color="#ffaa00" fontWeight="bold">
                {Array(gameStats.streakLevel).fill('✦').join('')}
              </Text>
            </HStack>
          )}
        </HStack>
        
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
            animate={{ 
              width: `${engine.getProgress()}%`,
              background: gameStats.streakLevel >= 3 
                ? `linear-gradient(90deg, #00ff00, #ffff00, #00ff00)` 
                : `linear-gradient(90deg, ${colors.primary[500]}, ${colors.primary[400]})`
            }}
            transition={{ duration: 0.3 }}
            style={{
              height: '100%',
              boxShadow: `0 0 10px ${colors.primary[500]}`
            }}
          />
        </Box>
        
        <HStack justify="space-between" mt={1}>
          <Text 
            fontSize="xs"
            color={colors.terminal.textSecondary}>
            {Math.round(engine.getProgress())}% Complete
          </Text>
          <HStack spacing={2}>
            {gameStats.bonusPoints > 0 && (
              <Text fontSize="xs" color="#ffaa00" fontWeight="bold">
                Bonus: +{gameStats.bonusPoints} pts
              </Text>
            )}
            
            {gameStats.powerLevel > 1 && (
              <Text fontSize="xs" color="#ff6b6b" fontWeight="bold">
                POWER LVL {gameStats.powerLevel}
              </Text>
            )}
          </HStack>
        </HStack>
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
        <Box
          position="fixed"
          top="10px"
          left="50%"
          transform="translateX(-50%)"
          zIndex={999}
          textAlign="center"
          pointerEvents="none"
          color={colors.primary[500]}
          fontWeight={typography.weights.bold}
          fontSize="md"
        >
          ✅ COMPLETED! | Score: {engineState.totalScore} | WPM: {engineState.wpm} | Accuracy: {engineState.accuracy}%
        </Box>
      )}
      
      {!engineState.isComplete && (
        <Text 
          fontSize="xs"
          color={colors.terminal.textSecondary} 
          textAlign="center"
          opacity={0.7}
          position="absolute"
          bottom="10px"
          left="50%"
          transform="translateX(-50%)"
          pointerEvents="none"
        >
          Type the code above exactly as shown
        </Text>
      )}
    </Box>
  );
};

export default TypingChallenge;