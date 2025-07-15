import React, { useState, useEffect, useRef } from "react";
import { Box, HStack, useToast } from "@chakra-ui/react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

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
 * CodeStackingV2 - A drag-and-drop code stacking challenge component with reordering
 */
const CodeStackingV2 = ({ code, language = "javascript", onComplete = () => {} }) => {
  // Game state
  const [availableBlocks, setAvailableBlocks] = useState([]);
  const [solutionBlocks, setSolutionBlocks] = useState([]);
  const [solutionBlockIds, setSolutionBlockIds] = useState([]);
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
  
  // Update solution block IDs when solution blocks change
  useEffect(() => {
    setSolutionBlockIds(solutionBlocks.map(block => block.id));
  }, [solutionBlocks]);
  
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
  
  // Handle drag start
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    // Find the active block from either available or solution blocks
    const block = availableBlocks.find(b => b.id === active.id) || 
                 solutionBlocks.find(b => b.id === active.id);
    
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
    
    // Check if we're dragging from available blocks
    const isFromAvailable = availableBlocks.some(block => block.id === activeId);
    
    if (isFromAvailable) {
      // Remove from available blocks
      const blockIndex = availableBlocks.findIndex(b => b.id === activeId);
      if (blockIndex === -1) return;
      
      const block = availableBlocks[blockIndex];
      const newAvailableBlocks = [...availableBlocks];
      newAvailableBlocks.splice(blockIndex, 1);
      setAvailableBlocks(newAvailableBlocks);
      
      // Add to solution blocks
      const newSolution = [...solutionBlocks];
      if (overId === 'solution-area') {
        // Add to the end if dropped on the general area
        newSolution.push(block);
      } else {
        // Add at specific position if dropped on another block
        const overIndex = solutionBlocks.findIndex(b => b.id === overId);
        if (overIndex !== -1) {
          newSolution.splice(overIndex + 1, 0, block);
        } else {
          newSolution.push(block);
        }
      }
      
      setSolutionBlocks(newSolution);
      
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
    } else {
      // Reordering within solution blocks
      const activeIndex = solutionBlocks.findIndex(b => b.id === activeId);
      const overIndex = solutionBlocks.findIndex(b => b.id === overId);
      
      // Only proceed if indices are valid and different
      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const newSolutionBlocks = arrayMove(solutionBlocks, activeIndex, overIndex);
        setSolutionBlocks(newSolutionBlocks);
        
        // Small bonus for reordering
        setScore(prev => prev + 10);
        
        toast({
          title: "Block reordered!",
          status: "info",
          duration: 1000,
          position: "top-right",
          isClosable: true,
        });
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
          <HStack p={4} spacing={4} align="stretch" h="calc(100vh - 300px)" minH="400px">
            {/* Available Blocks */}
            <BlocksPanel blocks={availableBlocks} />
            
            {/* Solution Area */}
            <Box flex="1">
              <SortableContext items={solutionBlockIds} strategy={verticalListSortingStrategy}>
                <SolutionArea
                  blocks={solutionBlocks}
                  blockIds={solutionBlockIds}
                  isDragging={!!activeId}
                  id="solution-area"
                />
              </SortableContext>
            </Box>
          </HStack>
          
          {/* Drag Overlay */}
          <DragOverlay adjustScale={true}>
            {activeId && activeBlock && (
              <Box
                bg="#333"
                border="1px solid #4ecdc4"
                borderRadius="md"
                p={2}
                boxShadow="0 0 10px rgba(78, 205, 196, 0.5)"
                maxW="600px"
              >
                <Text
                  fontFamily="monospace"
                  fontSize="sm"
                  color="#ccc"
                  pl={(activeBlock.indentation || 0) / 2 + "px"}
                  whiteSpace="pre"
                >
                  {activeBlock.content}
                </Text>
              </Box>
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