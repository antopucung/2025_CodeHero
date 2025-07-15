import React, { useState, useEffect, useRef } from "react";
import { Box, HStack, Button, useToast, Text as ChakraText } from "@chakra-ui/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

// Import component parts
import BlocksPanel from "./stacking/BlocksPanel";
import SolutionArea from "./stacking/SolutionArea";
import GameHeader from "./stacking/GameHeader";
import GameFooter from "./stacking/GameFooter";
import StartScreen from "./stacking/StartScreen";
import DraggableBlock from "./stacking/DraggableBlock";

// Import utilities
import { 
  createCodeBlocks,
  shuffleArray,
  formatTime
} from "./stacking/utils/codeStackingUtils";

/**
 * CodeStackingV2 - A drag-and-drop code stacking challenge component without reordering
 */
const CodeStackingV2 = ({ code, language = "javascript", onComplete = () => {} }) => {
  // Game state
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [solutionBlocks, setSolutionBlocks] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState("waiting"); // waiting, active, completed, failed
  const [activeId, setActiveId] = useState(null);
  const [activeBlock, setActiveBlock] = useState(null);
  
  // Refs
  const toast = useToast();
  
  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum drag distance to activate
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
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
  
  // Calculate progress
  const getProgress = () => {
    if (availableBlocks.length + solutionBlocks.length === 0) return 0;
    return (solutionBlocks.length / (availableBlocks.length + solutionBlocks.length)) * 100;
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
  
  // Reset the entire stack
  const handleResetStack = () => {
    if (status !== "active" || solutionBlocks.length === 0) return;
    
    // Return all solution blocks to available blocks
    setAvailableBlocks(prevAvailable => [...prevAvailable, ...solutionBlocks]);
    setSolutionBlocks([]);
    
    // Reset score partially (keep some progress)
    setScore(prev => Math.max(0, Math.floor(prev * 0.7)));
    
    toast({
      title: "Stack reset!",
      description: "All blocks have been returned to the available pool.",
      status: "info",
      duration: 1000,
      position: "top-right",
      isClosable: true,
    });
  };
  
  // Reset only the latest drop
  const handleResetLatestDrop = () => {
    if (status !== "active" || solutionBlocks.length === 0) return;
    
    // Get the last block and remove it from solution
    const lastBlock = solutionBlocks[solutionBlocks.length - 1];
    setSolutionBlocks(prev => prev.slice(0, -1));
    
    // Add it back to available blocks
    setAvailableBlocks(prev => [...prev, lastBlock]);
    
    // Deduct a small amount from score
    setScore(prev => Math.max(0, prev - 20));
    
    toast({
      title: "Last block returned!",
      description: "The most recent block has been returned to the available pool.",
      status: "info",
      duration: 1000,
      position: "top-right",
      isClosable: true,
    });
  };
  
  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    // Find the active block from available blocks
    const block = availableBlocks.find(b => b.id === active.id);
    setActiveBlock(block);
  };
  
  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveBlock(null);
    
    if (!over) return; // Dropped outside of a droppable
    
    const activeId = active.id;
    const overId = over.id;
    
    // Only handle dropping from available blocks to solution area
    if (overId === "solution-area") {
      // Find block in available blocks
      const blockIndex = availableBlocks.findIndex(b => b.id === activeId);
      if (blockIndex === -1) return;
      
      const block = availableBlocks[blockIndex];
      
      // Remove from available blocks
      const newAvailableBlocks = [...availableBlocks];
      newAvailableBlocks.splice(blockIndex, 1);
      setAvailableBlocks(newAvailableBlocks);
      
      // Add to solution blocks at the end
      setSolutionBlocks(prev => [...prev, block]);
      
      // Add points
      setScore(prev => prev + 50);
      
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
    }
  };
  
  // Handle drag cancel
  const handleDragCancel = () => {
    setActiveId(null);
    setActiveBlock(null);
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <Box p={4}>
            <HStack spacing={4} align="stretch" minH="400px">
              {/* Available Blocks */}
              <BlocksPanel blocks={availableBlocks} />
              
              {/* Solution Area */}
              <SolutionArea
                blocks={solutionBlocks}
                isDragging={!!activeId}
                id="solution-area"
              />
            </HStack>
            
            {/* Reset Controls */}
            <HStack spacing={4} mt={4} justify="center">
              <Button
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={handleResetLatestDrop}
                isDisabled={solutionBlocks.length === 0 || status !== "active"}
              >
                ↩️ Reset Last Drop
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={handleResetStack}
                isDisabled={solutionBlocks.length === 0 || status !== "active"}
              >
                🔄 Reset Entire Stack
              </Button>
            </HStack>
          </Box>
          
          {/* Drag Overlay */}
          <DragOverlay adjustScale={true}>
            {activeId && activeBlock && (
              <DraggableBlock
                id={activeBlock.id}
                block={activeBlock}
                bg="#333"
                border="1px solid #4ecdc4"
                borderRadius="md"
                p={2}
                boxShadow="0 0 10px rgba(78, 205, 196, 0.5)"
                maxW="600px"
              />
            )}
          </DragOverlay>
        </DndContext>
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