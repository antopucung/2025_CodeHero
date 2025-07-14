import { Box, Button, HStack, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const GameModeSelector = ({ currentMode, onModeChange, language, compact = false }) => {
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
      description: 'Gamified typing with combos',
      icon: '🎯'
    },
    {
      id: 'hybrid',
      name: 'HYBRID MODE',
      description: 'Type code then execute',
      icon: '🚀'
    }
  ];

  return (
    <Box bg="#111" border="1px solid #333" p={compact ? 2 : 3}>
      <Text fontSize="xs" color="#666" mb={3} fontFamily="'Courier New', monospace">
        │ GAME MODE SELECTION
      </Text>
      
      <HStack spacing={compact ? 1 : 2} flexWrap={compact ? "wrap" : "nowrap"}>
        {modes.map((mode) => (
          <MotionBox
            key={mode.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            flex={compact ? "none" : 1}
            minW={compact ? "120px" : "auto"}
          >
            <Button
              bg={currentMode === mode.id ? "#003300" : "#000"}
              color={currentMode === mode.id ? "#00ff00" : "#666"}
              border="1px solid"
              borderColor={currentMode === mode.id ? "#00ff00" : "#333"}
              borderRadius="0"
              fontFamily="'Courier New', monospace"
              fontSize={compact ? "xs" : "xs"}
              h="auto"
              p={compact ? 2 : 3}
              _hover={{ 
                bg: currentMode === mode.id ? "#004400" : "#111",
                borderColor: "#00ff00"
              }}
              onClick={() => onModeChange(mode.id)}
              w="100%"
            >
              <VStack spacing={1}>
                <Text fontSize={compact ? "md" : "lg"}>{mode.icon}</Text>
                <Text fontSize="xs" fontWeight="bold">
                  {compact ? mode.name.split(' ')[0] : mode.name}
                </Text>
                {!compact && <Text fontSize="xs" color="#888" textAlign="center">
                  {mode.description}
                </Text>}
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
            💡 TYPING MODE ACTIVE - COMBO SYSTEM ENABLED
          </Text>
          {!compact && <Text fontSize="xs" color="#666">
            Build combos by typing fast and accurately! Higher combos = more points and better effects.
            Current language: {language.toUpperCase()}
          </Text>}
        </MotionBox>
      )}

      {currentMode === 'hybrid' && (
        <MotionBox
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          mt={3}
          p={2}
          bg="#000"
          border="1px solid #333"
        >
          <Text fontSize="xs" color="#ffaa00" mb={1}>
            🚀 HYBRID MODE - TYPE THEN EXECUTE
          </Text>
          {!compact && <Text fontSize="xs" color="#666">
            Type code challenges with combo effects, then execute to see results!
            Perfect for learning while gaming.
          </Text>}
        </MotionBox>
      )}
    </Box>
  );
};

export default GameModeSelector;