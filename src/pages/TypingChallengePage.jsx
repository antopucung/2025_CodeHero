import React, { useState } from "react";
import { Box, Text, VStack, HStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import TypingChallenge from "../components/TypingChallenge";
import GameStats from "../components/GameStats";
import { useGameProgress } from "../hooks/useGameProgress";
import { getRandomChallenge, getChallengesByLanguage } from "../data/challenges";

const MotionBox = motion(Box);

const TypingChallengePage = () => {
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

  const handleChallengeComplete = (stats) => {
    completeChallenge(stats, selectedLanguage);
    setCurrentStats(stats);
    
    // Auto-start next challenge after 3 seconds
    setTimeout(() => {
      startNewChallenge();
    }, 3000);
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
              🎯 Typing Challenge
            </Text>
            <Text fontSize="sm" color="#666">
              Gamified typing with combos, achievements, and progression
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
                    "0 0 20px #ffd93d",
                    "0 0 40px #ffd93d",
                    "0 0 20px #ffd93d"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                textAlign="center"
              >
                <Text fontSize="4xl" fontWeight="bold" color="#ffd93d" mb={4}>
                  🎯 Ready to Type?
                </Text>
                <Text fontSize="lg" color="#666" mb={8}>
                  Choose your challenge settings and start building those combos!
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
                  bg="#ffd93d"
                  color="#000"
                  borderRadius="8px"
                  fontFamily="'Courier New', monospace"
                  fontSize="lg"
                  fontWeight="bold"
                  px={12}
                  py={6}
                  h="auto"
                  _hover={{ 
                    bg: "#ffed4e",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px #ffd93d66"
                  }}
                  onClick={startNewChallenge}
                >
                  🚀 START TYPING CHALLENGE 🚀
                </Button>
              </MotionBox>

              {/* Challenge Info */}
              <Box
                bg="#111"
                border="1px solid #333"
                borderRadius="8px"
                p={4}
                w="100%"
                textAlign="center"
              >
                <Text fontSize="sm" color="#666" mb={2}>
                  Selected: {selectedLanguage.toUpperCase()} - {selectedDifficulty.toUpperCase()}
                </Text>
                <Text fontSize="xs" color="#888">
                  Available challenges: {getChallengesByLanguage(selectedLanguage).filter(c => c.difficulty === selectedDifficulty).length}
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
            <TypingChallenge
              challenge={currentChallenge}
              currentLevel={progress.level}
              onComplete={handleChallengeComplete}
              isActive={true}
              fullScreen={true}
            />
          </MotionBox>
        )}
      </Box>
    </Box>
  );
};

export default TypingChallengePage;