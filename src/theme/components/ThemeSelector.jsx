import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Grid,
  Badge,
  Tooltip,
  IconButton
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import { useThemeTokens } from '../hooks/useThemeTokens';

const MotionBox = motion(Box);

// Theme Preview Card
const ThemePreviewCard = ({ theme, isActive, onSelect }) => {
  const colors = theme.colors || {};
  
  return (
    <MotionBox
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(theme.id)}
      cursor="pointer"
      position="relative"
    >
      <Box
        bg={colors.backgrounds?.elevated || '#2d3748'}
        border="2px solid"
        borderColor={isActive ? (colors.brand?.primary || '#00ff00') : (colors.borders?.default || '#333')}
        borderRadius="md"
        p={4}
        h="120px"
        position="relative"
        overflow="hidden"
        boxShadow={isActive ? `0 0 20px ${colors.brand?.primary || '#00ff00'}33` : 'none'}
      >
        {/* Theme colors preview */}
        <HStack spacing={1} mb={2}>
          <Box
            w="12px"
            h="12px"
            borderRadius="full"
            bg={colors.brand?.primary || '#00ff00'}
          />
          <Box
            w="12px"
            h="12px"
            borderRadius="full"
            bg={colors.brand?.secondary || '#4ecdc4'}
          />
          <Box
            w="12px"
            h="12px"
            borderRadius="full"
            bg={colors.brand?.accent || '#ffd93d'}
          />
        </HStack>
        
        {/* Theme name */}
        <Box
          fontSize="sm"
          fontWeight="bold"
          color={colors.text?.primary || '#ffffff'}
          mb={1}
        >
          {theme.name}
        </Box>
        
        {/* Theme description */}
        <Box
          fontSize="xs"
          color={colors.text?.muted || '#a0aec0'}
          noOfLines={2}
        >
          {theme.description}
        </Box>
        
        {/* Active indicator */}
        {isActive && (
          <Box
            position="absolute"
            top={2}
            right={2}
            bg={colors.brand?.primary || '#00ff00'}
            color={colors.text?.inverse || '#000000'}
            px={2}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
          >
            ACTIVE
          </Box>
        )}
        
        {/* Custom theme indicator */}
        {theme.isCustom && (
          <Badge
            position="absolute"
            bottom={2}
            left={2}
            colorScheme="purple"
            fontSize="xs"
          >
            CUSTOM
          </Badge>
        )}
      </Box>
    </MotionBox>
  );
};

// Main Theme Selector Component
export const ThemeSelector = ({ compact = false }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentTheme, availableThemes, switchTheme } = useTheme();
  const { getColor } = useThemeTokens();
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  
  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    switchTheme(themeId);
    
    if (compact) {
      onClose();
    }
  };
  
  const currentThemeData = availableThemes.find(theme => theme.id === currentTheme);
  
  if (compact) {
    return (
      <>
        <Tooltip label="Change Theme" placement="top">
          <IconButton
            icon="⚙"
            size="sm"
            variant="ghost"
            fontSize="md"
            fontWeight="bold"
            onClick={onOpen}
            aria-label="Change Theme"
            color={getColor('text.primary')}
            _hover={{ 
              color: getColor('brand.primary'),
              transform: 'scale(1.1)',
              bg: getColor('backgrounds.surface')
            }}
            _active={{ transform: 'scale(0.95)' }}
          />
        </Tooltip>
        
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay bg="rgba(0,0,0,0.8)" />
          <ModalContent
            bg={getColor('backgrounds.elevated')}
            color={getColor('text.primary')}
            border={`1px solid ${getColor('borders.default')}`}
          >
            <ModalHeader>Choose Theme</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
                {availableThemes.map((theme) => (
                  <ThemePreviewCard
                    key={theme.id}
                    theme={theme}
                    isActive={theme.id === currentTheme}
                    onSelect={handleThemeSelect}
                  />
                ))}
              </Grid>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }
  
  return (
    <VStack spacing={6} align="stretch">
      <HStack justify="space-between">
        <Box>
          <Box fontSize="xl" fontWeight="bold" color={getColor('text.primary')}>
            Theme Settings
          </Box>
          <Box fontSize="sm" color={getColor('text.muted')}>
            Choose your preferred visual style
          </Box>
        </Box>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.location.reload()}
        >
          Reset Customizations
        </Button>
        {/* Quick theme switch buttons */}
        <HStack spacing={2}>
          {['terminal', 'rundown', 'cyberpunk', 'minimal'].map((themeId) => {
            const themeData = availableThemes.find(t => t.id === themeId);
            if (!themeData) return null;
            
            return (
              <Button
                key={themeId}
                size="sm"
                variant={currentTheme === themeId ? "solid" : "outline"}
                onClick={() => handleThemeSelect(themeId)}
                bg={currentTheme === themeId ? getColor('brand.primary') : 'transparent'}
                color={currentTheme === themeId ? getColor('text.inverse') : getColor('text.secondary')}
                _hover={{
                  color: getColor('brand.primary'),
                  borderColor: getColor('brand.primary')
                }}
              >
                {themeData.name}
              </Button>
            );
          })}
        </HStack>
      </HStack>
      
      {/* Current Theme Info */}
      <Box
        bg={getColor('backgrounds.surface')}
        p={4}
        borderRadius="md"
        border={`1px solid ${getColor('borders.default')}`}
      >
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Box fontSize="md" fontWeight="bold" color={getColor('text.primary')}>
              Current Theme: {currentThemeData?.name || 'Unknown'}
            </Box>
            <Box fontSize="sm" color={getColor('text.muted')}>
              {currentThemeData?.description || 'No description available'}
            </Box>
          </VStack>
          
          <HStack spacing={2}>
            <Box
              w="16px"
              h="16px"
              borderRadius="full"
              bg={getColor('brand.primary')}
              border={`2px solid ${getColor('borders.default')}`}
            />
            <Box
              w="16px"
              h="16px"
              borderRadius="full"
              bg={getColor('brand.secondary')}
              border={`2px solid ${getColor('borders.default')}`}
            />
            <Box
              w="16px"
              h="16px"
              borderRadius="full"
              bg={getColor('brand.accent')}
              border={`2px solid ${getColor('borders.default')}`}
            />
          </HStack>
        </HStack>
      </Box>
      
      {/* Available Themes */}
      <Box>
        <Box fontSize="lg" fontWeight="bold" color={getColor('text.primary')} mb={4}>
          Available Themes
        </Box>
        
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
          {availableThemes.map((theme) => (
            <ThemePreviewCard
              key={theme.id}
              theme={theme}
              isActive={theme.id === currentTheme}
              onSelect={handleThemeSelect}
            />
          ))}
        </Grid>
      </Box>
    </VStack>
  );
};

export default ThemeSelector;