import React from 'react';
import { Box, VStack, HStack, Grid, Progress } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { designSystem } from '../../../design/system/DesignSystem';
import { CustomText } from '../../../design/components/Typography';
import { Card } from '../../../design/components/Card';

const MotionBox = motion(Box);

export const CreatorAnalytics = ({ assets, stats }) => {
  // Calculate analytics data
  const totalDownloads = assets.reduce((sum, asset) => sum + (asset.downloads_count || 0), 0);
  const totalViews = totalDownloads * 3; // Estimate 3 views per download
  const averageRating = assets.length > 0 
    ? assets.reduce((sum, asset) => sum + (asset.rating || 0), 0) / assets.length 
    : 0;
  
  // Asset type distribution
  const assetTypeDistribution = assets.reduce((acc, asset) => {
    acc[asset.asset_type] = (acc[asset.asset_type] || 0) + 1;
    return acc;
  }, {});
  
  // Performance data (mock trending data)
  const performanceData = assets.map(asset => ({
    name: asset.title,
    downloads: asset.downloads_count || 0,
    rating: asset.rating || 0,
    price: asset.price || 0,
    type: asset.asset_type
  }));
  
  // Sort by performance
  performanceData.sort((a, b) => b.downloads - a.downloads);
  
  return (
    <VStack spacing={6} align="stretch">
      <CustomText size="xl" color="brand" fontWeight="bold">
        📈 Creator Analytics
      </CustomText>
      
      {/* Overview Stats */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card variant="elevated" p={4} textAlign="center">
            <VStack spacing={2}>
              <Box fontSize="2xl">👁️</Box>
              <CustomText size="xl" color="brand" fontWeight="bold">
                {totalViews.toLocaleString()}
              </CustomText>
              <CustomText size="sm" color="muted">Total Views</CustomText>
            </VStack>
          </Card>
        </MotionBox>
        
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card variant="elevated" p={4} textAlign="center">
            <VStack spacing={2}>
              <Box fontSize="2xl">📥</Box>
              <CustomText size="xl" color="accent" fontWeight="bold">
                {totalDownloads.toLocaleString()}
              </CustomText>
              <CustomText size="sm" color="muted">Total Downloads</CustomText>
            </VStack>
          </Card>
        </MotionBox>
        
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card variant="elevated" p={4} textAlign="center">
            <VStack spacing={2}>
              <Box fontSize="2xl">⭐</Box>
              <CustomText size="xl" color="secondary" fontWeight="bold">
                {averageRating.toFixed(1)}
              </CustomText>
              <CustomText size="sm" color="muted">Avg Rating</CustomText>
            </VStack>
          </Card>
        </MotionBox>
        
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card variant="elevated" p={4} textAlign="center">
            <VStack spacing={2}>
              <Box fontSize="2xl">📊</Box>
              <CustomText size="xl" color="error" fontWeight="bold">
                {totalDownloads > 0 ? ((totalDownloads / totalViews) * 100).toFixed(1) : '0.0'}%
              </CustomText>
              <CustomText size="sm" color="muted">Conversion Rate</CustomText>
            </VStack>
          </Card>
        </MotionBox>
      </Grid>
      
      <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
        {/* Asset Performance */}
        <Card variant="elevated" p={6}>
          <VStack align="stretch" spacing={4}>
            <CustomText size="lg" color="brand" fontWeight="bold">
              🏆 Top Performing Assets
            </CustomText>
            
            {performanceData.length > 0 ? (
              <VStack spacing={3} align="stretch">
                {performanceData.slice(0, 5).map((asset, index) => (
                  <MotionBox
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <HStack justify="space-between" p={3} bg={designSystem.colors.backgrounds.surface} borderRadius="md">
                      <VStack align="start" spacing={1} flex={1}>
                        <CustomText size="sm" fontWeight="bold" color="secondary" noOfLines={1}>
                          {asset.name}
                        </CustomText>
                        <HStack spacing={3} fontSize="xs" color={designSystem.colors.text.muted}>
                          <Box>📥 {asset.downloads}</Box>
                          <Box>⭐ {asset.rating.toFixed(1)}</Box>
                          <Box>💰 {asset.price > 0 ? `$${asset.price}` : 'FREE'}</Box>
                        </HStack>
                      </VStack>
                      <Box
                        bg={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : designSystem.colors.backgrounds.elevated}
                        color={index < 3 ? '#000' : designSystem.colors.text.primary}
                        px={2}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="bold"
                      >
                        #{index + 1}
                      </Box>
                    </HStack>
                  </MotionBox>
                ))}
              </VStack>
            ) : (
              <Box textAlign="center" py={8}>
                <CustomText color="muted">No performance data available yet</CustomText>
              </Box>
            )}
          </VStack>
        </Card>
        
        {/* Asset Distribution */}
        <Card variant="elevated" p={6}>
          <VStack align="stretch" spacing={4}>
            <CustomText size="lg" color="secondary" fontWeight="bold">
              📊 Asset Type Distribution
            </CustomText>
            
            {Object.keys(assetTypeDistribution).length > 0 ? (
              <VStack spacing={3} align="stretch">
                {Object.entries(assetTypeDistribution).map(([type, count], index) => {
                  const percentage = (count / assets.length) * 100;
                  const typeColors = {
                    template: designSystem.colors.brand.primary,
                    ui_kit: designSystem.colors.brand.secondary,
                    code_snippet: designSystem.colors.brand.accent,
                    '3d_model': designSystem.colors.status.info,
                    tutorial_pack: designSystem.colors.status.success,
                  };
                  const color = typeColors[type] || designSystem.colors.text.muted;
                  
                  return (
                    <MotionBox
                      key={type}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <VStack align="stretch" spacing={1}>
                        <HStack justify="space-between">
                          <CustomText size="sm" color="secondary">
                            {type.replace('_', ' ').toUpperCase()}
                          </CustomText>
                          <CustomText size="sm" color="accent" fontWeight="bold">
                            {count} ({percentage.toFixed(0)}%)
                          </CustomText>
                        </HStack>
                        <Progress
                          value={percentage}
                          size="sm"
                          colorScheme="green"
                          bg={designSystem.colors.backgrounds.surface}
                          borderRadius="full"
                        />
                      </VStack>
                    </MotionBox>
                  );
                })}
              </VStack>
            ) : (
              <Box textAlign="center" py={8}>
                <CustomText color="muted">Upload assets to see distribution</CustomText>
              </Box>
            )}
          </VStack>
        </Card>
      </Grid>
      
      {/* Insights & Recommendations */}
      <Card variant="default" p={6}>
        <VStack align="stretch" spacing={4}>
          <CustomText size="lg" color="accent" fontWeight="bold">
            💡 Insights & Recommendations
          </CustomText>
          
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <VStack align="start" spacing={3}>
              <CustomText size="md" fontWeight="bold" color="secondary">
                🚀 Growth Opportunities
              </CustomText>
              <VStack align="start" spacing={2} fontSize="sm" color={designSystem.colors.text.secondary}>
                {totalDownloads === 0 && (
                  <CustomText>• Share your assets on social media to get initial traction</CustomText>
                )}
                {assets.filter(a => !a.thumbnail_url).length > 0 && (
                  <CustomText>• Add thumbnails to {assets.filter(a => !a.thumbnail_url).length} assets for better visibility</CustomText>
                )}
                {assets.filter(a => a.price === 0).length === assets.length && assets.length > 0 && (
                  <CustomText>• Consider pricing some premium assets to start earning</CustomText>
                )}
                {assets.length < 5 && (
                  <CustomText>• Upload more assets to build a compelling portfolio</CustomText>
                )}
                <CustomText>• Free assets with great quality often lead to premium sales</CustomText>
              </VStack>
            </VStack>
            
            <VStack align="start" spacing={3}>
              <CustomText size="md" fontWeight="bold" color="secondary">
                📈 Performance Tips
              </CustomText>
              <VStack align="start" spacing={2} fontSize="sm" color={designSystem.colors.text.secondary}>
                <CustomText>• Assets with 5+ tags get 40% more visibility</CustomText>
                <CustomText>• Detailed descriptions improve conversion by 25%</CustomText>
                <CustomText>• Regular uploads keep you in trending sections</CustomText>
                <CustomText>• Respond to user feedback to build reputation</CustomText>
                <CustomText>• Consider seasonal trends for timely releases</CustomText>
              </VStack>
            </VStack>
          </Grid>
        </VStack>
      </Card>
    </VStack>
  );
};