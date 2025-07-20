import React from 'react';
import { VStack, HStack, Badge, Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Card } from '../../design/components/Card';
import { CustomText, Heading } from '../../design/components/Typography';
import { Button as CustomButton } from '../../design/components/Button';
import { designSystem } from '../../design/system/DesignSystem';

const MotionBox = motion.div;

export const EnrolledCourses = ({ enrolledCourses, onNavigateToMarketplace, onNavigateToCourse }) => {
  // Ensure enrolledCourses is always an array
  const safeCourses = Array.isArray(enrolledCourses) ? enrolledCourses : [];
  
  return (
    <Card variant="elevated" p={designSystem.spacing[6]}>
      <HStack justify="space-between" mb={designSystem.spacing[4]}>
        <Heading level={3} size="lg" color="secondary">
          📚 My Courses
        </Heading>
        <CustomButton 
          variant="primary" 
          size="sm"
          onClick={onNavigateToMarketplace}
        >
          + Browse More
        </CustomButton>
      </HStack>
      
      {safeCourses.length > 0 ? (
        <VStack spacing={designSystem.spacing[4]} align="stretch">
          {safeCourses.slice(0, 3).map((course, index) => (
            <MotionBox
              key={course.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: designSystem.colors.backgrounds.secondary,
                padding: 0,
                borderRadius: designSystem.radii.md,
                border: `1px solid ${designSystem.colors.borders.default}`,
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = designSystem.colors.brand.primary;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = designSystem.colors.borders.default;
              }}
              onClick={() => onNavigateToCourse && onNavigateToCourse(course.slug)}
            >
              <Box p={designSystem.spacing[4]}>
              <VStack align="start" spacing={designSystem.spacing[3]}>
                <HStack justify="space-between" w="100%" spacing={designSystem.spacing[2]}>
                  <CustomText color="brand" fontWeight={designSystem.typography.weights.bold}>
                    {course?.title ?? 'Course Title'}
                  </CustomText>
                  <Badge bg={designSystem.colors.brand.secondary} color={designSystem.colors.text.inverse}>
                    {(course?.language ?? 'CODE').toUpperCase()}
                  </Badge>
                </HStack>
                <CustomText size="sm" color="muted" mt={designSystem.spacing[1]} style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {course?.description ?? 'Course description'}
                </CustomText>
                <HStack spacing={designSystem.spacing[4]} fontSize="xs" color={designSystem.colors.text.muted} mt={designSystem.spacing[2]}>
                  <CustomText>📚 {course?.lessons_count ?? 0} lessons</CustomText>
                  <CustomText>⏱️ {course?.duration_hours ?? 0}h</CustomText>
                  <CustomText>⭐ {course?.rating ?? 0}</CustomText>
                </HStack>
              </VStack>
              </Box>
            </MotionBox>
          ))}
          
          {safeCourses.length > 3 && (
            <CustomText size="sm" color="muted" textAlign="center" py={designSystem.spacing[2]}>
              +{safeCourses.length - 3} more courses
            </CustomText>
          )}
        </VStack>
      ) : (
        <VStack spacing={designSystem.spacing[5]} textAlign="center" py={designSystem.spacing[8]}>
          <CustomText size="lg">📚</CustomText>
          <CustomText color="muted">No courses enrolled yet</CustomText>
          <Box pt={designSystem.spacing[2]}>
            <CustomButton 
              variant="primary" 
              onClick={() => onNavigateToMarketplace && onNavigateToMarketplace()}
            >
              Explore Marketplace
            </CustomButton>
          </Box>
        </VStack>
      )}
    </Card>
  );
};