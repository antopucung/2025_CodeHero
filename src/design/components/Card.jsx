// Reusable Card Component
import React from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useThemeTokens } from '../../theme/hooks/useThemeTokens';

const MotionBox = motion(Box);

export const Card = ({ 
  children, 
  variant = 'default',
  hover = true,
  onClick,
  ...props 
}) => {
  const { getColor, getBorderRadius, getShadow } = useThemeTokens();
  
  const getVariantStyles = (variant) => {
    const variants = {
      default: {
        bg: getColor('backgrounds.surface'),
        border: `1px solid ${getColor('borders.default')}`,
        borderRadius: getBorderRadius('md'),
        p: 4
      },
      elevated: {
        bg: getColor('backgrounds.elevated'),
        border: `1px solid ${getColor('borders.subtle')}`,
        borderRadius: getBorderRadius('lg'),
        boxShadow: getShadow('md')
      }
    };
    
    return variants[variant] || variants.default;
  };
  
  const hoverAnimation = hover ? {
    whileHover: { 
      scale: 1.02,
      borderColor: getColor('borders.accent'),
      boxShadow: getShadow('glow')
    },
    whileTap: { scale: 0.98 }
  } : {};
  
  return (
    <MotionBox
      {...getVariantStyles(variant)}
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
  const { getColor, getSpacing, getBorderRadius, getShadow } = useThemeTokens();
  
  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: getColor('status.success'),
      intermediate: getColor('status.warning'),
      advanced: getColor('status.error')
    };
    return colors[difficulty] || getColor('status.info');
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
        borderRadius={getBorderRadius('md')}
        mb={getSpacing(4)}
      >
        <Box
          w="100%"
          h="100%"
          bg={getColor('backgrounds.secondary')}
          backgroundImage={course.thumbnail_url}
          backgroundSize="cover"
          backgroundPosition="center"
        />
        
        {/* Badges */}
        <Box
          position="absolute"
          top={getSpacing(2)}
          left={getSpacing(2)}
          display="flex"
          gap={getSpacing(2)}
        >
          <Box
            bg={getDifficultyColor(course.difficulty)}
            color={getColor('text.inverse')}
            px={getSpacing(2)}
            py={getSpacing(1)}
            borderRadius={getBorderRadius('sm')}
            fontSize="xs"
            fontWeight="bold"
          >
            {course.difficulty?.toUpperCase()}
          </Box>
          
          <Box
            bg={getColor('backgrounds.overlay')}
            color={getColor('text.primary')}
            px={getSpacing(2)}
            py={getSpacing(1)}
            borderRadius={getBorderRadius('sm')}
            fontSize="xs"
          >
            {getLanguageIcon(course.language)} {course.language?.toUpperCase()}
          </Box>
        </Box>
        
        {/* Price */}
        <Box
          position="absolute"
          top={getSpacing(2)}
          right={getSpacing(2)}
          bg={getColor('backgrounds.overlay')}
          color={getColor('brand.accent')}
          px={getSpacing(2)}
          py={getSpacing(1)}
          borderRadius={getBorderRadius('sm')}
          fontSize="sm"
          fontWeight="bold"
        >
          ${course.price}
        </Box>
      </Box>

      {/* Course Content */}
      <Box 
        display="flex" 
        flexDirection="column" 
        flex={1}
        px={getSpacing(4)}
        pb={getSpacing(4)}
      >
        <Box
          mb={getSpacing(3)}
          fontSize="lg"
          fontWeight="bold"
          color={getColor('brand.primary')}
          noOfLines={2}
          minH="48px"
        >
          {course.title}
        </Box>

        <Box
          mb={getSpacing(4)}
          fontSize="sm"
          color={getColor('text.secondary')}
          noOfLines={3}
          flex={1}
        >
          {course.description}
        </Box>

        {/* Course Stats */}
        <Box display="flex" flexDirection="column" gap={getSpacing(3)} mb={getSpacing(4)}>
          <Box 
            display="flex" 
            justifyContent="space-between" 
            fontSize="xs"
            color={getColor('text.muted')}
          >
            <Box>👨‍🏫 {course.instructor_name}</Box>
            <Box>⭐ {course.rating}</Box>
          </Box>
          
          <Box 
            display="flex" 
            justifyContent="space-between" 
            fontSize="xs"
            color={getColor('text.muted')}
          >
            <Box>📚 {course.lessons_count} lessons</Box>
            <Box>⏱️ {course.duration_hours}h</Box>
          </Box>
          
          <Box 
            display="flex" 
            justifyContent="space-between" 
            fontSize="xs"
            color={getColor('text.muted')}
          >
            <Box>👥 {course.students_count?.toLocaleString()} students</Box>
            <Box>🎯 Interactive</Box>
          </Box>
        </Box>

        {/* Action Button */}
        <Box
          as="button"
          bg={isEnrolled ? getColor('status.success') : getColor('brand.primary')}
          color={getColor('text.inverse')}
          fontFamily="mono"
          fontSize="sm"
          fontWeight="bold"
          borderRadius={getBorderRadius('base')}
          p={getSpacing(3)}
          border="none"
          cursor="pointer"
          transition="all 0.2s ease"
          _hover={{
            transform: "translateY(-1px)",
            boxShadow: getShadow('md')
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