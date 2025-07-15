import { Box, Text as ChakraText, HStack, VStack, Progress } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { JuicyProgressBar } from "./TypingEffects";
import { PulseAnimation } from "./BlockLetterEffect";
import { colors } from "../design/tokens/colors";
import { typography } from "../design/tokens/typography";
import { spacing } from "../design/tokens/spacing";

const MotionBox = motion(Box);

const GameStats = ({ progress, currentStats = null, streak = 0, compact = false }) => {
  const xpForNextLevel = progress.level * 100;
  const xpProgress = (progress.xp / xpForNextLevel) * 100;
  
  // Get optimization data if available
  const optimizations = progress.optimizations || {};
  const performanceMode = optimizations.performance?.mode || 'high';
  const fps = optimizations.performance?.fps || 60;
  const effectScale = optimizations.performance?.effectScale || 1;

  return (
    <MotionBox 
      bg={colors.terminal.surface}
      border={`1px solid ${colors.terminal.border}`}
      p={compact ? spacing[2] : spacing[3]}
      h="100%"
      overflow="hidden"
      whileHover={{ 
        borderColor: colors.primary[500],
        boxShadow: `0 0 10px ${colors.primary[500]}33`
      }}
      transition={{ duration: 0.3 }}
    >
      <ChakraText fontSize={compact ? "xs" : typography.sizes.xs} color={colors.terminal.textSecondary} mb={compact ? 1 : spacing[2]} fontFamily={typography.fonts.mono}>
        │ PLAYER STATS
      </ChakraText>
      
      <VStack spacing={compact ? 1 : spacing[2]} align="stretch" h="calc(100% - 20px)" overflow="hidden">
        {/* Level and XP */}
        <HStack justify="space-between" align="center">
          <PulseAnimation isActive={true} color={colors.primary[500]} intensity={1.5}>
            <ChakraText fontSize={compact ? "xs" : typography.sizes.sm} color={colors.primary[500]} fontFamily={typography.fonts.mono} fontWeight={typography.weights.bold}>
              LEVEL {progress.level}
            </ChakraText>
          </PulseAnimation>
          <ChakraText fontSize={compact ? "xs" : typography.sizes.xs} color={colors.terminal.textSecondary}>
            {progress.xp}/{xpForNextLevel} XP
          </ChakraText>
        </HStack>
        
        <Box h={compact ? "4px" : "8px"}>
          <JuicyProgressBar progress={xpProgress} color={colors.primary[500]} />
        </Box>
        
        {/* Performance indicator */}
        {!compact && performanceMode !== 'high' && (
          <HStack justify="space-between" fontSize="xs">
            <Text color={colors.terminal.textSecondary}>PERFORMANCE</Text>
            <Text color={fps >= 55 ? colors.performance.good.primary : fps >= 45 ? colors.performance.best.primary : colors.performance.error.primary}>
              {performanceMode.toUpperCase()} ({fps} FPS) [{Math.round(effectScale * 100)}%]
            </Text>
          </HStack>
        )}
        
        {/* Effect scale indicator for low performance */}
        {!compact && effectScale < 0.8 && (
          <HStack justify="space-between" fontSize="xs">
            <Text color={colors.terminal.textSecondary}>EFFECTS</Text>
            <Text color={effectScale < 0.5 ? colors.performance.error.primary : colors.performance.best.primary}>
              {Math.round(effectScale * 100)}% INTENSITY
            </Text>
          </HStack>
        )}

        {/* Current Session Stats */}
        {currentStats && (
          <MotionBox
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              borderColor: currentStats.combo >= 10 ? 
                ["#333", "#4ecdc4", "#333"] : 
                ["#333", "#00ff00", "#333"]
            }}
            transition={{ 
              duration: 0.5,
              borderColor: { repeat: Infinity, duration: 2 }
            }}
            border="1px solid #333"
            borderRadius="4px"
            p={compact ? 1 : 2}
            bg={currentStats.combo >= 20 ? "#001100" : "#000"}
          >
            <HStack justify="space-between">
              <VStack spacing={0} align="start">
                <Text fontSize="xs" color="#666">WPM</Text>
                <PulseAnimation isActive={currentStats.wpm > 50} color="#ffff00" intensity={currentStats.wpm / 50}>
                  <Text fontSize="sm" fontWeight="bold">
                    {currentStats.wpm}
                  </Text>
                </PulseAnimation>
              </VStack>
              <VStack spacing={0} align="center">
                <Text fontSize="xs" color="#666">ACCURACY</Text>
                <PulseAnimation isActive={currentStats.accuracy === 100} color="#ffff00">
                  <Text fontSize="sm" fontWeight="bold">
                    {currentStats.accuracy}%
                  </Text>
                </PulseAnimation>
              </VStack>
              <VStack spacing={0} align="end">
                <Text fontSize="xs" color="#666">ERRORS</Text>
                <MotionBox
                  animate={{ 
                    scale: currentStats.errors > 0 ? [1, 1.3, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Text fontSize="sm" color={currentStats.errors > 0 ? "#ff4444" : "#00ff00"} fontWeight="bold">
                  {currentStats.errors}
                  </Text>
                </MotionBox>
              </VStack>
            </HStack>
            
            {/* Streak indicator */}
            {streak > 5 && (
              <MotionBox
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: [1, 1.1, 1],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  scale: { repeat: Infinity, duration: 1 },
                  rotate: { repeat: Infinity, duration: 2 }
                }}
                mt={2}
                textAlign="center"
                bg={compact ? "#ff6b6b" : "linear-gradient(45deg, #ff6b6b, #ffd93d)"}
                color="#000"
                p={1}
                borderRadius="4px"
                fontWeight="bold"
              >
                <Text fontSize="xs">🔥 {streak} STREAK! 🔥</Text>
              </MotionBox>
            )}
          </MotionBox>
        )}

        {/* Best Stats */}
        {!compact && <MotionBox 
          borderTop="1px solid #333" 
          pt={2} 
          mt={2}
          whileHover={{ 
            borderTopColor: "#00ff00",
            scale: 1.02
          }}
          transition={{ duration: 0.3 }}
        >
          <HStack justify="space-between">
            <VStack spacing={0} align="start">
              <Text fontSize="xs" color="#666">BEST WPM</Text>
              <PulseAnimation isActive={true} color="#ffaa00" intensity={0.8}>
                <Text fontSize="sm" color="#ffaa00" fontWeight="bold">{progress.bestWpm}</Text>
              </PulseAnimation>
            </VStack>
            <VStack spacing={0} align="center">
              <Text fontSize="xs" color="#666">BEST ACC</Text>
              <PulseAnimation isActive={true} color="#ffaa00" intensity={0.8}>
                <Text fontSize="sm" color="#ffaa00" fontWeight="bold">{progress.bestAccuracy}%</Text>
              </PulseAnimation>
            </VStack>
            <VStack spacing={0} align="end">
              <Text fontSize="xs" color="#666">COMPLETED</Text>
              <PulseAnimation isActive={true} color="#ffaa00" intensity={0.8}>
                <Text fontSize="sm" color="#ffaa00" fontWeight="bold">{progress.totalChallengesCompleted}</Text>
              </PulseAnimation>
            </VStack>
          </HStack>
        </MotionBox>}

        {/* Achievements */}
        {!compact && progress.achievements.length > 0 && (
          <MotionBox 
            borderTop="1px solid #333" 
            pt={2}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Text fontSize="xs" color="#666" mb={1}>ACHIEVEMENTS</Text>
            <HStack spacing={1} flexWrap="wrap">
              {progress.achievements.map((achievement, index) => (
                <MotionBox
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: 1, 
                    rotate: 0,
                    boxShadow: [
                      "0 0 5px #ffaa00",
                      "0 0 15px #ffaa00",
                      "0 0 5px #ffaa00"
                    ]
                  }}
                  transition={{ 
                    delay: index * 0.1,
                    boxShadow: { repeat: Infinity, duration: 2 }
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Text 
                    fontSize="xs" 
                    color="#ffaa00" 
                    bg="#222" 
                    px={2} 
                    py={1}
                    border="1px solid #444"
                    fontWeight="bold"
                  >
                    {achievement.replace('_', ' ').toUpperCase()}
                  </Text>
                </MotionBox>
              ))}
            </HStack>
          </MotionBox>
        )}
      </VStack>
    </MotionBox>
  );
};

export default GameStats;