import { useState, useEffect, useRef } from 'react';
import { CodeQuizEngine, createCodeBlocksFromString } from '../components/learning/CodeQuizEngine';

/**
 * Custom hook to handle all quiz engine state and logic
 */
export const useCodeQuizEngine = ({
  code,
  splitType = "line",
  difficulty = "medium",
  timeLimit = 120,
  juiciness = "high",
  onComplete
}) => {
  // Quiz engine reference
  const quizEngineRef = useRef(null);
  
  // UI state
  const [quizState, setQuizState] = useState(null);
  const [activeDragBlock, setActiveDragBlock] = useState(null);
  const [isDraggingBlock, setIsDraggingBlock] = useState(false);
  const [gameEffects, setGameEffects] = useState({
    combo: 1,
    lastAction: null,
    comboText: "",
    pointsText: "",
    streak: 0,
    feedbackMessages: []
  });
  
  // Visual effects state
  const [errorPositions, setErrorPositions] = useState(new Set());
  const [screenFlash, setScreenFlash] = useState({ active: false, type: 'success', intensity: 1 });
  const [streakStatus, setStreakStatus] = useState({ active: false, count: 0 });
  const [patternCelebrations, setPatternCelebrations] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  
  // Refs for drop zones
  const dropZoneRefs = useRef([]);
  
  // Configure difficulty settings
  const difficultySettings = {
    easy: { timeLimit: 180, basePoints: 50, penalty: 0.05 },
    medium: { timeLimit: 120, basePoints: 100, penalty: 0.1 },
    hard: { timeLimit: 90, basePoints: 150, penalty: 0.15 }
  };
  
  // Initialize quiz engine
  useEffect(() => {
    if (!code) {
      console.error("No code provided to useCodeQuizEngine");
      return;
    }
    
    try {
      // Create code blocks
      const codeBlocks = createCodeBlocksFromString(code, splitType);
      console.log("Created code blocks:", codeBlocks.length);
      
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
          console.log("Quiz started", state.status);
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
          console.log("Quiz completed", result);
          if (onComplete) {
            onComplete({
              score: result.score,
              maxCombo: result.maxCombo,
              timeElapsed: result.timeElapsed,
              correctPlacements: result.correctPlacements,
              incorrectPlacements: result.incorrectPlacements,
              success: true,
              totalBlocks: quizEngine.state.solution.length
            });
          }
        })
        .on('correct', (data) => {
          console.log("Correct placement", data);
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
          console.log("Incorrect placement", data);
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
          console.log("Quiz timeout", result);
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
              totalBlocks: quizEngine.state.solution.length
            });
          }
        })
        .on('tick', (data) => {
          setQuizState(prevState => {
            // Only update if state exists and status is active
            if (!prevState) return { ...quizEngine.getState() };
            return {
              ...prevState,
              timeRemaining: data.timeRemaining
            };
          });
        });
      
      quizEngineRef.current = quizEngine;
      setQuizState(quizEngine.getState());
      
      // Initialize drop zone refs
      if (quizEngine.state.solution) {
        // Create a ref for each potential drop position (solution length + 1)
        const numDropZones = quizEngine.state.solution.length + 1;
        dropZoneRefs.current = Array(numDropZones).fill().map(() => React.createRef());
      }
    } catch (error) {
      console.error('Error initializing quiz engine:', error);
    }
    
    return () => {
      // Clean up
      if (quizEngineRef.current) {
        quizEngineRef.current.destroy();
      }
    };
  }, [code, splitType, difficulty, timeLimit, onComplete]);

  // Start the quiz
  const handleStart = () => {
    console.log("handleStart called", quizEngineRef.current?.state?.status);
    if (quizEngineRef.current) {
      setIsPaused(false);
      quizEngineRef.current.start();
      // Force update of state to ensure component re-renders
      setQuizState({...quizEngineRef.current.getState()});
    } else {
      console.error("Quiz engine not initialized");
    }
  };

  // Reset the quiz
  const handleReset = () => {
    console.log("handleReset called");
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
    } else {
      console.error("Quiz engine not initialized");
    }
  };

  // Pause the quiz
  const handlePause = () => {
    console.log("handlePause called");
    if (quizEngineRef.current && quizState && quizState.status === 'active') {
      quizEngineRef.current.pause();
      setQuizState({ ...quizEngineRef.current.getState() });
      setIsPaused(true);
    } else {
      console.error("Cannot pause: quiz is not active", quizState?.status);
    }
  };

  // Resume the quiz
  const handleResume = () => {
    console.log("handleResume called");
    if (quizEngineRef.current && quizState && quizState.status === 'paused') {
      quizEngineRef.current.resume();
      setQuizState({ ...quizEngineRef.current.getState() });
      setIsPaused(false);
    } else {
      console.error("Cannot resume: quiz is not paused", quizState?.status);
    }
  };

  // Close/Abort the quiz
  const handleAbort = () => {
    console.log("handleAbort called");
    // If onClose prop exists (from parent QuizPopup), call it
    if (onComplete) {
      // Call onComplete with a failed result
      onComplete({
        score: quizState?.score || 0,
        maxCombo: quizState?.maxComboReached || 1,
        correctPlacements: quizState?.correctPlacements || 0,
        success: false,
        totalBlocks: quizState?.solution?.length || 0
      });
    }
  };

  // Handle drag start
  const handleBlockDragStart = (block) => {
    console.log("Block drag start", block.id);
    setActiveDragBlock(block);
    setIsDraggingBlock(true);
  };

  // Handle drag end for a block
  const handleBlockDragEnd = () => {
    console.log("Block drag end");
    setActiveDragBlock(null);
    setIsDraggingBlock(false);
  };

  // Handle drop on a specific drop zone
  const handleDropOnZone = (dropZoneIndex) => {
    console.log("Drop on zone", dropZoneIndex, activeDragBlock?.id);
    if (!activeDragBlock || !quizEngineRef.current) {
      console.warn("Cannot drop: no active block or quiz engine");
      return;
    }
    
    const result = quizEngineRef.current.placeBlock(activeDragBlock.id, dropZoneIndex);
    console.log("Place block result", result);
    
    // Force re-render with updated state
    setQuizState({ ...quizEngineRef.current.getState() }); 

    // Trigger a small screen flash for feedback
    setScreenFlash({
      active: true,
      type: result ? 'success' : 'error', // Flash green for correct, red for incorrect
      intensity: 0.3
    });

    setTimeout(() => {
      setScreenFlash({ active: false, type: 'info', intensity: 0 });
    }, 300);
  };
  
  // Check placement of a block
  const checkPlacement = (block, index) => {
    return quizEngineRef.current?.checkPlacement(block, index) || false;
  };

  return {
    quizState,
    gameEffects,
    screenFlash,
    streakStatus,
    patternCelebrations,
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
    handleDropOnZone,
    checkPlacement
  };
};