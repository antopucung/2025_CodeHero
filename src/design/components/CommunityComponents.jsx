// Community-specific reusable components
import React from 'react';
import { Box, HStack, VStack, Badge, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { Text } from './Typography';
import { Button } from './Button';
import { designSystem } from '../system/DesignSystem';

const MotionBox = motion(Box);

// Commission Request Card Component
export const CommissionCard = ({ 
  request, 
  onViewDetails, 
  onApply 
}) => {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: designSystem.colors.status.success,
      intermediate: designSystem.colors.status.warning,
      advanced: designSystem.colors.status.error
    };
    return colors[difficulty] || designSystem.colors.status.info;
  };

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: '🟨',
      typescript: '🔷',
      python: '🐍',
      java: '☕',
      csharp: '🔵',
      php: '🐘'
    };
    return icons[language] || '💻';
  };

  const getBudgetRange = (budget) => {
    return `$${budget.min.toLocaleString()} - $${budget.max.toLocaleString()}`;
  };

  return (
    <MotionBox
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        variant="elevated"
        _hover={{
          borderColor: designSystem.colors.brand.secondary,
          boxShadow: `0 0 20px ${designSystem.colors.brand.secondary}33`
        }}
        bg={designSystem.colors.backgrounds.elevated}
        borderColor={designSystem.colors.borders.default}
      >
        <VStack spacing={designSystem.spacing[4]} align="stretch">
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={designSystem.spacing[1]} flex={1}>
              <Text size="lg" color="secondary" fontWeight={designSystem.typography.weights.bold}>
                {request.title}
              </Text>
              <HStack spacing={designSystem.spacing[2]}>
                <Text size="sm" color="muted">
                  by {request.client}
                </Text>
                <Text color={designSystem.colors.text.muted}>•</Text>
                <Text size="sm" color="muted">
                  {request.posted}
                </Text>
              </HStack>
            </VStack>
            <VStack align="end" spacing={designSystem.spacing[1]}>
              <Badge bg={getDifficultyColor(request.difficulty)} color={designSystem.colors.text.inverse}>
                {request.difficulty.toUpperCase()}
              </Badge>
              <Badge bg={designSystem.colors.backgrounds.surface} color={designSystem.colors.text.primary}>
                {getLanguageIcon(request.language)} {request.language.toUpperCase()}
              </Badge>
            </VStack>
          </HStack>

          <Text size="sm" color="secondary" lineHeight="1.6">
            {request.description}
          </Text>

          <HStack spacing={designSystem.spacing[1]} flexWrap="wrap">
            {request.tags.map((tag, i) => (
              <Badge 
                key={i} 
                bg={designSystem.colors.brand.secondary} 
                color={designSystem.colors.text.inverse}
              >
                {tag}
              </Badge>
            ))}
          </HStack>

          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={0}>
              <Text size="sm" color="muted">Budget</Text>
              <Text size="lg" color="accent" fontWeight={designSystem.typography.weights.bold}>
                {getBudgetRange(request.budget)}
              </Text>
            </VStack>
            <VStack align="center" spacing={0}>
              <Text size="sm" color="muted">Timeline</Text>
              <Text size="sm" color="secondary" fontWeight={designSystem.typography.weights.bold}>
                {request.timeline}
              </Text>
            </VStack>
            <VStack align="end" spacing={0}>
              <Text size="sm" color="muted">Applications</Text>
              <Text size="lg" color="brand" fontWeight={designSystem.typography.weights.bold}>
                {request.applications}
              </Text>
            </VStack>
          </HStack>

          <HStack spacing={designSystem.spacing[2]}>
            <Button
              variant="secondary"
              size="sm"
              flex={1}
              onClick={() => onViewDetails?.(request)}
            >
              📋 View Details
            </Button>
            <Button
              bg={designSystem.colors.brand.secondary}
              color={designSystem.colors.text.inverse}
              size="sm"
              flex={1}
              onClick={() => onApply?.(request)}
            >
              🚀 Apply Now
            </Button>
          </HStack>
        </VStack>
      </Card>
    </MotionBox>
  );
};

// Collaboration Project Card
export const CollaborationCard = ({ 
  collab, 
  onViewDetails 
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      w="100%"
    >
      <Card 
        variant="elevated"
        bg={designSystem.colors.backgrounds.elevated}
        borderColor={designSystem.colors.borders.default}
      >
        <VStack spacing={designSystem.spacing[4]} align="stretch">
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={designSystem.spacing[1]}>
              <Text size="lg" color="accent" fontWeight={designSystem.typography.weights.bold}>
                {collab.title}
              </Text>
              <HStack spacing={designSystem.spacing[2]}>
                <Text size="sm" color="brand">
                  {collab.creator}
                </Text>
                <Text color={designSystem.colors.text.muted}>•</Text>
                <Text size="sm" color="muted">
                  {collab.client}
                </Text>
              </HStack>
            </VStack>
            <Badge bg={designSystem.colors.brand.accent} color={designSystem.colors.text.inverse}>
              {collab.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </HStack>

          <HStack spacing={designSystem.spacing[6]}>
            <VStack align="start" spacing={designSystem.spacing[1]} flex={1}>
              <Text size="sm" color="muted">Progress</Text>
              <HStack w="100%" spacing={designSystem.spacing[2]}>
                <Box 
                  flex={1} 
                  bg={designSystem.colors.backgrounds.surface} 
                  h="8px" 
                  borderRadius={designSystem.radii.base}
                  overflow="hidden"
                >
                  <Box
                    bg={designSystem.colors.brand.accent}
                    h="100%"
                    w={`${collab.progress}%`}
                    transition="width 0.3s"
                  />
                </Box>
                <Text size="sm" color="accent" fontWeight={designSystem.typography.weights.bold}>
                  {collab.progress}%
                </Text>
              </HStack>
            </VStack>
            <VStack align="center" spacing={0}>
              <Text size="sm" color="muted">Budget</Text>
              <Text size="lg" color="brand" fontWeight={designSystem.typography.weights.bold}>
                ${collab.budget.toLocaleString()}
              </Text>
            </VStack>
            <VStack align="end" spacing={0}>
              <Text size="sm" color="muted">Deadline</Text>
              <Text size="sm" color="secondary" fontWeight={designSystem.typography.weights.bold}>
                {collab.deadline}
              </Text>
            </VStack>
          </HStack>

          <HStack justify="space-between" align="center">
            <Text size="xs" color="muted">
              Last update: {collab.lastUpdate}
            </Text>
            <HStack spacing={designSystem.spacing[2]}>
              <Button variant="secondary" size="sm">
                💬 Chat
              </Button>
              <Button variant="secondary" size="sm">
                📁 Files
              </Button>
              <Button
                bg={designSystem.colors.brand.accent}
                color={designSystem.colors.text.inverse}
                size="sm"
                onClick={() => onViewDetails?.(collab)}
              >
                📊 Details
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </Card>
    </MotionBox>
  );
};

// Creator Profile Card
export const CreatorCard = ({ 
  creator, 
  onViewProfile, 
  onHire 
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card 
        variant="elevated" 
        textAlign="center"
        bg={designSystem.colors.backgrounds.elevated}
        borderColor={designSystem.colors.borders.default}
      >
        <VStack spacing={designSystem.spacing[4]}>
          <Box position="relative">
            <Image
              src={creator.avatar}
              alt={creator.name}
              w="80px"
              h="80px"
              borderRadius="full"
              objectFit="cover"
              border={`3px solid ${designSystem.colors.brand.primary}`}
            />
            <Badge 
              position="absolute"
              bottom="0"
              right="0"
              bg={creator.available ? designSystem.colors.status.success : designSystem.colors.status.warning} 
              color={designSystem.colors.text.inverse}
              borderRadius="full"
            >
              {creator.available ? '🟢' : '🟡'}
            </Badge>
          </Box>
          
          <VStack spacing={designSystem.spacing[2]}>
            <Text size="lg" color="brand" fontWeight={designSystem.typography.weights.bold}>
              {creator.name}
            </Text>
            <HStack spacing={designSystem.spacing[3]}>
              <Text size="sm" color="accent">
                ⭐ {creator.rating}
              </Text>
              <Text size="sm" color="secondary">
                {creator.completedProjects} projects
              </Text>
            </HStack>
            <Text size="sm" color="muted">
              {creator.hourlyRate}/hour
            </Text>
          </VStack>

          <HStack spacing={designSystem.spacing[1]} flexWrap="wrap" justify="center">
            {creator.specialties.map((skill, i) => (
              <Badge 
                key={i} 
                bg={designSystem.colors.brand.primary} 
                color={designSystem.colors.text.inverse}
              >
                {skill}
              </Badge>
            ))}
          </HStack>

          <HStack spacing={designSystem.spacing[2]} w="100%">
            <Button 
              variant="secondary" 
              size="sm" 
              flex={1}
              onClick={() => onViewProfile?.(creator)}
            >
              📁 Portfolio
            </Button>
            <Button
              bg={creator.available ? designSystem.colors.brand.primary : designSystem.colors.interactive.disabled}
              color={designSystem.colors.text.inverse}
              size="sm"
              flex={1}
              disabled={!creator.available}
              onClick={() => onHire?.(creator)}
            >
              {creator.available ? '🤝 Hire' : '💬 Message'}
            </Button>
          </HStack>
        </VStack>
      </Card>
    </MotionBox>
  );
};

// Featured Creators Sidebar
export const FeaturedCreatorsSidebar = ({ creators, onCreatorClick }) => {
  return (
    <Card 
      variant="default" 
      bg={designSystem.colors.backgrounds.elevated}
      borderColor={designSystem.colors.borders.default}
    >
      <Text size="md" color="brand" fontWeight={designSystem.typography.weights.bold} mb={designSystem.spacing[3]}>
        🌟 Featured Creators
      </Text>
      <VStack spacing={designSystem.spacing[3]} align="stretch">
        {creators.map((creator) => (
          <Box
            key={creator.id}
            bg={designSystem.colors.backgrounds.secondary}
            p={designSystem.spacing[3]}
            borderRadius={designSystem.radii.md}
            border={`1px solid ${designSystem.colors.borders.default}`}
            _hover={{
              borderColor: designSystem.colors.brand.primary,
              cursor: 'pointer'
            }}
            onClick={() => onCreatorClick?.(creator)}
          >
            <HStack spacing={designSystem.spacing[3]}>
              <Image
                src={creator.avatar}
                alt={creator.name}
                w="40px"
                h="40px"
                borderRadius="full"
                objectFit="cover"
              />
              <VStack align="start" spacing={designSystem.spacing[1]} flex={1}>
                <HStack justify="space-between" w="100%">
                  <Text size="sm" color="brand" fontWeight={designSystem.typography.weights.bold}>
                    {creator.name}
                  </Text>
                  <Badge 
                    bg={creator.available ? designSystem.colors.status.success : designSystem.colors.status.warning} 
                    color={designSystem.colors.text.inverse}
                  >
                    {creator.available ? 'AVAILABLE' : 'BUSY'}
                  </Badge>
                </HStack>
                <Text size="xs" color="muted">
                  ⭐ {creator.rating} • {creator.completedProjects} projects
                </Text>
                <Text size="xs" color="secondary">
                  {creator.hourlyRate}/hr
                </Text>
                <HStack spacing={designSystem.spacing[1]} flexWrap="wrap">
                  {creator.specialties.slice(0, 2).map((skill, i) => (
                    <Badge 
                      key={i} 
                      bg={designSystem.colors.backgrounds.surface} 
                      color={designSystem.colors.text.secondary}
                    >
                      {skill}
                    </Badge>
                  ))}
                </HStack>
              </VStack>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Card>
  );
};

// Tips Card Component
export const TipsCard = ({ title, tips, icon }) => {
  return (
    <Card 
      variant="default"
      bg={designSystem.colors.backgrounds.elevated}
      borderColor={designSystem.colors.borders.default}
    >
      <Text size="md" color="accent" fontWeight={designSystem.typography.weights.bold} mb={designSystem.spacing[3]}>
        {icon} {title}
      </Text>
      <VStack spacing={designSystem.spacing[2]} align="start">
        {tips.map((tip, index) => (
          <Text key={index} size="xs" color="secondary">
            {tip}
          </Text>
        ))}
      </VStack>
    </Card>
  );
};