import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CodeEditorPage from './pages/CodeEditorPage';
import TypingChallengePage from './pages/TypingChallengePage';
import HybridModePage from './pages/HybridModePage';

const MotionBox = motion(Box);

function App() {
  return (
    <Router>
      <Box 
        minH="100vh" 
        maxH="100vh"
        bg="#000000" 
        color="#00ff00" 
        fontFamily="'Courier New', monospace"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        {/* Global Header */}
        <Header />
        
        {/* Main Content with Routing */}
        <MotionBox
          flex={1}
          overflow="hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/editor" element={<CodeEditorPage />} />
            <Route path="/typing" element={<TypingChallengePage />} />
            <Route path="/hybrid" element={<HybridModePage />} />
          </Routes>
        </MotionBox>
      </Box>
    </Router>
  );
}

export default App;