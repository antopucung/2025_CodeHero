import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Text as ChakraText, VStack, HStack, Button, Progress, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { supabase } from '../lib/supabase';
import { useDisclosure } from "@chakra-ui/react";
import { useUserEnrollment } from '../hooks/useUserEnrollment';
import { useProgressionSystem } from '../hooks/useProgressionSystem';
import { InteractiveCodeExample } from '../components/learning/InteractiveCodeExample';
import { EnhancedCodeExample } from '../components/learning/EnhancedCodeExample';
import { ConceptExplainer } from '../components/learning/CodeConcepts';
import QuizPopup from '../components/learning/QuizPopup';
import { BaseQuizEngine } from '../components/learning/BaseQuizEngine';
import TypingChallenge from '../components/TypingChallenge';
import CodeEditorPage from './CodeEditorPage';

const MotionBox = motion(Box);

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { completeLesson } = useProgressionSystem();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [nextEnabled, setNextEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [quizRequired, setQuizRequired] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Quiz popup state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [quizData, setQuizData] = useState(null); 
  const toast = useToast();
  
  const { isEnrolled, updateLessonProgress, getCourseProgress, addCourseAchievement } = useUserEnrollment();
  const enrolled = isEnrolled(courseId);
  const progress = getCourseProgress(courseId);
  const [gameAchievements, setGameAchievements] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!enrolled && lesson && lesson.order_index > 0) {
      // Redirect to course page if not enrolled and trying to access non-preview lesson
      navigate(`/modules/${courseId}`);
      return;
    }
    fetchLessonData();
  }, [courseId, lessonId, enrolled]);

  // Function to create a quiz based on lesson content
  const createQuizFromLesson = (lesson) => {
    if (!lesson) return null;

    const contentData = lesson.content_data || {};

    // First check if the lesson already has a quiz defined in its content_data
    if (contentData.quiz) {
      return {
        ...contentData.quiz,
        // Ensure these fields have default values if not specified
        language: contentData.quiz.language || course?.language || 'csharp',
        difficulty: contentData.quiz.difficulty || course?.difficulty || 'medium',
        juiciness: contentData.quiz.juiciness || 'high'
      };
    } 
    // If the lesson has a multiple-choice quiz
    else if (contentData.questions && Array.isArray(contentData.questions)) {
      return {
        type: 'multiple-choice',
        title: `Quiz: ${lesson.title}`,
        description: "Select the correct answer for each question",
        questions: contentData.questions,
        language: course?.language || 'csharp',
        timeLimit: course?.difficulty === 'beginner' ? 180 : course?.difficulty === 'advanced' ? 90 : 120,
        difficulty: course?.difficulty || 'medium',
        juiciness: 'high'
      };
    }
    // If the lesson has code with blanks for a fill-in-the-blank quiz
    else if (contentData.code_with_blanks) {
      return {
        type: 'code-completion',
        title: `Code Completion: ${lesson.title}`,
        description: "Fill in the blanks to complete the code",
        code: contentData.code_with_blanks,
        blanks: contentData.blanks || [],
        language: course?.language || 'csharp',
        timeLimit: course?.difficulty === 'beginner' ? 240 : course?.difficulty === 'advanced' ? 120 : 180,
        difficulty: course?.difficulty || 'medium',
        juiciness: 'high'
      };
    }
    // If the lesson has buggy code for a debugging quiz
    else if (contentData.buggy_code && contentData.fixed_code) {
      return {
        type: 'debug-challenge',
        title: `Debug Challenge: ${lesson.title}`,
        description: "Find and fix the bugs in the code",
        buggyCode: contentData.buggy_code,
        fixedCode: contentData.fixed_code,
        bugs: contentData.bugs || [],
        totalBugs: contentData.total_bugs || contentData.bugs?.length || 3,
        language: course?.language || 'csharp',
        timeLimit: course?.difficulty === 'beginner' ? 300 : course?.difficulty === 'advanced' ? 180 : 240,
        difficulty: course?.difficulty || 'medium',
        juiciness: 'high'
      };
    }
    // If no quiz is defined but there's a code example, create one from that
    else if (contentData.code_example) {
      return {
        type: 'code-stacking',
        title: `Code Challenge: ${lesson.title}`,
        description: "Arrange the code blocks in the correct order",
        code: contentData.code_example,
        language: course?.language || 'csharp',
        timeLimit: course?.difficulty === 'beginner' ? 180 : course?.difficulty === 'advanced' ? 90 : 120,
        difficulty: course?.difficulty || 'medium',
        splitType: 'line',
        juiciness: 'high',
        totalBlocks: contentData.code_example.split('\n').filter(line => line.trim()).length
      };
    }

    return null; 
  };

  const fetchLessonData = async () => {
    try {
      setLoading(true);

      let courseData;
      let courseError;

      // Check if courseId is a UUID or a slug
      if (courseId && courseId.length === 36 && courseId.includes('-')) {
        // Query by ID (UUID)
        const response = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();
        
        courseData = response.data;
        courseError = response.error;
      } else {
        // Query by slug
        const response = await supabase
          .from('courses')
          .select('*')
          .eq('slug', courseId)
          .single();
        
        courseData = response.data;
        courseError = response.error;
      }
      
      if (courseError) throw courseError;
      
      // Fetch current lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();
      
      if (lessonError) throw lessonError;
      
      // Fetch all lessons for navigation
      const { data: allLessonsData, error: allLessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseData.id) // Use the course ID from the fetched course
        .order('order_index');
      
      if (allLessonsError) throw allLessonsError;
      
      setCourse(courseData);
      setLesson(lessonData);
      setAllLessons(allLessonsData || []);

      // Determine if quiz is required for this lesson
      const hasCodeExample = lessonData?.content_data?.code_example || lessonData?.content_data?.unity_code_example;
      const hasQuizData = lessonData?.content_data?.quiz;
      setQuizRequired(hasCodeExample || hasQuizData);
      
      // Check if lesson is already completed
      setLessonCompleted(progress.completedLessons?.includes(lessonId));
      
      // Allow navigation if already completed
      if (progress.completedLessons?.includes(lessonId)) {
        setNextEnabled(true);
        setQuizCompleted(true);
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (stats = {}) => {
    // Calculate score based on completion stats
    let score = stats.totalScore || stats.score || 0;
    let achievements = [];
    
    // Bonus score for perfect accuracy
    if (stats.accuracy === 100) {
      score += 500;
      achievements.push({ 
        type: 'perfectionist', 
        title: 'PERFECTIONIST',
        description: 'Completed with 100% accuracy!' 
      });
    }
    
    // Bonus for high WPM
    if (stats.wpm >= 60) {
      score += 300;
      achievements.push({ 
        type: 'speed_racer', 
        title: 'SPEED RACER',
        description: 'Achieved 60+ WPM!' 
      });
    }
    
    // Bonus for high combo
    if (stats.maxCombo >= 30) {
      score += 250;
      achievements.push({ 
        type: 'combo_master', 
        title: 'COMBO MASTER',
        description: 'Reached 30+ combo!' 
      });
    }
    
    // Check if user completed the course with this lesson
    const completedCount = progress.completedLessons.length;
    if (!lessonCompleted && completedCount >= allLessons.length - 1) {
      score += 1000; // Bonus for completing the course
      achievements.push({ 
        type: 'course_master', 
        title: 'COURSE MASTER',
        description: 'Completed the entire course!' 
      });
      
      // Show level up animation on course completion
      setShowLevelUp(true);
    }
    
    // Update game achievements display
    setGameAchievements(achievements);
    
    // If achievements were earned, add them to the course
    if (achievements.length > 0) {
      achievements.forEach(achievement => {
        addCourseAchievement(courseId, achievement.type);
      });
      
      // Show for a few seconds
      setTimeout(() => {
        setGameAchievements([]);
      }, 5000);
      
      // Show confetti
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }
    
    // Show quiz before proceeding to next lesson
    if (quizRequired && !quizCompleted && !lessonCompleted) {
      let quiz = createQuizFromLesson(lesson);
      
      // If the lesson doesn't have a quiz configuration but has code example, create a default one
      if (!quiz) {
        // For text lessons with code examples, default to code stacking quiz
        if (lesson.content_data?.code_example) {
          quiz = {
            type: 'code-stacking',
            title: `Code Challenge: ${lesson.title}`,
            description: "Arrange the code blocks in the correct order",
            code: lesson.content_data.code_example,
            language: course?.language || 'csharp',
            timeLimit: 120, 
            difficulty: course?.difficulty || 'medium',
            splitType: 'line',
            juiciness: 'high',
            totalBlocks: lesson.content_data.code_example.split('\n').filter(line => line.trim()).length
          };
        }
        // For C# lessons, create a debug challenge by default
        else if (course?.language === 'csharp') {
          const basicCSharpCode = `
public class Player : MonoBehaviour
{
    // Player movement speed
    public float moveSpeed = 5f;
    private Rigidbody rb;

    void Start()
    {
        // Get the Rigidbody component
        rb = GetComponent<Rigidbody>(); 
        rb.freezeRotation = true;
    }

    void Update()
    {
        // Get input axes
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");
        
        // Calculate movement direction
        Vector3 movement = new Vector3(horizontalInput, 0, verticalInput) * Time.deltaTime;
        
        // Apply movement
        transform.Translate(movement * moveSpeed);
    }
}`;
          
          const buggyVersion = `
public class Player : MonoBehaviour
{
    // Player movement speed
    public int moveSpeed = 5f;
    private Rigidbody rb;

    void Awake()
    {
        // Get the Rigidbody component
        rb = GetComponents<Rigidbody>(); 
        rb.freezeRotation = true;
    }

    void Update()
    {
        // Get input axes
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");
        
        // Calculate movement direction
        Vector3 movement = new Vector3(horizontalInput, verticalInput, 0) * Time.deltaTime;
        
        // Apply movement
        transform.Translate(movement + moveSpeed);
    }
}`;

          quiz = {
            type: 'debug-challenge',
            title: `Debug Challenge: ${lesson.title}`,
            description: "Find and fix the bugs in the Unity C# code",
            buggyCode: buggyVersion,
            fixedCode: basicCSharpCode,
            bugs: [
              "Incorrect type for moveSpeed (should be float)",
              "Wrong method for initialization (should be Start)",
              "Incorrect GetComponents call (should be GetComponent)",
              "Incorrect movement vector construction",
              "Incorrect movement calculation"
            ],
            totalBugs: 5,
            language: 'csharp',
            timeLimit: 240,
            difficulty: course?.difficulty || 'medium',
            juiciness: 'high'
          };
        }
      }
      
      if (quiz) {
          setQuizData(quiz);
          
          // Short delay to show completion message before quiz
          setTimeout(() => {
            onOpen();
          }, 1500);
          
          // Don't mark as completed yet - wait for quiz
          return;
        onOpen();
      }
    } else if (!quizRequired) {
      // If no quiz is required, enable next lesson navigation
      setNextEnabled(true);
    }
    
    // Mark lesson as completed
    try {
      // Award XP through progression system
      const progressionResult = await completeLesson(
        {
          accuracy: stats.accuracy || 100,
          wpm: stats.wpm || 0,
          timeElapsed: stats.timeElapsed || 60,
          errors: stats.errors || 0,
          attempts: stats.attempts || 1
        },
        course?.language || 'javascript',
        lessonId
      );
      
      // Update course progress
      updateLessonProgress(courseId, lessonId, true, score);
      
      // Show progression feedback
      if (progressionResult?.levelUp) {
        toast({
          title: "🎉 LEVEL UP!",
          description: `You reached level ${progressionResult.newLevel}! +${progressionResult.xpAwarded} XP`,
          status: "success",
          duration: 8000,
          isClosable: true,
          position: "top-right"
        });
      }
      
      if (progressionResult?.newAchievements?.length > 0) {
        progressionResult.newAchievements.forEach(achievement => {
          toast({
            title: "🏆 Achievement Unlocked!",
            description: achievement.achievement_key.replace('_', ' ').toUpperCase(),
            status: "success",
            duration: 6000,
            isClosable: true,
            position: "top-right"
          });
        });
      }
      
    } catch (error) {
      console.error('Error awarding lesson XP:', error);
      // Still update course progress even if XP fails
      updateLessonProgress(courseId, lessonId, true, score);
    }
    
    setLessonCompleted(true);
    
    // Show success toast
    toast({
      title: "Lesson completed!",
      description: `You've earned ${score} points${achievements.length > 0 ? ' and unlocked achievements!' : '!'}`,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-right"
    });
    
    // Enable next lesson navigation
    setNextEnabled(true);
  };
  
  // Handle quiz completion
  const handleQuizComplete = (results) => {
    console.log('Quiz completed:', results);
    
    setQuizCompleted(true);
    
    // Add quiz score to the lesson completion stats
    if (results && results.success) {
      // Only update progress if the quiz was successful
      const score = results.score || 0;
      const additionalScore = Math.min(score, 1000); // Cap the score addition at 1000 points
      let achievements = [];
      
      // If extremely high score or perfect accuracy, grant achievement
      if (score > 800 || results.correctPlacements === results.totalBlocks) {
        achievements.push({ 
          type: 'quiz_master', 
          title: 'QUIZ MASTER',
          description: 'Mastered the code arrangement challenge!' 
        });
        
        // Add achievement to course
        addCourseAchievement(courseId, 'quiz_master');
      }
      
      // Set achievements for display
      setGameAchievements(achievements);
      
      // Show confetti for successful quiz completion
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      // Success toast
      toast({
        title: "Quiz completed successfully!",
        description: `You earned ${additionalScore} points from the quiz${achievements.length > 0 ? ' and unlocked an achievement!' : '!'}`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });

      // If quiz was successful, set quiz data in case user wants to try again
      setQuizData(results);
      
      // Update progress with the additional score
      updateLessonProgress(courseId, lessonId, true, additionalScore);
      setLessonCompleted(true);
      setNextEnabled(true);
    } else {
      // If quiz failed, show feedback but don't enable next lesson
      toast({
        title: "Quiz needs more work",
        description: results && results.score > 0 
          ? `You earned ${results.score} points but need to reach a higher score to pass.` 
          : "Try the quiz again when you're ready to move on.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right"
      });
    }
  };

  const getNextLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    return currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;
  };

  const getPrevLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === lessonId);
    return currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  };

  const calculateCourseProgress = () => {
    if (allLessons.length === 0) return 0;
    return Math.round((progress.completedLessons.length / allLessons.length) * 100);
  };

  const renderLessonContent = () => {
    if (!lesson) return null;

    const contentData = lesson.content_data || {};

    switch (lesson.content_type) {
      case 'text':
        return (
          <Box
            bg="#111"
            border="1px solid #333"
            borderRadius="8px"
            p={6}
            maxW="800px"
            mx="auto"
          >
            <ChakraText fontSize="lg" color="#00ff00" fontWeight="bold" mb={4}>
              📖 {lesson.title}
            </ChakraText>
            <VStack spacing={4} align="start">
              <ChakraText color="#ccc" lineHeight="1.6">
                {contentData.content || "This is a text-based lesson. The content would be loaded from the database."}
              </ChakraText>

              {contentData.code_example && (
                  <InteractiveCodeExample
                    code={contentData.code_example || "// No code example available"}
                    language={(contentData.language || course?.language || 'csharp')}
                    mode={
                      contentData.interactive && 
                      !((contentData.language || course?.language) === "csharp" && 
                        (contentData.execution_environment === "unity" || contentData.is_unity_code || 
                         (contentData.code_title && contentData.code_title.toLowerCase().includes("unity"))))
                      ? "playground" 
                      : "annotated"
                    }
                    title={contentData.code_title || "Code Example"}
                    annotations={[
                      {
                        text: "void Start()",
                        title: "Unity Lifecycle Method",
                        explanation: "The Start method is called once when the script is enabled before any Update methods are called."
                      },
                      {
                        text: "transform.position",
                        title: "Transform Property",
                        explanation: "Gets or sets the position of the GameObject in world space coordinates (X, Y, Z)."
                      },
                      {
                        text: "GetComponent<Rigidbody>()",
                        title: "Component Access",
                        explanation: "Retrieves the Rigidbody component attached to the same GameObject."
                      }
                    ]}
                    onExecutionComplete={
                      contentData.interactive ? (result) => {
                        if (result && result.success) {
                          handleLessonComplete({
                            score: 50,
                            accuracy: 100,
                            wpm: 0,
                            executionSuccess: true
                          });
                        }
                      } : null
                    }
                  />
              )}

              {contentData.concepts && contentData.concepts.length > 0 && (
                <VStack spacing={3} align="start" w="100%">
                  <ChakraText fontSize="md" color="#00ff00" fontWeight="bold" mt={2}>
                    🧩 Key Concepts
                  </ChakraText>
                  {contentData.concepts.map((concept, idx) => (
                    <ConceptExplainer key={idx} concept={concept} />
                  ))}
                </VStack>
              )}
              
              {/* Enhanced Code Example with rich hover effects - ideal for Unity code */}
              {contentData.unity_code_example && (
                <Box mt={4}>
                  <EnhancedCodeExample 
                    code={contentData.unity_code_example} 
                    language="csharp" 
                    title={contentData.unity_code_title || "Unity C# Example"}
                  />
                </Box>
              )}

              {contentData.extra_concepts && contentData.extra_concepts.length > 0 && (
                <VStack spacing={3} align="start" w="100%">
                  <ChakraText fontSize="md" color="#00ff00" fontWeight="bold" mt={2}>
                    🧩 Key Concepts
                  </ChakraText>
                  {contentData.concepts.map((concept, idx) => (
                    <ConceptExplainer key={idx} concept={concept} />
                  ))}
                </VStack>
              )}

              <Button
                bg="#00ff00"
                color="#000"
                onClick={handleLessonComplete}
                fontFamily="'Courier New', monospace"
                disabled={lessonCompleted}
              >
                {lessonCompleted ? "✓ Completed" : "Mark as Complete"}
              </Button>
            </VStack>
          </Box>
        );

      case 'typing_challenge':
        return (
          <Box w="100%" h="100%">
            <TypingChallenge
              challenge={{
                id: `lesson-${lesson.id}`,
                title: contentData.execution_environment === "unity" || course?.language === "csharp" 
                  ? `Unity C# Challenge: ${lesson.title}` 
                  : lesson.title,
                description: contentData.execution_environment === "unity" 
                  ? "Learn Unity C# syntax through typing practice" 
                  : "Type the code accurately to complete this lesson",
                code: contentData.code || `function greet(name) {\n    console.log("Hello, " + name + "!");\n}\n\ngreet("World");`,
                language: contentData.language || course.language,
                difficulty: contentData.difficulty || course.difficulty
              }}
              currentLevel={1}
              onComplete={handleLessonComplete}
              isActive={true}
              fullScreen={true}
            />
          </Box>
        );

      case 'code_exercise':
        return (
          <Box w="100%" h="100%">
            <VStack spacing={4} h="100%">
              <Box
                bg="#111"
                border="1px solid #333"
                borderRadius="8px"
                p={4}
                w="100%"
                flexShrink={0}
              >
                <ChakraText fontSize="lg" color="#00ff00" fontWeight="bold" mb={2}>
                  💻 {lesson.title}
                </ChakraText>
                <ChakraText color="#ccc" fontSize="sm">
                  {contentData.instructions || "Complete the coding exercise below. Test your code to verify it works correctly."}
                </ChakraText>
              </Box>
              
              <Box flex={1} w="100%">
                <CodeEditorPage 
                  initialCode={contentData.starter_code || "// Write your code here"}
                  language={contentData.language || course.language}
                  onCodeExecuted={(result) => {
                    if (!result.error) {
                      handleLessonComplete({ score: 100 });
                    }
                  }}
                />
              </Box>
            </VStack>
          </Box>
        );

      case 'video':
        return (
          <Box
            bg="#111"
            border="1px solid #333"
            borderRadius="8px"
            p={6}
            maxW="800px"
            mx="auto"
          >
            <ChakraText fontSize="lg" color="#00ff00" fontWeight="bold" mb={4}>
              🎥 {lesson.title}
            </ChakraText>
            <Box
              bg="#000"
              border="1px solid #444"
              borderRadius="8px"
              p={8}
              textAlign="center"
              color="#666"
              mb={4}
            >
              <ChakraText mb={2}>Video Player</ChakraText>
              <ChakraText fontSize="sm">Video URL: {contentData.video_url || "No video URL specified"}</ChakraText>
            </Box>
            <Button
              bg="#00ff00"
              color="#000"
              onClick={handleLessonComplete}
              fontFamily="'Courier New', monospace"
              disabled={lessonCompleted}
            >
              {lessonCompleted ? "✓ Completed" : "Mark as Complete"}
            </Button>
          </Box>
        );

      case 'quiz':
        return (
          <Box
            bg="#111"
            border="1px solid #333"
            borderRadius="8px"
            p={6}
            maxW="800px"
            mx="auto"
          >
            <ChakraText fontSize="lg" color="#00ff00" fontWeight="bold" mb={4}>
              📝 {lesson.title}
            </ChakraText>
            <ChakraText color="#ccc" mb={4}>
              Quiz functionality will be implemented here.
            </ChakraText>
            <Button
              bg="#00ff00"
              color="#000"
              onClick={handleLessonComplete}
              fontFamily="'Courier New', monospace"
              disabled={lessonCompleted}
            >
              {lessonCompleted ? "✓ Completed" : "Complete Quiz"}
            </Button>
          </Box>
        );

      default:
        return (
          <Box textAlign="center" p={8}>
            <ChakraText color="#ff6b6b">Unknown lesson type: {lesson.content_type}</ChakraText>
          </Box>
        );
    }
  };

  if (loading) {
    return (
      <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center" bg="#000">
        <VStack spacing={4}>
          <MotionBox
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            color="#00ff00"
            fontSize="3xl"
          >
            ⚡
          </MotionBox>
          <ChakraText color="#00ff00" fontFamily="'Courier New', monospace">
            Loading Lesson...
          </ChakraText>
        </VStack>
      </Box>
    );
  }

  const nextLesson = getNextLesson();
  const prevLesson = getPrevLesson();
  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);

  return (
    <Box w="100%" h="100%" overflow="hidden" display="flex" flexDirection="column" bg="#000">
      {/* Lesson Header */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        bg="#111" 
        borderBottom="1px solid #333" 
        p={4}
        flexShrink={0}
      >
        <VStack spacing={3} maxW="1200px" mx="auto">
          <HStack w="100%" justify="space-between" align="center">
            <HStack spacing={3}>
              <Button 
                size="sm" 
                bg="#333" 
                color="#ccc" 
                onClick={() => navigate(`/modules/${courseId}`)}
                fontFamily="'Courier New', monospace"
              >
                ← {course?.title}
              </Button>
              
              <ChakraText color="#666" fontSize="sm">
                Lesson {currentLessonIndex + 1} of {allLessons.length}
              </ChakraText>
            </HStack>

            <HStack spacing={4}>
              <VStack spacing={0} align="end">
                <ChakraText fontSize="sm" color="#666">Course Progress</ChakraText>
                <ChakraText fontSize="sm" color="#ffd93d" fontWeight="bold">
                  {calculateCourseProgress()}% Complete
                </ChakraText>
              </VStack>
              
              <Box w="150px">
                <Progress 
                  value={calculateCourseProgress()} 
                  bg="#333" 
                  borderRadius="2px"
                  h="6px"
                  sx={{
                    '& > div': {
                      bg: 'linear-gradient(90deg, #ffd93d, #ffed4e)',
                    }
                  }}
                />
              </Box>
            </HStack>
          </HStack>
        </VStack>
      </MotionBox>

      {/* Lesson Content */}
      <Box flex={1} overflow="hidden">
        {lesson?.content_type === 'typing_challenge' || lesson?.content_type === 'code_exercise' ? (
          renderLessonContent()
        ) : (
          <Box h="100%" overflow="auto" p={6}>
            {renderLessonContent()}
            
            {/* Achievement Unlocked Animation */}
            {gameAchievements.length > 0 && (
              <MotionBox
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                position="fixed"
                top="20%"
                left="50%"
                transform="translateX(-50%)"
                bg="#111"
                border="2px solid #ffaa00"
                borderRadius="md"
                p={4}
                zIndex={1000}
                boxShadow="0 0 40px #ffaa00"
                textAlign="center"
                w="300px"
              >
                <MotionBox
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 2, -2, 0],
                    boxShadow: [
                      "0 0 20px #ffaa00",
                      "0 0 40px #ffaa00",
                      "0 0 20px #ffaa00"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <ChakraText fontSize="xl" color="#ffaa00" fontWeight="bold" mb={2}>
                    🏆 Achievement Unlocked!
                  </ChakraText>
                  <ChakraText fontSize="md" color="#00ff00" fontWeight="bold">
                    {gameAchievements[0].title}
                  </ChakraText>
                  <ChakraText fontSize="sm" color="#ccc" mt={1}>
                    {gameAchievements[0].description}
                  </ChakraText>
                </MotionBox>
              </MotionBox>
            )}
            
            {/* Confetti Celebration */}
            {showConfetti && (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                zIndex={900}
                pointerEvents="none"
              >
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      setTimeout(() => {
                        confetti({
                          particleCount: 100,
                          spread: 70,
                          origin: { y: 0.6 },
                          colors: ['#00ff00', '#ffaa00', '#ff6b6b', '#4ecdc4', '#ffd93d']
                        });
                        
                        setTimeout(() => {
                          confetti({
                            particleCount: 50,
                            angle: 60,
                            spread: 70,
                            origin: { x: 0, y: 0.6 }
                          });
                        }, 500);
                        
                        setTimeout(() => {
                          confetti({
                            particleCount: 50,
                            angle: 120,
                            spread: 70,
                            origin: { x: 1, y: 0.6 }
                          });
                        }, 800);
                      }, 300);
                    `
                  }}
                />
              </Box>
            )}
            
            {/* Level Up Animation */}
            {showLevelUp && (
              <MotionBox
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                position="fixed"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                bg="#111"
                border="4px solid #00ff00"
                borderRadius="md"
                p={8}
                zIndex={1000}
                boxShadow="0 0 40px #00ff00"
                textAlign="center"
                w="400px"
                h="300px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                onClick={() => {
                  setShowLevelUp(false);
                  setNextEnabled(true);
                }}
              >
                <MotionBox
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 1, -1, 0],
                    boxShadow: [
                      "0 0 30px #00ff00",
                      "0 0 60px #00ff00",
                      "0 0 30px #00ff00"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity
                  }}
                >
                  <ChakraText fontSize="4xl" color="#00ff00" fontWeight="bold" mb={4}>
                    🎉 LEVEL UP! 🎉
                  </ChakraText>
                  <ChakraText fontSize="xl" color="#ffaa00" mb={6}>
                    Course Completed!
                  </ChakraText>
                  <ChakraText fontSize="md" color="#ccc">
                    You've mastered the fundamentals of {course?.language === 'csharp' ? 'C# in Unity' : course?.language}!
                  </ChakraText>
                  <ChakraText fontSize="sm" color="#ccc" mt={4}>
                    Click anywhere to continue
                  </ChakraText>
                </MotionBox>
              </MotionBox>
            )}
          </Box>
        )}
      </Box>
      
      {/* Quiz Popup */}
      <QuizPopup 
        isOpen={isOpen} 
        onClose={onClose}
        onComplete={handleQuizComplete}
        quizData={quizData}
        lessonTitle={lesson?.title || ""}
      />

      {/* Navigation Footer */}
      <Box 
        bg="#111" 
        borderTop="1px solid #333" 
        p={quizRequired && !quizCompleted && !lessonCompleted ? 5 : 4}
        flexShrink={0}
      >
        <HStack 
          justify="space-between" 
          maxW="1200px" 
          mx="auto" 
          position="relative"
        >
          <Box>
            {prevLesson ? (
              <Button
                bg="#333"
                color="#ccc"
                onClick={() => navigate(`/learn/${courseId}/${prevLesson.id}`)}
                fontFamily="'Courier New', monospace"
                _hover={{ bg: "#444" }}
              >
                ← Previous: {prevLesson.title}
              </Button>
            ) : (
              <Box />
            )}
          </Box>

          <Box>
            {nextLesson ? (
              <Button
                bg={lessonCompleted ? "#00ff00" : "#666"}
                color={nextEnabled ? "#000" : "#ccc"}
                onClick={() => {
                  if (nextEnabled) {
                    navigate(`/learn/${courseId}/${nextLesson.id}`);
                  } else if (quizRequired && !quizCompleted) {
                    // If quiz is required but not completed, remind the user
                    toast({
                      title: "Quiz Required",
                      description: "Please complete the quiz successfully to unlock the next lesson",
                      status: "info",
                      duration: 3000,
                      isClosable: true,
                    });
                    
                    // Reopen quiz if it was previously closed
                    if (quizData) {
                      onOpen();
                    }
                  }
                }}
                fontFamily="'Courier New', monospace" 
                disabled={!nextEnabled}
                _hover={nextEnabled ? { bg: "#00cc00" } : {}}
              >
                Next: {nextLesson.title} →
              </Button>
            ) : nextEnabled ? (
              <Button
                bg="#ff6b6b"
                color="#fff"
                onClick={() => navigate(`/modules/${courseId}`)}
                fontFamily="'Courier New', monospace"
                _hover={{ bg: "#ff8e8e" }}
              >
                🎉 Course Complete!
              </Button>
            ) : (
              <Box />
            )}
          </Box>
          
          {/* Quiz requirement indicator */}
          {quizRequired && !quizCompleted && !lessonCompleted && (
            <MotionBox
              animate={{
                y: [0, -3, 0],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              position="absolute"
              top="-40px"
              left="50%"
              transform="translateX(-50%)"
            >
              <ChakraText color="#ffd93d" fontSize="sm">👉 Quiz required to proceed to next lesson</ChakraText>
            </MotionBox>
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export default LessonPage;