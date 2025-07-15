import React from 'react';
import { VStack, HStack } from "@chakra-ui/react";
import { Card } from '../../design/components/Card';
import { CustomText, Heading } from '../../design/components/Typography';
import { designSystem } from '../../design/system/DesignSystem';

export const RecentActivity = () => {
  const activities = [
    {
      icon: '🎯',
      title: 'Completed typing challenge',
      time: '2 hours ago'
    },
    {
      icon: '🏆',
      title: 'Unlocked achievement: Speed Demon',
      time: '1 day ago'
    },
    {
      icon: '📚',
      title: 'Started new course: Advanced React',
      time: '3 days ago'
    }
  ];

  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>
      <Heading level={3} size="lg" color="accent" mb={designSystem.spacing[4]}>
        📈 Recent Activity
      </Heading>
      <VStack spacing={designSystem.spacing[4]} align="stretch">
        {activities.map((activity, index) => (
          <HStack 
            key={index}
            spacing={designSystem.spacing[4]} 
            p={designSystem.spacing[3]} 
            px={designSystem.spacing[4]}
            bg={designSystem.colors.backgrounds.secondary} 
            borderRadius={designSystem.radii.md}
          >
            <CustomText fontSize={designSystem.typography.sizes.lg} lineHeight="1">{activity.icon}</CustomText>
            <VStack align="start" spacing={0} flex={1}>
              <CustomText size="sm" color="secondary">{activity.title}</CustomText>
              <CustomText size="xs" color="muted" mt={designSystem.spacing[1]}>{activity.time}</CustomText>
            </VStack>
          </HStack>
        ))}
      </VStack>
    </Card>
  );
};