// Game Stats Component - Clean stats display
import React from 'react';
import { Box, Text, HStack, VStack, Progress } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { TerminalPanel } from '../../design/components/TerminalPanel';
import { colors, getComboColor } from '../../design/tokens/colors';
import { typography } from '../../design/tokens/typography';
import { spacing } from '../../design/tokens/spacing';
import { createPulseAnimation } from '../../design/tokens/animations';

const MotionBox = motion(Box);
const MotionText = motion(Text);

export const GameStats = ({ engine }) => {
  const state = engine.state;
  
  if (!state) return null;
  
  const xpForNextLevel = state.level * 100;
  const xpProgress = (state.xp / xpForNextLevel) * 100;
  
  return (
    <TerminalPanel title="PLAYER STATISTICS" variant="primary">
      <VStack spacing={spacing[3]} align="stretch">
        {/* Level and XP */}
        <HStack justify="space-between" align="center">
          <MotionText
            fontSize={typography.sizes.base}
            color={colors.primary[500]}
            fontFamily={typography.fonts.mono}
            fontWeight={typography.weights.bold}
            {...createPulseAnimation(1.5)}
          >
            LEVEL {state.level || 1}
          </MotionText>
          <Text fontSize={typography.sizes.xs} color={colors.terminal.textSecondary}>
            {state.xp || 0}/{xpForNextLevel} XP
          </Text>
        </HStack>
        
        <Progress
          value={xpProgress}
          bg={colors.terminal.bg}
          borderRadius="0"
          h="8px"
          sx={{
            '& > div': {
              bg: `linear-gradient(90deg, ${colors.primary[500]}, ${colors.primary[400]})`,
              boxShadow: `0 0 10px ${colors.primary[500]}`
            }
          }}
        />
        
        {/* Live Stats */}
        <HStack justify="space-between" fontSize={typography.sizes.xs}>
          <VStack spacing={0} align="start">
            <Text color={colors.terminal.textSecondary}>WPM</Text>
            <MotionText
              fontSize={typography.sizes.base}
              fontWeight={typography.weights.bold}
              color={state.wpm > 50 ? colors.performance.perfect.primary : 
                     state.wpm > 30 ? colors.performance.best.primary :
                     state.wpm > 20 ? colors.performance.good.primary :
                     colors.performance.lame.primary}
              {...(state.wpm > 30 ? createPulseAnimation(1.2) : {})}
            >
              {state.wpm || 0}
            </MotionText>
          </VStack>
          
          <VStack spacing={0} align="center">
            <Text color={colors.terminal.textSecondary}>ACCURACY</Text>
            <MotionText
              fontSize={typography.sizes.base}
              fontWeight={typography.weights.bold}
              color={state.accuracy === 100 ? colors.performance.perfect.primary :
                     state.accuracy > 95 ? colors.performance.best.primary :
                     state.accuracy > 85 ? colors.performance.good.primary :
                     colors.performance.error.primary}
              {...(state.accuracy === 100 ? createPulseAnimation(1.5) : {})}
            >
              {state.accuracy || 100}%
            </MotionText>
          </VStack>
          
          <VStack spacing={0} align="center">
            <Text color={colors.terminal.textSecondary}>COMBO</Text>
            <MotionText
              fontSize={typography.sizes.base}
              fontWeight={typography.weights.bold}
              color={getComboColor(state.combo || 1)}
              {...(state.combo > 5 ? createPulseAnimation(1 + (state.combo / 20)) : {})}
            >
              x{state.combo || 1}
            </MotionText>
          </VStack>
          
          <VStack spacing={0} align="end">
            <Text color={colors.terminal.textSecondary}>SCORE</Text>
            <MotionText
              fontSize={typography.sizes.base}
              fontWeight={typography.weights.bold}
              color={colors.combo.perfect}
              {...(state.totalScore > 0 ? createPulseAnimation(1.2) : {})}
            >
              {state.totalScore || 0}
            </MotionText>
          </VStack>
        </HStack>
        
        {/* Streak Indicator */}
        {state.streak > 5 && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              boxShadow: [
                `0 0 10px ${colors.combo.god}`,
                `0 0 20px ${colors.combo.god}`,
                `0 0 10px ${colors.combo.god}`
              ]
            }}
            transition={{ 
              boxShadow: { repeat: Infinity, duration: 1.5 }
            }}
            bg={colors.combo.god}
            color="#000"
            p={spacing[2]}
            textAlign="center"
            fontWeight={typography.weights.bold}
            fontSize={typography.sizes.xs}
          >
            🔥 {state.streak} STREAK! 🔥
          </MotionBox>
        )}
        
        {/* Perfect Streak */}
        {state.perfectStreak > 0 && (
          <MotionBox
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: [1, 1.05, 1],
              boxShadow: [
                `0 0 15px ${colors.performance.perfect.primary}`,
                `0 0 25px ${colors.performance.perfect.primary}`,
                `0 0 15px ${colors.performance.perfect.primary}`
              ]
            }}
            transition={{ 
              scale: { repeat: Infinity, duration: 1 },
              boxShadow: { repeat: Infinity, duration: 1.2 }
            }}
            bg={colors.performance.perfect.primary}
            color="#fff"
            p={spacing[2]}
            textAlign="center"
            fontWeight={typography.weights.bold}
            fontSize={typography.sizes.xs}
          >
            ⚡ {state.perfectStreak} PERFECT! ⚡
          </MotionBox>
        )}
      </VStack>
    </TerminalPanel>
  );
};