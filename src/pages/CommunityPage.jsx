import React, { useState, useEffect } from 'react';
import { Box, Grid, GridItem, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useGameProgress } from '../hooks/useGameProgress';
import { useDonationSystem } from '../hooks/useDonationSystem';
import { useCommissionSystem } from '../hooks/useCommissionSystem';
import { useCollaborationSystem } from '../hooks/useCollaborationSystem';
import { PageLayout, SectionLayout, GridLayout } from '../design/layouts/PageLayout';
import { CustomText } from '../design/components/Typography';
import { Button } from '../design/components/Button';
import { PageHeader } from '../design/components/PageHeader';
import { 
  CommissionCard, 
  CollaborationCard, 
  CreatorCard, 
  EnhancedProjectCard,
  FeaturedCreatorsSidebar,
  TipsCard 
} from '../design/components/CommunityComponents';
import { ContentLibrary } from '../design/components/ContentLibrary';
import { CourseCard } from '../design/components/Card';
import { designSystem } from '../design/system/DesignSystem';
import { TieredDonationModal } from '../components/modals/TieredDonationModal';

const MotionBox = motion(Box);

const CommunityPage = () => {
  const navigate = useNavigate();
  const { progress } = useGameProgress();
  const [activeTab, setActiveTab] = useState(0);
  const { processDonation, getHighestActiveTier, getAccessibleContent, donationTiers } = useDonationSystem();
  const { hasCollaborationProfile, createCollaborationRequest } = useCollaborationSystem();
  const [accessibleContent, setAccessibleContent] = useState(null);
  const [activeDonationProject, setActiveDonationProject] = useState(null);
  const [isUserProfileComplete, setIsUserProfileComplete] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  // Fetch user's accessible content on mount
  useEffect(() => {
    const content = getAccessibleContent();
    setAccessibleContent(content);
    setIsUserProfileComplete(hasCollaborationProfile());
  }, []);

  // Mock data for showcase projects (existing)
  const [showcaseProjects] = useState([
    {
      id: 1,
      title: 'Space Invaders Unity Game',
      creator: 'CodeMaster99',
      description: 'A complete Space Invaders clone built with Unity and C#. Features power-ups, multiple levels, and particle effects.',
      language: 'csharp',
      thumbnail_url: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 245,
      donations: 1250,
      fundingGoal: 2000,
      tags: ['Unity', 'Game Dev', '2D'],
      difficulty: 'intermediate',
      status: 'completed',
      acceptsDonations: true,
      seekingCollaborators: true,
      collaborationSlots: 2,
      currentCollaborators: 0,
      price: 0,
      instructor_name: 'CodeMaster99',
      lessons_count: 0,
      duration_hours: 0,
      rating: 4.9,
      students_count: 0
    },
    {
      id: 2,
      title: 'E-commerce React App',
      creator: 'WebWizard',
      description: 'Full-stack e-commerce platform with React frontend, Node.js backend, and Stripe integration.',
      language: 'javascript',
      thumbnail_url: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 189,
      donations: 890,
      fundingGoal: 1500,
      tags: ['React', 'Node.js', 'Full-Stack'],
      difficulty: 'advanced',
      status: 'completed',
      acceptsDonations: true,
      seekingCollaborators: false,
      price: 0,
      instructor_name: 'WebWizard',
      lessons_count: 0,
      duration_hours: 0,
      rating: 4.8,
      students_count: 0
    },
    {
      id: 3,
      title: 'Python Data Visualizer',
      creator: 'DataNinja',
      description: 'Interactive data visualization tool using Python, Pandas, and Matplotlib. Perfect for analyzing CSV files.',
      language: 'python',
      thumbnail_url: 'https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=400',
      likes: 156,
      donations: 675,
      fundingGoal: 1000,
      tags: ['Python', 'Data Science', 'Visualization'],
      difficulty: 'beginner',
      status: 'completed',
      acceptsDonations: false,
      seekingCollaborators: true,
      collaborationSlots: 1,
      currentCollaborators: 0,
      price: 0,
      instructor_name: 'DataNinja',
      lessons_count: 0,
      duration_hours: 0,
      rating: 4.7,
      students_count: 0
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

  // Handle donate button click
  const handleProjectDonate = (project) => {
    setActiveDonationProject(project);
    setIsDonationModalOpen(true);
  };

  // Handle donation completion
  const handleDonationComplete = (donation) => {
    // Refresh accessible content
    const content = getAccessibleContent();
    setAccessibleContent(content);
  };

  // Community stats for header
  const stats = [
    { value: showcaseProjects.length, label: 'PROJECTS' },
    { value: showcaseProjects.reduce((sum, p) => sum + p.likes, 0), label: 'TOTAL LIKES' },
    { value: `$${showcaseProjects.reduce((sum, p) => sum + p.donations, 0).toLocaleString()}`, label: 'DONATED' },
    { value: commissionRequests.length, label: 'OPEN JOBS' }
  ];

  // Event handlers
  const handleProjectView = (project) => {
    console.log('View project:', project);
    navigate(`/project/${project.id}`);
  };

  const handleProjectDonate = (project) => {
    handleProjectDonate(project);
  };

  const handleProjectHire = (project) => {
    console.log('Hire creator:', project.creator);
  };

  const handleCommissionView = (commission) => {
    navigate(`/commission/${commission.id}`);
  };

  const handleCommissionApply = (commission) => {
    navigate(`/commission/${commission.id}`);
  };

  const handleCollaborationView = (collaboration) => {
    console.log('View collaboration:', collaboration);
  };

  const handleCreatorView = (creator) => {
    console.log('View creator profile:', creator);
  };

  const handleCreatorHire = (creator) => {
    console.log('Hire creator:', creator);
  };

  return (
    <PageLayout background="primary">
      <PageHeader
        title="🎨 Community Hub"
        subtitle="Showcase Projects • Find Work • Collaborate"
        stats={stats}
      />
      
      <SectionLayout spacing="default">
        <Tabs 
          index={activeTab} 
          onChange={setActiveTab} 
          variant="soft-rounded" 
          colorScheme="green"
        >
          <Box
            bg={designSystem.colors.backgrounds.secondary}
            p={designSystem.spacing[1]}
            borderRadius={designSystem.radii.lg}
            border={`1px solid ${designSystem.colors.borders.default}`}
          >
            <TabList>
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
                🎁 REWARDS
              </Tab>
            </TabList>
          </Box>

          <TabPanels>
            {/* ENHANCED PROJECT SHOWCASE TAB */}
            <TabPanel p={0} pt={designSystem.spacing[6]}>
              <SectionLayout spacing="loose">
                <Box display="flex" justifyContent="space-between" alignItems="center" w="100%">
                  <CustomText size="xl" color="brand" fontWeight={designSystem.typography.weights.bold}>
                    Community Project Showcase
                  </CustomText>
                  <Button
                    bg={designSystem.colors.brand.primary}
                    color={designSystem.colors.text.inverse}
                    onClick={() => navigate('/submit-project')}
                    size="sm"
                  >
                    + Submit Project
                  </Button>
                </Box>

                <GridLayout 
                  columns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                  gap="default"
                >
                  {showcaseProjects.map((project, index) => (
                    <MotionBox
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <EnhancedProjectCard
                        project={project}
                        onViewDetails={() => navigate(`/project/${project.id}`)}
                        onDonate={() => handleProjectDonate(project)}
                        onCollaborate={() => handleProjectDonate(project)}
                      />
                    </MotionBox>
                  ))}
                </GridLayout>
              </SectionLayout>
            </TabPanel>

            {/* COMMISSION BOARD TAB */}
            <TabPanel p={0} pt={designSystem.spacing[6]}>
              <SectionLayout spacing="loose">
                <Box display="flex" justifyContent="space-between" alignItems="start" w="100%">
                  <Box>
                    <CustomText size="xl" color="secondary" fontWeight={designSystem.typography.weights.bold}>
                      Active Commission Requests
                    </CustomText>
                    <CustomText size="sm" color="muted">
                      {commissionRequests.length} open projects • Total budget: $15,000+
                    </CustomText>
                  </Box>
                  <Button
                    bg={designSystem.colors.brand.secondary}
                    color={designSystem.colors.text.inverse}
                    onClick={() => navigate('/post-commission')}
                    size="sm"
                  >
                    + Post Project
                  </Button>
                </Box>

                <Grid 
                  templateColumns={{ base: "1fr", lg: "2fr 1fr" }} 
                  gap={designSystem.spacing[6]}
                  w="100%"
                >
                  {/* Commission Requests */}
                  <Box display="flex" flexDirection="column" gap={designSystem.spacing[4]}>
                    {commissionRequests.map((request, index) => (
                      <CommissionCard
                        key={request.id}
                        request={request}
                        onViewDetails={handleCommissionView}
                        onApply={handleCommissionApply}
                      />
                    ))}
                  </Box>

                  {/* Sidebar */}
                  <Box display="flex" flexDirection="column" gap={designSystem.spacing[4]}>
                    <FeaturedCreatorsSidebar 
                      creators={featuredCreators}
                      onCreatorClick={handleCreatorView}
                    />

                    <TipsCard
                      title="Quick Tips"
                      icon="💡"
                      tips={[
                        "✓ Be specific about your requirements",
                        "✓ Set realistic budgets and timelines",
                        "✓ Check creator portfolios before hiring",
                        "✓ Use escrow for secure payments"
                      ]}
                    />
                  </Box>
                </Grid>
              </SectionLayout>
            </TabPanel>

            {/* ACTIVE COLLABORATIONS TAB */}
            <TabPanel p={0} pt={designSystem.spacing[6]}>
              <SectionLayout spacing="loose">
                <Box display="flex" justifyContent="space-between" alignItems="center" w="100%">
                  <CustomText size="xl" color="accent" fontWeight={designSystem.typography.weights.bold}>
                    Active Collaborations
                  </CustomText>
                  <CustomText size="sm" color="muted">
                    {activeCollaborations.length} ongoing projects
                  </CustomText>
                </Box>

                <Box display="flex" flexDirection="column" gap={designSystem.spacing[4]} w="100%">
                  {activeCollaborations.map((collab, index) => (
                    <CollaborationCard
                      key={collab.id}
                      collab={collab}
                      onViewDetails={handleCollaborationView}
                    />
                  ))}
                </Box>
              </SectionLayout>
            </TabPanel>

            {/* CREATORS DIRECTORY TAB */}
            <TabPanel p={0} pt={designSystem.spacing[6]}>
              <SectionLayout spacing="loose">
                <Box display="flex" justifyContent="space-between" alignItems="center" w="100%">
                  <CustomText size="xl" color="error" fontWeight={designSystem.typography.weights.bold}>
                    Creator Directory
                  </CustomText>
                  <Button
                    bg={designSystem.colors.brand.error}
                    color={designSystem.colors.text.inverse}
                    onClick={() => navigate('/creator-profile')}
                    size="sm"
                  >
                    + Create Profile
                  </Button>
                </Box>

                <GridLayout 
                  columns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                  gap="default"
                >
                  {featuredCreators.map((creator, index) => (
                    <MotionBox
                      key={creator.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <CreatorCard
                        creator={creator}
                        onViewProfile={handleCreatorView}
                        onHire={handleCreatorHire}
                      />
                    </MotionBox>
                  ))}
                </GridLayout>
              </SectionLayout>
            </TabPanel>

            {/* REWARDS HUB TAB */}
            <TabPanel p={0} pt={designSystem.spacing[6]}>
              <SectionLayout spacing="loose">
                <Box w="100%">
                  <ContentLibrary
                    accessibleContent={accessibleContent || { tools: [], tutorials: [], lockedTools: [], lockedTutorials: [] }}
                    currentTier={getHighestActiveTier()}
                    onToolPreview={(tool) => console.log('Preview tool', tool)}
                    onToolDownload={(tool) => console.log('Download tool', tool)}
                    onTutorialPreview={(tutorial) => console.log('Preview tutorial', tutorial)}
                    onTutorialWatch={(tutorial) => console.log('Watch tutorial', tutorial)}
                    onUpgradeTier={() => {
                      // Set a default project for donation if none is selected
                      if (!activeDonationProject && showcaseProjects.length > 0) {
                        setActiveDonationProject(showcaseProjects[0]);
                      }
                      setIsDonationModalOpen(true);
                    }}
                  />
                </Box>
              </SectionLayout>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SectionLayout>
      
      {/* Tiered Donation Modal */}
      <TieredDonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        project={activeDonationProject}
        onDonationComplete={handleDonationComplete}
      />
    </PageLayout>
  );
};

export default CommunityPage;