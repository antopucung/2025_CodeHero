/*
  # Add slug column to courses table

  1. Changes
    - Add `slug` column to `courses` table for human-readable URLs
    - Update existing courses with appropriate slugs
    - Add unique constraint on slug column

  2. Security
    - No changes to RLS policies needed
*/

-- Add slug column to courses table
ALTER TABLE courses ADD COLUMN slug text UNIQUE;

-- Update existing courses with slugs
UPDATE courses SET slug = 'unity-csharp-101' WHERE title = 'Unity C# Fundamentals';
UPDATE courses SET slug = 'python-beginners' WHERE title = 'Python for Beginners';
UPDATE courses SET slug = 'javascript-mastery' WHERE title = 'JavaScript Mastery';
UPDATE courses SET slug = 'java-fundamentals' WHERE title = 'Java Fundamentals';
UPDATE courses SET slug = 'typescript-advanced' WHERE title = 'TypeScript Advanced';
UPDATE courses SET slug = 'php-web-development' WHERE title = 'PHP Web Development';

-- Make slug column required for new courses
ALTER TABLE courses ALTER COLUMN slug SET NOT NULL;

-- Add index for better performance
CREATE INDEX idx_courses_slug ON courses(slug);