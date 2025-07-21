import React from 'react';
import { Box, Flex, Text, HStack, Button, Spacer } from '@chakra-ui/react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  // Enhanced navigation handler with detailed logging
  const handleNavigation = (to) => {
    console.log('=== HEADER NAVIGATION DEBUG ===');
    console.log('Current location.pathname:', location.pathname);
    console.log('Target navigation path:', to);
    console.log('Navigate function available:', typeof navigate);
    console.log('Button clicked at:', new Date().toISOString());
    
    try {
      navigate(to);
      console.log('Navigate function called successfully');
      
      // Check if navigation actually happened (delayed check)
      setTimeout(() => {
        console.log('After navigation - Current pathname:', window.location.pathname);
        console.log('React Router location:', location.pathname);
      }, 100);
    } catch (error) {
      console.error('Navigation error:', error);
    }
    
    console.log('=== END NAVIGATION DEBUG ===');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/community', label: 'Community' },
    { to: '/profile', label: 'Profile' }
  ];

  return (
    <Box bg="#000000" borderBottom="1px solid #333" px={4} py={3}>
      <Flex alignItems="center" maxW="container.xl" mx="auto">
        <Text fontSize="xl" fontWeight="bold" color="#00ff00">
          Terminal IDE
        </Text>
        
        <Spacer />
        
        <HStack spacing={4}>
          {navLinks.map((link) => (
            <Button
              key={link.to}
              onClick={() => handleNavigation(link.to)}
              variant={location.pathname === link.to ? "solid" : "ghost"}
              colorScheme="green"
              size="sm"
              bg={location.pathname === link.to ? "#003300" : "transparent"}
              color={location.pathname === link.to ? "#00ff00" : "#ccc"}
              _hover={{ color: "#00ff00", bg: "#112211" }}
              cursor="pointer"
              _active={{ transform: "none" }}
            >
              {link.label}
            </Button>
          ))}
        </HStack>
      </Flex>
    </Box>
  );
}

export default Header;