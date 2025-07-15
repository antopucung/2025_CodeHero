import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import { designSystem } from '../../design/system/DesignSystem';
import { ProjectDonationPanel } from '../../design/components/donation/ProjectDonationPanel';
import { useDonationSystem } from '../../hooks/useDonationSystem';

export const TieredDonationModal = ({ 
  isOpen, 
  onClose, 
  project,
  onDonationComplete
}) => {
  const { donationTiers, getUserDonationStats, processDonation } = useDonationSystem();
  const [userRewardStatus, setUserRewardStatus] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Fetch user's current reward status
  useEffect(() => {
    if (isOpen) {
      const userStats = getUserDonationStats();
      setUserRewardStatus(userStats.activeRewards);
    }
  }, [isOpen]);
  
  const handleDonate = async (donationData) => {
    try {
      setProcessing(true);
      
      // Process donation
      const result = await processDonation({
        projectId: project.id,
        amount: donationData.amount,
        paymentMethod: donationData.paymentMethod,
        message: donationData.message
      });
      
      if (result.success) {
        setSuccess(true);
        
        // Notify parent
        if (onDonationComplete) {
          onDonationComplete(result.donation);
        }
        
        // Close modal after a delay
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error processing donation:', error);
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={!processing ? onClose : undefined}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalOverlay bg="rgba(0,0,0,0.8)" />
      <ModalContent 
        bg={designSystem.colors.backgrounds.secondary} 
        color={designSystem.colors.text.primary}
        border={`1px solid ${designSystem.colors.borders.default}`}
      >
        <ModalHeader borderBottom={`1px solid ${designSystem.colors.borders.default}`}>
          {success ? "Donation Complete!" : "Support This Project"}
        </ModalHeader>
        <ModalCloseButton disabled={processing} />
        
        <ModalBody p={6}>
          {success ? (
            <div>
              <CustomText size="lg" color="success" fontWeight="bold" textAlign="center" mt={8}>
                🎉 Thank you for your support! 🎉
              </CustomText>
              <CustomText size="md" color="secondary" textAlign="center" mt={4}>
                Your donation has been processed successfully. You now have access to the rewards associated with your tier.
              </CustomText>
              <CustomText size="sm" color="muted" textAlign="center" mt={8}>
                The modal will close automatically in a few seconds...
              </CustomText>
            </div>
          ) : (
            <ProjectDonationPanel 
              project={project}
              donationTiers={donationTiers}
              userRewardStatus={userRewardStatus}
              onDonate={handleDonate}
              onCancel={onClose}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};