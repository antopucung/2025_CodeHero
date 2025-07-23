import React from 'react';
import { Box, VStack, HStack, Progress } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { designSystem } from '../../../design/system/DesignSystem';
import { CustomText } from '../../../design/components/Typography';
import { Card } from '../../../design/components/Card';

const MotionBox = motion(Box);

export const CreatorEarningsCard = ({ 
  earnings = 0, 
  assetCount = 0, 
  publishedCount = 0,
  detailed = false 
}) => {
  const publishedPercentage = assetCount > 0 ? (publishedCount / assetCount) * 100 : 0;
  const nextMilestone = getNextMilestone(earnings);
  const milestoneProgress = getMilestoneProgress(earnings, nextMilestone);
  
  function getNextMilestone(earnings) {
    const milestones = [10, 50, 100, 250, 500, 1000, 2500, 5000];
    return milestones.find(milestone => milestone > earnings) || milestones[milestones.length - 1] * 2;
  }
  
  function getMilestoneProgress(earnings, nextMilestone) {
    if (earnings === 0) return 0;
    const prevMilestone = getPrevMilestone(nextMilestone);
    return ((earnings - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
  }
  
  function getPrevMilestone(nextMilestone) {
    const milestones = [0, 10, 50, 100, 250, 500, 1000, 2500, 5000];
    const index = milestones.findIndex(m => m >= nextMilestone);
    return index > 0 ? milestones[index - 1] : 0;
  }
  
  return (
    <Card variant="elevated" p={detailed ? 6 : 4}>
      <VStack spacing={detailed ? 6 : 4} align="stretch">
        {/* Main Earnings Display */}
        <MotionBox
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          textAlign="center"
          bg={`linear-gradient(135deg, ${designSystem.colors.brand.primary}11, ${designSystem.colors.brand.accent}11)`}
          p={detailed ? 6 : 4}
          borderRadius="lg"
          border={`1px solid ${designSystem.colors.brand.primary}33`}
        >
          <VStack spacing={2}>
            <Box fontSize={detailed ? "3xl" : "2xl"}>💰</Box>
            <CustomText 
              size={detailed ? "3xl" : "2xl"} 
              color="brand" 
              fontWeight="bold"
            >
              ${earnings.toFixed(2)}
            </CustomText>
            <CustomText size="sm" color="muted">
              Total Earnings
            </CustomText>
          </VStack>
        </MotionBox>
        
        {/* Stats Grid */}
        <VStack spacing={3}>
          <HStack justify="space-between" w="100%">
            <VStack align="start" spacing={0}>
              <CustomText size="lg" color="secondary" fontWeight="bold">
                {assetCount}
              </CustomText>
              <CustomText size="xs" color="muted">Total Assets</CustomText>
            </VStack>
            
            <VStack align="center" spacing={0}>
              <CustomText size="lg" color="accent" fontWeight="bold">
                {publishedCount}
              </CustomText>
              <CustomText size="xs" color="muted">Published</CustomText>
            </VStack>
            
            <VStack align="end" spacing={0}>
              <CustomText size="lg" color="error" fontWeight="bold">
                {publishedPercentage.toFixed(0)}%
              </CustomText>
              <CustomText size="xs" color="muted">Published Rate</CustomText>
            </VStack>
          </HStack>
          
          {/* Published Progress */}
          <VStack spacing={1} w="100%">
            <HStack justify="space-between" w="100%">
              <CustomText size="xs" color="muted">Publication Progress</CustomText>
              <CustomText size="xs" color="accent">
                {publishedCount}/{assetCount}
              </CustomText>
            </HStack>
            <Progress
              value={publishedPercentage}
              size="sm"
              colorScheme="green"
              bg={designSystem.colors.backgrounds.surface}
              borderRadius="full"
              w="100%"
            />
          </VStack>
        </VStack>
        
        {detailed && (
          <>
            {/* Milestone Progress */}
            <VStack spacing={3} align="stretch">
              <CustomText size="md" fontWeight="bold" color="secondary">
                🎯 Next Milestone
              </CustomText>
              
              <VStack spacing={1} w="100%">
                <HStack justify="space-between" w="100%">
                  <CustomText size="sm" color="muted">
                    Progress to ${nextMilestone}
                  </CustomText>
                  <CustomText size="sm" color="brand" fontWeight="bold">
                    ${(nextMilestone - earnings).toFixed(2)} to go
                  </CustomText>
                </HStack>
                <Progress
                  value={milestoneProgress}
                  size="md"
                  colorScheme="yellow"
                  bg={designSystem.colors.backgrounds.surface}
                  borderRadius="full"
                  w="100%"
                />
              </VStack>
            </VStack>
            
            {/* Earning Tips */}
            <VStack align="start" spacing={3}>
              <CustomText size="md" fontWeight="bold" color="accent">
                💡 Boost Your Earnings
              </CustomText>
              <VStack align="start" spacing={2} fontSize="sm" color={designSystem.colors.text.secondary}>
                <CustomText>• Premium assets typically earn 5-10x more than free ones</CustomText>
                <CustomText>• Bundle related assets for higher perceived value</CustomText>
                <CustomText>• Seasonal and trending topics perform better</CustomText>
                <CustomText>• High-quality thumbnails increase click rates</CustomText>
                {earnings < 10 && (
                  <CustomText fontWeight="bold" color="brand">
                    • Upload your first premium asset to start earning!
                  </CustomText>
                )}
              </VStack>
            </VStack>
          </>
        )}
        
        {/* Quick Actions */}
        {!detailed && assetCount === 0 && (
          <VStack spacing={2} textAlign="center" py={2}>
            <CustomText size="sm" color="muted">
              Upload your first asset to start earning
            </CustomText>
            <Box fontSize="lg">🚀</Box>
          </VStack>
        )}
      </VStack>
    </Card>
  );
};