import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Image,
  Badge,
  Checkbox,
  Button,
  Divider,
  Grid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  List,
  ListItem,
  ListIcon
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useThemeTokens } from '../../../../theme/hooks/useThemeTokens';
import { CustomText } from '../../../../design/components/Typography';
import { Card } from '../../../../design/components/Card';

const MotionBox = motion(Box);

const ASSET_TYPE_LABELS = {
  template: 'Template',
  ui_kit: 'UI Kit',
  code_snippet: 'Code Snippet',
  '3d_model': '3D Model',
  tutorial_pack: 'Tutorial Pack',
  icon_pack: 'Icon Pack',
  font_pack: 'Font Pack',
  design_system: 'Design System',
  component_library: 'Component Library',
  plugin: 'Plugin',
  extension: 'Extension',
  other: 'Other'
};

export const AssetReviewStep = ({ 
  assetData, 
  updateAssetData, 
  onSubmit,
  isSubmitting,
  isEditing = false
}) => {
  const { getColor, getSpacing, getBorderRadius } = useThemeTokens();
  const [agreedToTerms, setAgreedToTerms] = React.useState(isEditing);
  
  const handlePublish = () => {
    if (!agreedToTerms && !isEditing) return;
    updateAssetData({ is_published: true });
    onSubmit();
  };
  
  const handleSaveDraft = () => {
    updateAssetData({ is_published: false });
    onSubmit();
  };
  
  const validateAssetData = () => {
    const issues = [];
    
    if (!assetData.title?.trim()) issues.push('Title is required');
    if (!assetData.description?.trim()) issues.push('Description is required');
    if (!assetData.download_url?.trim()) issues.push('Download URL is required');
    if (!assetData.asset_type) issues.push('Asset type must be selected');
    
    return issues;
  };
  
  const validationIssues = validateAssetData();
  const isValid = validationIssues.length === 0;
  
  return (
    <VStack spacing={getSpacing(6)} align="stretch">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card variant="elevated" p={getSpacing(6)}>
          <VStack spacing={getSpacing(6)} align="stretch">
            {/* Header */}
            <Box textAlign="center">
              <CustomText size="xl" fontWeight="bold" color="brand" mb={getSpacing(2)}>
                ✅ Review & {isEditing ? 'Update' : 'Publish'}
              </CustomText>
              <CustomText size="sm" color="muted">
                Review your asset details before {isEditing ? 'updating' : 'publishing to the marketplace'}.
              </CustomText>
            </Box>
            
            {/* Validation Issues */}
            {validationIssues.length > 0 && (
              <Alert status="error" borderRadius={getBorderRadius('md')}>
                <AlertIcon />
                <VStack align="start" spacing={getSpacing(1)} flex={1}>
                  <AlertTitle fontSize="sm">Please Fix These Issues</AlertTitle>
                  <AlertDescription fontSize="sm">
                    <List spacing={getSpacing(1)}>
                      {validationIssues.map((issue, index) => (
                        <ListItem key={index}>
                          <ListIcon as="span">•</ListIcon>
                          {issue}
                        </ListItem>
                      ))}
                    </List>
                  </AlertDescription>
                </VStack>
              </Alert>
            )}
            
            {/* Asset Preview */}
            <Card variant="default" p={getSpacing(4)}>
              <VStack spacing={getSpacing(4)} align="stretch">
                <CustomText size="md" fontWeight="bold" color="secondary">
                  📋 Asset Preview
                </CustomText>
                
                <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={getSpacing(4)}>
                  {/* Thumbnail Preview */}
                  <Box>
                    {assetData.thumbnail_url ? (
                      <Image
                        src={assetData.thumbnail_url}
                        alt="Asset thumbnail"
                        w="100%"
                        h="200px"
                        objectFit="cover"
                        borderRadius={getBorderRadius('md')}
                        border={`1px solid ${getColor('borders.default')}`}
                        fallback={
                          <Box
                            w="100%"
                            h="200px"
                            bg={getColor('backgrounds.surface')}
                            borderRadius={getBorderRadius('md')}
                            border={`1px solid ${getColor('borders.default')}`}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color={getColor('text.muted')}
                          >
                            No thumbnail
                          </Box>
                        }
                      />
                    ) : (
                      <Box
                        w="100%"
                        h="200px"
                        bg={getColor('backgrounds.surface')}
                        borderRadius={getBorderRadius('md')}
                        border={`2px dashed ${getColor('borders.default')}`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        color={getColor('text.muted')}
                      >
                        No thumbnail provided
                      </Box>
                    )}
                  </Box>
                  
                  {/* Asset Details */}
                  <VStack align="start" spacing={getSpacing(3)}>
                    <VStack align="start" spacing={getSpacing(1)}>
                      <CustomText size="lg" fontWeight="bold" color="brand">
                        {assetData.title || 'Untitled Asset'}
                      </CustomText>
                      <HStack spacing={getSpacing(2)}>
                        <Badge
                          bg={getColor('brand.primary')}
                          color={getColor('text.inverse')}
                          px={getSpacing(2)}
                          py={getSpacing(1)}
                          borderRadius={getBorderRadius('full')}
                        >
                          {ASSET_TYPE_LABELS[assetData.asset_type] || 'Unknown Type'}
                        </Badge>
                        <Badge
                          bg={assetData.price > 0 ? getColor('status.warning') : getColor('status.success')}
                          color={getColor('text.inverse')}
                          px={getSpacing(2)}
                          py={getSpacing(1)}
                          borderRadius={getBorderRadius('full')}
                        >
                          {assetData.price > 0 ? `$${assetData.price}` : 'FREE'}
                        </Badge>
                      </HStack>
                    </VStack>
                    
                    <CustomText size="sm" color="secondary" noOfLines={4}>
                      {assetData.description || 'No description provided'}
                    </CustomText>
                    
                    {/* Tags */}
                    {assetData.tags && assetData.tags.length > 0 && (
                      <HStack spacing={getSpacing(1)} flexWrap="wrap">
                        {assetData.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            bg={getColor('backgrounds.surface')}
                            color={getColor('text.secondary')}
                            fontSize="xs"
                            px={getSpacing(2)}
                            py={getSpacing(1)}
                            borderRadius={getBorderRadius('sm')}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </HStack>
                    )}
                    
                    {/* File Info */}
                    <VStack align="start" spacing={getSpacing(1)} fontSize="xs" color={getColor('text.muted')}>
                      {assetData.file_format && (
                        <CustomText>Format: {assetData.file_format.toUpperCase()}</CustomText>
                      )}
                      {assetData.file_size_mb && (
                        <CustomText>Size: {assetData.file_size_mb} MB</CustomText>
                      )}
                      {assetData.compatible_with && assetData.compatible_with.length > 0 && (
                        <CustomText>
                          Compatible: {assetData.compatible_with.slice(0, 3).join(', ')}
                          {assetData.compatible_with.length > 3 && ' +more'}
                        </CustomText>
                      )}
                    </VStack>
                  </VStack>
                </Grid>
              </VStack>
            </Card>
          </VStack>
            
            {/* Links Summary */}
            <Card variant="default" p={getSpacing(4)}>
              <VStack spacing={getSpacing(3)} align="stretch">
                <CustomText size="md" fontWeight="bold" color="secondary">
                  🔗 Asset Links
                </CustomText>
                
                <VStack align="start" spacing={getSpacing(2)} fontSize="sm">
                  <HStack justify="space-between" w="100%">
                    <CustomText color="secondary">Download URL:</CustomText>
                    <CustomText 
                      color={assetData.download_url ? "success" : "error"}
                      fontWeight="bold"
                    >
                      {assetData.download_url ? '✅ Provided' : '❌ Missing'}
                    </CustomText>
                  </HStack>
                  
                  <HStack justify="space-between" w="100%">
                    <CustomText color="secondary">Thumbnail:</CustomText>
                    <CustomText 
                      color={assetData.thumbnail_url ? "success" : "warning"}
                      fontWeight="bold"
                    >
                      {assetData.thumbnail_url ? '✅ Provided' : '⚠️ Optional'}
                    </CustomText>
                  </HStack>
                  
                  <HStack justify="space-between" w="100%">
                    <CustomText color="secondary">Preview Media:</CustomText>
                    <CustomText 
                      color={assetData.preview_url ? "success" : "muted"}
                      fontWeight="bold"
                    >
                      {assetData.preview_url ? '✅ Provided' : '➖ None'}
                    </CustomText>
                  </HStack>
                  
                  <HStack justify="space-between" w="100%">
                    <CustomText color="secondary">Gallery Images:</CustomText>
                    <CustomText 
                      color={assetData.gallery_image_urls?.length > 0 ? "success" : "muted"}
                      fontWeight="bold"
                    >
                      {assetData.gallery_image_urls?.length > 0 
                        ? `✅ ${assetData.gallery_image_urls.length} images`
                        : '➖ None'
                      }
                    </CustomText>
                  </HStack>
                </VStack>
              </VStack>
              </Card>
            </Card>
            
            {/* Integration Summary */}
            {(assetData.related_donation_project_id || assetData.related_collaboration_id) && (
              <Card variant="default" p={getSpacing(4)}>
                <VStack spacing={getSpacing(3)} align="stretch">
                  <CustomText size="md" fontWeight="bold" color="secondary">
                    🤝 Platform Integrations
                  </CustomText>
                  
                  <VStack align="start" spacing={getSpacing(2)} fontSize="sm">
                    {assetData.related_donation_project_id && (
                      <HStack justify="space-between" w="100%">
                        <CustomText color="secondary">Donation Integration:</CustomText>
                        <CustomText color="success" fontWeight="bold">✅ Enabled</CustomText>
                      </HStack>
                    )}
                    
                    {assetData.related_collaboration_id && (
                      <HStack justify="space-between" w="100%">
                        <CustomText color="secondary">Collaboration Seeking:</CustomText>
                        <CustomText color="success" fontWeight="bold">✅ Enabled</CustomText>
                      </HStack>
                    )}
                  </VStack>
                </VStack>
              </Card>
            )}
            
            {/* Terms Agreement */}
            {!isEditing && (
              <Card variant="default" p={getSpacing(4)}>
                <VStack spacing={getSpacing(3)} align="stretch">
                  <CustomText size="md" fontWeight="bold" color="secondary">
                    📋 Terms & Conditions
                  </CustomText>
                  
                  <Checkbox
                    isChecked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    colorScheme="green"
                    size="md"
                  >
                    <VStack align="start" spacing={getSpacing(1)}>
                      <CustomText size="sm" color="secondary">
                        I agree to the platform terms and conditions
                      </CustomText>
                      <CustomText size="xs" color="muted">
                        • I own the rights to this digital asset and all included content
                        • I will maintain access to all external links (downloads, images)
                        • I understand the platform fee structure and payment terms
                        • I will provide support for buyers of my digital assets
                      </CustomText>
                    </VStack>
                  </Checkbox>
                </VStack>
              </Card>
            )}
            
            {/* Action Buttons */}
            <Divider />
            
            <HStack justify="space-between" spacing={getSpacing(4)}>
              <Button
                variant="outline"
                onClick={handleSaveDraft}
                isDisabled={isSubmitting || !isValid}
                isLoading={isSubmitting}
                loadingText="Saving..."
              >
                💾 Save as Draft
              </Button>
              
              <Button
                colorScheme="green"
                onClick={handlePublish}
                isDisabled={isSubmitting || !isValid || (!agreedToTerms && !isEditing)}
                isLoading={isSubmitting}
                loadingText={isEditing ? "Updating..." : "Publishing..."}
                size="lg"
                rightIcon={<Box>🚀</Box>}
              >
                {isEditing ? '✏️ Update Asset' : '🚀 Publish to Marketplace'}
              </Button>
            </HStack>
          </VStack>
        </Card>
      </MotionBox>
      
      {/* Success Preview */}
      {isValid && (
        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Alert status="success" borderRadius={getBorderRadius('md')}>
            <AlertIcon />
            <VStack align="start" spacing={getSpacing(1)} flex={1}>
              <AlertTitle fontSize="sm">Ready to {isEditing ? 'Update' : 'Publish'}!</AlertTitle>
              <AlertDescription fontSize="sm">
                Your digital asset is complete and ready for the marketplace. 
                {!isEditing && ' Once published, buyers can discover and purchase your asset.'}
              </AlertDescription>
            </VStack>
          </Alert>
        </MotionBox>
      )}
    </VStack>
  );
};