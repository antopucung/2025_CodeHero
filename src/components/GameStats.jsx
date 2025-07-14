import { Box, Text, HStack, VStack, Progress } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { JuicyProgressBar } from "./TypingEffects";
import { PulseAnimation } from "./BlockLetterEffect";

const MotionBox = motion(Box);

const GameStats = ({ progress, currentStats = null, streak = 0 }) => {
  const xpForNextLevel = progress.level * 100;
  const xpProgress = (progress.xp / xpForNextLevel) * 100;

  return (
    <MotionBox 
      bg="#111" 
      border="1px solid #333" 
      p={3} 
      mb={4}
      whileHover={{ 
        borderColor: "#00ff00",
        boxShadow: "0 0 10px rgba(0, 255, 0, 0.3)"
      }}
      transition={{ duration: 0.3 }}
    >
      <Text fontSize="xs" color="#666" mb={2} fontFamily="'Courier New', monospace">
        │ PLAYER STATS
      </Text>
      
      <VStack spacing={2} align="stretch">
        {/* Level and XP */}
        <HStack justify="space-between" align="center">
          <PulseAnimation isActive={true} color="#00ff00" intensity={1.5}>
            <Text fontSize="sm" color="#00ff00" fontFamily="'Courier New', monospace" fontWeight="bold">
              LEVEL {progress.level}
            </Text>
          </PulseAnimation>
          <Text fontSize="xs" color="#666">
            {progress.xp}/{xpForNextLevel} XP
          </Text>
        </HStack>
        
        <JuicyProgressBar progress={xpProgress} color="#00ff00" />

        {/* Current Session Stats */}
        {currentStats && (
          <MotionBox
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              borderColor: ["#333", "#00ff00", "#333"]
            }}
            transition={{ 
              duration: 0.5,
              borderColor: { repeat: Infinity, duration: 2 }
            }}
            border="1px solid #333"
            borderRadius="4px"
            p={2}
            bg="#000"
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
                bg="linear-gradient(45deg, #ff6b6b, #ffd93d)"
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
        <MotionBox 
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
        </MotionBox>

        {/* Achievements */}
        {progress.achievements.length > 0 && (
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