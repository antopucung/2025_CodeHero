import React from 'react';
import { Box, VStack, HStack, Badge, Divider } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { CustomText } from '../../design/components/Typography';

const MotionBox = motion(Box);

// Collection of reusable C# code concepts with explanations
export const CSharpConcepts = {
  // Core C# Concepts
  variables: {
    title: "Variables",
    explanation: "Variables store data values that can be changed during program execution.",
    examples: [
      { 
        text: "int health = 100;", 
        explanation: "Creates an integer variable named 'health' with value 100."
      },
      {
        text: "float speed = 5.5f;",
        explanation: "Creates a floating point variable with 'f' suffix to indicate float type."
      }
    ]
  },
  
  methods: {
    title: "Methods",
    explanation: "Methods are functions that perform specific tasks and can be called from other parts of your code.",
    examples: [
      { 
        text: "void Start()", 
        explanation: "A Unity method called once when the script is enabled, before any Update methods."
      },
      {
        text: "void Update()",
        explanation: "A Unity method called every frame if the MonoBehaviour is enabled."
      },
      {
        text: "private void Jump()",
        explanation: "A custom method that can only be accessed within the class it's defined in."
      }
    ]
  },

  classDefinition: {
    title: "Class Definition",
    explanation: "Classes are blueprints for objects that contain variables and methods.",
    examples: [
      { 
        text: "public class Player : MonoBehaviour", 
        explanation: "Defines a Player class that inherits from MonoBehaviour, making it usable as a Unity component."
      }
    ]
  },

  conditionals: {
    title: "Conditionals",
    explanation: "Conditionals execute different code based on whether a specified condition is true or false.",
    examples: [
      { 
        text: "if (health <= 0)", 
        explanation: "Checks if the health variable is less than or equal to zero."
      },
      {
        text: "else",
        explanation: "Specifies code to run when the previous if condition is false."
      }
    ]
  },

  // Unity-specific Concepts
  unityComponents: {
    title: "Unity Components",
    explanation: "Components are the building blocks of GameObjects in Unity, providing specific functionalities.",
    examples: [
      { 
        text: "GetComponent<Rigidbody>()", 
        explanation: "Gets the Rigidbody component attached to the GameObject."
      },
      {
        text: "AddComponent<BoxCollider>()",
        explanation: "Adds a BoxCollider component to the GameObject at runtime."
      }
    ]
  },

  unityTransform: {
    title: "Transform Manipulation",
    explanation: "The Transform component determines the position, rotation, and scale of GameObjects.",
    examples: [
      { 
        text: "transform.position", 
        explanation: "Gets or sets the position of the GameObject in world space."
      },
      {
        text: "transform.Translate(Vector3.forward * speed * Time.deltaTime)",
        explanation: "Moves the GameObject forward at a speed adjusted for frame rate independence."
      }
    ]
  },
  
  input: {
    title: "Input Handling",
    explanation: "Input classes and methods allow your game to respond to player actions.",
    examples: [
      { 
        text: "Input.GetKeyDown(KeyCode.Space)", 
        explanation: "Returns true during the frame the user starts pressing the Space key."
      },
      {
        text: "Input.GetAxis(\"Horizontal\")",
        explanation: "Returns a value between -1 and 1 representing horizontal input (keyboard, gamepad, etc)."
      }
    ]
  },

  // Game Development Concepts
  vectors: {
    title: "Vector Operations",
    explanation: "Vectors represent positions and directions in 2D or 3D space.",
    examples: [
      { 
        text: "Vector3.up", 
        explanation: "A shorthand for writing Vector3(0, 1, 0), representing upward direction."
      },
      {
        text: "Vector3.Distance(transform.position, target.position)",
        explanation: "Calculates the distance between two positions in 3D space."
      }
    ]
  },
  
  prefabs: {
    title: "Prefab Instantiation",
    explanation: "Prefabs are reusable GameObjects that can be instantiated at runtime.",
    examples: [
      { 
        text: "Instantiate(bulletPrefab, firePoint.position, firePoint.rotation)", 
        explanation: "Creates a copy of bulletPrefab at the specified position and rotation."
      }
    ]
  },
};

// Component that shows concept explanations
const ConceptExplainer = ({ concept, size = "md" }) => {
  const selected = CSharpConcepts[concept];
  
  if (!selected) return null;
  
  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      bg="#111"
      border="1px solid #333"
      borderRadius="md"
      p={4}
      mb={4}
    >
      <VStack align="start" spacing={3}>
        <HStack>
          <Badge colorScheme="green">{selected.title}</Badge>
          {size === "sm" && (
            <CustomText fontSize="xs" color="#666">
              Hover for examples
            </CustomText>
          )}
        </HStack>
        
        <CustomText fontSize="sm" color="#ccc">
          {selected.explanation}
        </CustomText>
        
        {size === "md" && selected.examples && (
          <>
            <Divider borderColor="#333" />
            <CustomText fontSize="xs" color="#666" mb={1}>Examples:</CustomText>
            <VStack spacing={2} align="start" w="100%">
              {selected.examples.map((example, idx) => (
                <Box key={idx} bg="#000" p={2} borderRadius="md" w="100%">
                  <CustomText color="#00ff00" fontSize="sm" fontFamily="monospace" mb={1}>
                    {example.text}
                  </CustomText>
                  <CustomText fontSize="xs" color="#ccc">
                    {example.explanation}
                  </CustomText>
                </Box>
              ))}
            </VStack>
          </>
        )}
      </VStack>
    </MotionBox>
  );
};

export { ConceptExplainer };