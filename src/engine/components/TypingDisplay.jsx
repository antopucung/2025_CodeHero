import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { Box, Text as ChakraText } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypingBlock } from './TypingBlock';
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
import { colors } from '../../design/tokens/colors';
import { spacing } from '../../design/tokens/spacing';

export const TypingDisplay = memo(({
  text,
  engine,
  onCharacterClick,
  fullScreen = false
}) => {
  const containerRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [errorPositions, setErrorPositions] = useState(new Set());
  const [screenFlash, setScreenFlash] = useState({ active: false, type: 'success', intensity: 1 });
  const [patternCelebrations, setPatternCelebrations] = useState([]);
  const [activeEffects, setActiveEffects] = useState({
    floatingScores: [],
    explosions: [],
    comboBursts: [],
    characterUpgrades: [],
    achievements: [],
    streakEffects: [],
    levelUps: []
  });
  const [performanceMode, setPerformanceMode] = useState('high');
  const [effectScale, setEffectScale] = useState(1);
  
  // Optimized cursor position calculation
  const updateCursorPosition = useCallback(() => {
    if (!containerRef.current || !engine.state) return;
    
    const currentIndex = engine.state.currentIndex;
    const charWidth = fullScreen ? 24 : 17; // width + margin
    const lineHeight = fullScreen ? 32 : 22; // height + margin
    const containerWidth = containerRef.current.offsetWidth;
    const charsPerLine = Math.floor(containerWidth / charWidth);
    
    const line = Math.floor(currentIndex / charsPerLine);
    const col = currentIndex % charsPerLine;
    
    setCursorPosition({
      x: col * charWidth + 1,
      y: line * lineHeight + 1
    });
  }, [engine.state?.currentIndex, fullScreen]);
  
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
  
  // Track error positions for X indicators
  useEffect(() => {
    if (engine.state?.errors > 0) {
      const currentIndex = engine.state.currentIndex;
      if (engine.getCharacterStatus(currentIndex - 1) === 'incorrect') {
        setErrorPositions(prev => new Set([...prev, currentIndex - 1]));
        
        // Remove error indicator after 1 second
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

  // Handle visual effects from engine state
  useEffect(() => {
    if (!engine.state) return;
    
    // Get performance settings
    const perfStats = engine.getOptimizationSettings();
    if (perfStats?.performance) {
      setPerformanceMode(perfStats.performance.mode);
      setEffectScale(perfStats.performance.effectScale || 1);
    }

    // Handle screen flash effects for major events
    if (engine.state.combo >= 50 && engine.state.combo % 10 === 0 && effectScale > 0.5) {
      setScreenFlash({ active: true, type: 'combo', intensity: Math.min(engine.state.combo / 50, 2) });
      setTimeout(() => setScreenFlash({ active: false, type: 'success', intensity: 1 }), 300);
    }
    
    if (engine.state.perfectStreak >= 15 && effectScale > 0.3) {
      setScreenFlash({ active: true, type: 'perfect', intensity: 1.5 });
      setTimeout(() => setScreenFlash({ active: false, type: 'success', intensity: 1 }), 400);
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
      
      // Limit concurrent floating scores based on performance
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
      
      // Limit concurrent explosions
      const maxExplosions = performanceMode === 'low' ? 2 : performanceMode === 'medium' ? 4 : 6;
      if (newExplosions.length > 0 && activeEffects.explosions.length < maxExplosions) {
        setActiveEffects(prev => ({
          ...prev,
          explosions: [...prev.explosions, ...newExplosions.slice(0, maxExplosions - prev.explosions.length)]
        }));
      }
    }

    // Add combo bursts for high combos
    if (engine.state.combo >= 10 && engine.state.combo % 5 === 0 && effectScale > 0.4) {
      const burstId = `combo-${engine.state.combo}-${Date.now()}`;
      const maxBursts = performanceMode === 'low' ? 1 : performanceMode === 'medium' ? 2 : 4;
      if (!activeEffects.comboBursts.some(burst => burst.combo === engine.state.combo) && 
          activeEffects.comboBursts.length < maxBursts) {
        setActiveEffects(prev => ({
          ...prev,
          comboBursts: [...prev.comboBursts, {
            id: burstId,
            combo: engine.state.combo,
            x: cursorPosition.x,
            y: cursorPosition.y,
            patterns: engine.state.patternMatches || []
          }]
        }));
      }
    }
  }, [engine.state, activeEffects, cursorPosition, patternCelebrations, effectScale, performanceMode]);

  // Cleanup expired effects
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setActiveEffects(prev => ({
        floatingScores: prev.floatingScores.filter(effect => now - effect.id < 3000),
        explosions: prev.explosions.filter(effect => now - effect.id < (performanceMode === 'low' ? 1000 : 2000)),
        comboBursts: prev.comboBursts.filter(effect => now - effect.id < (performanceMode === 'low' ? 1000 : 2000)),
        characterUpgrades: prev.characterUpgrades.filter(effect => now - (effect.createdAt || effect.id) < (performanceMode === 'low' ? 2000 : 3000)),
        achievements: prev.achievements.filter(effect => now - (effect.createdAt || effect.id) < (performanceMode === 'low' ? 4000 : 6000)),
        streakEffects: prev.streakEffects.filter(effect => now - (effect.createdAt || effect.id) < (performanceMode === 'low' ? 5000 : 8000)),
        levelUps: prev.levelUps.filter(effect => now - (effect.createdAt || effect.id) < (performanceMode === 'low' ? 4000 : 6000))
      }));
      
      // More aggressive cleanup for pattern celebrations in low performance
      if (performanceMode === 'low') {
        setPatternCelebrations(prev => prev.filter(pattern => now - pattern.id < 2000));
      }
    }, 1000);
    
    // Cleanup pattern celebrations
    setPatternCelebrations(prev => prev.filter(pattern => now - pattern.id < 4000));

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
  
  const renderCharacter = useCallback((char, index) => {
    const status = engine.getCharacterStatus(index);
    const speed = engine.getCharacterSpeed(index);
    const upgrade = engine.getCharacterUpgrade(index);
    const showError = errorPositions.has(index);
    
    return (
      <TypingBlock
        key={index}
        char={char}
        status={status}
        speed={speed}
        upgrade={upgrade}
        combo={engine.state?.combo || 1}
        anticipationLevel={engine.state?.anticipationLevel || 1}
        showError={showError}
        onClick={() => onCharacterClick && onCharacterClick(index)}
        fullScreen={fullScreen}
      />
    );
  }, [engine, errorPositions, onCharacterClick]);
  
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
        │ TYPING INTERFACE
      </ChakraText>
      
      <Box
        ref={containerRef}
        bg={colors.terminal.bg}
        flex={1}
        overflow="auto"
        p={3}
        position="relative"
        fontFamily="monospace"
        fontSize="14px"
        lineHeight="28px"
      >
        {/* Progressive Background Effect with Intensity Scaling */}
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

        {/* Dynamic Anticipation Cursor */}
        <AnticipationCursor
          isVisible={engine.state?.isActive && !engine.state?.isComplete}
          position={cursorPosition}
          typingSpeed={engine.state?.typingSpeed || 'lame'}
          anticipationLevel={(engine.state?.anticipationLevel || 1) * effectScale}
          combo={engine.state?.combo || 1}
          fullScreen={fullScreen}
        />
        
        {/* Character Blocks */}
        <Box
          style={{
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            lineHeight: fullScreen ? '32px' : '22px'
          }}
        >
          {text.split('').map(renderCharacter)}
        </Box>

        {/* Floating Scores */}
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
              fullScreen={fullScreen}
            />
          ))}
        </AnimatePresence>

        {/* Character Explosions */}
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
              fullScreen={fullScreen}
            />
          ))}
        </AnimatePresence>

        {/* Combo Burst Effects */}
        <AnimatePresence>
          {activeEffects.comboBursts.slice(0, performanceMode === 'low' ? 1 : 4).map((burst) => (
            <ComboBurstEffect
              key={burst.id}
              isActive={true}
              combo={burst.combo}
              x={burst.x}
              y={burst.y}
              patterns={burst.patterns}
              fullScreen={fullScreen}
            />
          ))}
        </AnimatePresence>

        {/* Character Upgrade Effects */}
        <AnimatePresence>
          {performanceMode !== 'low' && 
           activeEffects.characterUpgrades.slice(0, 3).map((upgrade) => (
            <CharacterUpgradeEffect
              key={upgrade.id}
              char={upgrade.char}
              index={upgrade.index}
              upgrade={upgrade.upgrade}
              onComplete={() => removeEffect('characterUpgrades', upgrade.id)}
              fullScreen={fullScreen}
            />
          ))}
        </AnimatePresence>

        {/* Achievement Unlocks */}
        <AnimatePresence>
          {performanceMode !== 'low' && 
           activeEffects.achievements.slice(0, 1).map((achievement) => (
            <AchievementUnlock
              key={achievement.id}
              achievement={achievement.type}
              onComplete={() => removeEffect('achievements', achievement.id)}
              fullScreen={fullScreen}
            />
          ))}
        </AnimatePresence>

        {/* Streak Multiplier Effects */}
        <AnimatePresence>
          {performanceMode !== 'low' && 
           activeEffects.streakEffects.slice(0, 1).map((streak) => (
            <StreakMultiplierEffect
              key={streak.id}
              streak={streak.streak}
              multiplier={streak.multiplier}
              isActive={true}
              fullScreen={fullScreen}
            />
          ))}
        </AnimatePresence>

        {/* Level Up Transformations */}
        <AnimatePresence>
          {performanceMode !== 'low' && 
           activeEffects.levelUps.slice(0, 1).map((levelUp) => (
            <LevelUpTransformation
              key={levelUp.id}
              newLevel={levelUp.newLevel}
              onComplete={() => removeEffect('levelUps', levelUp.id)}
              fullScreen={fullScreen}
            />
          ))}
        </AnimatePresence>
        
        {/* Pattern Celebrations */}
        <AnimatePresence>
          {patternCelebrations.slice(0, performanceMode === 'low' ? 1 : 3).map((pattern) => (
            <PatternCelebration
              key={pattern.id}
              pattern={pattern}
              onComplete={() => removePatternCelebration(pattern.id)}
              fullScreen={fullScreen}
            />
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
});

TypingDisplay.displayName = 'TypingDisplay';