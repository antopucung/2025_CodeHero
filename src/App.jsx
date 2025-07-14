import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import CommunityPage from './pages/CommunityPage';

const MotionBox = motion(Box);

function App() {
  return (
    <Router>
      <Box 
        w="100vw"
        h="100vh"
        bg="#000000" 
        color="#00ff00" 
        fontFamily="'Courier New', monospace"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        position="fixed"
        top="0"
        left="0"
      >
        {/* Global Header - Fixed Height */}
        <Box flexShrink={0} h="60px" overflow="hidden">
          <Header />
        </Box>
        
        {/* Main Content - Dynamic Height */}
        <MotionBox
          flex={1}
          overflow="hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          display="flex"
          flexDirection="column"
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/modules/:id" element={<div style={{color: '#00ff00', padding: '50px', textAlign: 'center'}}>Module Detail Page - Coming Soon!</div>} />
          </Routes>
        </MotionBox>
      </Box>
    </Router>
  );
}

export default App;