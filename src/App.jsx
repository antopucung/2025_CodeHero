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

function App() {
  // Configure navigation mode - easily switchable
  const navigationMode = NAVIGATION_MODES.BOTH; // Change to HEADER_ONLY or SIDEBAR_ONLY as needed

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <MainLayout navigationMode={navigationMode}>
            <Box p={{ base: 4, md: 8 }}>
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