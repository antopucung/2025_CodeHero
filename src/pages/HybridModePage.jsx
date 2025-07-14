import React, { useState } from "react";
import { Box, Text, VStack, HStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import HybridMode from "../components/HybridMode";
import GameStats from "../components/GameStats";
import { useGameProgress } from "../hooks/useGameProgress";
import { getRandomChallenge, getChallengesByLanguage } from "../data/challenges";

const MotionBox = motion(Box);

const HybridModePage = () => {
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner");
  const [currentStats, setCurrentStats] = useState(null);
  const { progress, completeChallenge } = useGameProgress();

  const languages = ["javascript", "python", "typescript", "java"];
  const difficulties = ["beginner", "intermediate", "advanced"];

  const startNewChallenge = () => {
    const challenge = getRandomChallenge(selectedLanguage, selectedDifficulty);
    setCurrentChallenge(challenge);
    setCurrentStats(null);
  };

  const handleHybridComplete = (typingStats, executionStats) => {
    const combinedStats = {
      ...typingStats,
      executionSuccess: !executionStats.error,
      executionOutput: executionStats.output
    };
    
    completeChallenge(combinedStats, selectedLanguage);
    setCurrentStats(combinedStats);
    
    // Auto-start next challenge after 4 seconds (longer for hybrid)
    setTimeout(() => {
      startNewChallenge();
    }, 4000);
  };

  return (
    <Box h="100%" display="flex" flexDirection="column" overflow="hidden">
      {/* Page Header */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        bg="#111"
        borderBottom="1px solid #333"
        p={4}
        flexShrink={0}
      >
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={0}>
            <Text fontSize="xl" color="#00ff00" fontWeight="bold">
              🚀 Hybrid Mode
            </Text>
            <Text fontSize="sm" color="#666">
              Type code challenges then execute for complete learning experience
            </Text>
          </VStack>
          
          <Box w="300px">
            <GameStats 
              progress={progress} 
              currentStats={currentStats}
              compact={true}
            />
          </Box>
        </HStack>
      </MotionBox>

      {/* Challenge Setup or Active Challenge */}
      <Box flex={1} overflow="hidden">
        {!currentChallenge ? (
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="linear-gradient(135deg, #000 0%, #111 50%, #000 100%)"
          >
            <VStack spacing={8} maxW="600px" w="100%" p={8}>
              <MotionBox
                animate={{
                  textShadow: [
                    "0 0 20px #ff6b6b",
                    "0 0 40px #ff6b6b",
                    "0 0 20px #ff6b6b"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                textAlign="center"
              >
                <Text fontSize="4xl" fontWeight="bold" color="#ff6b6b" mb={4}>
                  🚀 Hybrid Learning
                </Text>
                <Text fontSize="lg" color="#666" mb={8}>
                  Type code with gamification, then execute to see results!
                </Text>
              </MotionBox>

              {/* Language Selection */}
              <VStack spacing={4} w="100%">
                <Text fontSize="lg" color="#00ff00" fontWeight="bold">
                  Select Language
                </Text>
                <HStack spacing={3} flexWrap="wrap" justify="center">
                  {languages.map((lang) => (
                    <MotionBox
                      key={lang}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        bg={selectedLanguage === lang ? "#003300" : "#000"}
                        color={selectedLanguage === lang ? "#00ff00" : "#666"}
                        border="1px solid"
                        borderColor={selectedLanguage === lang ? "#00ff00" : "#333"}
                        borderRadius="4px"
                        fontFamily="'Courier New', monospace"
                        fontSize="sm"
                        px={6}
                        py={3}
                        _hover={{ 
                          bg: "#111",
                          borderColor: "#00ff00",
                          color: "#00ff00"
                        }}
                        onClick={() => setSelectedLanguage(lang)}
                      >
                        {lang.toUpperCase()}
                      </Button>
                    </MotionBox>
                  ))}
                </HStack>
              </VStack>

              {/* Difficulty Selection */}
              <VStack spacing={4} w="100%">
                <Text fontSize="lg" color="#00ff00" fontWeight="bold">
                  Select Difficulty
                </Text>
                <HStack spacing={3} flexWrap="wrap" justify="center">
                  {difficulties.map((diff) => (
                    <MotionBox
                      key={diff}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        bg={selectedDifficulty === diff ? "#003300" : "#000"}
                        color={selectedDifficulty === diff ? "#00ff00" : "#666"}
                        border="1px solid"
                        borderColor={selectedDifficulty === diff ? "#00ff00" : "#333"}
                        borderRadius="4px"
                        fontFamily="'Courier New', monospace"
                        fontSize="sm"
                        px={6}
                        py={3}
                        _hover={{ 
                          bg: "#111",
                          borderColor: "#00ff00",
                          color: "#00ff00"
                        }}
                        onClick={() => setSelectedDifficulty(diff)}
                      >
                        {diff.toUpperCase()}
                      </Button>
                    </MotionBox>
                  ))}
                </HStack>
              </VStack>

              {/* Start Button */}
              <MotionBox
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                mt={8}
              >
                <Button
                  bg="#ff6b6b"
                  color="#fff"
                  borderRadius="8px"
                  fontFamily="'Courier New', monospace"
                  fontSize="lg"
                  fontWeight="bold"
                  px={12}
                  py={6}
                  h="auto"
                  _hover={{ 
                    bg: "#ff8e8e",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px #ff6b6b66"
                  }}
                  onClick={startNewChallenge}
                >
                  🚀 START HYBRID MODE 🚀
                </Button>
              </MotionBox>

              {/* Mode Info */}
              <Box
                bg="#111"
                border="1px solid #333"
                borderRadius="8px"
                p={4}
                w="100%"
              >
                <Text fontSize="sm" color="#ff6b6b" fontWeight="bold" mb={2} textAlign="center">
                  🎯 HYBRID MODE FEATURES
                </Text>
                <VStack spacing={1} fontSize="xs" color="#888">
                  <Text>✓ Type code with full gamification effects</Text>
                  <Text>✓ Execute typed code to see real results</Text>
                  <Text>✓ Learn programming while building typing skills</Text>
                  <Text>✓ Double rewards for completion</Text>
                </VStack>
                <Text fontSize="xs" color="#666" mt={3} textAlign="center">
                  Selected: {selectedLanguage.toUpperCase()} - {selectedDifficulty.toUpperCase()}
                </Text>
              </Box>
            </VStack>
          </MotionBox>
        ) : (
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            h="100%"
            p={4}
            overflow="hidden"
          >
            <HybridMode
              challenge={currentChallenge}
              language={selectedLanguage}
              currentLevel={progress.level}
              onComplete={handleHybridComplete}
              isActive={true}
              fullScreen={true}
            />
          </MotionBox>
        )}
      </Box>
    </Box>
  );
};

export default HybridModePage;