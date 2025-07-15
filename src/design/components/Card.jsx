// Reusable Card Component
import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { designSystem, createVariant } from '../system/DesignSystem';

const MotionBox = motion(Box);

export const Card = ({ 
  children, 
  variant = 'default',
  hover = true,
  onClick,
  ...props 
}) => {
  const cardStyles = createVariant('card', variant);
  
  const hoverAnimation = hover ? {
    whileHover: { 
      scale: 1.02,
      borderColor: designSystem.colors.borders.accent,
      boxShadow: designSystem.shadows.glow
    },
    whileTap: { scale: 0.98 }
  } : {};
  
  return (
    <MotionBox
      {...cardStyles}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'default'}
      transition="all 0.2s ease"
      {...hoverAnimation}
      overflow="hidden"
      display="flex"
      flexDirection="column"
      {...props}
    >
      {children}
    </MotionBox>
  );
};

export const CourseCard = ({ 
  course, 
  onEnroll, 
  onView, 
  isEnrolled = false,
  ...props 
}) => {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: designSystem.colors.status.success,
      intermediate: designSystem.colors.status.warning,
      advanced: designSystem.colors.status.error
    };
    return colors[difficulty] || designSystem.colors.status.info;
  };

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: '🟨',
      typescript: '🔷',
      python: '🐍',
      java: '☕',
      csharp: '🔵',
      php: '🐘'
    };
    return icons[language] || '💻';
  };

  return (
    <Card
      variant="elevated"
      onClick={() => onView?.(course)}
      display="flex"
      flexDirection="column"
      h="100%"
      {...props}
    >
      {/* Course Thumbnail */}
      <Box 
        position="relative" 
        h="200px" 
        overflow="hidden"
        borderRadius={designSystem.radii.md}
        mb={designSystem.spacing[4]}
      >
        <Box
          w="100%"
          h="100%"
          bg={designSystem.colors.backgrounds.secondary}
          backgroundImage={course.thumbnail_url}
          backgroundSize="cover"
          backgroundPosition="center"
        />
        
        {/* Badges */}
        <Box
          position="absolute"
          top={designSystem.spacing[2]}
          left={designSystem.spacing[2]}
          display="flex"
          gap={designSystem.spacing[2]}
        >
          <Box
            bg={getDifficultyColor(course.difficulty)}
            color={designSystem.colors.text.inverse}
            px={designSystem.spacing[2]}
            py={designSystem.spacing[1]}
            borderRadius={designSystem.radii.sm}
            fontSize={designSystem.typography.sizes.xs}
            fontWeight={designSystem.typography.weights.bold}
          >
            {course.difficulty?.toUpperCase()}
          </Box>
          
          <Box
            bg={designSystem.colors.backgrounds.overlay}
            color={designSystem.colors.text.primary}
            px={designSystem.spacing[2]}
            py={designSystem.spacing[1]}
            borderRadius={designSystem.radii.sm}
            fontSize={designSystem.typography.sizes.xs}
          >
            {getLanguageIcon(course.language)} {course.language?.toUpperCase()}
          </Box>
        </Box>
        
        {/* Price */}
        <Box
          position="absolute"
          top={designSystem.spacing[2]}
          right={designSystem.spacing[2]}
          bg={designSystem.colors.backgrounds.overlay}
          color={designSystem.colors.brand.accent}
          px={designSystem.spacing[2]}
          py={designSystem.spacing[1]}
          borderRadius={designSystem.radii.sm}
          fontSize={designSystem.typography.sizes.sm}
          fontWeight={designSystem.typography.weights.bold}
        >
          ${course.price}
        </Box>
      </Box>

      {/* Course Content */}
      <Box 
        display="flex" 
        flexDirection="column" 
        flex={1}
        px={designSystem.spacing[4]}
        pb={designSystem.spacing[4]}
      >
        <Box
          mb={designSystem.spacing[3]}
          fontSize={designSystem.typography.sizes.lg}
          fontWeight={designSystem.typography.weights.bold}
          color={designSystem.colors.brand.primary}
          noOfLines={2}
          minH="48px"
        >
          {course.title}
        </Box>

        <Box
          mb={designSystem.spacing[4]}
          fontSize={designSystem.typography.sizes.sm}
          color={designSystem.colors.text.secondary}
          noOfLines={3}
          flex={1}
        >
          {course.description}
        </Box>

        {/* Course Stats */}
        <Box display="flex" flexDirection="column" gap={designSystem.spacing[3]} mb={designSystem.spacing[4]}>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            fontSize={designSystem.typography.sizes.xs} 
            color={designSystem.colors.text.muted}
          >
            <Box>👨‍🏫 {course.instructor_name}</Box>
            <Box>⭐ {course.rating}</Box>
          </Box>
          
          <Box 
            display="flex" 
            justifyContent="space-between" 
            fontSize={designSystem.typography.sizes.xs} 
            color={designSystem.colors.text.muted}
          >
            <Box>📚 {course.lessons_count} lessons</Box>
            <Box>⏱️ {course.duration_hours}h</Box>
          </Box>
          
          <Box 
            display="flex" 
            justifyContent="space-between" 
            fontSize={designSystem.typography.sizes.xs} 
            color={designSystem.colors.text.muted}
          >
            <Box>👥 {course.students_count?.toLocaleString()} students</Box>
            <Box>🎯 Interactive</Box>
          </Box>
        </Box>

        {/* Action Button */}
        <Box
          as="button"
          bg={isEnrolled ? designSystem.colors.status.success : designSystem.colors.brand.primary}
          color={designSystem.colors.text.inverse}
          fontFamily={designSystem.typography.fonts.mono}
          fontSize={designSystem.typography.sizes.sm}
          fontWeight={designSystem.typography.weights.bold}
          borderRadius={designSystem.radii.base}
          p={designSystem.spacing[3]}
          border="none"
          cursor="pointer"
          transition="all 0.2s ease"
          _hover={{
            transform: "translateY(-1px)",
            boxShadow: designSystem.shadows.md
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (isEnrolled) {
              onView?.(course);
            } else {
              onEnroll?.(course);
            }
          }}
        >
          {isEnrolled ? '📖 CONTINUE' : '🚀 VIEW COURSE'}
        </Box>
      </Box>
    </Card>
  );
};