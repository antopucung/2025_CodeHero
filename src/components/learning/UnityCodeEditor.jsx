import React, { useRef, useState, useEffect } from 'react';
import { Box, HStack, VStack, Text, Button, Badge, useDisclosure, Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Editor } from "@monaco-editor/react";
import { executeCode } from "../../api";

const MotionBox = motion(Box);

/**
 * UnityCodeEditor - An interactive code editor specifically for Unity C# examples
 * Features:
 * - Split panel with code editor and preview/output
 * - Auto-detection of C# language
 * - Interactive annotations and hover explanations
 * - Code execution with preview of results
 */
const UnityCodeEditor = ({ 
  initialCode, 
  annotations = [],
  defaultLanguage = "csharp",
  title = "Unity C# Code Example",
  readOnly = false,
  onExecutionComplete
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const editorRef = useRef(null);
  
  // Handle editor initialization
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    
    // Add custom markers for annotations
    setTimeout(() => {
      if (!readOnly && annotations.length > 0) {
        addAnnotationMarkers(editor, annotations);
      }
    }, 100);
  };
  
  // Add interactive markers for code annotations
  const addAnnotationMarkers = (editor, annotations) => {
    const monaco = window.monaco;
    if (!monaco) return;
    
    // Clear existing markers
    monaco.editor.setModelMarkers(editor.getModel(), 'annotations', []);
    
    // Add custom hover providers
    monaco.languages.registerHoverProvider('csharp', {
      provideHover: function(model, position) {
        const line = position.lineNumber;
        const column = position.column;
        const wordAtPosition = model.getWordAtPosition(position);
        
        if (!wordAtPosition) return null;
        
        const word = wordAtPosition.word;
        
        // Find matching annotation
        const matchingAnnotation = annotations.find(a => 
          a.text.includes(word) && 
          a.line === line - 1
        );
        
        if (matchingAnnotation) {
          return {
            contents: [
              { value: `**${matchingAnnotation.title}**` },
              { value: matchingAnnotation.explanation }
            ]
          };
        }
        
        return null;
      }
    });
  };
  
  // Execute the code and show results
  const runCode = async () => {
    if (!editorRef.current) return;
    
    setIsExecuting(true);
    try {
      const sourceCode = editorRef.current.getValue();
      
      // For Unity C#, we add some wrapper code to make it runnable in isolation
      // since Unity components rely on MonoBehaviour
      const wrappedCode = `using System;
using System.Collections.Generic;

namespace UnitySimulation {
  // Unity simulation environment
  public static class UnityEngine {
    public static class Debug {
      public static void Log(string message) {
        Console.WriteLine("[Unity Debug]: " + message);
      }
    }
    
    public class Vector3 {
      public float x, y, z;
      public static Vector3 up = new Vector3(0, 1, 0);
      public static Vector3 right = new Vector3(1, 0, 0);
      
      public Vector3(float x = 0, float y = 0, float z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
      }
    }
    
    public class MonoBehaviour {}
    
    public static class Time {
      public static float deltaTime = 0.016f; // ~60fps
    }
  }
  
  // User code starts here
  ${sourceCode}
  
  // Test execution code
  public class Program {
    public static void Main() {
      Console.WriteLine("[Unity Simulation Started]");
      // Instantiate player controller
      try {
        var player = new PlayerController();
        
        // Simulate Start method call
        try {
          player.Start();
        } catch (Exception e) {
          Console.WriteLine("Error in Start(): " + e.Message);
        }
        
        // Simulate a few Update calls
        Console.WriteLine("[Running Update frames...]");
        for (int i = 0; i < 3; i++) {
          try {
            Console.WriteLine("Frame " + (i+1));
            player.Update();
          } catch (Exception e) {
            Console.WriteLine("Error in Update(): " + e.Message);
          }
        }
        Console.WriteLine("[Unity Simulation Completed]");
      }
      catch (Exception e) {
        Console.WriteLine("Error: " + e.Message);
      }
    }
  }
}`;
      
      // Execute the wrapped code
      const { run: result } = await executeCode("csharp", wrappedCode);
      
      // Parse and format the output
      let formattedOutput = result.output;
      const hasError = result.stderr ? true : false;
      
      // Format Unity debug logs for better visibility
      if (!hasError) {
        try {
          formattedOutput = formattedOutput.replace(/\[Unity Debug\]:/g, '🎮 ');
          formattedOutput = formattedOutput.replace(/\[Unity Simulation Started\]/g, '🚀 Unity Simulation Started\n');
          formattedOutput = formattedOutput.replace(/\[Running Update frames\.\.\.\]/g, '\n⏱️ Running Update Frames...\n');
          formattedOutput = formattedOutput.replace(/\[Unity Simulation Completed\]/g, '\n✅ Unity Simulation Completed');
          
          // Check if we actually got any Unity debug output
          const hasUnityOutput = formattedOutput.includes('Unity Debug') || 
                                formattedOutput.includes('Unity Simulation Started');
          
          if (!hasUnityOutput && !result.stderr) {
            // No Unity-specific output and no errors means the code probably doesn't follow expected structure
            formattedOutput += '\n\n⚠️ Note: Your code compiled but didn\'t produce any Unity debug output. ' +
                              'Make sure your class is named "PlayerController" and inherits from MonoBehaviour.';
          }
        } catch (e) {
          console.error("Error formatting output:", e);
        }
      }
      
      setOutput({
        text: formattedOutput,
        hasError: hasError,
        stderr: result.stderr
      });
      
      // Callback if provided
      if (onExecutionComplete) {
        onExecutionComplete({
          success: !hasError,
          output: formattedOutput,
          code: sourceCode
        });
      }
    } catch (error) {
      setOutput({
        text: `Error executing code: ${error.message}`,
        hasError: true,
        stderr: error.message
      });
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Reset code to initial state
  const resetCode = () => {
    if (editorRef.current) {
      editorRef.current.setValue(initialCode);
    }
    setOutput(null);
  };
  
  // Handle annotation click - show explanation
  const handleAnnotationClick = (annotation) => {
    setActiveAnnotation(annotation);
  };
  
  return (
    <Box 
      bg="#111"
      border="1px solid #333"
      borderRadius="md"
      overflow="hidden"
    >
      {/* Header */}
      <HStack 
        bg="#000" 
        p={3} 
        borderBottom="1px solid #333"
        justify="space-between"
      >
        <HStack>
          <Text color="#00ff00" fontWeight="bold" fontSize="sm">
            {title}
          </Text>
          <Badge colorScheme="green">C#</Badge>
          <Badge colorScheme="purple">Unity</Badge>
        </HStack>
        
        <HStack>
          <Button
            size="xs"
            variant="outline"
            colorScheme="gray"
            onClick={resetCode}
            isDisabled={isExecuting}
          >
            Reset
          </Button>
          <Button
            size="xs"
            colorScheme="green"
            onClick={runCode}
            isLoading={isExecuting}
            loadingText="Running..."
            isDisabled={isExecuting}
          >
            ▶️ Run
          </Button>
        </HStack>
      </HStack>
      
      {/* Main Content: Editor + Preview Split */}
      <HStack spacing={0} align="stretch">
        {/* Code Editor Panel */}
        <Box
          width="50%" 
          borderRight="1px solid #333"
          position="relative"
        >
          <Box height="400px">
            <Editor
              height="100%"
              defaultLanguage={defaultLanguage}
              defaultValue={initialCode}
              theme="vs-dark"
              onChange={(value) => setCode(value)}
              onMount={handleEditorDidMount}
              options={{
                readOnly: readOnly,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                tabSize: 2,
                automaticLayout: true,
                wordWrap: 'on',
                padding: { top: 10 }
              }}
            />
          </Box>
          
          {/* Code Hints */}
          {annotations.length > 0 && (
            <Box 
              bg="#111"
              borderTop="1px solid #333"
              p={2}
            >
              <Text fontSize="xs" color="#666" mb={2}>Hover on code segments for explanations:</Text>
              <HStack flexWrap="wrap" spacing={1}>
                {annotations.map((annotation, idx) => (
                  <Tooltip
                    key={idx}
                    label={annotation.explanation}
                    bg="#111"
                    color="#00ff00"
                    hasArrow
                  >
                    <Badge 
                      colorScheme="green" 
                      variant="outline" 
                      cursor="help"
                      m={1}
                      onClick={() => handleAnnotationClick(annotation)}
                    >
                      {annotation.title}
                    </Badge>
                  </Tooltip>
                ))}
              </HStack>
            </Box>
          )}
        </Box>
        
        {/* Preview Panel */}
        <VStack
          width="50%" 
          spacing={0} 
          align="stretch"
        >
          {/* Preview Header */}
          <Box
            p={2}
            bg="#111"
            borderBottom="1px solid #333"
          >
            <Text fontSize="xs" color="#666">Unity Game Preview</Text>
          </Box>
          
          {/* Output/Preview Area */}
          <Box 
            p={4} 
            bg="#000"
            height="100%"
            overflow="auto"
          >
            {!output ? (
              <VStack spacing={4} justify="center" height="100%">
                <MotionBox
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <Text fontSize="md" color="#666" textAlign="center">
                    🎮 Press "Run" to execute the code
                  </Text>
                </MotionBox>
                <Text fontSize="xs" color="#444" textAlign="center">
                  Preview will show Unity simulation results
                </Text>
              </VStack>
            ) : (
              <VStack align="stretch" spacing={2}>
                <Text 
                  fontSize="xs" 
                  color="#666"
                  fontFamily="monospace"
                  mb={2}
                >
                  Unity C# Output:
                </Text>
                
                <Box
                  p={3}
                  bg="#111"
                  border={`1px solid ${output.hasError ? '#ff4444' : '#00ff00'}`}
                  borderRadius="md"
                  fontFamily="monospace"
                  fontSize="sm"
                  color={output.hasError ? "#ff4444" : "#00ff00"}
                  whiteSpace="pre-wrap"
                  overflowY="auto"
                  maxHeight="320px"
                >
                  {output.text}
                </Box>
                
                {/* Only show "Success" badge when there was no error and execution was successful */}
                {!output.hasError && !output.text.includes("error CS") && (
                  <HStack justify="flex-end">
                    <Badge colorScheme="green">
                      Execution Successful
                    </Badge>
                  </HStack>
                )}
              </VStack>
            )}
          </Box>
        </VStack>
      </HStack>
      
      {/* Active Annotation Highlight */}
      {activeAnnotation && (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          bg="#111"
          border="1px solid #00ff00"
          p={3}
          zIndex={10}
        >
          <HStack justify="space-between">
            <Text color="#00ff00" fontWeight="bold" fontSize="sm">
              {activeAnnotation.title}
            </Text>
            <Button 
              size="xs" 
              onClick={() => setActiveAnnotation(null)}
              variant="ghost"
            >
              ✕
            </Button>
          </HStack>
          <Text color="#ccc" fontSize="sm">
            {activeAnnotation.explanation}
          </Text>
        </MotionBox>
      )}
    </Box>
  );
};

export default UnityCodeEditor;