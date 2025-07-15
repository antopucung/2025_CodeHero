import React, { useRef, useState, useEffect } from 'react';
import { Box, HStack, VStack, Button, Badge, Tooltip, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Editor } from "@monaco-editor/react";
import { executeCode } from "../../api";
import { CustomText } from '../../design/components/Typography';

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
  title = "Unity C# Example",
  readOnly = false,
  onExecutionComplete = null
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
    }, 500);
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
        const lineContent = model.getLineContent(line);
        
        // Find matching annotation
        const matchingAnnotation = annotations.find(a => {
          // Check for exact text match
          if (a.text === word) return true;
          
          // Check if text is in the line
          if (a.line === line - 1 && lineContent.includes(a.text)) return true;
          
          return false;
        });
        
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
    setOutput(null); // Clear previous output
    
    try {
      const sourceCode = editorRef.current.getValue();
      
      // Extract using statements from sourceCode
      const usingRegex = /using\s+[\w\.]+\s*;/g;
      const usingStatements = sourceCode.match(usingRegex) || [];
      const sourceCodeWithoutUsing = sourceCode.replace(usingRegex, '').trim();
      
      // Combine all using statements at the top
      const allUsingStatements = [
        "using System;",
        "using System.Collections;",
        "using System.Collections.Generic;",
        ...usingStatements
      ].filter((statement, index, array) => array.indexOf(statement) === index).join('\n');
      
      // Wrap the user code in a simulation environment that mimics Unity
      const wrappedCode = `
${allUsingStatements}

// Unity simulation environment
namespace UnityEngine
{
    public static class Debug
    {
        public static void Log(object message)
        {
            Console.WriteLine($"[Unity Debug]: {message}");
        }
    }

    public class Vector3
    {
        public float x, y, z;
        
        public Vector3(float x = 0, float y = 0, float z = 0)
        {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        
        public static Vector3 up => new Vector3(0, 1, 0);
        public static Vector3 right => new Vector3(1, 0, 0);
        public static Vector3 forward => new Vector3(0, 0, 1);
        
        public override string ToString()
        {
            return $"({x}, {y}, {z})";
        }
    }
    
    public class Transform
    {
        private Vector3 _position = new Vector3();
        private Vector3 _rotation = new Vector3();
        private Vector3 _scale = new Vector3(1, 1, 1);
        
        public Vector3 position
        {
            get { return _position; }
            set { _position = value; Console.WriteLine($"[Unity Transform]: Position set to {value}"); }
        }
        
        public void Translate(Vector3 translation)
        {
            _position.x += translation.x;
            _position.y += translation.y;
            _position.z += translation.z;
            Console.WriteLine($"[Unity Transform]: Translated to {_position}");
        }
    }
    
    public class GameObject
    {
        public string name;
        public Transform transform = new Transform();
        
        public GameObject(string name = "GameObject")
        {
            this.name = name;
            Console.WriteLine($"[Unity]: Created GameObject '{name}'");
        }
        
        public T GetComponent<T>() where T : new()
        {
            Console.WriteLine($"[Unity]: Getting component of type {typeof(T).Name}");
            return new T();
        }
    }
    
    public class MonoBehaviour
    {
        public GameObject gameObject = new GameObject();
        public Transform transform => gameObject.transform;
    }
    
    public static class Time
    {
        public static float deltaTime = 0.016f; // ~60fps
    }
    
    public static class Input
    {
        public static bool GetKeyDown(KeyCode key)
        {
            Console.WriteLine($"[Unity Input]: Simulating key press: {key}");
            return true;
        }
    }
    
    public enum KeyCode
    {
        Space,
        W,
        A,
        S,
        D
    }
}

${sourceCodeWithoutUsing}

// Test execution
public class UnitySimulation
{
    public static void Main()
    {
        Console.WriteLine("[Unity Simulation Started]");
        
        try {
            // Create an instance of the player controller
            PlayerController player = null;
            try {
                player = new PlayerController();
                Console.WriteLine("[Unity]: PlayerController instance created successfully");
            }
            catch (Exception e) {
                Console.WriteLine($"[Unity Error]: Failed to create PlayerController: {e.Message}");
                return;
            }
            
            // Call Start() to initialize
            try {
                Console.WriteLine("[Unity]: Calling Start() method...");
                player.Start();
            }
            catch (Exception e) {
                Console.WriteLine($"[Unity Error]: Exception in Start() method: {e.Message}");
            }
            
            // Simulate a few frames of Update()
            Console.WriteLine("[Unity]: Simulating frames...");
            for (int frame = 1; frame <= 3; frame++) {
                Console.WriteLine($"[Unity]: Frame {frame}");
                try {
                    player.Update();
                }
                catch (Exception e) {
                    Console.WriteLine($"[Unity Error]: Exception in Update() method: {e.Message}");
                }
            }
            
            Console.WriteLine("[Unity Simulation Completed]");
        }
        catch (Exception e) {
            Console.WriteLine($"[Unity Error]: {e.Message}\\n{e.StackTrace}");
        }
    }
}`;
      
      // Execute the wrapped code
      const { run: result } = await executeCode("csharp", wrappedCode);
      
      // Check if there was a compilation error
      const hasCompilationError = result.stderr || 
                                result.output.includes("error CS") ||
                                result.output.includes("error BC");
      
      // Check if there was any Unity-specific output
      const hasUnityOutput = result.output.includes("[Unity Debug]") || 
                            result.output.includes("[Unity Simulation");
      
      // Format the output for better readability
      let formattedOutput = result.output;
      
      // If there's an error but the execution claims success, we need to fix that
      const isActuallySuccessful = !hasCompilationError && hasUnityOutput;
      
      // Format the output
      if (!hasCompilationError) {
        try {
          // Add colors and formatting to Unity-specific outputs
          formattedOutput = formattedOutput
            .replace(/\[Unity Debug\]:/g, '🟢 [Unity Debug]:')
            .replace(/\[Unity Simulation Started\]/g, '🚀 [Unity Simulation Started]')
            .replace(/\[Unity Simulation Completed\]/g, '✅ [Unity Simulation Completed]')
            .replace(/\[Unity\]:/g, '🔵 [Unity]:')
            .replace(/\[Unity Transform\]:/g, '🟣 [Unity Transform]:')
            .replace(/\[Unity Input\]:/g, '🟠 [Unity Input]:')
            .replace(/\[Unity Error\]:/g, '🔴 [Unity Error]:');
        } catch (e) {
          console.error("Error formatting output:", e);
        }
      }
      
      if (hasCompilationError) {
        setOutput({
          text: formattedOutput,
          hasError: true,
          isSuccessful: false
        });
      } else if (!hasUnityOutput) {
        // Compiled but didn't produce Unity output
        setOutput({
          text: formattedOutput + "\n\nCode compiled successfully, but didn't produce any Unity-related output.",
          hasError: false,
          isSuccessful: false
        });
      } else {
        setOutput({
          text: formattedOutput,
          hasError: false,
          isSuccessful: hasUnityOutput
        });
      }
      
      // Call the completion handler if provided
      if (onExecutionComplete && isActuallySuccessful) {
        onExecutionComplete({
          success: isActuallySuccessful,
          output: formattedOutput,
          code: sourceCode
        });
      }
    } catch (error) {
      setOutput({
        text: `Error executing code: ${error.message}`,
        hasError: true,
        isSuccessful: false
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
  
  // Handle annotation click
  const handleAnnotationClick = (annotation) => {
    setActiveAnnotation(annotation);
  };
  
  return (
    <Box 
      bg="#111"
      border="1px solid #333"
      borderRadius="md"
      overflow="hidden" 
      width="100%"
      maxWidth="100%"
    >
      {/* Header */}
      <HStack 
        bg="#111" 
        p={3} 
        borderBottom="1px solid #333"
        justify="space-between"
      >
        <HStack spacing={2}>
          <CustomText color="#00ff00" fontWeight="bold" fontSize="sm">
            {title}
          </CustomText>
          <Badge bg="#222" color="#4ecdc4">C#</Badge>
          <Badge bg="#222" color="#ff6b6b">UNITY</Badge>
        </HStack>
        
        <HStack spacing={2}>
          <Button
            size="sm"
            variant="outline"
            colorScheme="gray"
            onClick={resetCode}
            isDisabled={isExecuting}
          >
            Reset
          </Button>
          <Button
            size="sm"
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
      <Flex 
        direction="row" 
        h="100%" 
        w="100%" 
        overflow="hidden"
      >
        {/* Code Editor Panel */}
        <Box
          w="50%"
          borderRight="1px solid #333"
          minW="0"
          maxW="50%" 
          overflow="hidden"
        >
          <Box h="400px">
            <Editor
              height="100%"
              defaultLanguage="csharp"
              defaultValue={initialCode}
              theme="vs-dark"
              onChange={(value) => setCode(value)}
              onMount={handleEditorDidMount}
              options={{
                readOnly: readOnly,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                tabSize: 4,
                automaticLayout: true,
                wordWrap: 'on'
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
              <CustomText fontSize="xs" color="#666" mb={2}>Hover on code or click keywords:</CustomText>
              <Flex flexWrap="wrap" gap={2}>
                {annotations.map((annotation, idx) => (
                  <Tooltip
                    key={idx}
                    label={annotation.explanation}
                    bg="#111"
                    color="#00ff00"
                    hasArrow
                  >
                    <Badge 
                      bg="#222"
                      color="#4ecdc4"
                      cursor="help"
                      onClick={() => handleAnnotationClick(annotation)}
                      _hover={{ bg: "#333" }}
                    >
                      {annotation.title}
                    </Badge>
                  </Tooltip>
                ))}
              </Flex>
            </Box>
          )}
        </Box>
        
        {/* Preview Panel */}
        <Box
          w="50%"
          minW="0"
          maxW="50%"
          overflow="hidden"
        >
          {/* Preview Header */}
          <Box
            p={2}
            bg="#111"
            borderBottom="1px solid #333"
          >
            <CustomText fontSize="xs" color="#666">Unity C# Output:</CustomText>
          </Box>
          
          {/* Output/Preview Area */}
          <Box  
            p={4} 
            bg="#000" 
            h="400px"
            overflowY="auto"
            overflowX="auto"
            whiteSpace="pre" 
            fontFamily="monospace"
          >
            {!output ? (
              <VStack spacing={4} justify="center" height="100%" py={10}>
                <MotionBox
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <CustomText fontSize="md" color="#666" textAlign="center">
                    🎮 Press "Run" to execute the code
                  </CustomText>
                </MotionBox>
                <CustomText fontSize="xs" color="#444" textAlign="center">
                  Preview will show Unity simulation results
                </CustomText>
              </VStack>
            ) : (
              <Box
                fontSize="sm"
                color={output.hasError ? "#ff4444" : "#00ff00"}
              >
                {output.text}
                
                {/* Show execution status at the bottom */}
                {output.isSuccessful && (
                  <Box mt={4} textAlign="right">
                    <Badge bg="#043300" color="#00ff00" fontSize="xs" p={1}>
                      Execution Successful
                    </Badge>
                  </Box>
                )}
                
                {!output.hasError && !output.isSuccessful && (
                  <Box mt={4} textAlign="right">
                    <Badge bg="#332200" color="#ffcc00" fontSize="xs" p={1}>
                      Code Compiled (No Unity Output)
                    </Badge>
                  </Box>
                )}
                
                {/* Show error note if compilation failed */}
                {output.hasError && (
                  <VStack spacing={2} mt={4} align="start">
                    <Box color="#ff6b6b" fontSize="sm" fontWeight="bold">
                      Compilation failed. Please fix the errors above.
                    </Box>
                    <Box color="#ff9999" fontSize="xs" mt={2}>
                      ⚠️ Common issues:
                      <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                        <li>Make sure all 'using' statements are at the top of your code</li>
                        <li>Ensure your class is named 'PlayerController' and inherits from 'MonoBehaviour'</li>
                        <li>Check for missing curly braces or semicolons</li>
                      </ul>
                    </Box>
                  </VStack>
                )}

                {/* Success explanation */}
                {output.isSuccessful && (
                  <Box mt={4} color="#00ff00" fontSize="xs">
                    ✅ Your code successfully executed with Unity simulation.
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Flex>
      
      {/* Active Annotation Highlight */}
      {false && activeAnnotation && (
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
            <CustomText color="#00ff00" fontWeight="bold" fontSize="sm">
              {activeAnnotation.title}
            </CustomText>
            <Button 
              size="xs" 
              onClick={() => setActiveAnnotation(null)}
              variant="ghost"
            >
              ✕
            </Button>
          </HStack>
          <CustomText color="#ccc" fontSize="sm">
            {activeAnnotation.explanation}
          </CustomText>
        </MotionBox>
      )}
    </Box>
  );
};

export default UnityCodeEditor;