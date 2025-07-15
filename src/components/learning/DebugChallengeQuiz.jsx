import React, { useState, useEffect, useRef } from 'react';
import { Box, VStack, HStack, Text, Button, Badge, Progress, Flex } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { BaseQuizEngine } from './BaseQuizEngine';
import { Editor } from "@monaco-editor/react";
import confetti from 'canvas-confetti';

const MotionBox = motion(Box);

// Debug Challenge Quiz Engine
class DebugChallengeQuizEngine extends BaseQuizEngine {
  constructor(options = {}) {
    super(options);
    
    // Extended state for debug challenge
    this.state = {
      ...this.state,
      buggyCode: "",          // Original code with bugs
      fixedCode: "",          // Correct version of the code
      bugs: [],               // Array of bug descriptions
      userCode: "",           // User's current code
      bugsFixed: 0,           // Number of bugs fixed
      totalBugs: 0,           // Total number of bugs to fix
      lastSubmission: null    // Last submission result
    };
  }
  
  setup(quizData) {
    if (!quizData || !quizData.buggyCode || !quizData.fixedCode) {
      throw new Error('Invalid quiz data: buggyCode and fixedCode are required');
    }
    
    this.state.buggyCode = quizData.buggyCode;
    this.state.fixedCode = quizData.fixedCode;
    this.state.userCode = quizData.buggyCode;
    this.state.bugs = quizData.bugs || [];
    this.state.totalBugs = quizData.totalBugs || quizData.bugs?.length || 3;
    this.state.bugsFixed = 0;
    this.state.lastSubmission = null;
    
    return this;
  }
  
  // Submit code for evaluation
  submitCode(code) {
    if (this.state.status !== 'active') return false;
    
    this.state.userCode = code;
    
    // Basic evaluation by comparing code with fixed version
    const result = this.evaluateCode(code);
    this.state.lastSubmission = result;
    
    if (result.bugsFixed > this.state.bugsFixed) {
      // User fixed more bugs
      const newBugsFixed = result.bugsFixed - this.state.bugsFixed;
      this.state.bugsFixed = result.bugsFixed;
      
      // Increase combo
      this.state.combo = Math.min(this.state.combo + this.options.comboIncrement, this.options.maxCombo);
      this.state.maxComboReached = Math.max(this.state.maxComboReached, this.state.combo);
      this.state.correctAnswers += newBugsFixed;
      
      // Calculate points with combo
      const points = Math.round(this.options.basePoints * this.state.combo * newBugsFixed);
      this.state.score += points;
      
      // Add feedback event
      this.state.feedback.push({
        type: 'correct',
        bugsFixed: newBugsFixed,
        totalFixed: this.state.bugsFixed,
        points,
        combo: this.state.combo,
        timestamp: Date.now()
      });
      
      // Call onCorrect callback
      if (this.callbacks.onCorrect) {
        this.callbacks.onCorrect({
          bugsFixed: newBugsFixed,
          totalFixed: this.state.bugsFixed,
          points,
          combo: this.state.combo
        });
      }
      
      // Check if all bugs are fixed
      if (this.state.bugsFixed >= this.state.totalBugs) {
        this.complete();
      }
      
      return true;
    } else {
      // No new bugs fixed
      // Reset combo on incorrect submission
      this.state.combo = 1.0;
      this.state.incorrectAnswers++;
      
      // Apply penalty
      const penalty = Math.round(this.options.basePoints * this.options.penalty);
      this.state.score = Math.max(0, this.state.score - penalty);
      
      // Add feedback event
      this.state.feedback.push({
        type: 'incorrect',
        bugsFixed: 0,
        penalty,
        timestamp: Date.now()
      });
      
      // Call onIncorrect callback
      if (this.callbacks.onIncorrect) {
        this.callbacks.onIncorrect({
          bugsFixed: 0,
          penalty
        });
      }
      
      return false;
    }
  }
  
  // Evaluate code to determine bugs fixed
  evaluateCode(code) {
    if (!code || !this.state.fixedCode) {
      return { bugsFixed: 0, success: false, errors: ['No code submitted'] };
    }
    
    // Initialize result
    const result = {
      bugsFixed: 0,
      success: false,
      errors: []
    };
    
    // Advanced implementation would use more sophisticated diff and parsing
    // For now, use a simple line-by-line comparison approach
    
    // Normalize code - remove extra whitespace, consistent newlines
    const normalizeCode = (codeStr) => {
      return codeStr
        .replace(/\r\n/g, '\n')
        .replace(/\t/g, '  ')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');
    };
    
    const normalizedUserCode = normalizeCode(code);
    const normalizedFixedCode = normalizeCode(this.state.fixedCode);
    const normalizedBuggyCode = normalizeCode(this.state.buggyCode);
    
    // Line-by-line analysis to approximately count fixed bugs
    const userLines = normalizedUserCode.split('\n');
    const fixedLines = normalizedFixedCode.split('\n');
    const buggyLines = normalizedBuggyCode.split('\n');
    
    // Compare each line and count differences
    const maxLines = Math.max(userLines.length, fixedLines.length, buggyLines.length);
    let matchesToFixed = 0;
    let matchesToBuggy = 0;
    
    for (let i = 0; i < maxLines; i++) {
      const userLine = userLines[i] || '';
      const fixedLine = fixedLines[i] || '';
      const buggyLine = buggyLines[i] || '';
      
      if (userLine === fixedLine && userLine !== buggyLine) {
        matchesToFixed++;
      }
      
      if (userLine === buggyLine && userLine !== fixedLine) {
        matchesToBuggy++;
      }
    }
    
    // Calculate approximate bugs fixed based on differences
    let bugsFixed = 0;
    
    // If code is identical to fixed code, all bugs are fixed
    if (normalizedUserCode === normalizedFixedCode) {
      bugsFixed = this.state.totalBugs;
    }
    // Otherwise, estimate based on line differences
    else {
      const totalPotentialFixes = fixedLines.length;
      const fixRatio = matchesToFixed / totalPotentialFixes;
      bugsFixed = Math.min(
        Math.round(fixRatio * this.state.totalBugs),
        this.state.totalBugs
      );
    }
    
    // Set success if all bugs fixed
    result.bugsFixed = bugsFixed;
    result.success = bugsFixed >= this.state.totalBugs;
    
    return result;
  }
  
  isSuccessful() {
    // Quiz is successful if all bugs are fixed
    return this.state.bugsFixed >= this.state.totalBugs;
  }
  
  getPercentComplete() {
    if (this.state.totalBugs === 0) return 0;
    return (this.state.bugsFixed / this.state.totalBugs) * 100;
  }
  
  reset() {
    super.reset();
    
    // Reset debug challenge specific state
    this.state.userCode = this.state.buggyCode;
    this.state.bugsFixed = 0;
    this.state.lastSubmission = null;
    
    return this;
  }
}

// Main Debug Challenge Quiz Component
const DebugChallengeQuiz = ({
  quizData,
  onComplete,
  juiciness = 'high' // 'low', 'medium', 'high' - visual effects level
}) => {
  // Quiz engine reference
  const quizEngineRef = useRef(null);
  const editorRef = useRef(null);
  
  // UI state
  const [quizState, setQuizState] = useState(null);
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
    easy: { timeLimit: 300, basePoints: 100, penalty: 0.05 },
    medium: { timeLimit: 240, basePoints: 150, penalty: 0.1 },
    hard: { timeLimit: 180, basePoints: 250, penalty: 0.15 }
  };
  
  // Initialize quiz engine
  useEffect(() => {
    if (!quizData) return;
    
    try {
      // Create quiz engine
      const difficulty = quizData.difficulty || 'medium';
      const quizEngine = new DebugChallengeQuizEngine({
        timeLimit: quizData.timeLimit || difficultySettings[difficulty]?.timeLimit || 240,
        basePoints: difficultySettings[difficulty]?.basePoints || 150,
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
                text: "Debug Challenge Started!",
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
              bugsFixed: result.correctAnswers,
              incorrectSubmissions: result.incorrectAnswers,
              success: result.success,
              totalBugs: quizEngine.state.totalBugs
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
            if (newStreak >= 2 && !streakStatus.active) {
              setStreakStatus({ active: true, count: newStreak });
              
              // Clear streak after animation time
              setTimeout(() => {
                setStreakStatus({ active: false, count: 0 });
              }, 3000);
            } else if (newStreak >= 2) {
              setStreakStatus(prev => ({ ...prev, count: newStreak }));
            }
            
            let comboText = "";
            if (data.combo >= 2.5) comboText = "INCREDIBLE!";
            else if (data.combo >= 2.0) comboText = "AWESOME!";
            else if (data.combo >= 1.5) comboText = "GREAT!";
            else if (newStreak >= 2) comboText = "STREAK!";
            
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
                  text: `Fixed ${data.bugsFixed} bug${data.bugsFixed > 1 ? 's' : ''}! +${data.points} points`,
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
            comboText: "TRY AGAIN!",
            pointsText: `-${data.penalty}`,
            streak: 0,
            feedbackMessages: [
              ...prev.feedbackMessages,
              {
                id: Date.now(),
                text: `No new bugs fixed. -${data.penalty} points`,
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
              bugsFixed: result.correctAnswers,
              incorrectSubmissions: result.incorrectAnswers,
              success: false,
              totalBugs: quizEngine.state.totalBugs
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
  
  // Store editor reference
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
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
      
      // Reset editor content
      if (editorRef.current) {
        editorRef.current.setValue(quizEngineRef.current.state.buggyCode);
      }
    }
  };

  // Submit code for evaluation
  const handleCodeSubmit = () => {
    if (!quizEngineRef.current || !editorRef.current || quizState.status !== 'active') return;
    
    const code = editorRef.current.getValue();
    
    // Submit the code
    quizEngineRef.current.submitCode(code);
    
    // Update state
    setQuizState({ ...quizEngineRef.current.getState() });
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

  // If no quiz state, show loading
  if (!quizState) {
    return (
      <Box textAlign="center" p={10}>
        <Text color="#666">Loading debug challenge...</Text>
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
      {streakStatus.active && streakStatus.count >= 2 && (
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
            {quizData.title || "Debug Challenge"}
          </Text>
          <Text color="#666" fontSize="xs">
            {quizData.description || "Find and fix the bugs in the code"}
          </Text>
        </VStack>
        
        <HStack spacing={4}>
          {quizState.status === 'active' && (
            <VStack spacing={1} align="end">
              <HStack>
                <Text color={quizState.timeRemaining < 30 ? "#ff6b6b" : "#ccc"} fontSize="sm">
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
                    width: `${(quizState.timeRemaining / (quizData.timeLimit || 240)) * 100}%`,
                    backgroundColor: quizState.timeRemaining < 30 ? "#ff6b6b" : "#00ff00"
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
              Start Challenge
            </Button>
          )}
          
          {(quizState.status === 'completed' || quizState.status === 'failed') && (
            <Button
              colorScheme="blue"
              size="sm"
              onClick={handleReset}
            >
              Reset Challenge
            </Button>
          )}
        </HStack>
      </HStack>
      
      {/* Bugs fixed progress bar */}
      {quizState.status === 'active' && (
        <Box bg="#111" px={4} pb={2}>
          <HStack justify="space-between" mb={1}>
            <Text color="#666" fontSize="xs">
              Bugs Fixed: {quizState.bugsFixed} of {quizState.totalBugs}
            </Text>
            <Text color="#666" fontSize="xs">
              {quizEngineRef.current?.getPercentComplete().toFixed(0) || 0}% Complete
            </Text>
          </HStack>
          <Progress 
            value={quizEngineRef.current?.getPercentComplete() || 0} 
            size="xs" 
            colorScheme="green" 
            bg="#222"
            borderRadius="full"
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
                {quizData.title || "Debug Challenge"}
              </Text>
            </MotionBox>
            
            <Text color="#ccc" fontSize="md">
              {quizData.description || "Find and fix the bugs in the code"}
            </Text>
            
            <VStack spacing={3} bg="#111" p={5} borderRadius="md" border="1px solid #222">
              <Text color="#ffd93d" fontWeight="bold">Challenge Details:</Text>
              <HStack spacing={6}>
                <VStack spacing={1}>
                  <Text fontSize="xs" color="#666">Bugs to Fix</Text>
                  <Text fontSize="lg" color="#ff6b6b">{quizState.totalBugs}</Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="xs" color="#666">Time Limit</Text>
                  <Text fontSize="lg" color="#4ecdc4">{formatTime(quizData.timeLimit || 240)}</Text>
                </VStack>
                <VStack spacing={1}>
                  <Text fontSize="xs" color="#666">Difficulty</Text>
                  <Text fontSize="lg" color="#ffd93d">{quizData.difficulty?.toUpperCase() || "MEDIUM"}</Text>
                </VStack>
              </HStack>
              
              {quizState.bugs && quizState.bugs.length > 0 && (
                <VStack spacing={2} mt={2} align="start" w="100%">
                  <Text fontSize="sm" color="#ff6b6b" fontWeight="bold">Bug Hints:</Text>
                  {quizState.bugs.map((bug, index) => (
                    <Text key={index} fontSize="sm" color="#ccc">
                      {index + 1}. {bug}
                    </Text>
                  ))}
                </VStack>
              )}
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
              Start Debugging
            </Button>
          </VStack>
        )}
        
        {quizState.status === 'active' && (
          <VStack spacing={4} align="stretch">
            {/* Bug list */}
            {quizState.bugs && quizState.bugs.length > 0 && (
              <Box
                bg="#111"
                border="1px solid #333"
                borderRadius="md"
                p={3}
              >
                <Text fontSize="sm" color="#ff6b6b" fontWeight="bold" mb={2}>
                  Bugs to fix:
                </Text>
                <VStack spacing={1} align="start">
                  {quizState.bugs.map((bug, index) => (
                    <HStack key={index} spacing={2}>
                      <Badge 
                        colorScheme={quizState.bugsFixed > index ? "green" : "gray"}
                        variant={quizState.bugsFixed > index ? "solid" : "outline"}
                      >
                        {quizState.bugsFixed > index ? "✓" : (index + 1)}
                      </Badge>
                      <Text 
                        fontSize="sm" 
                        color={quizState.bugsFixed > index ? "#00ff00" : "#ccc"}
                      >
                        {bug}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}
            
            {/* Code editor */}
            <Box
              border="1px solid #333"
              borderRadius="md"
              overflow="hidden"
              h="400px"
            >
              <Editor
                height="100%"
                defaultValue={quizState.buggyCode}
                value={quizState.userCode}
                language={quizData.language || "csharp"}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false
                }}
                onMount={handleEditorDidMount}
              />
            </Box>
            
            {/* Submit button */}
            <Box textAlign="center">
              <Button
                bg="#00ff00"
                color="#000"
                onClick={handleCodeSubmit}
                size="lg"
                isDisabled={quizState.status !== 'active'}
                _hover={{ bg: "#00cc00" }}
              >
                Submit Fixes
              </Button>
            </Box>
            
            {/* Last submission result */}
            {quizState.lastSubmission && (
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                bg={quizState.lastSubmission.bugsFixed > 0 ? "#113311" : "#331111"}
                border={`1px solid ${quizState.lastSubmission.bugsFixed > 0 ? "#00ff00" : "#ff6b6b"}`}
                borderRadius="md"
                p={3}
              >
                <Text 
                  fontSize="sm" 
                  color={quizState.lastSubmission.bugsFixed > 0 ? "#00ff00" : "#ff6b6b"} 
                  fontWeight="bold"
                >
                  {quizState.lastSubmission.bugsFixed > 0
                    ? `Great! You fixed ${quizState.lastSubmission.bugsFixed} bug${quizState.lastSubmission.bugsFixed > 1 ? 's' : ''}.`
                    : "No new bugs fixed. Keep trying!"
                  }
                </Text>
                <Text fontSize="xs" color="#ccc" mt={1}>
                  {quizState.bugsFixed >= quizState.totalBugs
                    ? "All bugs have been fixed! Well done!"
                    : `${quizState.bugsFixed} out of ${quizState.totalBugs} bugs fixed so far.`
                  }
                </Text>
              </MotionBox>
            )}
          </VStack>
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
                    Debug Complete!
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
                  <Text color="#ccc">Bugs Fixed:</Text>
                  <Text color="#4ecdc4" fontWeight="bold">{quizState.bugsFixed}/{quizState.totalBugs}</Text>
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

export default DebugChallengeQuiz;