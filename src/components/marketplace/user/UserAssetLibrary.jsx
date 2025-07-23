import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Grid, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useDigitalAssets } from '../../../hooks/useDigitalAssets';
import { useProgressionSystem } from '../../../hooks/useProgressionSystem';
import { designSystem } from '../../../design/system/DesignSystem';
import { CustomText } from '../../../design/components/Typography';
import { Card } from '../../../design/components/Card';
import { OwnedAssetCard } from './OwnedAssetCard';

const MotionBox = motion(Box);

export const UserAssetLibrary = () => {
  const { user } = useProgressionSystem();
  const { 
    userPurchasedAssets, 
    userDownloads, 
    getUserAssetStats,
    downloadAsset 
  } = useDigitalAssets();
  
  const [assetStats, setAssetStats] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);
  
  const loadUserStats = async () => {
    try {
      const stats = getUserAssetStats();
      setAssetStats(stats);
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };
  
  const handleDownload = async (asset) => {
    try {
      const result = await downloadAsset(asset.id);
      if (result.success && result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Download error:', error);
    }
  };
  
  const getFilteredAssets = () => {
    if (selectedFilter === 'all') {
      return userPurchasedAssets;
    }
    return userPurchasedAssets.filter(purchase => 
      purchase.digital_assets?.asset_type === selectedFilter
    );
  };
  
  const assetTypes = [...new Set(userPurchasedAssets.map(p => p.digital_assets?.asset_type).filter(Boolean))];
  
  if (!user) {
    return (
      <Box textAlign="center" py={16}>
        <VStack spacing={4}>
          <Box fontSize="4xl">🔐</Box>
          <CustomText size="xl" color="secondary" fontWeight="bold">
            Login Required
          </CustomText>
          <CustomText size="md" color="muted">
            Please log in to view your asset library
          </CustomText>
        </VStack>
      </Box>
    );
  }
  
  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <VStack align="start" spacing={1}>
          <CustomText size="xl" color="brand" fontWeight="bold">
            📚 My Asset Library
          </CustomText>
          <CustomText size="sm" color="muted">
            {userPurchasedAssets.length} assets in your collection
          </CustomText>
        </VStack>
        
        {assetStats && (
          <VStack align="end" spacing={1}>
            <CustomText size="sm" color="secondary" fontWeight="bold">
              Total Spent: ${assetStats.totalSpent.toFixed(2)}
            </CustomText>
            <CustomText size="xs" color="muted">
              {assetStats.totalDownloads} downloads
            </CustomText>
          </VStack>
        )}
      </HStack>
      
      {userPurchasedAssets.length > 0 ? (
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab 
              fontSize="sm" 
              fontFamily={designSystem.typography.fonts.mono}
              fontWeight="bold"
            >
              All Assets ({userPurchasedAssets.length})
            </Tab>
            {assetTypes.map(type => (
              <Tab 
                key={type}
                fontSize="sm" 
                fontFamily={designSystem.typography.fonts.mono}
                fontWeight="bold"
              >
                {type.replace('_', ' ').toUpperCase()} ({userPurchasedAssets.filter(p => p.digital_assets?.asset_type === type).length})
              </Tab>
            ))}
          </TabList>
          
          <TabPanels>
            {/* All Assets */}
            <TabPanel p={0} pt={6}>
              <Grid 
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
                gap={6}
              >
                {userPurchasedAssets.map((purchase, index) => (
                  <MotionBox
                    key={purchase.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <OwnedAssetCard
                      purchase={purchase}
                      asset={purchase.digital_assets}
                      onDownload={() => handleDownload(purchase.digital_assets)}
                    />
                  </MotionBox>
                ))}
              </Grid>
            </TabPanel>
            
            {/* Asset Type Tabs */}
            {assetTypes.map(type => (
              <TabPanel key={type} p={0} pt={6}>
                <Grid 
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
                  gap={6}
                >
                  {userPurchasedAssets
                    .filter(p => p.digital_assets?.asset_type === type)
                    .map((purchase, index) => (
                      <MotionBox
                        key={purchase.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <OwnedAssetCard
                          purchase={purchase}
                          asset={purchase.digital_assets}
                          onDownload={() => handleDownload(purchase.digital_assets)}
                        />
                      </MotionBox>
                    ))}
                </Grid>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      ) : (
        <Card variant="default" p={12} textAlign="center">
          <VStack spacing={6}>
            <Box fontSize="6xl">🛍️</Box>
            <CustomText size="xl" color="secondary" fontWeight="bold">
              No Assets Yet
            </CustomText>
            <CustomText size="md" color="muted" maxW="500px">
              Your purchased digital assets will appear here. 
              Browse the marketplace to find templates, UI kits, and more!
            </CustomText>
            <Button
              bg={designSystem.colors.brand.primary}
              color={designSystem.colors.text.inverse}
              onClick={() => window.location.href = '/marketplace'}
              size="lg"
            >
              🛒 Browse Marketplace
            </Button>
          </VStack>
        </Card>
      )}
      
      {/* Recent Downloads */}
      {userDownloads.length > 0 && (
        <VStack align="stretch" spacing={4}>
          <CustomText size="lg" color="secondary" fontWeight="bold">
            📥 Recent Downloads
          </CustomText>
          
          <Card variant="default" p={4}>
            <VStack spacing={3} align="stretch">
              {userDownloads.slice(0, 5).map((download, index) => (
                <HStack
                  key={download.id}
                  justify="space-between"
                  p={3}
                  bg={designSystem.colors.backgrounds.surface}
                  borderRadius="md"
                >
                  <VStack align="start" spacing={1}>
                    <CustomText size="sm" fontWeight="bold" color="secondary">
                      {download.digital_assets?.title || 'Unknown Asset'}
                    </CustomText>
                    <CustomText size="xs" color="muted">
                      {new Date(download.download_date).toLocaleDateString()} • {download.download_count}x downloaded
                    </CustomText>
                  </VStack>
                  
                  <Badge
                    bg={designSystem.colors.brand.primary}
                    color={designSystem.colors.text.inverse}
                    px={2}
                    py={1}
                    borderRadius="sm"
                  >
                    {download.digital_assets?.asset_type?.replace('_', ' ').toUpperCase() || 'ASSET'}
                  </Badge>
                </HStack>
              ))}
            </VStack>
          </Card>
        </VStack>
      )}
    </VStack>
  );
};