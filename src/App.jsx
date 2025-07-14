import { Box, Center, Text } from "@chakra-ui/react";
import CodeEditor from "./components/CodeEditor";

function App() {
  return (
    <Box minH="100vh" bg="#000000" color="#00ff00" px={4} py={2} fontFamily="'Courier New', monospace">
      <Box borderBottom="1px solid #333" pb={2} mb={4}>
        <Text fontSize="sm" color="#666" mb={1}>
          ┌─[arnab@terminal-ide]─[~]
        </Text>
        <Text fontSize="lg" color="#00ff00" fontWeight="bold" fontFamily="'Courier New', monospace">
          └─$ ./arnab-ide --interactive
        </Text>
        <Text fontSize="xs" color="#888" mt={1}>
          Terminal IDE v1.0.0 - Multi-language code execution environment
        </Text>
      </Box>
      <CodeEditor />
    </Box>
  );
}

export default App;
