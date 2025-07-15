import React, { useState, useEffect, useRef } from 'react';
import { Box, VStack, HStack, Text, Button, Badge, Progress, Tooltip, useDisclosure } from "@chakra-ui/react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { CodeQuizEngine, createCodeBlocksFromString } from './CodeQuizEngine';
import confetti from 'canvas-confetti';

const MotionBox = motion(Box);

// Draggable Code Block component with visual feedback
const DraggableCodeBlock = ({ block, onDragStart, onDragEnd, isDragging, isPlaced, isCorrect, language = "csharp" }) => {
  const colors = {
    draggable: { bg: "#222", border: "#444", shadow: "0 2px 5px rgba(0, 0, 0, 0.2)" },
    dragging: { bg: "#333", border: "#666", shadow: "0 5px 15px rgba(0, 0, 0, 0.3)" },
    placed: { 
      correct: { bg: "#001800", border: "#00ff00", shadow: "0 0 10px rgba(0, 255, 0, 0.3)" },
      incorrect: { bg: "#260000", border: "#ff0000", shadow: "0 0 10px rgba(255, 0, 0, 0.3)" }
    }
  };
  
  let style = colors.draggable;
  if (isDragging) {
    style = colors.dragging;
  } else if (isPlaced) {
    style = isCorrect ? colors.placed.correct : colors.placed.incorrect;
  }

  // Indentation padding - 8px per level of indentation
  const indentationPadding = `${(block.indentation || 0) / 2}px`;

  return (
    <MotionBox
      drag={!isPlaced}
      dragSnapToOrigin
      onDragStart={() => onDragStart(block)}
      onDragEnd={() => onDragEnd(block)}
      whileHover={{ scale: isPlaced ? 1 : 1.02 }}
      whileDrag={{ scale: 1.05, zIndex: 10 }}
      animate={{
        boxShadow: style.shadow,
        borderColor: style.border,
        backgroundColor: style.bg,
        y: isPlaced && isCorrect ? [0, -5, 0] : 0 // Small bounce effect for correct placement
      }}
      transition={{ 
        duration: 0.3,
        y: { duration: 0.5, type: "spring", stiffness: 300 }
      }}
      bg={style.bg}
      border={`1px solid ${style.border}`}
      borderRadius="md"
      p={2}
      cursor={isPlaced ? "default" : "grab"}
      mb={2}
      position="relative"
      zIndex={isDragging ? 10 : 1}
    >
      {/* Line number */}
      <Text 
        position="absolute" 
        left="-30px" 
        top="50%" 
        transform="translateY(-50%)"
        fontSize="xs"
        color="#666"
      >
        {block.lineNumber}
      </Text>
      
      {/* Code content with syntax highlighting */}
      <Box 
        fontFamily="monospace" 
        fontSize="sm" 
        color="#ccc"
        pl={indentationPadding}
        whiteSpace="pre"
        overflow="hidden"
      >
        {block.content}
      </Box>
      
      {/* Status indicator */}
      {isPlaced && (
        <Badge 
          position="absolute" 
          top={1} 
          right={1}
          bg={isCorrect ? "green.600" : "red.600"}
          color="white"
          fontSize="xs"
          borderRadius="full"
        >
          {isCorrect ? "✓" : "✗"}
        </Badge>
      )}
    </MotionBox>
  );
};

// Drop Zone for placing code blocks
const DropZone = ({ index, onDrop, children, isActive, highlightColor = "#4ecdc4" }) => {
  return (
    <MotionBox
      animate={{
        backgroundColor: isActive ? `${highlightColor}22` : "transparent",
        borderColor: isActive ? highlightColor : "#333",
      }}
      transition={{ duration: 0.3 }}
      bg="transparent"
      border="1px dashed #333"
      borderRadius="md"
      minH="40px"
      p={2}
      mb={2}
      onMouseUp={() => onDrop(index)}
      position="relative"
    >
      {children}
      
      {isActive && !children && (
        <MotionBox
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1, repeat: Infinity }}
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg={`${highlightColor}11`}
          borderRadius="md"
          zIndex={-1}
        />
      )}
    </MotionBox>
  );
};

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
  juiciness = "high" // "low", "medium", "high" - visual effects level
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
  
  // Initialize quiz engine
  useEffect(() => {
    if (!code) return;
    
    // Create code blocks
    const codeBlocks = createCodeBlocksFromString(code, splitType);
    
    // Create quiz engine
    const quizEngine = new CodeQuizEngine({
      timeLimit: difficultySettings[difficulty]?.timeLimit || timeLimit,
      basePoints: difficultySettings[difficulty]?.basePoints || 100,
      penalty: difficultySettings[difficulty]?.penalty || 0.1
    });
    
    // Set up quiz with code blocks
    quizEngine.setup(codeBlocks, [...codeBlocks]);
    
    // Register event handlers
    quizEngine
      .on('start', (state) => {
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
        if (onComplete) {
          onComplete({
            score: result.score,
            maxCombo: result.maxCombo,
            timeElapsed: result.timeElapsed,
            correctPlacements: result.correctPlacements,
            incorrectPlacements: result.incorrectPlacements,
            success: true
          });
        }
      })
      .on('correct', (data) => {
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
            success: false
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
      quizEngineRef.current.start();
    }
  };

  // Reset the quiz
  const handleReset = () => {
    if (quizEngineRef.current) {
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

  // Handle drag start
  const handleDragStart = (block) => {
    setActiveDragBlock(block);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setActiveDragBlock(null);
  };

  // Handle drop on a zone
  const handleDrop = (index) => {
    if (!activeDragBlock || !quizEngineRef.current) return;
    
    // Place the block
    quizEngineRef.current.placeBlock(activeDragBlock.id);
    
    // Update state
    setQuizState(quizEngineRef.current.getState());
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

  // Progress bar and feedback animations
  const progressControls = useAnimation();
  
  useEffect(() => {
    if (quizState?.status === 'completed') {
      progressControls.start({
        backgroundColor: ["#00ff00", "#44ff44", "#00ff00"],
        scale: [1, 1.05, 1],
        transition: { duration: 1.5, repeat: 2 }
      });
    } else if (quizState?.timeRemaining && quizState.timeRemaining < 10) {
      progressControls.start({
        backgroundColor: ["#ff0000", "#ff6666", "#ff0000"],
        transition: { duration: 0.5, repeat: Infinity }
      });
    }
  }, [quizState?.status, quizState?.timeRemaining]);

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
          bg={screenFlash.type === 'success' ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)"}
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
        overflow="hidden"
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
                animate={progressControls}
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
          
          {(quizState.status === 'completed' || quizState.status === 'failed') && (
            <Button
              colorScheme="blue"
              size="sm"
              onClick={handleReset}
            >
              Reset Quiz
            </Button>
          )}
        </HStack>
      </HStack>
      
      {/* Quiz content */}
      <Box p={4} position="relative">
        <HStack align="start" spacing={6}>
          {/* Available blocks */}
          <Box w="45%" position="relative">
            <Text color="#666" fontSize="sm" mb={2}>Available Blocks:</Text>
            <VStack align="start" spacing={2} ml="30px">
              {quizState.blocks.map((block) => (
                <DraggableCodeBlock
                  key={block.id}
                  block={block}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  isDragging={activeDragBlock?.id === block.id}
                  language={language}
                />
              ))}
              {quizState.blocks.length === 0 && (
                <Text color="#666" fontSize="sm">No blocks available</Text>
              )}
            </VStack>
          </Box>
          
          {/* Solution area */}
          <Box w="55%" position="relative">
            <Text color="#666" fontSize="sm" mb={2}>Arrange Here:</Text>
            <VStack align="start" spacing={0} ml="30px">
              {quizState.userSolution.length > 0 ? (
                quizState.userSolution.map((block, index) => (
                  <DropZone 
                    key={`solution-${index}`}
                    index={index}
                    onDrop={handleDrop}
                    isActive={false}
                  >
                    <DraggableCodeBlock
                      block={block}
                      isPlaced={true}
                      isCorrect={quizEngineRef.current.checkPlacement(block, index)}
                      language={language}
                    />
                  </DropZone>
                ))
              ) : (
                <DropZone
                  index={0}
                  onDrop={handleDrop}
                  isActive={!!activeDragBlock}
                >
                  <Text color="#666" fontSize="sm">Drop first block here</Text>
                </DropZone>
              )}
              
              {/* Next drop zone */}
              {quizState.userSolution.length > 0 && 
               quizState.userSolution.length < quizState.solution.length && (
                <DropZone
                  index={quizState.userSolution.length}
                  onDrop={handleDrop}
                  isActive={!!activeDragBlock}
                  highlightColor={gameEffects.streak >= 3 ? "#ffd93d" : "#4ecdc4"}
                />
              )}
            </VStack>
          </Box>
        </HStack>
        
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
        
        {/* Combo display */}
        {gameEffects.combo > 1.5 && quizState.status === 'active' && (
          <MotionBox
            initial={{ scale: 0, opacity: 0, x: 100 }}
            animate={{ 
              scale: 1,
              opacity: 1,
              x: 0,
              boxShadow: [
                `0 0 10px ${gameEffects.combo >= 2.5 ? "#ff6b6b" : "#4ecdc4"}`,
                `0 0 25px ${gameEffects.combo >= 2.5 ? "#ff6b6b" : "#4ecdc4"}`,
                `0 0 10px ${gameEffects.combo >= 2.5 ? "#ff6b6b" : "#4ecdc4"}`
              ]
            }}
            transition={{ 
              duration: 0.5,
              boxShadow: { repeat: Infinity, duration: 1.5 }
            }}
            position="fixed"
            top="30%"
            right="5%"
            bg={gameEffects.combo >= 2.5 ? 
              "linear-gradient(135deg, #ff6b6b44, #ff6b6b22)" : 
              "linear-gradient(135deg, #4ecdc444, #4ecdc422)"}
            border={`2px solid ${gameEffects.combo >= 2.5 ? "#ff6b6b" : "#4ecdc4"}`}
            borderRadius="lg"
            p={4}
            zIndex={1001}
          >
            <VStack spacing={1}>
              <Text color={gameEffects.combo >= 2.5 ? "#ff6b6b" : "#4ecdc4"} fontSize="sm">
                COMBO MULTIPLIER
              </Text>
              <Text 
                color={gameEffects.combo >= 2.5 ? "#ff6b6b" : "#4ecdc4"} 
                fontSize="2xl" 
                fontWeight="bold"
              >
                x{gameEffects.combo.toFixed(1)}
              </Text>
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

{/* Add custom CSS for streak, shake and other animations */}
<style jsx="true">{`
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  
  @keyframes fadeInOut {
    0% { opacity: 0.3; }
    50% { opacity: 1; }
    100% { opacity: 0.3; }
  }
  
  .pulse-animation {
    animation: pulse 1s infinite ease-in-out;
  }
  
  .fadeInOut-animation {
    animation: fadeInOut 2s infinite ease-in-out;
  }
`}</style>

export default CodeStackingQuiz;