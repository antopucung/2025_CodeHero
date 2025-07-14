import React from 'react';
import { VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Card } from '../../design/components/Card';
import { Text, Heading } from '../../design/components/Typography';
import { designSystem } from '../../design/system/DesignSystem';

const MotionBox = motion.div;

export const AchievementsSection = ({ achievements }) => {
  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>
      <Heading level={3} size="lg" color="accent" mb={designSystem.spacing[4]}>
        🏆 Achievements
      </Heading>
      <VStack spacing={designSystem.spacing[2]} align="stretch">
        {achievements.length > 0 ? (
          achievements.map((achievement, index) => (
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
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: designSystem.spacing[3] 
              }}>
                <Text size="lg">🏆</Text>
                <Text color="brand" fontWeight={designSystem.typography.weights.bold}>
                  {achievement.replace('_', ' ').toUpperCase()}
                </Text>
              </div>
            </MotionBox>
          ))
        ) : (
          <Text color="muted" textAlign="center">
            Complete challenges to unlock achievements!
          </Text>
        )}
      </VStack>
    </Card>
  );
};