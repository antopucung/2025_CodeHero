import React from 'react';
import { Box, Flex, Heading, Button, Spacer, HStack } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/quiz-gallery', label: 'Quiz Gallery' },
    { to: '/typing-challenge', label: 'Typing Challenge' },
    { to: '/code-editor', label: 'Code Editor' },
    { to: '/hybrid-mode', label: 'Hybrid Mode' },
    { to: '/community', label: 'Community' },
    { to: '/marketplace', label: 'Marketplace' },
    { to: '/profile', label: 'Profile' }
  ];

  return (
    <Box bg="white" boxShadow="sm" px={4} py={3}>
      <Flex alignItems="center" maxW="container.xl" mx="auto">
        <Heading as="h1" size="lg" color="blue.600">
          CodeQuiz Engine
        </Heading>
        
        <Spacer />
        
        <HStack spacing={4}>
          {navLinks.map((link) => (
            <Button
              key={link.to}
              as={RouterLink}
              to={link.to}
              variant={location.pathname === link.to ? "solid" : "ghost"}
              colorScheme="blue"
              size="sm"
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