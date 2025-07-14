// Updated Typing Challenge Component - Using new engine
import React, { useState, useEffect } from "react";
import { Box, Text, VStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { TypingEngine } from "../engine/core/TypingEngine";
import { EffectSystem } from "../engine/systems/EffectSystem";
import { TypingDisplay } from "../engine/components/TypingDisplay";
import { GameStats } from "../engine/components/GameStats";
import { TerminalPanel } from "../design/components/TerminalPanel";
import { PatternBonusDisplay } from "../design/components/PatternBonusDisplay";
import { colors } from "../design/tokens/colors";
import { typography } from "../design/tokens/typography";
import { spacing } from "../design/tokens/spacing";
import { createPulseAnimation } from "../design/tokens/animations";

const MotionBox = motion(Box);

const TypingChallenge = ({ challenge, onComplete, isActive = false, currentLevel }) => {
  const [engine] = useState(() => new TypingEngine());
  const [effectSystem] = useState(() => new EffectSystem());
  const [isStarted, setIsStarted] = useState(false);
  const [engineState, setEngineState] = useState(engine.state);
  const [activePatterns, setActivePatterns] = useState([]);

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
        const newPatterns = newState.patternMatches.filter(
          pattern => !activePatterns.some(active => active.id === pattern.id)
        );
        
        if (newPatterns.length > 0) {
          setActivePatterns(prev => [...prev, ...newPatterns]);
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
    }, 500);
    
    return () => clearInterval(cleanup);
  }, [engine]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      effectSystem.destroy();
    };
  }, [effectSystem]);

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
      >
        <TerminalPanel title="TYPING CHALLENGE READY" variant="primary">
          <VStack spacing={spacing[4]}>
            <Box
              {...createPulseAnimation(1)}
              color={colors.primary[500]}
              fontWeight={typography.weights.bold}
              fontSize={typography.sizes.xl}
            >
              {challenge.title}
            </Box>
            
            <Text fontSize={typography.sizes.base} color={colors.terminal.textSecondary}>
              {challenge.description}
            </Text>
            
            <Box fontSize={typography.sizes.xs} color={colors.combo.perfect}>
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
                _hover={{ 
                  bg: colors.terminal.surface,
                  boxShadow: `0 0 15px ${colors.primary[500]}`
                }}
                onClick={startChallenge}
                size="lg"
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
    <VStack spacing={spacing[4]} align="stretch">
      {/* Pattern Bonus Display */}
      <PatternBonusDisplay
        patterns={activePatterns}
        onPatternComplete={(patternId) => {
          setActivePatterns(prev => prev.filter(p => p.id !== patternId));
        }}
      />
      
      {/* Game Stats */}
      <GameStats engine={engine} />
      
      {/* Progress Bar */}
      <TerminalPanel title="CHALLENGE PROGRESS">
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
          fontSize={typography.sizes.xs} 
          color={colors.terminal.textSecondary}
          textAlign="center"
          mt={spacing[2]}
        >
          {Math.round(engine.getProgress())}% Complete
        </Text>
      </TerminalPanel>
      
      {/* Typing Display */}
      <TypingDisplay
        text={challenge.code}
        engine={engine}
        onCharacterClick={(index) => {
          console.log('Clicked character at index:', index);
        }}
      />
      
      {/* Completion Message */}
      {engineState.isComplete && (
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
        >
          <TerminalPanel title="CHALLENGE COMPLETED!" variant="primary">
            <VStack spacing={spacing[3]}>
              <Box
                {...createPulseAnimation(1.5)}
                color={colors.primary[500]}
                fontWeight={typography.weights.bold}
                fontSize={typography.sizes['2xl']}
                textAlign="center"
              >
                🎉 CHALLENGE MASTERED! 🎉
              </Box>
              
              <Box fontSize={typography.sizes.base} textAlign="center">
                <Text color={colors.combo.perfect}>
                  Final Score: {engineState.totalScore}
                </Text>
                <Text color={colors.terminal.textSecondary} mt={spacing[1]}>
                  WPM: {engineState.wpm} | Accuracy: {engineState.accuracy}% | Max Combo: x{engineState.maxCombo}
                </Text>
              </Box>
              
              {engineState.perfectStreak > 5 && (
                <Box
                  bg={colors.performance.perfect.primary}
                  color="#fff"
                  p={spacing[2]}
                  textAlign="center"
                  fontWeight={typography.weights.bold}
                >
                  ⚡ PERFECT STREAK: {engineState.perfectStreak} ⚡
                </Box>
              )}
            </VStack>
          </TerminalPanel>
        </MotionBox>
      )}
      
      {!engineState.isComplete && (
        <Text 
          fontSize={typography.sizes.xs} 
          color={colors.terminal.textSecondary} 
          textAlign="center"
          style={{ opacity: 0.7 }}
        >
          Type the code above exactly as shown. Build combos for higher scores!
        </Text>
      )}
    </VStack>
  );
};

export default TypingChallenge;