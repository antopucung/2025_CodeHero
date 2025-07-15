import React, { useState, useRef, useEffect } from 'react';
import { Box, VStack, HStack, Text, Button, Badge, Flex, Tooltip, Input, Kbd } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { BaseQuizEngine } from './BaseQuizEngine';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import confetti from 'canvas-confetti';

const MotionBox = motion(Box);

// Code Completion Quiz Engine
class CodeCompletionQuizEngine extends BaseQuizEngine {
  constructor(options = {}) {
    super(options);
    
    // Extended state for code completion quiz
    this.state = {
      ...this.state,
      codeBlocks: [],        // Array of code blocks with blanks
      userAnswers: {},        // Map of blank index to user answer
      solutions: {},          // Map of blank index to correct answer
      currentFocusIndex: 0,   // Current blank index in focus
    };
  }
  
  setup(quizData) {
    if (!quizData || !quizData.code) {
      throw new Error('Invalid quiz data: code is required');
    }
    
    // Process code to extract blanks and solutions
    const { blocks, solutions } = this.processCode(quizData.code, quizData.blanks || []);
    
    this.state.codeBlocks = blocks;
    this.state.solutions = solutions;
    this.state.userAnswers = {};
    this.state.currentFocusIndex = 0;
    
    return this;
  }
  
  // Process code string and extract blanks and solutions
  processCode(code, predefinedBlanks) {
    const blocks = [];
    const solutions = {};
    let blankCount = 0;
    
    // If predefined blanks are provided, use them
    if (predefinedBlanks && predefinedBlanks.length > 0) {
      // Split code into lines
      const lines = code.split('\n');
      
      // Process each line
      lines.forEach((line, lineIndex) => {
        let processedLine = line;
        let lineBlankOffset = 0;
        
        // Find blanks in this line
        const lineBlanks = predefinedBlanks.filter(blank => 
          blank.lineIndex === lineIndex
        );
        
        // Sort blanks by position (right to left to avoid index shifting)
        lineBlanks.sort((a, b) => b.startIndex - a.startIndex);
        
        // Process each blank in the line
        lineBlanks.forEach(blank => {
          const blankIndex = blankCount++;
          const originalText = line.substring(blank.startIndex, blank.endIndex);
          solutions[blankIndex] = blank.solution || originalText;
          
          // Replace the blank in the line
          processedLine = processedLine.substring(0, blank.startIndex) + 
                         `__BLANK_${blankIndex}__` + 
                         processedLine.substring(blank.endIndex);
        });
        
        // Add the processed line as a block
        if (processedLine.includes('__BLANK_')) {
          // Split by blanks
          const parts = processedLine.split(/(__BLANK_\d+__)/g);
          parts.forEach(part => {
            if (part.match(/__BLANK_(\d+)__/)) {
              const blankIndex = parseInt(part.match(/__BLANK_(\d+)__/)[1]);
              blocks.push({
                type: 'blank',
                blankIndex,
                lineIndex
              });
            } else if (part) {
              blocks.push({
                type: 'code',
                content: part,
                lineIndex
              });
            }
          });
        } else {
          // No blanks in this line
          blocks.push({
            type: 'code',
            content: processedLine,
            lineIndex
          });
        }
        
        // Add line break
        if (lineIndex < lines.length - 1) {
          blocks.push({
            type: 'linebreak',
            lineIndex
          });
        }
      });
    } 
    // Otherwise, use a simple placeholder pattern to identify blanks
    else {
      // Look for __BLANK__ or similar patterns
      const blankPattern = /__(BLANK)__/g;
      let match;
      let lastIndex = 0;
      let processedCode = code;
      
      while ((match = blankPattern.exec(processedCode)) !== null) {
        const blankIndex = blankCount++;
        const startText = processedCode.substring(lastIndex, match.index);
        if (startText) {
          blocks.push({
            type: 'code',
            content: startText
          });
        }
        
        blocks.push({
          type: 'blank',
          blankIndex
        });
        
        solutions[blankIndex] = match[1] || ''; // Default solution is the captured group or empty
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (lastIndex < processedCode.length) {
        blocks.push({
          type: 'code',
          content: processedCode.substring(lastIndex)
        });
      }
    }
    
    return { blocks, solutions };
  }
  
  // Submit an answer for a specific blank
  submitAnswer(blankIndex, answer) {
    if (this.state.status !== 'active') return false;
    
    const correctAnswer = this.state.solutions[blankIndex];
    this.state.userAnswers[blankIndex] = answer;
    
    // Check if the answer is correct
    const isCorrect = this.checkAnswer(answer, correctAnswer);
    
    if (isCorrect) {
      // Increase combo
      this.state.combo = Math.min(this.state.combo + this.options.comboIncrement, this.options.maxCombo);
      this.state.maxComboReached = Math.max(this.state.maxComboReached, this.state.combo);
      this.state.correctAnswers++;
      
      // Calculate points with combo
      const points = Math.round(this.options.basePoints * this.state.combo);
      this.state.score += points;
      
      // Add feedback event
      this.state.feedback.push({
        type: 'correct',
        blankIndex,
        answer,
        correctAnswer,
        points,
        combo: this.state.combo,
        timestamp: Date.now()
      });
      
      // Call onCorrect callback
      if (this.callbacks.onCorrect) {
        this.callbacks.onCorrect({
          blankIndex,
          answer,
          correctAnswer,
          points,
          combo: this.state.combo
        });
      }
      
      // Focus the next blank if available
      this.focusNextBlank();
    } else {
      // Reset combo on incorrect
      this.state.combo = 1.0;
      this.state.incorrectAnswers++;
      
      // Apply penalty
      const penalty = Math.round(this.options.basePoints * this.options.penalty);
      this.state.score = Math.max(0, this.state.score - penalty);
      
      // Add feedback event
      this.state.feedback.push({
        type: 'incorrect',
        blankIndex,
        answer,
        correctAnswer,
        penalty,
        timestamp: Date.now()
      });
      
      // Call onIncorrect callback
      if (this.callbacks.onIncorrect) {
        this.callbacks.onIncorrect({
          blankIndex,
          answer,
          correctAnswer,
          penalty
        });
      }
    }
    
    // Check if all blanks are filled
    if (this.areAllBlanksFilled()) {
      this.complete();
    }
    
    return isCorrect;
  }
  
  // Focus the next available blank
  focusNextBlank() {
    const blanks = this.state.codeBlocks.filter(block => block.type === 'blank');
    const blankIndices = blanks.map(block => block.blankIndex);
    
    // Find the next blank that isn't answered correctly
    for (let i = 0; i < blankIndices.length; i++) {
      const index = blankIndices[i];
      const userAnswer = this.state.userAnswers[index];
      const correctAnswer = this.state.solutions[index];
      
      if (!userAnswer || !this.checkAnswer(userAnswer, correctAnswer)) {
        this.state.currentFocusIndex = index;
        return;
      }
    }
    
    // If we get here, all blanks are filled correctly
    this.complete();
  }
  
  // Check if an answer is correct
  checkAnswer(userAnswer, correctAnswer) {
    if (!userAnswer || !correctAnswer) return false;
    
    // Case-insensitive comparison by default
    // For more advanced comparison like regex, this could be extended
    return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  }
  
  // Check if all blanks have been filled
  areAllBlanksFilled() {
    const blanks = this.state.codeBlocks.filter(block => block.type === 'blank');
    
    for (const blank of blanks) {
      const blankIndex = blank.blankIndex;
      const userAnswer = this.state.userAnswers[blankIndex];
      if (!userAnswer) return false;
    }
    
    return true;
  }
  
  // Check if quiz was successful
  isSuccessful() {
    // Quiz is successful if at least 70% of blanks are filled correctly
    const blanks = this.state.codeBlocks.filter(block => block.type === 'blank');
    const totalBlanks = blanks.length;
    const correctBlanks = blanks.filter(blank => {
      const blankIndex = blank.blankIndex;
      const userAnswer = this.state.userAnswers[blankIndex];
      const correctAnswer = this.state.solutions[blankIndex];
      return userAnswer && this.checkAnswer(userAnswer, correctAnswer);
    }).length;
    
    const correctPercentage = (correctBlanks / totalBlanks) * 100;
    return correctPercentage >= 70;
  }
  
  // Reset the quiz
  reset() {
    super.reset();
    
    // Reset code completion specific state
    this.state.userAnswers = {};
    this.state.currentFocusIndex = 0;
    
    return this;
  }
}

// Main Code Completion Quiz Component
const CodeCompletionQuiz = ({
  quizData,
  onComplete,
  juiciness = 'high' // 'low', 'medium', 'high' - visual effects level
}) => {
  // Quiz engine reference
  const quizEngineRef = useRef(null);
  
  // UI state
  const [quizState, setQuizState] = useState(null);
  const [inputRefs, setInputRefs] = useState({});
  const [gameEffects, setGameEffects] = useState({
    combo: 1,
    lastAction: null,
    comboText: "",
    pointsText: "",
    streak: 0,
    feedbackMessages: []
  });
  
  // Visual state
  const [screenFlash, setScreenFlash] = useState({ active: false, type: 'success', intensity: 1 });
  const [streakStatus, setStreakStatus] = useState({ active: false, count: 0 });
  
  // Configure difficulty settings
  const difficultySettings = {
    easy: { timeLimit: 180, basePoints: 50, penalty: 0.05 },
    medium: { timeLimit: 120, basePoints: 100, penalty: 0.1 },
    hard: { timeLimit: 90, basePoints: 150, penalty: 0.15 }
  };
  
  // Initialize quiz engine
  useEffect(() => {
    if (!quizData) return;
    
    try {
      // Create quiz engine
      const difficulty = quizData.difficulty || 'medium';
      const quizEngine = new CodeCompletionQuizEngine({
        timeLimit: quizData.timeLimit || difficultySettings[difficulty]?.timeLimit || 120,
        basePoints: difficultySettings[difficulty]?.basePoints || 100,
        penalty: difficultySettings[difficulty]?.penalty || 0.1
      });
      
      // Set up quiz
      quizEngine.setup(quizData);
      
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
          
          // Focus first blank after a short delay
          setTimeout(() => {
            if (inputRefs[state.currentFocusIndex]) {
              inputRefs[state.currentFocusIndex].focus();
            }
          }, 100);
        })
        .on('complete', (result) => {
          if (onComplete) {
            onComplete({
              score: result.score,
              maxCombo: result.maxCombo,
              timeElapsed: result.timeElapsed,
              correctAnswers: result.correctAnswers,
              incorrectAnswers: result.incorrectAnswers,
              success: result.success,
              totalBlanks: Object.keys(quizEngine.state.solutions).length
            });
            
            if (result.success) {
              // Show confetti on success
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
              });
            }
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
          
          // Focus next blank after a short delay
          setTimeout(() => {
            const nextFocusIndex = quizEngineRef.current?.state.currentFocusIndex;
            if (inputRefs[nextFocusIndex]) {
              inputRefs[nextFocusIndex].focus();
            }
          }, 100);
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
            comboText: "TRY AGAIN!",
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
              correctAnswers: result.correctAnswers,
              incorrectAnswers: result.incorrectAnswers,
              success: false,
              totalBlanks: Object.keys(quizEngine.state.solutions).length
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
    } catch (error) {
      console.error('Error initializing quiz engine:', error);
    }
    
    return () => {
      // Clean up
      if (quizEngineRef.current) {
        quizEngineRef.current.destroy();
      }
    };
  }, [quizData]);
  
  // Handle input reference registration
  const registerInputRef = (index, ref) => {
    if (ref) {
      setInputRefs(prev => ({ ...prev, [index]: ref }));
    }
  };
  
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

  // Handle answer input
  const handleAnswerInput = (blankIndex, value) => {
    if (!quizEngineRef.current || quizState.status !== 'active') return;
    
    // Update answer in engine state
    if (value && value.trim()) {
      quizEngineRef.current.submitAnswer(blankIndex, value);
      setQuizState({ ...quizEngineRef.current.getState() });
    }
  };

  // Format remaining time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Visual effect controls based on juiciness setting
  const effectsIntensity = {
    low: { scale: 0.3, speed: 0.7, particles: false },
    medium: { scale: 0.7, speed: 1.0, particles: true },
    high: { scale: 1.0, speed: 1.3, particles: true }
  };
  
  const effects = effectsIntensity[juiciness] || effectsIntensity.medium;

  // If no quiz state or code blocks, show loading
  if (!quizState || !quizState.codeBlocks || quizState.codeBlocks.length === 0) {
    return (
      <Box textAlign="center" p={10}>
        <Text color="#666">Loading quiz...</Text>
      </Box>
    );
  }

  // Count total blanks
  const totalBlanks = quizState.codeBlocks.filter(block => block.type === 'blank').length;
  const completedBlanks = Object.keys(quizState.userAnswers).filter(blankIndex => {
    const userAnswer = quizState.userAnswers[blankIndex];
    const correctAnswer = quizState.solutions[blankIndex];
    return quizEngineRef.current?.checkAnswer(userAnswer, correctAnswer);
  }).length;

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
            {quizData.title || "Fill in the Blanks"}
          </Text>
          <Text color="#666" fontSize="xs">
            {quizData.description || "Complete the code by filling in the missing parts"}
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
                    width: `${(quizState.timeRemaining / (quizData.timeLimit || 120)) * 100}%`,
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
      
      {/* Quiz progress bar */}
      {quizState.status === 'active' && (
        <Box bg="#111" px={4} pb={2}>
          <HStack justify="space-between" mb={1}>
            <Text color="#666" fontSize="xs">
              Completed: {completedBlanks} of {totalBlanks} blanks
            </Text>
            <Text color="#666" fontSize="xs">
              {Math.round((completedBlanks / totalBlanks) * 100)}% Complete
            </Text>
          </HStack>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${(completedBlanks / totalBlanks) * 100}%` }}
            transition={{ duration: 0.5 }}
            style={{
              height: '4px',
              background: '#00ff00',
              borderRadius: '2px'
            }}
          />
        </Box>
      )}
      
      {/* Quiz content */}
      <Box p={4} position="relative">
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
                {quizData.title || "Code Completion Challenge"}
              </Text>
            </MotionBox>
            
            <Text color="#ccc" fontSize="md">
              {quizData.description || "Fill in the missing code to complete the program"}
            </Text>
            
            <VStack spacing={3} bg="#111" p={5} borderRadius="md" border="1px solid #222">
              <Text color="#ffd93d" fontWeight="bold">Challenge Details:</Text>
              <HStack spacing={6}>
                <VStack spacing={1}>
                  <Text fontSize="xs" color="#666">Blanks</Text>
                  <Text fontSize="lg" color="#4ecdc4">{totalBlanks}</Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="xs" color="#666">Time Limit</Text>
                  <Text fontSize="lg" color="#ff6b6b">{formatTime(quizData.timeLimit || 120)}</Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="xs" color="#666">Difficulty</Text>
                  <Text fontSize="lg" color="#ffd93d">{quizData.difficulty?.toUpperCase() || "MEDIUM"}</Text>
                </VStack>
              </HStack>
            </VStack>
            
            <Button
              bg="#00ff00"
              color="#000"
              size="lg"
              onClick={handleStart}
              fontWeight="bold"
              px={8}
              mt={4}
              boxShadow="0 0 15px #00ff0044"
              _hover={{ bg: "#00cc00", boxShadow: "0 0 25px #00ff0066" }}
            >
              Start Challenge
            </Button>
          </VStack>
        )}
        
        {quizState.status === 'active' && (
          <Box>
            <Box
              bg="#111"
              border="1px solid #333"
              borderRadius="md"
              p={4}
              fontFamily="monospace"
              position="relative"
            >
              <Text color="#666" fontSize="xs" mb={3}>
                Fill in the blanks to complete the code:
              </Text>
              
              <Box
                fontFamily="monospace"
                fontSize="sm"
                lineHeight="1.6"
                whiteSpace="pre-wrap"
                position="relative"
              >
                {/* Render code with input fields for blanks */}
                <Flex flexWrap="wrap">
                  {quizState.codeBlocks.map((block, blockIndex) => {
                    if (block.type === 'code') {
                      return (
                        <Text 
                          key={`code-${blockIndex}`}
                          color="#ccc"
                          fontFamily="monospace"
                        >
                          {block.content}
                        </Text>
                      );
                    } else if (block.type === 'blank') {
                      const blankIndex = block.blankIndex;
                      const userAnswer = quizState.userAnswers[blankIndex] || '';
                      const isCorrect = quizState.userAnswers[blankIndex] && 
                        quizEngineRef.current?.checkAnswer(userAnswer, quizState.solutions[blankIndex]);
                      
                      return (
                        <Box
                          key={`blank-${blankIndex}`}
                          display="inline-block"
                          position="relative"
                        >
                          <Input
                            ref={ref => registerInputRef(blankIndex, ref)}
                            value={userAnswer}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Don't submit on every keystroke, let user finish typing
                              if (quizEngineRef.current) {
                                quizEngineRef.current.state.userAnswers[blankIndex] = value;
                                setQuizState({ ...quizEngineRef.current.getState() });
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === 'Tab') {
                                e.preventDefault();
                                handleAnswerInput(blankIndex, userAnswer);
                              }
                            }}
                            onBlur={() => {
                              if (userAnswer) {
                                handleAnswerInput(blankIndex, userAnswer);
                              }
                            }}
                            size="sm"
                            width="auto"
                            minW="80px"
                            maxW="200px"
                            border="1px dashed"
                            borderColor={
                              isCorrect ? "#00ff00" :
                              userAnswer ? "#ff6b6b" : "#666"
                            }
                            color={
                              isCorrect ? "#00ff00" :
                              userAnswer ? "#ff6b6b" : "#ccc"
                            }
                            bg="#111"
                            _hover={{ borderColor: "#4ecdc4" }}
                            _focus={{ 
                              borderColor: "#4ecdc4",
                              boxShadow: "0 0 0 1px #4ecdc4",
                              bg: "#113333"
                            }}
                            placeholder="???"
                            isReadOnly={isCorrect}
                            className={`blank-input blank-${blankIndex}`}
                            zIndex={2}
                          />
                          
                          {/* Success indicator */}
                          {isCorrect && (
                            <MotionBox
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3, type: "spring" }}
                              position="absolute"
                              top="-8px"
                              right="-8px"
                              zIndex={3}
                            >
                              <Badge 
                                colorScheme="green" 
                                fontSize="10px"
                              >
                                ✓
                              </Badge>
                            </MotionBox>
                          )}
                        </Box>
                      );
                    } else if (block.type === 'linebreak') {
                      return <Box key={`br-${blockIndex}`} w="100%" h="1.6em" />;
                    }
                    
                    return null;
                  })}
                </Flex>
                
                {/* Keyboard shortcuts help */}
                <Box 
                  mt={4}
                  p={2}
                  bg="#111"
                  border="1px solid #333"
                  borderRadius="md"
                >
                  <Text fontSize="xs" color="#666">
                    Tip: Press <Kbd bg="#222" color="#ccc">Enter</Kbd> or <Kbd bg="#222" color="#ccc">Tab</Kbd> to submit each answer
                  </Text>
                </Box>
              </Box>
            </Box>
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
                  <Text color="#ccc">Correct Blanks:</Text>
                  <Text color="#4ecdc4" fontWeight="bold">{completedBlanks}/{totalBlanks}</Text>
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

export default CodeCompletionQuiz;