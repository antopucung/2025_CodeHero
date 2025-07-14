import { Box, Text, HStack, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import CodeEditor from "./components/CodeEditor";

const MotionBox = motion(Box);

function App() {
  return (
    <Box 
      minH="100vh" 
      maxH="100vh"
      bg="#000000" 
      color="#00ff00" 
      fontFamily="'Courier New', monospace"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      {/* Compact Terminal Header */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        borderBottom="1px solid #333" 
        px={4} 
        py={2}
        flexShrink={0}
        bg="linear-gradient(90deg, #000 0%, #111 50%, #000 100%)"
      >
        <HStack justify="space-between" align="center">
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
              >
                <Text fontSize="lg" color="#00ff00" fontWeight="bold">
                  ⚡ Terminal IDE
                </Text>
              </MotionBox>
              <Text fontSize="xs" color="#666" mt={1}>
                v2.0.0 - Ultimate Typing Experience
              </Text>
            </HStack>
          </VStack>
          
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
      
      {/* Main Content - Flex container that fills remaining space */}
      <Box 
        flex={1} 
        overflow="hidden"
        position="relative"
      >
        <CodeEditor />
      </Box>
    </Box>
  );
}

export default App;