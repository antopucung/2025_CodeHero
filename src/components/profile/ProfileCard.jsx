import React from 'react';
import { Box, VStack, HStack, Badge, Image } from "@chakra-ui/react";
import { Card } from '../../design/components/Card';
import { Text, Heading } from '../../design/components/Typography';
import { Button as CustomButton } from '../../design/components/Button';
import { designSystem } from '../../design/system/DesignSystem';

export const ProfileCard = ({ userData, progress }) => {
  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>
      <VStack spacing={designSystem.spacing[4]} align="center">
        <Box position="relative">
          <Image
            src={userData.avatar}
            alt={userData.name}
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
            LV.{progress.level}
          </Badge>
        </Box>
        
        <VStack spacing={designSystem.spacing[2]} textAlign="center">
          <Heading level={2} size="xl" color="brand">
            {userData.name}
          </Heading>
          <Text color="secondary">{userData.username}</Text>
          <Text size="sm" color="muted">{userData.email}</Text>
          <Text size="sm" color="muted">Joined {userData.joinDate}</Text>
        </VStack>

        <Text size="sm" color="secondary" textAlign="center" lineHeight="1.5">
          {userData.bio}
        </Text>

        <HStack spacing={designSystem.spacing[2]} w="100%">
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