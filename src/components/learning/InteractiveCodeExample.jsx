import React, { useState, useRef, useEffect } from 'react';
import { Box, VStack, HStack, Button, Tooltip, Badge, Flex, useDisclosure } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import { executeCode } from '../../api';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CustomText } from '../../design/components/Typography';

const MotionBox = motion(Box);

// This component provides interactive annotations for code segments
const CodeAnnotation = ({ children, title, explanation, language = 'csharp' }) => {
  return (
    <Tooltip
      hasArrow
      label={
        <VStack spacing={2} p={2} align="start">
          <CustomText fontWeight="bold" fontSize="sm">{title}</CustomText>
          <CustomText fontSize="xs">{explanation}</CustomText>
        </VStack>
      }
      bg="#111"
      color="#00ff00"
      borderColor="#00ff00"
      borderWidth="1px"
      borderRadius="md"
      placement="top"
      openDelay={300}
      gutter={8}
    >
      <Badge 
        bg="rgba(0, 255, 0, 0.2)" 
        color="#00ff00" 
        cursor="help" 
        _hover={{ bg: "rgba(0, 255, 0, 0.3)" }}
      >
        {children}
      </Badge>
    </Tooltip>
  );
};

// Interactive code segment that reacts to hovering
const InteractiveCodeSegment = ({ code, annotations, language = 'csharp' }) => {
  // Prepare code with annotations
  let annotatedCode = code;
  
  // Function to safely escape special characters in regex
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  
  // Convert code to JSX with annotation elements
  const renderAnnotatedCode = () => {
    // Start with the original code
    let segments = [{ text: code, isAnnotation: false }];
    
    // For each annotation, split existing segments as needed
    annotations.forEach(annotation => {
      const newSegments = [];
      
      for (const segment of segments) {
        if (segment.isAnnotation) {
          newSegments.push(segment); // Keep existing annotations
          continue;
        }
        
        const regex = new RegExp(escapeRegExp(annotation.text), 'g');
        const parts = segment.text.split(regex);
        
        if (parts.length === 1) {
          newSegments.push(segment); // No match in this segment
          continue;
        }
        
        // Rebuild with annotation segments
        for (let i = 0; i < parts.length; i++) {
          if (parts[i]) {
            newSegments.push({ text: parts[i], isAnnotation: false });
          }
          
          // Add the annotation segment (except after the last part)
          if (i < parts.length - 1) {
            newSegments.push({
              text: annotation.text,
              isAnnotation: true,
              title: annotation.title,
              explanation: annotation.explanation
            });
          }
        }
      }
      
      segments = newSegments;
    });
    
    // Convert segments to JSX
    return (
      <CustomText as="div" whiteSpace="pre-wrap" fontFamily="monospace" fontSize="sm">
        {segments.map((segment, index) => 
          segment.isAnnotation ? (
            <CodeAnnotation
              key={index}
              title={segment.title}
              explanation={segment.explanation}
              language={language}
            >
              {segment.text}
            </CodeAnnotation>
          ) : (
            <Box as="span" key={index}>{segment.text}</Box>
          )
        )}
      </CustomText>
    );
  };
  
  return (
    <Box
      bg="#000"
      border="1px solid #444"
      borderRadius="4px"
      p={4}
      w="100%"
      position="relative"
      _hover={{ 
        borderColor: "#00ff00",
        boxShadow: "0 0 10px rgba(0, 255, 0, 0.3)"
      }}
      transition="all 0.3s ease"
    >
      {renderAnnotatedCode()}
      <Box 
        position="absolute" 
        top={2} 
        right={2} 
        fontSize="xs" 
        color="#666"
        bg="#111"
        px={2}
        py={1}
        borderRadius="md"
      >
        {language.toUpperCase()}
      </Box>
    </Box>
  );
};

// Full interactive code playground with editor and execution
const CodePlayground = ({ initialCode, language = 'csharp', annotations = [], readOnly = false }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const editorRef = useRef(null);
  
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };
  
  const runCode = async () => {
    if (!editorRef.current) return;
    
    setIsLoading(true);
    try {
      const sourceCode = editorRef.current.getValue();
      const { run: result } = await executeCode(language, sourceCode);
      
      setOutput({
        text: result.output,
        error: result.stderr ? true : false
      });
    } catch (error) {
      setOutput({
        text: `Error: ${error.message || 'Unknown error'}`,
        error: true
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetCode = () => {
    if (editorRef.current) {
      editorRef.current.setValue(initialCode);
    }
    setOutput(null);
  };
  
  return (
    <Box
      bg="#111"
      border="1px solid #333"
      borderRadius="md"
      p={4}
      w="100%"
    >
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <CustomText color="#00ff00" fontWeight="bold" fontSize="sm">
            ▶️ Interactive Code Playground
          </CustomText>
          <HStack spacing={2}>
            <Button 
              size="sm" 
              colorScheme="green" 
              variant="outline"
              onClick={resetCode}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button 
              size="sm" 
              colorScheme="green"
              onClick={runCode}
              isLoading={isLoading}
              loadingText="Running..."
              disabled={isLoading || !editorRef.current}
            >
              Run Code
            </Button>
          </HStack>
        </HStack>
        
        <Box 
          border="1px solid #444" 
          borderRadius="md" 
          height="300px"
          _hover={{ 
            borderColor: "#00ff00",
            boxShadow: "0 0 10px rgba(0, 255, 0, 0.2)"
          }}
        >
          <Editor
            height="100%"
            defaultLanguage={language === 'csharp' ? 'csharp' : language}
            defaultValue={initialCode}
            theme="vs-dark"
            options={{
              readOnly: readOnly,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              tabSize: 4,
              automaticLayout: true
            }}
            onMount={handleEditorDidMount}
          />
        </Box>
        
        {output && (
          <MotionBox
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            bg="#000"
            border={`1px solid ${output.error ? "#ff4444" : "#00aa00"}`}
            borderRadius="md"
            p={3}
          >
            <CustomText fontSize="xs" color="#666" mb={1}>Output:</CustomText>
            <CustomText 
              color={output.error ? "#ff4444" : "#00ff00"} 
              fontSize="sm"
              whiteSpace="pre-wrap"
              fontFamily="monospace"
            >
              {output.text}
            </CustomText>
          </MotionBox>
        )}
        
        {/* Concept Hints */}
        <Box borderTop="1px solid #333" pt={3}>
          <CustomText fontSize="xs" color="#666" mb={2}>✨ Concepts Used</CustomText>
          <Flex flexWrap="wrap" gap={2}>
            {annotations.map((annotation, index) => (
              <Tooltip 
                key={index}
                hasArrow
                label={annotation.explanation}
                bg="#111"
                color="#00ff00"
                placement="top"
              >
                <Badge 
                  colorScheme="green" 
                  variant="subtle"
                  cursor="help"
                >
                  {annotation.title}
                </Badge>
              </Tooltip>
            ))}
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
};

// Main component that provides different modes of code display
const InteractiveCodeExample = ({
  code,
  language = 'csharp',
  annotations = [],
  mode = 'annotated', // 'annotated', 'playground', or 'readonly'
  title = 'Code Example'
}) => {
  if (mode === 'playground') {
    return (
      <CodePlayground 
        initialCode={code} 
        language={language} 
        annotations={annotations}
        readOnly={false}
      />
    );
  }
  
  if (mode === 'readonly') {
    return (
      <CodePlayground 
        initialCode={code} 
        language={language}
        annotations={annotations}
        readOnly={true}
      />
    );
  }
  
  // Default: annotated
  return (
    <Box 
      bg="#111"
      border="1px solid #333"
      borderRadius="md"
      p={4}
      w="100%"
    >
      <CustomText color="#00ff00" fontWeight="bold" fontSize="sm" mb={3}>
        📝 {title}
      </CustomText>
      <InteractiveCodeSegment 
        code={code}
        annotations={annotations}
        language={language}
      />
      {annotations.length > 0 && (
        <CustomText fontSize="xs" color="#666" mt={2} textAlign="center">
          Hover over highlighted text for explanations
        </CustomText>
      )}
    </Box>
  );
};

export { InteractiveCodeExample, CodePlayground, InteractiveCodeSegment };