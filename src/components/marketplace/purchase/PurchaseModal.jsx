import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Box,
  Image,
  Badge,
  Button,
  Select,
  Input,
  Checkbox,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  useToast
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useDigitalAssets } from '../../../hooks/useDigitalAssets';
import { useProgressionSystem } from '../../../hooks/useProgressionSystem';
import { useThemeTokens } from '../../../theme/hooks/useThemeTokens';
import { CustomText } from '../../../design/components/Typography';
import { Card } from '../../../design/components/Card';

const MotionBox = motion(Box);

export const PurchaseModal = ({ 
  isOpen, 
  onClose, 
  asset,
  onPurchaseSuccess 
}) => {
  const { getColor, getSpacing, getBorderRadius } = useThemeTokens();
  const { purchaseAsset } = useDigitalAssets();
  const { user } = useProgressionSystem();
  const toast = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [email, setEmail] = useState('');
  const [savePayment, setSavePayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to purchase this asset.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email for the receipt.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing (in real app, integrate with Stripe)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTransactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const result = await purchaseAsset(asset.id, mockTransactionId, asset.price);
      
      if (result.success) {
        toast({
          title: "Purchase Successful! 🎉",
          description: `You've successfully purchased "${asset.title}". Check your email for the receipt.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        
        if (result.xpAwarded > 0) {
          toast({
            title: `+${result.xpAwarded} XP Earned!`,
            description: "XP awarded for supporting creators",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
        }
        
        if (onPurchaseSuccess) {
          onPurchaseSuccess(result);
        }
        
        onClose();
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "There was an error processing your purchase. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!asset) return null;
  
  const isFree = asset.price === 0;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bg="rgba(0,0,0,0.8)" backdropFilter="blur(4px)" />
      <ModalContent
        bg={getColor('backgrounds.elevated')}
        color={getColor('text.primary')}
        border={`1px solid ${getColor('borders.default')}`}
        borderRadius={getBorderRadius('lg')}
        overflow="hidden"
      >
        <ModalHeader
          bg={getColor('backgrounds.secondary')}
          borderBottom={`1px solid ${getColor('borders.default')}`}
          p={getSpacing(6)}
        >
          <CustomText size="xl" fontWeight="bold" color="brand">
            {isFree ? '📥 Download Asset' : '🛒 Purchase Asset'}
          </CustomText>
        </ModalHeader>
        
        <ModalCloseButton color={getColor('text.muted')} />
        
        <ModalBody p={getSpacing(6)}>
          <VStack spacing={getSpacing(6)} align="stretch">
            {/* Asset Preview */}
            <Card variant="default" p={getSpacing(4)}>
              <HStack spacing={getSpacing(4)}>
                <Box
                  w="100px"
                  h="80px"
                  borderRadius={getBorderRadius('md')}
                  overflow="hidden"
                  flexShrink={0}
                  bg={getColor('backgrounds.surface')}
                >
                  {asset.thumbnail_url ? (
                    <Image
                      src={asset.thumbnail_url}
                      alt={asset.title}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      fallback={
                        <Box
                          w="100%"
                          h="100%"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          bg={getColor('backgrounds.secondary')}
                          color={getColor('text.muted')}
                          fontSize="2xl"
                        >
                          📦
                        </Box>
                      }
                    />
                  ) : (
                    <Box
                      w="100%"
                      h="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      bg={getColor('backgrounds.secondary')}
                      color={getColor('text.muted')}
                      fontSize="2xl"
                    >
                      📦
                    </Box>
                  )}
                </Box>
                
                <VStack align="start" spacing={getSpacing(2)} flex={1}>
                  <CustomText size="lg" fontWeight="bold" color="brand">
                    {asset.title}
                  </CustomText>
                  <CustomText size="sm" color="secondary" noOfLines={2}>
                    {asset.description}
                  </CustomText>
                  <HStack spacing={getSpacing(2)}>
                    <Badge
                      bg={getColor('brand.primary')}
                      color={getColor('text.inverse')}
                      px={getSpacing(2)}
                      py={getSpacing(1)}
                      borderRadius={getBorderRadius('sm')}
                    >
                      {asset.asset_type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {asset.file_size_mb && (
                      <Badge
                        bg={getColor('backgrounds.surface')}
                        color={getColor('text.secondary')}
                        px={getSpacing(2)}
                        py={getSpacing(1)}
                        borderRadius={getBorderRadius('sm')}
                      >
                        {asset.file_size_mb}MB
                      </Badge>
                    )}
                  </HStack>
                </VStack>
                
                <VStack align="end" spacing={getSpacing(1)}>
                  <CustomText 
                    size="2xl" 
                    color={isFree ? "success" : "accent"} 
                    fontWeight="bold"
                  >
                    {isFree ? 'FREE' : `$${asset.price}`}
                  </CustomText>
                  <HStack fontSize="xs" color={getColor('text.muted')}>
                    <Box>⭐ {asset.rating?.toFixed(1) || '0.0'}</Box>
                    <Box>📥 {asset.downloads_count || 0}</Box>
                  </HStack>
                </VStack>
              </HStack>
            </Card>
            
            {/* Purchase Details */}
            {!isFree && (
              <VStack spacing={getSpacing(4)} align="stretch">
                <CustomText size="md" fontWeight="bold" color="secondary">
                  💳 Payment Details
                </CustomText>
                
                <VStack spacing={getSpacing(3)} align="stretch">
                  <Box>
                    <CustomText size="sm" color="muted" mb={getSpacing(1)}>
                      Payment Method
                    </CustomText>
                    <Select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      bg={getColor('backgrounds.surface')}
                      border={`1px solid ${getColor('borders.default')}`}
                      _hover={{ borderColor: getColor('brand.primary') }}
                      _focus={{ borderColor: getColor('brand.primary') }}
                    >
                      <option value="card">💳 Credit/Debit Card</option>
                      <option value="paypal">🟦 PayPal</option>
                      <option value="apple">🍎 Apple Pay</option>
                      <option value="google">🅖 Google Pay</option>
                    </Select>
                  </Box>
                  
                  <Box>
                    <CustomText size="sm" color="muted" mb={getSpacing(1)}>
                      Email for Receipt
                    </CustomText>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      bg={getColor('backgrounds.surface')}
                      border={`1px solid ${getColor('borders.default')}`}
                      _hover={{ borderColor: getColor('brand.primary') }}
                      _focus={{ borderColor: getColor('brand.primary') }}
                    />
                  </Box>
                  
                  <Checkbox
                    isChecked={savePayment}
                    onChange={(e) => setSavePayment(e.target.checked)}
                    colorScheme="green"
                  >
                    <CustomText size="sm" color="secondary">
                      Save payment method for future purchases
                    </CustomText>
                  </Checkbox>
                </VStack>
              </VStack>
            )}
            
            {/* Download Information */}
            <VStack spacing={getSpacing(4)} align="stretch">
              <CustomText size="md" fontWeight="bold" color="secondary">
                📦 What You'll Get
              </CustomText>
              
              <VStack align="start" spacing={getSpacing(2)} fontSize="sm" color={getColor('text.secondary')}>
                <HStack>
                  <Box color={getColor('brand.primary')}>✓</Box>
                  <CustomText>Instant download access after {isFree ? 'signup' : 'payment'}</CustomText>
                </HStack>
                <HStack>
                  <Box color={getColor('brand.primary')}>✓</Box>
                  <CustomText>Lifetime access to downloaded files</CustomText>
                </HStack>
                <HStack>
                  <Box color={getColor('brand.primary')}>✓</Box>
                  <CustomText>Email receipt with download links</CustomText>
                </HStack>
                {!isFree && (
                  <HStack>
                    <Box color={getColor('brand.primary')}>✓</Box>
                    <CustomText>30-day money back guarantee</CustomText>
                  </HStack>
                )}
                <HStack>
                  <Box color={getColor('brand.primary')}>✓</Box>
                  <CustomText>Support the creator and platform</CustomText>
                </HStack>
              </VStack>
            </VStack>
            
            {/* Terms Notice */}
            <Alert status="info" borderRadius={getBorderRadius('md')} size="sm">
              <AlertIcon />
              <VStack align="start" spacing={getSpacing(1)} flex={1}>
                <AlertTitle fontSize="sm">License & Usage</AlertTitle>
                <AlertDescription fontSize="sm">
                  By {isFree ? 'downloading' : 'purchasing'} this asset, you agree to our terms of service. 
                  Assets are for your personal and commercial use according to the standard license.
                </AlertDescription>
              </VStack>
            </Alert>
          </VStack>
        </ModalBody>
        
        <ModalFooter
          bg={getColor('backgrounds.secondary')}
          borderTop={`1px solid ${getColor('borders.default')}`}
          p={getSpacing(6)}
        >
          <HStack spacing={getSpacing(3)} w="100%">
            <Button
              variant="outline"
              onClick={onClose}
              flex={1}
              isDisabled={isProcessing}
            >
              Cancel
            </Button>
            
            <Button
              bg={isFree ? getColor('status.success') : getColor('brand.primary')}
              color={getColor('text.inverse')}
              onClick={handlePurchase}
              isLoading={isProcessing}
              loadingText={isFree ? "Downloading..." : "Processing..."}
              flex={2}
              size="lg"
              _hover={{
                bg: isFree ? getColor('status.success') : getColor('interactive.hover'),
                transform: 'translateY(-1px)'
              }}
            >
              {isFree ? '📥 Download Free Asset' : `💳 Purchase for $${asset.price}`}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};