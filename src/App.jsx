import React from 'react';
import { Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import MainLayout from './layouts/MainLayout';
import { NAVIGATION_MODES } from './components/navigation/NavigationConfig';
import HomePage from './pages/HomePage';
import QuizGalleryPage from './pages/QuizGalleryPage';
import TypingChallengePage from './pages/TypingChallengePage';
import CodeEditorPage from './pages/CodeEditorPage';
import HybridModePage from './pages/HybridModePage';
import LessonPage from './pages/LessonPage';
import ProfilePage from './pages/ProfilePage';
import CommunityPage from './pages/CommunityPage';
import MarketplacePage from './pages/MarketplacePage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import CommissionDetailPage from './pages/CommissionDetailPage';
import { ThemeProvider } from './theme/ThemeContext';

// 🎯 NAVIGATION CONFIGURATION
// ===========================
// Easy configuration for navigation system
// Change this value to switch between navigation modes:
//
// HEADER_ONLY: Traditional top navigation bar only
// SIDEBAR_ONLY: Modern sidebar navigation only  
// BOTH: Header + Sidebar combined (header becomes compact)
//
const USE_SIDEBAR = true; // 👈 CHANGE THIS TO false FOR HEADER-ONLY MODE

function App() {
  // Automatically configure navigation mode based on USE_SIDEBAR setting
  const navigationMode = USE_SIDEBAR ? NAVIGATION_MODES.BOTH : NAVIGATION_MODES.HEADER_ONLY;

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <MainLayout navigationMode={navigationMode}>
            <Box p={{ base: 4, md: USE_SIDEBAR ? 6 : 8 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/quiz-gallery" element={<QuizGalleryPage />} />
                <Route path="/typing-challenge" element={<TypingChallengePage />} />
                <Route path="/code-editor" element={<CodeEditorPage />} />
                <Route path="/hybrid-mode" element={<HybridModePage />} />
                <Route path="/learn/:courseId/:lessonId" element={<LessonPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/modules/:id" element={<ModuleDetailPage />} />
                <Route path="/project/:id" element={<ProjectDetailPage />} />
                <Route path="/commission/:id" element={<CommissionDetailPage />} />
              </Routes>
            </Box>
          </MainLayout>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;