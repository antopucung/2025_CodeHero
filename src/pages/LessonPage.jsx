import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Text, VStack, HStack, Button, Progress } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { supabase } from '../lib/supabase';
import { useUserEnrollment } from '../hooks/useUserEnrollment';
import { InteractiveCodeExample } from '../components/learning/InteractiveCodeExample';
import { ConceptExplainer } from '../components/learning/CodeConcepts';
import TypingChallenge from '../components/TypingChallenge';
import CodeEditorPage from './CodeEditorPage';

const MotionBox = motion(Box);

const LessonPage = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  
  const { isEnrolled, updateLessonProgress, getCourseProgress } = useUserEnrollment();
  const enrolled = isEnrolled(courseId);
  const progress = getCourseProgress(courseId);
  const [gameAchievements, setGameAchievements] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    if (!enrolled && lesson && lesson.order_index > 0) {
      // Redirect to course page if not enrolled and trying to access non-preview lesson
      navigate(`/modules/${courseId}`);
      return;
    }
    fetchLessonData();
  }, [courseId, lessonId, enrolled]);

  const fetchLessonData = async () => {
    try {
      setLoading(true);
      
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
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
        .eq('course_id', courseId)
        .order('order_index');
      
      if (allLessonsError) throw allLessonsError;
      
      setCourse(courseData);
      setLesson(lessonData);
      setAllLessons(allLessonsData || []);
      
      // Check if lesson is already completed
      setLessonCompleted(progress.completedLessons.includes(lessonId));
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = (stats = {}) => {
    // Calculate score based on completion stats
    let score = stats.totalScore || stats.score || 0;
    
    // Bonus score for perfect accuracy
    if (stats.accuracy === 100) {
      score += 500;
      setGameAchievements(prev => [...prev, { 
        type: 'perfectionist', 
        title: 'PERFECTIONIST',
        description: 'Completed with 100% accuracy!' 
      }]);
    }
    
    // Bonus for high WPM
    if (stats.wpm >= 60) {
      score += 300;
      setGameAchievements(prev => [...prev, { 
        type: 'speed_racer', 
        title: 'SPEED RACER',
        description: 'Achieved 60+ WPM!' 
      }]);
    }
    
    // Bonus for high combo
    if (stats.maxCombo >= 30) {
      score += 250;
      setGameAchievements(prev => [...prev, { 
        type: 'combo_master', 
        title: 'COMBO MASTER',
        description: 'Reached 30+ combo!' 
      }]);
    }
    
    // Check if user completed the course with this lesson
    const completedCount = progress.completedLessons.length;
    if (!lessonCompleted && completedCount >= allLessons.length - 1) {
      score += 1000; // Bonus for completing the course
      setGameAchievements(prev => [...prev, { 
        type: 'course_master', 
        title: 'COURSE MASTER',
        description: 'Completed the entire course!' 
      }]);
      
      // Show level up animation on course completion
      setShowLevelUp(true);
    }
    
    updateLessonProgress(courseId, lessonId, true, score);
    setLessonCompleted(true);
    
    // If achievements were earned, show them for a few seconds
    if (gameAchievements.length > 0) {
      setTimeout(() => {
        setGameAchievements([]);
      }, 5000);
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
            <Text fontSize="lg" color="#00ff00" fontWeight="bold" mb={4}>
              📖 {lesson.title}
            </Text>
            <VStack spacing={4} align="start">
              <Text color="#ccc" lineHeight="1.6">
                {contentData.content || "This is a text-based lesson. The content would be loaded from the database."}
              </Text>

              {contentData.code_example && (
                <InteractiveCodeExample
                  code={contentData.code_example}
                  language={course?.language || "csharp"}
                  mode={contentData.interactive ? "playground" : "annotated"}
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
                />
              )}

              {contentData.concepts && contentData.concepts.length > 0 && (
                <VStack spacing={3} align="start" w="100%">
                  <Text fontSize="md" color="#00ff00" fontWeight="bold" mt={2}>
                    🧩 Key Concepts
                  </Text>
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
                title: lesson.title,
                description: "Type the code accurately to complete this lesson",
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
                <Text fontSize="lg" color="#00ff00" fontWeight="bold" mb={2}>
                  💻 {lesson.title}
                </Text>
                <Text color="#ccc" fontSize="sm">
                  {contentData.instructions || "Complete the coding exercise below. Test your code to verify it works correctly."}
                </Text>
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
            <Text fontSize="lg" color="#00ff00" fontWeight="bold" mb={4}>
              🎥 {lesson.title}
            </Text>
            <Box
              bg="#000"
              border="1px solid #444"
              borderRadius="8px"
              p={8}
              textAlign="center"
              color="#666"
              mb={4}
            >
              <Text mb={2}>Video Player</Text>
              <Text fontSize="sm">Video URL: {contentData.video_url || "No video URL specified"}</Text>
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
            <Text fontSize="lg" color="#00ff00" fontWeight="bold" mb={4}>
              📝 {lesson.title}
            </Text>
            <Text color="#ccc" mb={4}>
              Quiz functionality will be implemented here.
            </Text>
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
            <Text color="#ff6b6b">Unknown lesson type: {lesson.content_type}</Text>
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
          <Text color="#00ff00" fontFamily="'Courier New', monospace">
            Loading Lesson...
          </Text>
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
      <Box 
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
              
              <Text color="#666" fontSize="sm">
                Lesson {currentLessonIndex + 1} of {allLessons.length}
              </Text>
            </HStack>

            <HStack spacing={4}>
              <VStack spacing={0} align="end">
                <Text fontSize="sm" color="#666">Course Progress</Text>
                <Text fontSize="sm" color="#ffd93d" fontWeight="bold">
                  {calculateCourseProgress()}% Complete
                </Text>
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
      </Box>

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
                boxShadow="0 0 20px #ffaa00"
                textAlign="center"
                w="300px"
              >
                <Text fontSize="xl" color="#ffaa00" fontWeight="bold" mb={2}>
                  🏆 Achievement Unlocked!
                </Text>
                <Text fontSize="md" color="#00ff00" fontWeight="bold">
                  {gameAchievements[0].title}
                </Text>
                <Text fontSize="sm" color="#ccc" mt={1}>
                  {gameAchievements[0].description}
                </Text>
              </MotionBox>
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
                onClick={() => setShowLevelUp(false)}
              >
                <Text fontSize="4xl" color="#00ff00" fontWeight="bold" mb={4}>
                  🎉 LEVEL UP! 🎉
                </Text>
                <Text fontSize="xl" color="#ffaa00" mb={6}>
                  Course Completed!
                </Text>
                <Text fontSize="md" color="#ccc">
                  You've mastered the fundamentals of C# in Unity!
                </Text>
                <Text fontSize="sm" color="#ccc" mt={4}>
                  Click anywhere to continue
                </Text>
              </MotionBox>
            )}
          </Box>
        )}
      </Box>

      {/* Navigation Footer */}
      <Box 
        bg="#111" 
        borderTop="1px solid #333" 
        p={4}
        flexShrink={0}
      >
        <HStack justify="space-between" maxW="1200px" mx="auto">
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
                color={lessonCompleted ? "#000" : "#ccc"}
                onClick={() => {
                  if (lessonCompleted) {
                    navigate(`/learn/${courseId}/${nextLesson.id}`);
                  }
                }}
                fontFamily="'Courier New', monospace"
                disabled={!lessonCompleted}
                _hover={lessonCompleted ? { bg: "#00cc00" } : {}}
              >
                Next: {nextLesson.title} →
              </Button>
            ) : lessonCompleted ? (
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
        </HStack>
      </Box>
    </Box>
  );
};

export default LessonPage;