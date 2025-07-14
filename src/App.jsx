import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MarketplacePage from './pages/MarketplacePage';
import CommunityPage from './pages/CommunityPage';
import CommissionDetailPage from './pages/CommissionDetailPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import LessonPage from './pages/LessonPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProfilePage from './pages/ProfilePage';

const MotionBox = motion(Box);

function App() {
  return (
    <Router>
      <Box
        minH="100vh"
        bg="gray.900"
        color="white"
        display="flex"
        flexDirection="column"
      >
        <Header />
        
        <MotionBox
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          initial={{ opacity: 0 }}
          display="flex"
          overflow="hidden"
          flexDirection="column"
          flex={1}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/commission/:id" element={<CommissionDetailPage />} />
            <Route path="/modules/:id" element={<ModuleDetailPage />} />
            <Route path="/learn/:courseId/:lessonId" element={<LessonPage />} />
            <Route path="/project/:id" element={<ProjectDetailPage />} />
            <Route path="/submit-project" element={<div style={{color: '#00ff00', padding: '50px', textAlign: 'center'}}>Project Submission - Coming Soon!</div>} />
            <Route path="/post-commission" element={<div style={{color: '#00ff00', padding: '50px', textAlign: 'center'}}>Post Commission - Coming Soon!</div>} />
            <Route path="/creator-profile" element={<div style={{color: '#00ff00', padding: '50px', textAlign: 'center'}}>Creator Profile - Coming Soon!</div>} />
          </Routes>
        </MotionBox>
      </Box>
    </Router>
  );
}

export default App;