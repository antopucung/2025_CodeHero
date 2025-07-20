// Enhanced Game Progress Hook with Supabase Integration
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { 
  XPService, 
  AchievementService, 
  CertificationService, 
  MigrationService 
} from '../lib/progressionSystem';

const STORAGE_KEY = 'terminal_ide_progress';

export const useProgressionSystem = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [xpHistory, setXpHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [migrationCompleted, setMigrationCompleted] = useState(false);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (err) {
       // Handle auth session missing as normal state (user not authenticated)
       if (err.message === 'Auth session missing!') {
         setUser(null);
         setError(null);
       } else {
         console.error('Error getting user:', err);
         setError(err.message);
       }
      }
    };
    
    getCurrentUser();
  }, []);

  // Load user progression data
  const loadProgressionData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Check if migration is needed
      if (!migrationCompleted) {
        const migrationResult = await MigrationService.migrateLocalStorageProgress(user.id);
        if (migrationResult.success) {
          setMigrationCompleted(true);
        }
      }
      
      // Load user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({ 
            user_id: user.id,
            overall_level: 1,
            total_xp: 0,
            xp_to_next_level: 100,
            best_wpm: 0,
            best_accuracy: 0,
            total_challenges_completed: 0,
            total_lessons_completed: 0,
            streak_days: 0,
            longest_streak: 0,
            community_contributions: 0,
            mentorship_hours: 0,
            total_projects_created: 0,
            language_progress: {},
            profile_visibility: 'public',
            last_activity_date: new Date().toISOString().split('T')[0]
          })
          .select()
          .single();
        
        if (createError) throw createError;
        setProfile(newProfile);
      } else if (profileError) {
        throw profileError;
      } else {
        setProfile(profileData);
      }
      
      // Load achievements
      const userAchievements = await AchievementService.getUserAchievements(user.id);
      setAchievements(userAchievements);
      
      // Load certifications
      const userCertifications = await CertificationService.getUserCertifications(user.id);
      setCertifications(userCertifications);
      
      // Load recent XP history
      // Handle auth session missing as normal state (user not authenticated)
      if (err.message === 'Auth session missing!') {
        setUser(null);
        setError(null);
      } else {
        console.error('Error getting user:', err);
        setError(err.message);
      }
    } finally {
      // Ensure loading is set to false even when not authenticated
      if (!user) {
        setLoading(false);
      }
    }
  }, [user, migrationCompleted]);

  // Load data when user changes
  useEffect(() => {
    if (user) {
      loadProgressionData();
    } else {
      // User not authenticated, stop loading
      setLoading(false);
      setProfile(null);
      setAchievements([]);
      setCertifications([]);
      setXpHistory([]);
      setError(null);
    }
  }, [user, loadProgressionData]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;
    
    const subscription = supabase
      .channel('user-progression')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_profiles',
        filter: `user_id=eq.${user.id}`
      }, () => {
        // Reload data when profile changes
        loadProgressionData();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user, loadProgressionData]);

  /**
   * Award XP for an activity
   * @param {string} category - XP category
   * @param {string} activity - Activity identifier
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Award result
   */
  const awardXP = useCallback(async (category, activity, options = {}) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      const result = await XPService.awardXP(user.id, category, activity, options);
      
      if (result.success) {
        // Show real-time XP notification
        if (typeof window !== 'undefined' && window.showXPGain) {
          window.showXPGain(result.newXP - (profile?.total_xp || 0));
        }
        
        // Reload progression data to reflect changes
        await loadProgressionData();
        
        // Return detailed result for UI feedback
        return {
          success: true,
          xpAwarded: result.newXP - (profile?.total_xp || 0),
          newLevel: result.newLevel,
          levelUp: result.levelUp,
          newAchievements: result.newAchievements || []
        };
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error awarding XP:', err);
      throw err;
    }
  }, [user, profile, loadProgressionData]);

  /**
   * Complete a lesson and award appropriate XP
   * @param {Object} stats - Completion stats
   * @param {string} language - Programming language
   * @param {string} lessonId - Lesson identifier
   * @returns {Promise<Object>} Completion result
   */
  const completeLesson = useCallback(async (stats, language, lessonId) => {
    try {
      // Calculate performance multiplier
      let multiplier = 1.0;
      if (stats.accuracy === 100) multiplier *= 1.5;
      if (stats.wpm > 50) multiplier *= 1.2;
      if (stats.errors === 0) multiplier *= 1.3;
      
      // Update profile statistics
      const updateData = {};
      if (stats.wpm > (profile?.best_wpm || 0)) updateData.best_wpm = stats.wpm;
      if (stats.accuracy > (profile?.best_accuracy || 0)) updateData.best_accuracy = stats.accuracy;
      updateData.total_lessons_completed = (profile?.total_lessons_completed || 0) + 1;
      
      // Update language progress
      const languageProgress = profile?.language_progress || {};
      if (!languageProgress[language]) {
        languageProgress[language] = { level: 1, xp: 0 };
      }
      languageProgress[language].xp += Math.round(50 * multiplier);
      
      // Calculate language level
      const langXP = languageProgress[language].xp;
      languageProgress[language].level = Math.floor(Math.sqrt(langXP / 50)) + 1;
      updateData.language_progress = languageProgress;
      
      // Update profile
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('user_id', user.id);
        
        if (updateError) throw updateError;
      }
      
      // Award XP
      const result = await awardXP('lesson_completion', 'lesson_complete', {
        sourceReference: lessonId,
        performanceData: {
          accuracy: stats.accuracy,
          time_taken: stats.timeElapsed || 60,
          attempts: stats.attempts || 1,
          wpm: stats.wpm || 0,
          language: language,
          multiplier: multiplier
        },
        description: `Completed lesson in ${language} with ${stats.accuracy}% accuracy`
      });
      
      return result;
    } catch (err) {
      console.error('Error completing lesson:', err);
      throw err;
    }
  }, [user, profile, awardXP]);

  /**
   * Complete a typing challenge and award XP
   * @param {Object} stats - Challenge stats
   * @param {string} language - Programming language
   * @param {string} challengeId - Challenge identifier
   * @returns {Promise<Object>} Completion result
   */
  const completeTypingChallenge = useCallback(async (stats, language, challengeId) => {
    try {
      // Calculate performance multiplier
      let multiplier = 1.0;
      if (stats.accuracy >= 95) multiplier *= 1.3;
      if (stats.wpm >= 60) multiplier *= 1.4;
      if (stats.maxCombo >= 20) multiplier *= 1.2;
      
      // Update profile statistics
      const updateData = {};
      if (stats.wpm > (profile?.best_wpm || 0)) updateData.best_wpm = stats.wpm;
      if (stats.accuracy > (profile?.best_accuracy || 0)) updateData.best_accuracy = stats.accuracy;
      updateData.total_challenges_completed = (profile?.total_challenges_completed || 0) + 1;
      
      // Update profile
      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('user_id', user.id);
        
        if (updateError) throw updateError;
      }
      
      // Award XP
      const result = await awardXP('typing_challenge', 'typing_complete', {
        sourceReference: challengeId,
        performanceData: {
          accuracy: stats.accuracy,
          time_taken: stats.timeElapsed || 60,
          attempts: 1,
          wpm: stats.wpm || 0,
          max_combo: stats.maxCombo || 1,
          language: language,
          multiplier: multiplier
        },
        description: `Typing challenge: ${stats.wpm} WPM, ${stats.accuracy}% accuracy`
      });
      
      return result;
    } catch (err) {
      console.error('Error completing typing challenge:', err);
      throw err;
    }
  }, [user, profile, awardXP]);

  /**
   * Execute code successfully and award XP
   * @param {string} language - Programming language
   * @param {Object} executionData - Execution details
   * @returns {Promise<Object>} Execution result
   */
  const completeCodeExecution = useCallback(async (language, executionData) => {
    try {
      // Award XP for successful code execution
      const result = await awardXP('code_execution', 'code_execute', {
        sourceReference: executionData.codeHash || null,
        performanceData: {
          accuracy: 100, // Successful execution
          time_taken: executionData.timeToExecute || 5,
          attempts: executionData.attempts || 1,
          language: language,
          lines_of_code: executionData.linesOfCode || 1
        },
        description: `Successful code execution in ${language}`
      });
      
      return result;
    } catch (err) {
      console.error('Error completing code execution:', err);
      throw err;
    }
  }, [awardXP]);

  /**
   * Update daily activity and streak
   * @returns {Promise<void>}
   */
  const updateDailyActivity = useCallback(async () => {
    if (!user || !profile) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const lastActivity = profile.last_activity_date;
      
      if (lastActivity !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak = 1;
        if (lastActivity === yesterdayStr) {
          // Consecutive day
          newStreak = (profile.streak_days || 0) + 1;
        }
        
        const updateData = {
          last_activity_date: today,
          streak_days: newStreak,
          longest_streak: Math.max(profile.longest_streak || 0, newStreak)
        };
        
        const { error } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('user_id', user.id);
        
        if (error) throw error;
        
        // Award streak XP if streak is maintained
        if (newStreak > 1) {
          await awardXP('daily_streak', 'daily_activity', {
            performanceData: {
              accuracy: 100,
              time_taken: 1,
              attempts: 1,
              streak_length: newStreak
            },
            description: `Daily streak: ${newStreak} days`
          });
        }
      }
    } catch (err) {
      console.error('Error updating daily activity:', err);
    }
  }, [user, profile, awardXP]);

  /**
   * Check for available certifications
   * @returns {Promise<Array>} Available certifications
   */
  const checkAvailableCertifications = useCallback(async () => {
    if (!user) return [];
    
    try {
      const qualifications = await CertificationService.checkQualifications(user.id);
      return qualifications.filter(q => q.qualifies);
    } catch (err) {
      console.error('Error checking certifications:', err);
      return [];
    }
  }, [user]);

  /**
   * Generate a certificate
   * @param {string} certTypeKey - Certification type key
   * @returns {Promise<Object>} Generation result
   */
  const generateCertificate = useCallback(async (certTypeKey) => {
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    try {
      const result = await CertificationService.generateCertificate(user.id, certTypeKey);
      
      if (result.success) {
        // Reload certifications
        const userCertifications = await CertificationService.getUserCertifications(user.id);
        setCertifications(userCertifications);
      }
      
      return result;
    } catch (err) {
      console.error('Error generating certificate:', err);
      throw err;
    }
  }, [user]);

  /**
   * Reset progress (for development/testing)
   * @returns {Promise<void>}
   */
  const resetProgress = useCallback(async () => {
    if (!user) return;
    
    try {
      // Reset user profile
      const { error: resetError } = await supabase
        .from('user_profiles')
        .update({
          overall_level: 1,
          total_xp: 0,
          xp_to_next_level: 100,
          best_wpm: 0,
          best_accuracy: 0,
          total_challenges_completed: 0,
          total_lessons_completed: 0,
          language_progress: {}
        })
        .eq('user_id', user.id);
      
      if (resetError) throw resetError;
      
      // Delete XP transactions
      await supabase
        .from('xp_transactions')
        .delete()
        .eq('user_id', user.id);
      
      // Delete achievements
      await supabase
        .from('user_achievements')
        .delete()
        .eq('user_id', user.id);
      
      // Reload data
      await loadProgressionData();
      
      // Clear localStorage as well
      localStorage.removeItem(STORAGE_KEY);
      
    } catch (err) {
      console.error('Error resetting progress:', err);
      throw err;
    }
  }, [user, loadProgressionData]);

  // Update daily activity on load
  useEffect(() => {
    if (profile && user) {
      updateDailyActivity();
    }
  }, [profile, user, updateDailyActivity]);

  return {
    // State
    user,
    profile,
    achievements,
    certifications,
    xpHistory,
    loading,
    error,
    
    // Actions
    awardXP,
    completeLesson,
    completeTypingChallenge,
    completeCodeExecution,
    updateDailyActivity,
    checkAvailableCertifications,
    generateCertificate,
    resetProgress,
    
    // Utilities
    reload: loadProgressionData
  };
};