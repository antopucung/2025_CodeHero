import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import CodeEditor from "./components/CodeEditor";

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
      {/* Compact Header */}
      <Box 
        borderBottom="1px solid #333" 
        px={4} 
        py={2}
        flexShrink={0}
      >
        <HStack justify="space-between" align="center">
          <VStack spacing={0} align="start">
            <Text fontSize="sm" color="#00ff00" fontWeight="bold">
              Terminal IDE v1.0.0
            </Text>
            <Text fontSize="xs" color="#666">
              Multi-language typing challenge environment
            </Text>
          </VStack>
          <Text fontSize="xs" color="#666">
            arnab@terminal-ide:~$
          </Text>
        </HStack>
      </Box>
      
      {/* Main Content Area */}
      <Box flex={1} overflow="hidden">
        <CodeEditor />
      </Box>
    </Box>
  );
}

export default App;
