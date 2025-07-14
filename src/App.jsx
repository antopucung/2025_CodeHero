            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/commission/:id" element={<CommissionDetailPage />} />
            <Route path="/modules/:id" element={<ModuleDetailPage />} />
            <Route path="/learn/:courseId/:lessonId" element={<LessonPage />} />
            <Route path="/submit-project" element={<div style={{color: '#00ff00', padding: '50px', textAlign: 'center'}}>Project Submission - Coming Soon!</div>} />
            <Route path="/post-commission" element={<div style={{color: '#00ff00', padding: '50px', textAlign: 'center'}}>Post Commission - Coming Soon!</div>} />
            <Route path="/creator-profile" element={<div style={{color: '#00ff00', padding: '50px', textAlign: 'center'}}>Creator Profile - Coming Soon!</div>} />
          </Routes>
        </MotionBox>
      </Box>
    </Router>
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          initial={{ opacity: 0 }}
          display="flex"
          overflow="hidden"
          flexDirection="column"
          flex={1}
        >
        <MotionBox
          <Routes>
        {/* Main Content - Dynamic Height */}
            <Route path="/" element={<HomePage />} />
        