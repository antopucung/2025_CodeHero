import React, { useState, useEffect, useRef } from "react";
import { Box, VStack, HStack, Text, Button, Progress, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

// DraggableBlock component
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
      mb={1}
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

// Main Code Stacking component
const CodeStackingV2 = ({ code, language = "javascript", onComplete = () => {} }) => {
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [solutionBlocks, setSolutionBlocks] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("waiting"); // waiting, active, completed, failed
  const [isDragging, setIsDragging] = useState(false);
  const solutionAreaRef = useRef(null);
  const toast = useToast();

  // Initialize code blocks
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

  // Setup drag events for the document
  useEffect(() => {
    const handleDragOver = (e) => {
      if (status === "active") {
        setIsDragging(true);
      }
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener("dragover", handleDragOver);
    document.addEventListener("dragend", handleDragEnd);

    return () => {
      document.removeEventListener("dragover", handleDragOver);
      document.removeEventListener("dragend", handleDragEnd);
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

  // Handle dropping a block in the solution area
  const handleSolutionAreaDrop = (e) => {
    e.preventDefault();
    
    if (status !== "active") return;
    
    const blockId = e.dataTransfer.getData("text/plain");
    if (!blockId) return;
    
    // Find block in available blocks
    const blockIndex = availableBlocks.findIndex((b) => b.id === blockId);
    if (blockIndex === -1) return;
    
    // Get the block and remove from available blocks
    const block = availableBlocks[blockIndex];
    const newAvailableBlocks = [...availableBlocks];
    newAvailableBlocks.splice(blockIndex, 1);
    setAvailableBlocks(newAvailableBlocks);
    
    // Calculate the insert position based on mouse position
    let insertIndex = 0;
    
    if (solutionBlocks.length > 0 && solutionAreaRef.current) {
      const solutionRect = solutionAreaRef.current.getBoundingClientRect();
      const blockElements = solutionAreaRef.current.querySelectorAll('.solution-block');
      
      // Default to the end if no closer position is found
      insertIndex = solutionBlocks.length;
      
      // Find the closest block based on Y position
      let closestDistance = Infinity;
      let closestIndex = -1;
      
      blockElements.forEach((blockEl, idx) => {
        const rect = blockEl.getBoundingClientRect();
        const blockMiddleY = rect.top + rect.height / 2;
        const distance = Math.abs(blockMiddleY - e.clientY);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = idx;
        }
      });
      
      // If mouse is above the closest block, insert before it
      // If below, insert after it
      if (closestIndex !== -1) {
        const closestRect = blockElements[closestIndex].getBoundingClientRect();
        const closestMiddleY = closestRect.top + closestRect.height / 2;
        
        if (e.clientY < closestMiddleY) {
          insertIndex = closestIndex;
        } else {
          insertIndex = closestIndex + 1;
        }
      }
    }
    
    // Add to solution at the calculated position
    const newSolution = [...solutionBlocks];
    newSolution.splice(insertIndex, 0, block);
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

  // Handle dragging over the solution area
  const handleSolutionAreaDragOver = (e) => {
    if (status === "active") {
      e.preventDefault(); // Allow drop
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
        <HStack p={4} spacing={4} align="stretch" h="calc(100vh - 300px)" minH="400px">
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

          {/* Solution Area - Single Drop Target */}
          <Box
            ref={solutionAreaRef}
            flex="1"
            bg="#000"
            p={4}
            borderRadius="md"
            maxH="100%"
            overflowY="auto"
            border={`1px solid ${isDragging ? "#4ecdc4" : "#333"}`}
            onDragOver={handleSolutionAreaDragOver}
            onDrop={handleSolutionAreaDrop}
            position="relative"
          >
            <Text color="#666" mb={3} fontWeight="bold">
              Your Solution:
            </Text>
            
            {/* Drop indicator overlay */}
            {isDragging && status === "active" && (
              <Box
                position="absolute"
                top="30px"
                left="4px"
                right="4px"
                bottom="4px"
                borderRadius="md"
                border="2px dashed #4ecdc4"
                bg="rgba(78, 205, 196, 0.1)"
                pointerEvents="none"
                zIndex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="#4ecdc4" fontSize="sm">
                  Drop to place block
                </Text>
              </Box>
            )}
            
            <VStack align="stretch" spacing={1} zIndex={2} position="relative">
              {solutionBlocks.length === 0 ? (
                <Text color="#666" textAlign="center" py={10}>
                  {isDragging ? "Drop your first block here" : "Drag blocks here to build your solution"}
                </Text>
              ) : (
                solutionBlocks.map((block, index) => (
                  <Box
                    key={block.id}
                    className="solution-block"
                    data-index={index}
                  >
                    <DraggableBlock 
                      block={block} 
                      isPlaced={true} 
                    />
                  </Box>
                ))
              )}
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