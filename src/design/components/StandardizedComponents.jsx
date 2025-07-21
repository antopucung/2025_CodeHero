// Standardized Components - Consistent component patterns
import React from 'react';
import { Box, Text as ChakraText, Button as ChakraButton } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useResponsive } from '../hooks/useResponsive';
import { useThemeTokens } from '../../theme/hooks/useThemeTokens';
import { 
  typographyVariants, 
  layoutVariants, 
  interactiveVariants, 
  statusVariants,
  animationVariants 
} from '../system/ComponentSystem';
import { designSystem, useDesignSystem } from '../system/DesignSystem';
import { responsiveSpacing } from '../system/ResponsiveSystem';

// Motion wrapper for consistent animations
const MotionBox = motion(Box);

/**
 * Standardized Typography Components
 * Replaces inline font styling with consistent variants
 */
export function PageTitle({ children, ...props }) {
  const { getColor } = useThemeTokens();
  return (
    <ChakraText 
      {...typographyVariants.pageTitle} 
      color={getColor('brand.primary')}
      {...props}
    >
      {children}
    </ChakraText>
  );
}

export function SectionTitle({ children, ...props }) {
  const { getColor } = useThemeTokens();
  return (
    <ChakraText 
      {...typographyVariants.sectionTitle}
      color={getColor('brand.secondary')}
      {...props}
    >
      {children}
    </ChakraText>
  );
}

export function CardTitle({ children, ...props }) {
  const { getColor } = useThemeTokens();
  return (
    <ChakraText 
      {...typographyVariants.cardTitle}
      color={getColor('text.primary')}
      {...props}
    >
      {children}
    </ChakraText>
  );
}

export function BodyText({ children, ...props }) {
  const { getColor } = useThemeTokens();
  return (
    <ChakraText 
      {...typographyVariants.bodyText}
      color={getColor('text.secondary')}
      {...props}
    >
      {children}
    </ChakraText>
  );
}

export function Caption({ children, ...props }) {
  const { getColor } = useThemeTokens();
  return (
    <ChakraText 
      {...typographyVariants.caption}
      color={getColor('text.muted')}
      {...props}
    >
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
export function PageContainer({ children, maxWidth = 'adaptive', ...props }) {
  const { isMobile, getResponsiveValue } = useResponsive();
  
  const containerMaxWidth = getResponsiveValue({
    base: '100%',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  });
  
  return (
    <Box 
      {...layoutVariants.page} 
      maxW={maxWidth === 'adaptive' ? containerMaxWidth : maxWidth}
      px={getResponsiveValue({
        base: designSystem.spacing[4],
        md: designSystem.spacing[6],
        lg: designSystem.spacing[8]
      })}
      {...props}
    >
      {children}
    </Box>
  );
}

export function Section({ children, animated = false, ...props }) {
  const { getResponsiveValue } = useResponsive();
  const Component = animated ? MotionBox : Box;
  const animationProps = animated ? animationVariants.slideUp : {};
  
  return (
    <Component 
      {...layoutVariants.section} 
      p={getResponsiveValue({
        base: designSystem.spacing[4],
        md: designSystem.spacing[6],
        lg: designSystem.spacing[8]
      })}
      {...animationProps} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function Card({ children, animated = false, hover = false, ...props }) {
  const { isMobile, isTouch, getResponsiveValue } = useResponsive();
  const Component = animated ? MotionBox : Box;
  
  const animationProps = {
    ...(animated ? animationVariants.fadeIn : {}),
    ...(hover && !isTouch ? animationVariants.hover : {})
  };
  
  return (
    <Component 
      {...layoutVariants.card} 
      p={getResponsiveValue({
        base: isMobile ? designSystem.spacing[4] : designSystem.spacing[6],
        md: designSystem.spacing[6],
        lg: designSystem.spacing[8]
      })}
      {...animationProps} 
      {...props}
    >
      {children}
    </Component>
  );
}

export function Grid({ children, columns, adaptive = true, ...props }) {
  const { isMobile, isTablet, getResponsiveValue } = useResponsive();
  
  // Adaptive column logic
  const gridColumns = adaptive ? getResponsiveValue({
    base: '1fr',
    sm: columns?.sm || 'repeat(2, 1fr)',
    md: columns?.md || 'repeat(2, 1fr)',
    lg: columns?.lg || 'repeat(3, 1fr)',
    xl: columns?.xl || 'repeat(4, 1fr)'
  }) : columns || layoutVariants.grid.gridTemplateColumns;
  
  return (
    <Box 
      {...layoutVariants.grid} 
      gridTemplateColumns={gridColumns}
      gap={getResponsiveValue({
        base: designSystem.spacing[4],
        md: designSystem.spacing[6],
        lg: designSystem.spacing[8]
      })}
      {...props}
    >
      {children}
    </Box>
  );
}

export function Stack({ children, horizontal = false, ...props }) {
  const { isMobile, getResponsiveValue } = useResponsive();
  const variant = horizontal ? layoutVariants.hstack : layoutVariants.stack;
  
  const stackGap = getResponsiveValue({
    base: designSystem.spacing[3],
    md: designSystem.spacing[4],
    lg: designSystem.spacing[6]
  });
  
  return (
    <Box {...variant} gap={stackGap} {...props}>
      {children}
    </Box>
  );
}

/**
 * Standardized Interactive Components
 * Consistent button and input patterns
 */
export function StandardButton({ variant = 'primary', children, animated = false, ...props }) {
  const { isTouch, getResponsiveValue } = useResponsive();
  const Component = animated ? motion(ChakraButton) : ChakraButton;
  
  // Disable hover animations on touch devices
  const animationProps = animated && !isTouch ? animationVariants.hover : {};
  
  const buttonPadding = getResponsiveValue({
    base: { px: designSystem.spacing[4], py: designSystem.spacing[3] },
    md: { px: designSystem.spacing[6], py: designSystem.spacing[3] }
  });
  
  return (
    <Component 
      {...interactiveVariants.button[variant]} 
      {...buttonPadding}
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
  const { isMobile, getResponsiveValue } = useResponsive();
  
  const cardPadding = getResponsiveValue({
    base: designSystem.spacing[4],
    md: designSystem.spacing[6]
  });
  
  return (
    <Card animated={animated} hover={!isMobile} p={cardPadding} {...props}>
      <Stack>
        <Stack horizontal>
          {icon && (
            <Box 
              fontSize={getResponsiveValue({
                base: designSystem.typography.sizes.lg,
                md: designSystem.typography.sizes.xl
              })} 
              color={color}
            >
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
  const { isMobile, getResponsiveValue } = useResponsive();
  const color = achievement?.color || designSystem.colors.brand.primary;
  
  const cardPadding = getResponsiveValue({
    base: designSystem.spacing[3],
    md: designSystem.spacing[4]
  });
  
  return (
    <Card animated={animated} hover={!isMobile} p={cardPadding} {...props}>
      <Stack>
        <Box 
          textAlign="center" 
          fontSize={getResponsiveValue({
            base: designSystem.typography.sizes.xl,
            md: designSystem.typography.sizes['2xl']
          })}
        >
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
  const { isMobile, isTouch, getResponsiveValue } = useResponsive();
  
  const cardPadding = getResponsiveValue({
    base: designSystem.spacing[4],
    md: designSystem.spacing[6]
  });
  
  return (
    <Card 
      animated={animated} 
      hover={!isTouch} 
      cursor="pointer"
      p={cardPadding}
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
  const { isMobile, getResponsiveValue } = useResponsive();
  
  return (
    <PageContainer {...props}>
      {/* Page Header */}
      <Section animated>
        <Stack>
          <Stack horizontal={!isMobile}>
            <Box flex={1}>
              <PageTitle>{title}</PageTitle>
              {subtitle && <BodyText>{subtitle}</BodyText>}
            </Box>
            {actions.length > 0 && (
              <Stack horizontal={!isMobile}>
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
            <Grid 
              columns={{ 
                base: isMobile ? '1fr' : 'repeat(auto-fit, minmax(120px, 1fr))',
                sm: 'repeat(auto-fit, minmax(140px, 1fr))',
                md: 'repeat(auto-fit, minmax(160px, 1fr))'
              }}
            >
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
  const { isMobile } = useResponsive();
  
  return (
    <Grid 
      columns={{ base: '1fr', lg: isMobile ? '1fr' : '1fr 1fr' }}
      gap={{
        base: designSystem.spacing[6],
        md: designSystem.spacing[8]
      }}
      {...props}
    >
      <Stack>{leftContent}</Stack>
      {!isMobile && <Stack>{rightContent}</Stack>}
    </Grid>
  );
}

export function ThreeColumnLayout({ leftContent, centerContent, rightContent, ...props }) {
  const { isMobile, isTablet } = useResponsive();
  
  return (
    <Grid 
      columns={{ 
        base: '1fr', 
        md: isMobile ? '1fr' : (isTablet ? '1fr 1fr' : '1fr 2fr 1fr')
      }}
      gap={{
        base: designSystem.spacing[4],
        md: designSystem.spacing[6],
        lg: designSystem.spacing[8]
      }}
      {...props}
    >
      <Stack>{leftContent}</Stack>
      {!isMobile && <Stack>{centerContent}</Stack>}
      {!isMobile && !isTablet && <Stack>{rightContent}</Stack>}
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
};