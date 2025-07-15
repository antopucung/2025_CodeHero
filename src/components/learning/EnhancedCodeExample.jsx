import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Tooltip, Badge, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MotionBox = motion(Box);

// Syntax highlighting colors based on Unity concepts
const UNITY_COLORS = {
  // Unity lifecycle methods
  lifecycle: { color: "#00ff00", bg: "rgba(0, 255, 0, 0.15)" },
  // Unity components and objects
  component: { color: "#ff6b6b", bg: "rgba(255, 107, 107, 0.15)" },
  // Unity vectors and transformations
  transform: { color: "#ffd93d", bg: "rgba(255, 217, 61, 0.15)" },
  // Unity input handling
  input: { color: "#4ecdc4", bg: "rgba(78, 205, 196, 0.15)" },
  // Unity physics
  physics: { color: "#a374db", bg: "rgba(163, 116, 219, 0.15)" },
  // Unity debugging
  debug: { color: "#ff9f43", bg: "rgba(255, 159, 67, 0.15)" },
  // Default highlighting
  default: { color: "#ccc", bg: "transparent" }
};

// Unity concept definitions for tooltips
const UNITY_CONCEPTS = {
  // MonoBehaviour lifecycle methods
  "void Start()": {
    type: "lifecycle",
    title: "Start Method",
    description: "Called once when the script is enabled, before any Update methods. Use for initialization."
  },
  "void Update()": {
    type: "lifecycle",
    title: "Update Method",
    description: "Called once per frame. This is where most gameplay code is placed."
  },
  "void Awake()": {
    type: "lifecycle",
    title: "Awake Method",
    description: "Called when the script instance is being loaded, before Start. Used for initialization."
  },
  "void FixedUpdate()": {
    type: "lifecycle",
    title: "FixedUpdate Method",
    description: "Called at fixed time intervals. Use for physics calculations."
  },
  "void LateUpdate()": {
    type: "lifecycle",
    title: "LateUpdate Method",
    description: "Called after all Update functions. Use for camera follow logic."
  },

  // Transform and positioning
  "transform.position": {
    type: "transform",
    title: "Transform Position",
    description: "Represents the GameObject's position in world space as a Vector3."
  },
  "transform.rotation": {
    type: "transform",
    title: "Transform Rotation",
    description: "Represents the GameObject's rotation in world space as a Quaternion."
  },
  "transform.Translate": {
    type: "transform",
    title: "Translate Method",
    description: "Moves the transform in the direction and distance of translation vector."
  },
  "transform.Rotate": {
    type: "transform",
    title: "Rotate Method",
    description: "Rotates the transform by the specified angles."
  },

  // Component references
  "GetComponent<": {
    type: "component",
    title: "GetComponent Method",
    description: "Retrieves a component of specified type from the GameObject."
  },
  "AddComponent<": {
    type: "component",
    title: "AddComponent Method",
    description: "Adds a component of specified type to the GameObject."
  },
  "Rigidbody": {
    type: "physics",
    title: "Rigidbody Component",
    description: "Allows a GameObject to be affected by physics forces and gravity."
  },
  "Collider": {
    type: "physics",
    title: "Collider Component",
    description: "Defines the shape of an object for physical collisions."
  },

  // Input handling
  "Input.GetKeyDown": {
    type: "input",
    title: "GetKeyDown Method",
    description: "Returns true during the frame the user starts pressing the specified key."
  },
  "Input.GetKey": {
    type: "input",
    title: "GetKey Method",
    description: "Returns true while the user holds down the specified key."
  },
  "Input.GetAxis": {
    type: "input",
    title: "GetAxis Method",
    description: "Returns the value of the virtual axis identified by axisName (between -1 and 1)."
  },

  // Debug and logging
  "Debug.Log": {
    type: "debug",
    title: "Debug.Log Method",
    description: "Logs a message to the Unity Console, useful for debugging."
  },

  // Common Unity classes
  "MonoBehaviour": {
    type: "component",
    title: "MonoBehaviour Class",
    description: "The base class from which every Unity script derives. Enables access to Unity's event functions."
  },
  "Vector3": {
    type: "transform",
    title: "Vector3 Struct",
    description: "Representation of 3D vectors and points in 3D space."
  },
  "GameObject": {
    type: "component",
    title: "GameObject Class",
    description: "The base class for all entities in Unity scenes."
  }
};

export const EnhancedCodeExample = ({ code, language = "csharp", title = "Unity C# Example" }) => {
  const [highlightedTokens, setHighlightedTokens] = useState([]);
  const [activeToken, setActiveToken] = useState(null);
  const [tokensWithConcepts, setTokensWithConcepts] = useState({});

  // Process code to find Unity concepts that need highlighting
  useEffect(() => {
    if (!code) return;
    
    // Find Unity concepts in the code
    const conceptMatches = {};
    Object.keys(UNITY_CONCEPTS).forEach(concept => {
      if (code.includes(concept)) {
        conceptMatches[concept] = UNITY_CONCEPTS[concept];
      }
    });
    
    setTokensWithConcepts(conceptMatches);
  }, [code]);

  // Custom highlighting for Unity concepts
  const customStyle = {
    ...vscDarkPlus,
    'code[class*="language-"]': {
      ...vscDarkPlus['code[class*="language-"]'],
      fontFamily: "'Fira Code', 'Courier New', monospace",
      fontSize: "14px",
      lineHeight: "1.4"
    },
    'pre[class*="language-"]': {
      ...vscDarkPlus['pre[class*="language-"]'],
      background: "#111",
      border: "1px solid #333",
      borderRadius: "4px",
      padding: "1rem",
      overflow: "auto"
    }
  };

  // Custom renderer for code to add tooltips and highlights
  const codeRenderer = (code) => {
    // Process code to highlight Unity concepts
    let processedCode = code;
    const wrapWithTooltip = (match, concept) => {
      const type = concept.type || "default";
      const color = UNITY_COLORS[type].color;
      const bgColor = UNITY_COLORS[type].bg;
      
      return `<span class="unity-concept" data-concept="${match}" style="color:${color};background:${bgColor};padding:2px 4px;border-radius:2px;cursor:help;">${match}</span>`;
    };

    // Replace matches with styled spans
    Object.keys(tokensWithConcepts).forEach(concept => {
      const regex = new RegExp(concept.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1"), "g");
      processedCode = processedCode.replace(regex, (match) => {
        return wrapWithTooltip(match, tokensWithConcepts[concept]);
      });
    });
    
    return (
      <div
        dangerouslySetInnerHTML={{ __html: processedCode }}
        onClick={(e) => {
          if (e.target.className === "unity-concept") {
            setActiveToken(e.target.dataset.concept);
          }
        }}
      />
    );
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      bg="#111"
      border="1px solid #333"
      borderRadius="md"
      overflow="hidden"
    >
      {/* Header */}
      <HStack 
        bg="#111" 
        p={3} 
        borderBottom="1px solid #333"
        justify="space-between"
      >
        <HStack spacing={3}>
          <MotionBox
            animate={{
              color: [
                "#00ff00", "#4ecdc4", "#ffd93d", "#ff6b6b", "#a374db", "#00ff00"
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Text fontWeight="bold" fontSize="sm">
              📝 {title}
            </Text>
          </MotionBox>
          <Badge bg="#222" color="#4ecdc4">Unity C#</Badge>
        </HStack>
        
        <HStack spacing={2}>
          {Object.keys(tokensWithConcepts).length > 0 && (
            <Badge bg="#222" color="#00ff00" fontSize="xs">
              {Object.keys(tokensWithConcepts).length} Unity concepts detected
            </Badge>
          )}
        </HStack>
      </HStack>
      
      {/* Code Display */}
      <Box position="relative">
        <Box className="enhanced-code-container" position="relative">
          <SyntaxHighlighter
            language={language}
            style={customStyle}
            customStyle={{
              background: "#111",
              borderRadius: 0,
              margin: 0
            }}
            renderer={codeRenderer}
          >
            {code}
          </SyntaxHighlighter>
        </Box>
        
        {/* Active Token Info Overlay */}
        {activeToken && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            position="absolute"
            bottom="10px"
            left="10px"
            right="10px"
            bg="rgba(0,0,0,0.9)"
            border={`1px solid ${UNITY_COLORS[tokensWithConcepts[activeToken]?.type || "default"].color}`}
            p={3}
            zIndex={10}
            borderRadius="md"
            boxShadow={`0 0 20px ${UNITY_COLORS[tokensWithConcepts[activeToken]?.type || "default"].color}33`}
          >
            <HStack justify="space-between">
              <HStack>
                <Badge 
                  bg={UNITY_COLORS[tokensWithConcepts[activeToken]?.type || "default"].bg} 
                  color={UNITY_COLORS[tokensWithConcepts[activeToken]?.type || "default"].color}
                >
                  {tokensWithConcepts[activeToken]?.title || activeToken}
                </Badge>
                <Text color="#ccc" fontSize="sm" fontFamily="monospace">
                  {activeToken}
                </Text>
              </HStack>
              <Text 
                color="#666" 
                fontSize="sm" 
                cursor="pointer" 
                onClick={() => setActiveToken(null)}
              >
                ✕
              </Text>
            </HStack>
            <Text color="#ccc" fontSize="sm" mt={2}>
              {tokensWithConcepts[activeToken]?.description || ""}
            </Text>
          </MotionBox>
        )}
      </Box>
      
      {/* Concept Legend */}
      <Box p={3} bg="#111" borderTop="1px solid #333">
        <Text fontSize="xs" color="#666" mb={2}>Unity Concept Types:</Text>
        <Flex flexWrap="wrap" gap={2}>
          {Object.entries(UNITY_COLORS).filter(([key]) => key !== "default").map(([type, colors]) => (
            <Badge 
              key={type}
              bg={colors.bg}
              color={colors.color}
              fontSize="xs"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          ))}
        </Flex>
      </Box>
    </MotionBox>
  );
};