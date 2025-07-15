import React from "react";
import { Box, HStack, VStack, Text, Progress } from "@chakra-ui/react";

/**
 * GameHeader - Header component for the Code Stacking game
 * 
 * @param {Object} props - Component props
 * @param {string} props.status - Current game status
 * @param {number} props.score - Current score
 * @param {number} props.timeRemaining - Time remaining in seconds
 * @param {number} props.progress - Progress percentage
 * @param {Function} props.formatTime - Function to format time
 * @returns {JSX.Element} - Rendered component
 */
const GameHeader = ({ 
  status, 
  score, 
  timeRemaining, 
  progress,
  formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
}) => {
  return (
    <Box p={4} borderBottom="1px solid #333">
      <HStack justify="space-between">
        <VStack align="start" spacing={1}>
          <Text color="#00ff00" fontWeight="bold">
            Code Stacking Challenge
          </Text>
          <Text color="#ccc" fontSize="sm">
            Arrange code blocks in the correct order
          </Text>
        </VStack>

        {status === "active" && (
          <HStack>
            <Text color="#ffd93d" fontWeight="bold">
              Score: {score}
            </Text>
            <Text color={timeRemaining < 10 ? "#ff6b6b" : "#ccc"}>
              Time: {formatTime(timeRemaining)}
            </Text>
          </HStack>
        )}
      </HStack>

      {status === "active" && (
        <Box mt={2}>
          <Text color="#666" fontSize="xs" mb={1}>
            Progress: {Math.round(progress)}%
          </Text>
          <Progress
            value={progress}
            colorScheme="green"
            size="xs"
            bg="#333"
            borderRadius="full"
          />
        </Box>
      )}
    </Box>
  );
};

export default GameHeader;