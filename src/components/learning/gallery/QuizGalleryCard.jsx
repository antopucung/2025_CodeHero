import React from 'react';
import { Box, VStack, HStack, Text, Badge } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { designSystem } from '../../../design/system/DesignSystem';

const MotionBox = motion(Box);

const QuizGalleryCard = ({ quiz, onClick }) => {
  const getDifficultyColor = (difficulty) => {
    return {
      easy: designSystem.colors.status.success,
      medium: designSystem.colors.status.warning,
      hard: designSystem.colors.status.error
    }[difficulty] || designSystem.colors.status.info;
  };

  return (
    <MotionBox
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => !quiz.comingSoon && onClick()}
      bg="#111"
      border="1px solid #333"
      borderRadius="md"
      overflow="hidden"
      cursor={quiz.comingSoon ? "default" : "pointer"}
      position="relative"
      opacity={quiz.comingSoon ? 0.7 : 1}
    >
      {/* Card Header with Icon and Difficulty */}
      <Box 
        bg={quiz.color} 
        p={4} 
        position="relative"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="3xl" lineHeight="1">
          {quiz.icon}
        </Text>
        
        <Badge 
          bg={getDifficultyColor(quiz.difficulty)} 
          color="#fff"
          fontSize="xs"
          textTransform="uppercase"
        >
          {quiz.difficulty}
        </Badge>
      </Box>
      
      {/* Card Content */}
      <VStack p={4} align="start" spacing={3}>
        <Text fontSize="xl" fontWeight="bold" color={quiz.color}>
          {quiz.title}
        </Text>
        
        <Text fontSize="sm" color="#ccc">
          {quiz.description}
        </Text>
        
        <HStack>
          {quiz.comingSoon ? (
            <Badge bg="#333" color="#ccc">Coming Soon</Badge>
          ) : (
            <Badge bg={quiz.color} color="#000">Try It</Badge>
          )}
        </HStack>
      </VStack>
      
      {/* Coming Soon Overlay */}
      {quiz.comingSoon && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="rgba(0,0,0,0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Badge bg="#111" color="#ccc" p={2} fontSize="md">
            Coming Soon
          </Badge>
        </Box>
      )}
    </MotionBox>
  );
};

export default QuizGalleryCard;