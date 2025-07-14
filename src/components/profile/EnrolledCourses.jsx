import React from 'react';
import { VStack, HStack, Badge } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Card } from '../../design/components/Card';
import { Text, Heading } from '../../design/components/Typography';
import { Button as CustomButton } from '../../design/components/Button';
import { designSystem } from '../../design/system/DesignSystem';

const MotionBox = motion.div;

export const EnrolledCourses = ({ enrolledCourses, onNavigateToMarketplace, onNavigateToCourse }) => {
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
      
      {enrolledCourses.length > 0 ? (
        <VStack spacing={designSystem.spacing[3]} align="stretch">
          {enrolledCourses.slice(0, 3).map((course, index) => (
            <MotionBox
              key={course.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                background: designSystem.colors.backgrounds.secondary,
                padding: designSystem.spacing[4],
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
              onClick={() => onNavigateToCourse(course.slug)}
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
                <Text size="sm" color="muted" style={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
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
            onClick={onNavigateToMarketplace}
          >
            Explore Marketplace
          </CustomButton>
        </VStack>
      )}
    </Card>
  );
};