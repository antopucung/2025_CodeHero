// Standardized Components - Consistent component patterns
import React from 'react';
import { Box, Text as ChakraText, Button as ChakraButton } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { 
  typographyVariants, 
  layoutVariants, 
  interactiveVariants, 
  statusVariants,
  animationVariants 
} from '../system/ComponentSystem';
import { designSystem } from '../system/DesignSystem';

// Motion wrapper for consistent animations
const MotionBox = motion(Box);

/**
 * Standardized Typography Components
 * Replaces inline font styling with consistent variants
 */
export function PageTitle({ children, ...props }) {
  return (
    <ChakraText {...typographyVariants.pageTitle} {...props}>
      {children}
    </ChakraText>
  );
}

export function SectionTitle({ children, ...props }) {
  return (
    <ChakraText {...typographyVariants.sectionTitle} {...props}>
      {children}
    </ChakraText>
  );
}

export function CardTitle({ children, ...props }) {
  return (
    <ChakraText {...typographyVariants.cardTitle} {...props}>
      {children}
    </ChakraText>
  );
}

export function BodyText({ children, ...props }) {
  return (
    <ChakraText {...typographyVariants.bodyText} {...props}>
      {children}
    </ChakraText>
  );
}

export function Caption({ children, ...props }) {
  return (
    <ChakraText {...typographyVariants.caption} {...props}>
      {children}
    </ChakraText>
  );
}

export function Label({ children, ...props }) {
  return (
    <ChakraText {...typographyVariants.label} {...props}>
      {children}
    </ChakraText>
  );
}

/**
 * Standardized Layout Components
 * Ensures consistent spacing and structure
 */
export function PageContainer({ children, ...props }) {
  return (
    <Box {...layoutVariants.page} {...props}>
      {children}
    </Box>
  );
}

export function Section({ children, animated = false, ...props }) {
  const Component = animated ? MotionBox : Box;
  const animationProps = animated ? animationVariants.slideUp : {};
  
  return (
    <Component {...layoutVariants.section} {...animationProps} {...props}>
      {children}
    </Component>
  );
}

export function Card({ children, animated = false, hover = false, ...props }) {
  const Component = animated ? MotionBox : Box;
  const animationProps = {
    ...(animated ? animationVariants.fadeIn : {}),
    ...(hover ? animationVariants.hover : {})
  };
  
  return (
    <Component {...layoutVariants.card} {...animationProps} {...props}>
      {children}
    </Component>
  );
}

export function Grid({ children, columns, ...props }) {
  return (
    <Box 
      {...layoutVariants.grid} 
      gridTemplateColumns={columns || layoutVariants.grid.gridTemplateColumns}
      {...props}
    >
      {children}
    </Box>
  );
}

export function Stack({ children, horizontal = false, ...props }) {
  const variant = horizontal ? layoutVariants.hstack : layoutVariants.stack;
  return (
    <Box {...variant} {...props}>
      {children}
    </Box>
  );
}

/**
 * Standardized Interactive Components
 * Consistent button and input patterns
 */
export function StandardButton({ variant = 'primary', children, animated = false, ...props }) {
  const Component = animated ? motion(ChakraButton) : ChakraButton;
  const animationProps = animated ? animationVariants.hover : {};
  
  return (
    <Component 
      {...interactiveVariants.button[variant]} 
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export function StandardLink({ children, ...props }) {
  return (
    <ChakraText as="a" {...interactiveVariants.link} {...props}>
      {children}
    </ChakraText>
  );
}

/**
 * Standardized Status Components
 * Consistent status indicators
 */
export function StatusBadge({ variant = 'info', children, ...props }) {
  return (
    <Box {...statusVariants.badge[variant]} {...props}>
      {children}
    </Box>
  );
}

export function ProgressBar({ value = 0, animated = false, ...props }) {
  const Component = animated ? MotionBox : Box;
  
  return (
    <Box {...statusVariants.progress} {...props}>
      <Component
        bg={designSystem.colors.brand.primary}
        h="100%"
        w={`${Math.min(Math.max(0, value), 100)}%`}
        borderRadius={designSystem.radii.base}
        {...(animated ? { 
          initial: { width: 0 },
          animate: { width: `${value}%` },
          transition: { duration: 0.5, ease: 'easeOut' }
        } : {})}
      />
    </Box>
  );
}

/**
 * Profile-Specific Standardized Components
 * Specialized components for profile features
 */
export function ProfileStatCard({ label, value, icon, color, animated = false, ...props }) {
  return (
    <Card animated={animated} hover={true} {...props}>
      <Stack>
        <Stack horizontal>
          {icon && (
            <Box fontSize={designSystem.typography.sizes.xl} color={color}>
              {icon}
            </Box>
          )}
          <Box flex={1}>
            <Label>{label}</Label>
            <PageTitle color={color}>{value}</PageTitle>
          </Box>
        </Stack>
      </Stack>
    </Card>
  );
}

export function AchievementCard({ achievement, animated = false, ...props }) {
  const color = achievement?.color || designSystem.colors.brand.primary;
  
  return (
    <Card animated={animated} hover={true} {...props}>
      <Stack>
        <Box textAlign="center" fontSize={designSystem.typography.sizes['2xl']}>
          {achievement?.icon || '🏆'}
        </Box>
        <CardTitle textAlign="center">
          {achievement?.title || 'Achievement'}
        </CardTitle>
        <Caption textAlign="center">
          {achievement?.description || 'Achievement unlocked!'}
        </Caption>
        <StatusBadge variant={achievement?.rarity === 'legendary' ? 'error' : 'success'}>
          {achievement?.rarity?.toUpperCase() || 'UNLOCKED'}
        </StatusBadge>
      </Stack>
    </Card>
  );
}

export function CourseCard({ course, animated = false, onNavigate, ...props }) {
  return (
    <Card 
      animated={animated} 
      hover={true} 
      cursor="pointer"
      onClick={() => onNavigate?.(course)}
      {...props}
    >
      <Stack>
        <Stack horizontal>
          <CardTitle flex={1}>{course?.title || 'Course Title'}</CardTitle>
          <StatusBadge variant="info">
            {course?.language?.toUpperCase() || 'CODE'}
          </StatusBadge>
        </Stack>
        
        <BodyText noOfLines={2}>
          {course?.description || 'Course description'}
        </BodyText>
        
        <Stack horizontal>
          <Caption>📚 {course?.lessons_count || 0} lessons</Caption>
          <Caption>⏱️ {course?.duration_hours || 0}h</Caption>
          <Caption>⭐ {course?.rating || 0}</Caption>
        </Stack>
        
        <ProgressBar 
          value={course?.progress || 0}
          animated={animated}
        />
      </Stack>
    </Card>
  );
}

/**
 * Layout Templates
 * Pre-defined layout patterns for consistency
 */
export function ProfilePageLayout({ 
  title, 
  subtitle, 
  stats = [], 
  children, 
  actions = [],
  ...props 
}) {
  return (
    <PageContainer {...props}>
      {/* Page Header */}
      <Section animated>
        <Stack>
          <Stack horizontal>
            <Box flex={1}>
              <PageTitle>{title}</PageTitle>
              {subtitle && <BodyText>{subtitle}</BodyText>}
            </Box>
            {actions.length > 0 && (
              <Stack horizontal>
                {actions.map((action, index) => (
                  <StandardButton 
                    key={index}
                    variant={action.variant || 'secondary'}
                    onClick={action.onClick}
                    animated
                  >
                    {action.label}
                  </StandardButton>
                ))}
              </Stack>
            )}
          </Stack>
          
          {stats.length > 0 && (
            <Grid columns={{ base: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
              {stats.map((stat, index) => (
                <ProfileStatCard
                  key={index}
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color || designSystem.colors.brand.primary}
                  animated
                />
              ))}
            </Grid>
          )}
        </Stack>
      </Section>
      
      {/* Main Content */}
      {children}
    </PageContainer>
  );
}

export function TwoColumnLayout({ leftContent, rightContent, ...props }) {
  return (
    <Grid 
      columns={{ base: '1fr', lg: '1fr 1fr' }}
      gap={designSystem.spacing[8]}
      {...props}
    >
      <Stack>{leftContent}</Stack>
      <Stack>{rightContent}</Stack>
    </Grid>
  );
}

export function ThreeColumnLayout({ leftContent, centerContent, rightContent, ...props }) {
  return (
    <Grid 
      columns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 2fr 1fr' }}
      gap={designSystem.spacing[6]}
      {...props}
    >
      <Stack>{leftContent}</Stack>
      <Stack>{centerContent}</Stack>
      <Stack>{rightContent}</Stack>
    </Grid>
  );
}

// Export all standardized components
export default {
  // Typography
  PageTitle,
  SectionTitle,
  CardTitle,
  BodyText,
  Caption,
  Label,
  
  // Layout
  PageContainer,
  Section,
  Card,
  Grid,
  Stack,
  
  // Interactive
  StandardButton,
  StandardLink,
  
  // Status
  StatusBadge,
  ProgressBar,
  
  // Specialized
  ProfileStatCard,
  AchievementCard,
  CourseCard,
  
  // Templates
  ProfilePageLayout,
  TwoColumnLayout,
  ThreeColumnLayout