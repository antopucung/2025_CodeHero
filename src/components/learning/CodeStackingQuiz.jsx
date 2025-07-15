import React, { useState, useEffect, useRef } from 'react';
import { Box, VStack, HStack, Text, Button, Badge, Progress, Flex } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeQuizEngine, createCodeBlocksFromString } from './CodeQuizEngine';
import DraggableCodeBlock from './DraggableCodeBlock';
import DropZone from './DropZone';
import DropZoneHighlight from './DropZoneHighlight';
import confetti from 'canvas-confetti';

const MotionBox = motion(Box);

// Main Quiz Component
const CodeStackingQuiz = ({ 
  code, 
  language = "csharp",
  timeLimit = 120,
  title = "Arrange the Code",
  description = "Drag the code blocks to arrange them in the correct order",
  onComplete,
  splitType = "line", // "line" or "statement"
  difficulty = "medium", // "easy", "medium", "hard" 
  juiciness = "high", // "low", "medium", "high" - visual effects level
  totalBlocks = 0 // Optional - used for completion metrics
}) => {
  // Quiz engine reference
  const quizEngineRef = useRef(null);
  
  // UI state
  const [quizState, setQuizState] = useState(null);
  const [activeDragBlock, setActiveDragBlock] = useState(null);
  const [gameEffects, setGameEffects] = useState({
    combo: 1,
    lastAction: null,
    comboText: "",
    pointsText: "",
    streak: 0,
    feedbackMessages: []
  });
  
  // Track error positions
  const [errorPositions, setErrorPositions] = useState(new Set());
  const [screenFlash, setScreenFlash] = useState({ active: false, type: 'success', intensity: 1 });
  const [streakStatus, setStreakStatus] = useState({ active: false, count: 0 });
  const [patternCelebrations, setPatternCelebrations] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [activeEffects, setActiveEffects] = useState({
    floatingScores: [],
    comboAnimations: [],
    particleEffects: []
  });
  
  // Configure difficulty settings
  const difficultySettings = {
    easy: { timeLimit: 180, basePoints: 50, penalty: 0.05 },
    medium: { timeLimit: 120, basePoints: 100, penalty: 0.1 },
    hard: { timeLimit: 90, basePoints: 150, penalty: 0.15 }
  };
  
  // Refs for drop zones
  const dropZoneRefs = useRef([]);
  
  // Initialize quiz engine
  useEffect(() => {
    if (!code) return;
    
    try {
      console.log("Initializing quiz with code:", code);
      
      // Create code blocks
      const codeBlocks = createCodeBlocksFromString(code, splitType);
      console.log("Created code blocks:", codeBlocks);
      
      // Create quiz engine
      const quizEngine = new CodeQuizEngine({
        timeLimit: difficultySettings[difficulty]?.timeLimit || timeLimit,
        basePoints: difficultySettings[difficulty]?.basePoints || 100,
        penalty: difficultySettings[difficulty]?.penalty || 0.1
      });
      
      // Set up quiz with code blocks
      quizEngine.setup(codeBlocks, [...codeBlocks]);
      console.log("Quiz engine setup complete");
      
      // Register event handlers
      quizEngine
        .on('start', (state) => {
          console.log("Quiz started:", state);
          setQuizState({...state});
          setGameEffects({
            combo: 1,
            lastAction: 'start',
            comboText: "",
            pointsText: "",
            streak: 0,
            feedbackMessages: [
              {
                id: Date.now(),
                text: "Quiz Started!",
                type: "info"
              }
            ]
          });
        })
        .on('complete', (result) => {
          console.log("Quiz completed:", result);
          if (onComplete) {
            onComplete({
              score: result.score,
              maxCombo: result.maxCombo,
              timeElapsed: result.timeElapsed,
              correctPlacements: result.correctPlacements,
              incorrectPlacements: result.incorrectPlacements,
              success: true,
              totalBlocks: totalBlocks || quizEngine.state.solution.length
            });
          }
        })
        .on('correct', (data) => {
          console.log("Correct placement:", data);
          setGameEffects(prev => {
            const newStreak = prev.streak + 1;
            
            // Update streak status for visual effects
            if (newStreak >= 3 && !streakStatus.active) {
              setStreakStatus({ active: true, count: newStreak });
              
              // Clear streak after animation time
              setTimeout(() => {
                setStreakStatus({ active: false, count: 0 });
              }, 3000);
            } else if (newStreak >= 3) {
              setStreakStatus(prev => ({ ...prev, count: newStreak }));
            }
            
            let comboText = "";
            if (data.combo >= 2.5) comboText = "INCREDIBLE!";
            else if (data.combo >= 2.0) comboText = "AWESOME!";
            else if (data.combo >= 1.5) comboText = "GREAT!";
            else if (newStreak >= 3) comboText = "STREAK!";
            
            if (data.combo >= 2) {
              // Flash screen on high combo
              setScreenFlash({ 
                active: true, 
                type: 'success', 
                intensity: Math.min(data.combo / 2, 1) 
              });
              
              // Reset flash
              setTimeout(() => {
                setScreenFlash({ active: false, type: 'success', intensity: 0 });
              }, 300);
            }
            
            return {
              ...prev,
              combo: data.combo,
              lastAction: 'correct',
              comboText,
              pointsText: `+${data.points}`,
              streak: newStreak,
              feedbackMessages: [
                ...prev.feedbackMessages,
                {
                  id: Date.now(),
                  text: `Correct! +${data.points} points`,
                  type: "success"
                }
              ].slice(-5) // Keep only last 5 messages
            };
          });
        })
        .on('incorrect', (data) => {
          console.log("Incorrect placement:", data);
          // Flash screen on error
          setScreenFlash({ 
            active: true, 
            type: 'error', 
            intensity: 0.8 
          });
          
          // Reset flash
          setTimeout(() => {
            setScreenFlash({ active: false, type: 'error', intensity: 0 });
          }, 300);
          
          // Reset streak status
          setStreakStatus({ active: false, count: 0 });
          
          setGameEffects(prev => ({
            ...prev,
            combo: 1,
            lastAction: 'incorrect',
            comboText: "OOPS!",
            pointsText: `-${data.penalty}`,
            streak: 0,
            feedbackMessages: [
              ...prev.feedbackMessages,
              {
                id: Date.now(),
                text: `Incorrect! -${data.penalty} points`,
                type: "error"
              }
            ].slice(-5)
          }));
        })
        .on('timeout', (result) => {
          console.log("Quiz timeout:", result);
          setGameEffects(prev => ({
            ...prev,
            lastAction: 'timeout',
            feedbackMessages: [
              ...prev.feedbackMessages,
              {
                id: Date.now(),
                text: "Time's up!",
                type: "warning"
              }
            ].slice(-5)
          }));
          
          // Call onComplete with failure
          if (onComplete) {
            onComplete({
              score: result.score,
              maxCombo: 1,
              timeElapsed: result.timeElapsed,
              correctPlacements: result.correctPlacements,
              incorrectPlacements: result.incorrectPlacements,
              success: false,
              totalBlocks: totalBlocks || quizEngine.state.solution.length
            });
          }
        })
        .on('tick', (data) => {
          setQuizState(prevState => ({
            ...prevState,
            timeRemaining: data.timeRemaining
          }));
        });
      
      quizEngineRef.current = quizEngine;
      setQuizState(quizEngine.getState());
      
      // Initialize drop zone refs
      if (quizEngine.state.solution) {
        // Create a ref for each potential drop position (solution length + 1)
        const numDropZones = quizEngine.state.solution.length + 1;
        console.log("Creating", numDropZones, "drop zone refs");
        dropZoneRefs.current = Array(numDropZones).fill().map(() => React.createRef());
      }
    } catch (error) {
      console.error("Error initializing quiz engine:", error);
    }
    
    return () => {
      // Clean up
      if (quizEngineRef.current) {
        quizEngineRef.current.destroy();
      }
    };
  }, [code, splitType, difficulty, timeLimit]);

  // Start the quiz
  const handleStart = () => {
    if (quizEngineRef.current) {
      console.log("Starting quiz");
      setIsPaused(false);
      quizEngineRef.current.start();
    }
  };

  // Reset the quiz
  const handleReset = () => {
    if (quizEngineRef.current) {
      console.log("Resetting quiz");
      quizEngineRef.current.reset();
      setQuizState(quizEngineRef.current.getState());
      setGameEffects({
        combo: 1,
        lastAction: null,
        comboText: "",
        pointsText: "",
        streak: 0,
        feedbackMessages: []
      });
    }
  };

  // Pause the quiz
  const handlePause = () => {
    if (quizEngineRef.current && quizState.status === 'active') {
      console.log("Pausing quiz");
      quizEngineRef.current.pause();
      setQuizState({ ...quizEngineRef.current.getState() });
      setIsPaused(true);
    }
  };

  // Resume the quiz
  const handleResume = () => {
    if (quizEngineRef.current && quizState.status === 'paused') {
      console.log("Resuming quiz");
      quizEngineRef.current.resume();
      setQuizState({ ...quizEngineRef.current.getState() });
      setIsPaused(false);
    }
  };

  // Close/Abort the quiz
  const handleAbort = () => {
    console.log("Aborting quiz");
    // If onClose prop exists (from parent QuizPopup), call it
    if (onComplete) {
      // Call onComplete with a failed result
      onComplete({
        score: quizState?.score || 0,
        maxCombo: quizState?.maxComboReached || 1,
        correctPlacements: quizState?.correctPlacements || 0,
        success: false,
        totalBlocks: totalBlocks || quizState?.solution?.length || 0
      });
    }
  };

  // Handle drag start
  const handleDragStart = (block) => {
    console.log("Drag started:", block.id);
    setActiveDragBlock(block);
  };

  // Handle drag end
  const handleDragEnd = (block, info) => {
    console.log("Drag ended:", block.id, info);
    if (!activeDragBlock || !quizEngineRef.current) {
      console.log("Missing required data for drag end");
      setActiveDragBlock(null);
      return;
    }
    
    // Get the drop point coordinates
    const dropPoint = info?.point ? { x: info.point.x, y: info.point.y } : null;
    
    if (dropPoint) {
      console.log("Drop point:", dropPoint);
      // Check each dropzone to see if the point is within its bounds
      let droppedInZone = false;
      
      // Add visual feedback when dropped
      setScreenFlash({ active: true, type: 'info', intensity: 0.3 });
      setTimeout(() => {
        setScreenFlash({ active: false, type: 'info', intensity: 0 });
      }, 200);
      
      dropZoneRefs.current.forEach((ref, index) => {
        if (!ref || !ref.current) {
          console.log("Missing ref for dropzone", index);
          return;
        }
        
        const rect = ref.current.getBoundingClientRect();
        console.log("Checking dropzone", index, rect);
        
        // Check if drop point is within this dropzone
        if (
          dropPoint.x >= rect.left && 
          dropPoint.x <= rect.right && 
          dropPoint.y >= rect.top && 
          dropPoint.y <= rect.bottom
        ) {
          console.log("Dropped in zone", index);
          // Place the block at this index
          const result = quizEngineRef.current.placeBlock(activeDragBlock.id, index);
          console.log("Place block result:", result);
          setQuizState({ ...quizEngineRef.current.getState() });
          droppedInZone = true;
        }
      });
      
      if (!droppedInZone) {
        console.log("Not dropped in any zone");
        setGameEffects(prev => ({
          ...prev,
          feedbackMessages: [
            ...prev.feedbackMessages,
            {
              id: Date.now(),
              text: "Block not placed in a drop zone",
              type: "warning"
            }
          ].slice(-5)
        }));
      } else {
        // Trigger a small screen flash for feedback
        setScreenFlash({ 
          active: true, 
          type: 'info', 
          intensity: 0.3 
        });
        
        setTimeout(() => {
          setScreenFlash({ active: false, type: 'info', intensity: 0 });
        }, 300);
      }
    }
    
    setActiveDragBlock(null);
  };

  // Format remaining time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Visual effect controls based on juiciness setting
  const effectsIntensity = {
    low: { scale: 0.3, speed: 0.7, particles: false, sounds: false },
    medium: { scale: 0.7, speed: 1.0, particles: true, sounds: false },
    high: { scale: 1.0, speed: 1.3, particles: true, sounds: true }
  };
  
  const effects = effectsIntensity[juiciness] || effectsIntensity.medium;

  // If no quiz state or code, show loading
  if (!quizState || !code) {
    return (
      <Box textAlign="center" p={10}>
        <Text color="#666">Loading quiz...</Text>
      </Box>
    );
  }

  return (
    <Box position="relative">
      {/* Screen Flash Effect */}
      {screenFlash.active && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, screenFlash.intensity, 0]
          }}
          transition={{ duration: 0.3 }}
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={
            screenFlash.type === 'success' ? "rgba(0, 255, 0, 0.2)" : 
            screenFlash.type === 'error' ? "rgba(255, 0, 0, 0.2)" :
            "rgba(78, 205, 196, 0.2)" // info - teal color for neutral actions
          }
          zIndex={999}
          pointerEvents="none"
        />
      )}
      
      {/* Streak Counter */}
      {streakStatus.active && streakStatus.count >= 3 && (
        <MotionBox
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: 0,
            boxShadow: [
              "0 0 20px #ffd93d",
              "0 0 40px #ffd93d",
              "0 0 20px #ffd93d"
            ]
          }}
          transition={{ 
            duration: 0.5,
            boxShadow: { repeat: Infinity, duration: 1.5 }
          }}
          position="fixed"
          top="20%"
          right="5%"
          bg="rgba(0,0,0,0.8)"
          border="2px solid #ffd93d"
          borderRadius="full"
          p={3}
          px={5}
          zIndex={1000}
          pointerEvents="none"
        >
          <Text 
            fontSize="lg" 
            fontWeight="bold" 
            color="#ffd93d"
          >
            🔥 {streakStatus.count} STREAK!
          </Text>
        </MotionBox>
      )}
      
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg="#111"
        border="1px solid #333"
        borderRadius="md"
        overflow="visible" // Important to allow dragging outside of container
        maxW="900px"
        mx="auto"
        position="relative"
      >
        {/* Header with progress and score */}
        <HStack 
          bg="#111" 
          p={3} 
          borderBottom="1px solid #333"
          justify="space-between"
        >
          <VStack align="start" spacing={1}>
            <Text color="#00ff00" fontWeight="bold" fontSize="sm">
              {title}
            </Text>
            <Text color="#666" fontSize="xs">
              {description}
            </Text>
          </VStack>
          
          <HStack spacing={4}>
            {quizState.status === 'active' && (
              <VStack spacing={1} align="end">
                <HStack>
                  <Text color={quizState.timeRemaining < 10 ? "#ff6b6b" : "#ccc"} fontSize="sm">
                    Time: {formatTime(quizState.timeRemaining)}
                  </Text>
                  <Text color="#ffd93d" fontSize="sm">
                    Score: {quizState.score}
                  </Text>
                </HStack>
                <MotionBox
                  w="200px"
                  h="6px"
                  bg="#333"
                  borderRadius="full"
                  overflow="hidden"
                >
                  <MotionBox
                    h="100%"
                    bg="#00ff00"
                    animate={{ 
                      width: `${(quizState.timeRemaining / timeLimit) * 100}%`,
                      backgroundColor: quizState.timeRemaining < 10 ? "#ff6b6b" : "#00ff00"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </MotionBox>
              </VStack>
            )}
            
            {quizState.status === 'waiting' && (
              <Button
                colorScheme="green"
                size="sm"
                onClick={handleStart}
              >
                Start Quiz
              </Button>
            )}
            
            {quizState.status === 'active' && (
              <Button
                size="sm"
                colorScheme="yellow"
                onClick={handlePause}
              >
                Pause
              </Button>
            )}
            
            {quizState.status === 'paused' && (
              <Button
                size="sm"
                colorScheme="blue"
                onClick={handleResume}
              >
                Resume
              </Button>
            )}
          
            {(quizState.status === 'completed' || quizState.status === 'failed') && (
              <Button
                colorScheme="blue"
                size="sm"
                onClick={handleReset}
              >
                Reset Quiz
              </Button>
            )}
            
            {(quizState.status === 'active' || quizState.status === 'paused') && (
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={handleAbort}
              >
                Close Quiz
              </Button>
            )}
          </HStack>
        </HStack>
        
        {/* Quiz content */}
        <Box p={4} position="relative" overflow="visible"> {/* Important: overflow visible for dragging */}
          {quizState.status === 'waiting' && (
            <Box>
              <VStack spacing={6} align="center" justify="center" bg="#111" borderRadius="md" p={8} textAlign="center">
                <Text color="#00ff00" fontSize="2xl" fontWeight="bold">
                  {title}
                </Text>
                <Text color="#ccc" fontSize="md" maxW="500px">
                  {description}
                </Text>
                <Text color="#666" fontSize="sm">
                  Time Limit: {formatTime(timeLimit)} | Difficulty: {difficulty}
                </Text>
                <Button
                  colorScheme="green"
                  size="lg"
                  onClick={handleStart}
                  px={8}
                >
                  Start Quiz
                </Button>
              </VStack>
            </Box>
          )}

          {(quizState.status === 'active' || quizState.status === 'paused') && (
            <HStack 
              align="start" 
              spacing={6} 
              h="calc(100vh - 300px)" 
              maxH="500px"
              overflow="visible"
              position="relative"
              opacity={quizState.status === 'paused' ? 0.6 : 1}
            >
              {/* Available blocks */}
              <Box 
                w="45%" 
                position="relative" 
                h="100%" 
                display="flex" 
                flexDirection="column" 
                zIndex={3}
                bg="#111"
                overflow="visible"
              >
                <Text color="#666" fontSize="sm" mb={2}>Available Blocks:</Text>
                <Box 
                  flex={1} 
                  overflowY="auto" 
                  ml="30px"
                  overflow="visible"
                  position="relative"
                >
                  {quizState.blocks.length > 0 ? (
                    <VStack align="start" spacing={1} overflow="visible">
                      {quizState.blocks.map((block) => (
                        <DraggableCodeBlock
                          key={`block-${block.id}`}
                          block={block}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          isDragging={activeDragBlock?.id === block.id}
                          language={language}
                        />
                      ))}
                    </VStack>
                  ) : (
                    <Text color="#666" fontSize="sm" textAlign="center" p={4}>
                      All blocks have been placed
                    </Text>
                  )}
                </Box>
              </Box>
              
              {/* Solution area */}
              <Box 
                w="55%" 
                position="relative" 
                h="100%" 
                display="flex" 
                flexDirection="column" 
                zIndex={2}
                bg="#111"
                overflow="visible"
              >
                <Text color="#666" fontSize="sm" mb={2}>Arrange Here:</Text>
                <Box 
                  flex={1} 
                  overflowY="auto" 
                  ml="30px" 
                  position="relative"
                  overflow="visible"
                >
                  <VStack align="start" spacing={1} overflow="visible">
                    {/* Render drop zones for every possible insertion point */}
                    {Array.from({ length: quizState.userSolution.length + 1 }).map((_, index) => (
                      <Box key={`dropzone-wrapper-${index}`} w="100%" overflow="visible" position="relative">
                        <DropZone 
                          key={`dropzone-${index}`}
                          index={index}
                          ref={el => dropZoneRefs.current[index] = el}
                          isActive={!!activeDragBlock}
                          highlightColor={gameEffects.streak >= 3 ? "#ffd93d" : "#4ecdc4"}
                        >
                          {/* If there's a block at this index in the solution, render it */}
                          {index < quizState.userSolution.length && (
                            <DraggableCodeBlock
                              key={`solution-${quizState.userSolution[index].id}`}
                              block={quizState.userSolution[index]}
                              isPlaced={true}
                              isCorrect={quizEngineRef.current.checkPlacement(quizState.userSolution[index], index)}
                              language={language}
                            />
                          )}
                          
                          {/* If this is an empty drop zone, show a placeholder when active */}
                          {index >= quizState.userSolution.length && index === 0 && quizState.userSolution.length === 0 && (
                            <Text color="#666" fontSize="sm">Drop first block here</Text>
                          )}
                        </DropZone>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </Box>
            </HStack>
          )}
          
          {/* Paused overlay */}
          {quizState.status === 'paused' && (
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="rgba(0, 0, 0, 0.7)"
              zIndex={50}
            >
              <VStack spacing={4}>
                <Text color="#00ff00" fontSize="2xl" fontWeight="bold">
                  PAUSED
                </Text>
                <Button
                  size="lg"
                  colorScheme="blue"
                  onClick={handleResume}
                >
                  Resume Quiz
                </Button>
              </VStack>
            </Box>
          )}
          
          {/* Combo indicator */}
          {gameEffects.combo > 1.2 && quizState.status === 'active' && (
            <MotionBox
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                opacity: [0, 1, 1],
                x: [50, 0, 0],
                backgroundColor: [
                  gameEffects.combo >= 2 ? "#ff6b6b33" : "#4ecdc433",
                  gameEffects.combo >= 2 ? "#ff6b6b66" : "#4ecdc466",
                  gameEffects.combo >= 2 ? "#ff6b6b33" : "#4ecdc433"
                ]
              }}
              transition={{ 
                duration: 0.5 * effects.speed,
                backgroundColor: { 
                  repeat: Infinity, 
                  duration: 1.5 * effects.speed 
                }
              }}
              position="absolute"
              top="10px"
              right="10px"
              bg="#4ecdc433"
              border="1px solid #4ecdc4"
              borderRadius="md"
              px={3}
              py={2}
              zIndex={10}
            >
              <Text 
                color={gameEffects.combo >= 2 ? "#ff6b6b" : "#4ecdc4"} 
                fontWeight="bold"
                fontSize="sm"
              >
                x{gameEffects.combo.toFixed(1)} COMBO
              </Text>
            </MotionBox>
          )}
          
          {/* Floating points animation */}
          {juiciness !== 'low' && gameEffects.pointsText && (
            <AnimatePresence>
              <MotionBox
                key={`points-${Date.now()}`}
                initial={{ opacity: 0, y: 0, scale: 0.5 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  y: [-20, -70, -100],
                  scale: [0.5, 1.2, 1]
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 * effects.speed }}
                position="absolute"
                top="50%"
                right="20px"
                color={gameEffects.lastAction === 'correct' ? "#00ff00" : "#ff6b6b"}
                fontWeight="bold"
                fontSize="xl"
                textShadow="0 0 10px rgba(0,0,0,0.7)"
                zIndex={100}
                pointerEvents="none"
              >
                {gameEffects.pointsText}
              </MotionBox>
            </AnimatePresence>
          )}
          
          {/* Combo text animation */}
          {juiciness !== 'low' && gameEffects.comboText && (
            <AnimatePresence>
              <MotionBox
                key={`combo-${Date.now()}`}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0.7, 1.3 * effects.scale, 0.9],
                  rotate: [-5, 5, 0]
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 1.2 * effects.speed,
                  scale: { type: "spring", stiffness: 300 * effects.speed }
                }}
                position="absolute"
                top="30%"
                left="50%"
                transform="translate(-50%, -50%)"
                color={
                  gameEffects.lastAction === 'correct' 
                    ? gameEffects.combo >= 2 
                      ? "#ff6b6b" 
                      : "#00ff00"
                    : "#ff6b6b"
                }
                fontWeight="bold"
                fontSize="3xl"
                textShadow="0 0 15px rgba(0,0,0,0.7)"
                zIndex={100}
                pointerEvents="none"
                textAlign="center"
              >
                {gameEffects.comboText}
              </MotionBox>
            </AnimatePresence>
          )}
          
          {/* Quiz completion overlay */}
          {quizState.status === 'completed' && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: [0.95, 1] }}
              transition={{ duration: 0.5, scale: { duration: 0.3, ease: "backOut" } }}
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="rgba(0,0,0,0.8)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={20}
            >
              <VStack
                bg="#111"
                border="3px solid #00ff00"
                borderRadius="md"
                p={6}
                spacing={4}
                boxShadow="0 0 30px rgba(0, 255, 0, 0.5)"
                maxW="400px"
              >
                <MotionBox
                  animate={{
                    scale: [1, 1.1, 1], 
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <MotionBox
                    animate={{
                      textShadow: [
                        "0 0 10px #00ff00", 
                        "0 0 30px #00ff00", 
                        "0 0 10px #00ff00"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Text color="#00ff00" fontSize="2xl" fontWeight="bold">
                      Quest Complete!
                    </Text>
                  </MotionBox>
                </MotionBox>
                
                <VStack spacing={3} align="start" w="100%">
                  <HStack justify="space-between" w="100%">
                    <Text color="#ccc">Final Score:</Text>
                    <Text color="#ffd93d" fontWeight="bold">{quizState.score}</Text>
                  </HStack>
                  
                  <HStack justify="space-between" w="100%">
                    <Text color="#ccc">Max Combo:</Text>
                    <Text color="#ff6b6b" fontWeight="bold">x{quizState.maxComboReached.toFixed(1)}</Text>
                  </HStack>
                  
                  <HStack justify="space-between" w="100%">
                    <Text color="#ccc">Correct Placements:</Text>
                    <Text color="#4ecdc4" fontWeight="bold">{quizState.correctPlacements}/{quizState.solution.length}</Text>
                  </HStack>
                  
                  <HStack justify="space-between" w="100%">
                    <Text color="#ccc">Time Bonus:</Text>
                    <Text color="#00ff00" fontWeight="bold">
                      {quizState.feedback.find(f => f.type === 'timeBonus')?.points || 0} pts
                    </Text>
                  </HStack>
                </VStack>
                
                <Button
                  colorScheme="green"
                  size="md"
                  onClick={handleReset}
                  mt={2}
                >
                  Try Again
                </Button>
              </VStack>
            </MotionBox>
          )}
          
          {/* Quiz failure overlay */}
          {quizState.status === 'failed' && (
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: [0.95, 1] }}
              transition={{ duration: 0.5, scale: { duration: 0.3 } }}
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bg="rgba(0,0,0,0.8)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              zIndex={20}
            >
              <VStack
                bg="#111"
                border="3px solid #ff6b6b"
                borderRadius="md"
                p={6}
                spacing={4}
                boxShadow="0 0 30px rgba(255, 107, 107, 0.5)"
                maxW="400px"
              >
                <MotionBox
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 2, -2, 0],
                    textShadow: [
                      "0 0 10px #ff6b6b",
                      "0 0 20px #ff6b6b",
                      "0 0 10px #ff6b6b"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Text color="#ff6b6b" fontSize="2xl" fontWeight="bold">
                    Time's Up!
                  </Text>
                </MotionBox>
                
                <VStack spacing={3} align="start" w="100%">
                  <HStack justify="space-between" w="100%">
                    <Text color="#ccc">Score:</Text>
                    <Text color="#ffd93d" fontWeight="bold">{quizState.score}</Text>
                  </HStack>
                  
                  <HStack justify="space-between" w="100%">
                    <Text color="#ccc">Completed:</Text>
                    <Text color="#4ecdc4" fontWeight="bold">{quizState.correctPlacements}/{quizState.solution.length}</Text>
                  </HStack>
                </VStack>
                
                <Button
                  colorScheme="blue"
                  size="md"
                  onClick={handleReset}
                  mt={2}
                >
                  Try Again
                </Button>
              </VStack>
            </MotionBox>
          )}
          
          {/* Floating messages */}
          <AnimatePresence>
            {gameEffects.feedbackMessages.map((message, index) => (
              <MotionBox
                key={message.id}
                initial={{ opacity: 0, x: -50, y: 0 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50, y: 0 }}
                transition={{ duration: 0.5 }}
                position="fixed"
                left="5%"
                top={`${20 + (index * 8)}%`}
                bg="rgba(0,0,0,0.8)"
                border={`1px solid ${message.type === 'success' ? '#00ff00' : message.type === 'error' ? '#ff6b6b' : '#ffd93d'}`}
                color={message.type === 'success' ? '#00ff00' : message.type === 'error' ? '#ff6b6b' : '#ffd93d'}
                p={2}
                borderRadius="md"
                zIndex={999}
                fontSize="sm"
                maxW="250px"
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis"
              >
                {message.text}
              </MotionBox>
            ))}
          </AnimatePresence>
        </Box>
      </MotionBox>
    </Box>
  );
};

export default CodeStackingQuiz;