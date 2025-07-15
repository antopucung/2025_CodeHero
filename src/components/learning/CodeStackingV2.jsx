import React, { useState, useEffect } from "react";
import { Box, VStack, HStack, Text, Button, Progress, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

// Simplified DraggableBlock component
const DraggableBlock = ({ block, isPlaced = false }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", block.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <MotionBox
      draggable={!isPlaced}
      onDragStart={handleDragStart}
      bg={isPlaced ? "#003300" : "#222"}
      border={`1px solid ${isPlaced ? "#00ff00" : "#444"}`}
      borderRadius="md"
      p={2}
      mb={2}
      cursor={isPlaced ? "default" : "grab"}
      whileHover={!isPlaced ? { scale: 1.02 } : {}}
      _hover={!isPlaced ? { borderColor: "#4ecdc4" } : {}}
    >
      <Text
        fontFamily="monospace"
        fontSize="sm"
        color="#ccc"
        pl={(block.indentation || 0) / 2 + "px"}
        whiteSpace="pre"
      >
        {block.content}
      </Text>
    </MotionBox>
  );
};

// Simplified DropZone component
const DropZone = ({ onDrop, isActive = false, children, index }) => {
  const handleDragOver = (e) => {
    if (isActive) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleDrop = (e) => {
    if (isActive) {
      e.preventDefault();
      e.stopPropagation();
      const blockId = e.dataTransfer.getData("text/plain");
      onDrop(blockId, index);
    }
  };

  return (
    <Box
      minH={children ? "auto" : "40px"}
      bg={isActive ? "rgba(78, 205, 196, 0.1)" : "transparent"}
      borderRadius="md"
      border={isActive ? "2px dashed rgba(78, 205, 196, 0.5)" : "2px dashed transparent"}
      mb={2}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {children || (isActive && <Text color="#666" fontSize="xs">Drop here</Text>)}
    </Box>
  );
};

// Main CodeStackingV2 component - simplified for functionality
const CodeStackingV2 = ({ code, language = "javascript", onComplete = () => {} }) => {
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [solutionBlocks, setSolutionBlocks] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("waiting"); // waiting, active, completed, failed
  const toast = useToast();

  // Initialize code blocks - simple function to split by lines
  useEffect(() => {
    if (code && status === "waiting") {
      const lines = code.split("\n").filter((line) => line.trim() !== "");
      const blocks = lines.map((line, index) => ({
        id: `block-${index}`,
        content: line,
        indentation: getIndentation(line),
        lineNumber: index + 1,
      }));
      
      // Shuffle blocks for the challenge
      const shuffled = [...blocks].sort(() => Math.random() - 0.5);
      setAvailableBlocks(shuffled);
    }
  }, [code, status]);

  // Helper to get indentation
  const getIndentation = (line) => {
    const match = line.match(/^(\s*)/);
    return match ? match[0].length : 0;
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (status === "active") {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStatus("failed");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status]);

  // Start the quiz
  const handleStart = () => {
    setStatus("active");
    setTimeRemaining(120);
    setScore(0);
    setSolutionBlocks([]);
  };

  // Reset the quiz
  const handleReset = () => {
    setStatus("waiting");
    setTimeRemaining(120);
    setScore(0);
    setSolutionBlocks([]);

    // Re-initialize blocks
    if (code) {
      const lines = code.split("\n").filter((line) => line.trim() !== "");
      const blocks = lines.map((line, index) => ({
        id: `block-${index}`,
        content: line,
        indentation: getIndentation(line),
        lineNumber: index + 1,
      }));
      
      // Shuffle blocks
      const shuffled = [...blocks].sort(() => Math.random() - 0.5);
      setAvailableBlocks(shuffled);
    }
  };

  // Handle dropping a block at a specific position
  const handleDrop = (blockId, dropIndex) => {
    // Find the block in available blocks
    const blockIndex = availableBlocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) return;

    // Get the block and remove from available blocks
    const block = availableBlocks[blockIndex];
    const newAvailableBlocks = [...availableBlocks];
    newAvailableBlocks.splice(blockIndex, 1);
    setAvailableBlocks(newAvailableBlocks);

    // Add to solution at the specified position
    const newSolution = [...solutionBlocks];
    newSolution.splice(dropIndex, 0, block);
    setSolutionBlocks(newSolution);

    // Add points
    setScore((prev) => prev + 50);

    toast({
      title: "Block placed!",
      status: "success",
      duration: 1000,
      position: "top-right",
      isClosable: true,
    });

    // Check if all blocks are placed
    if (newAvailableBlocks.length === 0) {
      // Quiz completed
      setStatus("completed");

      // Add time bonus
      const timeBonus = timeRemaining * 5;
      setScore((prev) => prev + timeBonus);

      toast({
        title: "Challenge completed!",
        description: `Time bonus: +${timeBonus} points`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      if (onComplete) {
        onComplete({
          score: score + timeBonus,
          timeRemaining,
          success: true,
        });
      }
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    if (availableBlocks.length + solutionBlocks.length === 0) return 0;
    return (solutionBlocks.length / (availableBlocks.length + solutionBlocks.length)) * 100;
  };

  return (
    <Box bg="#111" borderRadius="md" overflow="hidden">
      {/* Header */}
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
              Progress: {Math.round(getProgress())}%
            </Text>
            <Progress
              value={getProgress()}
              colorScheme="green"
              size="xs"
              bg="#333"
              borderRadius="full"
            />
          </Box>
        )}
      </Box>

      {/* Quiz Content */}
      {status === "waiting" ? (
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
              onClick={handleStart}
              size="lg"
              px={8}
            >
              Start Challenge
            </Button>
          </VStack>
        </Box>
      ) : (
        <HStack p={4} spacing={4} align="start" h="calc(100vh - 300px)" minH="400px">
          {/* Available Blocks */}
          <Box
            flex="1"
            bg="#000"
            p={4}
            borderRadius="md"
            maxH="100%"
            overflowY="auto"
            border="1px solid #333"
          >
            <Text color="#666" mb={3} fontWeight="bold">
              Available Blocks:
            </Text>
            <VStack align="stretch" spacing={2}>
              {availableBlocks.map((block) => (
                <DraggableBlock key={block.id} block={block} />
              ))}

              {availableBlocks.length === 0 && (
                <Text color="#666" textAlign="center" p={4}>
                  All blocks placed!
                </Text>
              )}
            </VStack>
          </Box>

          {/* Solution Area */}
          <Box
            flex="1"
            bg="#000"
            p={4}
            borderRadius="md"
            maxH="100%"
            overflowY="auto"
            border="1px solid #333"
          >
            <Text color="#666" mb={3} fontWeight="bold">
              Your Solution:
            </Text>
            <VStack align="stretch" spacing={0}>
              {/* First drop zone */}
              <DropZone
                isActive={status === "active"}
                onDrop={handleDrop}
                index={0}
              />

              {/* Existing blocks and drop zones in between */}
              {solutionBlocks.map((block, index) => (
                <React.Fragment key={block.id}>
                  <DraggableBlock block={block} isPlaced={true} />
                  <DropZone
                    isActive={status === "active"}
                    onDrop={handleDrop}
                    index={index + 1}
                  />
                </React.Fragment>
              ))}
            </VStack>
          </Box>
        </HStack>
      )}

      {/* Footer */}
      {status === "completed" && (
        <Box p={4} bg="#001800" borderTop="1px solid #00ff00">
          <VStack spacing={3}>
            <Text color="#00ff00" fontWeight="bold" fontSize="xl">
              Challenge Completed!
            </Text>

            <HStack spacing={6}>
              <VStack>
                <Text color="#666">Final Score</Text>
                <Text color="#ffd93d" fontWeight="bold" fontSize="xl">
                  {score}
                </Text>
              </VStack>

              <VStack>
                <Text color="#666">Time Remaining</Text>
                <Text color="#00ff00" fontWeight="bold">
                  {formatTime(timeRemaining)}
                </Text>
              </VStack>
            </HStack>

            <Button colorScheme="blue" onClick={handleReset}>
              Try Again
            </Button>
          </VStack>
        </Box>
      )}

      {status === "failed" && (
        <Box p={4} bg="#180000" borderTop="1px solid #ff6b6b">
          <VStack spacing={3}>
            <Text color="#ff6b6b" fontWeight="bold" fontSize="xl">
              Time's Up!
            </Text>

            <Text color="#ccc">Final Score: {score}</Text>

            <Button colorScheme="blue" onClick={handleReset}>
              Try Again
            </Button>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default CodeStackingV2;