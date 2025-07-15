/*
  # Add Quiz Data to Lessons

  1. New Data Structure
    - Adds quiz configuration to text-based lessons with code examples
    - Creates default code-stacking quizzes based on existing code examples

  2. Schema Updates
    - No schema changes required (using existing content_data JSONB field)
    
  3. Data Migration
    - Populates quiz data for applicable lessons
*/

-- Add quiz data to existing text lessons with code examples
DO $$
DECLARE
  lesson_id UUID;
  lesson_title TEXT;
  code_example TEXT;
  course_language TEXT;
  course_difficulty TEXT;
BEGIN
  -- Find lessons that might need quiz data
  FOR lesson_id, lesson_title, code_example, course_language, course_difficulty IN (
    SELECT l.id, l.title, l.content_data->>'code_example', c.language, c.difficulty 
    FROM lessons l
    JOIN courses c ON l.course_id = c.id
    WHERE l.content_type = 'text' 
    AND l.content_data ? 'code_example'
    AND l.content_data->>'code_example' IS NOT NULL
    AND length(l.content_data->>'code_example') > 50
  ) LOOP
    -- Update lessons to include quiz data
    UPDATE lessons
    SET content_data = jsonb_set(
      content_data, 
      '{quiz}', 
      jsonb_build_object(
        'type', 'code-stacking',
        'title', 'Code Challenge: ' || lesson_title,
        'description', 'Arrange the code blocks in the correct order to complete this challenge',
        'code', code_example,
        'language', COALESCE(course_language, 'csharp'),
        'timeLimit', CASE 
          WHEN course_difficulty = 'beginner' THEN 180
          WHEN course_difficulty = 'advanced' THEN 90
          ELSE 120
        END,
        'difficulty', course_difficulty,
        'splitType', 'line',
        'juiciness', 'high',
        'totalBlocks', (SELECT COUNT(*) FROM regexp_split_to_table(code_example, E'\n') AS t(line) WHERE length(trim(line)) > 0)
      ),
      true
    )
    WHERE id = lesson_id;
  END LOOP;
  
  RAISE NOTICE 'Quiz data added to applicable lessons';
END $$;