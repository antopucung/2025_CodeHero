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
    { path: '/editor', label: 'CODE EDITOR', icon: '⌨️' },
    { path: '/typing', label: 'TYPING CHALLENGE', icon: '🎯' },
    { path: '/hybrid', label: 'HYBRID MODE', icon: '🚀' }
  ];

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      borderBottom="1px solid #333" 
      px={4} 
      py={3}
      flexShrink={0}
      bg="linear-gradient(90deg, #000 0%, #111 50%, #000 100%)"
    >
      <HStack justify="space-between" align="center">
        {/* Brand */}
        <VStack spacing={0} align="start">
          <HStack spacing={3}>
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
              <Text fontSize="xl" color="#00ff00" fontWeight="bold">
                ⚡ Terminal IDE
              </Text>
            </MotionBox>
            <Text fontSize="xs" color="#666" mt={1}>
              v2.0.0 - Ultimate Typing Experience
            </Text>
          </HStack>
        </VStack>
        
        {/* Navigation */}
        <HStack spacing={2}>
          {navigationItems.map((item) => (
            <MotionBox
              key={item.path}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                bg={location.pathname === item.path ? "#003300" : "#000"}
                color={location.pathname === item.path ? "#00ff00" : "#666"}
                border="1px solid"
                borderColor={location.pathname === item.path ? "#00ff00" : "#333"}
                borderRadius="0"
                fontFamily="'Courier New', monospace"
                fontSize="xs"
                px={3}
                py={2}
                h="auto"
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
        
        {/* Status */}
        <HStack spacing={4}>
          <Text fontSize="xs" color="#666">
            🎯 Gamified Coding Environment
          </Text>
          <MotionBox
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Text fontSize="xs" color="#00ff00">
              ● ONLINE
            </Text>
          </MotionBox>
        </HStack>
      </HStack>
    </MotionBox>
  );
};

export default Header;