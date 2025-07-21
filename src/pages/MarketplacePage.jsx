import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Badge, Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useGameProgress } from '../hooks/useGameProgress';
import { useUserEnrollment } from '../hooks/useUserEnrollment';
import { PageLayout, SectionLayout, GridLayout } from '../design/layouts/PageLayout';
import { PageHeader } from '../design/components/PageHeader';
import { CourseCard } from '../design/components/Card';
import { CustomText } from '../design/components/Typography';
import { Button } from '../design/components/Button';
import { designSystem } from '../design/system/DesignSystem';

const MotionBox = motion(Box);

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { progress } = useGameProgress();
  const { getEnrolledCourses } = useUserEnrollment();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const enrolled = await getEnrolledCourses();
      setEnrolledCourses(enrolled);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  const handleCourseClick = (courseId) => {
    navigate(`/modules/${courseId}`);
  };

  if (loading) {
    return (
      <PageLayout background="primary">
        <VStack spacing={4}>
          <MotionBox
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            color={designSystem.colors.brand.primary}
            fontSize={designSystem.typography.sizes['3xl']}
          >
            ⚡
          </MotionBox>
          <CustomText color="brand">
            Loading Marketplace...
          </CustomText>
        </VStack>
      </PageLayout>
    );
  }

  // Prepare stats for header
  const stats = [
    { value: progress.level, label: 'LEVEL' },
    { value: progress.totalChallengesCompleted, label: 'COMPLETED' },
    { value: progress.achievements.length, label: 'ACHIEVEMENTS' }
  ];

  // Add enrolled courses stat if user has any
  if (enrolledCourses.length > 0) {
    stats.push({ value: enrolledCourses.length, label: 'MY COURSES' });
  }

  return (
    <PageLayout background="primary">
      <PageHeader
        title="🛒 Learning Marketplace"
        subtitle="Gamified Interactive Programming Courses"
        stats={stats}
      />
      
      <SectionLayout spacing="loose">
        <Tabs variant="soft-rounded" colorScheme="green" w="100%">
          <TabList mb={designSystem.spacing[6]}>
            <Tab fontFamily={designSystem.typography.fonts.mono} fontWeight="bold">
              📚 Courses & Tutorials
            </Tab>
            <Tab fontFamily={designSystem.typography.fonts.mono} fontWeight="bold">
              🛍️ Digital Assets
            </Tab>
          </TabList>
          
          <TabPanels>
            {/* Courses & Tutorials Tab */}
            <TabPanel p={0}>
              <VStack spacing={designSystem.spacing[8]} align="stretch">
                {/* Enrolled Courses Quick Access */}
                {enrolledCourses.length > 0 && (
                  <VStack spacing={designSystem.spacing[3]}>
                    <CustomText size="lg" color="secondary" fontWeight="bold">
                      📚 My Courses ({enrolledCourses.length})
                    </CustomText>
                    <HStack spacing={designSystem.spacing[2]} flexWrap="wrap" justify="center">
                      {enrolledCourses.slice(0, 4).map((course) => (
                        <Button
                          key={course.id}
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/modules/${course.slug}`)}
                        >
                          {course.title.split(' ').slice(0, 2).join(' ')}
                        </Button>
                      ))}
                      {enrolledCourses.length > 4 && (
                        <CustomText size="xs" color="muted">+{enrolledCourses.length - 4} more</CustomText>
                      )}
                    </HStack>
                  </VStack>
                )}
                
                {/* Featured Courses Section */}
                <Box>
                  <HStack justify="space-between" w="100%">
                    <CustomText size="xl" color="brand" fontWeight="bold">
                      Featured Courses
                    </CustomText>
                    <CustomText size="sm" color="muted">
                      {courses.length} courses available
                    </CustomText>
                  </HStack>

                  <GridLayout 
                    columns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                    gap="default"
                  >
                    {courses.map((course, index) => (
                      <MotionBox
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <CourseCard
                          course={course}
                          onView={() => handleCourseClick(course.slug)}
                          isEnrolled={enrolledCourses.some(enrolled => enrolled.id === course.id)}
                        />
                        
                        {/* Gamification Badge for the course */}
                        {course.slug === 'unity-csharp-101' && (
                          <Badge 
                            position="absolute" 
                            top={designSystem.spacing[4]} 
                            left={designSystem.spacing[4]}
                            zIndex={10}
                            bg="#ff6b6b"
                            color="#fff"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="sm"
                            boxShadow="0 0 15px rgba(255, 107, 107, 0.6)"
                          >
                            🎮 NEW QUEST!
                          </Badge>
                        )}
                      </MotionBox>
                    ))}
                  </GridLayout>
                </Box>

                {/* Course Development Pipeline Info */}
                <MotionBox
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  bg={designSystem.colors.backgrounds.secondary}
                  border={`1px solid ${designSystem.colors.borders.default}`}
                  borderRadius={designSystem.radii.lg}
                  p={designSystem.spacing[6]}
                  w="100%"
                  textAlign="center"
                >
                  <Box mb={designSystem.spacing[2]}>
                    <CustomText size="lg" color="accent" fontWeight="bold">
                      🚀 More Courses Coming Soon!
                    </CustomText>
                  </Box>
                  <CustomText size="sm" color="muted">
                    Advanced React, Node.js, Machine Learning, Game Development, and more...
                  </CustomText>
                </MotionBox>
              </VStack>
            </TabPanel>
            
            {/* Digital Assets Tab */}
            <TabPanel p={0}>
              <VStack spacing={designSystem.spacing[8]} align="stretch">
                {/* Digital Assets Header */}
                <Box textAlign="center">
                  <CustomText size="xl" color="accent" fontWeight="bold" mb={designSystem.spacing[2]}>
                    🛍️ Official Digital Asset Store
                  </CustomText>
                  <CustomText size="md" color="muted">
                    Premium code templates, UI kits, and development resources
                  </CustomText>
                </Box>
                
                {/* Asset Categories */}
                <Box>
                  <CustomText size="lg" color="secondary" fontWeight="bold" mb={designSystem.spacing[4]}>
                    Browse by Category
                  </CustomText>
                  <GridLayout 
                    columns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
                    gap="default"
                  >
                    {[
                      { name: "Code Templates", icon: "📝", count: "Coming Soon", color: "#4ecdc4" },
                      { name: "UI Kits", icon: "🎨", count: "Coming Soon", color: "#ffd93d" },
                      { name: "Project Starters", icon: "🚀", count: "Coming Soon", color: "#ff6b6b" },
                      { name: "Asset Packs", icon: "📦", count: "Coming Soon", color: "#a374db" }
                    ].map((category, index) => (
                      <MotionBox
                        key={category.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Box
                          bg={designSystem.colors.backgrounds.secondary}
                          border={`1px solid ${designSystem.colors.borders.default}`}
                          borderRadius={designSystem.radii.md}
                          p={designSystem.spacing[6]}
                          textAlign="center"
                          _hover={{
                            borderColor: category.color,
                            transform: "translateY(-2px)",
                            boxShadow: `0 4px 20px ${category.color}33`
                          }}
                          transition="all 0.2s ease"
                          cursor="pointer"
                        >
                          <Box fontSize="3xl" mb={designSystem.spacing[2]}>
                            {category.icon}
                          </Box>
                          <CustomText 
                            size="md" 
                            color={category.color} 
                            fontWeight="bold" 
                            mb={designSystem.spacing[1]}
                          >
                            {category.name}
                          </CustomText>
                          <CustomText size="sm" color="muted">
                            {category.count}
                          </CustomText>
                        </Box>
                      </MotionBox>
                    ))}
                  </GridLayout>
                </Box>
                
                {/* Digital Assets Coming Soon */}
                <MotionBox
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  bg={designSystem.colors.backgrounds.secondary}
                  border={`1px solid ${designSystem.colors.borders.default}`}
                  borderRadius={designSystem.radii.lg}
                  p={designSystem.spacing[8]}
                  w="100%"
                  textAlign="center"
                >
                  <Box mb={designSystem.spacing[4]}>
                    <CustomText size="2xl" color="accent" fontWeight="bold" mb={designSystem.spacing[2]}>
                      🎯 Digital Asset Marketplace
                    </CustomText>
                    <CustomText size="lg" color="secondary" mb={designSystem.spacing[4]}>
                      Professional development resources, coming soon!
                    </CustomText>
                  </Box>
                  
                  <GridLayout 
                    columns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap="default"
                    maxW="600px"
                    mx="auto"
                  >
                    <VStack spacing={designSystem.spacing[2]} align="start">
                      <CustomText size="sm" color="brand" fontWeight="bold">📝 Code Templates</CustomText>
                      <CustomText size="xs" color="muted">• React component libraries</CustomText>
                      <CustomText size="xs" color="muted">• Unity C# script collections</CustomText>
                      <CustomText size="xs" color="muted">• TypeScript utility functions</CustomText>
                    </VStack>
                    
                    <VStack spacing={designSystem.spacing[2]} align="start">
                      <CustomText size="sm" color="accent" fontWeight="bold">🎨 Design Assets</CustomText>
                      <CustomText size="xs" color="muted">• UI component kits</CustomText>
                      <CustomText size="xs" color="muted">• Icon packs & illustrations</CustomText>
                      <CustomText size="xs" color="muted">• Game asset bundles</CustomText>
                    </VStack>
                  </GridLayout>
                  
                  <Box mt={designSystem.spacing[6]}>
                    <Badge 
                      bg="#4ecdc4" 
                      color="#000" 
                      px={4} 
                      py={2} 
                      borderRadius="full"
                      fontSize="sm"
                    >
                      🚀 Launching Soon - Stay Tuned!
                    </Badge>
                  </Box>
                </MotionBox>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SectionLayout>
    </PageLayout>
  );
};

export default MarketplacePage;