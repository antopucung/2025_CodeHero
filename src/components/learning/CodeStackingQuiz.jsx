import React from 'react';
import { Box, VStack, HStack, Text, Badge, Progress } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useCodeQuizEngine } from '../../hooks/useCodeQuizEngine';
import DraggableCodeBlock from './DraggableCodeBlock';
import DropZone from './DropZone';
import confetti from 'canvas-confetti';

const MotionBox = motion(Box);

// Main Code Stacking Quiz Component
const CodeStackingQuiz = ({ 
  code,
  language = "csharp",
  timeLimit = 120,
  title = "Arrange the Code",
  description = "Drag the code blocks to arrange them in the correct order",
  splitType = "line",
  difficulty = "medium",
  onComplete,
  juiciness = "high" // 'low', 'medium', 'high' - visual effects level
}) => {
  // Initialize quiz engine with the hook
  const {
    quizState,
    gameEffects,
    screenFlash,
    streakStatus,
    isPaused,
    activeDragBlock,
    isDraggingBlock,
    dropZoneRefs,
    handleStart,
    handleReset,
    handlePause,
    handleResume,
    handleAbort,
    handleBlockDragStart,
    handleBlockDragEnd,
    handleDropOnZone
  } = useCodeQuizEngine({
    code,
    splitType,
    difficulty,
    timeLimit,
    juiciness,
    onComplete: (results) => {
      // Show confetti on success
      if (results.success) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      if (onComplete) onComplete(results);
    }
  });

  // Visual effect controls based on juiciness setting
  const effectsIntensity = {
    low: { scale: 0.3, speed: 0.7, particles: false },
    medium: { scale: 0.7, speed: 1.0, particles: true },
    high: { scale: 1.0, speed: 1.3, particles: true }
  };
  
  const effects = effectsIntensity[juiciness] || effectsIntensity.medium;

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // If quiz state is not initialized yet
  if (!quizState) {
    return (
      <Box textAlign="center" p={10} color="#666">
        Loading challenge...
      </Box>
    );
  }

  // Determine the correct drop zone refs array
  const actualDropZoneRefs = dropZoneRefs.current || [];

  console.log("CodeStackingQuiz rendering", { 
    status: quizState.status,
    blocks: quizState.blocks?.length,
    userSolution: quizState.userSolution?.length
  });

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
          </HStack>
        </HStack>
        
        {quizState.status === 'waiting' && (
          <VStack
            spacing={6}
            align="center"
            justify="center"
            bg="#111"
            borderRadius="md"
            p={8}
            textAlign="center"
          >
            <MotionBox
              animate={{
                y: [0, -10, 0],
                textShadow: [
                  "0 0 10px #00ff00",
                  "0 0 30px #00ff00",
                  "0 0 10px #00ff00"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Text fontSize="xl" fontWeight="bold" color="#00ff00">
                {title}
              </Text>
            </MotionBox>
            
            <Text color="#ccc" fontSize="md">
              {description}
            </Text>
            
            <VStack spacing={3} bg="#111" p={5} borderRadius="md" border="1px solid #222">
              <Text color="#ffd93d" fontWeight="bold">Challenge Details:</Text>
              <HStack spacing={6}>
                <VStack spacing={1}>
                  <Text fontSize="xs" color="#666">Blocks</Text>
                  <Text fontSize="lg" color="#4ecdc4">{quizState.blocks.length}</Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="xs" color="#666">Time Limit</Text>
                  <Text fontSize="lg" color="#ff6b6b">{formatTime(timeLimit)}</Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="xs" color="#666">Difficulty</Text>
                  <Text fontSize="lg" color="#ffd93d">{difficulty.toUpperCase()}</Text>
                </VStack>
              </HStack>
            </VStack>
            
            <MotionBox
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                as="button"
                bg="#00ff00"
                color="#000"
                fontSize="md"
                fontWeight="bold"
                px={8}
                py={4}
                borderRadius="md"
                onClick={handleStart}
                boxShadow="0 0 15px #00ff0044"
                _hover={{ bg: "#00cc00", boxShadow: "0 0 25px #00ff0066" }}
              >
                Start Challenge
              </Box>
            </MotionBox>
          </VStack>
        )}
        
        {quizState.status === 'active' && (
          <>
            {/* Quiz progress indicator */}
            <Box bg="#111" px={4} pb={2}>
              <HStack justify="space-between" mb={1}>
                <Text color="#666" fontSize="xs">
                  Blocks Placed: {quizState.userSolution.length} of {quizState.solution.length}
                </Text>
                <Text color="#666" fontSize="xs">
                  {Math.round((quizState.userSolution.length / quizState.solution.length) * 100)}% Placed
                </Text>
              </HStack>
              <Progress
                value={(quizState.userSolution.length / quizState.solution.length) * 100}
                size="xs"
                colorScheme="green"
                bg="#222"
                borderRadius="full"
              />
            </Box>
            
            {/* Main Quiz Interface */}
            <HStack p={4} spacing={6} align="stretch" h="400px">
              {/* Left Side - Available Blocks */}
              <Box w="45%" overflow="auto" position="relative" bg="#0a0a0a" p={3} borderRadius="md">
                <Text color="#666" fontSize="sm" mb={2}>Drag Blocks:</Text>
                <VStack align="stretch" spacing={2} overflow="visible">
                  {quizState.blocks.map((block) => (
                    <DraggableCodeBlock
                      key={block.id}
                      block={block}
                      onDragStart={handleBlockDragStart}
                      onDragEnd={handleBlockDragEnd}
                      isDragging={activeDragBlock?.id === block.id}
                      isPlaced={false}
                      language={language}
                    />
                  ))}
                  {quizState.blocks.length === 0 && (
                    <Text color="#666" fontSize="sm" textAlign="center" p={4}>
                      All blocks placed!
                    </Text>
                  )}
                </VStack>
              </Box>
              
              {/* Right Side - Solution Area */}
              <Box w="55%" position="relative" h="100%" display="flex" flexDirection="column" zIndex={2} bg="#111">
                <Text color="#666" fontSize="sm" mb={2}>Arrange Here:</Text>
                <Box flex={1} overflowY="auto" ml="30px" position="relative" overflow="visible">
                  <VStack align="start" spacing={1} overflow="visible">
                    {Array.from({ length: quizState.userSolution.length + 1 }).map((_, index) => (
                      <Box key={`dropzone-wrapper-${index}`} w="100%" overflow="visible" position="relative">
                        <DropZone 
                          key={`dropzone-${index}`}
                          index={index}
                          ref={el => actualDropZoneRefs[index] = el}
                          isActive={!!activeDragBlock}
                          highlightColor={gameEffects.streak >= 3 ? "#ffd93d" : "#4ecdc4"}
                          onDrop={() => handleDropOnZone(index)}
                        >
                          {index < quizState.userSolution.length && (
                            <DraggableCodeBlock
                              key={`solution-${quizState.userSolution[index].id}`}
                              block={quizState.userSolution[index]}
                              isPlaced={true}
                              isCorrect={true}
                              language={language}
                            />
                          )}
                          
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
          </>
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
                    Challenge Complete!
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
              
              <Box
                as="button"
                colorScheme="green"
                bg="#00ff00"
                color="#000"
                py={2}
                px={4}
                borderRadius="md"
                fontWeight="bold"
                onClick={handleReset}
                mt={2}
              >
                Try Again
              </Box>
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
      </MotionBox>
    </Box>
  );
};

export default CodeStackingQuiz;