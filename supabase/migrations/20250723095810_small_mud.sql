/*
  # Digital Assets System

  1. New Tables
    - `digital_assets`
      - `id` (uuid, primary key)
      - `creator_id` (uuid, foreign key to users)
      - `title` (text, required)
      - `description` (text, optional)
      - `price` (numeric, default 0)
      - `asset_type` (text, required)
      - `thumbnail_url` (text, external URL)
      - `preview_url` (text, external URL for video/demo)
      - `download_url` (text, external URL for file)
      - `gallery_image_urls` (text[], array of external URLs)
      - `related_donation_project_id` (uuid, optional)
      - `related_collaboration_id` (uuid, optional)
      - `is_published` (boolean, default false)
      - `slug` (text, unique URL-friendly identifier)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_purchased_assets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `asset_id` (uuid, foreign key to digital_assets)
      - `purchase_price` (numeric)
      - `purchase_date` (timestamp)
      - `stripe_transaction_id` (text, optional)

    - `user_asset_downloads`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `asset_id` (uuid, foreign key to digital_assets)
      - `download_count` (integer, default 1)
      - `download_date` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public viewing of published assets
    - Add policies for creators to manage their own assets
    - Add policies for users to manage their own purchases and downloads

  3. Indexes
    - Performance indexes for common queries
*/

-- Create digital_assets table
CREATE TABLE IF NOT EXISTS public.digital_assets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    title text NOT NULL,
    description text,
    price numeric DEFAULT 0 NOT NULL CHECK (price >= 0),
    asset_type text NOT NULL CHECK (asset_type IN ('template', 'ui_kit', 'code_snippet', '3d_model', 'tutorial_pack', 'icon_pack', 'font_pack', 'design_system', 'component_library', 'plugin', 'extension', 'other')),
    thumbnail_url text,
    preview_url text,
    download_url text NOT NULL,
    gallery_image_urls text[] DEFAULT '{}',
    related_donation_project_id uuid,
    related_collaboration_id uuid,
    is_published boolean DEFAULT false NOT NULL,
    slug text UNIQUE NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    
    -- Add tags for better categorization
    tags text[] DEFAULT '{}',
    
    -- Add rating system
    rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    downloads_count integer DEFAULT 0 CHECK (downloads_count >= 0),
    
    -- Add file information
    file_size_mb numeric,
    file_format text,
    
    -- Add compatibility information
    compatible_with text[] DEFAULT '{}' -- e.g., ['React', 'Vue', 'Angular']
);

-- Create user_purchased_assets table
CREATE TABLE IF NOT EXISTS public.user_purchased_assets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    asset_id uuid NOT NULL REFERENCES public.digital_assets(id) ON DELETE CASCADE,
    purchase_price numeric NOT NULL CHECK (purchase_price >= 0),
    purchase_date timestamp with time zone DEFAULT now(),
    stripe_transaction_id text,
    
    -- Ensure unique purchase per user per asset
    UNIQUE(user_id, asset_id)
);

-- Create user_asset_downloads table
CREATE TABLE IF NOT EXISTS public.user_asset_downloads (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    asset_id uuid NOT NULL REFERENCES public.digital_assets(id) ON DELETE CASCADE,
    download_count integer DEFAULT 1 CHECK (download_count > 0),
    download_date timestamp with time zone DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_digital_assets_creator_id ON public.digital_assets (creator_id);
CREATE INDEX IF NOT EXISTS idx_digital_assets_is_published ON public.digital_assets (is_published);
CREATE INDEX IF NOT EXISTS idx_digital_assets_asset_type ON public.digital_assets (asset_type);
CREATE INDEX IF NOT EXISTS idx_digital_assets_price ON public.digital_assets (price);
CREATE INDEX IF NOT EXISTS idx_digital_assets_rating ON public.digital_assets (rating DESC);
CREATE INDEX IF NOT EXISTS idx_digital_assets_downloads ON public.digital_assets (downloads_count DESC);
CREATE INDEX IF NOT EXISTS idx_digital_assets_created_at ON public.digital_assets (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_digital_assets_slug ON public.digital_assets (slug);

CREATE INDEX IF NOT EXISTS idx_user_purchased_assets_user_id ON public.user_purchased_assets (user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchased_assets_asset_id ON public.user_purchased_assets (asset_id);
CREATE INDEX IF NOT EXISTS idx_user_purchased_assets_purchase_date ON public.user_purchased_assets (purchase_date DESC);

CREATE INDEX IF NOT EXISTS idx_user_asset_downloads_user_id ON public.user_asset_downloads (user_id);
CREATE INDEX IF NOT EXISTS idx_user_asset_downloads_asset_id ON public.user_asset_downloads (asset_id);
CREATE INDEX IF NOT EXISTS idx_user_asset_downloads_download_date ON public.user_asset_downloads (download_date DESC);

-- Enable Row Level Security
ALTER TABLE public.digital_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchased_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_asset_downloads ENABLE ROW LEVEL SECURITY;

-- Digital Assets Policies
CREATE POLICY "Anyone can view published assets" ON public.digital_assets
    FOR SELECT USING (is_published = true);

CREATE POLICY "Creators can view their own assets" ON public.digital_assets
    FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Creators can insert their own assets" ON public.digital_assets
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their own assets" ON public.digital_assets
    FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their own assets" ON public.digital_assets
    FOR DELETE USING (auth.uid() = creator_id);

-- User Purchased Assets Policies
CREATE POLICY "Users can view their own purchases" ON public.user_purchased_assets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" ON public.user_purchased_assets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Asset Downloads Policies
CREATE POLICY "Users can view their own downloads" ON public.user_asset_downloads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own downloads" ON public.user_asset_downloads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_digital_assets_updated_at BEFORE UPDATE ON public.digital_assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update downloads count
CREATE OR REPLACE FUNCTION update_asset_downloads_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.digital_assets 
    SET downloads_count = downloads_count + NEW.download_count 
    WHERE id = NEW.asset_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_downloads_count 
    AFTER INSERT ON public.user_asset_downloads
    FOR EACH ROW EXECUTE FUNCTION update_asset_downloads_count();

-- RPC function to award marketplace XP for asset activities
CREATE OR REPLACE FUNCTION award_marketplace_xp(
    p_user_id uuid,
    p_event_type text,
    p_reference_type text DEFAULT 'asset',
    p_reference_id uuid DEFAULT NULL,
    p_metadata jsonb DEFAULT '{}',
    p_custom_xp integer DEFAULT NULL
)
RETURNS TABLE(
    xp_awarded integer,
    level_up boolean,
    new_level integer
) AS $$
DECLARE
    v_xp_amount integer;
    v_current_profile record;
    v_new_level integer;
    v_level_up boolean := false;
BEGIN
    -- Calculate XP based on event type
    v_xp_amount := CASE p_event_type
        WHEN 'asset_purchased' THEN COALESCE(p_custom_xp, 50)
        WHEN 'asset_downloaded' THEN COALESCE(p_custom_xp, 10)
        WHEN 'asset_uploaded' THEN COALESCE(p_custom_xp, 100)
        WHEN 'asset_reviewed' THEN COALESCE(p_custom_xp, 25)
        ELSE COALESCE(p_custom_xp, 10)
    END;
    
    -- Get current user profile
    SELECT * INTO v_current_profile
    FROM user_profiles 
    WHERE user_id = p_user_id;
    
    -- If profile doesn't exist, create it
    IF v_current_profile IS NULL THEN
        INSERT INTO user_profiles (user_id, total_xp)
        VALUES (p_user_id, v_xp_amount)
        ON CONFLICT (user_id) DO UPDATE SET
            total_xp = user_profiles.total_xp + v_xp_amount;
        
        v_new_level := 1;
    ELSE
        -- Update XP
        UPDATE user_profiles 
        SET total_xp = total_xp + v_xp_amount,
            last_activity_date = CURRENT_DATE
        WHERE user_id = p_user_id;
        
        -- Calculate new level (100 XP per level)
        v_new_level := FLOOR((v_current_profile.total_xp + v_xp_amount) / 100) + 1;
        
        -- Check for level up
        IF v_new_level > v_current_profile.overall_level THEN
            v_level_up := true;
            UPDATE user_profiles 
            SET overall_level = v_new_level,
                xp_to_next_level = 100 - ((v_current_profile.total_xp + v_xp_amount) % 100)
            WHERE user_id = p_user_id;
        END IF;
    END IF;
    
    -- Record XP transaction
    INSERT INTO xp_transactions (
        user_id,
        xp_amount,
        transaction_type,
        source_activity,
        source_reference,
        description
    ) VALUES (
        p_user_id,
        v_xp_amount,
        'earned',
        p_event_type,
        p_reference_id::text,
        'Marketplace activity: ' || p_event_type
    );
    
    RETURN QUERY SELECT v_xp_amount, v_level_up, v_new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;