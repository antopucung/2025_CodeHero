import React from 'react';
import { Box, HStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from 'react-router-dom';
import { Text, Heading } from '../design/components/Typography';
import { NavigationButton } from '../design/components/Button';
import { designSystem } from '../design/system/DesignSystem';

const MotionBox = motion(Box);

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'HOME', icon: '🏠' },
    { path: '/marketplace', label: 'MARKETPLACE', icon: '🛒' },
    { path: '/community', label: 'COMMUNITY', icon: '🎨' },
    { path: '/profile', label: 'PROFILE', icon: '👤' }
  ];

  return (
    <Box
      w="100%"
      h="60px"
      borderBottom={`1px solid ${designSystem.colors.borders.default}`}
      px={designSystem.spacing[4]}
      bg={`linear-gradient(90deg, ${designSystem.colors.backgrounds.primary} 0%, ${designSystem.colors.backgrounds.secondary} 50%, ${designSystem.colors.backgrounds.primary} 100%)`}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      overflow="hidden"
      flexShrink={0}
    >
      {/* Brand - Compact */}
      <HStack spacing={designSystem.spacing[3]} flexShrink={0}>
        <MotionBox
          animate={{ 
            textShadow: [
              `0 0 5px ${designSystem.colors.brand.primary}`,
              `0 0 15px ${designSystem.colors.brand.primary}`,
              `0 0 5px ${designSystem.colors.brand.primary}`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          cursor="pointer"
          onClick={() => navigate('/')}
        >
          <Heading level={1} size="lg" color="brand">
            ⚡ Terminal IDE
          </Heading>
        </MotionBox>
        <Text size="xs" color="muted">
          v2.0.0
        </Text>
      </HStack>
      
      {/* Navigation - Responsive */}
      <HStack spacing={designSystem.spacing[1]} flex={1} justify="center" maxW="400px">
        {navigationItems.map((item) => (
          <Box
            key={item.path}
            flex={1}
          >
            <NavigationButton
              icon={item.icon}
              label={item.label}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          </Box>
        ))}
      </HStack>
      
      {/* Status - Compact */}
      <HStack spacing={designSystem.spacing[2]} flexShrink={0}>
        <MotionBox
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Text size="xs" color="brand">
            ● ONLINE
          </Text>
        </MotionBox>
      </HStack>
    </Box>
  );
};

export default Header;