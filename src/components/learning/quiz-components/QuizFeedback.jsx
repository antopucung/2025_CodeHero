import React from 'react';
import { Box, Text } from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

/**
 * Quiz Feedback Component - handles visual feedback (flashes, streaks, combos)
 */
export const QuizFeedback = ({ 
  screenFlash, 
  streakStatus, 
  gameEffects, 
  effects 
}) => {
  return (
    <>
      {/* Screen Flash Effect */}
      {screenFlash.active && (
        <MotionBox
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, screenFlash.intensity, 0]
          }}
          transition={{ duration: 0.3 }}
          position="fixed"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg={
            screenFlash.type === 'success' ? "rgba(0, 255, 0, 0.2)" : 
            screenFlash.type === 'error' ? "rgba(255, 0, 0, 0.2)" :
            "rgba(78, 205, 196, 0.2)" // info - teal color for neutral actions
          }
          zIndex={999}
          pointerEvents="none"
        />
      )}
      
      {/* Streak Counter */}
      {streakStatus.active && streakStatus.count >= 3 && (
        <MotionBox
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: 0,
            boxShadow: [
              "0 0 20px #ffd93d",
              "0 0 40px #ffd93d",
              "0 0 20px #ffd93d"
            ]
          }}
          transition={{ 
            duration: 0.5,
            boxShadow: { repeat: Infinity, duration: 1.5 }
          }}
          position="fixed"
          top="20%"
          right="5%"
          bg="rgba(0,0,0,0.8)"
          border="2px solid #ffd93d"
          borderRadius="full"
          p={3}
          px={5}
          zIndex={1000}
          pointerEvents="none"
        >
          <Text 
            fontSize="lg" 
            fontWeight="bold" 
            color="#ffd93d"
          >
            🔥 {streakStatus.count} STREAK!
          </Text>
        </MotionBox>
      )}
      
      {/* Combo indicator */}
      {gameEffects.combo > 1.2 && (
        <MotionBox
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1],
            x: [50, 0, 0],
            backgroundColor: [
              gameEffects.combo >= 2 ? "#ff6b6b33" : "#4ecdc433",
              gameEffects.combo >= 2 ? "#ff6b6b66" : "#4ecdc466",
              gameEffects.combo >= 2 ? "#ff6b6b33" : "#4ecdc433"
            ]
          }}
          transition={{ 
            duration: 0.5 * effects?.speed || 1,
            backgroundColor: { 
              repeat: Infinity, 
              duration: 1.5 * effects?.speed || 1
            }
          }}
          position="fixed"
          top="10%"
          right="5%"
          bg="#4ecdc433"
          border="1px solid #4ecdc4"
          borderRadius="md"
          px={3}
          py={2}
          zIndex={10}
        >
          <Text 
            color={gameEffects.combo >= 2 ? "#ff6b6b" : "#4ecdc4"} 
            fontWeight="bold"
            fontSize="sm"
          >
            x{gameEffects.combo.toFixed(1)} COMBO
          </Text>
        </MotionBox>
      )}
      
      {/* Floating points animation */}
      {effects?.speed !== 'low' && gameEffects.pointsText && (
        <AnimatePresence>
          <MotionBox
            key={`points-${Date.now()}`}
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [-20, -70, -100],
              scale: [0.5, 1.2, 1]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 * effects?.speed || 1 }}
            position="fixed"
            top="50%"
            right="10%"
            color={gameEffects.lastAction === 'correct' ? "#00ff00" : "#ff6b6b"}
            fontWeight="bold"
            fontSize="xl"
            textShadow="0 0 10px rgba(0,0,0,0.7)"
            zIndex={100}
            pointerEvents="none"
          >
            {gameEffects.pointsText}
          </MotionBox>
        </AnimatePresence>
      )}
      
      {/* Combo text animation */}
      {effects?.speed !== 'low' && gameEffects.comboText && (
        <AnimatePresence>
          <MotionBox
            key={`combo-${Date.now()}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0.7, 1.3 * (effects?.scale || 1), 0.9],
              rotate: [-5, 5, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.2 * effects?.speed || 1,
              scale: { type: "spring", stiffness: 300 * effects?.speed || 300 }
            }}
            position="fixed"
            top="30%"
            left="50%"
            transform="translate(-50%, -50%)"
            color={
              gameEffects.lastAction === 'correct' 
                ? gameEffects.combo >= 2 
                  ? "#ff6b6b" 
                  : "#00ff00"
                : "#ff6b6b"
            }
            fontWeight="bold"
            fontSize="3xl"
            textShadow="0 0 15px rgba(0,0,0,0.7)"
            zIndex={100}
            pointerEvents="none"
            textAlign="center"
          >
            {gameEffects.comboText}
          </MotionBox>
        </AnimatePresence>
      )}
      
      {/* Floating messages */}
      <AnimatePresence>
        {gameEffects.feedbackMessages.map((message, index) => (
          <MotionBox
            key={message.id}
            initial={{ opacity: 0, x: -50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, y: 0 }}
            transition={{ duration: 0.5 }}
            position="fixed"
            left="5%"
            top={`${20 + (index * 8)}%`}
            bg="rgba(0,0,0,0.8)"
            border={`1px solid ${message.type === 'success' ? '#00ff00' : message.type === 'error' ? '#ff6b6b' : '#ffd93d'}`}
            color={message.type === 'success' ? '#00ff00' : message.type === 'error' ? '#ff6b6b' : '#ffd93d'}
            p={2}
            borderRadius="md"
            zIndex={999}
            fontSize="sm"
            maxW="250px"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {message.text}
          </MotionBox>
        ))}
      </AnimatePresence>
    </>
  );
};

export default QuizFeedback;