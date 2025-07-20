import React from 'react';
import {
  Card,
  Stack,
  Grid,
  SectionTitle,
  BodyText,
  AchievementCard
} from '../../design/components/StandardizedComponents';

export function AchievementsSection({ achievements }) {
  // Ensure achievements is always an array
  const safeAchievements = Array.isArray(achievements) ? achievements : [];
  
  return (
    <Card animated>
      <SectionTitle>
        🏆 Achievements
      </SectionTitle>
      
        {safeAchievements.length > 0 ? (
          <Grid columns={{ base: '1fr', md: 'repeat(2, 1fr)' }}>
            {safeAchievements.map((achievement, index) => (
              <AchievementCard
                key={index}
                achievement={{
                  title: typeof achievement === 'string' 
                    ? achievement.replace('_', ' ').toUpperCase()
                    : (achievement?.title || 'Achievement').toUpperCase(),
                  icon: '🏆',
                  description: 'Achievement unlocked!',
                  rarity: 'epic'
                }}
                animated
              />
            ))}
          </Grid>
        ) : (
          <Stack>
            <BodyText textAlign="center">
              Complete challenges to unlock achievements!
            </BodyText>
          </Stack>
        )}
    </Card>
  );
}