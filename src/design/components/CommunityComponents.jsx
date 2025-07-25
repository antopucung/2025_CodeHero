// Community-specific reusable components
import React from 'react';
import { Box, HStack, VStack, Badge, Image, Grid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Card } from './Card';
import { CustomText } from './Typography';
import { Button } from './Button';
import { designSystem } from '../system/DesignSystem';
import { ProgressBar } from './ProgressBar';

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
        p={designSystem.spacing[6]}
      >
        <VStack spacing={designSystem.spacing[5]} align="stretch">
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={designSystem.spacing[2]} flex={1}>
              <CustomText size="lg" color="secondary" fontWeight={designSystem.typography.weights.bold}>
                {request.title}
              </CustomText>
              <HStack spacing={designSystem.spacing[2]}>
                <CustomText size="sm" color="muted">
                  by {request.client}
                </CustomText>
                <CustomText color={designSystem.colors.text.muted}>•</CustomText>
                <CustomText size="sm" color="muted">
                  {request.posted}
                </CustomText>
              </HStack>
            </VStack>
            <VStack align="end" spacing={designSystem.spacing[2]}>
              <Badge bg={getDifficultyColor(request.difficulty)} color={designSystem.colors.text.inverse}>
                {request.difficulty.toUpperCase()}
              </Badge>
              <Badge bg={designSystem.colors.backgrounds.surface} color={designSystem.colors.text.primary}>
                {getLanguageIcon(request.language)} {request.language.toUpperCase()}
              </Badge>
            </VStack>
          </HStack>

          <Box 
            bg={designSystem.colors.backgrounds.secondary} 
            borderRadius={designSystem.radii.md}
            px={designSystem.spacing[4]}
            py={designSystem.spacing[3]}
          >
            <CustomText size="sm" color="secondary" lineHeight="1.6">
              {request.description}
            </CustomText>
          </Box>

          <HStack spacing={designSystem.spacing[2]} flexWrap="wrap" px={designSystem.spacing[1]}>
            {request.tags.map((tag, i) => (
              <Badge 
                key={i} 
                bg={designSystem.colors.brand.secondary} 
                color={designSystem.colors.text.inverse}
                m={designSystem.spacing[1]}
              >
                {tag}
              </Badge>
            ))}
          </HStack>

          <Box 
            bg={designSystem.colors.backgrounds.secondary} 
            borderRadius={designSystem.radii.md}
            px={designSystem.spacing[4]}
            py={designSystem.spacing[5]}
            mx={designSystem.spacing[1]}
          >
            <HStack justify="space-between" align="center" spacing={designSystem.spacing[4]}>
              <VStack align="start" spacing={designSystem.spacing[1]}>
                <CustomText size="sm" color="muted">Budget</CustomText>
                <CustomText size="lg" color="accent" fontWeight={designSystem.typography.weights.bold}>
                  {getBudgetRange(request.budget)}
                </CustomText>
              </VStack>
              <VStack align="center" spacing={designSystem.spacing[1]}>
                <CustomText size="sm" color="muted">Timeline</CustomText>
                <CustomText size="sm" color="secondary" fontWeight={designSystem.typography.weights.bold}>
                  {request.timeline}
                </CustomText>
              </VStack>
              <VStack align="end" spacing={designSystem.spacing[1]}>
                <CustomText size="sm" color="muted">Applications</CustomText>
                <CustomText size="lg" color="brand" fontWeight={designSystem.typography.weights.bold}>
                  {request.applications}
                </CustomText>
              </VStack>
            </HStack>
          </Box>

          <Box px={designSystem.spacing[1]} mt={designSystem.spacing[2]}>
            <HStack spacing={designSystem.spacing[3]}>
              <Button
                variant="secondary"
                size="sm"
                flex={1}
                h={designSystem.spacing[12]}
                onClick={() => onViewDetails?.(request)}
              >
                📋 View Details
              </Button>
              <Button
                bg={designSystem.colors.brand.secondary}
                color={designSystem.colors.text.inverse}
                size="sm"
                flex={1}
                h={designSystem.spacing[12]}
                onClick={() => onApply?.(request)}
              >
                🚀 Apply Now
              </Button>
            </HStack>
          </Box>
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
        p={designSystem.spacing[6]}
      >
        <VStack spacing={designSystem.spacing[5]} align="stretch">
          <HStack justify="space-between" align="start">
            <VStack align="start" spacing={designSystem.spacing[2]}>
              <CustomText size="lg" color="accent" fontWeight={designSystem.typography.weights.bold}>
                {collab.title}
              </CustomText>
              <HStack spacing={designSystem.spacing[2]}>
                <CustomText size="sm" color="brand">
                  {collab.creator}
                </CustomText>
                <CustomText color={designSystem.colors.text.muted}>•</CustomText>
                <CustomText size="sm" color="muted">
                  {collab.client}
                </CustomText>
              </HStack>
            </VStack>
            <Badge bg={designSystem.colors.brand.accent} color={designSystem.colors.text.inverse}>
              {collab.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </HStack>

          <Box 
            bg={designSystem.colors.backgrounds.secondary} 
            borderRadius={designSystem.radii.md}
            p={designSystem.spacing[4]}
            mx={designSystem.spacing[2]}
          >
            <HStack spacing={designSystem.spacing[4]}>
              <VStack align="start" spacing={designSystem.spacing[1]} flex={1}>
                <CustomText size="sm" color="muted" mb={designSystem.spacing[1]}>Progress</CustomText>
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
                  <CustomText size="sm" color="accent" fontWeight={designSystem.typography.weights.bold}>
                    {collab.progress}%
                  </CustomText>
                </HStack>
              </VStack>
              <VStack align="center" spacing={designSystem.spacing[1]}>
                <CustomText size="sm" color="muted" mb={designSystem.spacing[1]}>Budget</CustomText>
                <CustomText size="lg" color="brand" fontWeight={designSystem.typography.weights.bold}>
                  ${collab.budget.toLocaleString()}
                </CustomText>
              </VStack>
              <VStack align="end" spacing={designSystem.spacing[1]}>
                <CustomText size="sm" color="muted" mb={designSystem.spacing[1]}>Deadline</CustomText>
                <CustomText size="sm" color="secondary" fontWeight={designSystem.typography.weights.bold}>
                  {collab.deadline}
                </CustomText>
              </VStack>
            </HStack>
          </Box>

          <Box 
            borderTop={`1px solid ${designSystem.colors.borders.default}`}
            pt={designSystem.spacing[4]}
            px={designSystem.spacing[2]}
          >
            <HStack justify="space-between" align="center" spacing={designSystem.spacing[2]}>
              <CustomText size="xs" color="muted">
                Last update: {collab.lastUpdate}
              </CustomText>
              <HStack spacing={designSystem.spacing[3]}>
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
          </Box>
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
        p={designSystem.spacing[6]}
      >
        <VStack spacing={designSystem.spacing[5]}>
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
          
          <Box px={designSystem.spacing[3]}>
            <VStack spacing={designSystem.spacing[3]}>
              <CustomText size="lg" color="brand" fontWeight={designSystem.typography.weights.bold}>
                {creator.name}
              </CustomText>
              <HStack spacing={designSystem.spacing[3]}>
                <CustomText size="sm" color="accent">
                  ⭐ {creator.rating}
                </CustomText>
                <CustomText size="sm" color="secondary">
                  {creator.completedProjects} projects
                </CustomText>
              </HStack>
              <Box 
                bg={designSystem.colors.backgrounds.secondary} 
                borderRadius={designSystem.radii.sm}
                px={designSystem.spacing[3]}
                py={designSystem.spacing[1]}
              >
                <CustomText size="sm" color="muted">
                  {creator.hourlyRate}/hour
                </CustomText>
              </Box>
            </VStack>
          </Box>

          <Box px={designSystem.spacing[3]} py={designSystem.spacing[2]}>
            <HStack spacing={designSystem.spacing[2]} flexWrap="wrap" justify="center">
              {creator.specialties.map((skill, i) => (
                <Badge 
                  key={i} 
                  bg={designSystem.colors.brand.primary} 
                  color={designSystem.colors.text.inverse}
                  m={designSystem.spacing[1]}
                >
                  {skill}
                </Badge>
              ))}
            </HStack>
          </Box>

          <Box px={designSystem.spacing[3]}>
            <HStack spacing={designSystem.spacing[3]} w="100%">
              <Button 
                variant="secondary" 
                size="sm" 
                flex={1}
                h={designSystem.spacing[12]}
                onClick={() => onViewProfile?.(creator)}
              >
                📁 Portfolio
              </Button>
              <Button
                bg={creator.available ? designSystem.colors.brand.primary : designSystem.colors.interactive.disabled}
                color={designSystem.colors.text.inverse}
                size="sm"
                flex={1}
                h={designSystem.spacing[12]}
                disabled={!creator.available}
                onClick={() => onHire?.(creator)}
              >
                {creator.available ? '🤝 Hire' : '💬 Message'}
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Card>
    </MotionBox>
  );
};

// Enhanced Project Card for Showcase
export const EnhancedProjectCard = ({ 
  project, 
  onViewDetails, 
  onDonate, 
  onCollaborate 
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

  // Enhanced project data with funding/collaboration info
  const fundingGoal = project.fundingGoal || 1000;
  const currentFunding = project.donations || 0;
  const fundingProgress = (currentFunding / fundingGoal) * 100;
  const collaborationSlots = project.collaborationSlots || 2;
  const filledSlots = project.currentCollaborators || 0;

  return (
    <Card
      variant="elevated"
      display="flex"
      flexDirection="column"
      h="100%"
      overflow="hidden"
      position="relative"
      cursor="pointer"
      onClick={onViewDetails}
    >
      {/* Project Thumbnail */}
      <Box 
        position="relative" 
        h="200px" 
        overflow="hidden"
        backgroundImage={project.thumbnail_url}
        backgroundSize="cover"
        backgroundPosition="center"
      >
        {/* Project Type Badges */}
        <Box
          position="absolute"
          top={designSystem.spacing[2]}
          left={designSystem.spacing[2]}
          display="flex"
          flexDirection="column"
          gap={designSystem.spacing[1]}
        >
          {project.acceptsDonations && (
            <Badge 
              bg="rgba(255, 215, 0, 0.9)" 
              color="#000" 
              fontWeight="bold"
            >
              💰 DONATIONS OPEN
            </Badge>
          )}
          {project.seekingCollaborators && (
            <Badge 
              bg="rgba(76, 205, 196, 0.9)" 
              color="#000" 
              fontWeight="bold"
            >
              🤝 SEEKING COLLABORATORS
            </Badge>
          )}
        </Box>
        
        {/* Language & Difficulty */}
        <Box
          position="absolute"
          top={designSystem.spacing[2]}
          right={designSystem.spacing[2]}
          display="flex"
          flexDirection="column"
          gap={designSystem.spacing[1]}
        >
          <Badge bg={getDifficultyColor(project.difficulty)} color={designSystem.colors.text.inverse}>
            {project.difficulty?.toUpperCase()}
          </Badge>
          <Badge bg={designSystem.colors.backgrounds.overlay} color={designSystem.colors.text.primary}>
            {getLanguageIcon(project.language)} {project.language?.toUpperCase()}
          </Badge>
        </Box>
        
        {/* Funding Progress Overlay */}
        {project.acceptsDonations && (
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            bg="rgba(0,0,0,0.8)"
            p={designSystem.spacing[2]}
          >
            <VStack spacing={designSystem.spacing[1]} align="stretch">
              <HStack justify="space-between">
                <CustomText size="xs" color="#FFD700" fontWeight="bold">
                  ${currentFunding.toLocaleString()}
                </CustomText>
                <CustomText size="xs" color="white">
                  of ${fundingGoal.toLocaleString()}
                </CustomText>
              </HStack>
              <ProgressBar 
                value={fundingProgress}
                colorScheme="gold"
                bg="rgba(255,255,255,0.2)"
                height="4px"
                borderRadius="2px"
              />
            </VStack>
          </Box>
        )}
        
        {/* Collaboration Slots */}
        {project.seekingCollaborators && (
          <Box
            position="absolute"
            bottom="0"
            left="0"
            right="0"
            bg="rgba(0,0,0,0.8)"
            p={designSystem.spacing[2]}
          >
            <HStack justify="space-between">
              <CustomText size="xs" color="#4ECDC4" fontWeight="bold">
                {collaborationSlots - filledSlots} slots open
              </CustomText>
              <CustomText size="xs" color="white">
                {filledSlots}/{collaborationSlots} filled
              </CustomText>
            </HStack>
          </Box>
        )}
      </Box>

      {/* Project Content */}
      <Box 
        display="flex" 
        flexDirection="column" 
        flex={1}
        gap={designSystem.spacing[3]}
        p={designSystem.spacing[4]}
      >
        <VStack align="start" spacing={designSystem.spacing[2]}>
          <CustomText
            fontSize={designSystem.typography.sizes.lg}
            fontWeight={designSystem.typography.weights.bold}
            color={designSystem.colors.brand.primary}
            noOfLines={2}
          >
            {project.title}
          </CustomText>
          
          <HStack spacing={designSystem.spacing[2]}>
            <CustomText size="sm" color="secondary">
              by {project.creator}
            </CustomText>
            <Badge bg={designSystem.colors.status.success} color="white">
              ⭐ Verified
            </Badge>
          </HStack>
        </VStack>

        <CustomText
          fontSize={designSystem.typography.sizes.sm}
          color={designSystem.colors.text.secondary}
          noOfLines={3}
          flex={1}
        >
          {project.description}
        </CustomText>

        {/* Donation Progress */}
        {project.acceptsDonations && (
          <VStack spacing={designSystem.spacing[1]} align="stretch" w="100%">
            <HStack justify="space-between">
              <CustomText size="xs" color={designSystem.colors.brand.accent}>
                ${project.donations.toLocaleString()} raised
              </CustomText>
              <CustomText size="xs" color="muted">
                Goal: ${project.fundingGoal.toLocaleString()}
              </CustomText>
            </HStack>
            <ProgressBar 
              value={(project.donations / project.fundingGoal) * 100}
              colorScheme="gold"
              height="4px"
            />
          </VStack>
        )}

        {/* Donation Benefits */}
        {project.acceptsDonations && (
          <Box 
            bg={designSystem.colors.backgrounds.surface} 
            p={designSystem.spacing[3]}
            borderRadius={designSystem.radii.md}
          >
            <CustomText size="xs" color="accent" fontWeight={designSystem.typography.weights.bold} mb={designSystem.spacing[2]}>
              Donation Benefits:
            </CustomText>
            <Grid templateColumns="repeat(2, 1fr)" gap={designSystem.spacing[2]}>
              <HStack align="start" spacing={designSystem.spacing[1]}>
                <Box color={designSystem.colors.brand.accent} fontSize="10px">✓</Box>
                <CustomText size="xs" color="secondary">Premium tools access</CustomText>
              </HStack>
              <HStack align="start" spacing={designSystem.spacing[1]}>
                <Box color={designSystem.colors.brand.accent} fontSize="10px">✓</Box>
                <CustomText size="xs" color="secondary">Project source code</CustomText>
              </HStack>
              <HStack align="start" spacing={designSystem.spacing[1]}>
                <Box color={designSystem.colors.brand.accent} fontSize="10px">✓</Box>
                <CustomText size="xs" color="secondary">Donor recognition</CustomText>
              </HStack>
              <HStack align="start" spacing={designSystem.spacing[1]}>
                <Box color={designSystem.colors.brand.accent} fontSize="10px">✓</Box>
                <CustomText size="xs" color="secondary">30-day rewards</CustomText>
              </HStack>
            </Grid>
          </Box>
        )}

        {/* Tags */}
        <HStack spacing={designSystem.spacing[1]} flexWrap="wrap">
          {project.tags?.slice(0, 3).map((tag, i) => (
            <Badge 
              key={i} 
              bg={designSystem.colors.backgrounds.surface} 
              color={designSystem.colors.text.secondary}
              size="sm"
            >
              {tag}
            </Badge>
          ))}
        </HStack>

        {/* Action Buttons */}
        <HStack spacing={designSystem.spacing[2]} mt={designSystem.spacing[2]} w="100%">
          {project.acceptsDonations && (
            <Button
              bg="#FFD700"
              color="#000"
              size="sm"
              flex="1"
              minW="0"
              maxW="100%"
              h={designSystem.spacing[8]}
              fontSize={designSystem.typography.sizes.xs}
              fontWeight={designSystem.typography.weights.bold}
              borderRadius={designSystem.radii.base}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              onClick={(e) => {
                e.stopPropagation();
                onDonate?.(project);
              }}
            >
              💰 DONATE
            </Button>
          )}
          {project.seekingCollaborators && (
            <Button
              bg="#4ECDC4"
              color="#000"
              size="sm"
              flex="1"
              minW="0"
              maxW="100%"
              h={designSystem.spacing[8]}
              fontSize={designSystem.typography.sizes.xs}
              fontWeight={designSystem.typography.weights.bold}
              borderRadius={designSystem.radii.base}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
              onClick={(e) => {
                e.stopPropagation();
                onCollaborate?.(project);
              }}
            >
              🤝 COLLAB
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            flex={project.acceptsDonations || project.seekingCollaborators ? "0 0 auto" : "1"}
            minW={project.acceptsDonations || project.seekingCollaborators ? designSystem.spacing[12] : "0"}
            maxW="100%"
            h={designSystem.spacing[8]}
            fontSize={designSystem.typography.sizes.xs}
            fontWeight={designSystem.typography.weights.bold}
            borderRadius={designSystem.radii.base}
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
            bg={designSystem.colors.backgrounds.surface}
            color={designSystem.colors.text.primary}
            borderColor={designSystem.colors.borders.default}
            _hover={{
              bg: designSystem.colors.backgrounds.elevated,
              borderColor: designSystem.colors.brand.primary,
              color: designSystem.colors.brand.primary
            }}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.(project);
            }}
          >
            👁️ VIEW
          </Button>
        </HStack>
      </Box>
    </Card>
  );
};

// Featured Creators Sidebar
export const FeaturedCreatorsSidebar = ({ creators, onCreatorClick }) => {
  return (
    <Card 
      variant="default" 
      bg={designSystem.colors.backgrounds.elevated}
      borderColor={designSystem.colors.borders.default}
      p={designSystem.spacing[6]}
    >
      <CustomText size="md" color="brand" fontWeight={designSystem.typography.weights.bold} mb={designSystem.spacing[4]}>
        🌟 Featured Creators
      </CustomText>
      <VStack spacing={designSystem.spacing[4]} align="stretch"> 
        {creators.map((creator) => (
          <Box
            key={creator.id}
            bg={designSystem.colors.backgrounds.secondary}
            p={designSystem.spacing[4]}
            borderRadius={designSystem.radii.md}
            border={`1px solid ${designSystem.colors.borders.default}`}
            _hover={{
              borderColor: designSystem.colors.brand.primary,
              cursor: 'pointer'
            }}
            onClick={() => onCreatorClick?.(creator)}
          >
            <HStack spacing={designSystem.spacing[4]}>
              <Image
                src={creator.avatar}
                alt={creator.name}
                w="40px"
                h="40px"
                borderRadius="full"
                objectFit="cover"
              />
              <VStack align="start" spacing={designSystem.spacing[3]} flex={1}>
                <HStack justify="space-between" w="100%" mb={designSystem.spacing[1]}>
                  <CustomText size="sm" color="brand" fontWeight={designSystem.typography.weights.bold}>
                    {creator.name}
                  </CustomText>
                  <Badge 
                    bg={creator.available ? designSystem.colors.status.success : designSystem.colors.status.warning} 
                    color={designSystem.colors.text.inverse}
                  >
                    {creator.available ? 'AVAILABLE' : 'BUSY'}
                  </Badge>
                </HStack>
                <CustomText size="xs" color="muted">
                  ⭐ {creator.rating} • {creator.completedProjects} projects
                </CustomText>
                <Box 
                  bg={designSystem.colors.backgrounds.surface} 
                  borderRadius={designSystem.radii.sm}
                  px={designSystem.spacing[2]}
                  py={designSystem.spacing[1]}
                  my={designSystem.spacing[1]}
                >
                <CustomText size="xs" color="secondary">
                  {creator.hourlyRate}/hr
                </CustomText>
                </Box>
                <HStack spacing={designSystem.spacing[2]} flexWrap="wrap">
                  {creator.specialties.slice(0, 2).map((skill, i) => (
                    <Badge 
                      key={i} 
                      bg={designSystem.colors.backgrounds.surface} 
                      color={designSystem.colors.text.secondary}
                      mr={designSystem.spacing[1]}
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
      p={designSystem.spacing[6]}
    >
      <CustomText size="md" color="accent" fontWeight={designSystem.typography.weights.bold} mb={designSystem.spacing[3]}>
        {icon} {title}
      </CustomText>
      <VStack spacing={designSystem.spacing[2]} align="start">
        {tips.map((tip, index) => (
          <Box key={index} px={designSystem.spacing[2]}>
          <CustomText key={index} size="xs" color="secondary">
            {tip}
          </CustomText>
          </Box>
        ))}
      </VStack>
    </Card>
  );
};