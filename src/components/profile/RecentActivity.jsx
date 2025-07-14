import React from 'react';
import { VStack, HStack } from "@chakra-ui/react";
import { Card } from '../../design/components/Card';
import { Text, Heading } from '../../design/components/Typography';
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
      <VStack spacing={designSystem.spacing[3]} align="stretch">
        {activities.map((activity, index) => (
          <HStack 
            key={index}
            spacing={designSystem.spacing[3]} 
            p={designSystem.spacing[3]} 
            bg={designSystem.colors.backgrounds.secondary} 
            borderRadius={designSystem.radii.md}
          >
            <Text>{activity.icon}</Text>
            <VStack align="start" spacing={0} flex={1}>
              <Text size="sm" color="secondary">{activity.title}</Text>
              <Text size="xs" color="muted">{activity.time}</Text>
            </VStack>
          </HStack>
        ))}
      </VStack>
    </Card>
  );
};