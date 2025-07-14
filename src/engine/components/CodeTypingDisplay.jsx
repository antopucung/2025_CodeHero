// Code-aware Typing Display with proper IDE-like formatting
import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { Box, Text as ChakraText } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypingBlock } from './TypingBlock';
import { CodeFormatter } from '../utils/CodeFormatter';
import { TerminalPanel } from '../../design/components/TerminalPanel';
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

export const CodeTypingDisplay = memo(({
  text,
  engine,
  onCharacterClick,
  fullScreen = false
}) => {
  const containerRef = useRef(null);
  const [codeFormatter] = useState(() => new CodeFormatter());
  const [structuredCode, setStructuredCode] = useState([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [errorPositions, setErrorPositions] = useState(new Set());
  const [screenFlash, setScreenFlash] = useState({ active: false, type: 'success', intensity: 1 });
  const [patternCelebrations, setPatternCelebrations] = useState([]);
  const [activeEffects, setActiveEffects] = useState({
    floatingScores: [],
    explosions: [],
    comboBursts: []
  });
  const [performanceMode, setPerformanceMode] = useState('high');
  const [effectScale, setEffectScale] = useState(1);
  
  // Parse code structure when text changes
  useEffect(() => {
    if (text) {
      const parsed = codeFormatter.parseCodeStructure(text);
      const formatted = codeFormatter.formatForDisplay(parsed);
      setStructuredCode(formatted);
    }
  }, [text, codeFormatter]);
  
  // Update cursor position with code-aware layout
  const updateCursorPosition = useCallback(() => {
    if (!containerRef.current || !engine.state || !structuredCode.length) return;
    
    const currentIndex = engine.state.currentIndex;
    const containerWidth = containerRef.current.offsetWidth;
    const layoutInfo = codeFormatter.getLayoutInfo(structuredCode, containerWidth);
    
    if (layoutInfo[currentIndex]) {
      setCursorPosition({
        x: layoutInfo[currentIndex].x,
        y: layoutInfo[currentIndex].y
      });
    }
  }, [engine.state?.currentIndex, structuredCode, codeFormatter]);
  
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

    // Handle pattern celebrations
    if (engine.state.patternMatches && engine.state.patternMatches.length > 0) {
      const newPatterns = engine.state.patternMatches.filter(
        pattern => !patternCelebrations.some(active => active.id === pattern.id)
      );
      
      if (newPatterns.length > 0) {
        setPatternCelebrations(prev => [...prev, ...newPatterns]);
      }
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
  }, [engine.state, activeEffects, patternCelebrations, effectScale, performanceMode]);

  // Cleanup expired effects
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setActiveEffects(prev => ({
        floatingScores: prev.floatingScores.filter(effect => now - effect.id < 3000),
        explosions: prev.explosions.filter(effect => now - effect.id < 2000),
        comboBursts: prev.comboBursts.filter(effect => now - effect.id < 2000)
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
  
  const renderCodeLine = useCallback((lineItems, lineIndex) => {
    return (
      <div
        key={lineIndex}
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'baseline',
          minHeight: fullScreen ? '28px' : '24px',
          marginBottom: '2px',
          paddingLeft: `${lineItems[0]?.indentLevel * (fullScreen ? 16 : 12)}px`
        }}
      >
        {lineItems.map((item, itemIndex) => {
          const globalIndex = structuredCode.findIndex(code => 
            code.lineIndex === lineIndex && code.charIndex === item.charIndex
          );
          
          if (globalIndex === -1) return null;
          
          const status = engine.getCharacterStatus(globalIndex);
          const speed = engine.getCharacterSpeed(globalIndex);
          const upgrade = engine.getCharacterUpgrade(globalIndex);
          const showError = errorPositions.has(globalIndex);
          
          return (
            <TypingBlock
              key={`${lineIndex}-${itemIndex}`}
              char={item.char}
              status={status}
              speed={speed}
              upgrade={upgrade}
              combo={engine.state?.combo || 1}
              anticipationLevel={engine.state?.anticipationLevel || 1}
              showError={showError}
              onClick={() => onCharacterClick && onCharacterClick(globalIndex)}
              fullScreen={fullScreen}
              syntaxType={item.type}
              indentLevel={item.indentLevel}
            />
          );
        })}
      </div>
    );
  }, [structuredCode, engine, errorPositions, onCharacterClick, fullScreen]);
  
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
        │ CODE TYPING INTERFACE
      </ChakraText>
      
      <Box
        ref={containerRef}
        bg={colorPsychology.environment.background}
        flex={1}
        overflow="auto"
        p={3}
        position="relative"
        fontFamily="monospace"
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

        {/* Dynamic Cursor */}
        <AnticipationCursor
          isVisible={engine.state?.isActive && !engine.state?.isComplete}
          position={cursorPosition}
          typingSpeed={engine.state?.typingSpeed || 'lame'}
          anticipationLevel={(engine.state?.anticipationLevel || 1) * effectScale}
          combo={engine.state?.combo || 1}
          fullScreen={fullScreen}
        />
        
        {/* Code Lines with Proper Layout */}
        <Box
          style={{
            fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
            fontSize: fullScreen ? '14px' : '12px',
            lineHeight: fullScreen ? '28px' : '24px',
            whiteSpace: 'pre'
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

CodeTypingDisplay.displayName = 'CodeTypingDisplay';