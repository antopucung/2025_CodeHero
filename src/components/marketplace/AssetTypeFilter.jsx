import React from 'react';
import { HStack, Badge } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { designSystem } from '../../design/system/DesignSystem';
import { CustomText } from '../../design/components/Typography';

const MotionBadge = motion(Badge);

export const AssetTypeFilter = ({ 
  selectedType, 
  onTypeChange, 
  assetCounts = {} 
}) => {
  const assetTypes = [
    { key: 'all', label: 'All Assets', icon: '📦' },
    { key: 'template', label: 'Templates', icon: '📝' },
    { key: 'ui_kit', label: 'UI Kits', icon: '🎨' },
    { key: 'code_snippet', label: 'Code Snippets', icon: '💻' },
    { key: 'component_library', label: 'Components', icon: '🧩' },
    { key: 'icon_pack', label: 'Icons', icon: '🎭' },
    { key: 'tutorial_pack', label: 'Tutorials', icon: '📚' },
    { key: 'design_system', label: 'Design Systems', icon: '🎪' },
    { key: 'plugin', label: 'Plugins', icon: '🔌' },
    { key: 'other', label: 'Other', icon: '📋' }
  ];

  return (
    <HStack 
      spacing={designSystem.spacing[2]} 
      flexWrap="wrap" 
      justify="center"
      mb={designSystem.spacing[6]}
    >
      {assetTypes.map((type) => {
        const isSelected = selectedType === type.key;
        const count = type.key === 'all' 
          ? Object.values(assetCounts).reduce((sum, count) => sum + count, 0)
          : assetCounts[type.key] || 0;
        
        return (
          <MotionBadge
            key={type.key}
            as="button"
            onClick={() => onTypeChange(type.key)}
            bg={isSelected ? designSystem.colors.brand.primary : designSystem.colors.backgrounds.surface}
            color={isSelected ? designSystem.colors.text.inverse : designSystem.colors.text.secondary}
            border="1px solid"
            borderColor={isSelected ? designSystem.colors.brand.primary : designSystem.colors.borders.default}
            px={designSystem.spacing[3]}
            py={designSystem.spacing[2]}
            borderRadius={designSystem.radii.md}
            cursor="pointer"
            fontSize="sm"
            fontWeight={designSystem.typography.weights.bold}
            fontFamily={designSystem.typography.fonts.mono}
            display="flex"
            alignItems="center"
            gap={designSystem.spacing[2]}
            whileHover={{ 
              scale: 1.05,
              boxShadow: `0 4px 12px ${isSelected ? designSystem.colors.brand.primary : designSystem.colors.backgrounds.surface}44`
            }}
            whileTap={{ scale: 0.95 }}
            transition="all 0.2s ease"
            _hover={{
              borderColor: designSystem.colors.brand.primary,
              color: isSelected ? designSystem.colors.text.inverse : designSystem.colors.brand.primary
            }}
          >
            <CustomText as="span" fontSize="sm">
              {type.icon}
            </CustomText>
            <CustomText 
              as="span" 
              fontSize="sm" 
              fontWeight="inherit" 
              color="inherit"
            >
              {type.label}
            </CustomText>
            {count > 0 && (
              <CustomText 
                as="span" 
                fontSize="xs" 
                color="inherit"
                bg={isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}
                px={designSystem.spacing[1]}
                py="1px"
                borderRadius={designSystem.radii.sm}
                ml={designSystem.spacing[1]}
              >
                {count}
              </CustomText>
            )}
          </MotionBadge>
        );
      })}
    </HStack>
  );
};