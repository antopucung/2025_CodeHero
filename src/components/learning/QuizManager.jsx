import React from 'react';
import { Box } from "@chakra-ui/react";
import CodeStackingQuiz from './CodeStackingQuiz';
import MultipleChoiceQuiz from './MultipleChoiceQuiz';
import CodeCompletionQuiz from './CodeCompletionQuiz';
import DebugChallengeQuiz from './DebugChallengeQuiz';

// Quiz Manager Component - Renders the appropriate quiz based on type
const QuizManager = ({ quizData, onComplete, juiciness = 'high' }) => {
  if (!quizData || !quizData.type) {
    return (
      <Box textAlign="center" p={10} color="#666">
        Invalid quiz data. Make sure to specify a quiz type.
      </Box>
    );
  }
  
  // Render the appropriate quiz component based on type
  switch (quizData.type) {
    case 'code-stacking':
      return (
        <CodeStackingQuiz
          quizData={quizData}
          onComplete={onComplete}
          juiciness={juiciness}
        />
      );
      
    case 'multiple-choice':
      return (
        <MultipleChoiceQuiz
          quizData={quizData}
          onComplete={onComplete}
          juiciness={juiciness}
        />
      );
      
    case 'code-completion':
      return (
        <CodeCompletionQuiz
          quizData={quizData}
          onComplete={onComplete}
          juiciness={juiciness}
        />
      );
      
    case 'debug-challenge':
      return (
        <DebugChallengeQuiz
          quizData={quizData}
          onComplete={onComplete}
          juiciness={juiciness}
        />
      );
      
    default:
      return (
        <Box textAlign="center" p={10} color="#666">
          Unsupported quiz type: {quizData.type}
        </Box>
      );
  }
};

export default QuizManager;