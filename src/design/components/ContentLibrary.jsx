import React, { useState } from 'react';
import { Box, VStack, HStack, Badge, Grid, Tabs, TabList, TabPanels, Tab, TabPanel, Divider } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { designSystem } from '../system/DesignSystem';
import { CustomText } from './Typography';
import { Button } from './Button';
import { Card } from './Card';

const MotionBox = motion(Box);

// Tool Card Component
export const ToolCard = ({ 
  tool, 
  isLocked = false,
  onDownload,
  onPreview
}) => {
  return (
    <Card variant="elevated">
      <VStack spacing={designSystem.spacing[3]} align="stretch" p={designSystem.spacing[4]}>
        {/* Header */}
        <HStack justify="space-between">
          <HStack>
            <Box fontSize={designSystem.typography.sizes.lg}>{tool.icon}</Box>
            <CustomText 
              size="md" 
              color={isLocked ? "muted" : "brand"} 
              fontWeight={designSystem.typography.weights.bold}
            >
              {tool.name}
            </CustomText>
          </HStack>
          
          {/* Lock status */}
          {isLocked ? (
            <Badge bg={designSystem.colors.status.warning} color="#000">
              🔒 Locked
            </Badge>
          ) : (
            <Badge bg={designSystem.colors.status.success} color="#000">
              ✓ Available
            </Badge>
          )}
        </HStack>
        
        {/* Description */}
        <CustomText 
          size="sm" 
          color={isLocked ? "muted" : "secondary"}
          noOfLines={3}
        >
          {tool.description}
        </CustomText>
        
        {/* Tags */}
        <HStack flexWrap="wrap">
          {tool.tags.map((tag, index) => (
            <Badge 
              key={index} 
              bg={isLocked ? designSystem.colors.backgrounds.surface : designSystem.colors.backgrounds.elevated}
              color={isLocked ? "muted" : "secondary"}
            >
              {tag}
            </Badge>
          ))}
        </HStack>
        
        {/* Version & Size */}
        <HStack justify="space-between" fontSize={designSystem.typography.sizes.xs} color="muted">
          <CustomText>v{tool.version}</CustomText>
          <CustomText>{tool.size}</CustomText>
        </HStack>
        
        <Divider />
        
        {/* Actions */}
        <HStack justify="space-between">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPreview(tool)}
          >
            Preview
          </Button>
          
          <Button
            bg={isLocked ? designSystem.colors.status.warning : designSystem.colors.brand.primary}
            color={designSystem.colors.text.inverse}
            size="sm"
            onClick={isLocked ? null : () => onDownload(tool)}
            disabled={isLocked}
            opacity={isLocked ? 0.7 : 1}
            _hover={isLocked ? {} : { bg: designSystem.colors.interactive.hover }}
          >
            {isLocked ? "Unlock" : "Download"}
          </Button>
        </HStack>
      </VStack>
    </Card>
  );
};

// Tutorial Card Component
export const TutorialCard = ({
  tutorial,
  isLocked = false,
  onPreview,
  onWatch
}) => {
  return (
    <Card variant="elevated">
      <VStack spacing={0} align="stretch">
        {/* Thumbnail */}
        <Box 
          h="150px" 
          position="relative"
          borderTopLeftRadius={designSystem.radii.md}
          borderTopRightRadius={designSystem.radii.md}
          overflow="hidden"
        >
          <Box
            as="img"
            src={tutorial.thumbnail}
            alt={tutorial.title}
            w="100%"
            h="100%"
            objectFit="cover"
            filter={isLocked ? "grayscale(70%) brightness(40%)" : "brightness(80%)"}
          />
          
          {/* Play/Lock icon */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            fontSize="3xl"
            color="white"
          >
            {isLocked ? "🔒" : "▶️"}
          </Box>
          
          {/* Duration */}
          <Badge
            position="absolute"
            bottom={designSystem.spacing[2]}
            right={designSystem.spacing[2]}
            bg="rgba(0,0,0,0.7)"
            color="white"
            px={designSystem.spacing[2]}
            fontSize={designSystem.typography.sizes.xs}
          >
            {tutorial.duration}
          </Badge>
          
          {/* Tier label if locked */}
          {isLocked && (
            <Badge
              position="absolute"
              top={designSystem.spacing[2]}
              right={designSystem.spacing[2]}
              bg={designSystem.colors.status.warning}
              color="#000"
              px={designSystem.spacing[2]}
            >
              {tutorial.tier} Tier
            </Badge>
          )}
        </Box>
        
        {/* Content */}
        <VStack spacing={designSystem.spacing[3]} align="stretch" p={designSystem.spacing[4]}>
          <CustomText 
            size="md" 
            color={isLocked ? "muted" : "brand"} 
            fontWeight={designSystem.typography.weights.bold}
            noOfLines={2}
          >
            {tutorial.title}
          </CustomText>
          
          <CustomText 
            size="sm" 
            color={isLocked ? "muted" : "secondary"}
            noOfLines={2}
          >
            {tutorial.description}
          </CustomText>
          
          {/* Tags */}
          <HStack flexWrap="wrap">
            {tutorial.tags.map((tag, index) => (
              <Badge 
                key={index} 
                bg={isLocked ? designSystem.colors.backgrounds.surface : designSystem.colors.backgrounds.elevated}
                color={isLocked ? "muted" : "secondary"}
              >
                {tag}
              </Badge>
            ))}
          </HStack>
          
          {/* Actions */}
          <HStack justify="space-between">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPreview(tutorial)}
            >
              {isLocked ? "Preview" : "Details"}
            </Button>
            
            <Button
              bg={isLocked ? designSystem.colors.status.warning : designSystem.colors.brand.primary}
              color={designSystem.colors.text.inverse}
              size="sm"
              onClick={isLocked ? null : () => onWatch(tutorial)}
              disabled={isLocked}
              opacity={isLocked ? 0.7 : 1}
              _hover={isLocked ? {} : { bg: designSystem.colors.interactive.hover }}
            >
              {isLocked ? "Unlock" : "Watch Now"}
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </Card>
  );
};

// Main Content Library Component
export const ContentLibrary = ({
  accessibleContent,
  currentTier,
  onToolPreview,
  onToolDownload,
  onTutorialPreview,
  onTutorialWatch,
  onUpgradeTier
}) => {
  const [activeTab, setActiveTab] = useState(0);
  
  return (
    <VStack spacing={designSystem.spacing[6]} align="stretch">
      {/* Header with tier info */}
      <HStack 
        justify="space-between" 
        bg={designSystem.colors.backgrounds.secondary}
        p={designSystem.spacing[4]}
        borderRadius={designSystem.radii.md}
        border="1px solid"
        borderColor={designSystem.colors.borders.default}
        flexWrap={{ base: "wrap", md: "nowrap" }}
        spacing={designSystem.spacing[4]}
      >
        <VStack align="start" spacing={1}>
          <CustomText size="lg" color="brand" fontWeight={designSystem.typography.weights.bold}>
            Content Library
          </CustomText>
          <CustomText size="sm" color="muted">
            Access tools, tutorials and resources
          </CustomText>
        </VStack>
        
        <HStack spacing={designSystem.spacing[4]}>
          {currentTier ? (
            <HStack 
              bg={`${currentTier.color}22`}
              p={designSystem.spacing[2]}
              px={designSystem.spacing[4]}
              borderRadius={designSystem.radii.md}
              border="1px solid"
              borderColor={currentTier.color}
            >
              <Box fontSize="xl">{currentTier.icon}</Box>
              <VStack spacing={0} align="start">
                <CustomText 
                  size="sm" 
                  color={currentTier.color} 
                  fontWeight={designSystem.typography.weights.bold}
                >
                  {currentTier.name} Tier
                </CustomText>
                <CustomText size="xs" color="muted">
                  Valid for 30 days
                </CustomText>
              </VStack>
            </HStack>
          ) : (
            <Button
              onClick={onUpgradeTier}
              variant="primary"
              size="sm"
            >
              Upgrade to Unlock
            </Button>
          )}
        </HStack>
      </HStack>
      
      {/* Content tabs */}
      <Tabs 
        variant="soft-rounded" 
        colorScheme="blue" 
        index={activeTab} 
        onChange={setActiveTab}
      >
        <TabList>
          <Tab>Tools Library</Tab>
          <Tab>Tutorials</Tab>
        </TabList>
        
        <TabPanels mt={designSystem.spacing[4]}>
          {/* Tools Panel */}
          <TabPanel p={0}>
            <VStack spacing={designSystem.spacing[4]} align="stretch">
              {/* Filter options would go here */}
              
              {/* Tools grid */}
              <Grid 
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)"
                }}
                gap={designSystem.spacing[4]}
              >
                {accessibleContent.tools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isLocked={false}
                    onPreview={onToolPreview}
                    onDownload={onToolDownload}
                  />
                ))}
                
                {/* Locked tools */}
                {accessibleContent.lockedTools && accessibleContent.lockedTools.map((tool) => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    isLocked={true}
                    onPreview={onToolPreview}
                    onDownload={onToolDownload}
                  />
                ))}
                
                {/* Empty state */}
                {accessibleContent.tools.length === 0 && !accessibleContent.lockedTools && (
                  <Box 
                    gridColumn={{ md: "1 / -1" }}
                    p={designSystem.spacing[8]}
                    textAlign="center"
                    bg={designSystem.colors.backgrounds.surface}
                    borderRadius={designSystem.radii.md}
                  >
                    <CustomText color="muted">
                      No tools available in the library yet.
                    </CustomText>
                  </Box>
                )}
              </Grid>
            </VStack>
          </TabPanel>
          
          {/* Tutorials Panel */}
          <TabPanel p={0}>
            <VStack spacing={designSystem.spacing[4]} align="stretch">
              {/* Filter options would go here */}
              
              {/* Tutorials grid */}
              <Grid 
                templateColumns={{
                  base: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)"
                }}
                gap={designSystem.spacing[4]}
              >
                {accessibleContent.tutorials.map((tutorial) => (
                  <TutorialCard
                    key={tutorial.id}
                    tutorial={tutorial}
                    isLocked={false}
                    onPreview={onTutorialPreview}
                    onWatch={onTutorialWatch}
                  />
                ))}
                
                {/* Locked tutorials */}
                {accessibleContent.lockedTutorials && accessibleContent.lockedTutorials.map((tutorial) => (
                  <TutorialCard
                    key={tutorial.id}
                    tutorial={tutorial}
                    isLocked={true}
                    onPreview={onTutorialPreview}
                    onWatch={onTutorialWatch}
                  />
                ))}
                
                {/* Empty state */}
                {accessibleContent.tutorials.length === 0 && !accessibleContent.lockedTutorials && (
                  <Box 
                    gridColumn={{ md: "1 / -1" }}
                    p={designSystem.spacing[8]}
                    textAlign="center"
                    bg={designSystem.colors.backgrounds.surface}
                    borderRadius={designSystem.radii.md}
                  >
                    <CustomText color="muted">
                      No tutorials available yet.
                    </CustomText>
                  </Box>
                )}
              </Grid>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};