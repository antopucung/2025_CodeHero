import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { CodeQuizEngine, createCodeBlocksFromString } from './CodeQuizEngine';

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
              totalBlocks: quizEngine.state.solution.length
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
              totalBlocks: quizEngine.state.solution.length
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
  }, [code, splitType, difficulty, timeLimit, onComplete]);

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
        totalBlocks: quizState?.solution?.length || 0
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
    const dropPoint = info?.point ? { x: info.point.x, y: info.point.y } : null; // Use clientX/Y from pointer info
    console.log("Drag ended. Drop point:", dropPoint);
    
    if (dropPoint) {
      // Check each dropzone to see if the point is within its bounds
      let droppedInZone = false;
      
      // Add visual feedback when dropped
      setScreenFlash({ active: true, type: 'info', intensity: 0.3 });
      setTimeout(() => {
        setScreenFlash({ active: false, type: 'info', intensity: 0 }); // Reset flash
      }, 200);
      
      dropZoneRefs.current.forEach((ref, index) => {
        if (!ref || !ref.current) {
          // This drop zone might not be rendered yet or is empty
          // console.log("Missing ref for dropzone", index);
          return;
        }
        
        const rect = ref.current.getBoundingClientRect();
        console.log(`Checking dropzone ${index}:`, rect);
        
        // Check if drop point is within this dropzone
        if (
          // Check if the drop point is within the horizontal bounds of the drop zone
          dropPoint.x >= rect.left && 
          dropPoint.x <= rect.right && 
          // Check if the drop point is within the vertical bounds of the drop zone
          // We give a bit of leeway vertically to make dropping easier
          dropPoint.y >= rect.top && 
          dropPoint.y <= rect.bottom
        ) {
          console.log("Dropped in zone", index);
          // Place the block at this index
          const result = quizEngineRef.current.placeBlock(activeDragBlock.id, index);
          console.log("Place block result:", result);
          setQuizState({ ...quizEngineRef.current.getState() }); // Force re-render with updated state
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
    dropZoneRefs,
    handleStart,
    handleReset,
    handlePause,
    handleResume,
    handleAbort,
    handleDragStart,
    handleDragEnd,
    checkPlacement
  };
};