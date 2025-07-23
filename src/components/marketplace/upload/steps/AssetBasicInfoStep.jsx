import React from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tag,
  TagInput,
  TagCloseButton,
  Wrap,
  WrapItem,
  Box,
  Button
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useThemeTokens } from '../../../../theme/hooks/useThemeTokens';
import { CustomText } from '../../../../design/components/Typography';
import { Card } from '../../../../design/components/Card';

const MotionBox = motion(Box);

const ASSET_TYPES = [
  { value: 'template', label: 'Template', icon: '📝', description: 'Website, app, or document templates' },
  { value: 'ui_kit', label: 'UI Kit', icon: '🎨', description: 'User interface design components' },
  { value: 'code_snippet', label: 'Code Snippet', icon: '💻', description: 'Reusable code examples' },
  { value: '3d_model', label: '3D Model', icon: '🎯', description: '3D assets and models' },
  { value: 'tutorial_pack', label: 'Tutorial Pack', icon: '📚', description: 'Educational content and guides' },
  { value: 'icon_pack', label: 'Icon Pack', icon: '🎭', description: 'Collections of icons' },
  { value: 'font_pack', label: 'Font Pack', icon: '🔤', description: 'Typography and fonts' },
  { value: 'design_system', label: 'Design System', icon: '🎪', description: 'Complete design systems' },
  { value: 'component_library', label: 'Component Library', icon: '🧩', description: 'Reusable UI components' },
  { value: 'plugin', label: 'Plugin', icon: '🔌', description: 'Software plugins and extensions' },
  { value: 'extension', label: 'Extension', icon: '⚡', description: 'Browser or app extensions' },
  { value: 'other', label: 'Other', icon: '📦', description: 'Other digital assets' }
];

export const AssetBasicInfoStep = ({ 
  assetData, 
  updateAssetData, 
  validationErrors 
}) => {
  const { getColor, getSpacing, getBorderRadius } = useThemeTokens();
  const [newTag, setNewTag] = React.useState('');
  
  const handleTagAdd = (tag) => {
    if (tag.trim() && !assetData.tags.includes(tag.trim())) {
      updateAssetData({
        tags: [...assetData.tags, tag.trim()]
      });
    }
    setNewTag('');
  };
  
  const handleTagRemove = (tagToRemove) => {
    updateAssetData({
      tags: assetData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleTagAdd(newTag);
    }
  };
  
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
                📝 Basic Asset Information
              </CustomText>
              <CustomText size="sm" color="muted">
                Tell us about your digital asset - this information will be shown to potential buyers.
              </CustomText>
            </Box>
            
            {/* Title */}
            <FormControl isRequired isInvalid={!!validationErrors.title}>
              <FormLabel>
                <CustomText size="sm" fontWeight="bold" color="secondary">
                  Asset Title
                </CustomText>
              </FormLabel>
              <Input
                value={assetData.title}
                onChange={(e) => updateAssetData({ title: e.target.value })}
                placeholder="e.g., Modern React Dashboard Template"
                size="lg"
                bg={getColor('backgrounds.surface')}
                border={`1px solid ${getColor('borders.default')}`}
                _hover={{ borderColor: getColor('brand.primary') }}
                _focus={{ 
                  borderColor: getColor('brand.primary'),
                  boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                }}
              />
              <FormErrorMessage>{validationErrors.title}</FormErrorMessage>
              <FormHelperText>
                Choose a clear, descriptive title that buyers will easily understand
              </FormHelperText>
            </FormControl>
            
            {/* Description */}
            <FormControl isRequired isInvalid={!!validationErrors.description}>
              <FormLabel>
                <CustomText size="sm" fontWeight="bold" color="secondary">
                  Description
                </CustomText>
              </FormLabel>
              <Textarea
                value={assetData.description}
                onChange={(e) => updateAssetData({ description: e.target.value })}
                placeholder="Describe what your asset includes, what problems it solves, and what makes it unique..."
                rows={6}
                resize="vertical"
                bg={getColor('backgrounds.surface')}
                border={`1px solid ${getColor('borders.default')}`}
                _hover={{ borderColor: getColor('brand.primary') }}
                _focus={{ 
                  borderColor: getColor('brand.primary'),
                  boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                }}
              />
              <FormErrorMessage>{validationErrors.description}</FormErrorMessage>
              <FormHelperText>
                {assetData.description.length}/1000 characters. Be detailed about features, requirements, and benefits.
              </FormHelperText>
            </FormControl>
            
            {/* Asset Type */}
            <FormControl isRequired isInvalid={!!validationErrors.asset_type}>
              <FormLabel>
                <CustomText size="sm" fontWeight="bold" color="secondary">
                  Asset Type
                </CustomText>
              </FormLabel>
              <Select
                value={assetData.asset_type}
                onChange={(e) => updateAssetData({ asset_type: e.target.value })}
                size="lg"
                bg={getColor('backgrounds.surface')}
                border={`1px solid ${getColor('borders.default')}`}
                _hover={{ borderColor: getColor('brand.primary') }}
                _focus={{ 
                  borderColor: getColor('brand.primary'),
                  boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                }}
              >
                {ASSET_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label} - {type.description}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{validationErrors.asset_type}</FormErrorMessage>
              <FormHelperText>
                Choose the category that best describes your asset
              </FormHelperText>
            </FormControl>
            
            {/* Price */}
            <FormControl isInvalid={!!validationErrors.price}>
              <FormLabel>
                <HStack justify="space-between">
                  <CustomText size="sm" fontWeight="bold" color="secondary">
                    Price (USD)
                  </CustomText>
                  <CustomText size="xs" color="muted">
                    Set to $0 for free assets
                  </CustomText>
                </HStack>
              </FormLabel>
              <NumberInput
                value={assetData.price}
                onChange={(valueString) => updateAssetData({ price: parseFloat(valueString) || 0 })}
                min={0}
                max={999}
                precision={2}
                size="lg"
              >
                <NumberInputField
                  bg={getColor('backgrounds.surface')}
                  border={`1px solid ${getColor('borders.default')}`}
                  _hover={{ borderColor: getColor('brand.primary') }}
                  _focus={{ 
                    borderColor: getColor('brand.primary'),
                    boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                  }}
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{validationErrors.price}</FormErrorMessage>
              <FormHelperText>
                Free assets help build your reputation and attract more buyers to your premium content
              </FormHelperText>
            </FormControl>
            
            {/* Tags */}
            <FormControl>
              <FormLabel>
                <CustomText size="sm" fontWeight="bold" color="secondary">
                  Tags ({assetData.tags.length}/10)
                </CustomText>
              </FormLabel>
              
              {/* Current Tags */}
              {assetData.tags.length > 0 && (
                <Wrap spacing={getSpacing(2)} mb={getSpacing(3)}>
                  {assetData.tags.map((tag, index) => (
                    <WrapItem key={index}>
                      <Tag
                        size="md"
                        variant="solid"
                        bg={getColor('brand.primary')}
                        color={getColor('text.inverse')}
                        borderRadius={getBorderRadius('full')}
                      >
                        {tag}
                        <TagCloseButton onClick={() => handleTagRemove(tag)} />
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              )}
              
              {/* Add Tag Input */}
              <HStack>
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add tags (React, Dashboard, Modern, etc.)"
                  size="md"
                  bg={getColor('backgrounds.surface')}
                  border={`1px solid ${getColor('borders.default')}`}
                  _hover={{ borderColor: getColor('brand.primary') }}
                  _focus={{ 
                    borderColor: getColor('brand.primary'),
                    boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                  }}
                  isDisabled={assetData.tags.length >= 10}
                />
                <Button
                  onClick={() => handleTagAdd(newTag)}
                  isDisabled={!newTag.trim() || assetData.tags.length >= 10}
                  colorScheme="green"
                  size="md"
                >
                  Add
                </Button>
              </HStack>
              
              <FormHelperText>
                Add relevant tags to help buyers find your asset. Press Enter or comma to add each tag.
              </FormHelperText>
            </FormControl>
          </VStack>
        </Card>
      </MotionBox>
      
      {/* Tips Card */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card variant="default" p={getSpacing(4)}>
          <VStack align="start" spacing={getSpacing(2)}>
            <CustomText size="sm" fontWeight="bold" color="accent">
              💡 Tips for Success
            </CustomText>
            <VStack align="start" spacing={getSpacing(1)} fontSize="sm" color={getColor('text.secondary')}>
              <CustomText>• Use clear, descriptive titles that explain what the asset does</CustomText>
              <CustomText>• Write detailed descriptions highlighting key features and benefits</CustomText>
              <CustomText>• Choose accurate categories to help buyers find your content</CustomText>
              <CustomText>• Free assets can build your reputation and attract premium buyers</CustomText>
              <CustomText>• Use relevant tags that buyers might search for</CustomText>
            </VStack>
          </VStack>
        </Card>
      </MotionBox>
    </VStack>
  );
};