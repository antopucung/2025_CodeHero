import React, { useState } from "react";
import { Box, Text as ChakraText, VStack, HStack, Button } from "@chakra-ui/react";
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
    <Box w="100%" h="100%" display="flex" flexDirection="column" overflow="hidden">
      {/* Page Header - Fixed Height */}
      <MotionBox
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        bg="#111"
        borderBottom="1px solid #333"
        p={3}
        h="80px"
        flexShrink={0}
        overflow="hidden"
      >
        <HStack justify="space-between" align="center" h="100%">
          <VStack align="start" spacing={0}>
           <ChakraText fontSize="lg" color="#00ff00" fontWeight="bold">
              🎯 Typing Challenge
           </ChakraText>
           <ChakraText fontSize="xs" color="#666">
              Gamified typing with combos and achievements
           </ChakraText>
          </VStack>
          
          <Box w={{ base: "200px", md: "250px" }} h="100%">
            <GameStats 
              progress={progress} 
              currentStats={currentStats}
              compact={true}
            />
          </Box>
        </HStack>
      </MotionBox>

      {/* Challenge Content - Dynamic Height */}
      <Box flex={1} overflow="hidden">
        {!currentChallenge ? (
          <MotionBox
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="linear-gradient(135deg, #000 0%, #111 50%, #000 100%)"
            overflow="hidden"
          >
            <VStack spacing={6} maxW="500px" w="100%" p={6}>
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
                <ChakraText fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="#ffd93d" mb={3}>
                  🎯 Ready to Type?
                </ChakraText>
                <ChakraText fontSize={{ base: "sm", md: "md" }} color="#666" mb={6}>
                  Choose your challenge settings
                </ChakraText>
              </MotionBox>

              {/* Language Selection */}
              <VStack spacing={3} w="100%">
                <ChakraText fontSize="md" color="#00ff00" fontWeight="bold">
                  Language
                </ChakraText>
                <HStack spacing={2} flexWrap="wrap" justify="center">
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
                        fontSize="xs"
                        px={3}
                        py={2}
                        h="auto"
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
              <VStack spacing={3} w="100%">
                <Text fontSize="md" color="#00ff00" fontWeight="bold">
                  Difficulty
                </Text>
                <HStack spacing={2} flexWrap="wrap" justify="center">
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
                        fontSize="xs"
                        px={3}
                        py={2}
                        h="auto"
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
                mt={4}
              >
                <Button
                  bg="#ffd93d"
                  color="#000"
                  borderRadius="6px"
                  fontFamily="'Courier New', monospace"
                  fontSize="md"
                  fontWeight="bold"
                  px={8}
                  py={4}
                  h="auto"
                  _hover={{ 
                    bg: "#ffed4e",
                    transform: "translateY(-1px)",
                    boxShadow: "0 4px 20px #ffd93d66"
                  }}
                  onClick={startNewChallenge}
                >
                  🚀 START CHALLENGE
                </Button>
              </MotionBox>

              {/* Info */}
              <Box
                bg="#111"
                border="1px solid #333"
                borderRadius="6px"
                p={3}
                w="100%"
                textAlign="center"
              >
                <Text fontSize="xs" color="#666" mb={1}>
                  {selectedLanguage.toUpperCase()} - {selectedDifficulty.toUpperCase()}
                </Text>
                <Text fontSize="xs" color="#888">
                  {getChallengesByLanguage(selectedLanguage).filter(c => c.difficulty === selectedDifficulty).length} challenges available
                </Text>
              </Box>
            </VStack>
          </MotionBox>
        ) : (
          <MotionBox
            initial={{ opacity: 0, scale: 0.98 }}
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