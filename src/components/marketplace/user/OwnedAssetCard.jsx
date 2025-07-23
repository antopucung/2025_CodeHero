import React from 'react';
import { Box, VStack, HStack, Badge, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { designSystem } from '../../../design/system/DesignSystem';
import { CustomText } from '../../../design/components/Typography';
import { Button } from '../../../design/components/Button';
import { Card } from '../../../design/components/Card';

const MotionBox = motion(Box);

export const OwnedAssetCard = ({ 
  purchase, 
  asset, 
  onDownload,
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

  const purchaseDate = new Date(purchase.purchase_date).toLocaleDateString();
  const wasFree = purchase.purchase_price === 0;

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
        
        {/* Owned Badge */}
        <Badge
          position="absolute"
          top={designSystem.spacing[2]}
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
        
        {/* Purchase Info */}
        <VStack spacing={designSystem.spacing[2]}>
          <HStack justify="space-between" w="100%" fontSize="xs" color={designSystem.colors.text.muted}>
            <Box>📅 Purchased: {purchaseDate}</Box>
            <Box>💰 {wasFree ? 'FREE' : `$${purchase.purchase_price}`}</Box>
          </HStack>
          
          <HStack justify="space-between" w="100%" fontSize="xs" color={designSystem.colors.text.muted}>
            <Box>⭐ {asset.rating?.toFixed(1) || '0.0'}</Box>
            {asset.file_size_mb && <Box>📦 {asset.file_size_mb}MB</Box>}
          </HStack>
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
            bg={designSystem.colors.status.success}
            color={designSystem.colors.text.inverse}
            size="md"
            flex={1}
            onClick={() => onDownload?.(asset)}
            _hover={{
              bg: designSystem.colors.status.success,
              transform: 'translateY(-1px)'
            }}
          >
            📥 Download Again
          </Button>
          
          <Button
            variant="secondary"
            size="md"
            onClick={handleCardClick}
          >
            👁️ View
          </Button>
        </HStack>
        
        {/* Purchase Receipt Info */}
        {purchase.stripe_transaction_id && (
          <Box fontSize="xs" color={designSystem.colors.text.muted} textAlign="center">
            Receipt ID: {purchase.stripe_transaction_id.slice(-8)}
          </Box>
        )}
      </VStack>
    </Card>
  );
};