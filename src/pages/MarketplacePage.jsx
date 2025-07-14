import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useGameProgress } from '../hooks/useGameProgress';
import { useUserEnrollment } from '../hooks/useUserEnrollment';
import { PageLayout, SectionLayout, GridLayout } from '../design/layouts/PageLayout';
import { PageHeader } from '../design/components/PageHeader';
import { CourseCard } from '../design/components/Card';
import { Text } from '../design/components/Typography';
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
          <Text color="brand">
            Loading Marketplace...
          </Text>
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
        {/* Enrolled Courses Quick Access */}
        {enrolledCourses.length > 0 && (
          <VStack spacing={designSystem.spacing[3]}>
            <Text size="lg" color="secondary" fontWeight="bold">
              📚 My Courses ({enrolledCourses.length})
            </Text>
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
                <Text size="xs" color="muted">+{enrolledCourses.length - 4} more</Text>
              )}
            </HStack>
          </VStack>
        )}
        
        {/* Courses Section */}
        <Box>
          <HStack justify="space-between" w="100%">
            <Text size="xl" color="brand" fontWeight="bold">
              Featured Courses
            </Text>
            <Text size="sm" color="muted">
              {courses.length} courses available
            </Text>
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
              </MotionBox>
            ))}
          </GridLayout>
        </Box>

        {/* Coming Soon Section */}
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
            <Text size="lg" color="accent" fontWeight="bold">
              🚀 More Courses Coming Soon!
            </Text>
          </Box>
          <Text size="sm" color="muted">
              Advanced React, Node.js, Machine Learning, Game Development, and more...
          </Text>
        </MotionBox>
      </SectionLayout>
    </PageLayout>
  );
};

export default MarketplacePage;