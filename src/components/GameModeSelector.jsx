import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const GameModeSelector = ({ currentMode, onModeChange, language }) => {
  const modes = [
    {
      id: 'editor',
      name: 'CODE EDITOR',
      description: 'Free coding with execution',
      icon: '⌨️'
    },
    {
      id: 'typing',
      name: 'TYPING CHALLENGE',
      description: 'Improve typing with code',
      icon: '🎯'
    },
    {
      id: 'hybrid',
      name: 'HYBRID MODE',
      description: 'Type then execute code',
      icon: '🚀'
    }
  ];

  return (
    <Box bg="#111" border="1px solid #333" p={3} mb={4}>
      <Text fontSize="xs" color="#666" mb={3} fontFamily="'Courier New', monospace">
        │ GAME MODE SELECTION
      </Text>
      
      <HStack spacing={2}>
        {modes.map((mode) => (
          <MotionBox
            key={mode.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            flex={1}
          >
            <Button
              bg={currentMode === mode.id ? "#003300" : "#000"}
              color={currentMode === mode.id ? "#00ff00" : "#666"}
              border="1px solid"
              borderColor={currentMode === mode.id ? "#00ff00" : "#333"}
              borderRadius="0"
              fontFamily="'Courier New', monospace"
              fontSize="xs"
              h="auto"
              p={3}
              _hover={{ 
                bg: currentMode === mode.id ? "#004400" : "#111",
                borderColor: "#00ff00"
              }}
              onClick={() => onModeChange(mode.id)}
              w="100%"
            >
              <VStack spacing={1}>
                <Text fontSize="lg">{mode.icon}</Text>
                <Text fontSize="xs" fontWeight="bold">{mode.name}</Text>
                <Text fontSize="xs" color="#888" textAlign="center">
                  {mode.description}
                </Text>
              </VStack>
            </Button>
          </MotionBox>
        ))}
      </HStack>
      
      {currentMode === 'typing' && (
        <MotionBox
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          mt={3}
          p={2}
          bg="#000"
          border="1px solid #333"
        >
          <Text fontSize="xs" color="#ffaa00" mb={1}>
            💡 TYPING MODE ACTIVE
          </Text>
          <Text fontSize="xs" color="#666">
            Complete typing challenges to earn XP and improve your coding speed.
            Current language: {language.toUpperCase()}
          </Text>
        </MotionBox>
      )}
    </Box>
  );
};

export default GameModeSelector;