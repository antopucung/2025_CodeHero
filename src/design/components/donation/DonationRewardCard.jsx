import React from 'react';
import { Box, VStack, HStack, Progress } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { designSystem } from '../../system/DesignSystem';
import { CustomText } from '../Typography';

const MotionBox = motion(Box);

export const DonationRewardCard = ({ 
  reward,
  daysRemaining,
  tier
}) => {
  // Calculate percentage of time remaining
  const totalDays = tier?.durationDays || 30;
  const percentRemaining = Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100));
  
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        bg={designSystem.colors.backgrounds.secondary}
        borderRadius={designSystem.radii.md}
        border="1px solid"
        borderColor={designSystem.colors.borders.default}
        overflow="hidden"
        p={designSystem.spacing[4]}
      >
        <VStack align="stretch" spacing={designSystem.spacing[3]}>
          <HStack justify="space-between">
            <HStack>
              <Box fontSize="xl">{tier?.icon || '🎁'}</Box>
              <CustomText 
                size="md" 
                color={tier?.color || designSystem.colors.brand.primary} 
                fontWeight={designSystem.typography.weights.bold}
              >
                {tier?.name || 'Reward'} Tier
              </CustomText>
            </HStack>
            
            <CustomText size="sm" color={designSystem.colors.text.muted}>
              ${reward?.donation?.amount || 0}
            </CustomText>
          </HStack>
          
          {/* Expiration progress */}
          <VStack spacing={designSystem.spacing[1]}>
            <HStack w="100%" justify="space-between">
              <CustomText size="xs" color={designSystem.colors.text.muted}>
                Time remaining
              </CustomText>
              <CustomText 
                size="xs" 
                color={daysRemaining < 7 ? designSystem.colors.status.warning : designSystem.colors.text.muted}
                fontWeight={daysRemaining < 7 ? designSystem.typography.weights.bold : designSystem.typography.weights.normal}
              >
                {daysRemaining} days
              </CustomText>
            </HStack>
            
            <Progress 
              value={percentRemaining} 
              size="sm"
              colorScheme={daysRemaining < 7 ? "yellow" : "green"}
              bg={designSystem.colors.backgrounds.surface}
              borderRadius={designSystem.radii.base}
              w="100%"
            />
          </VStack>
          
          {/* Active benefits */}
          <Box mt={designSystem.spacing[2]}>
            <CustomText size="sm" color={designSystem.colors.text.muted} mb={designSystem.spacing[2]}>
              Active Benefits:
            </CustomText>
            
            <VStack align="start" spacing={designSystem.spacing[2]}>
              {tier?.rewards?.map((reward, index) => (
                <HStack key={index} align="start" spacing={designSystem.spacing[2]}>
                  <Box color={tier?.color || designSystem.colors.brand.primary}>✓</Box>
                  <CustomText size="sm" color={designSystem.colors.text.secondary}>
                    {reward}
                  </CustomText>
                </HStack>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </MotionBox>
  );
};