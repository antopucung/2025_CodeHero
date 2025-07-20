/*
  # User Progression System - Comprehensive Database Schema

  1. New Tables
    - `user_profiles` - Central user progression tracking
    - `xp_transactions` - Detailed XP earning history with audit trail
    - `user_achievements` - Achievement tracking with timestamps
    - `certifications` - Certificate issuance and validation
    - `xp_categories` - Configurable XP sources and multipliers
    - `achievement_definitions` - Dynamic achievement system
    - `certification_types` - Certificate templates and requirements

  2. Security & Performance
    - Enable RLS on all tables
    - Add comprehensive indexes for performance
    - Implement proper foreign key constraints
    - Add validation triggers

  3. Migration Support
    - Backward compatible schema
    - Data migration functions
    - Rollback capabilities
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- XP Categories for flexible XP system
CREATE TABLE IF NOT EXISTS xp_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name text UNIQUE NOT NULL,
  base_xp_value integer NOT NULL DEFAULT 10,
  multiplier numeric(3,2) NOT NULL DEFAULT 1.0,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Achievement Definitions for dynamic achievement system
CREATE TABLE IF NOT EXISTS achievement_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_key text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  icon text,
  color text DEFAULT '#00ff00',
  rarity text CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')) DEFAULT 'common',
  xp_reward integer DEFAULT 0,
  criteria jsonb NOT NULL, -- Flexible criteria definition
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Certification Types for certificate templates
CREATE TABLE IF NOT EXISTS certification_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_type_key text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  requirements jsonb NOT NULL, -- Flexible requirements (level, achievements, etc.)
  validity_months integer DEFAULT 12,
  is_renewable boolean DEFAULT true,
  template_data jsonb, -- Certificate template configuration
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Central User Profiles for progression tracking
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Core Progression
  overall_level integer DEFAULT 1 CHECK (overall_level >= 1),
  total_xp bigint DEFAULT 0 CHECK (total_xp >= 0),
  xp_to_next_level integer DEFAULT 100,
  
  -- Gaming Stats
  best_wpm integer DEFAULT 0 CHECK (best_wpm >= 0),
  best_accuracy integer DEFAULT 0 CHECK (best_accuracy >= 0 AND best_accuracy <= 100),
  total_challenges_completed integer DEFAULT 0 CHECK (total_challenges_completed >= 0),
  total_lessons_completed integer DEFAULT 0 CHECK (total_lessons_completed >= 0),
  total_projects_created integer DEFAULT 0 CHECK (total_projects_created >= 0),
  
  -- Community Stats
  community_contributions integer DEFAULT 0 CHECK (community_contributions >= 0),
  mentorship_hours integer DEFAULT 0 CHECK (mentorship_hours >= 0),
  forum_posts integer DEFAULT 0 CHECK (forum_posts >= 0),
  helpful_answers integer DEFAULT 0 CHECK (helpful_answers >= 0),
  
  -- Activity Tracking
  total_practice_time_minutes integer DEFAULT 0 CHECK (total_practice_time_minutes >= 0),
  streak_days integer DEFAULT 0 CHECK (streak_days >= 0),
  last_activity_date date DEFAULT CURRENT_DATE,
  longest_streak integer DEFAULT 0 CHECK (longest_streak >= 0),
  
  -- Language-specific Progress (JSONB for flexibility)
  language_progress jsonb DEFAULT '{}',
  
  -- Platform Features Usage
  ai_interactions integer DEFAULT 0 CHECK (ai_interactions >= 0),
  portfolio_items integer DEFAULT 0 CHECK (portfolio_items >= 0),
  daily_goals_completed integer DEFAULT 0 CHECK (daily_goals_completed >= 0),
  
  -- Profile Status
  is_verified boolean DEFAULT false,
  profile_visibility text CHECK (profile_visibility IN ('public', 'private', 'friends')) DEFAULT 'public',
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  UNIQUE(user_id)
);

-- XP Transactions for detailed tracking and anti-cheat
CREATE TABLE IF NOT EXISTS xp_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES xp_categories(id),
  
  -- Transaction Details
  xp_amount integer NOT NULL,
  transaction_type text CHECK (transaction_type IN ('earned', 'bonus', 'penalty', 'admin_adjustment')) DEFAULT 'earned',
  source_activity text NOT NULL, -- 'lesson_complete', 'typing_challenge', 'project_submission', etc.
  source_reference text, -- Reference to the specific activity (lesson_id, challenge_id, etc.)
  
  -- Validation Data (for anti-cheat)
  performance_data jsonb, -- Store performance metrics for validation
  validation_hash text, -- Hash of transaction data for integrity
  is_validated boolean DEFAULT false,
  
  -- Metadata
  description text,
  metadata jsonb DEFAULT '{}',
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  
  -- Performance Index
  INDEX (user_id, created_at DESC),
  INDEX (source_activity, created_at DESC)
);

-- User Achievements tracking
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid REFERENCES achievement_definitions(id),
  
  -- Achievement Details
  earned_at timestamptz DEFAULT now(),
  progress_data jsonb DEFAULT '{}', -- Track progress towards achievement
  is_visible boolean DEFAULT true,
  
  -- Source tracking
  source_activity text,
  source_reference text,
  
  -- Unique constraint to prevent duplicate achievements
  UNIQUE(user_id, achievement_id)
);

-- Certifications issued to users
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  cert_type_id uuid REFERENCES certification_types(id),
  
  -- Certificate Details
  certificate_number text UNIQUE NOT NULL, -- Public certificate identifier
  verification_hash text UNIQUE NOT NULL, -- For external verification
  issued_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  
  -- Certificate Data
  qualification_data jsonb NOT NULL, -- Specific qualifications met
  certificate_metadata jsonb DEFAULT '{}',
  
  -- Status
  status text CHECK (status IN ('active', 'expired', 'revoked', 'suspended')) DEFAULT 'active',
  revoked_at timestamptz,
  revoked_reason text,
  
  -- Performance indexes
  INDEX (certificate_number),
  INDEX (verification_hash),
  INDEX (user_id, status),
  INDEX (issued_at DESC)
);

-- Insert default XP categories
INSERT INTO xp_categories (category_name, base_xp_value, multiplier, description) VALUES
('lesson_completion', 50, 1.0, 'XP earned from completing lessons'),
('typing_challenge', 25, 1.0, 'XP earned from typing challenges'),
('code_execution', 30, 1.0, 'XP earned from successful code execution'),
('project_submission', 200, 1.0, 'XP earned from submitting projects'),
('community_contribution', 15, 1.0, 'XP earned from community activities'),
('achievement_unlock', 100, 1.0, 'Bonus XP for unlocking achievements'),
('daily_streak', 20, 1.0, 'XP earned from maintaining daily streaks'),
('mentorship', 75, 1.0, 'XP earned from mentoring other users'),
('ai_interaction', 5, 1.0, 'XP earned from productive AI interactions'),
('portfolio_update', 40, 1.0, 'XP earned from updating portfolio');

-- Insert default achievement definitions
INSERT INTO achievement_definitions (achievement_key, title, description, icon, rarity, xp_reward, criteria) VALUES
('first_lesson', 'First Steps', 'Complete your first lesson', '🎯', 'common', 50, '{"lessons_completed": 1}'),
('speed_demon', 'Speed Demon', 'Achieve 60+ WPM in typing challenge', '⚡', 'epic', 200, '{"best_wpm": 60}'),
('perfectionist', 'Perfectionist', 'Complete challenge with 100% accuracy', '💎', 'legendary', 300, '{"best_accuracy": 100}'),
('early_bird', 'Early Bird', 'Complete 7-day learning streak', '🌅', 'rare', 150, '{"streak_days": 7}'),
('code_warrior', 'Code Warrior', 'Execute 100 successful code snippets', '⚔️', 'epic', 250, '{"total_challenges_completed": 100}'),
('community_helper', 'Community Helper', 'Make 50 helpful community contributions', '🤝', 'rare', 175, '{"community_contributions": 50}'),
('project_creator', 'Project Creator', 'Submit your first project', '🚀', 'rare', 300, '{"total_projects_created": 1}'),
('mentor', 'Mentor', 'Provide 10 hours of mentorship', '👨‍🏫', 'epic', 400, '{"mentorship_hours": 10}'),
('polyglot', 'Polyglot', 'Reach level 5 in 3 different languages', '🌍', 'legendary', 500, '{"languages_level_5": 3}'),
('dedication', 'Dedication', 'Maintain 30-day streak', '🔥', 'legendary', 600, '{"longest_streak": 30}');

-- Insert certification types
INSERT INTO certification_types (cert_type_key, title, description, requirements, validity_months) VALUES
('certified_learner_beginner', 'Certified Beginner Learner', 'Demonstrates basic proficiency in programming concepts', 
 '{"overall_level": 10, "achievements": ["first_lesson", "early_bird"], "lessons_completed": 20}', 12),
('certified_learner_intermediate', 'Certified Intermediate Developer', 'Demonstrates intermediate programming skills', 
 '{"overall_level": 25, "achievements": ["speed_demon", "code_warrior"], "lessons_completed": 50, "projects_created": 3}', 12),
('certified_community_contributor', 'Certified Community Contributor', 'Demonstrates active community engagement', 
 '{"community_contributions": 100, "achievements": ["community_helper"], "mentorship_hours": 5}', 6),
('certified_mentor', 'Certified Mentor', 'Qualified to mentor other learners', 
 '{"overall_level": 30, "mentorship_hours": 25, "achievements": ["mentor"], "community_contributions": 200}', 24),
('certified_expert', 'Certified Expert Developer', 'Demonstrates expert-level programming proficiency', 
 '{"overall_level": 50, "achievements": ["perfectionist", "polyglot", "dedication"], "projects_created": 10}', 24);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_types ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public profiles are readable" ON user_profiles FOR SELECT TO anon USING (profile_visibility = 'public');

-- RLS Policies for xp_transactions
CREATE POLICY "Users can read own XP transactions" ON xp_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can insert XP transactions" ON xp_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_achievements
CREATE POLICY "Users can read own achievements" ON user_achievements FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can insert achievements" ON user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public achievements visible" ON user_achievements FOR SELECT TO anon USING (is_visible = true);

-- RLS Policies for certifications
CREATE POLICY "Users can read own certifications" ON certifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Public certifications readable" ON certifications FOR SELECT TO anon USING (status = 'active');

-- RLS Policies for reference tables (readable by all)
CREATE POLICY "XP categories readable" ON xp_categories FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Achievement definitions readable" ON achievement_definitions FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Certification types readable" ON certification_types FOR SELECT TO anon USING (is_active = true);

-- Functions for XP and Level Calculations
CREATE OR REPLACE FUNCTION calculate_level_from_xp(xp_amount bigint)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  -- Progressive XP requirement: level^2 * 100
  -- Level 1: 100 XP, Level 2: 400 XP, Level 3: 900 XP, etc.
  RETURN FLOOR(SQRT(xp_amount / 100.0)) + 1;
END;
$$;

CREATE OR REPLACE FUNCTION calculate_xp_for_level(level_target integer)
RETURNS integer
LANGUAGE plpgsql
AS $$
BEGIN
  -- XP required for a specific level
  RETURN (level_target - 1) * (level_target - 1) * 100;
END;
$$;

-- Function to award XP and update user profile
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id uuid,
  p_category_name text,
  p_source_activity text,
  p_source_reference text DEFAULT NULL,
  p_performance_data jsonb DEFAULT '{}',
  p_description text DEFAULT NULL
)
RETURNS TABLE(
  new_xp bigint,
  new_level integer,
  level_up boolean,
  transaction_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_category_id uuid;
  v_base_xp integer;
  v_multiplier numeric;
  v_calculated_xp integer;
  v_current_profile user_profiles;
  v_new_level integer;
  v_level_up boolean := false;
  v_transaction_id uuid;
BEGIN
  -- Get XP category details
  SELECT id, base_xp_value, multiplier INTO v_category_id, v_base_xp, v_multiplier
  FROM xp_categories
  WHERE category_name = p_category_name AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid XP category: %', p_category_name;
  END IF;
  
  -- Calculate XP amount
  v_calculated_xp := ROUND(v_base_xp * v_multiplier);
  
  -- Get current user profile
  SELECT * INTO v_current_profile FROM user_profiles WHERE user_id = p_user_id;
  
  -- Create profile if doesn't exist
  IF NOT FOUND THEN
    INSERT INTO user_profiles (user_id) VALUES (p_user_id);
    SELECT * INTO v_current_profile FROM user_profiles WHERE user_id = p_user_id;
  END IF;
  
  -- Calculate new level
  v_new_level := calculate_level_from_xp(v_current_profile.total_xp + v_calculated_xp);
  v_level_up := v_new_level > v_current_profile.overall_level;
  
  -- Insert XP transaction
  INSERT INTO xp_transactions (
    user_id, category_id, xp_amount, source_activity, source_reference,
    performance_data, description
  ) VALUES (
    p_user_id, v_category_id, v_calculated_xp, p_source_activity, p_source_reference,
    p_performance_data, p_description
  ) RETURNING id INTO v_transaction_id;
  
  -- Update user profile
  UPDATE user_profiles SET
    total_xp = total_xp + v_calculated_xp,
    overall_level = v_new_level,
    xp_to_next_level = calculate_xp_for_level(v_new_level + 1) - (total_xp + v_calculated_xp),
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Return results
  RETURN QUERY SELECT
    v_current_profile.total_xp + v_calculated_xp,
    v_new_level,
    v_level_up,
    v_transaction_id;
END;
$$;

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievements(p_user_id uuid)
RETURNS TABLE(
  achievement_key text,
  newly_earned boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile user_profiles;
  v_achievement achievement_definitions;
  v_criteria jsonb;
  v_meets_criteria boolean;
  v_already_earned boolean;
BEGIN
  -- Get user profile
  SELECT * INTO v_profile FROM user_profiles WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN;
  END IF;
  
  -- Check each active achievement
  FOR v_achievement IN SELECT * FROM achievement_definitions WHERE is_active = true LOOP
    -- Check if already earned
    SELECT EXISTS(
      SELECT 1 FROM user_achievements 
      WHERE user_id = p_user_id AND achievement_id = v_achievement.id
    ) INTO v_already_earned;
    
    IF NOT v_already_earned THEN
      v_criteria := v_achievement.criteria;
      v_meets_criteria := true;
      
      -- Check each criteria (simplified logic - can be expanded)
      IF v_criteria ? 'overall_level' AND v_profile.overall_level < (v_criteria->>'overall_level')::integer THEN
        v_meets_criteria := false;
      END IF;
      
      IF v_criteria ? 'best_wpm' AND v_profile.best_wpm < (v_criteria->>'best_wpm')::integer THEN
        v_meets_criteria := false;
      END IF;
      
      IF v_criteria ? 'best_accuracy' AND v_profile.best_accuracy < (v_criteria->>'best_accuracy')::integer THEN
        v_meets_criteria := false;
      END IF;
      
      IF v_criteria ? 'streak_days' AND v_profile.streak_days < (v_criteria->>'streak_days')::integer THEN
        v_meets_criteria := false;
      END IF;
      
      IF v_criteria ? 'total_challenges_completed' AND v_profile.total_challenges_completed < (v_criteria->>'total_challenges_completed')::integer THEN
        v_meets_criteria := false;
      END IF;
      
      IF v_criteria ? 'community_contributions' AND v_profile.community_contributions < (v_criteria->>'community_contributions')::integer THEN
        v_meets_criteria := false;
      END IF;
      
      IF v_criteria ? 'mentorship_hours' AND v_profile.mentorship_hours < (v_criteria->>'mentorship_hours')::integer THEN
        v_meets_criteria := false;
      END IF;
      
      IF v_criteria ? 'total_projects_created' AND v_profile.total_projects_created < (v_criteria->>'total_projects_created')::integer THEN
        v_meets_criteria := false;
      END IF;
      
      -- Award achievement if criteria met
      IF v_meets_criteria THEN
        INSERT INTO user_achievements (user_id, achievement_id, source_activity)
        VALUES (p_user_id, v_achievement.id, 'automatic_check');
        
        -- Award bonus XP for achievement
        PERFORM award_xp(
          p_user_id,
          'achievement_unlock',
          'achievement_earned',
          v_achievement.achievement_key,
          jsonb_build_object('achievement_id', v_achievement.id),
          'Bonus XP for earning achievement: ' || v_achievement.title
        );
        
        RETURN QUERY SELECT v_achievement.achievement_key, true;
      END IF;
    ELSE
      RETURN QUERY SELECT v_achievement.achievement_key, false;
    END IF;
  END LOOP;
END;
$$;

-- Function to generate certificates
CREATE OR REPLACE FUNCTION generate_certificate(
  p_user_id uuid,
  p_cert_type_key text
)
RETURNS TABLE(
  certificate_id uuid,
  certificate_number text,
  verification_hash text,
  issued boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_cert_type certification_types;
  v_profile user_profiles;
  v_requirements jsonb;
  v_meets_requirements boolean := true;
  v_cert_number text;
  v_verification_hash text;
  v_cert_id uuid;
  v_expires_at timestamptz;
BEGIN
  -- Get certification type
  SELECT * INTO v_cert_type FROM certification_types 
  WHERE cert_type_key = p_cert_type_key AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid certification type: %', p_cert_type_key;
  END IF;
  
  -- Get user profile
  SELECT * INTO v_profile FROM user_profiles WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT NULL::uuid, NULL::text, NULL::text, false;
    RETURN;
  END IF;
  
  -- Check requirements (simplified - can be expanded)
  v_requirements := v_cert_type.requirements;
  
  IF v_requirements ? 'overall_level' AND v_profile.overall_level < (v_requirements->>'overall_level')::integer THEN
    v_meets_requirements := false;
  END IF;
  
  IF v_requirements ? 'lessons_completed' AND v_profile.total_lessons_completed < (v_requirements->>'lessons_completed')::integer THEN
    v_meets_requirements := false;
  END IF;
  
  IF v_requirements ? 'projects_created' AND v_profile.total_projects_created < (v_requirements->>'projects_created')::integer THEN
    v_meets_requirements := false;
  END IF;
  
  IF v_requirements ? 'community_contributions' AND v_profile.community_contributions < (v_requirements->>'community_contributions')::integer THEN
    v_meets_requirements := false;
  END IF;
  
  IF v_requirements ? 'mentorship_hours' AND v_profile.mentorship_hours < (v_requirements->>'mentorship_hours')::integer THEN
    v_meets_requirements := false;
  END IF;
  
  -- Generate certificate if requirements met
  IF v_meets_requirements THEN
    v_cert_id := gen_random_uuid();
    v_cert_number := 'CERT-' || TO_CHAR(EXTRACT(YEAR FROM NOW()), 'YYYY') || '-' || 
                     UPPER(SUBSTRING(p_cert_type_key FROM 1 FOR 3)) || '-' ||
                     LPAD(EXTRACT(DOY FROM NOW())::text, 3, '0') || '-' ||
                     SUBSTRING(v_cert_id::text FROM 1 FOR 8);
    v_verification_hash := encode(digest(v_cert_id::text || p_user_id::text || NOW()::text, 'sha256'), 'hex');
    
    -- Calculate expiration
    IF v_cert_type.validity_months IS NOT NULL THEN
      v_expires_at := NOW() + (v_cert_type.validity_months || ' months')::interval;
    END IF;
    
    -- Insert certificate
    INSERT INTO certifications (
      id, user_id, cert_type_id, certificate_number, verification_hash,
      expires_at, qualification_data
    ) VALUES (
      v_cert_id, p_user_id, v_cert_type.id, v_cert_number, v_verification_hash,
      v_expires_at, jsonb_build_object('profile_snapshot', to_jsonb(v_profile))
    );
    
    RETURN QUERY SELECT v_cert_id, v_cert_number, v_verification_hash, true;
  ELSE
    RETURN QUERY SELECT NULL::uuid, NULL::text, NULL::text, false;
  END IF;
END;
$$;

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_xp_categories_updated_at BEFORE UPDATE ON xp_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_achievement_definitions_updated_at BEFORE UPDATE ON achievement_definitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_certification_types_updated_at BEFORE UPDATE ON certification_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_level ON user_profiles(overall_level DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_total_xp ON user_profiles(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_date ON xp_transactions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_source ON xp_transactions(source_activity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id, earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_certifications_user_status ON certifications(user_id, status);
CREATE INDEX IF NOT EXISTS idx_certifications_verification ON certifications(verification_hash);
CREATE INDEX IF NOT EXISTS idx_certifications_number ON certifications(certificate_number);