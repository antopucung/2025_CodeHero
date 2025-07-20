// Game Progression System - Core Logic and Utilities
import { supabase } from './supabase';

/**
 * Progression System Configuration
 */
export const PROGRESSION_CONFIG = {
  // XP multipliers for different activities
  XP_MULTIPLIERS: {
    perfect_performance: 2.0,
    high_performance: 1.5,
    standard_performance: 1.0,
    community_bonus: 1.2,
    streak_bonus: 1.3,
    first_time_bonus: 1.5
  },
  
  // Level calculation constants
  LEVEL_CONSTANTS: {
    base_xp: 100,
    exponential_factor: 2.0
  },
  
  // Anti-cheat validation
  VALIDATION: {
    max_xp_per_activity: 1000,
    max_activities_per_hour: 50,
    required_performance_fields: ['accuracy', 'time_taken', 'attempts']
  }
};

/**
 * XP Award Service
 */
export class XPService {
  /**
   * Award XP to a user for an activity
   * @param {string} userId - User UUID
   * @param {string} category - XP category name
   * @param {string} activity - Source activity identifier
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Award result
   */
  static async awardXP(userId, category, activity, options = {}) {
    try {
      const {
        sourceReference = null,
        performanceData = {},
        description = null,
        skipValidation = false
      } = options;
      
      // Validate performance data for anti-cheat
      if (!skipValidation && !this.validatePerformanceData(performanceData, activity)) {
        throw new Error('Invalid performance data - possible cheating detected');
      }
      
      // Call the database function
      const { data, error } = await supabase.rpc('award_xp', {
        p_user_id: userId,
        p_category_name: category,
        p_source_activity: activity,
        p_source_reference: sourceReference,
        p_performance_data: performanceData,
        p_description: description
      });
      
      if (error) throw error;
      
      const result = data[0];
      
      // Check for achievements after XP award
      const achievements = await this.checkAchievements(userId);
      
      return {
        success: true,
        newXP: result.new_xp,
        newLevel: result.new_level,
        levelUp: result.level_up,
        transactionId: result.transaction_id,
        newAchievements: achievements.filter(a => a.newly_earned)
      };
      
    } catch (error) {
      console.error('Error awarding XP:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Validate performance data for anti-cheat
   * @param {Object} performanceData - Performance metrics
   * @param {string} activity - Activity type
   * @returns {boolean} Is valid
   */
  static validatePerformanceData(performanceData, activity) {
    const { VALIDATION } = PROGRESSION_CONFIG;
    
    // Check required fields exist
    const hasRequiredFields = VALIDATION.required_performance_fields.every(
      field => performanceData.hasOwnProperty(field)
    );
    
    if (!hasRequiredFields) return false;
    
    // Validate accuracy range
    if (performanceData.accuracy < 0 || performanceData.accuracy > 100) {
      return false;
    }
    
    // Validate time taken (should be reasonable)
    if (performanceData.time_taken < 1 || performanceData.time_taken > 3600) {
      return false;
    }
    
    // Activity-specific validations
    switch (activity) {
      case 'typing_challenge':
        // WPM should be reasonable (0-200)
        if (performanceData.wpm && (performanceData.wpm < 0 || performanceData.wpm > 200)) {
          return false;
        }
        break;
      case 'lesson_completion':
        // Time should be at least 30 seconds for a lesson
        if (performanceData.time_taken < 30) {
          return false;
        }
        break;
    }
    
    return true;
  }
  
  /**
   * Check and award achievements for a user
   * @param {string} userId - User UUID
   * @returns {Promise<Array>} Achievement results
   */
  static async checkAchievements(userId) {
    try {
      const { data, error } = await supabase.rpc('check_and_award_achievements', {
        p_user_id: userId
      });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }
  
  /**
   * Get user's XP history
   * @param {string} userId - User UUID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} XP transactions
   */
  static async getXPHistory(userId, options = {}) {
    try {
      const { limit = 50, offset = 0, category = null } = options;
      
      let query = supabase
        .from('xp_transactions')
        .select(`
          *,
          xp_categories (
            category_name,
            description
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (category) {
        query = query.eq('xp_categories.category_name', category);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching XP history:', error);
      return [];
    }
  }
}

/**
 * Achievement Service
 */
export class AchievementService {
  /**
   * Get user's achievements
   * @param {string} userId - User UUID
   * @returns {Promise<Array>} User achievements
   */
  static async getUserAchievements(userId) {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement_definitions (
            achievement_key,
            title,
            description,
            icon,
            color,
            rarity,
            xp_reward
          )
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
  }
  
  /**
   * Get all available achievements
   * @returns {Promise<Array>} Achievement definitions
   */
  static async getAllAchievements() {
    try {
      const { data, error } = await supabase
        .from('achievement_definitions')
        .select('*')
        .eq('is_active', true)
        .order('rarity', { ascending: true });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }
  }
  
  /**
   * Get achievement progress for a user
   * @param {string} userId - User UUID
   * @param {string} achievementKey - Achievement identifier
   * @returns {Promise<Object>} Progress data
   */
  static async getAchievementProgress(userId, achievementKey) {
    try {
      // Get user profile for progress calculation
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Get achievement definition
      const { data: achievement, error: achievementError } = await supabase
        .from('achievement_definitions')
        .select('*')
        .eq('achievement_key', achievementKey)
        .single();
      
      if (achievementError) throw achievementError;
      
      // Calculate progress based on criteria
      const criteria = achievement.criteria;
      const progress = {};
      let overallProgress = 0;
      const criteriaCount = Object.keys(criteria).length;
      
      Object.entries(criteria).forEach(([key, requiredValue]) => {
        const currentValue = profile[key] || 0;
        const criteriaProgress = Math.min(currentValue / requiredValue, 1);
        progress[key] = {
          current: currentValue,
          required: requiredValue,
          progress: criteriaProgress,
          completed: criteriaProgress >= 1
        };
        overallProgress += criteriaProgress;
      });
      
      return {
        achievement,
        progress,
        overallProgress: overallProgress / criteriaCount,
        completed: overallProgress === criteriaCount
      };
    } catch (error) {
      console.error('Error calculating achievement progress:', error);
      return null;
    }
  }
}

/**
 * Certification Service
 */
export class CertificationService {
  /**
   * Get user's certifications
   * @param {string} userId - User UUID
   * @returns {Promise<Array>} User certifications
   */
  static async getUserCertifications(userId) {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select(`
          *,
          certification_types (
            cert_type_key,
            title,
            description,
            validity_months,
            is_renewable
          )
        `)
        .eq('user_id', userId)
        .order('issued_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching user certifications:', error);
      return [];
    }
  }
  
  /**
   * Check if user qualifies for certifications
   * @param {string} userId - User UUID
   * @returns {Promise<Array>} Available certifications
   */
  static async checkQualifications(userId) {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (profileError) throw profileError;
      
      // Get all certification types
      const { data: certTypes, error: certError } = await supabase
        .from('certification_types')
        .select('*')
        .eq('is_active', true);
      
      if (certError) throw certError;
      
      // Get existing certifications
      const { data: existing, error: existingError } = await supabase
        .from('certifications')
        .select('cert_type_id')
        .eq('user_id', userId)
        .eq('status', 'active');
      
      if (existingError) throw existingError;
      
      const existingTypeIds = existing.map(cert => cert.cert_type_id);
      
      // Check qualifications for each certification type
      const qualifications = [];
      
      for (const certType of certTypes) {
        if (existingTypeIds.includes(certType.id)) continue;
        
        const requirements = certType.requirements;
        let qualifies = true;
        const unmetRequirements = [];
        
        // Check each requirement
        Object.entries(requirements).forEach(([key, requiredValue]) => {
          const currentValue = profile[key] || 0;
          if (currentValue < requiredValue) {
            qualifies = false;
            unmetRequirements.push({
              requirement: key,
              current: currentValue,
              required: requiredValue
            });
          }
        });
        
        qualifications.push({
          certType,
          qualifies,
          unmetRequirements,
          progress: this.calculateCertificationProgress(profile, requirements)
        });
      }
      
      return qualifications;
    } catch (error) {
      console.error('Error checking qualifications:', error);
      return [];
    }
  }
  
  /**
   * Generate a certificate for a user
   * @param {string} userId - User UUID
   * @param {string} certTypeKey - Certification type key
   * @returns {Promise<Object>} Certificate generation result
   */
  static async generateCertificate(userId, certTypeKey) {
    try {
      const { data, error } = await supabase.rpc('generate_certificate', {
        p_user_id: userId,
        p_cert_type_key: certTypeKey
      });
      
      if (error) throw error;
      
      const result = data[0];
      
      if (result.issued) {
        return {
          success: true,
          certificateId: result.certificate_id,
          certificateNumber: result.certificate_number,
          verificationHash: result.verification_hash
        };
      } else {
        return {
          success: false,
          error: 'Requirements not met for this certification'
        };
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Verify a certificate
   * @param {string} verificationHash - Certificate verification hash
   * @returns {Promise<Object>} Verification result
   */
  static async verifyCertificate(verificationHash) {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select(`
          *,
          certification_types (
            title,
            description
          ),
          user_profiles!inner (
            user_id
          )
        `)
        .eq('verification_hash', verificationHash)
        .eq('status', 'active')
        .single();
      
      if (error) throw error;
      
      return {
        valid: true,
        certificate: data,
        isExpired: data.expires_at ? new Date(data.expires_at) < new Date() : false
      };
    } catch (error) {
      console.error('Error verifying certificate:', error);
      return {
        valid: false,
        error: error.message
      };
    }
  }
  
  /**
   * Calculate certification progress
   * @param {Object} profile - User profile
   * @param {Object} requirements - Certification requirements
   * @returns {number} Progress percentage (0-1)
   */
  static calculateCertificationProgress(profile, requirements) {
    let totalProgress = 0;
    const requirementCount = Object.keys(requirements).length;
    
    Object.entries(requirements).forEach(([key, requiredValue]) => {
      const currentValue = profile[key] || 0;
      const progress = Math.min(currentValue / requiredValue, 1);
      totalProgress += progress;
    });
    
    return totalProgress / requirementCount;
  }
}

/**
 * Migration Service for existing data
 */
export class MigrationService {
  /**
   * Migrate localStorage game progress to Supabase
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Migration result
   */
  static async migrateLocalStorageProgress(userId) {
    try {
      const STORAGE_KEY = 'terminal_ide_progress';
      const localProgress = localStorage.getItem(STORAGE_KEY);
      
      if (!localProgress) {
        return { success: true, message: 'No local progress to migrate' };
      }
      
      const progress = JSON.parse(localProgress);
      
      // Check if user profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingProfile) {
        return { success: true, message: 'Profile already exists, skipping migration' };
      }
      
      // Create user profile with migrated data
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: userId,
          overall_level: progress.level || 1,
          total_xp: progress.xp || 0,
          best_wpm: progress.bestWpm || 0,
          best_accuracy: progress.bestAccuracy || 0,
          total_challenges_completed: progress.totalChallengesCompleted || 0,
          language_progress: progress.languageProgress || {},
          streak_days: progress.dailyStreak || 0,
          last_activity_date: progress.lastPlayDate ? new Date(progress.lastPlayDate) : new Date()
        });
      
      if (insertError) throw insertError;
      
      // Migrate achievements
      if (progress.achievements && progress.achievements.length > 0) {
        for (const achievementKey of progress.achievements) {
          // Get achievement definition
          const { data: achievementDef, error: achievementError } = await supabase
            .from('achievement_definitions')
            .select('id')
            .eq('achievement_key', achievementKey)
            .single();
          
          if (!achievementError && achievementDef) {
            // Insert user achievement
            await supabase
              .from('user_achievements')
              .insert({
                user_id: userId,
                achievement_id: achievementDef.id,
                source_activity: 'migration'
              });
          }
        }
      }
      
      // Clear localStorage after successful migration
      localStorage.removeItem(STORAGE_KEY);
      
      return {
        success: true,
        message: 'Successfully migrated local progress to database'
      };
      
    } catch (error) {
      console.error('Error migrating progress:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

/**
 * Public Profile Service
 */
export class PublicProfileService {
  /**
   * Get public profile data
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} Public profile data
   */
  static async getPublicProfile(userId) {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .eq('profile_visibility', 'public')
        .single();
      
      if (profileError) throw profileError;
      
      // Get user achievements
      const achievements = await AchievementService.getUserAchievements(userId);
      
      // Get user certifications
      const certifications = await CertificationService.getUserCertifications(userId);
      
      // Get recent XP activity (last 10 transactions)
      const recentActivity = await XPService.getXPHistory(userId, { limit: 10 });
      
      return {
        profile,
        achievements: achievements.filter(a => a.is_visible),
        certifications: certifications.filter(c => c.status === 'active'),
        recentActivity,
        stats: {
          rank: await this.getUserRank(userId),
          percentile: await this.getUserPercentile(userId)
        }
      };
    } catch (error) {
      console.error('Error fetching public profile:', error);
      return null;
    }
  }
  
  /**
   * Get user's rank
   * @param {string} userId - User UUID
   * @returns {Promise<number>} User rank
   */
  static async getUserRank(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('profile_visibility', 'public')
        .order('total_xp', { ascending: false });
      
      if (error) throw error;
      
      const rank = data.findIndex(profile => profile.user_id === userId) + 1;
      return rank || null;
    } catch (error) {
      console.error('Error calculating user rank:', error);
      return null;
    }
  }
  
  /**
   * Get user's percentile
   * @param {string} userId - User UUID
   * @returns {Promise<number>} User percentile
   */
  static async getUserPercentile(userId) {
    try {
      const { data: userProfile, error: userError } = await supabase
        .from('user_profiles')
        .select('total_xp')
        .eq('user_id', userId)
        .single();
      
      if (userError) throw userError;
      
      const { count: totalUsers, error: countError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('profile_visibility', 'public');
      
      if (countError) throw countError;
      
      const { count: usersBelow, error: belowError } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('profile_visibility', 'public')
        .lt('total_xp', userProfile.total_xp);
      
      if (belowError) throw belowError;
      
      const percentile = Math.round((usersBelow / totalUsers) * 100);
      return percentile;
    } catch (error) {
      console.error('Error calculating user percentile:', error);
      return null;
    }
  }
}

// Export all services
export default {
  XPService,
  AchievementService,
  CertificationService,
  MigrationService,
  PublicProfileService,
  PROGRESSION_CONFIG
};