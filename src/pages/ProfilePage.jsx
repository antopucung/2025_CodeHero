import React from 'react';
import { Grid, Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useProgressionSystem } from '../hooks/useProgressionSystem';
import { useUserEnrollment } from '../hooks/useUserEnrollment';
import { PageLayout, SectionLayout } from '../design/layouts/PageLayout';
import { PageHeader } from '../design/components/PageHeader';
import { CustomText } from '../design/components/Typography';
import { ProgressionDashboard } from '../components/progression/ProgressionDashboard';
import { ProfileCard } from '../components/profile/ProfileCard';
import { AchievementsSection } from '../components/profile/AchievementsSection';
import { LanguageProgress } from '../components/profile/LanguageProgress';
import { EnrolledCourses } from '../components/profile/EnrolledCourses';
import { RecentActivity } from '../components/profile/RecentActivity';
import { designSystem } from '../design/system/DesignSystem';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { 
    profile, 
    achievements, 
    certifications, 
    xpHistory,
    loading, 
    error,
    user 
  } = useProgressionSystem();
  const { getEnrolledCourses, getAllAchievements } = useUserEnrollment();
  const [enrolledCourses, setEnrolledCourses] = React.useState([]);
  const [courseAchievements, setCourseAchievements] = React.useState([]);

  // Mock data for demo when user is not logged in
  const mockProfile = {
    overall_level: 7,
    total_xp: 3250,
    xp_to_next_level: 750,
    best_wpm: 67,
    best_accuracy: 98,
    total_challenges_completed: 42,
    total_lessons_completed: 28,
    streak_days: 12,
    longest_streak: 28,
    community_contributions: 15,
    mentorship_hours: 8,
    total_projects_created: 3,
    language_progress: {
      javascript: { level: 5, xp: 450 },
      typescript: { level: 3, xp: 180 },
      python: { level: 4, xp: 320 },
      csharp: { level: 6, xp: 520 }
    }
  };

  const mockAchievements = [
    {
      id: 1,
      achievement_definitions: {
        title: 'Speed Demon',
        description: 'Achieved 60+ WPM typing speed',
        icon: '⚡',
        color: '#ff6b6b',
        rarity: 'legendary'
      }
    },
    {
      id: 2,
      achievement_definitions: {
        title: 'Perfectionist',
        description: 'Completed challenges with 100% accuracy',
        icon: '💎',
        color: '#9c27b0',
        rarity: 'epic'
      }
    },
    {
      id: 3,
      achievement_definitions: {
        title: 'Community Helper',
        description: 'Made 10+ helpful community contributions',
        icon: '🤝',
        color: '#4ecdc4',
        rarity: 'rare'
      }
    }
  ];

  const mockCertifications = [
    {
      id: 1,
      certificate_number: 'TI-2024-001',
      status: 'active',
      issued_at: '2024-01-15T10:00:00Z',
      expires_at: '2025-01-15T10:00:00Z',
      certification_types: {
        title: 'JavaScript Fundamentals',
        description: 'Demonstrates proficiency in JavaScript programming'
      }
    }
  ];

  const mockXpHistory = [
    {
      id: 1,
      xp_amount: 150,
      transaction_type: 'earned',
      source_activity: 'lesson_completion',
      description: 'Completed Unity C# lesson',
      created_at: '2024-01-20T14:30:00Z',
      xp_categories: {
        category_name: 'lesson_completion'
      }
    },
    {
      id: 2,
      xp_amount: 200,
      transaction_type: 'earned',
      source_activity: 'typing_challenge',
      description: 'Perfect typing challenge completion',
      created_at: '2024-01-20T13:15:00Z',
      xp_categories: {
        category_name: 'typing_challenge'
      }
    }
  ];
  const mockEnrolledCourses = [
    {
      id: 1,
      title: 'Unity C# 101',
      slug: 'unity-csharp-101',
      description: 'Learn the fundamentals of C# programming in Unity',
      language: 'csharp',
      lessons_count: 12,
      duration_hours: 8,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      slug: 'advanced-javascript',
      description: 'Master advanced JavaScript concepts and patterns',
      language: 'javascript',
      lessons_count: 15,
      duration_hours: 12,
      rating: 4.9
    }
  ];

  React.useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        if (user) {
          const courses = await getEnrolledCourses();
          setEnrolledCourses(courses || []);
        } else {
          setEnrolledCourses(mockEnrolledCourses);
        }
        
        // Get achievements from courses
        if (user) {
          const achievements = getAllAchievements();
          setCourseAchievements(achievements || []);
        } else {
          setCourseAchievements(['speed_demon', 'perfectionist']);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        // Use mock data if fetching fails
        setEnrolledCourses(mockEnrolledCourses);
        setCourseAchievements(['speed_demon', 'perfectionist']);
      }
    };
    fetchEnrolledCourses();
  }, [user, getEnrolledCourses, getAllAchievements]);

  // Mock user data - in a real app this would come from authentication
  const userData = {
    name: 'Code Ninja',
    username: '@codeninja2024',
    email: 'codeninja@terminal-ide.dev',
    joinDate: 'January 2024',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Passionate developer learning through gamified coding challenges. Love TypeScript, React, and building awesome projects!',
    badges: ['Speed Demon', 'Code Wizard', 'Perfect Streak', 'Combo Master'],
    githubProfile: 'https://github.com/codeninja',
    portfolio: 'https://codeninja.dev'
  };

  // Use actual data if available, otherwise use mock data for demo
  const displayProfile = profile || mockProfile;
  const displayAchievements = (achievements && achievements.length > 0) ? achievements : mockAchievements;
  const displayCertifications = (certifications && certifications.length > 0) ? certifications : mockCertifications;
  const displayXpHistory = (xpHistory && xpHistory.length > 0) ? xpHistory : mockXpHistory;
  const displayEnrolledCourses = enrolledCourses.length > 0 ? enrolledCourses : mockEnrolledCourses;

  // Prepare stats with safe fallbacks
  const stats = [
    { value: displayProfile?.overall_level || 1, label: 'LEVEL' },
    { value: displayProfile?.total_challenges_completed || 0, label: 'CHALLENGES' },
    { value: displayProfile?.achievements?.length || displayAchievements?.length || 0, label: 'ACHIEVEMENTS' }
  ];

  // Functions for navigation
  const handleNavigateToMarketplace = () => {
    navigate('/marketplace');
  };

  const handleNavigateToCourse = (courseSlug) => {
    navigate(`/modules/${courseSlug}`);
  };

  // Show error state if there's an error and user is authenticated
  if (error && user) {
    return (
      <PageLayout background="primary">
        <SectionLayout spacing="default">
          <Box 
            bg={designSystem.colors.backgrounds.secondary}
            p={designSystem.spacing[8]}
            borderRadius="md"
            textAlign="center"
            maxW="600px"
            mx="auto"
          >
            <CustomText size="lg" color="error" mb={designSystem.spacing[4]}>
              ⚠️ Profile Error
            </CustomText>
            <CustomText color="muted" mb={designSystem.spacing[4]}>
              There was an error loading your profile data: {error}
            </CustomText>
            <CustomText size="sm" color="secondary">
              Please try refreshing the page or contact support if the issue persists.
            </CustomText>
          </Box>
        </SectionLayout>
      </PageLayout>
    );
  }
  return (
    <PageLayout background="primary">
      {!profile && !loading && (
        <Box 
          bg="rgba(255, 217, 61, 0.1)" 
          border="1px solid #ffd93d" 
          borderRadius="md" 
          p={4} 
          mb={6}
          textAlign="center"
        >
          <CustomText color="#ffd93d" fontWeight="bold">
            🎮 Demo Mode - This is a preview of the profile system. Log in to track your real progress!
          </CustomText>
        </Box>
      )}
      <PageHeader
        title="👤 User Profile"
        subtitle="Track Your Coding Journey & Achievements"
        stats={stats}
      />
      
      <SectionLayout spacing="default">
        {/* Show loading state only when actually loading and user is authenticated */}
        {loading && user && (
          <Box p={designSystem.spacing[8]} textAlign="center">
            <CustomText color="muted">Loading your progress...</CustomText>
          </Box>
        )}
        
        {/* Show login prompt when not authenticated and not loading */}
        {!loading && !user && (
          <Box 
            bg={designSystem.colors.backgrounds.secondary}
            p={designSystem.spacing[8]}
            borderRadius="md"
            textAlign="center"
            maxW="600px"
            mx="auto"
          >
            <CustomText size="lg" color="secondary" mb={designSystem.spacing[4]}>
              🔐 Login Required
            </CustomText>
            <CustomText color="muted" mb={designSystem.spacing[4]}>
              Please log in to view your personalized profile and track your learning progress.
            </CustomText>
            <VStack spacing={designSystem.spacing[2]} align="start">
              <CustomText size="sm" color="secondary">With an account you can:</CustomText>
              <CustomText size="sm" color="muted">📊 Track XP and level progression</CustomText>
              <CustomText size="sm" color="muted">🏆 Unlock achievements and badges</CustomText>
              <CustomText size="sm" color="muted">📜 Earn professional certifications</CustomText>
              <CustomText size="sm" color="muted">📈 View detailed learning analytics</CustomText>
            </VStack>
          </Box>
        )}
        
        {/* Show profile content when not loading */}
        {(!loading || !user) && (
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab>📊 Progression</Tab>
            <Tab>👤 Profile</Tab>
            <Tab>📚 Courses</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel p={0} pt={6}>
              <ProgressionDashboard 
                profile={displayProfile}
                achievements={displayAchievements}
                certifications={displayCertifications}
                xpHistory={displayXpHistory}
                isDemo={!profile}
              />
            </TabPanel>
            
            <TabPanel p={0} pt={6}>
              <Grid 
                templateColumns={{ base: "1fr", lg: "1fr 2fr" }} 
                gap={designSystem.spacing[6]} 
                w="100%"
              >
                {/* Left Column - Profile Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[6] }}>
                  {displayProfile && <ProfileCard userData={userData} progress={displayProfile} />}
                  <AchievementsSection 
                    achievements={[
                      ...(displayAchievements?.map(a => a.achievement_definitions?.title || a.achievement_key) || []), 
                      ...(courseAchievements || []).map(a => typeof a === 'string' ? a.replace('_', ' ') : a)
                    ]} 
                  />
                </div>
      
                {/* Right Column - Progress & Courses */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[6] }}>
                  <LanguageProgress languageProgress={displayProfile?.language_progress || {}} />
                  <EnrolledCourses 
                    enrolledCourses={displayEnrolledCourses}
                    onNavigateToMarketplace={handleNavigateToMarketplace}
                    onNavigateToCourse={handleNavigateToCourse}
                  />
                  <RecentActivity />
                </div>
              </Grid>
            </TabPanel>
            
            <TabPanel p={0} pt={6}>
              <EnrolledCourses 
                enrolledCourses={displayEnrolledCourses}
                onNavigateToMarketplace={handleNavigateToMarketplace}
                onNavigateToCourse={handleNavigateToCourse}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
        )}
      </SectionLayout>
    </PageLayout>
  );
};

export default ProfilePage;