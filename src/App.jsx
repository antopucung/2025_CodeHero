import React from 'react';
import { Box, Container } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
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
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <Box minH="100vh" bg="#000">
            <Header />
            <Container maxW="container.xl" py={8}>
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
            </Container>
          </Box>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;