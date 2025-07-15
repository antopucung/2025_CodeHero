import React from 'react';
import { Box, Flex, Text, HStack, Button, Spacer } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

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
              as={RouterLink}
              to={link.to}
              variant={location.pathname === link.to ? "solid" : "ghost"}
              colorScheme="green"
              size="sm"
              bg={location.pathname === link.to ? "#003300" : "transparent"}
              color={location.pathname === link.to ? "#00ff00" : "#ccc"}
              _hover={{ color: "#00ff00", bg: "#112211" }}
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