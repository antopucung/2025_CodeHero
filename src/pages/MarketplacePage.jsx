import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Badge, Tabs, TabList, TabPanels, Tab, TabPanel, Grid } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useGameProgress } from '../hooks/useGameProgress';
import { useUserEnrollment } from '../hooks/useUserEnrollment';
import { useDigitalAssets } from '../hooks/useDigitalAssets';
import { PageLayout, SectionLayout, GridLayout } from '../design/layouts/PageLayout';
import { PageHeader } from '../design/components/PageHeader';
import { CourseCard } from '../design/components/Card';
import { CustomText } from '../design/components/Typography';
import { Button } from '../design/components/Button';
import { DigitalAssetCard } from '../components/marketplace/DigitalAssetCard';
import { AssetTypeFilter } from '../components/marketplace/AssetTypeFilter';
import { designSystem } from '../design/system/DesignSystem';

const MotionBox = motion(Box);

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { progress } = useGameProgress();
  const { getEnrolledCourses } = useUserEnrollment();
  const { 
    assets, 
    loading: assetsLoading, 
    doesUserOwnAsset, 
    purchaseAsset, 
    downloadAsset,
    getAssetsByType,
    getUserAssetStats
  } = useDigitalAssets();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssetType, setSelectedAssetType] = useState('all');

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const enrolled = await getEnrolledCourses();
      setEnrolledCourses(enrolled);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
    }
  };

  // Handle asset purchase
  const handleAssetPurchase = async (asset) => {
    try {
      // In a real implementation, you'd integrate with Stripe here
      // For now, we'll simulate a successful purchase
      const mockStripeTransactionId = `txn_${Date.now()}`;
      
      const result = await purchaseAsset(asset.id, mockStripeTransactionId, asset.price);
      
      if (result.success) {
        console.log('Asset purchased successfully:', result);
        // You could show a success toast here
      }
    } catch (error) {
      console.error('Error purchasing asset:', error);
      // You could show an error toast here
    }
  };

  // Handle asset download
  const handleAssetDownload = async (asset) => {
    try {
      const result = await downloadAsset(asset.id);
      
      if (result.success && result.downloadUrl) {
        // Open download URL in new tab
        window.open(result.downloadUrl, '_blank');
        console.log('Asset download initiated:', result);
      }
    } catch (error) {
      console.error('Error downloading asset:', error);
      // You could show an error toast here
    }
  };

  // Get filtered assets
  const getFilteredAssets = () => {
    if (selectedAssetType === 'all') {
      return assets;
    }
    return getAssetsByType(selectedAssetType);
  };

  // Get asset counts by type
  const getAssetCounts = () => {
    return assets.reduce((counts, asset) => {
      counts[asset.asset_type] = (counts[asset.asset_type] || 0) + 1;
      return counts;
    }, {});
  };

  const handleCourseClick = (courseId) => {
    navigate(`/modules/${courseId}`);
  };

  if (loading) {
    return (
      <PageLayout background="primary">
        <VStack spacing={4}>
          <MotionBox
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            color={designSystem.colors.brand.primary}
            fontSize={designSystem.typography.sizes['3xl']}
          >
            ⚡
          </MotionBox>
          <CustomText color="brand">
            Loading Marketplace...
          </CustomText>
        </VStack>
      </PageLayout>
    );
  }

  // Prepare stats for header
  const stats = [
    { value: progress.level, label: 'LEVEL' },
    { value: progress.totalChallengesCompleted, label: 'COMPLETED' },
    { value: progress.achievements.length, label: 'ACHIEVEMENTS' }
  ];

  // Add enrolled courses stat if user has any
  if (enrolledCourses.length > 0) {
    stats.push({ value: enrolledCourses.length, label: 'MY COURSES' });
  }

  return (
    <PageLayout background="primary">
      <PageHeader
        title="🛒 Learning Marketplace"
        subtitle="Gamified Interactive Programming Courses"
        stats={stats}
      />
      
      <SectionLayout spacing="loose">
        <Tabs variant="soft-rounded" colorScheme="green" w="100%">
          <TabList mb={designSystem.spacing[6]}>
            <Tab fontFamily={designSystem.typography.fonts.mono} fontWeight="bold">
              📚 Courses & Tutorials
            </Tab>
            <Tab fontFamily={designSystem.typography.fonts.mono} fontWeight="bold">
              🛍️ Digital Assets
            </Tab>
          </TabList>
          
          <TabPanels>
            {/* Courses & Tutorials Tab */}
            <TabPanel p={0}>
              <VStack spacing={designSystem.spacing[8]} align="stretch">
                {/* Enrolled Courses Quick Access */}
                {enrolledCourses.length > 0 && (
                  <VStack spacing={designSystem.spacing[3]}>
                    <CustomText size="lg" color="secondary" fontWeight="bold">
                      📚 My Courses ({enrolledCourses.length})
                    </CustomText>
                    <HStack spacing={designSystem.spacing[2]} flexWrap="wrap" justify="center">
                      {enrolledCourses.slice(0, 4).map((course) => (
                        <Button
                          key={course.id}
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/modules/${course.slug}`)}
                        >
                          {course.title.split(' ').slice(0, 2).join(' ')}
                        </Button>
                      ))}
                      {enrolledCourses.length > 4 && (
                        <CustomText size="xs" color="muted">+{enrolledCourses.length - 4} more</CustomText>
                      )}
                    </HStack>
                  </VStack>
                )}
                
                {/* Featured Courses Section */}
                <Box>
                  <HStack justify="space-between" w="100%">
                    <CustomText size="xl" color="brand" fontWeight="bold">
                      Featured Courses
                    </CustomText>
                    <CustomText size="sm" color="muted">
                      {courses.length} courses available
                    </CustomText>
                  </HStack>

                  <GridLayout 
                    columns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                    gap="default"
                  >
                    {courses.map((course, index) => (
                      <MotionBox
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <CourseCard
                          course={course}
                          onView={() => handleCourseClick(course.slug)}
                          isEnrolled={enrolledCourses.some(enrolled => enrolled.id === course.id)}
                        />
                        
                        {/* Gamification Badge for the course */}
                        {course.slug === 'unity-csharp-101' && (
                          <Badge 
                            position="absolute" 
                            top={designSystem.spacing[4]} 
                            left={designSystem.spacing[4]}
                            zIndex={10}
                            bg="#ff6b6b"
                            color="#fff"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="sm"
                            boxShadow="0 0 15px rgba(255, 107, 107, 0.6)"
                          >
                            🎮 NEW QUEST!
                          </Badge>
                        )}
                      </MotionBox>
                    ))}
                  </GridLayout>
                </Box>

                {/* Course Development Pipeline Info */}
                <MotionBox
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  bg={designSystem.colors.backgrounds.secondary}
                  border={`1px solid ${designSystem.colors.borders.default}`}
                  borderRadius={designSystem.radii.lg}
                  p={designSystem.spacing[6]}
                  w="100%"
                  textAlign="center"
                >
                  <Box mb={designSystem.spacing[2]}>
                    <CustomText size="lg" color="accent" fontWeight="bold">
                      🚀 More Courses Coming Soon!
                    </CustomText>
                  </Box>
                  <CustomText size="sm" color="muted">
                    Advanced React, Node.js, Machine Learning, Game Development, and more...
                  </CustomText>
                </MotionBox>
              </VStack>
            </TabPanel>
            
            {/* Digital Assets Tab */}
            <TabPanel p={0}>
              {assetsLoading ? (
                <VStack spacing={4}>
                  <MotionBox
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    color={designSystem.colors.brand.primary}
                    fontSize={designSystem.typography.sizes['3xl']}
                  >
                    ⚡
                  </MotionBox>
                  <CustomText color="brand">
                    Loading Digital Assets...
                  </CustomText>
                </VStack>
              ) : (
                <VStack spacing={designSystem.spacing[8]} align="stretch">
                  {/* Digital Assets Header */}
                  <Box textAlign="center">
                    <CustomText size="xl" color="accent" fontWeight="bold" mb={designSystem.spacing[2]}>
                      🛍️ Digital Asset Marketplace
                    </CustomText>
                    <CustomText size="md" color="muted">
                      {assets.length} premium assets available for download
                    </CustomText>
                  </Box>
                  
                  {/* Asset Type Filter */}
                  <AssetTypeFilter
                    selectedType={selectedAssetType}
                    onTypeChange={setSelectedAssetType}
                    assetCounts={getAssetCounts()}
                  />
                  
                  {/* Assets Grid */}
                  {getFilteredAssets().length > 0 ? (
                    <GridLayout 
                      columns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
                      gap="default"
                    >
                      {getFilteredAssets().map((asset, index) => (
                        <MotionBox
                          key={asset.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <DigitalAssetCard
                            asset={asset}
                            isOwned={doesUserOwnAsset(asset.id)}
                            onPurchase={handleAssetPurchase}
                            onDownload={handleAssetDownload}
                          />
                        </MotionBox>
                      ))}
                    </GridLayout>
                  ) : (
                    <Box 
                      textAlign="center" 
                      p={designSystem.spacing[12]}
                      bg={designSystem.colors.backgrounds.secondary}
                      borderRadius={designSystem.radii.lg}
                      border={`1px solid ${designSystem.colors.borders.default}`}
                    >
                      <CustomText size="xl" color="muted" mb={designSystem.spacing[2]}>
                        📦
                      </CustomText>
                      <CustomText size="lg" color="secondary" fontWeight="bold" mb={designSystem.spacing[2]}>
                        No Assets Found
                      </CustomText>
                      <CustomText size="md" color="muted">
                        {selectedAssetType === 'all' 
                          ? 'No digital assets have been uploaded yet.'
                          : `No ${selectedAssetType.replace('_', ' ')} assets available.`
                        }
                      </CustomText>
                    </Box>
                  )}
                </VStack>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </SectionLayout>
    </PageLayout>
  );
};

export default MarketplacePage;