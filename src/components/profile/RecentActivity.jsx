import React from 'react';
import {
  Card,
  Stack,
  SectionTitle,
  BodyText,
  Caption
} from '../../design/components/StandardizedComponents';

export function RecentActivity() {
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
    <Card animated>
      <SectionTitle>
        📈 Recent Activity
      </SectionTitle>
      <Stack>
        {activities.map((activity, index) => (
          <Stack
            key={index}
            horizontal
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '12px',
              borderRadius: '8px'
            }}
          >
            <BodyText fontSize="lg">{activity.icon}</BodyText>
            <Stack flex={1}>
              <BodyText>{activity.title}</BodyText>
              <Caption>{activity.time}</Caption>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}