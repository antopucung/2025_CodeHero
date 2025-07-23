import React, { useState, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Box,
  Progress,
  Button,
  useToast,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDigitalAssets } from '../../../hooks/useDigitalAssets';
import { useThemeTokens } from '../../../theme/hooks/useThemeTokens';
import { CustomText } from '../../../design/components/Typography';
import { AssetBasicInfoStep } from './steps/AssetBasicInfoStep';
import { AssetMediaStep } from './steps/AssetMediaStep';
import { AssetFilesStep } from './steps/AssetFilesStep';
import { AssetIntegrationStep } from './steps/AssetIntegrationStep';
import { AssetReviewStep } from './steps/AssetReviewStep';
import { generateSlug, validateAssetData } from './utils/assetValidation';

const MotionBox = motion(Box);

const WIZARD_STEPS = [
  {
    id: 'basic',
    title: 'Basic Info',
    description: 'Asset details',
    icon: '📝'
  },
  {
    id: 'media',
    title: 'Media & Previews',
    description: 'Images & videos',
    icon: '🎨'
  },
  {
    id: 'files',
    title: 'Digital Files',
    description: 'Download links',
    icon: '📦'
  },
  {
    id: 'integration',
    title: 'Integration',
    description: 'Donations & collabs',
    icon: '🔗'
  },
  {
    id: 'review',
    title: 'Review & Publish',
    description: 'Final check',
    icon: '✅'
  }
];

export const UploadAssetWizard = ({ 
  isOpen, 
  onClose, 
  initialData = null, // For editing existing assets
  onSuccess 
}) => {
  const { getColor, getSpacing, getBorderRadius } = useThemeTokens();
  const { createAsset, updateAsset, loading } = useDigitalAssets();
  const toast = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [assetData, setAssetData] = useState(initialData || {
    title: '',
    description: '',
    price: 0,
    asset_type: 'template',
    thumbnail_url: '',
    preview_url: '',
    download_url: '',
    gallery_image_urls: [],
    tags: [],
    file_size_mb: null,
    file_format: '',
    compatible_with: [],
    related_donation_project_id: null,
    related_collaboration_id: null,
    is_published: false
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset wizard state when modal opens/closes
  React.useEffect(() => {
    if (isOpen && !initialData) {
      setCurrentStep(0);
      setAssetData({
        title: '',
        description: '',
        price: 0,
        asset_type: 'template',
        thumbnail_url: '',
        preview_url: '',
        download_url: '',
        gallery_image_urls: [],
        tags: [],
        file_size_mb: null,
        file_format: '',
        compatible_with: [],
        related_donation_project_id: null,
        related_collaboration_id: null,
        is_published: false
      });
      setValidationErrors({});
    }
  }, [isOpen, initialData]);
  
  // Update asset data
  const updateAssetData = (updates) => {
    setAssetData(prev => ({ ...prev, ...updates }));
    // Clear validation errors for updated fields
    const updatedFields = Object.keys(updates);
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => delete newErrors[field]);
      return newErrors;
    });
  };
  
  // Validate current step
  const validateCurrentStep = () => {
    const stepId = WIZARD_STEPS[currentStep].id;
    const errors = validateAssetData(assetData, stepId);
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Navigate to next step
  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < WIZARD_STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };
  
  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  // Jump to specific step
  const goToStep = (stepIndex) => {
    // Only allow jumping to previous steps or if current step is valid
    if (stepIndex <= currentStep || validateCurrentStep()) {
      setCurrentStep(stepIndex);
    }
  };
  
  // Submit asset
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    
    try {
      // Generate slug if creating new asset
      const finalData = { ...assetData };
      if (!initialData) {
        finalData.slug = generateSlug(assetData.title);
      }
      
      let result;
      if (initialData) {
        // Update existing asset
        result = await updateAsset(initialData.id, finalData);
      } else {
        // Create new asset
        result = await createAsset(finalData);
      }
      
      if (result.success) {
        toast({
          title: initialData ? "Asset Updated!" : "Asset Created!",
          description: initialData 
            ? "Your digital asset has been updated successfully."
            : "Your digital asset is now available in the marketplace.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        if (onSuccess) {
          onSuccess(result.asset);
        }
        
        onClose();
      }
    } catch (error) {
      console.error('Error submitting asset:', error);
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit asset. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Render current step component
  const renderStepContent = () => {
    const stepProps = {
      assetData,
      updateAssetData,
      validationErrors,
      onNext: nextStep,
      onPrev: prevStep
    };
    
    switch (WIZARD_STEPS[currentStep].id) {
      case 'basic':
        return <AssetBasicInfoStep {...stepProps} />;
      case 'media':
        return <AssetMediaStep {...stepProps} />;
      case 'files':
        return <AssetFilesStep {...stepProps} />;
      case 'integration':
        return <AssetIntegrationStep {...stepProps} />;
      case 'review':
        return (
          <AssetReviewStep 
            {...stepProps} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isEditing={!!initialData}
          />
        );
      default:
        return null;
    }
  };
  
  const progressPercentage = ((currentStep + 1) / WIZARD_STEPS.length) * 100;
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="6xl"
      closeOnOverlayClick={false}
      isCentered
    >
      <ModalOverlay bg="rgba(0,0,0,0.8)" backdropFilter="blur(4px)" />
      <ModalContent
        bg={getColor('backgrounds.elevated')}
        color={getColor('text.primary')}
        border={`1px solid ${getColor('borders.default')}`}
        borderRadius={getBorderRadius('lg')}
        maxH="90vh"
        overflow="hidden"
      >
        <ModalHeader
          bg={getColor('backgrounds.secondary')}
          borderBottom={`1px solid ${getColor('borders.default')}`}
          p={getSpacing(6)}
        >
          <VStack spacing={getSpacing(4)} align="stretch">
            <HStack justify="space-between">
              <VStack align="start" spacing={getSpacing(1)}>
                <CustomText size="xl" fontWeight="bold" color="brand">
                  {initialData ? '✏️ Edit Digital Asset' : '🚀 Upload Digital Asset'}
                </CustomText>
                <CustomText size="sm" color="muted">
                  {WIZARD_STEPS[currentStep].title} - {WIZARD_STEPS[currentStep].description}
                </CustomText>
              </VStack>
              
              <Box>
                <CustomText size="sm" color="secondary" mb={getSpacing(1)}>
                  Step {currentStep + 1} of {WIZARD_STEPS.length}
                </CustomText>
                <Progress
                  value={progressPercentage}
                  size="sm"
                  colorScheme="green"
                  bg={getColor('backgrounds.surface')}
                  borderRadius={getBorderRadius('full')}
                  w="200px"
                />
              </Box>
            </HStack>
            
            {/* Step Indicators */}
            <Stepper index={currentStep} colorScheme="green" size="sm">
              {WIZARD_STEPS.map((step, index) => (
                <Step key={step.id} onClick={() => goToStep(index)}>
                  <StepIndicator
                    cursor={index <= currentStep ? "pointer" : "default"}
                    bg={index <= currentStep ? getColor('brand.primary') : getColor('backgrounds.surface')}
                    color={index <= currentStep ? getColor('text.inverse') : getColor('text.muted')}
                    _hover={index <= currentStep ? {
                      transform: 'scale(1.1)',
                      boxShadow: `0 0 10px ${getColor('brand.primary')}66`
                    } : {}}
                    transition="all 0.2s ease"
                  >
                    <StepStatus
                      complete={<Box fontSize="sm">{step.icon}</Box>}
                      incomplete={<StepNumber />}
                      active={<Box fontSize="sm">{step.icon}</Box>}
                    />
                  </StepIndicator>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </VStack>
        </ModalHeader>
        
        <ModalCloseButton 
          color={getColor('text.muted')}
          _hover={{ color: getColor('text.primary') }}
        />
        
        <ModalBody
          p={0}
          maxH="calc(90vh - 200px)"
          overflow="auto"
        >
          <AnimatePresence mode="wait">
            <MotionBox
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              p={getSpacing(6)}
            >
              {renderStepContent()}
            </MotionBox>
          </AnimatePresence>
        </ModalBody>
        
        {/* Navigation Footer */}
        <Box
          bg={getColor('backgrounds.secondary')}
          borderTop={`1px solid ${getColor('borders.default')}`}
          p={getSpacing(4)}
        >
          <HStack justify="space-between">
            <Button
              variant="outline"
              onClick={prevStep}
              isDisabled={currentStep === 0}
              leftIcon={<Box>←</Box>}
            >
              Previous
            </Button>
            
            <HStack spacing={getSpacing(2)}>
              {WIZARD_STEPS.map((_, index) => (
                <Box
                  key={index}
                  w="8px"
                  h="8px"
                  borderRadius="full"
                  bg={index <= currentStep ? getColor('brand.primary') : getColor('backgrounds.surface')}
                  cursor={index <= currentStep ? "pointer" : "default"}
                  onClick={() => goToStep(index)}
                  transition="all 0.2s ease"
                  _hover={index <= currentStep ? {
                    transform: 'scale(1.2)',
                    boxShadow: `0 0 6px ${getColor('brand.primary')}`
                  } : {}}
                />
              ))}
            </HStack>
            
            {currentStep < WIZARD_STEPS.length - 1 ? (
              <Button
                colorScheme="green"
                onClick={nextStep}
                rightIcon={<Box>→</Box>}
              >
                Next
              </Button>
            ) : (
              <Button
                colorScheme="green"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText={initialData ? "Updating..." : "Publishing..."}
                rightIcon={<Box>🚀</Box>}
              >
                {initialData ? 'Update Asset' : 'Publish Asset'}
              </Button>
            )}
          </HStack>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default UploadAssetWizard;