import React, { useState } from 'react';
import { Box, VStack, Button, Text, HStack, Badge, Image } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const DinoRunQuizShowcase = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box>
      <VStack spacing={6} p={6} bg="#111" borderRadius="md" border="1px solid #333">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
        >
          <Text fontSize="2xl" fontWeight="bold" color="#a374db" mb={2}>
            🦖 Dino Run Quiz
          </Text>
          <Badge colorScheme="purple" mb={4}>Coming Soon</Badge>
          <Text color="#ccc" mb={4}>
            Jump to collect correct answers while avoiding obstacles in this endless runner style quiz game.
          </Text>
        </MotionBox>
        
        <Box 
          bg="#000"
          borderRadius="md"
          overflow="hidden"
          w="100%"
          h={expanded ? "400px" : "200px"}
          position="relative"
        >
          <MotionBox
            animate={{ 
              backgroundPositionX: [0, -1000],
            }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            style={{
              position: "absolute",
              width: "200%",
              height: "100%",
              backgroundImage: "linear-gradient(to right, #111 0%, #111 49%, #222 50%, #222 100%)",
              backgroundSize: "200px 100%"
            }}
          />
          
          <MotionBox
            animate={{ 
              y: [0, -30, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              times: [0, 0.4, 1],
              repeatDelay: 1
            }}
            style={{
              position: "absolute",
              bottom: "20%",
              left: "20%",
              width: "50px",
              height: "50px",
              backgroundColor: "#a374db",
              borderRadius: "4px"
            }}
          >
            <Text fontSize="2xl" position="absolute" top="0" left="0" right="0" bottom="0" textAlign="center" lineHeight="50px">
              🦖
            </Text>
          </MotionBox>
          
          <MotionBox
            initial={{ right: "-100px" }}
            animate={{ right: ["120%", "-100px"] }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            style={{
              position: "absolute",
              bottom: "20%",
              width: "80px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#ff6b6b",
              borderRadius: "4px"
            }}
          >
            <Text color="#000" fontWeight="bold" fontSize="xs">WRONG!</Text>
          </MotionBox>
          
          <MotionBox
            initial={{ right: "-200px" }}
            animate={{ right: ["120%", "-200px"] }}
            transition={{ repeat: Infinity, duration: 7, delay: 1.5, ease: "linear" }}
            style={{
              position: "absolute",
              bottom: "20%",
              width: "80px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#00ff00",
              borderRadius: "4px"
            }}
          >
            <Text color="#000" fontWeight="bold" fontSize="xs">CORRECT!</Text>
          </MotionBox>
          
          <Box
            position="absolute"
            bottom="18%"
            left="0"
            right="0"
            height="2px"
            bg="#333"
          />
          
          <Box
            position="absolute"
            top="10%"
            left="0"
            right="0"
            textAlign="center"
          >
            <Text color="#ccc">Question: What is 2 + 2?</Text>
          </Box>
          
          <Box
            position="absolute"
            top={10}
            right={10}
            bg="#111"
            px={2}
            py={1}
            borderRadius="md"
          >
            <HStack spacing={2}>
              <Text fontSize="xs" color="#666">SCORE:</Text>
              <Text fontSize="xs" color="#ffd93d" fontWeight="bold">120</Text>
            </HStack>
          </Box>
        </Box>
        
        <HStack spacing={4}>
          <Button
            bg={expanded ? "#666" : "#a374db"}
            color="#000"
            onClick={() => setExpanded(!expanded)}
            _hover={{ bg: expanded ? "#777" : "#b485ec" }}
          >
            {expanded ? "Collapse Preview" : "Expand Preview"}
          </Button>
        </HStack>
        
        <Box mt={2}>
          <HStack spacing={3}>
            <Badge bg="#333" color="#ccc">Endless Runner</Badge>
            <Badge bg="#333" color="#ccc">Gamified</Badge>
            <Badge bg="#333" color="#ccc">Coming Soon</Badge>
          </HStack>
        </Box>
        
        <Box 
          bg="#222"
          p={4}
          borderRadius="md"
          w="100%"
        >
          <Text fontSize="sm" color="#ccc">
            <span style={{ color: "#a374db", fontWeight: "bold" }}>Features:</span>
            <br />
            • Jump to collect correct answers
            <br />
            • Avoid incorrect answers
            <br />
            • Score based on correct answers and distance
            <br />
            • Progressive difficulty as score increases
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default DinoRunQuizShowcase;