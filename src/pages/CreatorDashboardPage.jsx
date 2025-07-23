import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Grid, Tabs, TabList, TabPanels, Tab, TabPanel, Badge, Button, useDisclosure } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useDigitalAssets } from '../hooks/useDigitalAssets';
import { useProgressionSystem } from '../hooks/useProgressionSystem';
import { PageLayout, SectionLayout } from '../design/layouts/PageLayout';
import { PageHeader } from '../design/components/PageHeader';
import { CustomText } from '../design/components/Typography';
import { Card } from '../design/components/Card';
import { UploadAssetWizard } from '../components/marketplace/upload/UploadAssetWizard';
import { CreatorAssetCard } from '../components/marketplace/creator/CreatorAssetCard';
import { CreatorAnalytics } from '../components/marketplace/creator/CreatorAnalytics';
import { CreatorEarningsCard } from '../components/marketplace/creator/CreatorEarningsCard';
import { designSystem } from '../design/system/DesignSystem';

const MotionBox = motion(Box);

const CreatorDashboardPage = () => {
  const navigate = useNavigate();
  const { user, profile } = useProgressionSystem();
  const {
    assets,
    loading,
    error,
    createAsset,
    updateAsset,
    deleteAsset,
    getUserCreatedAssets,
    getUserAssetStats
  } = useDigitalAssets();
  
  const [userAssets, setUserAssets] = useState([]);
  const [assetStats, setAssetStats] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  // Fetch user's assets and stats
  useEffect(() => {
    if (user) {
      loadCreatorData();
    }
  }, [user]);

  const loadCreatorData = async () => {
    try {
      const [userAssetsData, statsData] = await Promise.all([
        getUserCreatedAssets(),
        getUserAssetStats()
      ]);
      
      setUserAssets(userAssetsData);
      setAssetStats(statsData);
    } catch (error) {
      console.error('Error loading creator data:', error);
    }
  };

  // Handle asset upload success
  const handleUploadSuccess = (asset) => {
    loadCreatorData(); // Refresh data
    onUploadClose();
  };

  // Handle asset edit
  const handleEditAsset = (asset) => {
    setSelectedAsset(asset);
    onEditOpen();
  };

  // Handle asset edit success
  const handleEditSuccess = (asset) => {
    loadCreatorData(); // Refresh data
    setSelectedAsset(null);
    onEditClose();
  };

  // Handle asset delete
  const handleDeleteAsset = async (assetId) => {
    if (window.confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      try {
        await deleteAsset(assetId);
        loadCreatorData(); // Refresh data
      } catch (error) {
        console.error('Error deleting asset:', error);
      }
    }
  };

  // Calculate total earnings (mock data for now)
  const calculateEarnings = () => {
    // In a real implementation, this would come from payment processing
    return userAssets.reduce((total, asset) => {
      const estimatedSales = asset.downloads_count || 0;
      return total + (asset.price * estimatedSales * 0.1); // Mock 10% of downloads as sales
    }, 0);
  };

  if (!user) {
    return (
      <PageLayout>
        <VStack spacing={8} textAlign="center" py={16}>
          <MotionBox
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <CustomText size="3xl">🔐</CustomText>
          </MotionBox>
          <VStack spacing={4}>
            <CustomText size="xl" color="brand" fontWeight="bold">
              Creator Dashboard Access Required
            </CustomText>
            <CustomText size="md" color="secondary">
              Please log in to access your creator dashboard and manage your digital assets.
            </CustomText>
            <Button
              bg={designSystem.colors.brand.primary}
              color={designSystem.colors.text.inverse}
              onClick={() => navigate('/profile')}
            >
              Go to Profile
            </Button>
          </VStack>
        </VStack>
      </PageLayout>
    );
  }

  if (loading) {
    return (
      <PageLayout>
        <VStack spacing={4} py={16}>
          <MotionBox
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            color={designSystem.colors.brand.primary}
            fontSize="3xl"
          >
            ⚡
          </MotionBox>
          <CustomText color="brand">Loading Creator Dashboard...</CustomText>
        </VStack>
      </PageLayout>
    );
  }

  // Prepare stats for header
  const stats = [
    { value: userAssets.length, label: 'ASSETS' },
    { value: userAssets.filter(a => a.is_published).length, label: 'PUBLISHED' },
    { value: assetStats?.totalDownloads || 0, label: 'DOWNLOADS' },
    { value: `$${calculateEarnings().toFixed(2)}`, label: 'EARNINGS' }
  ];

  return (
    <PageLayout>
      <PageHeader
        title="🎨 Creator Dashboard"
        subtitle="Manage Your Digital Assets & Track Performance"
        stats={stats}
        actions={[
          {
            label: 'Upload New Asset',
            icon: '🚀',
            onClick: onUploadOpen,
            variant: 'primary'
          }
        ]}
      />
      
      <SectionLayout spacing="loose">
        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab>📊 Overview</Tab>
            <Tab>🛍️ My Assets ({userAssets.length})</Tab>
            <Tab>📈 Analytics</Tab>
            <Tab>💰 Earnings</Tab>
          </TabList>
          
          <TabPanels>
            {/* Overview Tab */}
            <TabPanel p={0} pt={6}>
              <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
                <VStack spacing={6} align="stretch">
                  {/* Quick Stats Cards */}
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                    <Card variant="elevated" p={4}>
                      <VStack align="start" spacing={2}>
                        <HStack>
                          <Box fontSize="2xl">📊</Box>
                          <CustomText size="md" fontWeight="bold" color="brand">
                            Total Views
                          </CustomText>
                        </HStack>
                        <CustomText size="2xl" color="accent" fontWeight="bold">
                          {userAssets.reduce((sum, asset) => sum + (asset.downloads_count || 0), 0) * 3}
                        </CustomText>
                        <CustomText size="sm" color="muted">
                          Across all your assets
                        </CustomText>
                      </VStack>
                    </Card>
                    
                    <Card variant="elevated" p={4}>
                      <VStack align="start" spacing={2}>
                        <HStack>
                          <Box fontSize="2xl">⭐</Box>
                          <CustomText size="md" fontWeight="bold" color="secondary">
                            Avg Rating
                          </CustomText>
                        </HStack>
                        <CustomText size="2xl" color="accent" fontWeight="bold">
                          {userAssets.length > 0 
                            ? (userAssets.reduce((sum, asset) => sum + (asset.rating || 0), 0) / userAssets.length).toFixed(1)
                            : '0.0'
                          }
                        </CustomText>
                        <CustomText size="sm" color="muted">
                          From customer reviews
                        </CustomText>
                      </VStack>
                    </Card>
                  </Grid>
                  
                  {/* Recent Assets */}
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <CustomText size="lg" color="brand" fontWeight="bold">
                        Recent Assets
                      </CustomText>
                      <Button size="sm" onClick={onUploadOpen}>
                        + New Asset
                      </Button>
                    </HStack>
                    
                    {userAssets.length > 0 ? (
                      <VStack spacing={3}>
                        {userAssets.slice(0, 3).map((asset) => (
                          <CreatorAssetCard
                            key={asset.id}
                            asset={asset}
                            onEdit={() => handleEditAsset(asset)}
                            onDelete={() => handleDeleteAsset(asset.id)}
                            compact={true}
                          />
                        ))}
                      </VStack>
                    ) : (
                      <Card variant="default" p={8} textAlign="center">
                        <VStack spacing={4}>
                          <Box fontSize="4xl">📦</Box>
                          <CustomText size="lg" color="secondary" fontWeight="bold">
                            No Assets Yet
                          </CustomText>
                          <CustomText size="md" color="muted">
                            Upload your first digital asset to start earning!
                          </CustomText>
                          <Button onClick={onUploadOpen} colorScheme="green">
                            🚀 Upload Your First Asset
                          </Button>
                        </VStack>
                      </Card>
                    )}
                  </VStack>
                </VStack>
                
                {/* Sidebar */}
                <VStack spacing={6} align="stretch">
                  <CreatorEarningsCard 
                    earnings={calculateEarnings()}
                    assetCount={userAssets.length}
                    publishedCount={userAssets.filter(a => a.is_published).length}
                  />
                  
                  <Card variant="default" p={4}>
                    <VStack align="start" spacing={3}>
                      <CustomText size="md" fontWeight="bold" color="accent">
                        💡 Creator Tips
                      </CustomText>
                      <VStack align="start" spacing={2} fontSize="sm" color={designSystem.colors.text.secondary}>
                        <CustomText>• High-quality thumbnails increase click rates by 60%</CustomText>
                        <CustomText>• Detailed descriptions improve conversion rates</CustomText>
                        <CustomText>• Free assets help build your reputation</CustomText>
                        <CustomText>• Regular uploads keep you in trending sections</CustomText>
                      </VStack>
                    </VStack>
                  </Card>
                </VStack>
              </Grid>
            </TabPanel>
            
            {/* My Assets Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={6} align="stretch">
                <HStack justify="space-between">
                  <CustomText size="xl" color="brand" fontWeight="bold">
                    Your Digital Assets
                  </CustomText>
                  <Button onClick={onUploadOpen} colorScheme="green">
                    + Upload New Asset
                  </Button>
                </HStack>
                
                {userAssets.length > 0 ? (
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={6}>
                    {userAssets.map((asset, index) => (
                      <MotionBox
                        key={asset.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <CreatorAssetCard
                          asset={asset}
                          onEdit={() => handleEditAsset(asset)}
                          onDelete={() => handleDeleteAsset(asset.id)}
                        />
                      </MotionBox>
                    ))}
                  </Grid>
                ) : (
                  <Card variant="default" p={12} textAlign="center">
                    <VStack spacing={6}>
                      <Box fontSize="6xl">🎨</Box>
                      <CustomText size="xl" color="secondary" fontWeight="bold">
                        Start Your Creative Journey
                      </CustomText>
                      <CustomText size="md" color="muted" maxW="500px">
                        Upload your first digital asset and start building your creator portfolio. 
                        Whether it's templates, UI kits, or code snippets - your creativity can earn!
                      </CustomText>
                      <Button onClick={onUploadOpen} colorScheme="green" size="lg">
                        🚀 Upload Your First Asset
                      </Button>
                    </VStack>
                  </Card>
                )}
              </VStack>
            </TabPanel>
            
            {/* Analytics Tab */}
            <TabPanel p={0} pt={6}>
              <CreatorAnalytics 
                assets={userAssets}
                stats={assetStats}
              />
            </TabPanel>
            
            {/* Earnings Tab */}
            <TabPanel p={0} pt={6}>
              <VStack spacing={6} align="stretch">
                <CustomText size="xl" color="brand" fontWeight="bold">
                  💰 Earnings Overview
                </CustomText>
                
                <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
                  <CreatorEarningsCard 
                    earnings={calculateEarnings()}
                    assetCount={userAssets.length}
                    publishedCount={userAssets.filter(a => a.is_published).length}
                    detailed={true}
                  />
                  
                  <Card variant="elevated" p={6}>
                    <VStack align="start" spacing={4}>
                      <CustomText size="lg" color="secondary" fontWeight="bold">
                        💡 Monetization Strategy
                      </CustomText>
                      <VStack align="start" spacing={3} fontSize="sm" color={designSystem.colors.text.secondary}>
                        <CustomText><strong>Free Assets:</strong> Build reputation and attract premium buyers</CustomText>
                        <CustomText><strong>Premium Assets:</strong> Price based on value and time investment</CustomText>
                        <CustomText><strong>Asset Bundles:</strong> Package related items for higher value</CustomText>
                        <CustomText><strong>Donations:</strong> Link to projects for ongoing support</CustomText>
                        <CustomText><strong>Collaborations:</strong> Partner with others for bigger projects</CustomText>
                      </VStack>
                    </VStack>
                  </Card>
                </Grid>
                
                {/* Coming Soon Features */}
                <Card variant="default" p={6}>
                  <VStack align="start" spacing={4}>
                    <HStack>
                      <Box fontSize="xl">🚧</Box>
                      <CustomText size="lg" color="accent" fontWeight="bold">
                        Coming Soon: Enhanced Monetization
                      </CustomText>
                    </HStack>
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                      <VStack align="start" spacing={2}>
                        <CustomText size="sm" fontWeight="bold" color="secondary">Payment Processing</CustomText>
                        <CustomText size="sm" color="muted">Integrated Stripe payments for seamless transactions</CustomText>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <CustomText size="sm" fontWeight="bold" color="secondary">Revenue Analytics</CustomText>
                        <CustomText size="sm" color="muted">Detailed earnings breakdowns and trends</CustomText>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <CustomText size="sm" fontWeight="bold" color="secondary">Subscription Assets</CustomText>
                        <CustomText size="sm" color="muted">Monthly asset packs and recurring revenue</CustomText>
                      </VStack>
                      <VStack align="start" spacing={2}>
                        <CustomText size="sm" fontWeight="bold" color="secondary">Affiliate Program</CustomText>
                        <CustomText size="sm" color="muted">Earn commissions from referrals</CustomText>
                      </VStack>
                    </Grid>
                  </VStack>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SectionLayout>
      
      {/* Upload Asset Wizard */}
      <UploadAssetWizard
        isOpen={isUploadOpen}
        onClose={onUploadClose}
        onSuccess={handleUploadSuccess}
      />
      
      {/* Edit Asset Wizard */}
      <UploadAssetWizard
        isOpen={isEditOpen}
        onClose={onEditClose}
        initialData={selectedAsset}
        onSuccess={handleEditSuccess}
      />
    </PageLayout>
  );
};

export default CreatorDashboardPage;