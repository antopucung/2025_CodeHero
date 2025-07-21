import React from 'react';
import { Box, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { designSystem } from '../../design/system/DesignSystem';

const MotionBox = motion(Box);

/**
 * UserBadge Component - Visual indicator for achievements, certifications, and levels
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Badge type: 'level', 'cert', 'achievement'
 * @param {string|number} props.value - Badge value (level number, cert key, achievement key)
 * @param {string} props.icon - Icon to display in the badge
 * @param {string} props.color - Badge color
 * @param {string} props.tooltipText - Text to show on hover
 * @param {string} props.size - Badge size: 'sm', 'md', 'lg'
 * @param {Object} props.position - Position object with top, right, bottom, left
 */
export const UserBadge = ({ 
  type, 
  value, 
  icon, 
  color = '#ffd93d', 
  tooltipText = '', 
  size = 'md',
  position = { top: 0, right: 0 },
  animated = true,
  ...props 
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      width: '20px',
      height: '20px',
      fontSize: '10px',
      borderWidth: '1px'
    },
    md: {
      width: '24px',
      height: '24px',
      fontSize: '12px',
      borderWidth: '2px'
    },
    lg: {
      width: '32px',
      height: '32px',
      fontSize: '14px',
      borderWidth: '2px'
    }
  };

  const config = sizeConfig[size];

  // Badge styles based on type
  const getBadgeStyles = () => {
    const baseStyles = {
      position: 'absolute',
      width: config.width,
      height: config.height,
      borderRadius: 'full',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: config.fontSize,
      fontWeight: 'bold',
      fontFamily: designSystem.typography.fonts.mono,
      border: `${config.borderWidth} solid`,
      cursor: 'pointer',
      userSelect: 'none',
      zIndex: 10,
      ...position
    };

    switch (type) {
      case 'level':
        return {
          ...baseStyles,
          bg: color,
          color: '#000',
          borderColor: color,
          boxShadow: `0 0 8px ${color}66`
        };
      
      case 'cert':
        return {
          ...baseStyles,
          bg: `${color}22`,
          color: color,
          borderColor: color,
          boxShadow: `0 0 6px ${color}44`
        };
      
      case 'achievement':
        return {
          ...baseStyles,
          bg: `linear-gradient(45deg, ${color}, ${color}cc)`,
          color: '#fff',
          borderColor: color,
          boxShadow: `0 0 10px ${color}55`
        };
      
      default:
        return {
          ...baseStyles,
          bg: designSystem.colors.backgrounds.surface,
          color: designSystem.colors.text.primary,
          borderColor: designSystem.colors.borders.default
        };
    }
  };

  const badgeStyles = getBadgeStyles();

  const Component = animated ? MotionBox : Box;
  
  const animationProps = animated ? {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { duration: 0.3, type: "spring" },
    whileHover: { 
      scale: 1.1,
      boxShadow: `0 0 15px ${color}77`
    },
    whileTap: { scale: 0.95 }
  } : {};

  // Render the badge content
  const renderBadgeContent = () => {
    if (type === 'level') {
      return value; // Show level number
    }
    return icon; // Show icon for certs and achievements
  };

  return (
    <Tooltip
      label={tooltipText}
      bg={designSystem.colors.backgrounds.elevated}
      color={color}
      fontSize="sm"
      fontFamily={designSystem.typography.fonts.mono}
      px={3}
      py={2}
      borderRadius="md"
      border={`1px solid ${color}`}
      hasArrow
      placement="top"
      openDelay={300}
    >
      <Component
        {...badgeStyles}
        {...animationProps}
        {...props}
      >
        {renderBadgeContent()}
      </Component>
    </Tooltip>
  );
};

/**
 * UserBadgeGroup Component - Manages multiple badges around an element
 * 
 * @param {Object} props - Component props
 * @param {Array} props.badges - Array of badge objects
 * @param {React.ReactNode} props.children - Content to wrap with badges
 * @param {string} props.layout - Layout type: 'corner', 'circular', 'side'
 */
export const UserBadgeGroup = ({ 
  badges = [], 
  children, 
  layout = 'corner',
  maxBadges = 4,
  size = 'md',
  ...props 
}) => {
  // Limit badges to prevent overcrowding
  const visibleBadges = badges.slice(0, maxBadges);
  
  // Calculate positions based on layout
  const getPositions = (layout, count) => {
    switch (layout) {
      case 'circular':
        // Arrange badges in a circle around the element
        return visibleBadges.map((_, index) => {
          const angle = (index / count) * 360;
          const radius = 45;
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          return {
            top: `calc(50% + ${y}px)`,
            left: `calc(50% + ${x}px)`,
            transform: 'translate(-50%, -50%)'
          };
        });
      
      case 'side':
        // Arrange badges vertically on the right side
        return visibleBadges.map((_, index) => ({
          top: `${10 + (index * 35)}px`,
          right: '-8px'
        }));
      
      case 'corner':
      default:
        // Arrange badges in corners
        const positions = [
          { top: '-8px', right: '-8px' }, // Top right
          { bottom: '-8px', right: '-8px' }, // Bottom right
          { top: '-8px', left: '-8px' }, // Top left
          { bottom: '-8px', left: '-8px' } // Bottom left
        ];
        return positions.slice(0, count);
    }
  };

  const positions = getPositions(layout, visibleBadges.length);

  return (
    <Box position="relative" display="inline-block" {...props}>
      {children}
      
      {/* Render badges */}
      {visibleBadges.map((badge, index) => (
        <UserBadge
          key={`${badge.type}-${badge.value}-${index}`}
          type={badge.type}
          value={badge.value}
          icon={badge.icon}
          color={badge.color}
          tooltipText={badge.tooltipText}
          size={size}
          position={positions[index]}
          animated={true}
        />
      ))}
      
      {/* Show overflow indicator if there are more badges */}
      {badges.length > maxBadges && (
        <UserBadge
          type="overflow"
          value={`+${badges.length - maxBadges}`}
          icon={`+${badges.length - maxBadges}`}
          color={designSystem.colors.text.muted}
          tooltipText={`${badges.length - maxBadges} more achievements`}
          size={size}
          position={positions[maxBadges - 1] || { bottom: '-8px', left: '-8px' }}
          animated={true}
        />
      )}
    </Box>
  );
};

export default UserBadge;