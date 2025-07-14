import { useRef, useState, useEffect } from "react";
import { Box, HStack, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import GameStats from "./GameStats";
import GameModeSelector from "./GameModeSelector";
import TypingChallenge from "./TypingChallenge";
import HybridMode from "./HybridMode";
import { useGameProgress } from "../hooks/useGameProgress";
import { getRandomChallenge } from "../data/challenges";

const MotionBox = motion(Box);

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [gameMode, setGameMode] = useState("editor");
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [currentStats, setCurrentStats] = useState(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  const { progress, completeChallenge } = useGameProgress();
  
  // Responsive breakpoints
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1200;
  const isDesktop = windowSize.width >= 1200;
  const isLandscape = windowSize.width > windowSize.height;
  
  // Update window size
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
    
    if (gameMode === 'typing' || gameMode === 'hybrid') {
      const challenge = getRandomChallenge(language);
      setCurrentChallenge(challenge);
    }
  };

  const handleModeChange = (mode) => {
    setGameMode(mode);
    
    if (mode === 'typing' || mode === 'hybrid') {
      const challenge = getRandomChallenge(language);
      setCurrentChallenge(challenge);
    } else {
      setCurrentChallenge(null);
    }
  };

  const handleChallengeComplete = (stats) => {
    completeChallenge(stats, language);
    setCurrentStats(stats);
    
    setTimeout(() => {
      if (gameMode === 'typing') {
        const nextChallenge = getRandomChallenge(language);
        setCurrentChallenge(nextChallenge);
        setCurrentStats(null);
      }
    }, 3000);
  };

  const handleHybridComplete = (typingStats, executionStats) => {
    const combinedStats = {
      ...typingStats,
      executionSuccess: !executionStats.error,
      executionOutput: executionStats.output
    };
    
    completeChallenge(combinedStats, language);
    setCurrentStats(combinedStats);
    
    setTimeout(() => {
      const nextChallenge = getRandomChallenge(language);
      setCurrentChallenge(nextChallenge);
      setCurrentStats(null);
    }, 3000);
  };

  const handleCodeExecution = (executionStats) => {
    if (executionStats && !executionStats.error) {
      completeChallenge({
        wpm: 0,
        accuracy: 100,
        errors: 0,
        timeElapsed: 0
      }, language);
    }
  };

  // Layout configuration based on screen size
  const getLayoutConfig = () => {
    if (isMobile) {
      return {
        direction: 'column',
        statsHeight: '100px',
        sidebarWidth: '100%',
        showSidebar: false,
        compactMode: true,
        fontSize: 12
      };
    }
    
    if (isTablet) {
      return {
        direction: isLandscape ? 'row' : 'column',
        statsHeight: '120px',
        sidebarWidth: isLandscape ? '300px' : '100%',
        showSidebar: isLandscape,
        compactMode: !isLandscape,
        fontSize: 14
      };
    }
    
    // Desktop
    return {
      direction: 'row',
      statsHeight: '140px',
      sidebarWidth: '320px',
      showSidebar: true,
      compactMode: false,
      fontSize: 16
    };
  };
  
  const layout = getLayoutConfig();
  
  return (
    <Box 
      h="100%" 
      display="flex" 
      flexDirection="column"
      overflow="hidden"
      bg="#000"
    >
      {/* Top Control Panel */}
      <MotionBox
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        h={layout.statsHeight}
        flexShrink={0}
        borderBottom="1px solid #333"
        bg="linear-gradient(180deg, #111 0%, #000 100%)"
        overflow="hidden"
      >
        <HStack h="100%" spacing={0}>
          {/* Stats Panel */}
          <Box 
            flex={layout.showSidebar ? "none" : 1}
            w={layout.showSidebar ? layout.sidebarWidth : "100%"}
            h="100%" 
            p={2}
            borderRight={layout.showSidebar ? "1px solid #333" : "none"}
            overflow="hidden"
          >
            <GameStats 
              progress={progress} 
              currentStats={currentStats} 
              streak={currentChallenge?.streak || 0}
              compact={layout.compactMode}
            />
          </Box>
          
          {/* Mode Selector */}
          <Box 
            flex={1} 
            h="100%" 
            p={2}
            overflow="hidden"
          >
            <GameModeSelector 
              currentMode={gameMode} 
              onModeChange={handleModeChange}
              language={language}
              compact={layout.compactMode}
            />
          </Box>
        </HStack>
      </MotionBox>
      
      {/* Main Content Area */}
      <Box 
        flex={1} 
        overflow="hidden"
        position="relative"
      >
        {gameMode === 'typing' && currentChallenge ? (
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            h="100%" 
            p={3}
            overflow="hidden"
          >
            <TypingChallenge
              challenge={currentChallenge}
              currentLevel={progress.level}
              onComplete={handleChallengeComplete}
              isActive={true}
              fullScreen={true}
            />
          </MotionBox>
        ) : gameMode === 'hybrid' && currentChallenge ? (
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            h="100%" 
            p={3}
            overflow="hidden"
          >
            <HybridMode
              challenge={currentChallenge}
              language={language}
              currentLevel={progress.level}
              onComplete={handleHybridComplete}
              isActive={true}
              fullScreen={true}
            />
          </MotionBox>
        ) : (
          <Box 
            h="100%" 
            display="flex" 
            flexDirection={layout.direction}
            overflow="hidden"
          >
            {/* Code Editor Panel */}
            <MotionBox
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              flex={1}
              bg="#111" 
              border="1px solid #333" 
              display="flex"
              flexDirection="column"
              overflow="hidden"
              mr={layout.direction === 'row' ? 2 : 0}
              mb={layout.direction === 'column' ? 2 : 0}
            >
              {/* Editor Header */}
              <Box 
                p={3} 
                borderBottom="1px solid #333" 
                flexShrink={0}
                bg="linear-gradient(90deg, #111 0%, #222 50%, #111 100%)"
              >
                <Text fontSize="xs" color="#666" mb={2} fontFamily="'Courier New', monospace">
                  │ CODE EDITOR
                </Text>
                <LanguageSelector language={language} onSelect={onSelect} />
              </Box>
              
              {/* Monaco Editor */}
              <Box flex={1} overflow="hidden">
                <Editor
                  options={{
                    minimap: { enabled: isDesktop },
                    fontSize: layout.fontSize,
                    fontFamily: "'Courier New', 'Monaco', monospace",
                    lineNumbers: "on",
                    glyphMargin: false,
                    folding: false,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 3,
                    wordWrap: isMobile ? "on" : "off",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    theme: "vs-dark",
                    scrollbar: {
                      vertical: 'auto',
                      horizontal: 'auto'
                    }
                  }}
                  height="100%"
                  language={language}
                  defaultValue={CODE_SNIPPETS[language]}
                  onMount={onMount}
                  value={value}
                  onChange={(value) => setValue(value)}
                />
              </Box>
            </MotionBox>
            
            {/* Output Panel */}
            <MotionBox
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              flex={1}
              overflow="hidden"
            >
              <Output 
                editorRef={editorRef} 
                language={language}
                onExecutionComplete={handleCodeExecution}
                fullHeight={true}
              />
            </MotionBox>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CodeEditor;