import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'user_enrollments';

export const useUserEnrollment = () => {
  const [enrollments, setEnrollments] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('user_progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem('user_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const isEnrolled = (courseId) => {
    return enrollments.includes(courseId);
  };

  const enrollInCourse = async (courseId) => {
    if (!enrollments.includes(courseId)) {
      setEnrollments(prev => [...prev, courseId]);
      
      // Initialize progress for this course
      setUserProgress(prev => ({
        ...prev,
        [courseId]: {
          completedLessons: [],
          currentLesson: null,
          startedAt: new Date().toISOString(),
          lastAccessedAt: new Date().toISOString(),
          totalScore: 0,
          achievements: []
        }
      }));
    }
  };

  const updateLessonProgress = (courseId, lessonId, completed = true, score = 0) => {
    setUserProgress(prev => {
      const courseProgress = prev[courseId] || {
        completedLessons: [],
        currentLesson: null,
        startedAt: new Date().toISOString(),
        totalScore: 0,
        achievements: []
      };

      const updatedProgress = {
        ...courseProgress,
        lastAccessedAt: new Date().toISOString(),
        totalScore: courseProgress.totalScore + score
      };

      if (completed && !courseProgress.completedLessons.includes(lessonId)) {
        updatedProgress.completedLessons = [...courseProgress.completedLessons, lessonId];
      }

      updatedProgress.currentLesson = lessonId;

      return {
        ...prev,
        [courseId]: updatedProgress
      };
    });
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
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .in('id', enrollments);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      return [];
    }
  };

  return {
    enrollments,
    userProgress,
    isEnrolled,
    enrollInCourse,
    updateLessonProgress,
    getCourseProgress,
    getEnrolledCourses
  };
};