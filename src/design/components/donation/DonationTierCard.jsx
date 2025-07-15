import React from 'react';
import { Box, VStack, HStack, Badge } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { designSystem } from '../../system/DesignSystem';
import { CustomText } from '../Typography';
import { Button } from '../Button';

const MotionBox = motion(Box);

export const DonationTierCard = ({ 
  tier, 
  isActive = false,
  isRecommended = false,
  onSelect,
  selectedTier = null,
}) => {
  const isSelected = selectedTier && selectedTier.id === tier.id;
  
  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <Box
        bg={designSystem.colors.backgrounds.elevated}
        borderRadius={designSystem.radii.lg}
        border="1px solid"
        borderColor={
          isSelected ? tier.color : 
          isActive ? designSystem.colors.brand.primary : 
          designSystem.colors.borders.default
        }
        overflow="hidden"
        position="relative"
        boxShadow={isSelected || isRecommended ? `0 0 20px ${tier.color}44` : 'none'}
        h="100%"
        onClick={() => onSelect(tier)}
        cursor="pointer"
      >
        {/* Header with tier name */}
        <Box
          p={designSystem.spacing[4]}
          bg={`${tier.color}22`}
          borderBottom="1px solid"
          borderColor={tier.color}
        >
          <HStack justify="space-between">
            <HStack>
              <Box fontSize="xl">{tier.icon}</Box>
              <CustomText 
                size="lg" 
                color={tier.color} 
                fontWeight={designSystem.typography.weights.bold}
              >
                {tier.name}
              </CustomText>
            </HStack>
            
            {isRecommended && (
              <Badge 
                bg={tier.color} 
                color="#000"
                px={designSystem.spacing[2]}
                py={designSystem.spacing[1]}
              >
                RECOMMENDED
              </Badge>
            )}
          </HStack>
        </Box>
        
        {/* Price */}
        <VStack p={designSystem.spacing[4]} spacing={designSystem.spacing[2]}>
          <HStack align="baseline">
            <Box fontSize="2xl" color={tier.color} fontWeight="bold">
              ${tier.amount}
            </Box>
            <Box fontSize="sm" color={designSystem.colors.text.muted}>
              / month
            </Box>
          </HStack>
          
          {/* Duration badge */}
          <Badge 
            bg={designSystem.colors.backgrounds.surface} 
            color={designSystem.colors.text.secondary}
          >
            {tier.durationDays} days access
          </Badge>
          
          {/* Rewards list */}
          <VStack align="start" spacing={designSystem.spacing[2]} mt={designSystem.spacing[4]} w="100%">
            {tier.rewards.map((reward, index) => (
              <HStack key={index} align="start" spacing={designSystem.spacing[2]}>
                <Box color={tier.color}>✓</Box>
                <CustomText size="sm" color={designSystem.colors.text.secondary}>
                  {reward}
                </CustomText>
              </HStack>
            ))}
          </VStack>
          
          {/* CTA Button */}
          <Button
            bg={isSelected ? tier.color : designSystem.colors.backgrounds.surface}
            color={isSelected ? "#000" : designSystem.colors.text.secondary}
            borderColor={tier.color}
            variant={isSelected ? "solid" : "outline"}
            w="100%"
            mt={designSystem.spacing[4]}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(tier);
            }}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
          
          {/* Active indicator */}
          {isActive && (
            <Badge 
              bg={designSystem.colors.status.success} 
              color={designSystem.colors.text.inverse}
              position="absolute"
              top={designSystem.spacing[4]}
              right={designSystem.spacing[4]}
            >
              ACTIVE
            </Badge>
          )}
        </VStack>
      </Box>
    </MotionBox>
  );
};