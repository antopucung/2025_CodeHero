import React from 'react';
import {
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  useDisclosure,
  Collapse,
  Code,
  UnorderedList,
  ListItem
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useThemeTokens } from '../../../../theme/hooks/useThemeTokens';
import { CustomText } from '../../../../design/components/Typography';
import { Card } from '../../../../design/components/Card';

const MotionBox = motion(Box);

const FILE_FORMATS = [
  { value: 'zip', label: 'ZIP Archive (.zip)' },
  { value: 'rar', label: 'RAR Archive (.rar)' },
  { value: 'pdf', label: 'PDF Document (.pdf)' },
  { value: 'psd', label: 'Photoshop File (.psd)' },
  { value: 'ai', label: 'Illustrator File (.ai)' },
  { value: 'sketch', label: 'Sketch File (.sketch)' },
  { value: 'figma', label: 'Figma File (Link)' },
  { value: 'html', label: 'HTML/CSS (.html, .css)' },
  { value: 'js', label: 'JavaScript (.js, .jsx)' },
  { value: 'ts', label: 'TypeScript (.ts, .tsx)' },
  { value: 'json', label: 'JSON Data (.json)' },
  { value: 'other', label: 'Other Format' }
];

const COMPATIBILITY_OPTIONS = [
  'Photoshop CC+', 'Illustrator CC+', 'Figma', 'Sketch', 'Adobe XD',
  'React 16+', 'React 17+', 'React 18+', 'Vue 2', 'Vue 3', 'Angular 12+',
  'Node.js 14+', 'Node.js 16+', 'Node.js 18+', 'Next.js', 'Nuxt.js',
  'Bootstrap 4', 'Bootstrap 5', 'Tailwind CSS', 'Material-UI', 'Chakra UI',
  'WordPress 5+', 'HTML5/CSS3', 'Responsive Design', 'Mobile First'
];

export const AssetFilesStep = ({ 
  assetData, 
  updateAssetData, 
  validationErrors 
}) => {
  const { getColor, getSpacing, getBorderRadius } = useThemeTokens();
  const { isOpen: showGoogleDriveGuide, onToggle: toggleGoogleDriveGuide } = useDisclosure();
  const { isOpen: showOtherServicesGuide, onToggle: toggleOtherServicesGuide } = useDisclosure();
  
  const validateDownloadUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  
  const generateDirectDownloadLink = (driveUrl) => {
    if (!driveUrl.includes('drive.google.com')) return driveUrl;
    
    // Extract file ID from various Google Drive URL formats
    let fileId = '';
    
    if (driveUrl.includes('/file/d/')) {
      fileId = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1];
    } else if (driveUrl.includes('id=')) {
      fileId = driveUrl.match(/id=([a-zA-Z0-9-_]+)/)?.[1];
    }
    
    if (fileId) {
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    
    return driveUrl;
  };
  
  const handleDownloadUrlChange = (url) => {
    updateAssetData({ download_url: url });
    
    // Auto-suggest direct download format for Google Drive
    if (url.includes('drive.google.com') && url.includes('/view')) {
      const directUrl = generateDirectDownloadLink(url);
      if (directUrl !== url) {
        updateAssetData({ download_url: directUrl });
      }
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
                📦 Digital Asset Files
              </CustomText>
              <CustomText size="sm" color="muted">
                Provide download links for your digital assets. Files should be hosted externally to minimize platform costs.
              </CustomText>
            </Box>
            
            {/* External Hosting Notice */}
            <Alert status="info" borderRadius={getBorderRadius('md')}>
              <AlertIcon />
              <VStack align="start" spacing={getSpacing(1)} flex={1}>
                <AlertTitle fontSize="sm">External File Hosting Required</AlertTitle>
                <AlertDescription fontSize="sm">
                  Upload your files to cloud storage and provide direct download links here. This keeps platform costs low while ensuring reliable access.
                </AlertDescription>
              </VStack>
            </Alert>
            
            {/* Download URL */}
            <FormControl isRequired isInvalid={!!validationErrors.download_url}>
              <FormLabel>
                <HStack justify="space-between">
                  <CustomText size="sm" fontWeight="bold" color="secondary">
                    Download URL
                  </CustomText>
                  <HStack spacing={getSpacing(2)}>
                    <Button
                      size="xs"
                      variant="link"
                      colorScheme="blue"
                      onClick={toggleGoogleDriveGuide}
                    >
                      Google Drive Guide
                    </Button>
                    <Button
                      size="xs"
                      variant="link"
                      colorScheme="purple"
                      onClick={toggleOtherServicesGuide}
                    >
                      Other Services
                    </Button>
                  </HStack>
                </HStack>
              </FormLabel>
              
              <Input
                value={assetData.download_url}
                onChange={(e) => handleDownloadUrlChange(e.target.value)}
                placeholder="https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"
                size="lg"
                bg={getColor('backgrounds.surface')}
                border={`1px solid ${getColor('borders.default')}`}
                _hover={{ borderColor: getColor('brand.primary') }}
                _focus={{ 
                  borderColor: getColor('brand.primary'),
                  boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                }}
              />
              
              <FormErrorMessage>{validationErrors.download_url}</FormErrorMessage>
              <FormHelperText>
                Direct download link to your digital asset file. Must be publicly accessible.
              </FormHelperText>
            </FormControl>
            
            {/* Google Drive Guide */}
            <Collapse in={showGoogleDriveGuide}>
              <Card variant="default" p={getSpacing(4)}>
                <VStack align="start" spacing={getSpacing(3)}>
                  <CustomText size="sm" fontWeight="bold" color="brand">
                    📁 Google Drive Setup Guide
                  </CustomText>
                  <VStack align="start" spacing={getSpacing(2)} fontSize="sm">
                    <Box>
                      <CustomText fontWeight="bold" color="secondary">Step 1: Upload Your File</CustomText>
                      <CustomText color={getColor('text.secondary')}>
                        Upload your digital asset file to Google Drive
                      </CustomText>
                    </Box>
                    <Box>
                      <CustomText fontWeight="bold" color="secondary">Step 2: Share the File</CustomText>
                      <CustomText color={getColor('text.secondary')}>
                        Right-click the file → Share → Change "General access" to "Anyone with the link"
                      </CustomText>
                    </Box>
                    <Box>
                      <CustomText fontWeight="bold" color="secondary">Step 3: Get Direct Download Link</CustomText>
                      <CustomText color={getColor('text.secondary')}>
                        Copy the share link and convert it to direct download format:
                      </CustomText>
                      <Code fontSize="xs" p={getSpacing(2)} bg={getColor('backgrounds.surface')}>
                        https://drive.google.com/uc?export=download&id=YOUR_FILE_ID
                      </Code>
                    </Box>
                  </VStack>
                  <Alert status="success" size="sm">
                    <AlertIcon />
                    <CustomText fontSize="xs">
                      The system will auto-convert Google Drive view links to direct download format
                    </CustomText>
                  </Alert>
                </VStack>
              </Card>
            </Collapse>
            
            {/* Other Services Guide */}
            <Collapse in={showOtherServicesGuide}>
              <Card variant="default" p={getSpacing(4)}>
                <VStack align="start" spacing={getSpacing(3)}>
                  <CustomText size="sm" fontWeight="bold" color="accent">
                    🌐 Alternative Hosting Services
                  </CustomText>
                  <VStack align="start" spacing={getSpacing(2)} fontSize="sm">
                    <Box>
                      <CustomText fontWeight="bold" color="secondary">Dropbox</CustomText>
                      <CustomText color={getColor('text.secondary')}>
                        Share link → Replace "dropbox.com" with "dl.dropboxusercontent.com"
                      </CustomText>
                    </Box>
                    <Box>
                      <CustomText fontWeight="bold" color="secondary">OneDrive</CustomText>
                      <CustomText color={getColor('text.secondary')}>
                        Share → Copy link → Replace "view.aspx" with "download.aspx"
                      </CustomText>
                    </Box>
                    <Box>
                      <CustomText fontWeight="bold" color="secondary">GitHub Releases</CustomText>
                      <CustomText color={getColor('text.secondary')}>
                        Perfect for code assets. Upload to releases and use the direct asset URL
                      </CustomText>
                    </Box>
                    <Box>
                      <CustomText fontWeight="bold" color="secondary">MediaFire / SendSpace</CustomText>
                      <CustomText color={getColor('text.secondary')}>
                        Dedicated file hosting services with direct download options
                      </CustomText>
                    </Box>
                  </VStack>
                </VStack>
              </Card>
            </Collapse>
            
            {/* File Format */}
            <FormControl>
              <FormLabel>
                <CustomText size="sm" fontWeight="bold" color="secondary">
                  File Format
                </CustomText>
              </FormLabel>
              <Select
                value={assetData.file_format}
                onChange={(e) => updateAssetData({ file_format: e.target.value })}
                placeholder="Select file format"
                size="lg"
                bg={getColor('backgrounds.surface')}
                border={`1px solid ${getColor('borders.default')}`}
                _hover={{ borderColor: getColor('brand.primary') }}
                _focus={{ 
                  borderColor: getColor('brand.primary'),
                  boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                }}
              >
                {FILE_FORMATS.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </Select>
              <FormHelperText>
                What format is your digital asset file in?
              </FormHelperText>
            </FormControl>
            
            {/* File Size */}
            <FormControl>
              <FormLabel>
                <CustomText size="sm" fontWeight="bold" color="secondary">
                  File Size (MB)
                </CustomText>
              </FormLabel>
              <NumberInput
                value={assetData.file_size_mb || ''}
                onChange={(valueString) => updateAssetData({ 
                  file_size_mb: valueString ? parseFloat(valueString) : null 
                })}
                min={0.1}
                max={1000}
                precision={1}
                size="lg"
              >
                <NumberInputField
                  placeholder="e.g., 15.5"
                  bg={getColor('backgrounds.surface')}
                  border={`1px solid ${getColor('borders.default')}`}
                  _hover={{ borderColor: getColor('brand.primary') }}
                  _focus={{ 
                    borderColor: getColor('brand.primary'),
                    boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                  }}
                />
              </NumberInput>
              <FormHelperText>
                Approximate file size helps buyers understand download requirements
              </FormHelperText>
            </FormControl>
            
            {/* Compatibility */}
            <FormControl>
              <FormLabel>
                <CustomText size="sm" fontWeight="bold" color="secondary">
                  Compatible With
                </CustomText>
              </FormLabel>
              
              <VStack spacing={getSpacing(3)} align="stretch">
                {/* Quick Select Buttons */}
                <Box>
                  <CustomText size="xs" color="muted" mb={getSpacing(2)}>
                    Quick select common compatibility:
                  </CustomText>
                  <HStack spacing={getSpacing(2)} flexWrap="wrap">
                    {COMPATIBILITY_OPTIONS.slice(0, 6).map((option) => (
                      <Button
                        key={option}
                        size="xs"
                        variant={assetData.compatible_with?.includes(option) ? "solid" : "outline"}
                        colorScheme="green"
                        onClick={() => {
                          const current = assetData.compatible_with || [];
                          if (current.includes(option)) {
                            updateAssetData({
                              compatible_with: current.filter(item => item !== option)
                            });
                          } else {
                            updateAssetData({
                              compatible_with: [...current, option]
                            });
                          }
                        }}
                      >
                        {option}
                      </Button>
                    ))}
                  </HStack>
                </Box>
                
                {/* Custom Compatibility Input */}
                <Input
                  placeholder="Add custom compatibility (e.g., WordPress 6.0+, Bootstrap 5)"
                  size="md"
                  bg={getColor('backgrounds.surface')}
                  border={`1px solid ${getColor('borders.default')}`}
                  _hover={{ borderColor: getColor('brand.primary') }}
                  _focus={{ 
                    borderColor: getColor('brand.primary'),
                    boxShadow: `0 0 0 1px ${getColor('brand.primary')}`
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const current = assetData.compatible_with || [];
                      const newItem = e.target.value.trim();
                      if (!current.includes(newItem)) {
                        updateAssetData({
                          compatible_with: [...current, newItem]
                        });
                      }
                      e.target.value = '';
                    }
                  }}
                />
                
                {/* Selected Compatibility List */}
                {assetData.compatible_with && assetData.compatible_with.length > 0 && (
                  <Box>
                    <CustomText size="xs" color="secondary" mb={getSpacing(1)}>
                      Compatible with: {assetData.compatible_with.join(', ')}
                    </CustomText>
                  </Box>
                )}
              </VStack>
              
              <FormHelperText>
                What software, frameworks, or platforms does your asset work with?
              </FormHelperText>
            </FormControl>
          </VStack>
        </Card>
      </MotionBox>
      
      {/* Warning Card */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Alert status="warning" borderRadius={getBorderRadius('md')}>
          <AlertIcon />
          <VStack align="start" spacing={getSpacing(1)} flex={1}>
            <AlertTitle fontSize="sm">Important: File Accessibility</AlertTitle>
            <AlertDescription fontSize="sm">
              Make sure your download links remain accessible long-term. Broken download links will affect your reputation and sales.
            </AlertDescription>
          </VStack>
        </Alert>
      </MotionBox>
    </VStack>
  );
};