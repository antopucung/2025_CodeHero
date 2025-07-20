/*
  # User Profiles System

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `overall_level` (integer, default 1)
      - `total_xp` (integer, default 0)
      - `xp_to_next_level` (integer, default 100)
      - `best_wpm` (integer, default 0)
      - `best_accuracy` (integer, default 0)
      - `total_challenges_completed` (integer, default 0)
      - `total_lessons_completed` (integer, default 0)
      - `streak_days` (integer, default 0)
      - `longest_streak` (integer, default 0)
      - `community_contributions` (integer, default 0)
      - `mentorship_hours` (integer, default 0)
      - `total_projects_created` (integer, default 0)
      - `language_progress` (jsonb, default '{}')
      - `profile_visibility` (text, default 'public')
      - `last_activity_date` (date, default current_date)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `xp_categories`
      - `id` (uuid, primary key)
      - `category_name` (text, unique)
      - `description` (text)
      - `base_xp_value` (integer, default 10)
      - `is_active` (boolean, default true)

    - `xp_transactions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `category_id` (uuid, foreign key)
      - `xp_amount` (integer)
      - `transaction_type` (text, check constraint)
      - `source_activity` (text)
      - `source_reference` (text)
      - `performance_data` (jsonb, default '{}')
      - `description` (text)
      - `created_at` (timestamptz, default now())

    - `achievement_definitions`
      - `id` (uuid, primary key)
      - `achievement_key` (text, unique)
      - `title` (text)
      - `description` (text)
      - `icon` (text)
      - `color` (text)
      - `rarity` (text, check constraint)
      - `xp_reward` (integer, default 0)
      - `criteria` (jsonb, default '{}')
      - `is_active` (boolean, default true)

    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `achievement_id` (uuid, foreign key)
      - `source_activity` (text)
      - `source_reference` (text)
      - `is_visible` (boolean, default true)
      - `earned_at` (timestamptz, default now())

    - `certification_types`
      - `id` (uuid, primary key)
      - `cert_type_key` (text, unique)
      - `title` (text)
      - `description` (text)
      - `requirements` (jsonb, default '{}')
      - `validity_months` (integer)
      - `is_renewable` (boolean, default false)
      - `is_active` (boolean, default true)

    - `certifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `cert_type_id` (uuid, foreign key)
      - `certificate_number` (text, unique)
      - `verification_hash` (text, unique)
      - `status` (text, check constraint)
      - `issued_at` (timestamptz, default now())
      - `expires_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate

  3. Functions
    - `award_xp` function for XP management
    - `check_and_award_achievements` function
    - `generate_certificate` function
    - `update_updated_at_column` trigger function
*/

-- Create XP Categories table
CREATE TABLE IF NOT EXISTS xp_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_name text UNIQUE NOT NULL,
  description text,
  base_xp_value integer DEFAULT 10 CHECK (base_xp_value >= 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create User Profiles table with comprehensive defaults
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  overall_level integer DEFAULT 1 CHECK (overall_level >= 1),
  total_xp integer DEFAULT 0 CHECK (total_xp >= 0),
  xp_to_next_level integer DEFAULT 100 CHECK (xp_to_next_level >= 0),
  best_wpm integer DEFAULT 0 CHECK (best_wpm >= 0),
  best_accuracy integer DEFAULT 0 CHECK (best_accuracy >= 0 AND best_accuracy <= 100),
  total_challenges_completed integer DEFAULT 0 CHECK (total_challenges_completed >= 0),
  total_lessons_completed integer DEFAULT 0 CHECK (total_lessons_completed >= 0),
  streak_days integer DEFAULT 0 CHECK (streak_days >= 0),
  longest_streak integer DEFAULT 0 CHECK (longest_streak >= 0),
  community_contributions integer DEFAULT 0 CHECK (community_contributions >= 0),
  mentorship_hours integer DEFAULT 0 CHECK (mentorship_hours >= 0),
  total_projects_created integer DEFAULT 0 CHECK (total_projects_created >= 0),
  language_progress jsonb DEFAULT '{}',
  profile_visibility text DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private')),
  last_activity_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create XP Transactions table
CREATE TABLE IF NOT EXISTS xp_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES xp_categories(id),
  xp_amount integer NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('earned', 'bonus', 'penalty', 'adjustment')),
  source_activity text NOT NULL,
  source_reference text,
  performance_data jsonb DEFAULT '{}',
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create Achievement Definitions table
CREATE TABLE IF NOT EXISTS achievement_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_key text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  icon text DEFAULT '🏆',
  color text DEFAULT '#FFD700',
  rarity text DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary', 'mythic')),
  xp_reward integer DEFAULT 0 CHECK (xp_reward >= 0),
  criteria jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create User Achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievement_definitions(id) ON DELETE CASCADE,
  source_activity text,
  source_reference text,
  is_visible boolean DEFAULT true,
  earned_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create Certification Types table
CREATE TABLE IF NOT EXISTS certification_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cert_type_key text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  requirements jsonb DEFAULT '{}',
  validity_months integer,
  is_renewable boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cert_type_id uuid NOT NULL REFERENCES certification_types(id),
  certificate_number text UNIQUE NOT NULL,
  verification_hash text UNIQUE NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked')),
  issued_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievement_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE certification_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create policies for xp_categories (read-only for authenticated users)
CREATE POLICY "Authenticated users can read xp_categories"
  ON xp_categories
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create policies for xp_transactions
CREATE POLICY "Users can read own xp_transactions"
  ON xp_transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own xp_transactions"
  ON xp_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for achievement_definitions (read-only for authenticated users)
CREATE POLICY "Authenticated users can read achievement_definitions"
  ON achievement_definitions
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create policies for user_achievements
CREATE POLICY "Users can read own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for certification_types (read-only for authenticated users)
CREATE POLICY "Authenticated users can read certification_types"
  ON certification_types
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create policies for certifications
CREATE POLICY "Users can read own certifications"
  ON certifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certifications"
  ON certifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create public read policies for profiles with public visibility
CREATE POLICY "Anyone can read public profiles"
  ON user_profiles
  FOR SELECT
  TO public
  USING (profile_visibility = 'public');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_total_xp ON user_profiles(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_created_at ON xp_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_certifications_user_id ON certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_certifications_verification_hash ON certifications(verification_hash);

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER trigger_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_xp_categories_updated_at
  BEFORE UPDATE ON xp_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_achievement_definitions_updated_at
  BEFORE UPDATE ON achievement_definitions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_certification_types_updated_at
  BEFORE UPDATE ON certification_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default XP categories
INSERT INTO xp_categories (category_name, description, base_xp_value) VALUES
  ('lesson_completion', 'XP earned from completing lessons', 50),
  ('typing_challenge', 'XP earned from typing challenges', 30),
  ('code_execution', 'XP earned from successful code execution', 20),
  ('daily_streak', 'XP earned from maintaining daily activity', 15),
  ('achievement_unlock', 'XP earned from unlocking achievements', 100),
  ('community_contribution', 'XP earned from community activities', 25),
  ('course_completion', 'XP earned from completing entire courses', 500)
ON CONFLICT (category_name) DO NOTHING;

-- Insert default achievement definitions
INSERT INTO achievement_definitions (achievement_key, title, description, icon, color, rarity, xp_reward, criteria) VALUES
  ('first_lesson', 'First Steps', 'Complete your first lesson', '🌟', '#4ecdc4', 'common', 50, '{"total_lessons_completed": 1}'),
  ('speed_demon', 'Speed Demon', 'Achieve 60+ WPM typing speed', '⚡', '#ff6b6b', 'legendary', 500, '{"best_wpm": 60}'),
  ('perfectionist', 'Perfectionist', 'Complete a challenge with 100% accuracy', '💎', '#9c27b0', 'epic', 300, '{"best_accuracy": 100}'),
  ('combo_master', 'Combo Master', 'Achieve a 30+ combo in typing challenge', '🔥', '#ffd93d', 'epic', 250, '{"max_combo_achieved": 30}'),
  ('dedicated_learner', 'Dedicated Learner', 'Complete 10 lessons', '📚', '#38a169', 'rare', 200, '{"total_lessons_completed": 10}'),
  ('challenge_champion', 'Challenge Champion', 'Complete 25 typing challenges', '🏆', '#d69e2e', 'rare', 200, '{"total_challenges_completed": 25}'),
  ('streak_warrior', 'Streak Warrior', 'Maintain a 7-day learning streak', '🔥', '#e53e3e', 'epic', 350, '{"longest_streak": 7}'),
  ('community_helper', 'Community Helper', 'Make 10 community contributions', '🤝', '#4ecdc4', 'rare', 300, '{"community_contributions": 10}'),
  ('mentor', 'Mentor', 'Provide 5 hours of mentorship', '👨‍🏫', '#805ad5', 'epic', 400, '{"mentorship_hours": 5}'),
  ('course_master', 'Course Master', 'Complete an entire course', '🎓', '#00ff00', 'legendary', 1000, '{"courses_completed": 1}')
ON CONFLICT (achievement_key) DO NOTHING;

-- Insert default certification types
INSERT INTO certification_types (cert_type_key, title, description, requirements, validity_months, is_renewable) VALUES
  ('typing_proficiency', 'Typing Proficiency Certificate', 'Demonstrates advanced typing skills for programming', '{"best_wpm": 50, "best_accuracy": 95, "total_challenges_completed": 20}', 12, true),
  ('javascript_fundamentals', 'JavaScript Fundamentals Certificate', 'Completion of JavaScript fundamentals course', '{"total_lessons_completed": 15, "language_progress.javascript.level": 5}', 24, true),
  ('csharp_unity_basics', 'C# Unity Basics Certificate', 'Completion of C# Unity basics course', '{"total_lessons_completed": 20, "language_progress.csharp.level": 6}', 24, true),
  ('community_contributor', 'Community Contributor Certificate', 'Recognition for active community participation', '{"community_contributions": 25, "mentorship_hours": 10}', null, false)
ON CONFLICT (cert_type_key) DO NOTHING;

-- Create XP award function
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id uuid,
  p_category_name text,
  p_source_activity text,
  p_source_reference text DEFAULT NULL,
  p_performance_data jsonb DEFAULT '{}',
  p_description text DEFAULT NULL
)
RETURNS TABLE(
  new_xp integer,
  new_level integer,
  level_up boolean,
  transaction_id uuid
) AS $$
DECLARE
  v_category_id uuid;
  v_base_xp integer;
  v_current_profile user_profiles%ROWTYPE;
  v_calculated_xp integer;
  v_new_total_xp integer;
  v_new_level integer;
  v_new_xp_to_next integer;
  v_level_up boolean := false;
  v_transaction_id uuid;
BEGIN
  -- Get category info
  SELECT id, base_xp_value INTO v_category_id, v_base_xp
  FROM xp_categories 
  WHERE category_name = p_category_name AND is_active = true;
  
  IF v_category_id IS NULL THEN
    RAISE EXCEPTION 'Invalid XP category: %', p_category_name;
  END IF;
  
  -- Get current user profile
  SELECT * INTO v_current_profile
  FROM user_profiles 
  WHERE user_id = p_user_id;
  
  IF v_current_profile IS NULL THEN
    RAISE EXCEPTION 'User profile not found: %', p_user_id;
  END IF;
  
  -- Calculate XP amount (base + performance multipliers)
  v_calculated_xp := v_base_xp;
  
  -- Apply performance multipliers if provided
  IF p_performance_data ? 'multiplier' THEN
    v_calculated_xp := ROUND(v_calculated_xp * (p_performance_data->>'multiplier')::numeric);
  END IF;
  
  -- Calculate new totals
  v_new_total_xp := v_current_profile.total_xp + v_calculated_xp;
  
  -- Calculate new level (simple square root progression)
  v_new_level := GREATEST(1, FLOOR(SQRT(v_new_total_xp / 100.0)) + 1);
  
  -- Check if leveled up
  IF v_new_level > v_current_profile.overall_level THEN
    v_level_up := true;
  END IF;
  
  -- Calculate XP to next level
  v_new_xp_to_next := (v_new_level * v_new_level * 100) - v_new_total_xp;
  
  -- Insert XP transaction
  INSERT INTO xp_transactions (
    user_id, category_id, xp_amount, transaction_type,
    source_activity, source_reference, performance_data, description
  ) VALUES (
    p_user_id, v_category_id, v_calculated_xp, 'earned',
    p_source_activity, p_source_reference, p_performance_data, p_description
  ) RETURNING id INTO v_transaction_id;
  
  -- Update user profile
  UPDATE user_profiles SET
    total_xp = v_new_total_xp,
    overall_level = v_new_level,
    xp_to_next_level = v_new_xp_to_next,
    last_activity_date = CURRENT_DATE,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Return results
  RETURN QUERY SELECT 
    v_new_total_xp as new_xp,
    v_new_level as new_level,
    v_level_up as level_up,
    v_transaction_id as transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create achievement checking function
CREATE OR REPLACE FUNCTION check_and_award_achievements(p_user_id uuid)
RETURNS TABLE(
  achievement_key text,
  newly_earned boolean
) AS $$
DECLARE
  v_profile user_profiles%ROWTYPE;
  v_achievement RECORD;
  v_existing_achievement uuid;
  v_criteria_met boolean;
  v_requirement RECORD;
BEGIN
  -- Get user profile
  SELECT * INTO v_profile
  FROM user_profiles 
  WHERE user_id = p_user_id;
  
  IF v_profile IS NULL THEN
    RETURN;
  END IF;
  
  -- Check each active achievement
  FOR v_achievement IN 
    SELECT * FROM achievement_definitions WHERE is_active = true
  LOOP
    -- Check if user already has this achievement
    SELECT id INTO v_existing_achievement
    FROM user_achievements 
    WHERE user_id = p_user_id AND achievement_id = v_achievement.id;
    
    IF v_existing_achievement IS NOT NULL THEN
      -- Already earned, return as existing
      RETURN QUERY SELECT v_achievement.achievement_key, false;
      CONTINUE;
    END IF;
    
    -- Check if criteria are met
    v_criteria_met := true;
    
    -- Check each criterion in the achievement
    FOR v_requirement IN SELECT * FROM jsonb_each_text(v_achievement.criteria)
    LOOP
      CASE v_requirement.key
        WHEN 'total_lessons_completed' THEN
          IF v_profile.total_lessons_completed < v_requirement.value::integer THEN
            v_criteria_met := false;
            EXIT;
          END IF;
        WHEN 'total_challenges_completed' THEN
          IF v_profile.total_challenges_completed < v_requirement.value::integer THEN
            v_criteria_met := false;
            EXIT;
          END IF;
        WHEN 'best_wpm' THEN
          IF v_profile.best_wpm < v_requirement.value::integer THEN
            v_criteria_met := false;
            EXIT;
          END IF;
        WHEN 'best_accuracy' THEN
          IF v_profile.best_accuracy < v_requirement.value::integer THEN
            v_criteria_met := false;
            EXIT;
          END IF;
        WHEN 'longest_streak' THEN
          IF v_profile.longest_streak < v_requirement.value::integer THEN
            v_criteria_met := false;
            EXIT;
          END IF;
        WHEN 'community_contributions' THEN
          IF v_profile.community_contributions < v_requirement.value::integer THEN
            v_criteria_met := false;
            EXIT;
          END IF;
        WHEN 'mentorship_hours' THEN
          IF v_profile.mentorship_hours < v_requirement.value::integer THEN
            v_criteria_met := false;
            EXIT;
          END IF;
        ELSE
          -- Unknown criterion, assume not met
          v_criteria_met := false;
          EXIT;
      END CASE;
    END LOOP;
    
    -- Award achievement if criteria met
    IF v_criteria_met THEN
      INSERT INTO user_achievements (user_id, achievement_id, source_activity)
      VALUES (p_user_id, v_achievement.id, 'auto_check');
      
      RETURN QUERY SELECT v_achievement.achievement_key, true;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;