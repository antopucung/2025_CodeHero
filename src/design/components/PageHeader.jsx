// Reusable Page Header Component
import React from 'react';
import { Box, HStack, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Heading, Text, Caption } from './Typography';
import { Button } from './Button';
import { designSystem } from '../system/DesignSystem';

const MotionBox = motion(Box);

export const PageHeader = ({ 
  title, 
  subtitle, 
  stats = [], 
  actions = [],
  glowColor = 'brand.primary',
  ...props 
}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      bg={designSystem.colors.backgrounds.secondary}
      borderBottom={`1px solid ${designSystem.colors.borders.default}`}
      p={designSystem.spacing[6]}
      {...props}
    >
      <VStack spacing={designSystem.spacing[4]} maxW="1200px" mx="auto">
        <MotionBox
          animate={{
            textShadow: [
              `0 0 20px ${designSystem.colors.brand.primary}`,
              `0 0 40px ${designSystem.colors.brand.primary}`,
              `0 0 20px ${designSystem.colors.brand.primary}`
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          textAlign="center"
        >
          <Heading level={1} size="3xl" color="brand" mb={designSystem.spacing[2]}>
            {title}
          </Heading>
          
          {subtitle && (
            <Text size="lg" color="secondary">
              {subtitle}
            </Text>
          )}
        </MotionBox>

        {/* Stats Display */}
        {stats.length > 0 && (
          <HStack spacing={designSystem.spacing[6]} justify="center" flexWrap="wrap">
            {stats.map((stat, index) => (
              <VStack key={index} spacing={0}>
                <Text 
                  size="xl" 
                  color="accent" 
                  fontWeight={designSystem.typography.weights.bold}
                >
                  {stat.value}
                </Text>
                <Caption>{stat.label}</Caption>
              </VStack>
            ))}
          </HStack>
        )}

        {/* Action Buttons */}
        {actions.length > 0 && (
          <HStack spacing={designSystem.spacing[4]} justify="center" flexWrap="wrap">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'primary'}
                size={action.size || 'md'}
                onClick={action.onClick}
              >
                {action.icon && <Box mr={designSystem.spacing[2]}>{action.icon}</Box>}
                {action.label}
              </Button>
            ))}
          </HStack>
        )}
      </VStack>
    </MotionBox>
  );
};

export const SectionHeader = ({ 
  title, 
  subtitle, 
  actions = [],
  ...props 
}) => {
  return (
    <HStack justify="space-between" align="start" w="100%" {...props}>
      <VStack align="start" spacing={designSystem.spacing[1]}>
        <Heading level={2} size="xl" color="brand">
          {title}
        </Heading>
        {subtitle && (
          <Text size="sm" color="muted">
            {subtitle}
          </Text>
        )}
      </VStack>
      
      {actions.length > 0 && (
        <HStack spacing={designSystem.spacing[2]}>
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'secondary'}
              size={action.size || 'sm'}
              onClick={action.onClick}
            >
              {action.icon && <Box mr={designSystem.spacing[1]}>{action.icon}</Box>}
              {action.label}
            </Button>
          ))}
        </HStack>
      )}
    </HStack>
  );
};