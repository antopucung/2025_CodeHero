// Pattern Bonus Display Component - Shows bonus pattern achievements
import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import { spacing } from '../tokens/spacing';

const PatternBonus = ({ pattern, onComplete }) => {
  const getPatternInfo = (type) => {
    const patterns = {
      perfect_streak: { icon: '⚡', name: 'LIGHTNING FAST' },
      function_declaration: { icon: '🔧', name: 'CODE WIZARD' },
      advanced_syntax: { icon: '🎓', name: 'SYNTAX MASTER' },
      module_syntax: { icon: '📦', name: 'MODULE EXPERT' },
      bracket_combo: { icon: '🎯', name: 'BRACKET MASTER' },
      speed_consistency: { icon: '🚀', name: 'UNSTOPPABLE' },
      line_completion: { icon: '✅', name: 'CLEAN CODE' },
      string_mastery: { icon: '📝', name: 'STRING NINJA' },
      arrow_function: { icon: '🏹', name: 'ARROW MASTER' },
      combo_milestone: { icon: '🔥', name: 'ON FIRE' },
      flawless_execution: { icon: '💎', name: 'FLAWLESS' }
    };
    
    return patterns[type] || { icon: '⭐', name: 'AMAZING' };
  };
  
  const patternInfo = getPatternInfo(pattern.type);
  
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ 
        scale: [0, 1.3, 1],
        opacity: [0, 1, 1, 0],
        y: [50, 0, -20, -100]
      }}
      transition={{ 
        duration: 2.5,
        times: [0, 0.2, 0.8, 1]
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'fixed',
        top: '30%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1001,
        background: `linear-gradient(45deg, ${pattern.color}, ${pattern.color}cc)`,
        padding: '15px 25px',
        borderRadius: '12px',
        color: '#fff',
        fontFamily: typography.fonts.mono,
        fontWeight: typography.weights.bold,
        fontSize: typography.sizes.base,
        textAlign: 'center',
        border: `2px solid ${pattern.color}`,
        boxShadow: `0 0 25px ${pattern.color}`,
        minWidth: '200px'
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 0.6,
          repeat: 2
        }}
      >
        <Text fontSize={typography.sizes.xl} mb={spacing[1]}>
          {patternInfo.icon}
        </Text>
        <Text fontSize={typography.sizes.sm} mb={spacing[1]}>
          {patternInfo.name}
        </Text>
        <Text fontSize={typography.sizes.xs} color="#ffff00">
          +{pattern.bonus} BONUS POINTS!
        </Text>
      </motion.div>
    </motion.div>
  );
};

export const PatternBonusDisplay = ({ patterns, onPatternComplete }) => {
  return (
    <AnimatePresence>
      {patterns.map((pattern, index) => (
        <PatternBonus
          key={pattern.id}
          pattern={pattern}
          onComplete={() => onPatternComplete && onPatternComplete(pattern.id)}
        />
      ))}
    </AnimatePresence>
  );
};