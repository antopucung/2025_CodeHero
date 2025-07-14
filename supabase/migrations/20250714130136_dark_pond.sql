/*
  # Learning Platform Schema - Courses and Lessons

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text, unique, not null)
      - `description` (text)
      - `language` (text, not null)
      - `difficulty` (text, not null)
      - `price` (numeric, not null, default 0)
      - `thumbnail_url` (text)
      - `instructor_id` (uuid, references auth.users)
      - `instructor_name` (text)
      - `lessons_count` (integer, default 0)
      - `duration_hours` (numeric, default 0)
      - `rating` (numeric, default 0)
      - `students_count` (integer, default 0)
      - `is_published` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `lessons`
      - `id` (uuid, primary key)
      - `course_id` (uuid, references courses, not null)
      - `title` (text, not null)
      - `content_type` (text, not null)
      - `content_data` (jsonb, not null)
      - `order_index` (integer, not null)
      - `duration_minutes` (integer, default 0)
      - `is_published` (boolean, default false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access to published content
    - Add policies for instructors to manage their own courses
*/

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text UNIQUE NOT NULL,
  description text,
  language text NOT NULL CHECK (language IN ('javascript', 'typescript', 'python', 'java', 'csharp', 'php')),
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  price numeric NOT NULL DEFAULT 0 CHECK (price >= 0),
  thumbnail_url text,
  instructor_id uuid REFERENCES auth.users(id),
  instructor_name text,
  lessons_count integer DEFAULT 0 CHECK (lessons_count >= 0),
  duration_hours numeric DEFAULT 0 CHECK (duration_hours >= 0),
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  students_count integer DEFAULT 0 CHECK (students_count >= 0),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('text', 'video', 'typing_challenge', 'code_exercise', 'quiz')),
  content_data jsonb NOT NULL DEFAULT '{}',
  order_index integer NOT NULL,
  duration_minutes integer DEFAULT 0 CHECK (duration_minutes >= 0),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(course_id, order_index)
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Anyone can view published courses"
  ON courses
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Instructors can view their own courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can create courses"
  ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Instructors can update their own courses"
  ON courses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = instructor_id)
  WITH CHECK (auth.uid() = instructor_id);

CREATE POLICY "Instructors can delete their own courses"
  ON courses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = instructor_id);

-- Lessons policies
CREATE POLICY "Anyone can view lessons of published courses"
  ON lessons
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id 
      AND courses.is_published = true
    )
    AND is_published = true
  );

CREATE POLICY "Instructors can view lessons of their own courses"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id 
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can create lessons for their courses"
  ON lessons
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id 
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can update lessons of their courses"
  ON lessons
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id 
      AND courses.instructor_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id 
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Instructors can delete lessons of their courses"
  ON lessons
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courses 
      WHERE courses.id = lessons.course_id 
      AND courses.instructor_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_language ON courses(language);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON courses(difficulty);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_lessons_course ON lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(course_id, order_index);

-- Function to update lessons_count in courses table
CREATE OR REPLACE FUNCTION update_course_lessons_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE courses 
    SET lessons_count = lessons_count + 1,
        updated_at = now()
    WHERE id = NEW.course_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE courses 
    SET lessons_count = lessons_count - 1,
        updated_at = now()
    WHERE id = OLD.course_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update lessons count
CREATE TRIGGER trigger_update_course_lessons_count
  AFTER INSERT OR DELETE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_course_lessons_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER trigger_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();