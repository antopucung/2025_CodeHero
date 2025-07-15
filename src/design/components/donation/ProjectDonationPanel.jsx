import React, { useState } from 'react';
import { Box, VStack, HStack, Input, Textarea, Select, Grid, RadioGroup, Radio } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { designSystem } from '../../system/DesignSystem';
import { CustomText } from '../Typography';
import { Button } from '../Button';
import { DonationTierCard } from './DonationTierCard';

const MotionBox = motion(Box);

export const ProjectDonationPanel = ({
  project,
  donationTiers,
  userRewardStatus,
  onDonate,
  onCancel
}) => {
  const [selectedTier, setSelectedTier] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const handleDonate = () => {
    if (!selectedTier && !customAmount) return;
    
    const amount = selectedTier ? selectedTier.amount : Number(customAmount);
    
    if (amount <= 0) return;
    
    onDonate({
      projectId: project.id,
      amount,
      paymentMethod,
      email,
      message,
      isAnonymous
    });
  };
  
  // Determine recommended tier
  const getRecommendedTier = () => {
    if (!donationTiers || donationTiers.length === 0) return null;
    
    // Default to second tier if available
    return donationTiers.length >= 2 ? donationTiers[1] : donationTiers[0];
  };

  const recommendedTier = getRecommendedTier();
  
  return (
    <VStack 
      spacing={designSystem.spacing[6]} 
      align="stretch"
      maxW="900px" 
      mx="auto"
    >
      {/* Header */}
      <Box>
        <CustomText size="2xl" color="secondary" fontWeight={designSystem.typography.weights.bold}>
          Support {project.title}
        </CustomText>
        <CustomText size="md" color="muted">
          Choose a donation tier to unlock rewards and support the project
        </CustomText>
      </Box>
      
      {/* Donation tiers */}
      <Grid 
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
        gap={designSystem.spacing[4]}
        w="100%"
      >
        {donationTiers.map((tier) => (
          <DonationTierCard
            key={tier.id}
            tier={tier}
            isActive={userRewardStatus && userRewardStatus.some(r => r.tier.id === tier.id)}
            isRecommended={recommendedTier && recommendedTier.id === tier.id}
            onSelect={setSelectedTier}
            selectedTier={selectedTier}
          />
        ))}
      </Grid>
      
      {/* Custom amount */}
      <Box 
        bg={designSystem.colors.backgrounds.secondary}
        p={designSystem.spacing[4]}
        borderRadius={designSystem.radii.md}
        border="1px solid"
        borderColor={designSystem.colors.borders.default}
      >
        <CustomText size="md" fontWeight={designSystem.typography.weights.bold} color="secondary" mb={designSystem.spacing[2]}>
          Custom Donation
        </CustomText>
        
        <HStack spacing={designSystem.spacing[4]}>
          <Box flex={1}>
            <CustomText size="sm" color="muted" mb={designSystem.spacing[1]}>
              Custom Amount (USD)
            </CustomText>
            <Input
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedTier(null); // Deselect tier when custom amount is used
              }}
              placeholder="Enter amount"
              type="number"
              min="1"
              bg={designSystem.colors.backgrounds.surface}
              border={`1px solid ${designSystem.colors.borders.default}`}
              color={designSystem.colors.text.primary}
              _hover={{ borderColor: designSystem.colors.brand.primary }}
              _focus={{ borderColor: designSystem.colors.brand.primary }}
            />
          </Box>
          
          <Box flex={1}>
            <CustomText size="sm" color="muted" mb={designSystem.spacing[1]}>
              Payment Method
            </CustomText>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              bg={designSystem.colors.backgrounds.surface}
              border={`1px solid ${designSystem.colors.borders.default}`}
              color={designSystem.colors.text.primary}
              _hover={{ borderColor: designSystem.colors.brand.primary }}
              _focus={{ borderColor: designSystem.colors.brand.primary }}
            >
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="crypto">Cryptocurrency</option>
            </Select>
          </Box>
        </HStack>
        
        <Box mt={designSystem.spacing[4]}>
          <CustomText size="sm" color="muted" mb={designSystem.spacing[1]}>
            Email for Receipt (Optional)
          </CustomText>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            type="email"
            bg={designSystem.colors.backgrounds.surface}
            border={`1px solid ${designSystem.colors.borders.default}`}
            color={designSystem.colors.text.primary}
            _hover={{ borderColor: designSystem.colors.brand.primary }}
            _focus={{ borderColor: designSystem.colors.brand.primary }}
          />
        </Box>
        
        <Box mt={designSystem.spacing[4]}>
          <CustomText size="sm" color="muted" mb={designSystem.spacing[1]}>
            Message (Optional)
          </CustomText>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message of support..."
            bg={designSystem.colors.backgrounds.surface}
            border={`1px solid ${designSystem.colors.borders.default}`}
            color={designSystem.colors.text.primary}
            _hover={{ borderColor: designSystem.colors.brand.primary }}
            _focus={{ borderColor: designSystem.colors.brand.primary }}
            rows={3}
          />
        </Box>
        
        <HStack mt={designSystem.spacing[4]}>
          <RadioGroup onChange={(val) => setIsAnonymous(val === 'true')} value={isAnonymous.toString()}>
            <HStack spacing={designSystem.spacing[4]}>
              <Radio value="false">
                <CustomText size="sm" color="secondary">Show my name</CustomText>
              </Radio>
              <Radio value="true">
                <CustomText size="sm" color="secondary">Donate anonymously</CustomText>
              </Radio>
            </HStack>
          </RadioGroup>
        </HStack>
      </Box>
      
      {/* Action buttons */}
      <HStack justify="flex-end" spacing={designSystem.spacing[3]}>
        <Button 
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          bg="#FFD700"
          color="#000"
          disabled={(!selectedTier && !customAmount) || (customAmount && Number(customAmount) <= 0)}
          onClick={handleDonate}
        >
          Donate ${selectedTier ? selectedTier.amount : customAmount || 0}
        </Button>
      </HStack>
      
      {/* Donation benefits */}
      <Box 
        bg={designSystem.colors.backgrounds.secondary}
        p={designSystem.spacing[4]}
        borderRadius={designSystem.radii.md}
        border="1px solid"
        borderColor={designSystem.colors.borders.default}
        mt={designSystem.spacing[2]}
      >
        <CustomText size="md" fontWeight={designSystem.typography.weights.bold} color="secondary" mb={designSystem.spacing[2]}>
          Donation Benefits
        </CustomText>
        <Grid 
          templateColumns={{ base: "1fr", md: "1fr 1fr" }}
          gap={designSystem.spacing[3]}
        >
          <Box>
            <CustomText size="sm" fontWeight={designSystem.typography.weights.bold} color="accent" mb={designSystem.spacing[2]}>
              What You Get
            </CustomText>
            <VStack align="start" spacing={designSystem.spacing[2]}>
              <HStack align="start" spacing={designSystem.spacing[2]}>
                <Box color={designSystem.colors.brand.primary}>✓</Box>
                <CustomText size="sm" color="secondary">Access to premium content for 30 days</CustomText>
              </HStack>
              <HStack align="start" spacing={designSystem.spacing[2]}>
                <Box color={designSystem.colors.brand.primary}>✓</Box>
                <CustomText size="sm" color="secondary">Recognition on project page</CustomText>
              </HStack>
              <HStack align="start" spacing={designSystem.spacing[2]}>
                <Box color={designSystem.colors.brand.primary}>✓</Box>
                <CustomText size="sm" color="secondary">Exclusive community status</CustomText>
              </HStack>
              <HStack align="start" spacing={designSystem.spacing[2]}>
                <Box color={designSystem.colors.brand.primary}>✓</Box>
                <CustomText size="sm" color="secondary">Access to project updates</CustomText>
              </HStack>
            </VStack>
          </Box>
          <Box>
            <CustomText size="sm" fontWeight={designSystem.typography.weights.bold} color="accent" mb={designSystem.spacing[2]}>
              How It Helps
            </CustomText>
            <VStack align="start" spacing={designSystem.spacing[2]}>
              <HStack align="start" spacing={designSystem.spacing[2]}>
                <Box color={designSystem.colors.brand.secondary}>✓</Box>
                <CustomText size="sm" color="secondary">Supports creator's ongoing work</CustomText>
              </HStack>
              <HStack align="start" spacing={designSystem.spacing[2]}>
                <Box color={designSystem.colors.brand.secondary}>✓</Box>
                <CustomText size="sm" color="secondary">Funds new features and content</CustomText>
              </HStack>
              <HStack align="start" spacing={designSystem.spacing[2]}>
                <Box color={designSystem.colors.brand.secondary}>✓</Box>
                <CustomText size="sm" color="secondary">Enables community growth</CustomText>
              </HStack>
              <HStack align="start" spacing={designSystem.spacing[2]}>
                <Box color={designSystem.colors.brand.secondary}>✓</Box>
                <CustomText size="sm" color="secondary">Keeps resources freely available</CustomText>
              </HStack>
            </VStack>
          </Box>
        </Grid>
      </Box>
    </VStack>
  );
};