import React, { useRef, useState } from "react";
import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import LanguageSelector from "../components/LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "../components/Output";
import GameStats from "../components/GameStats";
import { useProgressionSystem } from "../hooks/useProgressionSystem";

const MotionBox = motion(Box);

const CodeEditorPage = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const { profile, completeCodeExecution } = useProgressionSystem();

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const handleCodeExecution = async (executionStats) => {
    if (executionStats && !executionStats.error) {
      try {
        const result = await completeCodeExecution(language, {
          timeToExecute: 1,
          attempts: 1,
          linesOfCode: value?.split('\n').length || 1,
          codeHash: btoa(value || '')
        });
        
        if (result?.levelUp) {
          console.log(`Level up! New level: ${result.newLevel}`);
        }
      } catch (error) {
        console.error('Error awarding code execution XP:', error);
      }
    }
  };

  return (
    <Box w="100%" h="100%" display="flex" flexDirection="column" overflow="hidden">
      {/* Page Header - Fixed Height */}
      <MotionBox
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        bg="#111"
        borderBottom="1px solid #333"
        p={3}
        h="80px"
        flexShrink={0}
        overflow="hidden"
      >
        <HStack justify="space-between" align="center" h="100%">
          <VStack align="start" spacing={0}>
           <Text fontSize="lg" color="#00ff00" fontWeight="bold">
              ⌨️ Code Editor
           </Text>
           <Text fontSize="xs" color="#666">
              Professional IDE with execution
           </Text>
          </VStack>
          
          <Box w={{ base: "200px", md: "250px" }} h="100%">
            <GameStats 
              progress={profile || { level: 1, bestWpm: 0, bestAccuracy: 0, totalChallengesCompleted: 0, achievements: [] }} 
              compact={true}
            />
          </Box>
        </HStack>
      </MotionBox>

      {/* Main Editor Layout - Dynamic Height */}
      <Box flex={1} overflow="hidden">
        <HStack h="100%" spacing={0}>
          {/* Code Editor Panel */}
          <MotionBox
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            flex={1}
            bg="#111" 
            borderRight="1px solid #333"
            display="flex"
            flexDirection="column"
            overflow="hidden"
          >
            {/* Editor Header - Fixed Height */}
            <Box 
              p={3} 
              borderBottom="1px solid #333" 
              h="80px"
              flexShrink={0}
              bg="linear-gradient(90deg, #111 0%, #222 50%, #111 100%)"
              overflow="hidden"
            >
              <Text fontSize="xs" color="#666" mb={2} fontFamily="'Courier New', monospace">
                │ CODE EDITOR
              </Text>
              <LanguageSelector language={language} onSelect={onSelect} />
            </Box>
            
            {/* Monaco Editor - Dynamic Height */}
            <Box flex={1} overflow="hidden">
              <Editor
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
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
          
          {/* Output Panel - Fixed Width */}
          <MotionBox
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            w={{ base: "300px", md: "400px" }}
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