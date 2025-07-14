import { useRef, useState, useEffect } from "react";
import { Box, HStack, Text, VStack, useBreakpointValue } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import GameStats from "./GameStats";
import GameModeSelector from "./GameModeSelector";
import TypingChallenge from "./TypingChallenge";
import HybridMode from "./HybridMode";
import { useGameProgress } from "../hooks/useGameProgress";
import { getRandomChallenge } from "../data/challenges";

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
  
  // Responsive layout detection
  const isLandscape = windowSize.width > windowSize.height;
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;
  
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
    
    // Generate new challenge for typing and hybrid modes
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
    
    // Generate next challenge after a delay
    setTimeout(() => {
      if (gameMode === 'typing') {
        const nextChallenge = getRandomChallenge(language);
        setCurrentChallenge(nextChallenge);
        setCurrentStats(null);
      }
    }, 3000);
  };

  const handleHybridComplete = (typingStats, executionStats) => {
    // Combine typing and execution stats for hybrid mode
    const combinedStats = {
      ...typingStats,
      executionSuccess: !executionStats.error,
      executionOutput: executionStats.output
    };
    
    completeChallenge(combinedStats, language);
    setCurrentStats(combinedStats);
    
    // Generate next challenge
    setTimeout(() => {
      const nextChallenge = getRandomChallenge(language);
      setCurrentChallenge(nextChallenge);
      setCurrentStats(null);
    }, 3000);
  };

  const handleCodeExecution = (executionStats) => {
    // Award XP for successful code execution
    if (executionStats && !executionStats.error) {
      completeChallenge({
        wpm: 0,
        accuracy: 100,
        errors: 0,
        timeElapsed: 0
      }, language);
    }
  };
  
  // Calculate optimal layout based on screen size and orientation
  const getLayoutConfig = () => {
    if (isMobile) {
      return {
        direction: 'column',
        statsHeight: '120px',
        editorHeight: isLandscape ? '40vh' : '35vh',
        outputHeight: isLandscape ? '35vh' : '30vh',
        showSidebar: false,
        compactMode: true
      };
    }
    
    if (isTablet) {
      return {
        direction: isLandscape ? 'row' : 'column',
        statsHeight: '140px',
        editorHeight: isLandscape ? '60vh' : '45vh',
        outputHeight: isLandscape ? '60vh' : '40vh',
        showSidebar: isLandscape,
        compactMode: false
      };
    }
    
    // Desktop
    return {
      direction: 'row',
      statsHeight: '160px',
      editorHeight: '70vh',
      outputHeight: '70vh',
      showSidebar: true,
      compactMode: false
    };
  };
  
  const layout = getLayoutConfig();
  
  return (
    <Box 
      bg="#000" 
      h="100%" 
      display="flex" 
      flexDirection="column"
      overflow="hidden"
    >
      {/* Top Stats Bar */}
      <Box 
        h={layout.statsHeight} 
        flexShrink={0} 
        p={2}
        borderBottom="1px solid #333"
      >
        <GameStats 
          progress={progress} 
          currentStats={currentStats} 
          streak={currentChallenge?.streak || 0}
          compact={layout.compactMode}
        />
      </Box>
      
      {/* Mode Selector */}
      <Box flexShrink={0} p={2} borderBottom="1px solid #333">
        <GameModeSelector 
          currentMode={gameMode} 
          onModeChange={handleModeChange}
          language={language}
          compact={layout.compactMode}
        />
      </Box>
      
      {/* Main Content Area */}
      <Box flex={1} overflow="hidden">
        {gameMode === 'typing' && currentChallenge ? (
          <Box h="100%" p={3}>
            <TypingChallenge
              challenge={currentChallenge}
              currentLevel={progress.level}
              onComplete={handleChallengeComplete}
              isActive={true}
              fullScreen={true}
            />
          </Box>
        ) : gameMode === 'hybrid' && currentChallenge ? (
          <Box h="100%" p={3}>
            <HybridMode
              challenge={currentChallenge}
              language={language}
              currentLevel={progress.level}
              onComplete={handleHybridComplete}
              isActive={true}
              fullScreen={true}
            />
          </Box>
        ) : (
          <Box 
            h="100%" 
            display="flex" 
            flexDirection={layout.direction}
          >
            {/* Code Editor Panel */}
            <Box 
              flex={layout.direction === 'row' ? 1 : 'none'}
              h={layout.direction === 'column' ? layout.editorHeight : '100%'}
              bg="#111" 
              border="1px solid #333" 
              display="flex"
              flexDirection="column"
            >
              <Box p={3} borderBottom="1px solid #333" flexShrink={0}>
                <Text fontSize="xs" color="#666" mb={2} fontFamily="'Courier New', monospace">
                  │ CODE EDITOR
                </Text>
                <LanguageSelector language={language} onSelect={onSelect} />
              </Box>
              
              <Box flex={1}>
                <Editor
                  options={{
                    minimap: {
                      enabled: isDesktop,
                    },
                    fontSize: isMobile ? 12 : isTablet ? 14 : 16,
                    fontFamily: "'Courier New', 'Monaco', monospace",
                    lineNumbers: "on",
                    glyphMargin: false,
                    folding: false,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 3,
                    wordWrap: isMobile ? "on" : "off",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                  height="100%"
                  theme="terminal-theme"
                  language={language}
                  defaultValue={CODE_SNIPPETS[language]}
                  onMount={onMount}
                  value={value}
                  onChange={(value) => setValue(value)}
                />
              </Box>
            </Box>
            
            {/* Output Panel */}
            <Box 
              flex={layout.direction === 'row' ? 1 : 'none'}
              h={layout.direction === 'column' ? layout.outputHeight : '100%'}
              ml={layout.direction === 'row' ? 2 : 0}
              mt={layout.direction === 'column' ? 2 : 0}
            >
              <Output 
                editorRef={editorRef} 
                language={language}
                onExecutionComplete={handleCodeExecution}
                fullHeight={true}
              />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};
        
        {/* Game Mode Selector */}
        <GameModeSelector 
          currentMode={gameMode} 
          onModeChange={handleModeChange}
          language={language}
        />
        
        {/* Main Content Area */}
        {gameMode === 'typing' && currentChallenge ? (
          <TypingChallenge
            challenge={currentChallenge}
            currentLevel={progress.level}
            onComplete={handleChallengeComplete}
            isActive={true}
          />
        ) : gameMode === 'hybrid' && currentChallenge ? (
          <HybridMode
            challenge={currentChallenge}
            language={language}
            currentLevel={progress.level}
            onComplete={handleHybridComplete}
            isActive={true}
          />
        ) : (
          <HStack spacing={4}>
            <Box w="50%" bg="#111" border="1px solid #333" p={3}>
              <Text fontSize="xs" color="#666" mb={2} fontFamily="'Courier New', monospace">
                │ CODE EDITOR
              </Text>
              <LanguageSelector language={language} onSelect={onSelect} />
              <Editor
                options={{
                  minimap: {
                    enabled: false,
                  },
                  fontSize: 14,
                  fontFamily: "'Courier New', 'Monaco', monospace",
                  lineNumbers: "on",
                  glyphMargin: false,
                  folding: false,
                  lineDecorationsWidth: 0,
                  lineNumbersMinChars: 3,
                }}
                height="60vh"
                theme="terminal-theme"
                language={language}
                defaultValue={CODE_SNIPPETS[language]}
                onMount={onMount}
                value={value}
                onChange={(value) => setValue(value)}
              />
            </Box>
            <Output 
              editorRef={editorRef} 
              language={language}
              onExecutionComplete={handleCodeExecution}
            />
          </HStack>
        )}
      </VStack>
      
      <Text fontSize="xs" color="#666" mt={3} fontFamily="'Courier New', monospace">
        └───────────────────────────────────────────────────────────────────────────────────┘
      </Text>
    </Box>
  );
};
export default CodeEditor;
