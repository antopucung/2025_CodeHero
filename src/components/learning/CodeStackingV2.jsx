import React, { useState, useEffect, useRef } from "react";
import { Box, HStack, useToast } from "@chakra-ui/react";

// Import component parts
import BlocksPanel from "./stacking/BlocksPanel";
import SolutionArea from "./stacking/SolutionArea";
import GameHeader from "./stacking/GameHeader";
import GameFooter from "./stacking/GameFooter";
import StartScreen from "./stacking/StartScreen";

// Import utilities
import { 
  createCodeBlocks,
  shuffleArray,
  findBestInsertionIndex,
  formatTime
} from "./stacking/utils/codeStackingUtils";

/**
 * CodeStackingV2 - A drag-and-drop code stacking challenge component
 * 
 * @param {Object} props - Component props
 * @param {string} props.code - Code to be broken into blocks
 * @param {string} props.language - Programming language of the code
 * @param {Function} props.onComplete - Callback when challenge completes
 * @returns {JSX.Element} - Rendered component
 */
const CodeStackingV2 = ({ code, language = "javascript", onComplete = () => {} }) => {
  // Game state
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [solutionBlocks, setSolutionBlocks] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("waiting"); // waiting, active, completed, failed
  const [isDragging, setIsDragging] = useState(false);
  
  // Refs
  const solutionAreaRef = useRef(null);
  const toast = useToast();
  
  // Initialize game
  useEffect(() => {
    if (code && status === "waiting") {
      // Create and shuffle code blocks
      const blocks = createCodeBlocks(code);
      setAvailableBlocks(shuffleArray(blocks));
    }
  }, [code, status]);
  
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
  
  // Setup global drag events
  useEffect(() => {
    const handleDragOver = () => {
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
  
  // Calculate progress
  const getProgress = () => {
    if (availableBlocks.length + solutionBlocks.length === 0) return 0;
    return (solutionBlocks.length / (availableBlocks.length + solutionBlocks.length)) * 100;
  };
  
  // Handle drag start
  const handleDragStart = (block) => {
    // Additional logic could go here
    setIsDragging(true);
  };
  
  // Handle solution area drag over
  const handleSolutionAreaDragOver = (e) => {
    if (status === "active") {
      e.preventDefault(); // Allow drop
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
    
    // Calculate insertion position
    const insertIndex = findBestInsertionIndex(e, solutionAreaRef.current, solutionBlocks);
    
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
      const finalScore = score + 50 + timeBonus; // 50 for current block + time bonus
      setScore(finalScore);
      
      toast({
        title: "Challenge completed!",
        description: `Time bonus: +${timeBonus} points`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      // Call completion callback
      if (onComplete) {
        onComplete({
          score: finalScore,
          timeRemaining,
          success: true,
        });
      }
    }
  };
  
  // Start the challenge
  const handleStart = () => {
    setStatus("active");
    setTimeRemaining(120);
    setScore(0);
    setSolutionBlocks([]);
  };
  
  // Reset the challenge
  const handleReset = () => {
    setStatus("waiting");
    setTimeRemaining(120);
    setScore(0);
    setSolutionBlocks([]);
    
    // Re-initialize blocks
    if (code) {
      const blocks = createCodeBlocks(code);
      setAvailableBlocks(shuffleArray(blocks));
    }
  };
  
  return (
    <Box bg="#111" borderRadius="md" overflow="hidden">
      {/* Game Header */}
      <GameHeader 
        status={status}
        score={score}
        timeRemaining={timeRemaining}
        progress={getProgress()}
        formatTime={formatTime}
      />
      
      {/* Game Content */}
      {status === "waiting" ? (
        <StartScreen onStart={handleStart} />
      ) : (
        <HStack p={4} spacing={4} align="stretch" h="calc(100vh - 300px)" minH="400px">
          {/* Available Blocks */}
          <BlocksPanel 
            blocks={availableBlocks}
            onDragStart={handleDragStart}
          />
          
          {/* Solution Area */}
          <SolutionArea 
            blocks={solutionBlocks}
            isDragging={isDragging}
            onDragOver={handleSolutionAreaDragOver}
            onDrop={handleSolutionAreaDrop}
            containerRef={solutionAreaRef}
          />
        </HStack>
      )}
      
      {/* Game Footer */}
      <GameFooter 
        status={status}
        score={score}
        timeRemaining={timeRemaining}
        onReset={handleReset}
        formatTime={formatTime}
      />
    </Box>
  );
};

export default CodeStackingV2;