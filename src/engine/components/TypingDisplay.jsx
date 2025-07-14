// Typing Display Component - Renders the typing interface
import React, { useRef, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { TypingBlock } from './TypingBlock';
import { TerminalPanel } from '../../design/components/TerminalPanel';
import { colors } from '../../design/tokens/colors';
import { spacing } from '../../design/tokens/spacing';

export const TypingDisplay = ({
  text,
  engine,
  onCharacterClick
}) => {
  const containerRef = useRef(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  
  // Update cursor position
  useEffect(() => {
    if (containerRef.current && engine.state) {
      const charWidth = 20;
      const lineHeight = 32;
      const charsPerLine = Math.floor(containerRef.current.offsetWidth / charWidth);
      
      const line = Math.floor(engine.state.currentIndex / charsPerLine);
      const col = engine.state.currentIndex % charsPerLine;
      
      setCursorPosition({
        x: col * charWidth + 8,
        y: line * lineHeight + 4
      });
    }
  }, [engine.state?.currentIndex]);
  
  const renderCharacter = (char, index) => {
    const status = engine.getCharacterStatus(index);
    const speed = engine.getCharacterSpeed(index);
    const upgrade = engine.getCharacterUpgrade(index);
    
    return (
      <TypingBlock
        key={index}
        char={char}
        status={status}
        speed={speed}
        upgrade={upgrade}
        combo={engine.state?.combo || 1}
        anticipationLevel={engine.state?.anticipationLevel || 1}
        onClick={() => onCharacterClick && onCharacterClick(index)}
      />
    );
  };
  
  return (
    <TerminalPanel title="CODE TYPING INTERFACE" variant="primary">
      <Box
        ref={containerRef}
        bg={colors.terminal.bg}
        border={`1px solid ${colors.terminal.border}`}
        p={spacing[4]}
        minH="200px"
        maxH="400px"
        overflowY="auto"
        position="relative"
      >
        {/* Typing Cursor */}
        {engine.state?.isActive && !engine.state?.isComplete && (
          <Box
            position="absolute"
            left={`${cursorPosition.x}px`}
            top={`${cursorPosition.y}px`}
            width="3px"
            height="24px"
            bg={colors.primary[500]}
            borderRadius="2px"
            zIndex={1000}
            animation="blink 1s infinite"
            sx={{
              '@keyframes blink': {
                '0%, 50%': { opacity: 1 },
                '51%, 100%': { opacity: 0.3 }
              }
            }}
          />
        )}
        
        {/* Character Blocks */}
        <Box
          lineHeight="36px"
          wordWrap="break-word"
          whiteSpace="pre-wrap"
        >
          {text.split('').map((char, index) => renderCharacter(char, index))}
        </Box>
      </Box>
    </TerminalPanel>
  );
};