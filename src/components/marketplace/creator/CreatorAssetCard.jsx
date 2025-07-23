import React from 'react';
import { Box, VStack, HStack, Badge, Image, Menu, MenuButton, MenuList, MenuItem, IconButton } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { designSystem } from '../../../design/system/DesignSystem';
import { CustomText } from '../../../design/components/Typography';
import { Button } from '../../../design/components/Button';
import { Card } from '../../../design/components/Card';

const MotionBox = motion(Box);

export const CreatorAssetCard = ({ 
  asset, 
  onEdit, 
  onDelete, 
  onTogglePublish,
  compact = false,
  ...props 
}) => {
  const navigate = useNavigate();

  const getAssetTypeColor = (assetType) => {
    const colors = {
      template: designSystem.colors.brand.primary,
      ui_kit: designSystem.colors.brand.secondary,
      code_snippet: designSystem.colors.brand.accent,
      '3d_model': designSystem.colors.status.info,
      tutorial_pack: designSystem.colors.status.success,
      icon_pack: designSystem.colors.status.warning,
      font_pack: designSystem.colors.status.error,
      design_system: designSystem.colors.brand.primary,
      component_library: designSystem.colors.brand.secondary,
      plugin: designSystem.colors.brand.accent,
      extension: designSystem.colors.status.info,
      other: designSystem.colors.text.muted
    };
    return colors[assetType] || colors.other;
  };

  const getAssetTypeIcon = (assetType) => {
    const icons = {
      template: '📝',
      ui_kit: '🎨',
      code_snippet: '💻',
      '3d_model': '🎯',
      tutorial_pack: '📚',
      icon_pack: '🎭',
      font_pack: '🔤',
      design_system: '🎪',
      component_library: '🧩',
      plugin: '🔌',
      extension: '⚡',
      other: '📦'
    };
    return icons[assetType] || icons.other;
  };

  const handleCardClick = () => {
    navigate(`/marketplace/assets/${asset.slug}`);
  };

  const isFree = asset.price === 0;

  if (compact) {
    return (
      <Card variant="default" p={4} cursor="pointer" onClick={handleCardClick}>
        <HStack spacing={4}>
          {/* Thumbnail */}
          <Box
            w="80px"
            h="60px"
            borderRadius="md"
            overflow="hidden"
            flexShrink={0}
            bg={designSystem.colors.backgrounds.surface}
          >
            {asset.thumbnail_url ? (
              <Image
                src={asset.thumbnail_url}
                alt={asset.title}
                w="100%"
                h="100%"
                objectFit="cover"
                fallback={
                  <Box
                    w="100%"
                    h="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bg={designSystem.colors.backgrounds.secondary}
                    color={designSystem.colors.text.muted}
                    fontSize="xl"
                  >
                    {getAssetTypeIcon(asset.asset_type)}
                  </Box>
                }
              />
            ) : (
              <Box
                w="100%"
                h="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={designSystem.colors.backgrounds.secondary}
                color={designSystem.colors.text.muted}
                fontSize="xl"
              >
                {getAssetTypeIcon(asset.asset_type)}
              </Box>
            )}
          </Box>
          
          {/* Content */}
          <VStack align="start" spacing={1} flex={1}>
            <HStack spacing={2} w="100%">
              <CustomText size="md" fontWeight="bold" color="brand" flex={1} noOfLines={1}>
                {asset.title}
              </CustomText>
              <Badge
                bg={asset.is_published ? designSystem.colors.status.success : designSystem.colors.status.warning}
                color={designSystem.colors.text.inverse}
                fontSize="xs"
              >
                {asset.is_published ? 'PUBLISHED' : 'DRAFT'}
              </Badge>
            </HStack>
            
            <HStack spacing={4} fontSize="xs" color={designSystem.colors.text.muted}>
              <Box>💰 {isFree ? 'FREE' : `$${asset.price}`}</Box>
              <Box>📥 {asset.downloads_count || 0}</Box>
              <Box>⭐ {asset.rating?.toFixed(1) || '0.0'}</Box>
            </HStack>
          </VStack>
          
          {/* Actions */}
          <Menu>
            <MenuButton
              as={IconButton}
              icon="⋯"
              size="sm"
              variant="ghost"
              onClick={(e) => e.stopPropagation()}
            />
            <MenuList>
              <MenuItem onClick={(e) => { e.stopPropagation(); onEdit?.(asset); }}>
                ✏️ Edit
              </MenuItem>
              <MenuItem onClick={(e) => { e.stopPropagation(); onTogglePublish?.(asset); }}>
                {asset.is_published ? '📤 Unpublish' : '📢 Publish'}
              </MenuItem>
              <MenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete?.(asset.id); }}
                color="red.400"
              >
                🗑️ Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Card>
    );
  }

  return (
    <Card
      variant="elevated"
      overflow="hidden"
      h="100%"
      display="flex"
      flexDirection="column"
      position="relative"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 25px ${getAssetTypeColor(asset.asset_type)}33`
      }}
      transition="all 0.3s ease"
      {...props}
    >
      {/* Asset Thumbnail */}
      <Box 
        position="relative" 
        h="200px" 
        overflow="hidden"
        bg={designSystem.colors.backgrounds.surface}
        cursor="pointer"
        onClick={handleCardClick}
      >
        {asset.thumbnail_url ? (
          <Image
            src={asset.thumbnail_url}
            alt={asset.title}
            w="100%"
            h="100%"
            objectFit="cover"
            fallback={
              <Box
                w="100%"
                h="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg={designSystem.colors.backgrounds.secondary}
                color={designSystem.colors.text.muted}
                fontSize="4xl"
              >
                {getAssetTypeIcon(asset.asset_type)}
              </Box>
            }
          />
        ) : (
          <Box
            w="100%"
            h="100%"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={designSystem.colors.backgrounds.secondary}
            color={designSystem.colors.text.muted}
            fontSize="4xl"
          >
            {getAssetTypeIcon(asset.asset_type)}
          </Box>
        )}
        
        {/* Status Badge */}
        <Badge
          position="absolute"
          top={designSystem.spacing[2]}
          right={designSystem.spacing[2]}
          bg={asset.is_published ? designSystem.colors.status.success : designSystem.colors.status.warning}
          color={designSystem.colors.text.inverse}
          px={designSystem.spacing[2]}
          py={designSystem.spacing[1]}
          borderRadius={designSystem.radii.sm}
          fontSize="xs"
          fontWeight="bold"
        >
          {asset.is_published ? 'PUBLISHED' : 'DRAFT'}
        </Badge>
        
        {/* Asset Type Badge */}
        <Badge
          position="absolute"
          top={designSystem.spacing[2]}
          left={designSystem.spacing[2]}
          bg={getAssetTypeColor(asset.asset_type)}
          color={designSystem.colors.text.inverse}
          px={designSystem.spacing[2]}
          py={designSystem.spacing[1]}
          borderRadius={designSystem.radii.sm}
          fontSize="xs"
          fontWeight="bold"
        >
          {asset.asset_type.replace('_', ' ').toUpperCase()}
        </Badge>
      </Box>

      {/* Asset Content */}
      <VStack 
        align="stretch" 
        spacing={designSystem.spacing[3]} 
        p={designSystem.spacing[4]}
        flex={1}
        justify="space-between"
      >
        <VStack align="stretch" spacing={designSystem.spacing[2]}>
          <CustomText
            size="lg"
            fontWeight={designSystem.typography.weights.bold}
            color="brand"
            noOfLines={2}
            minH="48px"
            cursor="pointer"
            onClick={handleCardClick}
          >
            {asset.title}
          </CustomText>
          
          <CustomText
            size="sm"
            color="secondary"
            noOfLines={2}
            flex={1}
          >
            {asset.description}
          </CustomText>
        </VStack>
        
        {/* Asset Stats */}
        <VStack spacing={designSystem.spacing[2]}>
          <HStack justify="space-between" w="100%" fontSize="xs" color={designSystem.colors.text.muted}>
            <HStack>
              <Box>💰 {isFree ? 'FREE' : `$${asset.price}`}</Box>
              <Box>•</Box>
              <Box>📥 {asset.downloads_count || 0}</Box>
            </HStack>
            <Box>⭐ {asset.rating?.toFixed(1) || '0.0'}</Box>
          </HStack>
          
          {asset.created_at && (
            <HStack justify="space-between" w="100%" fontSize="xs" color={designSystem.colors.text.muted}>
              <Box>📅 {new Date(asset.created_at).toLocaleDateString()}</Box>
              {asset.file_size_mb && <Box>📦 {asset.file_size_mb}MB</Box>}
            </HStack>
          )}
        </VStack>
        
        {/* Tags */}
        {asset.tags && asset.tags.length > 0 && (
          <HStack spacing={designSystem.spacing[1]} flexWrap="wrap">
            {asset.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                bg={designSystem.colors.backgrounds.surface}
                color={designSystem.colors.text.secondary}
                size="sm"
                px={designSystem.spacing[2]}
                py={designSystem.spacing[1]}
                borderRadius={designSystem.radii.sm}
                fontSize="xs"
              >
                {tag}
              </Badge>
            ))}
            {asset.tags.length > 3 && (
              <Badge
                bg={designSystem.colors.backgrounds.surface}
                color={designSystem.colors.text.muted}
                size="sm"
                px={designSystem.spacing[2]}
                py={designSystem.spacing[1]}
                borderRadius={designSystem.radii.sm}
                fontSize="xs"
              >
                +{asset.tags.length - 3}
              </Badge>
            )}
          </HStack>
        )}
        
        {/* Action Buttons */}
        <HStack spacing={designSystem.spacing[2]}>
          <Button
            variant="secondary"
            size="sm"
            flex={1}
            onClick={() => onEdit?.(asset)}
          >
            ✏️ Edit
          </Button>
          
          <Button
            bg={asset.is_published ? designSystem.colors.status.warning : designSystem.colors.status.success}
            color={designSystem.colors.text.inverse}
            size="sm"
            flex={1}
            onClick={() => onTogglePublish?.(asset)}
          >
            {asset.is_published ? '📤 Unpublish' : '📢 Publish'}
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
};