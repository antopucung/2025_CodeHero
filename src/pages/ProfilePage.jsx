import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useProgressionSystem } from '../hooks/useProgressionSystem';
import { useUserEnrollment } from '../hooks/useUserEnrollment';
import {
  ProfilePageLayout,
  TwoColumnLayout,
  Section,
  Stack,
  PageTitle,
  BodyText,
  StatusBadge
} from '../design/components/StandardizedComponents';
import { ProgressionDashboard } from '../components/progression/ProgressionDashboard';
import { ProfileCard } from '../components/profile/ProfileCard';
import { AchievementsSection } from '../components/profile/AchievementsSection';
import { LanguageProgress } from '../components/profile/LanguageProgress';
import { EnrolledCourses } from '../components/profile/EnrolledCourses';
import { RecentActivity } from '../components/profile/RecentActivity';
import { designSystem } from '../design/system/DesignSystem';

function ProfilePage() {
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
  const [isInitialized, setIsInitialized] = React.useState(false);

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
        rarity: 'legendary',
        achievement_key: 'speed_demon'
      }
    },
    {
      id: 2,
      achievement_definitions: {
        title: 'Perfectionist',
        description: 'Completed challenges with 100% accuracy',
        icon: '💎',
        color: '#9c27b0',
        rarity: 'epic',
        achievement_key: 'perfectionist'
      }
    },
    {
      id: 3,
      achievement_definitions: {
        title: 'Community Helper',
        description: 'Made 10+ helpful community contributions',
        icon: '🤝',
        color: '#4ecdc4',
        rarity: 'rare',
        achievement_key: 'community_helper'
      }
    },
    {
      id: 4,
      achievement_definitions: {
        title: 'Code Master',
        description: 'Mastered multiple programming languages',
        icon: '🎯',
        color: '#ffd93d',
        rarity: 'epic',
        achievement_key: 'code_master'
      }
    },
    {
      id: 5,
      achievement_definitions: {
        title: 'Combo King',
        description: 'Achieved 50+ combo in typing challenges',
        icon: '🔥',
        color: '#ff6b6b',
        rarity: 'rare',
        achievement_key: 'combo_king'
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
        description: 'Demonstrates proficiency in JavaScript programming',
        cert_type_key: 'javascript_fundamentals',
        icon: '🟨',
        color: '#f7df1e'
      }
    },
    {
      id: 2,
      certificate_number: 'TI-2024-002',
      status: 'active',
      issued_at: '2024-02-10T10:00:00Z',
      expires_at: '2025-02-10T10:00:00Z',
      certification_types: {
        title: 'Unity C# Developer',
        description: 'Certified Unity C# game developer',
        cert_type_key: 'unity_csharp',
        icon: '🔵',
        color: '#239120'
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

  // Initialize data only once when component mounts
  React.useEffect(() => {
    if (isInitialized) return;
    
    const initializeData = async () => {
      try {
        if (user) {
          const courses = await getEnrolledCourses();
          setEnrolledCourses(courses || []);
          
          const achievements = getAllAchievements();
          setCourseAchievements(achievements || []);
        } else {
          setEnrolledCourses(mockEnrolledCourses);
          setCourseAchievements(['speed_demon', 'perfectionist']);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setEnrolledCourses(mockEnrolledCourses);
        setCourseAchievements(['speed_demon', 'perfectionist']);
      } finally {
        setIsInitialized(true);
      }
    };
    
    initializeData();
  }, [user, isInitialized]);

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

  // Create user badges from progression data
  const createUserBadges = () => {
    const badges = [];
    
    // Level Badge (always present)
    if (displayProfile?.overall_level) {
      badges.push({
        type: 'level',
        value: displayProfile.overall_level,
        icon: '⭐',
        color: '#ffd93d',
        tooltipText: `Level ${displayProfile.overall_level} - ${displayProfile.total_xp || 0} XP`
      });
    }
    
    // Certification Badges (top 2 most recent)
    if (displayCertifications && displayCertifications.length > 0) {
      const activeCerts = displayCertifications
        .filter(cert => cert.status === 'active')
        .slice(0, 2); // Limit to 2 most recent
      
      activeCerts.forEach(cert => {
        badges.push({
          type: 'cert',
          value: cert.certification_types.cert_type_key || cert.id,
          icon: cert.certification_types.icon || '📜',
          color: cert.certification_types.color || '#4ecdc4',
          tooltipText: `Certified: ${cert.certification_types.title}`
        });
      });
    }
    
    // Achievement Badges (prominent ones only)
    if (displayAchievements && displayAchievements.length > 0) {
      const prominentAchievements = displayAchievements
        .filter(ach => {
          const key = ach.achievement_definitions?.achievement_key;
          return ['speed_demon', 'perfectionist', 'combo_king', 'code_master'].includes(key);
        })
        .slice(0, 2); // Limit to 2 prominent achievements
      
      prominentAchievements.forEach(ach => {
        badges.push({
          type: 'achievement',
          value: ach.achievement_definitions.achievement_key,
          icon: ach.achievement_definitions.icon,
          color: ach.achievement_definitions.color,
          tooltipText: `${ach.achievement_definitions.title}: ${ach.achievement_definitions.description}`
        });
      });
    }
    
    // Special Performance Badges
    if (displayProfile?.best_wpm >= 60) {
      badges.push({
        type: 'achievement',
        value: 'high_speed',
        icon: '🏎️',
        color: '#ff6b6b',
        tooltipText: `Speed Racer - ${displayProfile.best_wpm} WPM`
      });
    }
    
    if (displayProfile?.streak_days >= 10) {
      badges.push({
        type: 'achievement',
        value: 'streak_master',
        icon: '🔥',
        color: '#ff9500',
        tooltipText: `Streak Master - ${displayProfile.streak_days} days`
      });
    }
    
    return badges;
  };
  
  const userBadges = createUserBadges();

  // Prepare stats with safe fallbacks
  const stats = [
    { 
      value: displayProfile?.overall_level || 1, 
      label: 'LEVEL',
      icon: '📈',
      color: '#00ff00'
    },
    { 
      value: displayProfile?.total_challenges_completed || 0, 
      label: 'CHALLENGES',
      icon: '🎯',
      color: '#ffd93d'
    },
    { 
      value: displayProfile?.achievements?.length || displayAchievements?.length || 0, 
      label: 'ACHIEVEMENTS',
      icon: '🏆',
      color: '#ff6b6b'
    }
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
      <ProfilePageLayout title="Profile Error">
        <Section>
          <Stack>
            <PageTitle color="#ff6b6b">
              ⚠️ Profile Error
            </PageTitle>
            <BodyText>
              There was an error loading your profile data: {error}
            </BodyText>
            <BodyText>
              Please try refreshing the page or contact support if the issue persists.
            </BodyText>
          </Stack>
        </Section>
      </ProfilePageLayout>
    );
  }
  return (
    <ProfilePageLayout 
      title="👤 User Profile"
      subtitle="Track Your Coding Journey & Achievements"
      stats={stats}
    >
      {!profile && !loading && (
        <Section>
          <StatusBadge variant="warning">
            🎮 Demo Mode - This is a preview of the profile system. Log in to track your real progress!
          </StatusBadge>
        </Section>
      )}
      
      <Section>
        {/* Show loading state only when actually loading and user is authenticated */}
        {loading && user && (
          <Stack>
            <BodyText textAlign="center">Loading your progress...</BodyText>
          </Stack>
        )}
        
        {/* Show login prompt when not authenticated and not loading */}
        {!loading && !user && (
          <Section>
            <Stack>
              <PageTitle>🔐 Login Required</PageTitle>
              <BodyText>
                Please log in to view your personalized profile and track your learning progress.
              </BodyText>
              <Stack>
                <BodyText>With an account you can:</BodyText>
                <BodyText>📊 Track XP and level progression</BodyText>
                <BodyText>🏆 Unlock achievements and badges</BodyText>
                <BodyText>📜 Earn professional certifications</BodyText>
                <BodyText>📈 View detailed learning analytics</BodyText>
              </Stack>
            </Stack>
          </Section>
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
              <TwoColumnLayout
                leftContent={<>
                  {displayProfile && (
                    <ProfileCard 
                      userData={userData} 
                      progress={displayProfile}
                      badges={userBadges}
                    />
                  )}
                  <AchievementsSection 
                    achievements={[
                      ...(displayAchievements?.map(a => a.achievement_definitions?.title || a.achievement_key) || []), 
                      ...(courseAchievements || []).map(a => typeof a === 'string' ? a.replace('_', ' ') : a)
                    ]} 
                  />
                </>}
                rightContent={<>
                  <LanguageProgress languageProgress={displayProfile?.language_progress || {}} />
                  <EnrolledCourses 
                    enrolledCourses={displayEnrolledCourses}
                    onNavigateToMarketplace={handleNavigateToMarketplace}
                    onNavigateToCourse={handleNavigateToCourse}
                  />
                  <RecentActivity />
                </>}
              />
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
      </Section>
    </ProfilePageLayout>
  );
}

export default ProfilePage;