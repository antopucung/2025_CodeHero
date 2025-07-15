import React from "react";
import { Box, VStack, Text, Button } from "@chakra-ui/react";

/**
 * StartScreen - Initial screen for Code Stacking game
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onStart - Function to call when start button is clicked
 * @returns {JSX.Element} - Rendered component
 */
const StartScreen = ({ onStart }) => {
  return (
    <Box p={10} textAlign="center">
      <VStack spacing={6}>
        <Text fontSize="xl" color="#00ff00" fontWeight="bold">
          Ready to start the challenge?
        </Text>

        <Text color="#ccc">
          Arrange the code blocks in the correct order to form a complete program.
        </Text>

        <Button
          colorScheme="green"
          onClick={onStart}
          size="lg"
          px={8}
        >
          Start Challenge
        </Button>
      </VStack>
    </Box>
  );
};

export default StartScreen;