import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, VStack, HStack, Button, Badge, Image, Grid, Text as ChakraText } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { PageLayout, SectionLayout } from '../design/layouts/PageLayout';
import { Card } from '../design/components/Card';
import { CustomText, Heading } from '../design/components/Typography';
import { Button as CustomButton } from '../design/components/Button';
import { DonationModal, CollaborationModal } from '../components/modals/ProjectModals';
import { designSystem } from '../design/system/DesignSystem';

const MotionBox = motion(Box);

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);

  // Mock project data - in real app this would come from API
  const project = {
    id: 1,
    title: 'Space Invaders Unity Game',
    creator: 'CodeMaster99',
    description: 'A complete Space Invaders clone built with Unity and C#. Features power-ups, multiple levels, and particle effects. This project showcases advanced game development techniques and modern Unity features.',
    language: 'csharp',
    thumbnail_url: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
    images: [
      'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    tags: ['Unity', 'Game Dev', '2D', 'C#', 'Arcade'],
    difficulty: 'intermediate',
    acceptsDonations: true,
    seekingCollaborators: true,
    fundingGoal: 2500,
    donations: 1250,
    collaborationSlots: 3,
    currentCollaborators: 1,
    techStack: ['Unity 2022.3', 'C#', 'Visual Studio', 'Git'],
    features: [
      'Multiple enemy types with different behaviors',
      'Power-up system with various upgrades',
      'Particle effects and animations',
      'Progressive difficulty scaling',
      'High score system with leaderboard',
      'Sound effects and background music'
    ],
    updates: [
      {
        date: '2 days ago',
        title: 'Added particle effects system',
        content: 'Implemented a comprehensive particle system for explosions and power-ups.'
      },
      {
        date: '1 week ago',
        title: 'Level progression completed',
        content: 'All 10 levels are now playable with increasing difficulty.'
      }
    ],
    collaborators: [
      { name: 'PixelArtist', role: 'UI/UX Designer', avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' }
    ],
    openRoles: [
      { role: 'Sound Designer', skills: ['Audio Editing', 'Game Audio'], timeCommitment: '5-10 hours/week' },
      { role: 'Level Designer', skills: ['Game Design', 'Unity'], timeCommitment: '8-12 hours/week' }
    ]
  };

  const fundingProgress = (project.donations / project.fundingGoal) * 100;
  const daysRemaining = 23; // Mock data

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

  return (
    <PageLayout>
      <SectionLayout spacing="default">
        <HStack spacing={2} mb={4}>
          <CustomButton 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/community')}
          >
            ← Back to Community
          </CustomButton>
          <Badge bg={getDifficultyColor(project.difficulty)} color="white">
            {project.difficulty.toUpperCase()}
          </Badge>
          <Badge bg={designSystem.colors.backgrounds.surface} color="white">
            {getLanguageIcon(project.language)} {project.language.toUpperCase()}
          </Badge>
        </HStack>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} w="100%">
          {/* Left Column - Project Details */}
          <VStack spacing={6} align="stretch">
            {/* Project Header */}
            <Card variant="elevated" p={6}>
              <VStack spacing={4} align="stretch">
                <VStack align="start" spacing={2}>
                  <Heading level={1} size="2xl" color="brand">
                    {project.title}
                  </Heading>
                  <HStack spacing={3}>
                    <CustomText color="secondary">by {project.creator}</CustomText>
                    <Badge bg={designSystem.colors.status.success} color="white">
                      ⭐ Verified Creator
                    </Badge>
                  </HStack>
                </VStack>

                <CustomText color="secondary" lineHeight="1.6">
                  {project.description}
                </CustomText>

                <HStack spacing={1} flexWrap="wrap">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} bg={designSystem.colors.brand.secondary} color="white">
                      {tag}
                    </Badge>
                  ))}
                </HStack>
              </VStack>
            </Card>

            {/* Project Gallery */}
            <Card variant="elevated" p={6}>
              <Heading level={2} size="lg" color="secondary" mb={4}>
                📸 Project Gallery
              </Heading>
              <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
                {project.images.map((image, i) => (
                  <Box key={i} borderRadius="md" overflow="hidden">
                    <Image
                      src={image}
                      alt={`${project.title} screenshot ${i + 1}`}
                      w="100%"
                      h="200px"
                      objectFit="cover"
                    />
                  </Box>
                ))}
              </Grid>
            </Card>

            {/* Tech Stack & Features */}
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
              <Card variant="default" p={6}>
                <Heading level={3} size="md" color="accent" mb={3}>
                  🛠️ Tech Stack
                </Heading>
                <VStack spacing={2} align="start">
                  {project.techStack.map((tech, i) => (
                    <CustomText key={i} size="sm" color="secondary">
                      • {tech}
                    </CustomText>
                  ))}
                </VStack>
              </Card>

              <Card variant="default" p={6}>
                <Heading level={3} size="md" color="accent" mb={3}>
                  ✨ Key Features
                </Heading>
                <VStack spacing={2} align="start">
                  {project.features.slice(0, 4).map((feature, i) => (
                    <CustomText key={i} size="sm" color="secondary">
                      • {feature}
                    </CustomText>
                  ))}
                </VStack>
              </Card>
            </Grid>

            {/* Project Updates */}
            <Card variant="default" p={6}>
              <Heading level={3} size="md" color="brand" mb={4}>
                📈 Recent Updates
              </Heading>
              <VStack spacing={4} align="stretch">
                {project.updates.map((update, i) => (
                  <Box key={i} p={4} bg={designSystem.colors.backgrounds.secondary} borderRadius="md">
                    <HStack justify="space-between" mb={2}>
                      <CustomText fontWeight="bold" color="secondary">
                        {update.title}
                      </CustomText>
                      <CustomText size="sm" color="muted">
                        {update.date}
                      </CustomText>
                    </HStack>
                    <CustomText size="sm" color="secondary">
                      {update.content}
                    </CustomText>
                  </Box>
                ))}
              </VStack>
            </Card>
          </VStack>

          {/* Right Column - Funding/Collaboration Widget */}
          <VStack spacing={6} align="stretch">
            {/* Funding Widget */}
            {project.acceptsDonations && (
              <Card variant="elevated" p={6}>
                <VStack spacing={4} align="stretch">
                  <Heading level={3} size="lg" color="accent">
                    💰 Support This Project
                  </Heading>
                  
                  <VStack spacing={2} align="stretch">
                    <HStack justify="space-between">
                      <CustomText size="2xl" color="#FFD700" fontWeight="bold">
                        ${project.donations.toLocaleString()}
                      </CustomText>
                      <CustomText color="muted">
                        of ${project.fundingGoal.toLocaleString()}
                      </CustomText>
                    </HStack>
                    
                    <Box bg={designSystem.colors.backgrounds.secondary} h="12px" borderRadius="6px">
                      <Box 
                        bg="#FFD700" 
                        h="100%" 
                        w={`${Math.min(fundingProgress, 100)}%`} 
                        borderRadius="6px"
                        transition="width 0.3s"
                      />
                    </Box>
                    
                    <HStack justify="space-between" fontSize="sm" color={designSystem.colors.text.muted}>
                      <CustomText>{Math.round(fundingProgress)}% funded</CustomText>
                      <CustomText>{daysRemaining} days left</CustomText>
                    </HStack>
                  </VStack>

                  <CustomButton
                    bg="#FFD700"
                    color="#000"
                    size="lg"
                    w="100%"
                    onClick={() => setShowDonationModal(true)}
                  >
                    💰 Support with Donation
                  </CustomButton>

                  <VStack spacing={2} align="start" fontSize="sm" color={designSystem.colors.text.muted}>
                    <CustomText>✓ Secure payment processing</CustomText>
                    <CustomText>✓ Get project updates</CustomText>
                    <CustomText>✓ Support open source development</CustomText>
                  </VStack>
                </VStack>
              </Card>
            )}

            {/* Collaboration Widget */}
            {project.seekingCollaborators && (
              <Card variant="elevated" p={6}>
                <VStack spacing={4} align="stretch">
                  <Heading level={3} size="lg" color="brand">
                    🤝 Join the Team
                  </Heading>
                  
                  <VStack spacing={3} align="stretch">
                    <HStack justify="space-between">
                      <CustomText color="secondary">Open Positions</CustomText>
                      <Badge bg={designSystem.colors.brand.primary} color="white">
                        {project.collaborationSlots - project.currentCollaborators} available
                      </Badge>
                    </HStack>

                    {project.openRoles.map((role, i) => (
                      <Box key={i} p={3} bg={designSystem.colors.backgrounds.secondary} borderRadius="md">
                        <CustomText fontWeight="bold" color="brand" mb={1}>
                          {role.role}
                        </CustomText>
                        <CustomText size="sm" color="muted" mb={2}>
                          {role.timeCommitment}
                        </CustomText>
                        <HStack spacing={1} flexWrap="wrap">
                          {role.skills.map((skill, j) => (
                            <Badge key={j} bg={designSystem.colors.backgrounds.surface} color="white" size="sm">
                              {skill}
                            </Badge>
                          ))}
                        </HStack>
                      </Box>
                    ))}
                  </VStack>

                  <CustomButton
                    bg="#4ECDC4"
                    color="#000"
                    size="lg"
                    w="100%"
                    onClick={() => setShowCollaborationModal(true)}
                  >
                    🤝 Apply to Collaborate
                  </CustomButton>

                  <VStack spacing={2} align="start" fontSize="sm" color={designSystem.colors.text.muted}>
                    <CustomText>✓ Work with verified creators</CustomText>
                    <CustomText>✓ Build your portfolio</CustomText>
                    <CustomText>✓ Gain real project experience</CustomText>
                  </VStack>
                </VStack>
              </Card>
            )}

            {/* Current Team */}
            <Card variant="default" p={6}>
              <Heading level={3} size="md" color="secondary" mb={4}>
                👥 Current Team
              </Heading>
              <VStack spacing={3} align="stretch">
                <HStack spacing={3}>
                  <Image
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop"
                    alt={project.creator}
                    w="40px"
                    h="40px"
                    borderRadius="full"
                  />
                  <VStack align="start" spacing={0}>
                    <CustomText fontWeight="bold" color="brand">
                      {project.creator}
                    </CustomText>
                    <CustomText size="sm" color="muted">
                      Project Creator
                    </CustomText>
                  </VStack>
                </HStack>
                
                {project.collaborators.map((collab, i) => (
                  <HStack key={i} spacing={3}>
                    <Image
                      src={collab.avatar}
                      alt={collab.name}
                      w="40px"
                      h="40px"
                      borderRadius="full"
                    />
                    <VStack align="start" spacing={0}>
                      <CustomText fontWeight="bold" color="secondary">
                        {collab.name}
                      </CustomText>
                      <CustomText size="sm" color="muted">
                        {collab.role}
                      </CustomText>
                    </VStack>
                  </HStack>
                ))}
              </VStack>
            </Card>
          </VStack>
        </Grid>

        {/* Modals */}
        <DonationModal
          isOpen={showDonationModal}
          onClose={() => setShowDonationModal(false)}
          project={project}
        />
        
        <CollaborationModal
          isOpen={showCollaborationModal}
          onClose={() => setShowCollaborationModal(false)}
          project={project}
        />
      </SectionLayout>
    </PageLayout>
  );
};

export default ProjectDetailPage;