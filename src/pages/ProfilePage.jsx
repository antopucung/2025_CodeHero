import React from 'react';
import { Box, VStack, HStack, Button, Badge, Image, Grid, GridItem } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useGameProgress } from '../hooks/useGameProgress';
import { useUserEnrollment } from '../hooks/useUserEnrollment';
import { PageLayout, SectionLayout } from '../design/layouts/PageLayout';
import { Card } from '../design/components/Card';
import { Text, Heading } from '../design/components/Typography';
import { Button as CustomButton } from '../design/components/Button';
import { PageHeader } from '../design/components/PageHeader';
import { designSystem } from '../design/system/DesignSystem';

const MotionBox = motion(Box);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { progress } = useGameProgress();
  const { getEnrolledCourses } = useUserEnrollment();
  const [enrolledCourses, setEnrolledCourses] = React.useState([]);

  React.useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const courses = await getEnrolledCourses();
        setEnrolledCourses(courses);
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
    { value: progress.achievements.length, label: 'ACHIEVEMENTS' }
  ];

  const languageProgress = Object.entries(progress.languageProgress || {}).map(([lang, data]) => ({
    language: lang,
    level: data.level,
    xp: data.xp,
    color: getLanguageColor(lang)
  }));

  function getLanguageColor(language) {
    const colors = {
      javascript: '#F7DF1E',
      typescript: '#3178C6',
      python: '#3776AB',
      java: '#ED8B00',
      csharp: '#239120',
      php: '#777BB4'
    };
    return colors[language] || designSystem.colors.brand.primary;
  }

  return (
    <PageLayout background="primary">
      <PageHeader
        title="👤 User Profile"
        subtitle="Track Your Coding Journey & Achievements"
        stats={stats}
      />
      
      <SectionLayout spacing="default">
        <Grid templateColumns={{ base: "1fr", lg: "1fr 2fr" }} gap={designSystem.spacing[6]} w="100%">
          {/* Left Column - Profile Info */}
          <VStack spacing={designSystem.spacing[6]} align="stretch">
            {/* Profile Card */}
            <Card variant="elevated" p={designSystem.spacing[6]}>
              <VStack spacing={designSystem.spacing[4]} align="center">
                <Box position="relative">
                  <Image
                    src={userData.avatar}
                    alt={userData.name}
                    w="120px"
                    h="120px"
                    borderRadius="full"
                    objectFit="cover"
                    border={`4px solid ${designSystem.colors.brand.primary}`}
                  />
                  <Badge 
                    position="absolute"
                    bottom="0"
                    right="0"
                    bg={designSystem.colors.status.success} 
                    color={designSystem.colors.text.inverse}
                    borderRadius="full"
                    p={2}
                  >
                    LV.{progress.level}
                  </Badge>
                </Box>
                
                <VStack spacing={designSystem.spacing[2]} textAlign="center">
                  <Heading level={2} size="xl" color="brand">
                    {userData.name}
                  </Heading>
                  <Text color="secondary">{userData.username}</Text>
                  <Text size="sm" color="muted">{userData.email}</Text>
                  <Text size="sm" color="muted">Joined {userData.joinDate}</Text>
                </VStack>

                <Text size="sm" color="secondary" textAlign="center" lineHeight="1.5">
                  {userData.bio}
                </Text>

                <HStack spacing={designSystem.spacing[2]} w="100%">
                  <CustomButton variant="primary" size="sm" flex={1}>
                    🔗 Portfolio
                  </CustomButton>
                  <CustomButton variant="secondary" size="sm" flex={1}>
                    📧 GitHub
                  </CustomButton>
                </HStack>
              </VStack>
            </Card>

            {/* Achievements */}
            <Card variant="elevated" p={designSystem.spacing[6]}>
              <Heading level={3} size="lg" color="accent" mb={designSystem.spacing[4]}>
                🏆 Achievements
              </Heading>
              <VStack spacing={designSystem.spacing[2]} align="stretch">
                {progress.achievements.length > 0 ? (
                  progress.achievements.map((achievement, index) => (
                    <MotionBox
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      bg={designSystem.colors.backgrounds.secondary}
                      p={designSystem.spacing[3]}
                      borderRadius={designSystem.radii.md}
                      border={`1px solid ${designSystem.colors.borders.default}`}
                    >
                      <HStack spacing={designSystem.spacing[3]}>
                        <Text size="lg">🏆</Text>
                        <Text color="brand" fontWeight={designSystem.typography.weights.bold}>
                          {achievement.replace('_', ' ').toUpperCase()}
                        </Text>
                      </HStack>
                    </MotionBox>
                  ))
                ) : (
                  <Text color="muted" textAlign="center">
                    Complete challenges to unlock achievements!
                  </Text>
                )}
              </VStack>
            </Card>
          </VStack>

          {/* Right Column - Progress & Courses */}
          <VStack spacing={designSystem.spacing[6]} align="stretch">
            {/* Language Progress */}
            <Card variant="elevated" p={designSystem.spacing[6]}>
              <Heading level={3} size="lg" color="brand" mb={designSystem.spacing[4]}>
                📊 Language Progress
              </Heading>
              <VStack spacing={designSystem.spacing[4]} align="stretch">
                {languageProgress.map((lang, index) => (
                  <MotionBox
                    key={lang.language}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <HStack justify="space-between" mb={designSystem.spacing[2]}>
                      <HStack spacing={designSystem.spacing[2]}>
                        <Text fontWeight={designSystem.typography.weights.bold} color="secondary">
                          {lang.language.toUpperCase()}
                        </Text>
                        <Badge bg={lang.color} color={designSystem.colors.text.inverse}>
                          Level {lang.level}
                        </Badge>
                      </HStack>
                      <Text size="sm" color="muted">
                        {lang.xp} XP
                      </Text>
                    </HStack>
                    <Box
                      bg={designSystem.colors.backgrounds.secondary}
                      h="8px"
                      borderRadius={designSystem.radii.base}
                      overflow="hidden"
                    >
                      <Box
                        bg={lang.color}
                        h="100%"
                        w={`${Math.min((lang.xp / (lang.level * 50)) * 100, 100)}%`}
                        transition="width 0.3s"
                      />
                    </Box>
                  </MotionBox>
                ))}
              </VStack>
            </Card>

            {/* Enrolled Courses */}
            <Card variant="elevated" p={designSystem.spacing[6]}>
              <HStack justify="space-between" mb={designSystem.spacing[4]}>
                <Heading level={3} size="lg" color="secondary">
                  📚 My Courses
                </Heading>
                <CustomButton 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate('/marketplace')}
                >
                  + Browse More
                </CustomButton>
              </HStack>
              
              {enrolledCourses.length > 0 ? (
                <VStack spacing={designSystem.spacing[3]} align="stretch">
                  {enrolledCourses.slice(0, 3).map((course, index) => (
                    <MotionBox
                      key={course.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      bg={designSystem.colors.backgrounds.secondary}
                      p={designSystem.spacing[4]}
                      borderRadius={designSystem.radii.md}
                      border={`1px solid ${designSystem.colors.borders.default}`}
                      _hover={{
                        borderColor: designSystem.colors.brand.primary,
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/modules/${course.slug}`)}
                    >
                      <VStack align="start" spacing={designSystem.spacing[2]}>
                        <HStack justify="space-between" w="100%">
                          <Text color="brand" fontWeight={designSystem.typography.weights.bold}>
                            {course.title}
                          </Text>
                          <Badge bg={designSystem.colors.brand.secondary} color={designSystem.colors.text.inverse}>
                            {course.language.toUpperCase()}
                          </Badge>
                        </HStack>
                        <Text size="sm" color="muted" noOfLines={2}>
                          {course.description}
                        </Text>
                        <HStack spacing={designSystem.spacing[4]} fontSize="xs" color={designSystem.colors.text.muted}>
                          <Text>📚 {course.lessons_count} lessons</Text>
                          <Text>⏱️ {course.duration_hours}h</Text>
                          <Text>⭐ {course.rating}</Text>
                        </HStack>
                      </VStack>
                    </MotionBox>
                  ))}
                  
                  {enrolledCourses.length > 3 && (
                    <Text size="sm" color="muted" textAlign="center">
                      +{enrolledCourses.length - 3} more courses
                    </Text>
                  )}
                </VStack>
              ) : (
                <VStack spacing={designSystem.spacing[4]} textAlign="center" py={designSystem.spacing[6]}>
                  <Text size="lg">📚</Text>
                  <Text color="muted">No courses enrolled yet</Text>
                  <CustomButton 
                    variant="primary" 
                    onClick={() => navigate('/marketplace')}
                  >
                    Explore Marketplace
                  </CustomButton>
                </VStack>
              )}
            </Card>

            {/* Recent Activity */}
            <Card variant="elevated" p={designSystem.spacing[6]}>
              <Heading level={3} size="lg" color="accent" mb={designSystem.spacing[4]}>
                📈 Recent Activity
              </Heading>
              <VStack spacing={designSystem.spacing[3]} align="stretch">
                <HStack spacing={designSystem.spacing[3]} p={designSystem.spacing[3]} bg={designSystem.colors.backgrounds.secondary} borderRadius={designSystem.radii.md}>
                  <Text>🎯</Text>
                  <VStack align="start" spacing={0} flex={1}>
                    <Text size="sm" color="secondary">Completed typing challenge</Text>
                    <Text size="xs" color="muted">2 hours ago</Text>
                  </VStack>
                </HStack>
                
                <HStack spacing={designSystem.spacing[3]} p={designSystem.spacing[3]} bg={designSystem.colors.backgrounds.secondary} borderRadius={designSystem.radii.md}>
                  <Text>🏆</Text>
                  <VStack align="start" spacing={0} flex={1}>
                    <Text size="sm" color="secondary">Unlocked achievement: Speed Demon</Text>
                    <Text size="xs" color="muted">1 day ago</Text>
                  </VStack>
                </HStack>
                
                <HStack spacing={designSystem.spacing[3]} p={designSystem.spacing[3]} bg={designSystem.colors.backgrounds.secondary} borderRadius={designSystem.radii.md}>
                  <Text>📚</Text>
                  <VStack align="start" spacing={0} flex={1}>
                    <Text size="sm" color="secondary">Started new course: Advanced React</Text>
                    <Text size="xs" color="muted">3 days ago</Text>
                  </VStack>
                </HStack>
              </VStack>
            </Card>
          </VStack>
        </Grid>
      </SectionLayout>
    </PageLayout>
  );
};

export default ProfilePage;