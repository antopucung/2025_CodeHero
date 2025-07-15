import React, { useState, useEffect, useRef } from 'react';
import { Box, VStack, HStack, Text, Button, Progress, Grid, Badge, useToast } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeStackingEngine, createCodeBlocks } from './CodeStackingEngine';

const MotionBox = motion(Box);

// Component for a draggable code block
const DraggableBlock = ({ block, onDragStart, onDragEnd, isDragging, isPlaced = false, language = "javascript" }) => {
  return (
    <MotionBox
      drag={!isPlaced}
      dragSnapToOrigin
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.3}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDragStart={() => onDragStart && onDragStart(block)}
      onDragEnd={() => onDragEnd && onDragEnd()}
      whileHover={{ scale: isPlaced ? 1 : 1.02 }}
      whileDrag={{ 
        scale: 1.05, 
        zIndex: 1000,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.4)",
        border: "2px solid #4ecdc4"
      }}
      animate={{
        boxShadow: isDragging 
          ? "0 10px 20px rgba(0, 0, 0, 0.4)" 
          : isPlaced 
            ? "0 4px 12px rgba(0, 255, 0, 0.2)"
            : "0 2px 5px rgba(0, 0, 0, 0.2)",
        borderColor: isDragging 
          ? "#4ecdc4" 
          : isPlaced 
            ? "#00ff00" 
            : "#444"
      }}
      transition={{ duration: 0.3 }}
      bg={isPlaced ? "#001800" : "#222"}
      border="1px solid"
      borderRadius="md"
      p={2}
      my={1}
      cursor={isPlaced ? "default" : "grab"}
      position="relative"
      zIndex={isDragging ? 1000 : 1}
    >
      <Text
        fontSize="xs"
        color="#666"
        position="absolute"
        left="-25px"
        top="50%"
        transform="translateY(-50%)"
      >
        {block.lineNumber}
      </Text>
      <Text 
        fontFamily="monospace" 
        fontSize="sm" 
        color={isPlaced ? "#00ff00" : "#ccc"}
        pl={`${block.indentation}px`}
        whiteSpace="pre"
      >
        {block.content}
      </Text>
    </MotionBox>
  );
};

// Component for a drop zone
const DropZone = ({ children, isActive, onDrop, index }) => {
  return (
    <MotionBox
      animate={{ 
        backgroundColor: isActive ? "rgba(78, 205, 196, 0.1)" : "transparent",
        borderColor: isActive ? "#4ecdc4" : "transparent"
      }}
      transition={{ duration: 0.2 }}
      minHeight="40px"
      border="2px dashed transparent"
      borderRadius="md"
      m={1}
      position="relative"
      onClick={() => isActive && onDrop && onDrop(index)}
      cursor={isActive ? "pointer" : "default"}
    >
      {children}
      {isActive && !children && (
        <Text
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          color="#4ecdc4"
          fontSize="sm"
          pointerEvents="none"
        >
          Drop here
        </Text>
      )}
    </MotionBox>
  );
};

// Main CodeStackingV2 component
const CodeStackingV2 = ({
  code,
  language = "javascript",
  difficulty = "medium",
  timeLimit = 120,
  title = "Code Stacking Challenge",
  description = "Arrange the code blocks in the correct order",
  onComplete,
  splitType = "line"
}) => {
  const [engine, setEngine] = useState(null);
  const [quizState, setQuizState] = useState({ status: 'waiting' });
  const [activeDragBlock, setActiveDragBlock] = useState(null);
  const toast = useToast();
  const engineRef = useRef(null); // Keep a ref to avoid closure issues
  
  // Initialize quiz engine
  useEffect(() => {
    if (!code) {
      console.error("No code provided to CodeStackingV2");
      return;
    }
    
    try {
      console.log("Creating code blocks from code:", code.substring(0, 50) + "...");
      const codeBlocks = createCodeBlocks(code, splitType);
      console.log(`Created ${codeBlocks.length} code blocks`);
      
      // Configure difficulty settings
      const difficultySettings = {
        easy: { timeLimit: 180, basePoints: 50, penalty: 0.05 },
        medium: { timeLimit: 120, basePoints: 100, penalty: 0.1 },
        hard: { timeLimit: 90, basePoints: 150, penalty: 0.15 }
      };
      
      const newEngine = new CodeStackingEngine({
        timeLimit: timeLimit || difficultySettings[difficulty]?.timeLimit || 120,
        basePoints: difficultySettings[difficulty]?.basePoints || 100,
        penalty: difficultySettings[difficulty]?.penalty || 0.1
      });
      
      newEngine.setup(codeBlocks, [...codeBlocks]);
      engineRef.current = newEngine;
      
      // Register event handlers
      newEngine.on('start', (state) => {
        console.log("Quiz started:", state.status);
        setQuizState({...state});
      });
      
      newEngine.on('complete', (result) => {
        console.log("Quiz completed:", result);
        setQuizState({...newEngine.getState()});
        
        if (onComplete) {
          onComplete(result);
        }
        
        toast({
          title: "Challenge completed!",
          description: `You scored ${result.score} points!`,
          status: "success",
          duration: 5000,
          isClosable: true
        });
      });
      
      newEngine.on('correct', (data) => {
        console.log("Correct placement:", data);
        
        toast({
          title: "Correct!",
          description: `+${data.points} points`,
          status: "success",
          duration: 1000,
          isClosable: true,
          position: "top-right"
        });
        
        // Update state after correct placement
        setQuizState({...newEngine.getState()});
      });
      
      newEngine.on('incorrect', (data) => {
        console.log("Incorrect placement:", data);
        
        toast({
          title: "Try again",
          description: `Incorrect placement -${data.penalty} points`,
          status: "error",
          duration: 1000,
          isClosable: true,
          position: "top-right"
        });
        
        // Update state after incorrect placement
        setQuizState({...newEngine.getState()});
      });
      
      newEngine.on('timeout', (result) => {
        console.log("Quiz timeout:", result);
        setQuizState({...newEngine.getState()});
        
        toast({
          title: "Time's up!",
          description: `Your final score: ${result.score}`,
          status: "warning",
          duration: 5000,
          isClosable: true
        });
      });
      
      newEngine.on('tick', (data) => {
        // Only update time display, avoid full rerenders
        setQuizState(prev => ({
          ...prev,
          timeRemaining: data.timeRemaining
        }));
      });
      
      setEngine(newEngine);
      setQuizState(newEngine.getState());
      
    } catch (error) {
      console.error("Error initializing code stacking engine:", error);
      toast({
        title: "Error",
        description: "Failed to initialize quiz: " + error.message,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
    
    // Clean up on unmount
    return () => {
      if (engineRef.current) {
        console.log("Cleaning up engine");
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [code, difficulty, timeLimit, splitType, onComplete]);
  
  // Start the quiz
  const handleStart = () => {
    if (!engine) {
      console.warn("Cannot start quiz: engine not initialized");
      return;
    }
    
    console.log("Starting quiz...");
    engine.start();
    // Force immediate state update
    setQuizState({...engine.getState()});
  };
  
  // Reset the quiz
  const handleReset = () => {
    if (!engine) {
      console.warn("Cannot reset quiz: engine not initialized");
      return;
    }
    
    console.log("Resetting quiz...");
    engine.reset();
    setQuizState({...engine.getState()});
  };
  
  // Handle block drag start
  const handleDragStart = (block) => {
    console.log("Drag start:", block.id);
    setActiveDragBlock(block);
  };
  
  // Handle block drag end
  const handleDragEnd = () => {
    console.log("Drag end");
    setActiveDragBlock(null);
  };
  
  // Handle drop on a zone
  const handleDrop = (index) => {
    if (!activeDragBlock || !engine) {
      console.warn("Cannot drop: no active block or engine");
      return;
    }
    
    console.log("Dropping block", activeDragBlock.id, "at index", index);
    engine.placeBlock(activeDragBlock.id, index);
    setQuizState({...engine.getState()});
    setActiveDragBlock(null);
  };
  
  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // If engine not initialized, show loading
  if (!engine) {
    return (
      <Box textAlign="center" p={10}>
        <Text color="#666">Initializing quiz...</Text>
      </Box>
    );
  }
  
  console.log("Current quiz state:", quizState.status);

  return (
    <Box bg="#111" borderRadius="md" overflow="hidden">
      {/* Header */}
      <Box p={4} borderBottom="1px solid #333">
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Text color="#00ff00" fontWeight="bold">{title}</Text>
            <Text color="#ccc" fontSize="sm">{description}</Text>
          </VStack>
          
          {quizState.status === 'active' && (
            <HStack>
              <Text color="#ffd93d" fontWeight="bold">
                Score: {quizState.score}
              </Text>
              <Text color={quizState.timeRemaining < 10 ? "#ff6b6b" : "#ccc"}>
                Time: {formatTime(quizState.timeRemaining)}
              </Text>
            </HStack>
          )}
        </HStack>
        
        {quizState.status === 'active' && (
          <Box mt={2}>
            <Text color="#666" fontSize="xs" mb={1}>
              Progress: {Math.round(engine.getProgress())}%
            </Text>
            <Progress 
              value={engine.getProgress()} 
              colorScheme="green" 
              size="xs" 
              bg="#333" 
              borderRadius="full"
            />
          </Box>
        )}
      </Box>

      {/* Quiz Content */}
      {quizState.status === 'waiting' ? (
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
        <Box p={4}>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            {/* Available Blocks */}
            <Box bg="#000" p={4} borderRadius="md" maxHeight="400px" overflowY="auto">
              <Text color="#666" mb={3}>Available Blocks:</Text>
              <VStack align="stretch" spacing={1}>
                {quizState.blocks?.map((block) => (
                  <DraggableBlock
                    key={block.id}
                    block={block}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={activeDragBlock?.id === block.id}
                    language={language}
                  />
                ))}
                
                {quizState.blocks?.length === 0 && (
                  <Text color="#666" textAlign="center" p={4}>
                    All blocks placed!
                  </Text>
                )}
              </VStack>
            </Box>
            
            {/* Solution Area */}
            <Box bg="#000" p={4} borderRadius="md" maxHeight="400px" overflowY="auto">
              <Text color="#666" mb={3}>Your Solution:</Text>
              <VStack align="stretch" spacing={0}>
                {/* Drop zones between placed blocks */}
                <DropZone 
                  isActive={!!activeDragBlock} 
                  onDrop={() => handleDrop(0)}
                  index={0}
                />
                
                {quizState.userSolution?.map((block, index) => (
                  <React.Fragment key={block.id}>
                    <DraggableBlock
                      block={block}
                      isPlaced={true}
                      language={language}
                    />
                    <DropZone 
                      isActive={!!activeDragBlock} 
                      onDrop={() => handleDrop(index + 1)}
                      index={index + 1}
                    />
                  </React.Fragment>
                ))}
              </VStack>
            </Box>
          </Grid>
        </Box>
      )}
      
      {/* Footer */}
      {quizState.status === 'completed' && (
        <Box p={4} bg="#001800" borderTop="1px solid #00ff00">
          <VStack spacing={3}>
            <Text color="#00ff00" fontWeight="bold" fontSize="xl">
              Challenge Completed!
            </Text>
            
            <HStack spacing={6}>
              <VStack>
                <Text color="#666">Final Score</Text>
                <Text color="#ffd93d" fontWeight="bold" fontSize="xl">{quizState.score}</Text>
              </VStack>
              
              <VStack>
                <Text color="#666">Time Bonus</Text>
                <Text color="#00ff00" fontWeight="bold">
                  +{quizState.feedback?.find(f => f.type === 'timeBonus')?.points || 0}
                </Text>
              </VStack>
            </HStack>
            
            <Button colorScheme="blue" onClick={handleReset}>
              Try Again
            </Button>
          </VStack>
        </Box>
      )}
      
      {quizState.status === 'failed' && (
        <Box p={4} bg="#180000" borderTop="1px solid #ff6b6b">
          <VStack spacing={3}>
            <Text color="#ff6b6b" fontWeight="bold" fontSize="xl">
              Time's Up!
            </Text>
            
            <Text color="#ccc">
              Final Score: {quizState.score}
            </Text>
            
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