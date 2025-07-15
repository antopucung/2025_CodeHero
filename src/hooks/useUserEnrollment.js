import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { supabase } from '../lib/supabase';

export const useUserEnrollment = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user data on mount
  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    fetchUser();
  }, []);

  // Fetch user enrollments from Supabase
  const fetchUserEnrollments = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get user's course progress
      const { data, error: progressError } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (progressError) throw progressError;
      
      // Extract course IDs and progress data
      const courseIds = data.map(entry => entry.course_id);
      
      // Transform progress data
      const progressData = {};
      data.forEach(entry => {
        progressData[entry.course_id] = {
          completedLessons: entry.completed_lessons || [],
          currentLesson: entry.current_lesson_id,
          startedAt: entry.started_at,
          lastAccessedAt: entry.last_accessed_at,
          totalScore: entry.total_score || 0,
          achievements: entry.course_achievements || []
        };
      });
      
      setEnrollments(courseIds);
      setUserProgress(progressData);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserEnrollments();
      
      // Set up subscription for real-time updates
      const channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'user_course_progress',
          filter: `user_id=eq.${user.id}`
        }, () => {
          fetchUserEnrollments();
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const isEnrolled = (courseId) => {
    return enrollments.includes(courseId);
  };

  const enrollInCourse = async (courseId) => {
    if (!user) {
      console.error('User must be logged in to enroll');
      return;
    }
    
    if (!enrollments.includes(courseId)) {
      try {
        // Insert a new user_course_progress record
        const { error } = await supabase
          .from('user_course_progress')
          .insert([{
            user_id: user.id,
            course_id: courseId,
            completed_lessons: [],
            current_lesson_id: null,
            total_score: 0,
            course_achievements: []
          }]);
          
        if (error) throw error;
        
        // Update local state
        await fetchUserEnrollments();
      } catch (err) {
        console.error('Error enrolling in course:', err);
        setError(err.message);
      }
    }
  };

  const updateLessonProgress = async (courseId, lessonId, completed = true, score = 0) => {
    if (!user) {
      console.error('User must be logged in to update progress');
      return;
    }
    
    try {
      // Get current progress data
      const { data, error: fetchError } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Update the progress
      let completedLessons = data.completed_lessons || [];
      if (completed && !completedLessons.includes(lessonId)) {
        completedLessons = [...completedLessons, lessonId];
      }
      
      const { error: updateError } = await supabase
        .from('user_course_progress')
        .update({
          completed_lessons: completedLessons,
          current_lesson_id: lessonId,
          total_score: (data.total_score || 0) + score,
          last_accessed_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('course_id', courseId);
        
      if (updateError) throw updateError;
      
      // Local state will be updated via the subscription
    } catch (err) {
      console.error('Error updating lesson progress:', err);
      setError(err.message);
    }
  };

  const addCourseAchievement = async (courseId, achievement) => {
    if (!user) {
      console.error('User must be logged in to earn achievements');
      return;
    }
    
    try {
      // Get current progress data
      const { data, error: fetchError } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Update achievements
      let achievements = data.course_achievements || [];
      if (!achievements.includes(achievement)) {
        achievements = [...achievements, achievement];
        
        const { error: updateError } = await supabase
          .from('user_course_progress')
          .update({
            course_achievements: achievements,
            last_accessed_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('course_id', courseId);
          
        if (updateError) throw updateError;
      }
    } catch (err) {
      console.error('Error adding course achievement:', err);
      setError(err.message);
    }
  };

  const getCourseProgress = (courseId) => {
    return userProgress[courseId] || {
      completedLessons: [],
      currentLesson: null,
      totalScore: 0,
      achievements: []
    };
  };

  const getEnrolledCourses = async () => {
    if (enrollments.length === 0) return [];
    
    try {
      if (!user) return [];
      
      // Get user's enrolled courses with course data
      const { data, error } = await supabase
        .from('user_course_progress')
        .select('course_id, courses(*)')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Extract course data
      return data.map(entry => entry.courses);
    } catch (err) {
      console.error('Error fetching enrolled courses:', err);
      return [];
    }
  };

  const getCompletionPercentage = (courseId) => {
    const progress = userProgress[courseId];
    if (!progress) return 0;
    
    return progress.completedLessons.length / 7 * 100; // Assuming 7 lessons per course for now
  };

  // Get user achievements across all courses
  const getAllAchievements = () => {
    const allAchievements = [];
    
    Object.values(userProgress).forEach(progress => {
      progress.achievements.forEach(achievement => {
        if (!allAchievements.includes(achievement)) {
          allAchievements.push(achievement);
        }
      });
    });
    
    return allAchievements;
  };
      
  return {
    enrollments,
    userProgress,
    loading,
    error,
    isEnrolled,
    enrollInCourse,
    updateLessonProgress,
    addCourseAchievement,
    getCourseProgress,
    getEnrolledCourses,
    getCompletionPercentage,
    getAllAchievements,
    refreshEnrollments: fetchUserEnrollments
  };
};