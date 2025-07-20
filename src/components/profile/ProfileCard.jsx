import React from 'react';
import { Box, VStack, HStack, Badge, Image } from "@chakra-ui/react";
import { Card } from '../../design/components/Card';
import { CustomText, Heading } from '../../design/components/Typography';
import { Button as CustomButton } from '../../design/components/Button';
import { designSystem } from '../../design/system/DesignSystem';

export const ProfileCard = ({ userData, progress }) => {
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
    <Card variant="elevated" p={designSystem.spacing[6]}>  
      <VStack spacing={designSystem.spacing[5]} align="center">
        <Box position="relative">
          <Image
            src={safeUserData.avatar}
            alt={safeUserData.name}
            w="120px"
            h="120px"
            borderRadius="full"
            objectFit="cover"
            border={`4px solid ${designSystem.colors.brand.primary}`}
          />
          <Badge 
            position="absolute"
            bottom="0"
            right="0"
            bg={designSystem.colors.status.success} 
            color={designSystem.colors.text.inverse}
            borderRadius="full"
            p={2}
          >
            LV.{safeProgress?.overall_level ?? safeProgress?.level ?? 1}
          </Badge>
        </Box>
        
        <VStack spacing={designSystem.spacing[3]} textAlign="center" px={designSystem.spacing[3]}>
          <Heading level={2} size="xl" color="brand">
            {safeUserData.name}
          </Heading>
          <CustomText color="secondary">{safeUserData.username}</CustomText>
          <CustomText size="sm" color="muted">{safeUserData.email}</CustomText>
          <CustomText size="sm" color="muted">Joined {safeUserData.joinDate}</CustomText>
        </VStack>

        <Box px={designSystem.spacing[4]} py={designSystem.spacing[2]}>
          <CustomText size="sm" color="secondary" textAlign="center" lineHeight="1.5">
            {safeUserData.bio}
          </CustomText>
        </Box>

        <HStack spacing={designSystem.spacing[4]} w="100%" px={designSystem.spacing[3]}>
          <CustomButton variant="primary" size="sm" flex={1}>
            🔗 Portfolio
          </CustomButton>
          <CustomButton variant="secondary" size="sm" flex={1}>
            📧 GitHub
          </CustomButton>
        </HStack>
      </VStack>
    </Card>
  );
};