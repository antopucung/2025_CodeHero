import React from 'react';
import { Box, HStack, VStack, Grid, GridItem } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useGameProgress } from '../hooks/useGameProgress';
import { PageLayout, SectionLayout } from '../design/layouts/PageLayout';
import { Card } from '../design/components/Card';
import { Text, Heading } from '../design/components/Typography';
import { Button } from '../design/components/Button';
import { designSystem } from '../design/system/DesignSystem';

const MotionBox = motion(Box);

const HomePage = () => {
  const navigate = useNavigate();
  const { progress } = useGameProgress();

  const features = [
    {
      id: 'marketplace',
      title: 'LEARNING MARKETPLACE',
      description: 'Interactive programming courses',
      icon: '🛒',
      color: '#4ecdc4',
      path: '/marketplace'
    },
    {
      id: 'community',
      title: 'COMMUNITY GALLERY',
      description: 'Showcase & support creators',
      icon: '🎨',
      color: '#ff6b6b',
      path: '/community'
    }
  ];

  return (
    <PageLayout background="primary" padding="default">
      <SectionLayout spacing="loose">
        {/* Welcome Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          textAlign="center"
          w="100%"
        >
          <MotionBox
            animate={{
              textShadow: [
                `0 0 20px ${designSystem.colors.brand.primary}`,
                `0 0 40px ${designSystem.colors.brand.primary}`,
                `0 0 20px ${designSystem.colors.brand.primary}`
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Heading level={1} size={{ base: "2xl", md: "3xl" }} color="brand" mb={designSystem.spacing[2]}>
              Terminal IDE
            </Heading>
          </MotionBox>
            
          <Text size={{ base: "base", md: "lg" }} color="muted" mb={designSystem.spacing[4]}>
              Gamified Coding & Typing Experience
          </Text>
            
          {/* Player Stats */}
          <HStack justify="center" spacing={{ base: designSystem.spacing[4], md: designSystem.spacing[6] }} mb={designSystem.spacing[4]}>
              <VStack spacing={0}>
              <Text size={{ base: "lg", md: "xl" }} color="accent" fontWeight="bold">
                  {progress.level}
              </Text>
              <Text size="xs" color="muted">LEVEL</Text>
              </VStack>
              <VStack spacing={0}>
              <Text size={{ base: "lg", md: "xl" }} color="secondary" fontWeight="bold">
                  {progress.bestWpm}
              </Text>
              <Text size="xs" color="muted">WPM</Text>
              </VStack>
              <VStack spacing={0}>
              <Text size={{ base: "lg", md: "xl" }} color="error" fontWeight="bold">
                  {progress.totalChallengesCompleted}
              </Text>
              <Text size="xs" color="muted">DONE</Text>
              </VStack>
              <VStack spacing={0}>
              <Text size={{ base: "lg", md: "xl" }} color="brand" fontWeight="bold">
                  {progress.achievements.length}
              </Text>
              <Text size="xs" color="muted">AWARDS</Text>
              </VStack>
          </HStack>
        </MotionBox>

        {/* Platform Features */}
        <Box flex={1}>
          <Text size={{ base: "lg", md: "xl" }} fontWeight="bold" color="brand" mb={designSystem.spacing[4]} textAlign="center">
            Explore Platform Features
          </Text>
          
          <Grid 
            templateColumns={{ 
              base: "1fr", 
              md: "repeat(2, 1fr)"
            }} 
            gap={{ base: designSystem.spacing[3], md: designSystem.spacing[4] }}
            h={{ base: "auto", lg: "300px" }}
          >
            {features.map((feature, index) => (
              <GridItem key={feature.id}>
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + (index * 0.1) }}
                  h="100%"
                >
                  <Card
                    variant="elevated"
                    onClick={() => navigate(feature.path)}
                    h="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    minH={{ base: "180px", md: "220px" }}
                    position="relative"
                    overflow="hidden"
                  >
                    {/* Background Glow */}
                    <MotionBox
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg={`radial-gradient(circle at center, ${feature.color}22 0%, transparent 70%)`}
                      animate={{
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    
                    <VStack spacing={designSystem.spacing[3]} position="relative" zIndex={1} flex={1} justify="center">
                      <Text size={{ base: "3xl", md: "4xl" }}>{feature.icon}</Text>
                      
                      <Text 
                        size={{ base: "base", md: "lg" }}
                        fontWeight="bold" 
                        color={feature.color}
                        textAlign="center"
                      >
                        {feature.title}
                      </Text>
                      
                      <Text 
                        size={{ base: "xs", md: "sm" }}
                        color="secondary" 
                        textAlign="center"
                        lineHeight="1.4"
                      >
                        {feature.description}
                      </Text>
                      
                      <Button
                        bg={feature.color}
                        color={designSystem.colors.text.inverse}
                        size="md"
                        mt={designSystem.spacing[2]}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(feature.path);
                        }}
                      >
                        EXPLORE
                      </Button>
                    </VStack>
                  </Card>
                </MotionBox>
              </GridItem>
            ))}
          </Grid>
        </Box>
        
        {/* Platform Info */}
        <Card
          variant="default"
          w="100%"
          textAlign="center"
        >
          <Text size="sm" color="brand" fontWeight="bold" mb={designSystem.spacing[2]}>
            🎮 GAMIFIED LEARNING PLATFORM
          </Text>
          <VStack spacing={designSystem.spacing[1]} fontSize="xs" color="muted">
            <Text>✓ Interactive typing challenges with real code</Text>
            <Text>✓ Integrated IDE for testing and experimentation</Text>
            <Text>✓ Progress tracking and achievements</Text>
            <Text>✓ Community showcase and support system</Text>
          </VStack>
        </Card>
      </SectionLayout>
    </PageLayout>
  );
};

export default HomePage;