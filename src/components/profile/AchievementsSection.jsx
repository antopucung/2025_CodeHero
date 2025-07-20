import React from 'react';
import { VStack, HStack, Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Card } from '../../design/components/Card';
import { CustomText, Heading } from '../../design/components/Typography';
import { designSystem } from '../../design/system/DesignSystem';

const MotionBox = motion.div;

export const AchievementsSection = ({ achievements }) => {
  // Ensure achievements is always an array
  const safeAchievements = Array.isArray(achievements) ? achievements : [];
  
  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>  
      <Heading level={3} size="lg" color="accent" mb={designSystem.spacing[4]}>
        🏆 Achievements
      </Heading>
      <VStack spacing={designSystem.spacing[3]} align="stretch">
        {safeAchievements.length > 0 ? (
          safeAchievements.map((achievement, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: designSystem.colors.backgrounds.secondary,
                padding: designSystem.spacing[3],
                borderRadius: designSystem.radii.md,
                border: `1px solid ${designSystem.colors.borders.default}`
              }}
            >
              <HStack spacing={designSystem.spacing[3]} px={designSystem.spacing[1]}>
                <CustomText size="lg" lineHeight="1">🏆</CustomText>
                <CustomText color="brand" fontWeight={designSystem.typography.weights.bold}>
                  {typeof achievement === 'string' 
                    ? achievement.replace('_', ' ').toUpperCase()
                    : (achievement?.title || 'Achievement').toUpperCase()
                  }
                </CustomText>
              </HStack>
            </MotionBox>
          ))
        ) : (
          <Box p={designSystem.spacing[4]} textAlign="center">
            <CustomText color="muted">
              Complete challenges to unlock achievements!
            </CustomText>
          </Box>
        )}
      </VStack>
    </Card>
  );
};