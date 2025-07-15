/*
  # Migration Tracking System

  1. New Tables
    - `schema_migrations` - Tracks applied migrations to prevent duplicate execution
    
  2. Functions
    - `execute_sql_query` - Safely execute SQL queries with proper permissions
    
  3. Security
    - Limited access to migration functions to authenticated users only
*/

-- Create migration tracking table
CREATE TABLE IF NOT EXISTS public.schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    checksum TEXT,
    description TEXT
);

-- Enable RLS on the migrations table
ALTER TABLE public.schema_migrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow only authenticated users to view migrations
CREATE POLICY "Authenticated users can view migrations" ON public.schema_migrations
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy to allow only authenticated users to insert migrations
CREATE POLICY "Authenticated users can insert migrations" ON public.schema_migrations
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create a function to execute SQL queries safely
-- This allows the migration script to run SQL from the client
CREATE OR REPLACE FUNCTION public.execute_sql_query(query TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER -- This is important to allow the function to execute with the privileges of the function owner
AS $$
BEGIN
    EXECUTE query;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.execute_sql_query(TEXT) TO authenticated;

-- Add custom type to capture migration result
CREATE TYPE public.migration_result AS (
    success BOOLEAN,
    message TEXT
);

-- Create a function to apply a migration safely with tracking
CREATE OR REPLACE FUNCTION public.apply_migration(migration_name TEXT, migration_sql TEXT)
RETURNS public.migration_result
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result public.migration_result;
    checksum_value TEXT;
BEGIN
    -- Calculate checksum
    checksum_value := md5(migration_sql);
    
    -- Check if migration already exists
    IF EXISTS (SELECT 1 FROM public.schema_migrations WHERE version = migration_name) THEN
        SELECT true, 'Migration already applied' INTO result;
        RETURN result;
    END IF;
    
    -- Execute the migration
    BEGIN
        EXECUTE migration_sql;
        
        -- Record successful migration
        INSERT INTO public.schema_migrations (version, checksum, description)
        VALUES (migration_name, checksum_value, 'Applied through apply_migration function');
        
        SELECT true, 'Migration successfully applied' INTO result;
    EXCEPTION WHEN OTHERS THEN
        SELECT false, 'Error applying migration: ' || SQLERRM INTO result;
    END;
    
    RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.apply_migration(TEXT, TEXT) TO authenticated;