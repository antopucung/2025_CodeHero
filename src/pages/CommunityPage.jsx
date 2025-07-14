import React, { useState } from 'react';
import { Box, Text, VStack, HStack, Grid, GridItem, Button, Badge, Image, Tabs, TabList, TabPanels, Tab, TabPanel, Input, Select, Textarea } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useGameProgress } from '../hooks/useGameProgress';
import { PageLayout, SectionLayout } from '../design/layouts/PageLayout';
import { Card } from '../design/components/Card';
import { Text as CustomText, Heading } from '../design/components/Typography';
import { Button as CustomButton } from '../design/components/Button';
import { PageHeader } from '../design/components/PageHeader';
import { designSystem } from '../design/system/DesignSystem';

const MotionBox = motion(Box);

const CommunityPage = () => {
  const navigate = useNavigate();
  const { progress } = useGameProgress();
  const [activeTab, setActiveTab] = useState(0);

  // Mock data for showcase projects (existing)
  const [showcaseProjects] = useState([
    {
      id: 1,
      title: 'Space Invaders Unity Game',
      creator: 'CodeMaster99',
      description: 'A complete Space Invaders clone built with Unity and C#. Features power-ups, multiple levels, and particle effects.',
      language: 'csharp',
      thumbnail: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 245,
      donations: 1250,
      tags: ['Unity', 'Game Dev', '2D'],
      difficulty: 'intermediate',
      status: 'completed'
    },
    {
      id: 2,
      title: 'E-commerce React App',
      creator: 'WebWizard',
      description: 'Full-stack e-commerce platform with React frontend, Node.js backend, and Stripe integration.',
      language: 'javascript',
      thumbnail: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 189,
      donations: 890,
      tags: ['React', 'Node.js', 'Full-Stack'],
      difficulty: 'advanced',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Python Data Visualizer',
      creator: 'DataNinja',
      description: 'Interactive data visualization tool using Python, Pandas, and Matplotlib. Perfect for analyzing CSV files.',
      language: 'python',
      thumbnail: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 156,
      donations: 675,
      tags: ['Python', 'Data Science', 'Visualization'],
      difficulty: 'beginner',
      status: 'completed'
    }
  ]);

  // Mock data for commission requests (new)
  const [commissionRequests] = useState([
    {
      id: 1,
      title: 'Custom Discord Bot Development',
      client: 'ServerOwner2024',
      description: 'Need a Discord bot with moderation features, music playback, and custom commands. Should integrate with our existing server setup.',
      language: 'javascript',
      budget: { min: 500, max: 1000 },
      timeline: '2-3 weeks',
      difficulty: 'intermediate',
      tags: ['Discord.js', 'Node.js', 'API Integration'],
      applications: 12,
      posted: '2 days ago',
      status: 'open'
    },
    {
      id: 2,
      title: 'Mobile App for Local Business',
      client: 'LocalBizOwner',
      description: 'React Native app for restaurant with menu display, order tracking, and customer reviews. Need both iOS and Android versions.',
      language: 'javascript',
      budget: { min: 2000, max: 3500 },
      timeline: '6-8 weeks',
      difficulty: 'advanced',
      tags: ['React Native', 'Firebase', 'Cross-Platform'],
      applications: 8,
      posted: '5 days ago',
      status: 'open'
    },
    {
      id: 3,
      title: 'Python Trading Bot',
      client: 'CryptoTrader',
      description: 'Automated trading bot for cryptocurrency exchanges. Needs backtesting, risk management, and real-time trading capabilities.',
      language: 'python',
      budget: { min: 1500, max: 2500 },
      timeline: '4-5 weeks',
      difficulty: 'advanced',
      tags: ['Python', 'API Integration', 'Finance'],
      applications: 15,
      posted: '1 week ago',
      status: 'open'
    }
  ]);

  // Mock data for active collaborations
  const [activeCollaborations] = useState([
    {
      id: 1,
      title: 'E-learning Platform Rebuild',
      creator: 'WebWizard',
      client: 'EduTech Solutions',
      progress: 65,
      budget: 4500,
      deadline: '3 weeks',
      status: 'in_progress',
      lastUpdate: '2 hours ago'
    },
    {
      id: 2,
      title: 'Game Analytics Dashboard',
      creator: 'CodeMaster99',
      client: 'IndieGameStudio',
      progress: 30,
      budget: 2200,
      deadline: '5 weeks',
      status: 'in_progress',
      lastUpdate: '1 day ago'
    }
  ]);

  // Mock data for featured creators
  const [featuredCreators] = useState([
    {
      id: 1,
      name: 'CodeMaster99',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      specialties: ['Unity', 'C#', 'Game Development'],
      rating: 4.9,
      completedProjects: 23,
      hourlyRate: '$65-85',
      available: true
    },
    {
      id: 2,
      name: 'WebWizard',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      specialties: ['React', 'Node.js', 'Full-Stack'],
      rating: 4.8,
      completedProjects: 31,
      hourlyRate: '$55-75',
      available: true
    },
    {
      id: 3,
      name: 'DataNinja',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      specialties: ['Python', 'Data Science', 'ML'],
      rating: 4.7,
      completedProjects: 18,
      hourlyRate: '$45-65',
      available: false
    }
  ]);

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

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: designSystem.colors.status.success,
      intermediate: designSystem.colors.status.warning,
      advanced: designSystem.colors.status.error
    };
    return colors[difficulty] || designSystem.colors.status.info;
  };

  const getBudgetRange = (budget) => {
    return `$${budget.min.toLocaleString()} - $${budget.max.toLocaleString()}`;
  };

  // Community stats for header
  const stats = [
    { value: showcaseProjects.length, label: 'PROJECTS' },
    { value: showcaseProjects.reduce((sum, p) => sum + p.likes, 0), label: 'TOTAL LIKES' },
    { value: `$${showcaseProjects.reduce((sum, p) => sum + p.donations, 0).toLocaleString()}`, label: 'DONATED' },
    { value: commissionRequests.length, label: 'OPEN JOBS' }
  ];

  return (
    <PageLayout background="primary">
      <PageHeader
        title="🎨 Community Hub"
        subtitle="Showcase Projects • Find Work • Collaborate"
        stats={stats}
      />
      
      <SectionLayout spacing="default">
        <Tabs index={activeTab} onChange={setActiveTab} variant="soft-rounded" colorScheme="green">
          <TabList bg={designSystem.colors.backgrounds.secondary} p={1} borderRadius={designSystem.radii.lg}>
            <Tab 
              color={designSystem.colors.text.muted}
              _selected={{ 
                color: designSystem.colors.text.inverse,
                bg: designSystem.colors.brand.primary 
              }}
              fontFamily={designSystem.typography.fonts.mono}
              fontSize={designSystem.typography.sizes.sm}
              fontWeight={designSystem.typography.weights.bold}
            >
              🎨 SHOWCASE
            </Tab>
            <Tab 
              color={designSystem.colors.text.muted}
              _selected={{ 
                color: designSystem.colors.text.inverse,
                bg: designSystem.colors.brand.secondary 
              }}
              fontFamily={designSystem.typography.fonts.mono}
              fontSize={designSystem.typography.sizes.sm}
              fontWeight={designSystem.typography.weights.bold}
            >
              💼 COMMISSIONS
            </Tab>
            <Tab 
              color={designSystem.colors.text.muted}
              _selected={{ 
                color: designSystem.colors.text.inverse,
                bg: designSystem.colors.brand.accent 
              }}
              fontFamily={designSystem.typography.fonts.mono}
              fontSize={designSystem.typography.sizes.sm}
              fontWeight={designSystem.typography.weights.bold}
            >
              🤝 COLLABORATIONS
            </Tab>
            <Tab 
              color={designSystem.colors.text.muted}
              _selected={{ 
                color: designSystem.colors.text.inverse,
                bg: designSystem.colors.brand.error 
              }}
              fontFamily={designSystem.typography.fonts.mono}
              fontSize={designSystem.typography.sizes.sm}
              fontWeight={designSystem.typography.weights.bold}
            >
              👨‍💻 CREATORS
            </Tab>
          </TabList>

          <TabPanels>
            {/* PROJECT SHOWCASE TAB */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={6}>
                <HStack justify="space-between" w="100%">
                  <CustomText size="xl" color="brand" fontWeight="bold">
                    Featured Community Projects
                  </CustomText>
                  <CustomButton
                    bg={designSystem.colors.brand.primary}
                    color={designSystem.colors.text.inverse}
                    onClick={() => navigate('/submit-project')}
                    size="sm"
                  >
                    + Submit Project
                  </CustomButton>
                </HStack>

                <Grid 
                  templateColumns={{ 
                    base: "1fr", 
                    md: "repeat(2, 1fr)", 
                    lg: "repeat(3, 1fr)" 
                  }} 
                  gap={6}
                  w="100%"
                >
                  {showcaseProjects.map((project, index) => (
                    <GridItem key={project.id}>
                      <MotionBox
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: `0 0 25px ${designSystem.colors.brand.primary}33`
                        }}
                        whileTap={{ scale: 0.98 }}
                        bg={designSystem.colors.backgrounds.secondary}
                        border={`1px solid ${designSystem.colors.borders.default}`}
                        borderRadius={designSystem.radii.lg}
                        overflow="hidden"
                        cursor="pointer"
                        _hover={{
                          borderColor: designSystem.colors.brand.primary
                        }}
                        transition="all 0.3s ease"
                        h="100%"
                        display="flex"
                        flexDirection="column"
                      >
                        {/* Project Thumbnail */}
                        <Box position="relative" h="200px" overflow="hidden">
                          <Image
                            src={project.thumbnail}
                            alt={project.title}
                            w="100%"
                            h="100%"
                            objectFit="cover"
                          />
                          <Box
                            position="absolute"
                            top="10px"
                            left="10px"
                            display="flex"
                            gap={2}
                          >
                            <Badge bg={getDifficultyColor(project.difficulty)} color="white" fontSize="xs">
                              {project.difficulty.toUpperCase()}
                            </Badge>
                            <Badge bg={designSystem.colors.backgrounds.overlay} color="white" fontSize="xs">
                              {getLanguageIcon(project.language)} {project.language.toUpperCase()}
                            </Badge>
                          </Box>
                        </Box>

                        {/* Project Content */}
                        <VStack p={4} align="stretch" spacing={3} flex={1}>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={designSystem.colors.brand.primary}
                            noOfLines={2}
                            minH="48px"
                          >
                            {project.title}
                          </Text>

                          <HStack spacing={2}>
                            <Text fontSize="sm" color={designSystem.colors.brand.accent} fontWeight="bold">
                              by {project.creator}
                            </Text>
                          </HStack>

                          <Text
                            fontSize="sm"
                            color={designSystem.colors.text.secondary}
                            noOfLines={3}
                            flex={1}
                          >
                            {project.description}
                          </Text>

                          {/* Tags */}
                          <HStack spacing={1} flexWrap="wrap">
                            {project.tags.map((tag, i) => (
                              <Badge key={i} bg={designSystem.colors.backgrounds.surface} color={designSystem.colors.text.secondary} fontSize="xs">
                                {tag}
                              </Badge>
                            ))}
                          </HStack>

                          {/* Project Stats */}
                          <HStack justify="space-between" fontSize="sm">
                            <HStack spacing={3}>
                              <HStack spacing={1}>
                                <Text color={designSystem.colors.brand.error}>❤️</Text>
                                <Text color={designSystem.colors.text.secondary}>{project.likes}</Text>
                              </HStack>
                              <HStack spacing={1}>
                                <Text color={designSystem.colors.brand.accent}>💰</Text>
                                <Text color={designSystem.colors.text.secondary}>${project.donations}</Text>
                              </HStack>
                            </HStack>
                          </HStack>

                          {/* Action Buttons */}
                          <HStack spacing={2}>
                            <Button
                              bg={designSystem.colors.backgrounds.surface}
                              color={designSystem.colors.text.secondary}
                              size="sm"
                              flex={1}
                              fontFamily={designSystem.typography.fonts.mono}
                              fontSize="xs"
                              _hover={{ bg: designSystem.colors.backgrounds.elevated }}
                            >
                              👀 View
                            </Button>
                            <Button
                              bg={designSystem.colors.brand.accent}
                              color={designSystem.colors.text.inverse}
                              size="sm"
                              flex={1}
                              fontFamily={designSystem.typography.fonts.mono}
                              fontSize="xs"
                              _hover={{ bg: designSystem.colors.brand.accent }}
                            >
                              💝 Donate
                            </Button>
                            <Button
                              bg={designSystem.colors.brand.primary}
                              color={designSystem.colors.text.inverse}
                              size="sm"
                              flex={1}
                              fontFamily={designSystem.typography.fonts.mono}
                              fontSize="xs"
                              _hover={{ bg: designSystem.colors.brand.primary }}
                            >
                              🤝 Hire
                            </Button>
                          </HStack>
                        </VStack>
                      </MotionBox>
                    </GridItem>
                  ))}
                </Grid>
              </VStack>
            </TabPanel>

            {/* COMMISSION BOARD TAB */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={6}>
                <HStack justify="space-between" w="100%" align="start">
                  <VStack align="start" spacing={1}>
                    <CustomText size="xl" color="secondary" fontWeight="bold">
                      Active Commission Requests
                    </CustomText>
                    <CustomText size="sm" color="muted">
                      {commissionRequests.length} open projects • Total budget: $15,000+
                    </CustomText>
                  </VStack>
                  <CustomButton
                    bg={designSystem.colors.brand.secondary}
                    color={designSystem.colors.text.inverse}
                    onClick={() => navigate('/post-commission')}
                    size="sm"
                  >
                    + Post Project
                  </CustomButton>
                </HStack>

                <Grid 
                  templateColumns={{ 
                    base: "1fr", 
                    lg: "2fr 1fr" 
                  }} 
                  gap={6}
                  w="100%"
                >
                  {/* Commission Requests */}
                  <VStack spacing={4} align="stretch">
                    {commissionRequests.map((request, index) => (
                      <MotionBox
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card
                          variant="elevated"
                          p={6}
                          _hover={{
                            borderColor: designSystem.colors.brand.secondary,
                            boxShadow: `0 0 20px ${designSystem.colors.brand.secondary}33`
                          }}
                        >
                          <VStack spacing={4} align="stretch">
                            <HStack justify="space-between" align="start">
                              <VStack align="start" spacing={1} flex={1}>
                                <CustomText size="lg" color="secondary" fontWeight="bold">
                                  {request.title}
                                </CustomText>
                                <HStack spacing={2}>
                                  <CustomText size="sm" color="muted">
                                    by {request.client}
                                  </CustomText>
                                  <Text color={designSystem.colors.text.muted}>•</Text>
                                  <CustomText size="sm" color="muted">
                                    {request.posted}
                                  </CustomText>
                                </HStack>
                              </VStack>
                              <VStack align="end" spacing={1}>
                                <Badge bg={getDifficultyColor(request.difficulty)} color="white" fontSize="xs">
                                  {request.difficulty.toUpperCase()}
                                </Badge>
                                <Badge bg={designSystem.colors.backgrounds.surface} color="white" fontSize="xs">
                                  {getLanguageIcon(request.language)} {request.language.toUpperCase()}
                                </Badge>
                              </VStack>
                            </HStack>

                            <CustomText size="sm" color="secondary" lineHeight="1.6">
                              {request.description}
                            </CustomText>

                            <HStack spacing={1} flexWrap="wrap">
                              {request.tags.map((tag, i) => (
                                <Badge key={i} bg={designSystem.colors.brand.secondary} color="white" fontSize="xs">
                                  {tag}
                                </Badge>
                              ))}
                            </HStack>

                            <HStack justify="space-between" align="center">
                              <VStack align="start" spacing={0}>
                                <CustomText size="sm" color="muted">Budget</CustomText>
                                <CustomText size="lg" color="accent" fontWeight="bold">
                                  {getBudgetRange(request.budget)}
                                </CustomText>
                              </VStack>
                              <VStack align="center" spacing={0}>
                                <CustomText size="sm" color="muted">Timeline</CustomText>
                                <CustomText size="sm" color="secondary" fontWeight="bold">
                                  {request.timeline}
                                </CustomText>
                              </VStack>
                              <VStack align="end" spacing={0}>
                                <CustomText size="sm" color="muted">Applications</CustomText>
                                <CustomText size="lg" color="brand" fontWeight="bold">
                                  {request.applications}
                                </CustomText>
                              </VStack>
                            </HStack>

                            <HStack spacing={2}>
                              <CustomButton
                                variant="secondary"
                                size="sm"
                                flex={1}
                              >
                                📋 View Details
                              </CustomButton>
                              <CustomButton
                                bg={designSystem.colors.brand.secondary}
                                color={designSystem.colors.text.inverse}
                                size="sm"
                                flex={1}
                              >
                                🚀 Apply Now
                              </CustomButton>
                            </HStack>
                          </VStack>
                        </Card>
                      </MotionBox>
                    ))}
                  </VStack>

                  {/* Featured Creators Sidebar */}
                  <VStack spacing={4} align="stretch">
                    <Card variant="default" p={4}>
                      <CustomText size="md" color="brand" fontWeight="bold" mb={3}>
                        🌟 Featured Creators
                      </CustomText>
                      <VStack spacing={3} align="stretch">
                        {featuredCreators.map((creator) => (
                          <Box
                            key={creator.id}
                            bg={designSystem.colors.backgrounds.secondary}
                            p={3}
                            borderRadius={designSystem.radii.md}
                            border={`1px solid ${designSystem.colors.borders.default}`}
                            _hover={{
                              borderColor: designSystem.colors.brand.primary,
                              cursor: 'pointer'
                            }}
                          >
                            <HStack spacing={3}>
                              <Image
                                src={creator.avatar}
                                alt={creator.name}
                                w="40px"
                                h="40px"
                                borderRadius="full"
                                objectFit="cover"
                              />
                              <VStack align="start" spacing={1} flex={1}>
                                <HStack justify="space-between" w="100%">
                                  <CustomText size="sm" color="brand" fontWeight="bold">
                                    {creator.name}
                                  </CustomText>
                                  <Badge 
                                    bg={creator.available ? designSystem.colors.status.success : designSystem.colors.status.warning} 
                                    color="white" 
                                    fontSize="xs"
                                  >
                                    {creator.available ? 'AVAILABLE' : 'BUSY'}
                                  </Badge>
                                </HStack>
                                <CustomText size="xs" color="muted">
                                  ⭐ {creator.rating} • {creator.completedProjects} projects
                                </CustomText>
                                <CustomText size="xs" color="secondary">
                                  {creator.hourlyRate}/hr
                                </CustomText>
                                <HStack spacing={1} flexWrap="wrap">
                                  {creator.specialties.slice(0, 2).map((skill, i) => (
                                    <Badge key={i} bg={designSystem.colors.backgrounds.surface} color={designSystem.colors.text.muted} fontSize="xs">
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

                    <Card variant="default" p={4}>
                      <CustomText size="md" color="accent" fontWeight="bold" mb={3}>
                        💡 Quick Tips
                      </CustomText>
                      <VStack spacing={2} align="start" fontSize="xs" color={designSystem.colors.text.muted}>
                        <CustomText size="xs">✓ Be specific about your requirements</CustomText>
                        <CustomText size="xs">✓ Set realistic budgets and timelines</CustomText>
                        <CustomText size="xs">✓ Check creator portfolios before hiring</CustomText>
                        <CustomText size="xs">✓ Use escrow for secure payments</CustomText>
                      </VStack>
                    </Card>
                  </VStack>
                </Grid>
              </VStack>
            </TabPanel>

            {/* ACTIVE COLLABORATIONS TAB */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={6}>
                <HStack justify="space-between" w="100%">
                  <CustomText size="xl" color="accent" fontWeight="bold">
                    Active Collaborations
                  </CustomText>
                  <CustomText size="sm" color="muted">
                    {activeCollaborations.length} ongoing projects
                  </CustomText>
                </HStack>

                <VStack spacing={4} w="100%">
                  {activeCollaborations.map((collab, index) => (
                    <MotionBox
                      key={collab.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      w="100%"
                    >
                      <Card variant="elevated" p={6}>
                        <VStack spacing={4} align="stretch">
                          <HStack justify="space-between" align="start">
                            <VStack align="start" spacing={1}>
                              <CustomText size="lg" color="accent" fontWeight="bold">
                                {collab.title}
                              </CustomText>
                              <HStack spacing={2}>
                                <CustomText size="sm" color="brand">
                                  {collab.creator}
                                </CustomText>
                                <Text color={designSystem.colors.text.muted}>•</Text>
                                <CustomText size="sm" color="muted">
                                  {collab.client}
                                </CustomText>
                              </HStack>
                            </VStack>
                            <Badge bg={designSystem.colors.brand.accent} color="white">
                              {collab.status.replace('_', ' ').toUpperCase()}
                            </Badge>
                          </HStack>

                          <HStack spacing={6}>
                            <VStack align="start" spacing={1} flex={1}>
                              <CustomText size="sm" color="muted">Progress</CustomText>
                              <HStack w="100%" spacing={2}>
                                <Box 
                                  flex={1} 
                                  bg={designSystem.colors.backgrounds.surface} 
                                  h="8px" 
                                  borderRadius="4px"
                                  overflow="hidden"
                                >
                                  <Box
                                    bg={designSystem.colors.brand.accent}
                                    h="100%"
                                    w={`${collab.progress}%`}
                                    transition="width 0.3s"
                                  />
                                </Box>
                                <CustomText size="sm" color="accent" fontWeight="bold">
                                  {collab.progress}%
                                </CustomText>
                              </HStack>
                            </VStack>
                            <VStack align="center" spacing={0}>
                              <CustomText size="sm" color="muted">Budget</CustomText>
                              <CustomText size="lg" color="brand" fontWeight="bold">
                                ${collab.budget.toLocaleString()}
                              </CustomText>
                            </VStack>
                            <VStack align="end" spacing={0}>
                              <CustomText size="sm" color="muted">Deadline</CustomText>
                              <CustomText size="sm" color="secondary" fontWeight="bold">
                                {collab.deadline}
                              </CustomText>
                            </VStack>
                          </HStack>

                          <HStack justify="space-between" align="center">
                            <CustomText size="xs" color="muted">
                              Last update: {collab.lastUpdate}
                            </CustomText>
                            <HStack spacing={2}>
                              <CustomButton variant="secondary" size="sm">
                                💬 Chat
                              </CustomButton>
                              <CustomButton variant="secondary" size="sm">
                                📁 Files
                              </CustomButton>
                              <CustomButton
                                bg={designSystem.colors.brand.accent}
                                color={designSystem.colors.text.inverse}
                                size="sm"
                              >
                                📊 Details
                              </CustomButton>
                            </HStack>
                          </HStack>
                        </VStack>
                      </Card>
                    </MotionBox>
                  ))}
                </VStack>
              </VStack>
            </TabPanel>

            {/* CREATORS DIRECTORY TAB */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={6}>
                <HStack justify="space-between" w="100%">
                  <CustomText size="xl" color="error" fontWeight="bold">
                    Creator Directory
                  </CustomText>
                  <CustomButton
                    bg={designSystem.colors.brand.error}
                    color={designSystem.colors.text.inverse}
                    onClick={() => navigate('/creator-profile')}
                    size="sm"
                  >
                    + Create Profile
                  </CustomButton>
                </HStack>

                <Grid 
                  templateColumns={{ 
                    base: "1fr", 
                    md: "repeat(2, 1fr)", 
                    lg: "repeat(3, 1fr)" 
                  }} 
                  gap={6}
                  w="100%"
                >
                  {featuredCreators.map((creator, index) => (
                    <GridItem key={creator.id}>
                      <MotionBox
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Card variant="elevated" textAlign="center">
                          <VStack spacing={4}>
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
                                color="white" 
                                fontSize="xs"
                                borderRadius="full"
                              >
                                {creator.available ? '🟢' : '🟡'}
                              </Badge>
                            </Box>
                            
                            <VStack spacing={2}>
                              <CustomText size="lg" color="brand" fontWeight="bold">
                                {creator.name}
                              </CustomText>
                              <HStack spacing={3}>
                                <CustomText size="sm" color="accent">
                                  ⭐ {creator.rating}
                                </CustomText>
                                <CustomText size="sm" color="secondary">
                                  {creator.completedProjects} projects
                                </CustomText>
                              </HStack>
                              <CustomText size="sm" color="muted">
                                {creator.hourlyRate}/hour
                              </CustomText>
                            </VStack>

                            <HStack spacing={1} flexWrap="wrap" justify="center">
                              {creator.specialties.map((skill, i) => (
                                <Badge key={i} bg={designSystem.colors.brand.primary} color="white" fontSize="xs">
                                  {skill}
                                </Badge>
                              ))}
                            </HStack>

                            <HStack spacing={2} w="100%">
                              <CustomButton variant="secondary" size="sm" flex={1}>
                                📁 Portfolio
                              </CustomButton>
                              <CustomButton
                                bg={creator.available ? designSystem.colors.brand.primary : designSystem.colors.interactive.disabled}
                                color={designSystem.colors.text.inverse}
                                size="sm"
                                flex={1}
                                disabled={!creator.available}
                              >
                                {creator.available ? '🤝 Hire' : '💬 Message'}
                              </CustomButton>
                            </HStack>
                          </VStack>
                        </Card>
                      </MotionBox>
                    </GridItem>
                  ))}
                </Grid>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SectionLayout>
    </PageLayout>
  );
};

export default CommunityPage;