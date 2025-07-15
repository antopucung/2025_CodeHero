/*
  # Update lessons for Unity C# course
  
  1. Changes
     - Add execution_environment field to lessons content_data
     - Update example code for Unity C# lessons
*/

UPDATE lessons 
SET content_data = jsonb_set(
  content_data, 
  '{execution_environment}', 
  '"unity"'::jsonb
)
WHERE course_id IN (SELECT id FROM courses WHERE language = 'csharp') 
AND content_data ? 'code_example'
AND (content_data->>'code_title' LIKE '%Unity%' OR content_data->>'content' LIKE '%Unity%');

-- Add specific Unity example code to first lesson
UPDATE lessons
SET content_data = jsonb_set(
  content_data,
  '{code_example}',
  '"using UnityEngine;\n\npublic class PlayerController : MonoBehaviour\n{\n    // Start is called before the first frame update\n    void Start()\n    {\n        Debug.Log(\"Player has awakened!\");\n    }\n\n    // Update is called once per frame\n    void Update()\n    {\n        // This code runs every frame\n    }\n}"'::jsonb
)
WHERE course_id IN (SELECT id FROM courses WHERE language = 'csharp')
AND order_index = 0;