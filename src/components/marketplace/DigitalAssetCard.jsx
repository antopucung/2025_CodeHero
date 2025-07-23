import React from 'react';
import { Box, VStack, HStack, Badge, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { designSystem } from '../../design/system/DesignSystem';
import { CustomText } from '../../design/components/Typography';
import { Button } from '../../design/components/Button';
import { Card } from '../../design/components/Card';

const MotionBox = motion(Box);

export const DigitalAssetCard = ({ 
  asset, 
  onPurchase, 
  onDownload, 
  isOwned = false,
  showCreator = true,
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

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    if (action === 'purchase') {
      onPurchase?.(asset);
    } else if (action === 'download') {
      onDownload?.(asset);
    }
  };

  const isFree = asset.price === 0;
  const canDownload = isFree || isOwned;

  return (
    <Card
      variant="elevated"
      onClick={handleCardClick}
      cursor="pointer"
      overflow="hidden"
      h="100%"
      display="flex"
      flexDirection="column"
      _hover={{
        transform: 'translateY(-4px)',
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
        
        {/* Price Badge */}
        <Badge
          position="absolute"
          top={designSystem.spacing[2]}
          right={designSystem.spacing[2]}
          bg={isFree ? designSystem.colors.status.success : designSystem.colors.backgrounds.overlay}
          color={designSystem.colors.text.inverse}
          px={designSystem.spacing[2]}
          py={designSystem.spacing[1]}
          borderRadius={designSystem.radii.sm}
          fontSize="sm"
          fontWeight="bold"
        >
          {isFree ? 'FREE' : `$${asset.price}`}
        </Badge>
        
        {/* Owned Indicator */}
        {isOwned && (
          <Badge
            position="absolute"
            bottom={designSystem.spacing[2]}
            right={designSystem.spacing[2]}
            bg={designSystem.colors.status.success}
            color={designSystem.colors.text.inverse}
            px={designSystem.spacing[2]}
            py={designSystem.spacing[1]}
            borderRadius={designSystem.radii.sm}
            fontSize="xs"
            fontWeight="bold"
          >
            ✓ OWNED
          </Badge>
        )}
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
          >
            {asset.title}
          </CustomText>
          
          <CustomText
            size="sm"
            color="secondary"
            noOfLines={3}
            flex={1}
          >
            {asset.description}
          </CustomText>
        </VStack>
        
        {/* Asset Stats */}
        <VStack spacing={designSystem.spacing[2]}>
          <HStack justify="space-between" w="100%" fontSize="xs" color={designSystem.colors.text.muted}>
            <HStack>
              <Box>⭐ {asset.rating?.toFixed(1) || '0.0'}</Box>
              <Box>•</Box>
              <Box>📥 {asset.downloads_count || 0}</Box>
            </HStack>
            {asset.file_size_mb && (
              <Box>{asset.file_size_mb}MB</Box>
            )}
          </HStack>
          
          {showCreator && asset.creator_id && (
            <HStack justify="space-between" w="100%" fontSize="xs" color={designSystem.colors.text.muted}>
              <Box>👤 Creator</Box>
              <Box>{asset.created_at ? new Date(asset.created_at).toLocaleDateString() : 'Unknown'}</Box>
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
        
        {/* Action Button */}
        <Button
          bg={canDownload ? designSystem.colors.status.success : designSystem.colors.brand.primary}
          color={designSystem.colors.text.inverse}
          w="100%"
          onClick={(e) => handleActionClick(e, canDownload ? 'download' : 'purchase')}
          _hover={{
            bg: canDownload ? designSystem.colors.status.success : designSystem.colors.interactive.hover,
            transform: 'translateY(-1px)'
          }}
        >
          {canDownload ? (
            <>📥 {isOwned ? 'DOWNLOAD AGAIN' : 'DOWNLOAD'}</>
          ) : (
            <>🛒 BUY NOW - ${asset.price}</>
          )}
        </Button>
      </VStack>
    </Card>
  );
};