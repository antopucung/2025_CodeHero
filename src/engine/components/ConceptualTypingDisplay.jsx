// Conceptual Typing Display with enhanced spacing and concept awareness
import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { Box, Text as ChakraText } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedTypingBlock } from './EnhancedTypingBlock';
import { CodeConceptDetector } from '../utils/CodeConceptDetector';
import { CodeFormatter } from '../utils/CodeFormatter';
import { TerminalPanel } from '../../design/components/TerminalPanel';
import { codeSpacing } from '../../design/tokens/codeTypography';
import { 
  FloatingScore, 
  CharacterExplosion, 
  ComboBurstEffect, 
  AnticipationCursor,
  BackgroundWaveEffect,
  ScreenFlashEffect,
  PatternCelebration
} from '../effects';
import { colors, colorPsychology } from '../../design/tokens/colors';

export const ConceptualTypingDisplay = memo(({
  text,
  engine,
  onCharacterClick,
  fullScreen = false
}) => {
  const containerRef = useRef(null);
  const [codeFormatter] = useState(() => new CodeFormatter());
  const [conceptDetector] = useState(() => new CodeConceptDetector());
  const [structuredCode, setStructuredCode] = useState([]);
  const [detectedConcepts, setDetectedConcepts] = useState([]);
  const [conceptMap, setConceptMap] = useState(new Map());
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [errorPositions, setErrorPositions] = useState(new Set());
  const [screenFlash, setScreenFlash] = useState({ active: false, type: 'success', intensity: 1 });
  const [patternCelebrations, setPatternCelebrations] = useState([]);
  const [activeEffects, setActiveEffects] = useState({
    floatingScores: [],
    explosions: [],
    comboBursts: [],
    conceptCompletions: []
  });
  const [performanceMode, setPerformanceMode] = useState('high');
  const [effectScale, setEffectScale] = useState(1);
  
  // Parse code structure and detect concepts
  useEffect(() => {
    if (text) {
      // Parse code structure
      const parsed = codeFormatter.parseCodeStructure(text);
      const formatted = codeFormatter.formatForDisplay(parsed);
      setStructuredCode(formatted);
      
      // Detect programming concepts
      const concepts = conceptDetector.detectConcepts(text);
      const designPatterns = conceptDetector.detectDesignPatterns(concepts);
      const allConcepts = [...concepts, ...designPatterns];
      setDetectedConcepts(allConcepts);
      
      // Create concept map for quick lookup
      const map = new Map();
      allConcepts.forEach(concept => {
        for (let i = concept.start; i < concept.end; i++) {
          map.set(i, concept);
        }
      });
      setConceptMap(map);
    }
  }, [text, codeFormatter, conceptDetector]);
  
  // Fixed cursor position calculation
  const updateCursorPosition = useCallback(() => {
    if (!containerRef.current || !engine.state || !structuredCode.length) return;
    
    const currentIndex = engine.state.currentIndex;
    
    // Calculate accurate cursor position
    let x = 0;
    let y = 0;
    let currentLine = 0;
    let currentCol = 0;
    
    for (let i = 0; i < Math.min(currentIndex, structuredCode.length); i++) {
      const item = structuredCode[i];
      
      if (item.isNewline) {
        currentLine++;
        currentCol = 0;
        x = (item.indentLevel || 0) * (fullScreen ? 16 : 12);
        y = currentLine * (fullScreen ? 32 : 28);
      } else {
        // Standard character width with spacing
        const charWidth = fullScreen ? 24 : 20; // width + spacing
        x += charWidth;
        currentCol++;
      }
    }
    
    setCursorPosition({ x, y });
  }, [engine.state?.currentIndex, structuredCode, fullScreen]);
  
  // Update cursor position when index changes
  useEffect(() => {
    updateCursorPosition();
  }, [updateCursorPosition]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateCursorPosition();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCursorPosition]);
  
  // Track error positions
  useEffect(() => {
    if (engine.state?.errors > 0) {
      const currentIndex = engine.state.currentIndex;
      if (engine.getCharacterStatus(currentIndex - 1) === 'incorrect') {
        setErrorPositions(prev => new Set([...prev, currentIndex - 1]));
        
        setTimeout(() => {
          setErrorPositions(prev => {
            const newSet = new Set(prev);
            newSet.delete(currentIndex - 1);
            return newSet;
          });
        }, 1000);
      }
    }
  }, [engine.state?.errors, engine.state?.currentIndex]);
  
  // Update cursor position when index changes
  useEffect(() => {
    updateCursorPosition();
  }, [updateCursorPosition]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      updateCursorPosition();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCursorPosition]);
  
  // Track error positions
  useEffect(() => {
    if (engine.state?.errors > 0) {
      const currentIndex = engine.state.currentIndex;
      if (engine.getCharacterStatus(currentIndex - 1) === 'incorrect') {
        setErrorPositions(prev => new Set([...prev, currentIndex - 1]));
        
        setTimeout(() => {
          setErrorPositions(prev => {
            const newSet = new Set(prev);
            newSet.delete(currentIndex - 1);
            return newSet;
          });
        }, 1000);
      }
    }
  }, [engine.state?.errors, engine.state?.currentIndex]);

  // Handle concept completion celebrations
  useEffect(() => {
    if (!engine.state) return;
    
    const currentIndex = engine.state.currentIndex;
    const concept = conceptMap.get(currentIndex - 1);
    
    if (concept && engine.getCharacterStatus(currentIndex - 1) === 'correct') {
      // Check if concept is completed
      const conceptEnd = concept.end;
      let conceptCompleted = true;
      
      for (let i = concept.start; i < conceptEnd; i++) {
        if (engine.getCharacterStatus(i) !== 'correct') {
          conceptCompleted = false;
          break;
        }
      }
      
      if (conceptCompleted) {
        // Add concept completion effect
        const completionEffect = {
          id: Date.now() + Math.random(),
          concept,
          x: cursorPosition.x,
          y: cursorPosition.y,
          score: concept.score,
          createdAt: Date.now()
        };
        
        setActiveEffects(prev => ({
          ...prev,
          conceptCompletions: [...prev.conceptCompletions, completionEffect]
        }));
        
        // Add pattern celebration if it's a significant concept
        if (concept.score >= 25) {
          const celebration = {
            id: Date.now() + Math.random(),
            type: concept.type,
            name: concept.name,
            bonus: concept.score,
            color: getConceptColor(concept.type),
            description: concept.description
          };
          
          setPatternCelebrations(prev => [...prev, celebration]);
        }
      }
    }
  }, [engine.state?.currentIndex, conceptMap, cursorPosition]);

  // Get concept color
  const getConceptColor = (conceptType) => {
    const colors = {
      function: '#805AD5',
      class: '#D69E2E',
      keyword: '#E53E3E',
      string: '#38A169',
      number: '#DD6B20',
      operator: '#319795',
      bracket: '#718096',
      variable: '#4299E1',
      method: '#9F7AEA',
      controlStructure: '#F56565',
      designPattern: '#FF6B6B'
    };
    return colors[conceptType] || '#4299E1';
  };

  // Handle visual effects
  useEffect(() => {
    if (!engine.state) return;
    
    const perfStats = engine.getOptimizationSettings();
    if (perfStats?.performance) {
      setPerformanceMode(perfStats.performance.mode);
      setEffectScale(perfStats.performance.effectScale || 1);
    }

    // Handle screen flash effects
    if (engine.state.combo >= 50 && engine.state.combo % 10 === 0 && effectScale > 0.5) {
      setScreenFlash({ active: true, type: 'combo', intensity: Math.min(engine.state.combo / 50, 2) });
      setTimeout(() => setScreenFlash({ active: false, type: 'success', intensity: 1 }), 300);
    }

    // Add floating scores
    if (engine.state.floatingScores && engine.state.floatingScores.length > 0 && effectScale > 0.2) {
      const newScores = engine.state.floatingScores.filter(
        score => !activeEffects.floatingScores.some(active => active.id === score.id)
      );
      
      const maxScores = performanceMode === 'low' ? 3 : performanceMode === 'medium' ? 5 : 8;
      if (newScores.length > 0 && activeEffects.floatingScores.length < maxScores) {
        setActiveEffects(prev => ({
          ...prev,
          floatingScores: [...prev.floatingScores, ...newScores.slice(0, maxScores - prev.floatingScores.length)]
        }));
      }
    }

    // Add explosions
    if (engine.state.explosions && engine.state.explosions.length > 0 && effectScale > 0.2) {
      const newExplosions = engine.state.explosions.filter(
        explosion => !activeEffects.explosions.some(active => active.id === explosion.id)
      );
      
      const maxExplosions = performanceMode === 'low' ? 2 : performanceMode === 'medium' ? 4 : 6;
      if (newExplosions.length > 0 && activeEffects.explosions.length < maxExplosions) {
        setActiveEffects(prev => ({
          ...prev,
          explosions: [...prev.explosions, ...newExplosions.slice(0, maxExplosions - prev.explosions.length)]
        }));
      }
    }
  }, [engine.state, activeEffects, effectScale, performanceMode]);

  // Cleanup expired effects
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setActiveEffects(prev => ({
        floatingScores: prev.floatingScores.filter(effect => now - effect.id < 3000),
        explosions: prev.explosions.filter(effect => now - effect.id < 2000),
        comboBursts: prev.comboBursts.filter(effect => now - effect.id < 2000),
        conceptCompletions: prev.conceptCompletions.filter(effect => now - effect.createdAt < 2500)
      }));
      
      setPatternCelebrations(prev => prev.filter(pattern => now - pattern.id < 4000));
    }, 1000);

    return () => clearInterval(cleanup);
  }, []);

  const removeEffect = useCallback((type, id) => {
    setActiveEffects(prev => ({
      ...prev,
      [type]: prev[type].filter(effect => effect.id !== id)
    }));
  }, []);
  
  const removePatternCelebration = useCallback((patternId) => {
    setPatternCelebrations(prev => prev.filter(pattern => pattern.id !== patternId));
  }, []);
  
  // Render code line with enhanced spacing
  const renderCodeLine = useCallback((lineItems, lineIndex) => {
    return (
      <div
        key={lineIndex}
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'baseline',
          minHeight: fullScreen ? '32px' : '28px',
          marginBottom: codeSpacing.line.normal,
          paddingLeft: `${lineItems[0]?.indentLevel * (fullScreen ? 16 : 12)}px`,
          position: 'relative'
        }}
      >
        {/* Line number indicator */}
        <div
          style={{
            position: 'absolute',
            left: '-40px',
            top: '0',
            width: '30px',
            fontSize: fullScreen ? '10px' : '9px',
            color: colors.terminal.textMuted,
            textAlign: 'right',
            opacity: 0.5,
            fontFamily: "'Fira Code', monospace"
          }}
        >
          {lineIndex + 1}
        </div>
        
        {lineItems.map((item, itemIndex) => {
          const globalIndex = structuredCode.findIndex(code => 
            code.lineIndex === lineIndex && code.charIndex === item.charIndex
          );
          
          if (globalIndex === -1) return null;
          
          const status = engine.getCharacterStatus(globalIndex);
          const speed = engine.getCharacterSpeed(globalIndex);
          const upgrade = engine.getCharacterUpgrade(globalIndex);
          const showError = errorPositions.has(globalIndex);
          const concept = conceptMap.get(globalIndex);
          
          return (
            <EnhancedTypingBlock
              key={`${lineIndex}-${itemIndex}`}
              char={item.char}
              status={status}
              speed={speed}
              concept={concept}
              upgrade={upgrade}
              combo={engine.state?.combo || 1}
              anticipationLevel={engine.state?.anticipationLevel || 1}
              showError={showError}
              onClick={() => onCharacterClick && onCharacterClick(globalIndex)}
              fullScreen={fullScreen}
              spacing={concept?.type === 'operator' ? 'wide' : 'normal'}
            />
          );
        })}
      </div>
    );
  }, [structuredCode, engine, errorPositions, conceptMap, onCharacterClick, fullScreen]);
  
  // Group structured code by lines
  const codeLines = structuredCode.reduce((lines, item) => {
    if (!lines[item.lineIndex]) {
      lines[item.lineIndex] = [];
    }
    if (!item.isNewline) {
      lines[item.lineIndex].push(item);
    }
    return lines;
  }, {});
  
  return (
    <Box
      w="100%"
      h="100%"
      bg={colors.terminal.surface}
      border={`1px solid ${colors.terminal.border}`}
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <ChakraText fontSize="xs" color={colors.terminal.textSecondary} p={2} borderBottom="1px solid #333">
        │ CONCEPTUAL CODE TYPING INTERFACE
      </ChakraText>
      
      <Box
        ref={containerRef}
        bg={colorPsychology.environment.background}
        flex={1}
        overflow="auto"
        p={4}
        pl={12} // Extra padding for line numbers
        position="relative"
        fontFamily="'Fira Code', 'Consolas', 'Monaco', monospace"
        fontSize="14px"
        style={{
          background: `linear-gradient(135deg, ${colorPsychology.environment.background} 0%, ${colorPsychology.environment.surface} 100%)`,
          transition: 'background 0.3s ease'
        }}
      >
        {/* Background Effects */}
        <BackgroundWaveEffect
          isActive={engine.state?.isActive && !engine.state?.isComplete && effectScale > 0.3}
          combo={engine.state?.combo || 1}
          typingSpeed={engine.state?.typingSpeed || 'lame'}
          anticipationLevel={(engine.state?.anticipationLevel || 1) * effectScale}
          intensity={effectScale}
        />
        
        {/* Screen Flash Effects */}
        <ScreenFlashEffect 
          isActive={screenFlash.active}
          intensity={screenFlash.intensity}
          type={screenFlash.type}
        />

        {/* Enhanced Cursor */}
        <motion.div
          animate={{
            opacity: [1, 0.3, 1],
            scaleY: [1, 1.1, 1]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            width: '2px',
            height: fullScreen ? '26px' : '22px',
            background: '#3182CE',
            borderRadius: '1px',
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 0 8px #3182CE'
          }}
        />
        
        {/* Backup cursor for debugging */}
        {process.env.NODE_ENV === 'development' && (
          <div
            style={{
              position: 'absolute',
              left: `${cursorPosition.x - 1}px`,
              top: `${cursorPosition.y - 1}px`,
              width: '4px',
              height: fullScreen ? '28px' : '24px',
              border: '1px solid red',
              pointerEvents: 'none',
              zIndex: 999
            }}
          />
        )}
        
        {/* Code Lines with Enhanced Layout */}
        <Box
          style={{
            fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
            fontSize: fullScreen ? '14px' : '13px',
            lineHeight: fullScreen ? '32px' : '28px',
            whiteSpace: 'pre',
            position: 'relative'
          }}
        >
          {Object.entries(codeLines).map(([lineIndex, lineItems]) => 
            renderCodeLine(lineItems, parseInt(lineIndex))
          )}
        </Box>

        {/* Visual Effects */}
        <AnimatePresence>
          {activeEffects.floatingScores.slice(0, performanceMode === 'low' ? 3 : 8).map((score) => (
            <FloatingScore
              key={score.id}
              score={score.score}
              x={score.x}
              y={score.y}
              color={score.color}
              combo={score.combo}
              speed={score.speed}
              patterns={score.patterns}
              onComplete={() => removeEffect('floatingScores', score.id)}
              reduced={performanceMode === 'low'}
            />
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {activeEffects.explosions.slice(0, performanceMode === 'low' ? 2 : 6).map((explosion) => (
            <CharacterExplosion
              key={explosion.id}
              char={explosion.char}
              x={explosion.x}
              y={explosion.y}
              isCorrect={explosion.isCorrect}
              combo={explosion.combo}
              speed={explosion.speed}
              patterns={explosion.patterns}
              onComplete={() => removeEffect('explosions', explosion.id)}
              reduced={performanceMode === 'low'}
            />
          ))}
        </AnimatePresence>

        {/* Concept Completion Effects */}
        <AnimatePresence>
          {activeEffects.conceptCompletions.map((completion) => (
            <motion.div
              key={completion.id}
              initial={{ scale: 0, opacity: 0, y: 0 }}
              animate={{ 
                scale: [0, 2, 1.5, 0],
                opacity: [0, 1, 1, 0],
                y: [0, -60, -80, -120]
              }}
              transition={{ duration: 2 }}
              onAnimationComplete={() => removeEffect('conceptCompletions', completion.id)}
              style={{
                position: 'absolute',
                left: completion.x,
                top: completion.y,
                zIndex: 1002,
                pointerEvents: 'none',
                color: getConceptColor(completion.concept.type),
                fontWeight: 'bold',
                fontSize: fullScreen ? '16px' : '14px',
                textShadow: `0 0 10px ${getConceptColor(completion.concept.type)}`
              }}
            >
              {completion.concept.type.toUpperCase()} +{completion.score}
            </motion.div>
          ))}
        </AnimatePresence>
        
        <AnimatePresence>
          {patternCelebrations.slice(0, performanceMode === 'low' ? 1 : 3).map((pattern) => (
            <PatternCelebration
              key={pattern.id}
              patterns={[pattern]}
              onComplete={() => removePatternCelebration(pattern.id)}
            />
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
});

ConceptualTypingDisplay.displayName = 'ConceptualTypingDisplay';