import React, { useState } from 'react';
import { Box, Grid, Text, VStack, HStack, Button, Badge } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Text as ChakraText } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useThemeTokens } from '../theme/hooks/useThemeTokens';

const MotionBox = motion(Box);

// Feature card component for homepage
const FeatureCard = ({ title, description, icon, color, route, comingSoon = false }) => {
  const navigate = useNavigate();
  const { getColor, getBorderRadius, getSpacing, getShadow } = useThemeTokens();
  
  return (
    <MotionBox
      bg={getColor('backgrounds.surface')}
      borderRadius={getBorderRadius('md')}
      border={`1px solid ${getColor('borders.default')}`}
      p={getSpacing(6)}
      whileHover={{ scale: 1.03, y: -5, borderColor: color }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !comingSoon && navigate(route)}
      cursor={comingSoon ? "default" : "pointer"}
      position="relative"
    >
      <VStack spacing={getSpacing(4)} align="start">
        <HStack>
          <Text fontSize="2xl">{icon}</Text>
          <Text fontSize="xl" fontWeight="bold" color={color}>
            {title}
          </Text>
        </HStack>
        <Text color={getColor('text.secondary')}>{description}</Text>
        {comingSoon ? (
          <Badge bg={getColor('backgrounds.secondary')} color={getColor('text.muted')}>
            Coming Soon
          </Badge>
        ) : (
          <Button size="sm" colorScheme="blue">
            Explore
          </Button>
        )}
      </VStack>
      
      {/* Coming soon overlay */}
      {comingSoon && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={getColor('backgrounds.overlay')}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius={getBorderRadius('md')}
        >
          <Badge 
            bg={getColor('backgrounds.primary')} 
            color={getColor('text.muted')} 
            p={getSpacing(2)} 
            fontSize="md"
          >
            Coming Soon
          </Badge>
        </Box>
      )}
    </MotionBox>
  );
};

const HomePage = () => {
  const { getColor, getSpacing } = useThemeTokens();
  
  // Define features for the homepage
  const features = [
    {
      title: "Typing Challenge",
      description: "Practice typing code with real-time feedback and gamification",
      icon: "⌨️",
      color: "#ff6b6b",
      route: "/typing-challenge"
    },
    {
      title: "Code Editor",
      description: "Write and execute code in multiple languages",
      icon: "💻",
      color: "#4ecdc4",
      route: "/code-editor"
    },
    {
      title: "Hybrid Mode",
      description: "Type and execute code in a single interface",
      icon: "🚀",
      color: "#ffd93d",
      route: "/hybrid-mode"
    },
    {
      title: "Quiz Gallery",
      description: "Explore interactive quiz components for code learning",
      icon: "🎮",
      color: "#6bcf7f",
      route: "/quiz-gallery"
    },
    {
      title: "Marketplace",
      description: "Browse and enroll in interactive coding courses",
      icon: "🛒",
      color: "#a374db",
      route: "/marketplace"
    },
    {
      title: "Community",
      description: "Connect with other developers and share projects",
      icon: "🌐",
      color: "#45b7d1",
      route: "/community"
    }
  ];

  return (
    <Box minH="100vh" bg="#000">
      {/* Hero section */}
      <Box py={20} textAlign="center">
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Text fontSize="5xl" fontWeight="bold" color="#00ff00" mb={4}>
            Terminal IDE
          </Text>
          <Text fontSize="2xl" color="#ccc" maxW="800px" mx="auto">
            An interactive coding platform with gamified learning experiences
          </Text>
        </MotionBox>
        
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          mt={10}
        >
          <Button
            as="a"
            href="#features"
            colorScheme="green"
            size="lg"
          >
            Get Started
          </Button>
        </MotionBox>
      </Box>
      
      {/* Features section */}
      <Box id="features" py={16} px={8}>
        <Text fontSize="3xl" fontWeight="bold" color="#00ff00" mb={12} textAlign="center">
          Interactive Features
        </Text>
        
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={8}
          maxW="1200px"
          mx="auto"
        >
          {features.map((feature, index) => (
            <MotionBox
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                color={feature.color}
                route={feature.route}
                comingSoon={feature.comingSoon}
              />
            </MotionBox>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;