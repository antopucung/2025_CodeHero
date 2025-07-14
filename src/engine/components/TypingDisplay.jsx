// Enhanced Typing Display Component - Optimized for responsiveness
import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { TypingBlock } from './TypingBlock';
import { TerminalPanel } from '../../design/components/TerminalPanel';
import { colors } from '../../design/tokens/colors';
import { spacing } from '../../design/tokens/spacing';

// Optimized cursor component
const TypingCursor = memo(({ isVisible, position }) => {
  if (!isVisible) return null;
  
  return (
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
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '2px',
        height: '20px',
        background: colors.primary[500],
        borderRadius: '1px',
        zIndex: 1000,
        pointerEvents: 'none',
        boxShadow: `0 0 8px ${colors.primary[500]}`
      }}
    />
  );
});

TypingCursor.displayName = 'TypingCursor';

export const TypingDisplay = memo(({
  text,
  engine,
  onCharacterClick
}) => {
  const containerRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [errorPositions, setErrorPositions] = useState(new Set());
  
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
    <TerminalPanel title="CODE TYPING INTERFACE" variant="primary">
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
        {/* Optimized Typing Cursor */}
        <TypingCursor
          isVisible={engine.state?.isActive && !engine.state?.isComplete}
          position={cursorPosition}
        />
        
        {/* Character Blocks - Optimized rendering */}
        <Box
          style={{
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            lineHeight: '22px'
          }}
        >
          {text.split('').map(renderCharacter)}
        </Box>
      </Box>
    </TerminalPanel>
  );
});

TypingDisplay.displayName = 'TypingDisplay';