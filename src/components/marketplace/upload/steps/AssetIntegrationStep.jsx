import React from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Checkbox,
  Select,
  Textarea,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useDisclosure,
  Collapse
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useThemeTokens } from '../../../../theme/hooks/useThemeTokens';
import { CustomText } from '../../../../design/components/Typography';
import { Card } from '../../../../design/components/Card';

const MotionBox = motion(Box);

export const AssetIntegrationStep = ({ 
  assetData, 
  updateAssetData, 
  validationErrors 
}) => {
  const { getColor, getSpacing, getBorderRadius } = useThemeTokens();
  const { isOpen: showDonationGuide, onToggle: toggleDonationGuide } = useDisclosure();
  const { isOpen: showCollabGuide, onToggle: toggleCollabGuide } = useDisclosure();
  
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
                🔗 Integration & Monetization
              </CustomText>
              <CustomText size="sm" color="muted">
                Connect your asset to donations, collaborations, and learning modules to maximize engagement.
              </CustomText>
            </Box>
            
            {/* Platform Integration Info */}
            <Alert status="info" borderRadius={getBorderRadius('md')}>
              <AlertIcon />
              <VStack align="start" spacing={getSpacing(1)} flex={1}>
                <AlertTitle fontSize="sm">Boost Your Asset's Impact</AlertTitle>
                <AlertDescription fontSize="sm">
                  Link your asset to existing platform features to increase visibility and create additional revenue streams.
                </AlertDescription>
              </VStack>
            </Alert>
            
            {/* Donation Integration */}
            <FormControl>
              <FormLabel>
                <HStack justify="space-between">
                  <CustomText size="sm" fontWeight="bold" color="secondary">
                    💰 Donation Integration
                  </CustomText>
                  <Button
                    size="xs"
                    variant="link"
                    colorScheme="blue"
                    onClick={toggleDonationGuide}
                  >
                    {showDonationGuide ? 'Hide' : 'Show'} guide
                  </Button>
                </HStack>
              </FormLabel>
              
              <Collapse in={showDonationGuide}>
                <Card variant="default" p={getSpacing(4)} mb={getSpacing(3)}>
                  <VStack align="start" spacing={getSpacing(2)}>
                    <CustomText size="sm" fontWeight="bold" color="accent">
                      How Donation Integration Works
                    </CustomText>
                    <VStack align="start" spacing={getSpacing(1)} fontSize="sm" color={getColor('text.secondary')}>
                      <CustomText>• Link your asset to an existing donation project on the platform</CustomText>
                      <CustomText>• Buyers can optionally support your broader work through donations</CustomText>
                      <CustomText>• Creates recurring income stream beyond one-time asset sales</CustomText>
                      <CustomText>• Builds community around your creative projects</CustomText>
                    </VStack>
                  </VStack>
                </Card>
              </Collapse>
              
              <VStack spacing={getSpacing(3)} align="stretch">
                <Checkbox
                  isChecked={!!assetData.related_donation_project_id}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      updateAssetData({ related_donation_project_id: null });
                    }
                  }}
                  colorScheme="green"
                >
                  <CustomText size="sm" color="secondary">
                    Enable donation integration for this asset
                  </CustomText>
                </Checkbox>
                
                {assetData.related_donation_project_id !== null && (
                  <Input
                    value={assetData.related_donation_project_id || ''}
                    onChange={(e) => updateAssetData({ related_donation_project_id: e.target.value })}
                    placeholder="Project ID or donation page URL"
                    size="md"
                    bg={getColor('backgrounds.surface')}
                    border={`1px solid ${getColor('borders.default')}`}
                    _hover={{ borderColor: getColor('brand.primary') }}
                    _focus={{ 
                      borderColor: getColor('brand.primary'),
                      boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                    }}
                  />
                )}
              </VStack>
              
              <FormHelperText>
                Link to an existing donation project or campaign to allow buyers to support your work beyond the asset purchase
              </FormHelperText>
            </FormControl>
            
            {/* Collaboration Integration */}
            <FormControl>
              <FormLabel>
                <HStack justify="space-between">
                  <CustomText size="sm" fontWeight="bold" color="secondary">
                    🤝 Collaboration Opportunities
                  </CustomText>
                  <Button
                    size="xs"
                    variant="link"
                    colorScheme="purple"
                    onClick={toggleCollabGuide}
                  >
                    {showCollabGuide ? 'Hide' : 'Show'} guide
                  </Button>
                </HStack>
              </FormLabel>
              
              <Collapse in={showCollabGuide}>
                <Card variant="default" p={getSpacing(4)} mb={getSpacing(3)}>
                  <VStack align="start" spacing={getSpacing(2)}>
                    <CustomText size="sm" fontWeight="bold" color="brand">
                      Benefits of Collaboration Integration
                    </CustomText>
                    <VStack align="start" spacing={getSpacing(1)} fontSize="sm" color={getColor('text.secondary')}>
                      <CustomText>• Find collaborators to enhance or extend your digital assets</CustomText>
                      <CustomText>• Build a team for larger projects and asset collections</CustomText>
                      <CustomText>• Share knowledge and learn from other creators</CustomText>
                      <CustomText>• Create more comprehensive and valuable asset packages</CustomText>
                    </VStack>
                  </VStack>
                </Card>
              </Collapse>
              
              <VStack spacing={getSpacing(3)} align="stretch">
                <Checkbox
                  isChecked={!!assetData.related_collaboration_id}
                  onChange={(e) => {
                    if (!e.target.checked) {
                      updateAssetData({ related_collaboration_id: null });
                    } else {
                      updateAssetData({ related_collaboration_id: '' });
                    }
                  }}
                  colorScheme="purple"
                >
                  <CustomText size="sm" color="secondary">
                    I'm seeking collaborators for this asset or related projects
                  </CustomText>
                </Checkbox>
                
                {assetData.related_collaboration_id !== null && (
                  <Textarea
                    value={assetData.related_collaboration_id || ''}
                    onChange={(e) => updateAssetData({ related_collaboration_id: e.target.value })}
                    placeholder="Describe what kind of collaboration you're looking for, what skills you need, or how others can contribute to this asset..."
                    rows={4}
                    bg={getColor('backgrounds.surface')}
                    border={`1px solid ${getColor('borders.default')}`}
                    _hover={{ borderColor: getColor('brand.primary') }}
                    _focus={{ 
                      borderColor: getColor('brand.primary'),
                      boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                    }}
                  />
                )}
              </VStack>
              
              <FormHelperText>
                Enable collaboration features to find other creators who can help enhance or extend your asset
              </FormHelperText>
            </FormControl>
            
            {/* Interactive Module Integration */}
            <FormControl>
              <FormLabel>
                <CustomText size="sm" fontWeight="bold" color="secondary">
                  📚 Learning Module Integration (Future Feature)
                </CustomText>
              </FormLabel>
              
              <Alert status="info" size="sm">
                <AlertIcon />
                <VStack align="start" spacing={getSpacing(1)} flex={1}>
                  <AlertTitle fontSize="xs">Coming Soon</AlertTitle>
                  <AlertDescription fontSize="xs">
                    Soon you'll be able to link your assets to interactive learning modules, creating comprehensive educational packages that buyers can learn from and implement.
                  </AlertDescription>
                </VStack>
              </Alert>
            </FormControl>
          </VStack>
        </Card>
      </MotionBox>
      
      {/* Benefits Summary */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card variant="default" p={getSpacing(4)}>
          <VStack align="start" spacing={getSpacing(2)}>
            <CustomText size="sm" fontWeight="bold" color="accent">
              🚀 Integration Benefits
            </CustomText>
            <VStack align="start" spacing={getSpacing(1)} fontSize="sm" color={getColor('text.secondary')}>
              <CustomText>• <strong>Increased Visibility:</strong> Assets with integrations get featured placement</CustomText>
              <CustomText>• <strong>Multiple Revenue Streams:</strong> Sales + donations + collaboration opportunities</CustomText>
              <CustomText>• <strong>Community Building:</strong> Connect with other creators and potential customers</CustomText>
              <CustomText>• <strong>Long-term Value:</strong> Ongoing support and development opportunities</CustomText>
            </VStack>
          </VStack>
        </Card>
      </MotionBox>
    </VStack>
  );
};