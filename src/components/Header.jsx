import React from 'react';
import { Box, Text, HStack, VStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from 'react-router-dom';

const MotionBox = motion(Box);

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: 'HOME', icon: '🏠' },
    { path: '/editor', label: 'EDITOR', icon: '⌨️' },
    { path: '/typing', label: 'TYPING', icon: '🎯' },
    { path: '/hybrid', label: 'HYBRID', icon: '🚀' }
  ];

  return (
    <Box
      w="100%"
      h="60px"
      borderBottom="1px solid #333" 
      px={4}
      bg="linear-gradient(90deg, #000 0%, #111 50%, #000 100%)"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      overflow="hidden"
      flexShrink={0}
    >
      {/* Brand - Compact */}
      <HStack spacing={3} flexShrink={0}>
        <MotionBox
          animate={{ 
            textShadow: [
              "0 0 5px #00ff00",
              "0 0 15px #00ff00", 
              "0 0 5px #00ff00"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          cursor="pointer"
          onClick={() => navigate('/')}
        >
          <Text fontSize="lg" color="#00ff00" fontWeight="bold">
            ⚡ Terminal IDE
          </Text>
        </MotionBox>
        <Text fontSize="xs" color="#666">
          v2.0.0
        </Text>
      </HStack>
      
      {/* Navigation - Responsive */}
      <HStack spacing={1} flex={1} justify="center" maxW="400px">
        {navigationItems.map((item) => (
          <MotionBox
            key={item.path}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            flex={1}
          >
            <Button
              bg={location.pathname === item.path ? "#003300" : "#000"}
              color={location.pathname === item.path ? "#00ff00" : "#666"}
              border="1px solid"
              borderColor={location.pathname === item.path ? "#00ff00" : "#333"}
              borderRadius="4px"
              fontFamily="'Courier New', monospace"
              fontSize="xs"
              px={2}
              py={1}
              h="40px"
              w="100%"
              _hover={{ 
                bg: location.pathname === item.path ? "#004400" : "#111",
                borderColor: "#00ff00",
                color: "#00ff00"
              }}
              onClick={() => navigate(item.path)}
            >
              <VStack spacing={0}>
                <Text fontSize="sm">{item.icon}</Text>
                <Text fontSize="xs" fontWeight="bold">
                  {item.label}
                </Text>
              </VStack>
            </Button>
          </MotionBox>
        ))}
      </HStack>
      
      {/* Status - Compact */}
      <HStack spacing={2} flexShrink={0}>
        <MotionBox
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Text fontSize="xs" color="#00ff00">
            ● ONLINE
          </Text>
        </MotionBox>
      </HStack>
    </Box>
  );
};

export default Header;