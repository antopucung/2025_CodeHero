import { useState, useRef } from "react";
import { Box, Text, VStack, HStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Editor } from "@monaco-editor/react";
import { executeCode } from "../api";
import TypingChallenge from "./TypingChallenge";
import { 
  GradientWaveBackground, 
  PulseAnimation
} from "./BlockLetterEffect";

const MotionBox = motion(Box);

const HybridMode = ({ challenge, language, onComplete, isActive = false, currentLevel }) => {
  const [phase, setPhase] = useState('typing'); // 'typing' or 'execution'
  const [typingStats, setTypingStats] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [typedCode, setTypedCode] = useState('');
  const editorRef = useRef();

  const handleTypingComplete = (stats) => {
    setTypingStats(stats);
    setTypedCode(challenge.code);
    setPhase('execution');
  };

  const executeTypedCode = async () => {
    if (!typedCode) return;
    
    try {
      setIsExecuting(true);
      const { run: result } = await executeCode(language, typedCode);
      
      const executionStats = {
        success: !result.stderr,
        output: result.output,
        error: result.stderr
      };
      
      setExecutionResult(executionStats);
      
      // Complete hybrid challenge
      if (onComplete) {
        onComplete(typingStats, executionStats);
      }
      
    } catch (error) {
      const executionStats = {
        success: false,
        output: '',
        error: error.message || 'Execution failed'
      };
      
      setExecutionResult(executionStats);
      
      if (onComplete) {
        onComplete(typingStats, executionStats);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const resetChallenge = () => {
    setPhase('typing');
    setTypingStats(null);
    setExecutionResult(null);
    setTypedCode('');
  };

  if (phase === 'typing') {
    return (
      <Box position="relative">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          bg="#111"
          border="1px solid #333"
          p={3}
          mb={3}
          position="relative"
          overflow="hidden"
        >
          <GradientWaveBackground isActive={true} intensity={0.3} combo={1} />
          
          <Text fontSize="xs" color="#666" mb={2} fontFamily="'Courier New', monospace">
            │ HYBRID MODE - PHASE 1: TYPING CHALLENGE
          </Text>
          
          <PulseAnimation isActive={true} color="#ffd93d" intensity={1}>
            <Text fontSize="sm" color="#ffd93d" fontWeight="bold" mb={2}>
              🎯 Type the code accurately to unlock execution phase!
            </Text>
          </PulseAnimation>
          
          <Text fontSize="xs" color="#888">
            Build combos and maintain accuracy. Once completed, you'll execute the code!
          </Text>
        </MotionBox>
        
        <TypingChallenge
          challenge={challenge}
          currentLevel={currentLevel}
          onComplete={handleTypingComplete}
          isActive={isActive}
        />
      </Box>
    );
  }

  return (
    <Box position="relative">
      {/* Phase 2 Header */}
      <MotionBox
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        bg="#111"
        border="1px solid #333"
        p={3}
        mb={3}
        position="relative"
        overflow="hidden"
      >
        <GradientWaveBackground isActive={true} intensity={0.5} combo={typingStats?.maxCombo || 1} />
        
        <Text fontSize="xs" color="#666" mb={2} fontFamily="'Courier New', monospace">
          │ HYBRID MODE - PHASE 2: CODE EXECUTION
        </Text>
        
        <HStack justify="space-between" mb={2}>
          <VStack align="start" spacing={0}>
            <PulseAnimation isActive={true} color="#00ff00" intensity={1.5}>
              <Text fontSize="sm" color="#00ff00" fontWeight="bold">
                ✅ TYPING COMPLETED!
              </Text>
            </PulseAnimation>
            <Text fontSize="xs" color="#666">
              WPM: {typingStats?.wpm} | Accuracy: {typingStats?.accuracy}% | Max Combo: x{typingStats?.maxCombo}
            </Text>
          </VStack>
          
          <Button
            bg="#000"
            color="#666"
            border="1px solid #333"
            borderRadius="0"
            fontFamily="'Courier New', monospace"
            fontSize="xs"
            _hover={{ 
              bg: "#111",
              borderColor: "#00ff00"
            }}
            onClick={resetChallenge}
          >
            🔄 RETRY TYPING
          </Button>
        </HStack>
        
        <PulseAnimation isActive={!executionResult} color="#ffff00" intensity={1}>
          <Text fontSize="sm" color="#ffff00" fontWeight="bold">
            🚀 Now execute your typed code to complete the challenge!
          </Text>
        </PulseAnimation>
      </MotionBox>

      {/* Code Display and Execution */}
      <HStack spacing={4}>
        {/* Code Editor Display */}
        <Box w="50%" bg="#111" border="1px solid #333" p={3}>
          <Text fontSize="xs" color="#666" mb={2} fontFamily="'Courier New', monospace">
            │ YOUR TYPED CODE
          </Text>
          
          <Box
            bg="#000"
            border="1px solid #333"
            p={2}
            mb={3}
            maxH="300px"
            overflowY="auto"
          >
            <Text 
              fontSize="sm" 
              color="#00ff00" 
              fontFamily="'Courier New', monospace"
              whiteSpace="pre-wrap"
            >
              {typedCode}
            </Text>
          </Box>
          
          <MotionBox
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              bg="#000"
              color="#00ff00"
              border="1px solid #00ff00"
              borderRadius="0"
              fontFamily="'Courier New', monospace"
              fontSize="sm"
              _hover={{ 
                bg: "#003300",
                boxShadow: "0 0 20px #00ff00"
              }}
              onClick={executeTypedCode}
              isLoading={isExecuting}
              loadingText="EXECUTING..."
              w="100%"
            >
              {isExecuting ? "EXECUTING..." : "$ ./execute-typed-code"}
            </Button>
          </MotionBox>
        </Box>

        {/* Execution Output */}
        <Box w="50%" bg="#111" border="1px solid #333" p={3}>
          <Text fontSize="xs" color="#666" mb={2} fontFamily="'Courier New', monospace">
            │ EXECUTION RESULTS
          </Text>
          
          <Box
            bg="#000"
            border="1px solid"
            borderColor={executionResult?.success === false ? "#ff4444" : "#333"}
            p={3}
            minH="200px"
            maxH="300px"
            overflowY="auto"
          >
            <Text color="#666" fontSize="xs" mb={2}>
              arnab@terminal-ide:~$ hybrid-mode execution
            </Text>
            
            {executionResult ? (
              <>
                {executionResult.output && (
                  <Text 
                    color={executionResult.success ? "#00ff00" : "#ff4444"}
                    fontFamily="'Courier New', monospace"
                    fontSize="sm"
                    whiteSpace="pre-wrap"
                    mb={2}
                  >
                    {executionResult.output}
                  </Text>
                )}
                
                {executionResult.error && (
                  <Text 
                    color="#ff4444"
                    fontFamily="'Courier New', monospace"
                    fontSize="sm"
                    whiteSpace="pre-wrap"
                    mb={2}
                  >
                    {executionResult.error}
                  </Text>
                )}
                
                <Text color="#666" fontSize="xs" mt={2}>
                  [Hybrid Challenge Completed - Exit code: {executionResult.success ? "0" : "1"}]
                </Text>
                
                {/* Success Summary */}
                {executionResult.success && (
                  <MotionBox
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      boxShadow: [
                        "0 0 10px #00ff00",
                        "0 0 20px #00ff00",
                        "0 0 10px #00ff00"
                      ]
                    }}
                    transition={{ 
                      boxShadow: { repeat: Infinity, duration: 2 }
                    }}
                    mt={3}
                    p={2}
                    bg="#003300"
                    border="1px solid #00ff00"
                  >
                    <PulseAnimation isActive={true} color="#00ff00" intensity={1.5}>
                      <Text color="#00ff00" fontWeight="bold" fontSize="sm" textAlign="center">
                        🎉 HYBRID CHALLENGE MASTERED! 🎉
                      </Text>
                    </PulseAnimation>
                    
                    <HStack justify="center" spacing={4} mt={2} fontSize="xs">
                      <Text color="#ffff00">Typing: {typingStats?.wpm} WPM</Text>
                      <Text color="#ffff00">Accuracy: {typingStats?.accuracy}%</Text>
                      <Text color="#ffff00">Execution: SUCCESS</Text>
                    </HStack>
                  </MotionBox>
                )}
              </>
            ) : (
              <Text color="#666" fontSize="sm">
                Waiting for code execution... Click the execute button above!
              </Text>
            )}
          </Box>
        </Box>
      </HStack>
    </Box>
  );
};

export default HybridMode;