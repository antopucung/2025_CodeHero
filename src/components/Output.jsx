import { useState } from "react";
import { Box, Button, Text as ChakraText, useToast } from "@chakra-ui/react";
import { executeCode } from "../api";

const Output = ({ editorRef, language, onExecutionComplete, fullHeight = false }) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
      
      // Notify parent component about execution
      if (onExecutionComplete) {
        onExecutionComplete({
          success: !result.stderr,
          output: result.output,
          error: result.stderr
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      w="100%" 
      h={fullHeight ? "100%" : "auto"}
      bg="#111" 
      border="1px solid #333" 
      p={3}
      display="flex"
      flexDirection="column"
    >
      <ChakraText fontSize="xs" color="#666" mb={2} fontFamily="'Courier New', monospace">
        │ TERMINAL OUTPUT
      </ChakraText>
      <Button
        bg="#000"
        color="#00ff00"
        border="1px solid #00ff00"
        borderRadius="0"
        fontFamily="'Courier New', monospace"
        fontSize="sm"
        _hover={{ bg: "#003300", color: "#00ff41" }}
        _active={{ bg: "#001100" }}
        mb={4}
        flexShrink={0}
        isLoading={isLoading}
        onClick={runCode}
      >
        {isLoading ? "EXECUTING..." : "$ ./run"}
      </Button>
      <Box
        flex={fullHeight ? 1 : "none"}
        height={fullHeight ? "auto" : "60vh"}
        p={3}
        bg="#000"
        color={isError ? "#ff4444" : "#00ff00"}
        border="1px solid"
        borderRadius="0"
        borderColor={isError ? "#ff4444" : "#333"}
        fontFamily="'Courier New', monospace"
        fontSize="sm"
        overflowY="auto"
      >
        <ChakraText color="#666" fontSize="xs" mb={2}>
          arnab@terminal-ide:~$ {language} execution
        </ChakraText>
        {output
          ? output.map((line, i) => (
              <ChakraText key={i} fontFamily="'Courier New', monospace" fontSize="sm">
                {line || " "}
              </ChakraText>
            ))
          : (
              <ChakraText color="#666" fontSize="sm">
                Waiting for execution... Type your code and run $ ./run
              </ChakraText>
            )}
        {output && (
          <ChakraText color="#666" fontSize="xs" mt={2}>
            [Process completed - Exit code: {isError ? "1" : "0"}]
          </ChakraText>
        )}
      </Box>
    </Box>
  );
};
export default Output;
