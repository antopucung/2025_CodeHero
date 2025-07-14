import { useRef, useState } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
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
  
  const { progress, completeChallenge } = useGameProgress();

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
  return (
    <Box bg="#000" border="1px solid #333" borderRadius="0" p={4}>
      <Text fontSize="xs" color="#666" mb={3} fontFamily="'Courier New', monospace">
        ┌─[editor]─[session-001]───────────────────────────────────────────────────────────┐
      </Text>
      
      <VStack spacing={4} align="stretch">
        {/* Game Stats */}
        <GameStats progress={progress} currentStats={currentStats} streak={currentChallenge?.streak || 0} />
        
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
