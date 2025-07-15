import React from "react";
import { Box, VStack, HStack, Text, Button } from "@chakra-ui/react";

/**
 * GameFooter - Displays completion or failure information and controls
 * 
 * @param {Object} props - Component props
 * @param {string} props.status - Current game status (completed, failed)
 * @param {number} props.score - Final score
 * @param {number} props.timeRemaining - Remaining time in seconds
 * @param {Function} props.onReset - Function to call to reset game
 * @param {Function} props.formatTime - Function to format time
 * @returns {JSX.Element | null} - Rendered component or null
 */
const GameFooter = ({ 
  status, 
  score, 
  timeRemaining, 
  onReset,
  formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}) => {
  // Only render for completed or failed status
  if (status !== "completed" && status !== "failed") {
    return null;
  }
  
  const isCompleted = status === "completed";
  
  return (
    <Box 
      p={4} 
      bg={isCompleted ? "#001800" : "#180000"} 
      borderTop={`1px solid ${isCompleted ? "#00ff00" : "#ff6b6b"}`}
    >
      <VStack spacing={3}>
        <Text 
          color={isCompleted ? "#00ff00" : "#ff6b6b"} 
          fontWeight="bold" 
          fontSize="xl"
        >
          {isCompleted ? "Challenge Completed!" : "Time's Up!"}
        </Text>

        <HStack spacing={6}>
          <VStack>
            <Text color="#666">Final Score</Text>
            <Text color="#ffd93d" fontWeight="bold" fontSize="xl">
              {score}
            </Text>
          </VStack>

          {isCompleted && (
            <VStack>
              <Text color="#666">Time Remaining</Text>
              <Text color="#00ff00" fontWeight="bold">
                {formatTime(timeRemaining)}
              </Text>
            </VStack>
          )}
        </HStack>

        <Button colorScheme="blue" onClick={onReset}>
          Try Again
        </Button>
      </VStack>
    </Box>
  );
};

export default GameFooter;