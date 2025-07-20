import React from 'react';
import { Grid, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useProgressionSystem } from '../hooks/useProgressionSystem';
import { useUserEnrollment } from '../hooks/useUserEnrollment';
import { PageLayout, SectionLayout } from '../design/layouts/PageLayout';
import { PageHeader } from '../design/components/PageHeader';
import { ProgressionDashboard } from '../components/progression/ProgressionDashboard';
import { ProfileCard } from '../components/profile/ProfileCard';
import { AchievementsSection } from '../components/profile/AchievementsSection';
import { LanguageProgress } from '../components/profile/LanguageProgress';
import { EnrolledCourses } from '../components/profile/EnrolledCourses';
import { RecentActivity } from '../components/profile/RecentActivity';
import { designSystem } from '../design/system/DesignSystem';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { profile, achievements, loading } = useProgressionSystem();
  const { getEnrolledCourses, getAllAchievements } = useUserEnrollment();
  const [enrolledCourses, setEnrolledCourses] = React.useState([]);
  const [courseAchievements, setCourseAchievements] = React.useState([]);

  React.useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const courses = await getEnrolledCourses();
        setEnrolledCourses(courses);
        
        // Get achievements from courses
        const achievements = getAllAchievements();
        setCourseAchievements(achievements);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
      }
    };
    fetchEnrolledCourses();
  }, []);

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

  const stats = [
    { value: profile?.overall_level || 1, label: 'LEVEL' },
    { value: profile?.best_wpm || 0, label: 'BEST WPM' },
    { value: profile?.total_challenges_completed || 0, label: 'CHALLENGES' },
    { value: (achievements?.length || 0) + courseAchievements.length, label: 'ACHIEVEMENTS' }
  ];

  const handleNavigateToMarketplace = () => navigate('/marketplace');
  const handleNavigateToCourse = (slug) => navigate(`/modules/${slug}`);

  if (loading) {
    return (
      <PageLayout background="primary">
        <PageHeader
          title="👤 User Profile"
          subtitle="Loading your progress..."
          stats={[]}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout background="primary">
      <PageHeader
        title="👤 User Profile"
        subtitle="Track Your Coding Journey & Achievements"
        stats={stats}
      />
      
      <SectionLayout spacing="default">
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab>📊 Progression</Tab>
            <Tab>👤 Profile</Tab>
            <Tab>📚 Courses</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel p={0} pt={6}>
              <ProgressionDashboard />
            </TabPanel>
            
            <TabPanel p={0} pt={6}>
              <Grid 
                templateColumns={{ base: "1fr", lg: "1fr 2fr" }} 
                gap={designSystem.spacing[6]} 
                w="100%"
              >
                {/* Left Column - Profile Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[6] }}>
                  <ProfileCard userData={userData} progress={profile || { level: 1 }} />
                  <AchievementsSection 
                    achievements={[
                      ...(achievements?.map(a => a.achievement_definitions?.title || a.achievement_key) || []), 
                      ...courseAchievements.map(a => a.replace('_', ' '))
                    ]} 
                  />
                </div>
      
                {/* Right Column - Progress & Courses */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[6] }}>
                  <LanguageProgress languageProgress={profile?.language_progress || {}} />
                  <EnrolledCourses 
                    enrolledCourses={enrolledCourses}
                    onNavigateToMarketplace={handleNavigateToMarketplace}
                    onNavigateToCourse={handleNavigateToCourse}
                  />
                  <RecentActivity />
                </div>
              </Grid>
            </TabPanel>
            
            <TabPanel p={0} pt={6}>
              <EnrolledCourses 
                enrolledCourses={enrolledCourses}
                onNavigateToMarketplace={handleNavigateToMarketplace}
                onNavigateToCourse={handleNavigateToCourse}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SectionLayout>
    </PageLayout>
  );
};

export default ProfilePage;