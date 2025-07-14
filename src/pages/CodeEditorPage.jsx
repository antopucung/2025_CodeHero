import React, { useRef, useState } from "react";
import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import LanguageSelector from "../components/LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "../components/Output";
import GameStats from "../components/GameStats";
import { useGameProgress } from "../hooks/useGameProgress";

const MotionBox = motion(Box);

const CodeEditorPage = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const { progress, completeChallenge } = useGameProgress();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const handleCodeExecution = (executionStats) => {
    if (executionStats && !executionStats.error) {
      completeChallenge({
        wpm: 0,
        accuracy: 100,
        errors: 0,
        timeElapsed: 0
      }, language);
    }
  };

  return (
    <Box h="100%" display="flex" flexDirection="column" overflow="hidden">
      {/* Page Header */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        bg="#111"
        borderBottom="1px solid #333"
        p={4}
        flexShrink={0}
      >
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={0}>
            <Text fontSize="xl" color="#00ff00" fontWeight="bold">
              ⌨️ Code Editor
            </Text>
            <Text fontSize="sm" color="#666">
              Professional IDE with multi-language support
            </Text>
          </VStack>
          
          <Box w="300px">
            <GameStats 
              progress={progress} 
              compact={true}
            />
          </Box>
        </HStack>
      </MotionBox>

      {/* Main Editor Layout */}
      <Box flex={1} overflow="hidden">
        <HStack h="100%" spacing={0}>
          {/* Code Editor Panel */}
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            flex={1}
            bg="#111" 
            borderRight="1px solid #333"
            display="flex"
            flexDirection="column"
            overflow="hidden"
          >
            {/* Editor Header */}
            <Box 
              p={4} 
              borderBottom="1px solid #333" 
              flexShrink={0}
              bg="linear-gradient(90deg, #111 0%, #222 50%, #111 100%)"
            >
              <Text fontSize="sm" color="#666" mb={3} fontFamily="'Courier New', monospace">
                │ CODE EDITOR - WRITE & EXECUTE
              </Text>
              <LanguageSelector language={language} onSelect={onSelect} />
            </Box>
            
            {/* Monaco Editor */}
            <Box flex={1} overflow="hidden">
              <Editor
                options={{
                  minimap: { enabled: true },
                  fontSize: 16,
                  fontFamily: "'Courier New', 'Monaco', monospace",
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: true,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                  wordWrap: "off",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  theme: "vs-dark",
                  scrollbar: {
                    vertical: 'auto',
                    horizontal: 'auto'
                  },
                  bracketPairColorization: {
                    enabled: true
                  },
                  guides: {
                    indentation: true,
                    bracketPairs: true
                  }
                }}
                height="100%"
                language={language}
                defaultValue={CODE_SNIPPETS[language]}
                onMount={onMount}
                value={value}
                onChange={(value) => setValue(value)}
              />
            </Box>
          </MotionBox>
          
          {/* Output Panel */}
          <MotionBox
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            w="500px"
            overflow="hidden"
            flexShrink={0}
          >
            <Output 
              editorRef={editorRef} 
              language={language}
              onExecutionComplete={handleCodeExecution}
              fullHeight={true}
            />
          </MotionBox>
        </HStack>
      </Box>
    </Box>
  );
};

export default CodeEditorPage;