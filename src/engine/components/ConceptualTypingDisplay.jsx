// Conceptual Typing Display with enhanced spacing and concept awareness
import React, { useRef, useEffect, useState, memo, useCallback } from 'react';
import { Box, Text as ChakraText } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedTypingBlock } from './EnhancedTypingBlock';
import { CodeConceptDetector } from '../utils/CodeConceptDetector';
import { CodeFormatter } from '../utils/CodeFormatter';
import { TerminalPanel } from '../../design/components/TerminalPanel';
import { codeSpacing } from '../../design/tokens/codeTypography';
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
    if (!containerRef.current || !engine.state) return;
    
    const currentIndex = engine.state.currentIndex;
    const text = engine.typingProcessor?.targetText || '';
    
    if (!text) return;
    
    // Calculate cursor position based on actual character positions
    let x = 0;
    let y = 0;
    let line = 0;
    let col = 0;
    
    const charWidth = fullScreen ? 22 : 18; // Character width including spacing
    const lineHeight = fullScreen ? 32 : 28; // Line height
    const containerWidth = containerRef.current.offsetWidth - 48; // Account for padding
    const maxCharsPerLine = Math.floor(containerWidth / charWidth);
    
    // Calculate position character by character
    for (let i = 0; i < currentIndex && i < text.length; i++) {
      const char = text[i];
      
      if (char === '\n') {
        // New line - reset column, increment line
        line++;
        col = 0;
        x = 0;
        y = line * lineHeight;
      } else {
        // Regular character - advance column
        col++;
        x += charWidth;
        
        // Handle line wrapping for very long lines
        if (col >= maxCharsPerLine) {
          line++;
          col = 0;
          x = 0;
          y = line * lineHeight;
        }
      }
    }
    
    // Position cursor at the end of the last typed character
    setCursorPosition({ x, y });
  }, [engine.state?.currentIndex, engine.typingProcessor?.targetText, fullScreen]);
  
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
        {/* Simple Blinking Cursor */}
        <motion.div
          animate={{
            opacity: [1, 0.3, 1],
          }}
          transition={{
            duration: 1.0,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            width: '2px', // Thin cursor line
            height: fullScreen ? '26px' : '22px',
            background: '#3182CE', // Simple solid color
            borderRadius: '1px',
            zIndex: 1000,
            pointerEvents: 'none',
            transform: 'translateX(-1px)' // Center the cursor on the character
          }}
        />
        
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
      </Box>
    </Box>
  );
});

ConceptualTypingDisplay.displayName = 'ConceptualTypingDisplay';