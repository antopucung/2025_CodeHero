import React from 'react';
import { Image } from "@chakra-ui/react";
import {
  Card,
  Stack,
  PageTitle,
  BodyText,
  Caption,
  StatusBadge,
  StandardButton
} from '../../design/components/StandardizedComponents';

export function ProfileCard({ userData, progress }) {
  // Provide safe fallbacks for all data
  const safeUserData = userData || {
    name: 'User',
    username: '@user',
    email: 'user@example.com',
    joinDate: 'Recently',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Learning to code!'
  };
  
  const safeProgress = progress || { overall_level: 1 };
  
  return (
    <Card animated hover>
      <Stack>
        <Stack horizontal justify="center">
          <Image
            src={safeUserData.avatar}
            alt={safeUserData.name}
            w="120px"
            h="120px"
            borderRadius="full"
            objectFit="cover"
            border="4px solid #00ff00"
          />
        </Stack>
        
        <StatusBadge variant="success">
          LV.{safeProgress?.overall_level ?? safeProgress?.level ?? 1}
        </StatusBadge>
        
        <Stack>
          <PageTitle textAlign="center">{safeUserData.name}</PageTitle>
          <BodyText textAlign="center">{safeUserData.username}</BodyText>
          <Caption textAlign="center">{safeUserData.email}</Caption>
          <Caption textAlign="center">Joined {safeUserData.joinDate}</Caption>
        </Stack>

        <Stack>
          <BodyText textAlign="center">
            {safeUserData.bio}
          </BodyText>
        </Stack>

        <Stack horizontal>
          <StandardButton variant="primary" animated flex={1}>
            🔗 Portfolio
          </StandardButton>
          <StandardButton variant="secondary" animated flex={1}>
            📧 GitHub
          </StandardButton>
        </Stack>
      </Stack>
    </Card>
  );
}