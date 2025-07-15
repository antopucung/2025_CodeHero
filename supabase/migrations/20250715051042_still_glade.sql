/*
  # Create user_course_progress table

  1. New Tables
    - `user_course_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users.id)
      - `course_id` (uuid, foreign key to public.courses.id)
      - `completed_lessons` (uuid[], array of lesson.id values)
      - `current_lesson_id` (uuid, foreign key to public.lessons.id)
      - `total_score` (integer)
      - `started_at` (timestamp with time zone)
      - `last_accessed_at` (timestamp with time zone)
      - `course_achievements` (text[])
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
  2. Security
    - Enable RLS on `user_course_progress` table
    - Add policies for authenticated users to read/write only their own data
  3. Triggers
    - Add trigger to update courses.students_count when a new enrollment is created
*/

-- Create user_course_progress table
CREATE TABLE IF NOT EXISTS user_course_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed_lessons uuid[] NOT NULL DEFAULT '{}',
  current_lesson_id uuid REFERENCES lessons(id) ON DELETE SET NULL,
  total_score integer NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_accessed_at timestamptz NOT NULL DEFAULT now(),
  course_achievements text[] NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS on user_course_progress
ALTER TABLE user_course_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_course_progress
CREATE POLICY "Users can select their own progress data"
  ON user_course_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress data"
  ON user_course_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress data"
  ON user_course_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create a function to update the courses.students_count
CREATE OR REPLACE FUNCTION update_course_students_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courses
  SET students_count = (
    SELECT COUNT(DISTINCT user_id)
    FROM user_course_progress
    WHERE course_id = NEW.course_id
  )
  WHERE id = NEW.course_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update courses.students_count
CREATE TRIGGER trigger_update_course_students_count
AFTER INSERT ON user_course_progress
FOR EACH ROW
EXECUTE FUNCTION update_course_students_count();

-- Create a trigger to update the updated_at column
CREATE TRIGGER trigger_user_course_progress_updated_at
BEFORE UPDATE ON user_course_progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();