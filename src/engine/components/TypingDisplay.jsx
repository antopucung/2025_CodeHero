import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypingBlock } from './TypingBlock';
import { TerminalPanel } from '../../design/components/TerminalPanel';
import { 
  FloatingScore, 
  CharacterExplosion, 
  ComboBurstEffect, 
  AnticipationCursor,
  BackgroundWaveEffect,
  ProgressiveBackgroundEffect,
  ScreenFlashEffect,
  PatternCelebration
} from './TypingEffects';
import { colors } from '../../design/tokens/colors';
import { spacing } from '../../design/tokens/spacing';

export const TypingDisplay = memo(({
  text,
  engine,
  onCharacterClick
}) => {
  const containerRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [errorPositions, setErrorPositions] = useState(new Set());
  const [screenFlash, setScreenFlash] = useState({ active: false, type: 'success', intensity: 1 });
  const [patternCelebrations, setPatternCelebrations] = useState([]);
  const [activeEffects, setActiveEffects] = useState({
    floatingScores: [],
    explosions: [],
    comboBursts: []
  });
  
  // Optimized cursor position calculation
  const updateCursorPosition = useCallback(() => {
    if (!containerRef.current || !engine.state) return;
    
    const currentIndex = engine.state.currentIndex;
    const charWidth = 17; // width + margin
    const lineHeight = 22; // height + margin
    const containerWidth = containerRef.current.offsetWidth;
    const charsPerLine = Math.floor(containerWidth / charWidth);
    
    const line = Math.floor(currentIndex / charsPerLine);
    const col = currentIndex % charsPerLine;
    
    setCursorPosition({
      x: col * charWidth + 1,
      y: line * lineHeight + 1
    });
  }, [engine.state?.currentIndex]);
  
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

    // Handle screen flash effects for major events
    if (engine.state.combo >= 50 && engine.state.combo % 10 === 0) {
      setScreenFlash({ active: true, type: 'combo', intensity: Math.min(engine.state.combo / 50, 2) });
      setTimeout(() => setScreenFlash({ active: false, type: 'success', intensity: 1 }), 300);
    }
    
    if (engine.state.perfectStreak >= 15) {
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
    if (engine.state.floatingScores && engine.state.floatingScores.length > 0) {
      const newScores = engine.state.floatingScores.filter(
        score => !activeEffects.floatingScores.some(active => active.id === score.id)
      );
      
      if (newScores.length > 0) {
        setActiveEffects(prev => ({
          ...prev,
          floatingScores: [...prev.floatingScores, ...newScores]
        }));
      }
    }

    // Add explosions
    if (engine.state.explosions && engine.state.explosions.length > 0) {
      const newExplosions = engine.state.explosions.filter(
        explosion => !activeEffects.explosions.some(active => active.id === explosion.id)
      );
      
      if (newExplosions.length > 0) {
        setActiveEffects(prev => ({
          ...prev,
          explosions: [...prev.explosions, ...newExplosions]
        }));
      }
    }

    // Add combo bursts for high combos
    if (engine.state.combo >= 10 && engine.state.combo % 5 === 0) {
      const burstId = `combo-${engine.state.combo}-${Date.now()}`;
      if (!activeEffects.comboBursts.some(burst => burst.combo === engine.state.combo)) {
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
  }, [engine.state, activeEffects, cursorPosition, patternCelebrations]);

  // Cleanup expired effects
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setActiveEffects(prev => ({
        floatingScores: prev.floatingScores.filter(effect => now - effect.id < 3000),
        explosions: prev.explosions.filter(effect => now - effect.id < 2000),
        comboBursts: prev.comboBursts.filter(effect => now - effect.id < 2000),
        characterUpgrades: prev.characterUpgrades.filter(effect => now - effect.createdAt < 3000),
        achievements: prev.achievements.filter(effect => now - effect.createdAt < 6000),
        streakEffects: prev.streakEffects.filter(effect => now - effect.createdAt < 8000),
        levelUps: prev.levelUps.filter(effect => now - effect.createdAt < 6000)
      }));
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
      />
    );
  }, [engine, errorPositions, onCharacterClick]);
  
  return (
    <TerminalPanel title="ADDICTIVE TYPING INTERFACE" variant="primary">
      <Box
        ref={containerRef}
        bg={colors.terminal.bg}
        border={`1px solid ${colors.terminal.border}`}
        p={spacing[3]}
        minH="200px"
        maxH="400px"
        overflowY="auto"
        position="relative"
        fontFamily="monospace"
        fontSize="12px"
        lineHeight="22px"
      >
        {/* Progressive Background Effect with Intensity Scaling */}
        <ProgressiveBackgroundEffect
          isActive={engine.state?.isActive && !engine.state?.isComplete}
          combo={engine.state?.combo || 1}
          perfectStreak={engine.state?.perfectStreak || 0}
          typingSpeed={engine.state?.typingSpeed || 'lame'}
          anticipationLevel={engine.state?.anticipationLevel || 1}
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
          anticipationLevel={engine.state?.anticipationLevel || 1}
          combo={engine.state?.combo || 1}
        />
        
        {/* Character Blocks */}
        <Box
          style={{
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            lineHeight: '22px'
          }}
        >
          {text.split('').map(renderCharacter)}
        </Box>

        {/* Floating Scores */}
        <AnimatePresence>
          {activeEffects.floatingScores.map((score) => (
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
            />
          ))}
        </AnimatePresence>

        {/* Character Explosions */}
        <AnimatePresence>
          {activeEffects.explosions.map((explosion) => (
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
            />
          ))}
        </AnimatePresence>

        {/* Combo Burst Effects */}
        <AnimatePresence>
          {activeEffects.comboBursts.map((burst) => (
            <ComboBurstEffect
              key={burst.id}
              isActive={true}
              combo={burst.combo}
              x={burst.x}
              y={burst.y}
              patterns={burst.patterns}
            />
          ))}
        </AnimatePresence>

        {/* Character Upgrade Effects */}
        <AnimatePresence>
          {activeEffects.characterUpgrades.map((upgrade) => (
            <CharacterUpgradeEffect
              key={upgrade.id}
              char={upgrade.char}
              index={upgrade.index}
              upgrade={upgrade.upgrade}
              onComplete={() => removeEffect('characterUpgrades', upgrade.id)}
            />
          ))}
        </AnimatePresence>

        {/* Achievement Unlocks */}
        <AnimatePresence>
          {activeEffects.achievements.map((achievement) => (
            <AchievementUnlock
              key={achievement.id}
              achievement={achievement.type}
              onComplete={() => removeEffect('achievements', achievement.id)}
            />
          ))}
        </AnimatePresence>

        {/* Streak Multiplier Effects */}
        <AnimatePresence>
          {activeEffects.streakEffects.map((streak) => (
            <StreakMultiplierEffect
              key={streak.id}
              streak={streak.streak}
              multiplier={streak.multiplier}
              isActive={true}
            />
          ))}
        </AnimatePresence>

        {/* Level Up Transformations */}
        <AnimatePresence>
          {activeEffects.levelUps.map((levelUp) => (
            <LevelUpTransformation
              key={levelUp.id}
              newLevel={levelUp.newLevel}
              onComplete={() => removeEffect('levelUps', levelUp.id)}
            />
          ))}
        </AnimatePresence>
        
        {/* Pattern Celebrations */}
        <AnimatePresence>
          {patternCelebrations.map((pattern) => (
            <PatternCelebration
              key={pattern.id}
              pattern={pattern}
              onComplete={() => removePatternCelebration(pattern.id)}
            />
          ))}
        </AnimatePresence>
      </Box>
    </TerminalPanel>
  );
});

TypingDisplay.displayName = 'TypingDisplay';