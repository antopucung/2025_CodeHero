import React, { useState } from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Button,
  Image,
  Box,
  Grid,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Collapse,
  useDisclosure
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useThemeTokens } from '../../../../theme/hooks/useThemeTokens';
import { CustomText } from '../../../../design/components/Typography';
import { Card } from '../../../../design/components/Card';

const MotionBox = motion(Box);

export const AssetMediaStep = ({ 
  assetData, 
  updateAssetData, 
  validationErrors 
}) => {
  const { getColor, getSpacing, getBorderRadius } = useThemeTokens();
  const { isOpen: showGuidelines, onToggle: toggleGuidelines } = useDisclosure();
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [previewError, setPreviewError] = useState('');
  
  const validateImageUrl = (url) => {
    if (!url) return false;
    // Basic URL validation
    try {
      new URL(url);
      // Check if it looks like an image URL
      return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) || 
             url.includes('imgur.com') || 
             url.includes('cloudinary.com') ||
             url.includes('unsplash.com') ||
             url.includes('pexels.com');
    } catch {
      return false;
    }
  };
  
  const handleThumbnailChange = (url) => {
    updateAssetData({ thumbnail_url: url });
    if (url && !validateImageUrl(url)) {
      setPreviewError('Please enter a valid image URL');
    } else {
      setPreviewError('');
    }
  };
  
  const addGalleryImage = () => {
    if (newGalleryUrl.trim() && validateImageUrl(newGalleryUrl)) {
      const currentUrls = assetData.gallery_image_urls || [];
      if (!currentUrls.includes(newGalleryUrl.trim())) {
        updateAssetData({
          gallery_image_urls: [...currentUrls, newGalleryUrl.trim()]
        });
      }
      setNewGalleryUrl('');
    }
  };
  
  const removeGalleryImage = (urlToRemove) => {
    const currentUrls = assetData.gallery_image_urls || [];
    updateAssetData({
      gallery_image_urls: currentUrls.filter(url => url !== urlToRemove)
    });
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addGalleryImage();
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
                🎨 Media & Previews
              </CustomText>
              <CustomText size="sm" color="muted">
                Add visual content to showcase your asset. All images should be hosted externally.
              </CustomText>
            </Box>
            
            {/* External Hosting Guidelines */}
            <Alert status="info" borderRadius={getBorderRadius('md')}>
              <AlertIcon />
              <VStack align="start" spacing={getSpacing(1)} flex={1}>
                <AlertTitle fontSize="sm">External Image Hosting Required</AlertTitle>
                <AlertDescription fontSize="sm">
                  Upload your images to external services and paste the direct links here.
                  <Button
                    size="xs"
                    variant="link"
                    colorScheme="blue"
                    onClick={toggleGuidelines}
                    ml={getSpacing(2)}
                  >
                    {showGuidelines ? 'Hide' : 'Show'} hosting guide
                  </Button>
                </AlertDescription>
              </VStack>
            </Alert>
            
            <Collapse in={showGuidelines}>
              <Card variant="default" p={getSpacing(4)}>
                <VStack align="start" spacing={getSpacing(3)}>
                  <CustomText size="sm" fontWeight="bold" color="accent">
                    📸 Recommended Image Hosting Services
                  </CustomText>
                  <VStack align="start" spacing={getSpacing(2)} fontSize="sm" color={getColor('text.secondary')}>
                    <CustomText><strong>Imgur:</strong> Free, reliable, direct links. Upload → Copy "Direct Link"</CustomText>
                    <CustomText><strong>Cloudinary:</strong> Professional CDN with optimization. Free tier available</CustomText>
                    <CustomText><strong>Google Photos:</strong> Share publicly → Copy image address</CustomText>
                    <CustomText><strong>GitHub:</strong> Upload to repository → Copy raw file URL</CustomText>
                    <CustomText><strong>Unsplash/Pexels:</strong> For placeholder images during development</CustomText>
                  </VStack>
                  <Alert status="warning" size="sm">
                    <AlertIcon />
                    <CustomText fontSize="xs">
                      Make sure your images are publicly accessible and will remain available long-term
                    </CustomText>
                  </Alert>
                </VStack>
              </Card>
            </Collapse>
            
            {/* Thumbnail */}
            <FormControl isRequired isInvalid={!!validationErrors.thumbnail_url || !!previewError}>
              <FormLabel>
                <CustomText size="sm" fontWeight="bold" color="secondary">
                  Thumbnail Image
                </CustomText>
              </FormLabel>
              
              <VStack spacing={getSpacing(4)} align="stretch">
                <Input
                  value={assetData.thumbnail_url}
                  onChange={(e) => handleThumbnailChange(e.target.value)}
                  placeholder="https://i.imgur.com/example.jpg"
                  size="lg"
                  bg={getColor('backgrounds.surface')}
                  border={`1px solid ${getColor('borders.default')}`}
                  _hover={{ borderColor: getColor('brand.primary') }}
                  _focus={{ 
                    borderColor: getColor('brand.primary'),
                    boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                  }}
                />
                
                {/* Thumbnail Preview */}
                {assetData.thumbnail_url && validateImageUrl(assetData.thumbnail_url) && (
                  <Box
                    maxW="300px"
                    borderRadius={getBorderRadius('md')}
                    overflow="hidden"
                    border={`1px solid ${getColor('borders.default')}`}
                  >
                    <Image
                      src={assetData.thumbnail_url}
                      alt="Thumbnail preview"
                      w="100%"
                      h="200px"
                      objectFit="cover"
                      fallback={
                        <Box
                          w="100%"
                          h="200px"
                          bg={getColor('backgrounds.surface')}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color={getColor('text.muted')}
                        >
                          Failed to load image
                        </Box>
                      }
                    />
                  </Box>
                )}
              </VStack>
              
              <FormErrorMessage>{validationErrors.thumbnail_url || previewError}</FormErrorMessage>
              <FormHelperText>
                Main image displayed in marketplace listings. Recommended: 400x300px or larger, high quality
              </FormHelperText>
            </FormControl>
            
            {/* Preview URL (Video/Demo) */}
            <FormControl isInvalid={!!validationErrors.preview_url}>
              <FormLabel>
                <CustomText size="sm" fontWeight="bold" color="secondary">
                  Preview URL (Optional)
                </CustomText>
              </FormLabel>
              <Input
                value={assetData.preview_url}
                onChange={(e) => updateAssetData({ preview_url: e.target.value })}
                placeholder="https://youtube.com/watch?v=... or https://your-demo.netlify.app"
                size="lg"
                bg={getColor('backgrounds.surface')}
                border={`1px solid ${getColor('borders.default')}`}
                _hover={{ borderColor: getColor('brand.primary') }}
                _focus={{ 
                  borderColor: getColor('brand.primary'),
                  boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                }}
              />
              <FormErrorMessage>{validationErrors.preview_url}</FormErrorMessage>
              <FormHelperText>
                Link to a video demo, interactive preview, or live example. YouTube, Vimeo, or hosted demo links work best
              </FormHelperText>
            </FormControl>
            
            {/* Gallery Images */}
            <FormControl>
              <FormLabel>
                <HStack justify="space-between">
                  <CustomText size="sm" fontWeight="bold" color="secondary">
                    Gallery Images ({(assetData.gallery_image_urls || []).length}/10)
                  </CustomText>
                  <CustomText size="xs" color="muted">
                    Optional additional screenshots
                  </CustomText>
                </HStack>
              </FormLabel>
              
              {/* Current Gallery Images */}
              {assetData.gallery_image_urls && assetData.gallery_image_urls.length > 0 && (
                <Grid 
                  templateColumns="repeat(auto-fit, minmax(150px, 1fr))" 
                  gap={getSpacing(3)} 
                  mb={getSpacing(4)}
                >
                  {assetData.gallery_image_urls.map((url, index) => (
                    <Box
                      key={index}
                      position="relative"
                      borderRadius={getBorderRadius('md')}
                      overflow="hidden"
                      border={`1px solid ${getColor('borders.default')}`}
                    >
                      <Image
                        src={url}
                        alt={`Gallery image ${index + 1}`}
                        w="100%"
                        h="120px"
                        objectFit="cover"
                        fallback={
                          <Box
                            w="100%"
                            h="120px"
                            bg={getColor('backgrounds.surface')}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            color={getColor('text.muted')}
                            fontSize="xs"
                          >
                            Failed to load
                          </Box>
                        }
                      />
                      <IconButton
                        icon="×"
                        size="sm"
                        position="absolute"
                        top={getSpacing(1)}
                        right={getSpacing(1)}
                        bg="rgba(0,0,0,0.7)"
                        color="white"
                        _hover={{ bg: "rgba(255,0,0,0.7)" }}
                        onClick={() => removeGalleryImage(url)}
                        aria-label="Remove image"
                      />
                    </Box>
                  ))}
                </Grid>
              )}
              
              {/* Add Gallery Image */}
              {(assetData.gallery_image_urls || []).length < 10 && (
                <HStack>
                  <Input
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="https://i.imgur.com/gallery-image.jpg"
                    size="md"
                    bg={getColor('backgrounds.surface')}
                    border={`1px solid ${getColor('borders.default')}`}
                    _hover={{ borderColor: getColor('brand.primary') }}
                    _focus={{ 
                      borderColor: getColor('brand.primary'),
                      boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                    }}
                  />
                  <Button
                    onClick={addGalleryImage}
                    isDisabled={!newGalleryUrl.trim() || !validateImageUrl(newGalleryUrl)}
                    colorScheme="green"
                    size="md"
                  >
                    Add Image
                  </Button>
                </HStack>
              )}
              
              <FormHelperText>
                Additional images to showcase different aspects of your asset. Press Enter to add each URL.
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
              📸 Image Best Practices
            </CustomText>
            <VStack align="start" spacing={getSpacing(1)} fontSize="sm" color={getColor('text.secondary')}>
              <CustomText>• Use high-quality images that clearly show your asset's features</CustomText>
              <CustomText>• Thumbnail should be eye-catching and represent your asset well</CustomText>
              <CustomText>• Gallery images can show different views, use cases, or variations</CustomText>
              <CustomText>• Ensure all hosted images will remain accessible long-term</CustomText>
              <CustomText>• Consider using a consistent style across all your asset images</CustomText>
            </VStack>
          </VStack>
        </Card>
      </MotionBox>
    </VStack>
  );
};