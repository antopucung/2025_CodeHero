/*
  # Marketplace XP Integration System

  1. New Tables
    - `digital_assets` - Store digital assets for marketplace
    - `user_purchased_assets` - Track user asset purchases  
    - `user_asset_downloads` - Track asset download engagement
    - `user_engagement_events` - Track detailed user engagement

  2. Enhanced XP Categories
    - Add marketplace-related XP categories

  3. Security
    - Enable RLS on all new tables
    - Add policies for secure access
*/

-- Digital Assets Table
CREATE TABLE IF NOT EXISTS digital_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text UNIQUE NOT NULL,
  description text,
  asset_type text NOT NULL CHECK (asset_type IN ('code_template', 'ui_kit', 'sound_pack', 'project_template', '3d_model', 'icon_pack')),
  price numeric NOT NULL DEFAULT 0 CHECK (price >= 0),
  thumbnail_url text,
  download_url text NOT NULL,
  language text,
  compatibility text[] DEFAULT '{}',
  file_size text,
  is_official boolean DEFAULT true,
  creator_id uuid REFERENCES users(id),
  slug text UNIQUE NOT NULL,
  download_count integer DEFAULT 0 CHECK (download_count >= 0),
  purchase_count integer DEFAULT 0 CHECK (purchase_count >= 0),
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User Purchased Assets Table  
CREATE TABLE IF NOT EXISTS user_purchased_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  asset_id uuid REFERENCES digital_assets(id) ON DELETE CASCADE NOT NULL,
  purchase_date timestamptz DEFAULT now(),
  stripe_transaction_id text,
  purchase_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, asset_id)
);

-- User Asset Downloads Table
CREATE TABLE IF NOT EXISTS user_asset_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  asset_id uuid REFERENCES digital_assets(id) ON DELETE CASCADE NOT NULL,
  download_date timestamptz DEFAULT now(),
  ip_address inet,
  user_agent text,
  download_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

-- User Engagement Events Table
CREATE TABLE IF NOT EXISTS user_engagement_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL CHECK (event_type IN (
    'course_enrolled', 'course_purchased', 'lesson_started', 'lesson_completed',
    'course_milestone_25', 'course_milestone_50', 'course_milestone_75', 'course_completed',
    'asset_purchased', 'asset_downloaded', 'asset_project_created', 'asset_showcased',
    'review_submitted', 'community_shared'
  )),
  reference_type text CHECK (reference_type IN ('course', 'lesson', 'asset')),
  reference_id uuid,
  metadata jsonb DEFAULT '{}',
  xp_awarded integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add new XP categories for marketplace activities
INSERT INTO xp_categories (category_name, description, base_xp_value, is_active) VALUES
  ('course_purchase', 'XP for purchasing courses', 200, true),
  ('course_enrollment', 'XP for enrolling in courses', 50, true),
  ('course_milestone', 'XP for course completion milestones', 300, true),
  ('asset_purchase', 'XP for purchasing digital assets', 75, true),
  ('asset_engagement', 'XP for engaging with purchased assets', 25, true),
  ('marketplace_activity', 'General marketplace engagement XP', 100, true)
ON CONFLICT (category_name) DO NOTHING;

-- Enable RLS on all new tables
ALTER TABLE digital_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_purchased_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_asset_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_engagement_events ENABLE ROW LEVEL SECURITY;

-- Digital Assets Policies
CREATE POLICY "Anyone can view published digital assets"
  ON digital_assets
  FOR SELECT
  TO public
  USING (is_published = true);

CREATE POLICY "Creators can manage their assets"
  ON digital_assets
  FOR ALL
  TO authenticated
  USING (creator_id = uid() OR creator_id IS NULL);

-- User Purchased Assets Policies
CREATE POLICY "Users can view their purchased assets"
  ON user_purchased_assets
  FOR SELECT
  TO authenticated
  USING (user_id = uid());

CREATE POLICY "Users can insert their asset purchases"
  ON user_purchased_assets
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = uid());

-- User Asset Downloads Policies
CREATE POLICY "Users can view their download history"
  ON user_asset_downloads
  FOR SELECT
  TO authenticated
  USING (user_id = uid());

CREATE POLICY "Users can record their downloads"
  ON user_asset_downloads
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = uid());

-- User Engagement Events Policies
CREATE POLICY "Users can view their engagement events"
  ON user_engagement_events
  FOR SELECT
  TO authenticated
  USING (user_id = uid());

CREATE POLICY "Users can insert their engagement events"
  ON user_engagement_events
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = uid());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_digital_assets_published ON digital_assets (is_published);
CREATE INDEX IF NOT EXISTS idx_digital_assets_type ON digital_assets (asset_type);
CREATE INDEX IF NOT EXISTS idx_digital_assets_language ON digital_assets (language);
CREATE INDEX IF NOT EXISTS idx_digital_assets_slug ON digital_assets (slug);

CREATE INDEX IF NOT EXISTS idx_user_purchased_assets_user ON user_purchased_assets (user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchased_assets_asset ON user_purchased_assets (asset_id);

CREATE INDEX IF NOT EXISTS idx_user_asset_downloads_user ON user_asset_downloads (user_id);
CREATE INDEX IF NOT EXISTS idx_user_asset_downloads_asset ON user_asset_downloads (asset_id);
CREATE INDEX IF NOT EXISTS idx_user_asset_downloads_date ON user_asset_downloads (download_date);

CREATE INDEX IF NOT EXISTS idx_user_engagement_events_user ON user_engagement_events (user_id);
CREATE INDEX IF NOT EXISTS idx_user_engagement_events_type ON user_engagement_events (event_type);
CREATE INDEX IF NOT EXISTS idx_user_engagement_events_date ON user_engagement_events (created_at);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_digital_assets_updated_at
    BEFORE UPDATE ON digital_assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to award marketplace XP
CREATE OR REPLACE FUNCTION award_marketplace_xp(
  p_user_id uuid,
  p_event_type text,
  p_reference_type text DEFAULT NULL,
  p_reference_id uuid DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}',
  p_custom_xp integer DEFAULT NULL
)
RETURNS TABLE (
  xp_awarded integer,
  new_total_xp integer,
  level_up boolean,
  new_level integer
) AS $$
DECLARE
  v_base_xp integer;
  v_final_xp integer;
  v_category_name text;
  v_old_total_xp integer;
  v_new_total_xp integer;
  v_old_level integer;
  v_new_level integer;
  v_level_up boolean := false;
BEGIN
  -- Determine category and base XP based on event type
  CASE p_event_type
    WHEN 'course_enrolled' THEN
      v_category_name := 'course_enrollment';
      v_base_xp := 50;
    WHEN 'course_purchased' THEN
      v_category_name := 'course_purchase';
      v_base_xp := 200;
    WHEN 'course_milestone_25', 'course_milestone_50', 'course_milestone_75' THEN
      v_category_name := 'course_milestone';
      v_base_xp := CASE p_event_type
        WHEN 'course_milestone_25' THEN 200
        WHEN 'course_milestone_50' THEN 400
        WHEN 'course_milestone_75' THEN 600
      END;
    WHEN 'course_completed' THEN
      v_category_name := 'course_milestone';
      v_base_xp := 1000;
    WHEN 'asset_purchased' THEN
      v_category_name := 'asset_purchase';
      v_base_xp := 75;
    WHEN 'asset_downloaded', 'asset_project_created' THEN
      v_category_name := 'asset_engagement';
      v_base_xp := 25;
    ELSE
      v_category_name := 'marketplace_activity';
      v_base_xp := 50;
  END CASE;

  -- Use custom XP if provided, otherwise use base XP
  v_final_xp := COALESCE(p_custom_xp, v_base_xp);

  -- Get current user profile
  SELECT total_xp, overall_level INTO v_old_total_xp, v_old_level
  FROM user_profiles
  WHERE user_id = p_user_id;

  -- Calculate new totals
  v_new_total_xp := v_old_total_xp + v_final_xp;
  v_new_level := FLOOR(SQRT(v_new_total_xp / 100)) + 1;
  v_level_up := v_new_level > v_old_level;

  -- Record XP transaction
  INSERT INTO xp_transactions (
    user_id,
    category_id,
    xp_amount,
    transaction_type,
    source_activity,
    source_reference,
    performance_data,
    description
  ) SELECT
    p_user_id,
    xc.id,
    v_final_xp,
    'earned',
    p_event_type,
    p_reference_id::text,
    p_metadata,
    'Marketplace activity: ' || p_event_type
  FROM xp_categories xc
  WHERE xc.category_name = v_category_name;

  -- Record engagement event
  INSERT INTO user_engagement_events (
    user_id,
    event_type,
    reference_type,
    reference_id,
    metadata,
    xp_awarded
  ) VALUES (
    p_user_id,
    p_event_type,
    p_reference_type,
    p_reference_id,
    p_metadata,
    v_final_xp
  );

  -- Update user profile
  UPDATE user_profiles SET
    total_xp = v_new_total_xp,
    overall_level = v_new_level,
    xp_to_next_level = (v_new_level * 100) - v_new_total_xp
  WHERE user_id = p_user_id;

  -- Return results
  RETURN QUERY SELECT
    v_final_xp as xp_awarded,
    v_new_total_xp as new_total_xp,
    v_level_up as level_up,
    v_new_level as new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;