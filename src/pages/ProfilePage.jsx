import React from 'react';
import { Grid } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useGameProgress } from '../hooks/useGameProgress';
import { useUserEnrollment } from '../hooks/useUserEnrollment';
import { PageLayout, SectionLayout } from '../design/layouts/PageLayout';
import { PageHeader } from '../design/components/PageHeader';
import { ProfileCard } from '../components/profile/ProfileCard';
import { AchievementsSection } from '../components/profile/AchievementsSection';
import { LanguageProgress } from '../components/profile/LanguageProgress';
import { EnrolledCourses } from '../components/profile/EnrolledCourses';
import { RecentActivity } from '../components/profile/RecentActivity';
import { designSystem } from '../design/system/DesignSystem';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { progress } = useGameProgress();
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
    { value: progress.level, label: 'LEVEL' },
    { value: progress.bestWpm, label: 'BEST WPM' },
    { value: progress.totalChallengesCompleted, label: 'CHALLENGES' },
    { value: progress.achievements.length + courseAchievements.length, label: 'ACHIEVEMENTS' }
  ];

  const handleNavigateToMarketplace = () => navigate('/marketplace');
  const handleNavigateToCourse = (slug) => navigate(`/modules/${slug}`);

  return (
    <PageLayout background="primary">
      <PageHeader
        title="👤 User Profile"
        subtitle="Track Your Coding Journey & Achievements"
        stats={stats}
      />
      
      <SectionLayout spacing="default">
        <Grid 
          templateColumns={{ base: "1fr", lg: "1fr 2fr" }} 
          gap={designSystem.spacing[6]} 
          w="100%"
        >
          {/* Left Column - Profile Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[6] }}>
            <ProfileCard userData={userData} progress={progress} />
            <AchievementsSection 
              achievements={[
                ...progress.achievements, 
                ...courseAchievements.map(a => a.replace('_', ' '))
              ]} 
            />
          </div>

          {/* Right Column - Progress & Courses */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: designSystem.spacing[6] }}>
            <LanguageProgress languageProgress={progress.languageProgress} />
            <EnrolledCourses 
              enrolledCourses={enrolledCourses}
              onNavigateToMarketplace={handleNavigateToMarketplace}
              onNavigateToCourse={handleNavigateToCourse}
            />
            <RecentActivity />
          </div>
        </Grid>
      </SectionLayout>
    </PageLayout>
  );
};

export default ProfilePage;